import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../..', import.meta.url);
const index = await readFile(new URL('examples/xsplit-extension/index.html', root), 'utf8');
const config = await readFile(new URL('examples/xsplit-extension/config.html', root), 'utf8');
const fixtures = await readFile(
  new URL('examples/xsplit-extension/component-fixtures.js', root),
  'utf8'
);
const runner = await readFile(
  new URL('examples/xsplit-extension/regression-runner.js', root),
  'utf8'
);
const server = await readFile(new URL('scripts/serve-examples.mjs', root), 'utf8');

assert.match(index, /\.\.\/\.\.\/dist\/xjs\.js/, 'extension should load the CEF browser bundle');
assert.match(
  index,
  /\.\.\/\.\.\/docs\/app\/js\/xsplit-navbar\.js/,
  'extension should load the real docs navbar component'
);
assert.match(
  index,
  /\.\.\/\.\.\/docs\/app\/js\/xsplit-doc-shell\.js/,
  'extension should load reconstructed docs shell components'
);
assert.match(
  index,
  /\.\/component-fixtures\.js/,
  'extension should load the component fixture manifest'
);
assert.match(
  index,
  /<xsplit-navbar><\/xsplit-navbar>/,
  'extension should render the docs navbar fixture'
);
assert.match(
  index,
  /<xsplit-doc-search><\/xsplit-doc-search>/,
  'extension should render the docs search fixture'
);
assert.match(
  index,
  /<xsplit-doc-navigation><\/xsplit-doc-navigation>/,
  'extension should render the docs navigation fixture'
);
assert.match(
  index,
  /<xsplit-doc-quicklinks><\/xsplit-doc-quicklinks>/,
  'extension should render the docs quicklinks fixture'
);
assert.match(
  index,
  /<xsplit-doc-search-results><\/xsplit-doc-search-results>/,
  'extension should render the docs search results fixture'
);
assert.match(
  index,
  /<xsplit-doc-member-card><\/xsplit-doc-member-card>/,
  'extension should render the docs member card fixture'
);
assert.match(
  index,
  /<xsplit-doc-code-sample><\/xsplit-doc-code-sample>/,
  'extension should render the docs code sample fixture'
);
assert.match(
  index,
  /data-example-section="component-fixtures"/,
  'extension should show component fixtures on the XSplit-visible page'
);
assert.match(
  index,
  /data-example-section="config-preview"/,
  'extension should show config/properties preview on the XSplit-visible page'
);
assert.match(
  index,
  /data-example-section="regression-controls"/,
  'extension should show regression controls on the XSplit-visible page'
);
assert.match(
  index,
  /data-example-section="artifact-output"/,
  'extension should show regression artifact output on the XSplit-visible page'
);
assert.doesNotMatch(index, /@vite\/client/, 'extension must not load Vite HMR client');
assert.match(index, /__runXjsRegressionSuite/, 'extension should expose manual runner hook');
assert.match(config, /xsplit:config-url|XSplit/, 'config page should be XSplit-specific');

assert.match(
  fixtures,
  /__xjsComponentFixtures/,
  'fixture manifest should expose component fixture metadata'
);
assert.match(fixtures, /xsplit-navbar/, 'fixture manifest should include the docs navbar fixture');
assert.match(
  fixtures,
  /xsplit-doc-search/,
  'fixture manifest should include the docs search fixture'
);
assert.match(
  fixtures,
  /xsplit-doc-navigation/,
  'fixture manifest should include the docs navigation fixture'
);
assert.match(
  fixtures,
  /xsplit-doc-quicklinks/,
  'fixture manifest should include the docs quicklinks fixture'
);
assert.match(
  fixtures,
  /xsplit-doc-search-results/,
  'fixture manifest should include the docs search results fixture'
);
assert.match(
  fixtures,
  /xsplit-doc-member-card/,
  'fixture manifest should include the docs member card fixture'
);
assert.match(
  fixtures,
  /xsplit-doc-code-sample/,
  'fixture manifest should include the docs code sample fixture'
);
assert.match(
  fixtures,
  /data-ready/,
  'fixture manifest should record the docs navbar ready attribute'
);
assert.match(fixtures, /expectedText/, 'fixture manifest should record expected rendered text');
assert.match(fixtures, /expectedLinks/, 'fixture manifest should record expected rendered links');
assert.match(
  fixtures,
  /expectedSelectors/,
  'fixture manifest should record expected rendered selectors'
);
assert.match(
  fixtures,
  /minBoundingBox/,
  'fixture manifest should record minimum rendered dimensions'
);

for (const check of [
  'xjs.ready resolves',
  'ExtensionWindow.getInstance',
  'App.getVersion',
  'App.getResolution',
  'App.getFrametime',
  'Dialog create/show/close',
  'Scene and source-list subscriptions',
  'CEF 103 ES2022 runtime support',
  'Docs component fixtures render',
]) {
  assert.match(
    runner,
    new RegExp(check.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
    `missing check: ${check}`
  );
}

assert.match(
  runner,
  /__xjsComponentFixtures/,
  'runner should read fixture checks from the manifest'
);
assert.match(runner, /customElements\.get/, 'runner should verify custom elements are registered');
assert.match(runner, /readyAttribute/, 'runner should verify fixture ready attributes');
assert.match(runner, /expectedText/, 'runner should verify expected rendered text');
assert.match(runner, /expectedLinks/, 'runner should verify expected rendered links');
assert.match(runner, /expectedSelectors/, 'runner should verify expected rendered selectors');
assert.match(runner, /getBoundingClientRect/, 'runner should verify fixture layout dimensions');

assert.match(server, /3999/, 'examples server should default to port 3999');
assert.match(server, /examples/, 'examples server should serve the examples directory');
