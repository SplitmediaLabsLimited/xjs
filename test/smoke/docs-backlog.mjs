import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../..', import.meta.url);
const backlog = await readFile(new URL('BACKLOG.md', root), 'utf8');
const readme = await readFile(new URL('README.md', root), 'utf8');

for (const expected of [
  'Docs Site Modernization',
  'Astro',
  'Starlight',
  'JSDoc',
  'AngularJS',
  'docs/app/',
]) {
  assert.match(backlog, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}

assert.match(readme, /\[BACKLOG\.md\]\(BACKLOG\.md\)/);
