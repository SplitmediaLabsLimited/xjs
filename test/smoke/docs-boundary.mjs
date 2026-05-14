import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../..', import.meta.url);
const docsReadme = await readFile(new URL('docs/README.md', root), 'utf8');
const buildDocs = await readFile(new URL('scripts/build-docs.mjs', root), 'utf8');
const pkg = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));

for (const expected of [
  'Documentation Source Boundary',
  'Active Build Surface',
  'Reference-Only Source',
  'docs/app/',
  'scripts/build-docs.mjs',
  'Astro/Starlight',
]) {
  assert.match(docsReadme, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}

for (const referenceOnlyPath of [
  'docs/docs-package/',
  'docs/angular.io-package/',
  'docs/public-docs-package/',
  'docs/typescript-package/',
  'docs/typescript-definition-package/',
  'docs/links-package/',
]) {
  assert.match(docsReadme, new RegExp(referenceOnlyPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.doesNotMatch(buildDocs, new RegExp(referenceOnlyPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}

assert.match(buildDocs, /docs\/app/, 'docs build should copy only the active static docs app');
assert.doesNotMatch(buildDocs, /dgeni|docs-package|typescript-package|angular\.io-package|links-package/i);

assert.equal(pkg.scripts['docs:build'], 'node scripts/build-docs.mjs');
