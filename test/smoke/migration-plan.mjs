import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../..', import.meta.url);
const migrationPlan = await readFile(new URL('MIGRATION.md', root), 'utf8');
const backlog = await readFile(new URL('BACKLOG.md', root), 'utf8');
const parityAudit = await readFile(new URL('MODERN_PARITY_AUDIT.md', root), 'utf8');
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
assert.match(migrationPlan, /\[MODERN_PARITY_AUDIT\.md\]\(MODERN_PARITY_AUDIT\.md\)/);
assert.match(backlog, /\[MODERN_PARITY_AUDIT\.md\]\(MODERN_PARITY_AUDIT\.md\)/);
for (const expected of [
  'Modern Test Parity Audit',
  'API stability',
  'test/unit/specs',
  'test/functional/specs',
  'Remaining Parity Gaps',
  'scene-apis.mjs',
  'source-config-current-apis.mjs',
  'remote-proxy-transport.mjs',
  'event-focused smokes',
  'legacy-to-modern method inventory',
]) {
  assert.match(parityAudit, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}
assert.match(readme, /\[MIGRATION\.md\]\(MIGRATION\.md\)/);
