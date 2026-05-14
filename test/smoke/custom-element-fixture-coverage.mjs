import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';

const root = new URL('../..', import.meta.url);

const extensionIndex = await readFile(
  new URL('examples/xsplit-extension/index.html', root),
  'utf8'
);
const fixtureManifest = JSON.parse(
  await readFile(new URL('examples/xsplit-extension/component-fixtures.json', root), 'utf8')
);
const componentTests = await Promise.all([
  readFile(new URL('test/component/xsplit-navbar.test.js', root), 'utf8'),
  readFile(new URL('test/component/xsplit-doc-shell.test.js', root), 'utf8'),
]);

async function readRuntimeSources() {
  const sourceDirs = ['docs-old/app/js/', 'examples/', 'src/'];
  const sources = [];

  async function visit(directoryUrl) {
    const entries = await readdir(directoryUrl, { withFileTypes: true });
    for (const entry of entries) {
      const entryUrl = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directoryUrl);
      if (entry.isDirectory()) {
        await visit(entryUrl);
      } else if (/\.(js|ts|html)$/.test(entry.name)) {
        sources.push(await readFile(entryUrl, 'utf8'));
      }
    }
  }

  for (const sourceDir of sourceDirs) {
    await visit(new URL(sourceDir, root));
  }

  return sources;
}

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
for (const source of await readRuntimeSources()) {
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
  assert.match(
    extensionIndex,
    new RegExp(`<${tagName}></${tagName}>`),
    `${tagName} should render in the extension page`
  );
  assert.equal(
    fixtureManifest.some((fixture) => fixture.customElement === tagName),
    true,
    `${tagName} should have fixture metadata`
  );
  assert.equal(
    fixtureManifest.some((fixture) => fixture.selector === tagName),
    true,
    `${tagName} should have a fixture selector`
  );
  assert.match(
    testsSource,
    new RegExp(`['"]${tagName}['"]`),
    `${tagName} should have component test coverage`
  );
}

const fixtureElements = new Set();
for (const fixture of fixtureManifest) {
  fixtureElements.add(fixture.customElement);
}

assert.deepEqual(
  [...fixtureElements].sort(),
  [...definedElements].sort(),
  'fixture manifest should not contain missing or extra custom elements'
);
