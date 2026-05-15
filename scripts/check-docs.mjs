import assert from 'node:assert/strict';
import { access, readdir, readFile, stat } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const fixturesPath = join(root, 'examples/xsplit-extension/component-fixtures.json');
const componentsDir = join(root, 'docs/src/content/docs/components');
const componentScreenshotManifestPath = join(root, 'docs/src/assets/component-fixtures.json');
const componentScreenshotDir = join(root, 'docs/public/component-fixtures');

const fixtures = JSON.parse(await readFile(fixturesPath, 'utf8'));
const screenshotManifest = JSON.parse(await readFile(componentScreenshotManifestPath, 'utf8'));
const fixtureIds = new Set();
const componentIds = new Set();

for (const fixture of fixtures) {
  assert.equal(typeof fixture.id, 'string', 'fixture id should be a string');
  assert.equal(typeof fixture.customElement, 'string', `${fixture.id} should name a custom element`);
  assert.equal(typeof fixture.selector, 'string', `${fixture.id} should name a selector`);
  assert.ok(
    Array.isArray(fixture.expectedText) || Array.isArray(fixture.expectedSelectors),
    `${fixture.id} should assert expected text or selectors`
  );
  assert.ok(fixture.minBoundingBox, `${fixture.id} should define a minimum rendered size`);
  fixtureIds.add(fixture.id);
  componentIds.add(fixture.customElement);
}

async function collectMdxFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectMdxFiles(path)));
    } else if (extname(entry.name) === '.mdx' && entry.name !== 'index.mdx') {
      files.push(path);
    }
  }
  return files;
}

function parseFrontmatter(file, content) {
  const match = /^---\n([\s\S]*?)\n---/.exec(content);
  assert.ok(match, `${relative(root, file)} should start with frontmatter`);

  const frontmatter = {};
  let currentKey = null;
  for (const line of match[1].split('\n')) {
    const keyValue = /^([A-Za-z0-9_-]+):(?:\s*(.*))?$/.exec(line);
    if (keyValue) {
      currentKey = keyValue[1];
      const value = keyValue[2] ?? '';
      frontmatter[currentKey] = value === '' ? [] : value.replace(/^['"]|['"]$/g, '');
      continue;
    }

    const listItem = /^\s*-\s+(.+)$/.exec(line);
    if (listItem && currentKey) {
      if (!Array.isArray(frontmatter[currentKey])) {
        frontmatter[currentKey] = [];
      }
      frontmatter[currentKey].push(listItem[1].replace(/^['"]|['"]$/g, ''));
    }
  }
  return frontmatter;
}

const mdxFiles = await collectMdxFiles(componentsDir);
const documentedFixtureIds = new Set();

for (const file of mdxFiles) {
  const content = await readFile(file, 'utf8');
  const frontmatter = parseFrontmatter(file, content);
  const fixture = fixtures.find((item) => item.id === frontmatter.fixtureId);

  assert.ok(fixture, `${relative(root, file)} references an unknown fixtureId`);
  assert.equal(
    frontmatter.componentId,
    fixture.customElement,
    `${relative(root, file)} componentId should match the fixture custom element`
  );
  assert.ok(
    Array.isArray(frontmatter.relatedSymbols) && frontmatter.relatedSymbols.length > 0,
    `${relative(root, file)} should declare at least one related symbol`
  );
  assert.match(
    content,
    new RegExp(`<FixtureSummary\\s+fixtureId=["']${frontmatter.fixtureId}["']`),
    `${relative(root, file)} should render its tested fixture summary`
  );

  documentedFixtureIds.add(frontmatter.fixtureId);
}

assert.deepEqual(
  [...documentedFixtureIds].sort(),
  [...fixtureIds].sort(),
  'every tested component fixture should have a component docs page'
);

const screenshotFixtureIds = new Set();
for (const screenshot of screenshotManifest.fixtures || []) {
  assert.ok(fixtureIds.has(screenshot.id), `${screenshot.id} screenshot should match a fixture`);
  assert.match(
    screenshot.src,
    new RegExp(`^/component-fixtures/${screenshot.id}\\.png$`),
    `${screenshot.id} screenshot should use the public component fixture path`
  );
  assert.equal(typeof screenshot.sha256, 'string', `${screenshot.id} screenshot should have a hash`);
  await access(join(componentScreenshotDir, `${screenshot.id}.png`));
  screenshotFixtureIds.add(screenshot.id);
}

assert.deepEqual(
  [...screenshotFixtureIds].sort(),
  [...fixtureIds].sort(),
  'every tested component fixture should have a docs screenshot'
);

const oldDocsInfo = await stat(join(root, 'docs-old/docs-package'));
assert.ok(oldDocsInfo.isDirectory(), 'legacy Dgeni docs package should stay in docs-old');
