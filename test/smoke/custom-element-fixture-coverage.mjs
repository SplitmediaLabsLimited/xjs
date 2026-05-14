import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../..', import.meta.url);

const componentSources = await Promise.all([
  readFile(new URL('docs/app/js/xsplit-navbar.js', root), 'utf8'),
  readFile(new URL('docs/app/js/xsplit-doc-shell.js', root), 'utf8'),
]);
const extensionIndex = await readFile(new URL('examples/xsplit-extension/index.html', root), 'utf8');
const fixtureManifest = await readFile(new URL('examples/xsplit-extension/component-fixtures.js', root), 'utf8');
const componentTests = await Promise.all([
  readFile(new URL('test/component/xsplit-navbar.test.js', root), 'utf8'),
  readFile(new URL('test/component/xsplit-doc-shell.test.js', root), 'utf8'),
]);

function extractCustomElements(source) {
  const tags = new Set();
  for (const match of source.matchAll(/customElements\.define\(\s*['"](xsplit-[a-z0-9-]+)['"]/g)) {
    tags.add(match[1]);
  }
  for (const match of source.matchAll(/\[\s*['"](xsplit-[a-z0-9-]+)['"]\s*,\s*[A-Z]/g)) {
    tags.add(match[1]);
  }
  return tags;
}

const definedElements = new Set();
for (const source of componentSources) {
  for (const tagName of extractCustomElements(source)) {
    definedElements.add(tagName);
  }
}

assert.deepEqual(
  [...definedElements].sort(),
  [
    'xsplit-doc-code-sample',
    'xsplit-doc-member-card',
    'xsplit-doc-navigation',
    'xsplit-doc-quicklinks',
    'xsplit-doc-search',
    'xsplit-doc-search-results',
    'xsplit-navbar',
  ],
  'custom element inventory should match the current docs runtime surface'
);

const testsSource = componentTests.join('\n');
for (const tagName of definedElements) {
  assert.match(extensionIndex, new RegExp(`<${tagName}></${tagName}>`), `${tagName} should render in the extension page`);
  assert.match(fixtureManifest, new RegExp(`customElement:\\s*['"]${tagName}['"]`), `${tagName} should have fixture metadata`);
  assert.match(fixtureManifest, new RegExp(`selector:\\s*['"]${tagName}['"]`), `${tagName} should have a fixture selector`);
  assert.match(testsSource, new RegExp(`['"]${tagName}['"]`), `${tagName} should have component test coverage`);
}

const fixtureElements = new Set();
for (const match of fixtureManifest.matchAll(/customElement:\s*['"](xsplit-[a-z0-9-]+)['"]/g)) {
  fixtureElements.add(match[1]);
}

assert.deepEqual(
  [...fixtureElements].sort(),
  [...definedElements].sort(),
  'fixture manifest should not contain missing or extra custom elements'
);
