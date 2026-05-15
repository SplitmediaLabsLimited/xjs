import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import WebSocket from 'ws';

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
const artifactRoot = resolve('artifacts/component-fixtures');
const artifactName = new Date().toISOString().replace(/[:.]/g, '-');
const artifactDir = resolve(artifactRoot, artifactName);
const artifactRelativeDir = `artifacts/component-fixtures/${artifactName}`;
const fixtureManifestPath = resolve('examples/xsplit-extension/component-fixtures.json');
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

async function loadFixtures() {
  return JSON.parse(await readFile(fixtureManifestPath, 'utf8'));
}

function fileSafe(value) {
  return String(value).replace(/[^a-z0-9-]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase();
}

function artifactMetadata(buffer, path) {
  return {
    path,
    bytes: buffer.byteLength,
    sha256: createHash('sha256').update(buffer).digest('hex'),
  };
}

function getCaptureOrigin(target, navigatedFrom) {
  const explicitUrl = process.env.XJS_EXTENSION_NAVIGATE_URL;
  const candidates = [explicitUrl, target.url, navigatedFrom, 'http://localhost:3999/'].filter(
    Boolean
  );
  for (const candidate of candidates) {
    try {
      const url = new URL(candidate);
      if (url.protocol === 'http:' || url.protocol === 'https:') {
        return url.origin;
      }
    } catch {
      // Ignore non-URL targets reported by CEF, such as chrome-error pages.
    }
  }
  return 'http://localhost:3999';
}

function captureUrlForFixture(origin, fixture) {
  const url = new URL('/xsplit-extension/component-capture.html', origin);
  url.searchParams.set('id', fixture.id);
  return url.toString();
}

async function waitForCapture(socket, fixture, timeoutMs = 10000) {
  const started = Date.now();
  let state = null;
  while (Date.now() - started < timeoutMs) {
    const selector = JSON.stringify(fixture.selector || fixture.customElement);
    const readyAttribute = JSON.stringify(fixture.readyAttribute || null);
    const evaluation = await trySend(socket, 'Runtime.evaluate', {
      expression: `(() => {
        const root = document.getElementById('component-capture');
        const preview = document.getElementById('component-capture-preview');
        const rendered = preview && ${selector} ? preview.querySelector(${selector}) : null;
        const readyAttribute = ${readyAttribute};
        const rect = preview ? preview.getBoundingClientRect() : null;
        return {
          ready: root ? root.getAttribute('data-ready') : null,
          error: root ? root.getAttribute('data-error') : null,
          fixtureId: root ? root.getAttribute('data-fixture-id') : null,
          rendered: Boolean(rendered),
          renderedReadyValue: rendered && readyAttribute
            ? rendered.getAttribute(readyAttribute)
            : null,
          text: preview ? preview.innerText : '',
          rect: rect
            ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
            : null,
        };
      })()`,
      returnByValue: true,
    });
    state = evaluation?.result?.value || null;
    if (state?.error) {
      throw new Error(state.error);
    }
    if (
      state?.ready === 'true' &&
      state.fixtureId === fixture.id &&
      state.rendered &&
      (!fixture.readyAttribute || state.renderedReadyValue === fixture.readyValue)
    ) {
      return state;
    }
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 250));
  }

  throw new Error(
    `Timed out waiting for component capture page: ${JSON.stringify({
      fixture: fixture.id,
      state,
    })}`
  );
}

async function capturePage(socket) {
  const screenshot = await send(socket, 'Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
  });
  return Buffer.from(screenshot.data, 'base64');
}

const [version, targets, fixtures] = await Promise.all([
  getJson(versionUrl),
  getJson(listUrl),
  loadFixtures(),
]);
diagnostics.cdp = { version, targetPrefixes, fallbackTargetPrefixes };

let navigatedFrom = null;
let target = targets.find(
  (item) => item.type === 'page' && targetPrefixes.some((prefix) => item.url?.startsWith(prefix))
);

if (!target) {
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

const captureOrigin = getCaptureOrigin(target, navigatedFrom);
diagnostics.cdp.captureOrigin = captureOrigin;
diagnostics.cdp.navigatedFrom = navigatedFrom;

await mkdir(artifactDir, { recursive: true });

const screenshots = [];
for (const fixture of fixtures) {
  const captureUrl = captureUrlForFixture(captureOrigin, fixture);
  await send(socket, 'Page.navigate', { url: captureUrl });
  const pageState = await waitForCapture(socket, fixture);
  const buffer = await capturePage(socket);
  const fileName = `${fileSafe(fixture.id)}.png`;
  const relativePath = `${artifactRelativeDir}/${fileName}`;
  await writeFile(resolve(artifactDir, fileName), buffer);
  screenshots.push({
    id: fixture.id,
    captureUrl,
    pageState,
    screenshot: artifactMetadata(buffer, relativePath),
  });
}

const summary = {
  runAt: new Date().toISOString(),
  target,
  diagnostics,
  artifactDirectory: artifactRelativeDir,
  fixtureCount: fixtures.length,
  screenshots,
};

await writeFile(resolve(artifactDir, 'summary.json'), JSON.stringify(summary, null, 2));
await writeFile(latestSummaryPath, JSON.stringify(summary, null, 2));
socket.close();

console.log(`Captured ${screenshots.length} component screenshots. Artifacts: ${artifactDir}`);
