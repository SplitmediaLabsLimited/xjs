import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../..', import.meta.url);
const docsReadme = await readFile(new URL('docs-old/README.md', root), 'utf8');
const buildDocs = await readFile(new URL('scripts/build-legacy-docs.mjs', root), 'utf8');
const buildNewDocs = await readFile(new URL('scripts/build-docs.mjs', root), 'utf8');
const docsConfig = await readFile(new URL('docs/astro.config.mjs', root), 'utf8');
const docsCheck = await readFile(new URL('scripts/check-docs.mjs', root), 'utf8');
const docsHome = await readFile(new URL('docs/src/content/docs/index.mdx', root), 'utf8');
const docsQuickStart = await readFile(new URL('docs/src/content/docs/quick-start.mdx', root), 'utf8');
const docsTutorials = await readFile(new URL('docs/src/content/docs/tutorials/index.mdx', root), 'utf8');
const docsSourcePlugins = await readFile(
  new URL('docs/src/content/docs/tutorials/source-plugins.mdx', root),
  'utf8'
);
const docsModernBundlers = await readFile(
  new URL('docs/src/content/docs/tutorials/modern-bundlers.mdx', root),
  'utf8'
);
const pagesWorkflow = await readFile(new URL('.github/workflows/pages.yml', root), 'utf8');
const pkg = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
const tsconfig = JSON.parse(await readFile(new URL('tsconfig.json', root), 'utf8'));

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
  "exclude: ['./src/core/render.ts', './src/internal/render.ts']",
  "site: 'https://xjs.xsplit.com'",
  "outDir: '../dist/docs'",
  "label: 'Quick Start'",
  "label: 'Tutorials'",
  "label: 'Support'",
]) {
  assert.match(docsConfig, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}

for (const content of [docsHome, docsQuickStart, docsTutorials]) {
  assert.doesNotMatch(content, /\/xjs\//, 'authored docs should not hard-code the GitHub Pages base path');
}

for (const expected of [
  'Types of Plugins',
  'Developing Source Plugins',
  'Developing Source Properties Windows',
  'Remote XJS',
]) {
  assert.match(docsTutorials, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}

for (const expected of [
  'SourcePluginWindow.getInstance()',
  'Configuration Objects',
  'Source.getCurrentSource',
]) {
  assert.match(docsSourcePlugins, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}

for (const expected of ['Modern Bundlers and ESM', 'import * as xjs', 'CEF 103 compatibility']) {
  assert.match(docsModernBundlers, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}

for (const entry of ['./src/core/render.ts', './src/internal/render.ts']) {
  assert.ok(tsconfig.files.includes(entry), `${entry} should be part of the TypeScript project`);
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
