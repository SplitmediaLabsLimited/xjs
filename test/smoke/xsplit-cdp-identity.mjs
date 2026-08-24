import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { assertXSplitCdpVersion } from '../../scripts/xsplit-cdp-identity.mjs';

const xsplitVersion = {
  Browser: 'Chrome/103.0.5060.134',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.134 XSplitBroadcaster/4.6.2605.2109 Safari/537.36',
};

assert.doesNotThrow(() => assertXSplitCdpVersion(xsplitVersion));

assert.throws(
  () =>
    assertXSplitCdpVersion({
      ...xsplitVersion,
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.134 Safari/537.36',
    }),
  /XSplit Broadcaster/
);

assert.throws(
  () => assertXSplitCdpVersion({ ...xsplitVersion, Browser: 'Chrome/104.0.5112.81' }),
  /Chrome\/CEF 103/
);
assert.throws(() => assertXSplitCdpVersion({}), /Chrome\/CEF 103/);

const requests = [];
const server = createServer((request, response) => {
  requests.push(request.url);
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(
    JSON.stringify({
      Browser: 'Chrome/103.0.5060.134',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/103.0.5060.134 Safari/537.36',
    })
  );
});
await new Promise((resolve, reject) => {
  server.once('error', reject);
  server.listen(0, '127.0.0.1', resolve);
});

const address = server.address();
const cdpBase = `http://127.0.0.1:${address.port}`;

async function runScript(path) {
  const child = spawn(process.execPath, [path], {
    cwd: new URL('../..', import.meta.url),
    env: { ...process.env, XJS_CDP_BASE: cdpBase },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  child.stdout.on('data', (chunk) => {
    output += chunk;
  });
  child.stderr.on('data', (chunk) => {
    output += chunk;
  });
  const code = await new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('close', resolve);
  });
  assert.notEqual(code, 0, `${path} should reject ordinary Chrome`);
  assert.match(output, /Expected XSplit Broadcaster/);
}

try {
  await runScript('scripts/xsplit-cdp-runner.mjs');
  await runScript('scripts/xsplit-component-screenshots.mjs');
} finally {
  await new Promise((resolve) => server.close(resolve));
}

assert.deepEqual(requests, ['/json/version', '/json/version']);

console.log('XSplit CDP identity contract passed.');
