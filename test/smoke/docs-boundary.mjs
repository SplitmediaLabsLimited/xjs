import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../..', import.meta.url);
const docsReadme = await readFile(new URL('docs-old/README.md', root), 'utf8');
const buildDocs = await readFile(new URL('scripts/build-legacy-docs.mjs', root), 'utf8');
const buildNewDocs = await readFile(new URL('scripts/build-docs.mjs', root), 'utf8');
const docsConfig = await readFile(new URL('docs/astro.config.mjs', root), 'utf8');
const docsCheck = await readFile(new URL('scripts/check-docs.mjs', root), 'utf8');
const pagesWorkflow = await readFile(new URL('.github/workflows/pages.yml', root), 'utf8');
const pkg = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));

for (const expected of [
  'Legacy Documentation Source Boundary',
  'Legacy Build Surface',
  'Reference-Only Source',
  'docs-old/app/',
  'scripts/build-legacy-docs.mjs',
  'Astro/Starlight',
]) {
  assert.match(docsReadme, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}

for (const referenceOnlyPath of [
  'docs-old/docs-package/',
  'docs-old/angular.io-package/',
  'docs-old/public-docs-package/',
  'docs-old/typescript-package/',
  'docs-old/typescript-definition-package/',
  'docs-old/links-package/',
]) {
  assert.match(docsReadme, new RegExp(referenceOnlyPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.doesNotMatch(
    buildDocs,
    new RegExp(referenceOnlyPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  );
}

assert.match(
  buildDocs,
  /docs-old\/app/,
  'legacy docs build should copy only the old static docs app'
);
assert.doesNotMatch(
  buildDocs,
  /dgeni|docs-package|typescript-package|angular\.io-package|links-package/i
);

assert.equal(pkg.scripts['docs:legacy:build'], 'node scripts/build-legacy-docs.mjs');
assert.equal(
  pkg.scripts['docs:check'],
  'node scripts/check-docs.mjs && npm run docs:lint && npm run docs:md:check'
);
assert.equal(
  pkg.scripts['docs:lint'],
  'biome check --diagnostic-level=error docs/astro.config.mjs docs/src'
);
assert.equal(
  pkg.scripts['docs:md:check'],
  'rumdl check docs/src/content/docs docs/src/typedoc && rumdl fmt --check docs/src/content/docs docs/src/typedoc'
);
assert.equal(
  pkg.scripts['docs:build'],
  'node scripts/build-docs.mjs',
  'new docs build should target the Starlight site'
);
assert.match(pkg.scripts['docs:dev'], /astro dev --root docs/);

for (const dependency of [
  'astro',
  '@astrojs/starlight',
  'starlight-typedoc',
  'typedoc',
  'typedoc-plugin-markdown',
  'rumdl',
]) {
  assert.ok(pkg.devDependencies[dependency], `${dependency} should be a docs dev dependency`);
}

for (const expected of [
  'starlight-typedoc',
  'createStarlightTypeDocPlugin',
  "entryPoints: ['./src/index.ts']",
  "entryPoints: ['./src']",
  "base: '/xjs'",
  "outDir: '../dist/docs'",
  "label: 'Quick Start'",
  "label: 'Tutorials'",
  "label: 'Support'",
]) {
  assert.match(docsConfig, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}

for (const expected of [
  'scripts/check-docs.mjs',
  'docs/.astro',
  'docs/src/content/docs/api',
  'docs/src/content/docs/internals',
  "['build', '--root', 'docs']",
]) {
  assert.match(buildNewDocs, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}

for (const expected of [
  'component-fixtures.json',
  'componentId',
  'fixtureId',
  'relatedSymbols',
  'every tested component fixture should have a component docs page',
]) {
  assert.match(docsCheck, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}

for (const expected of [
  'actions/configure-pages@v5',
  'actions/upload-pages-artifact@v4',
  'actions/deploy-pages@v4',
  'npm ci --include=dev',
  'npm run docs:build',
  'path: dist/docs',
]) {
  assert.match(pagesWorkflow, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}
