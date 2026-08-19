import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import WebSocket from 'ws';
import { assertXSplitCdpVersion } from './xsplit-cdp-identity.mjs';

const cdpBase = process.env.XJS_CDP_BASE || 'http://127.0.0.1:9222';
const versionUrl = `${cdpBase}/json/version`;
const listUrl = `${cdpBase}/json/list`;
const targetPrefixes = (
  process.env.XJS_EXTENSION_URL_PREFIXES ||
  ['http://localhost:3999/xsplit-extension/', 'http://127.0.0.1:3999/xsplit-extension/'].join(',')
)
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);
const fallbackTargetPrefixes = (
  process.env.XJS_EXTENSION_FALLBACK_URL_PREFIXES ||
  ['http://localhost:3999/', 'http://127.0.0.1:3999/'].join(',')
)
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);
const allowNavigate = process.env.XJS_EXTENSION_ALLOW_NAVIGATE !== '0';
const artifactRoot = resolve('artifacts/xsplit-cdp');
const artifactName = new Date().toISOString().replace(/[:.]/g, '-');
const artifactDir = resolve(artifactRoot, artifactName);
const artifactRelativeDir = `artifacts/xsplit-cdp/${artifactName}`;
const latestSummaryPath = resolve(artifactRoot, 'latest-summary.json');

let nextId = 1;
const pending = new Map();
const diagnostics = {
  cdp: {},
  console: [],
  exceptions: [],
  failedRequests: [],
  logs: [],
};

async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`GET ${url} failed with ${response.status}`);
  }
  return response.json();
}

function send(socket, method, params = {}) {
  const id = nextId++;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolvePromise, reject) => {
    pending.set(id, { resolve: resolvePromise, reject, method });
  });
}

async function trySend(socket, method, params = {}) {
  try {
    return await send(socket, method, params);
  } catch (error) {
    diagnostics.logs.push({ method, error: error.message });
    return null;
  }
}

async function connect(wsUrl) {
  const socket = new WebSocket(wsUrl);
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const request = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) {
        request.reject(new Error(`${request.method}: ${message.error.message}`));
      } else {
        request.resolve(message.result);
      }
      return;
    }

    if (message.method === 'Runtime.consoleAPICalled') {
      diagnostics.console.push(message.params);
    } else if (message.method === 'Runtime.exceptionThrown') {
      diagnostics.exceptions.push(message.params);
    } else if (message.method === 'Network.loadingFailed') {
      diagnostics.failedRequests.push(message.params);
    } else if (message.method === 'Log.entryAdded') {
      diagnostics.logs.push(message.params.entry);
    }
  });
  await new Promise((resolvePromise, reject) => {
    socket.addEventListener('open', resolvePromise, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
  return socket;
}

async function waitForRegressionSuite(socket, timeoutMs = 10000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const evaluation = await trySend(socket, 'Runtime.evaluate', {
      expression: `typeof window.__runXjsRegressionSuite === 'function'`,
      returnByValue: true,
    });
    if (evaluation?.result?.value === true) {
      return;
    }
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 250));
  }
  throw new Error('Timed out waiting for window.__runXjsRegressionSuite');
}

async function collectPageState(socket) {
  const evaluation = await trySend(socket, 'Runtime.evaluate', {
    expression: `(() => ({
      href: location.href,
      readyState: document.readyState,
      title: document.title,
      runnerType: typeof window.__runXjsRegressionSuite,
      fixtureCount: Array.isArray(window.__xjsComponentFixtures) ? window.__xjsComponentFixtures.length : null,
      scripts: Array.from(document.scripts).map(script => script.src || '[inline]'),
      bodyText: document.body ? document.body.innerText.slice(0, 1000) : null,
    }))()`,
    returnByValue: true,
  });
  return evaluation?.result?.value || null;
}

function clearTransientDiagnostics() {
  diagnostics.console = [];
  diagnostics.exceptions = [];
  diagnostics.failedRequests = [];
  diagnostics.logs = [];
}

function screenshotArtifact(buffer, path) {
  if (!buffer) {
    return null;
  }
  return {
    path,
    bytes: buffer.byteLength,
    sha256: createHash('sha256').update(buffer).digest('hex'),
  };
}

async function captureScreenshot(socket, hasFailures) {
  const screenshot = await trySend(socket, 'Page.captureScreenshot', { format: 'png' });
  const screenshotBuffer = screenshot?.data ? Buffer.from(screenshot.data, 'base64') : null;
  return {
    buffer: screenshotBuffer,
    metadata: {
      screenshot: screenshotArtifact(screenshotBuffer, 'screenshot.png'),
      failureScreenshot: hasFailures ? screenshotArtifact(screenshotBuffer, 'failure.png') : null,
    },
  };
}

