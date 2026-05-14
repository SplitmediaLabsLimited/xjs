import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../..', import.meta.url);
const index = await readFile(new URL('examples/xsplit-extension/index.html', root), 'utf8');
const config = await readFile(new URL('examples/xsplit-extension/config.html', root), 'utf8');
const fixtures = await readFile(new URL('examples/xsplit-extension/component-fixtures.js', root), 'utf8');
const runner = await readFile(new URL('examples/xsplit-extension/regression-runner.js', root), 'utf8');
const server = await readFile(new URL('scripts/serve-examples.mjs', root), 'utf8');

assert.match(index, /\.\.\/\.\.\/dist\/xjs\.js/, 'extension should load the CEF browser bundle');
assert.match(index, /\.\.\/\.\.\/docs\/app\/js\/xsplit-navbar\.js/, 'extension should load the real docs navbar component');
assert.match(index, /\.\/component-fixtures\.js/, 'extension should load the component fixture manifest');
assert.match(index, /<xsplit-navbar><\/xsplit-navbar>/, 'extension should render the docs navbar fixture');
assert.doesNotMatch(index, /@vite\/client/, 'extension must not load Vite HMR client');
assert.match(index, /__runXjsRegressionSuite/, 'extension should expose manual runner hook');
assert.match(config, /xsplit:config-url|XSplit/, 'config page should be XSplit-specific');

assert.match(fixtures, /__xjsComponentFixtures/, 'fixture manifest should expose component fixture metadata');
assert.match(fixtures, /xsplit-navbar/, 'fixture manifest should include the docs navbar fixture');
assert.match(fixtures, /data-ready/, 'fixture manifest should record the docs navbar ready attribute');

for (const check of [
  'xjs.ready resolves',
  'ExtensionWindow.getInstance',
  'App.getVersion',
  'App.getResolution',
  'App.getFrametime',
  'Dialog create/show/close',
  'Scene and source-list subscriptions',
  'Docs component fixtures render',
]) {
  assert.match(runner, new RegExp(check.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `missing check: ${check}`);
}

assert.match(runner, /__xjsComponentFixtures/, 'runner should read fixture checks from the manifest');
assert.match(runner, /customElements\.get/, 'runner should verify custom elements are registered');
assert.match(runner, /readyAttribute/, 'runner should verify fixture ready attributes');

assert.match(server, /3999/, 'examples server should default to port 3999');
assert.match(server, /examples/, 'examples server should serve the examples directory');
