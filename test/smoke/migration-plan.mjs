import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../..', import.meta.url);
const migrationPlan = await readFile(new URL('MIGRATION.md', root), 'utf8');
const backlog = await readFile(new URL('BACKLOG.md', root), 'utf8');
const readme = await readFile(new URL('README.md', root), 'utf8');

for (const expected of [
  'Modernization Migration Plan',
  'Bower Removal',
  'ESM Transition',
  'Vite',
  'CommonJS',
  'CEF 103',
  'CDP',
  'TypeScript 6',
  'TS-go',
  'API Stability Constraint',
  'preserve the public XJS API',
  'major-version effort',
  'component fixtures',
  'Astro',
  'Starlight',
  'JSDoc',
]) {
  assert.match(migrationPlan, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}

assert.match(backlog, /\[MIGRATION\.md\]\(MIGRATION\.md\)/);
assert.match(readme, /\[MIGRATION\.md\]\(MIGRATION\.md\)/);