async function writeArtifacts(payload, screenshotBuffer, hasFailures) {
  await mkdir(artifactDir, { recursive: true });
  await writeFile(resolve(artifactDir, 'results.json'), JSON.stringify(payload, null, 2));
  if (screenshotBuffer) {
    await writeFile(resolve(artifactDir, 'screenshot.png'), screenshotBuffer);
    if (hasFailures) {
      await writeFile(resolve(artifactDir, 'failure.png'), screenshotBuffer);
    }
  }
  await writeFile(
    latestSummaryPath,
    JSON.stringify(
      {
        runAt: new Date().toISOString(),
        passed: !hasFailures,
        artifactDirectory: artifactRelativeDir,
        resultsPath: `${artifactRelativeDir}/results.json`,
        screenshotPath: screenshotBuffer ? `${artifactRelativeDir}/screenshot.png` : null,
        browser: payload.diagnostics.cdp.version.Browser,
        userAgent: payload.diagnostics.cdp.version['User-Agent'],
        navigateUrl: payload.diagnostics.cdp.navigateUrl || null,
        targetUrl: payload.target?.url || null,
        resultCount: Array.isArray(payload.results) ? payload.results.length : 0,
        failureCount: payload.failures.length,
      },
      null,
      2
    )
  );
}

const version = await getJson(versionUrl);
assertXSplitCdpVersion(version);
const targets = await getJson(listUrl);
diagnostics.cdp = { version, targetPrefixes, fallbackTargetPrefixes };

let navigatedFrom = null;
let target = targets.find(
  (item) => item.type === 'page' && targetPrefixes.some((prefix) => item.url?.startsWith(prefix))
);

if (!target && allowNavigate) {
  target = targets.find(
    (item) =>
      item.type === 'page' &&
      fallbackTargetPrefixes.some((prefix) => item.url === prefix || item.url?.startsWith(prefix))
  );
  navigatedFrom = target?.url || null;
}

if (!target?.webSocketDebuggerUrl) {
  throw new Error(
    `No XSplit extension target found at ${targetPrefixes.join(', ')}. Check ${listUrl}.`
  );
}

const socket = await connect(target.webSocketDebuggerUrl);
await trySend(socket, 'Runtime.enable');
await trySend(socket, 'Log.enable');
await trySend(socket, 'Page.enable');
await trySend(socket, 'Network.enable');

let navigateUrl = null;
if (allowNavigate && navigatedFrom) {
  const baseUrl = new URL(navigatedFrom);
  navigateUrl =
    process.env.XJS_EXTENSION_NAVIGATE_URL || `${baseUrl.origin}/xsplit-extension/index.html`;
} else if (allowNavigate) {
  navigateUrl = process.env.XJS_EXTENSION_NAVIGATE_URL || target.url;
}

if (navigateUrl) {
  diagnostics.cdp.navigatedFrom = navigatedFrom;
  diagnostics.cdp.navigateUrl = navigateUrl;
  await send(socket, 'Page.navigate', { url: navigateUrl });
}

let result = [];
let failures = [];
let hasFailures = false;

try {
  await waitForRegressionSuite(socket);
  clearTransientDiagnostics();

  const evaluation = await send(socket, 'Runtime.evaluate', {
    expression: `window.__runXjsRegressionSuite ? window.__runXjsRegressionSuite() : Promise.reject(new Error('window.__runXjsRegressionSuite is not defined'))`,
    awaitPromise: true,
    returnByValue: true,
  });

  result = evaluation.result?.value;
  failures = Array.isArray(result)
    ? result.filter((item) => item.status !== 'pass')
    : [{ id: 'runner-result', status: 'fail', error: 'Regression suite did not return an array' }];
  hasFailures =
    failures.length > 0 ||
    diagnostics.exceptions.length > 0 ||
    diagnostics.failedRequests.length > 0;
} catch (error) {
  diagnostics.pageState = await collectPageState(socket);
  failures = [
    {
      id: 'runner-bootstrap',
      status: 'fail',
      error: error && error.stack ? error.stack : String(error),
    },
  ];
  result = failures;
  hasFailures = true;
}

const screenshot = await captureScreenshot(socket, hasFailures);
const payload = {
  target,
  diagnostics,
  artifacts: screenshot.metadata,
  results: result,
  failures,
};
await writeArtifacts(payload, screenshot.buffer, hasFailures);
socket.close();

if (hasFailures) {
  console.error(`XSplit CDP regression failed. Artifacts: ${artifactDir}`);
  process.exitCode = 1;
} else {
  console.log(`XSplit CDP regression passed. Artifacts: ${artifactDir}`);
}
