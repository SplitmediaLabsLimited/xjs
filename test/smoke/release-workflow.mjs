import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../..', import.meta.url);
const pkg = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
const readme = await readFile(new URL('README.md', root), 'utf8');
const gitignore = await readFile(new URL('.gitignore', root), 'utf8');

assert.match(gitignore, /^dist\/\*\*$/m, 'generated dist output should be ignored');
assert.match(gitignore, /^!dist\/xjs-es2015\.js$/m, 'legacy browser bundle should stay tracked');
assert.match(
  gitignore,
  /^!dist\/xjs-es2015\.min\.js$/m,
  'legacy minified browser bundle should stay tracked'
);

assert.equal(pkg.scripts.prepare, 'npm run build');
assert.equal(pkg.scripts['pack:check'], 'npm pack --dry-run');
assert.equal(pkg.name, '@splitmedialabs/xjs');
assert.equal(pkg.publishConfig?.access, 'public');
assert.ok(pkg.files.includes('dist/'), 'published package should include generated dist output');

for (const expected of [
  '## Release build notes',
  '@splitmedialabs/xjs',
  'xjs-framework',
  'deprecation',
  'Generated modern package artifacts are intentionally ignored by git',
  'npm run build',
  'npm run pack:check',
  'prepare',
  'dist/xjs.mjs',
  'dist/xjs.cjs',
  'dist/xjs.js',
  'dist/xjs.min.js',
  'dist/index.d.ts',
  'dist/xjs-es2015.js',
]) {
  assert.match(readme, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}
