import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../..', import.meta.url);
const docsReadme = await readFile(new URL('docs-old/README.md', root), 'utf8');
const buildDocs = await readFile(new URL('scripts/build-legacy-docs.mjs', root), 'utf8');
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
