import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../..', import.meta.url);
const index = await readFile(new URL('examples/xsplit-extension/index.html', root), 'utf8');
const config = await readFile(new URL('examples/xsplit-extension/config.html', root), 'utf8');
const runner = await readFile(new URL('examples/xsplit-extension/regression-runner.js', root), 'utf8');
const server = await readFile(new URL('scripts/serve-examples.mjs', root), 'utf8');

assert.match(index, /\.\.\/\.\.\/dist\/xjs\.js/, 'extension should load the CEF browser bundle');
assert.doesNotMatch(index, /@vite\/client/, 'extension must not load Vite HMR client');
assert.match(index, /__runXjsRegressionSuite/, 'extension should expose manual runner hook');
assert.match(config, /xsplit:config-url|XSplit/, 'config page should be XSplit-specific');

for (const check of [
  'xjs.ready resolves',
  'ExtensionWindow.getInstance',
  'App.getVersion',
  'App.getResolution',
  'App.getFrametime',
  'Dialog create/show/close',
  'Scene and source-list subscriptions',
]) {
  assert.match(runner, new RegExp(check.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `missing check: ${check}`);
}

assert.match(server, /3999/, 'examples server should default to port 3999');
assert.match(server, /examples/, 'examples server should serve the examples directory');
