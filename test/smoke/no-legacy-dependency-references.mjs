import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = new URL('../..', import.meta.url).pathname;
const ignoredDirs = new Set(['.git', 'node_modules', 'dist']);
const activeTextExtensions = new Set([
  '.html',
  '.js',
  '.mjs',
  '.cjs',
  '.json',
  '.md',
  '.ts',
  '.css',
]);

function extension(path) {
  const match = path.match(/\.[^.]+$/);
  return match ? match[0] : '';
}

async function collectFiles(dir) {
  const entries = await readdir(dir);
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry);
    const info = await stat(path);
    if (info.isDirectory()) {
      if (!ignoredDirs.has(entry)) {
        files.push(...await collectFiles(path));
      }
    } else if (activeTextExtensions.has(extension(entry))) {
      files.push(path);
    }
  }
  return files;
}

const legacyPackageManager = 'bo' + 'wer';
const forbidden = [
  `${legacyPackageManager}_components`,
  `docs/${legacyPackageManager}`,
  `"${legacyPackageManager}"`,
  `'${legacyPackageManager}'`,
  'rel=' + '"import"',
  "rel=" + "'import'",
];

const allowedHistoricalFiles = new Set([
  'RELEASE.md',
  'test/smoke/no-legacy-dependency-references.mjs',
]);

const failures = [];
for (const file of await collectFiles(root)) {
  const rel = relative(root, file);
  const content = await readFile(file, 'utf8');
  for (const needle of forbidden) {
    if (content.includes(needle) && !allowedHistoricalFiles.has(rel)) {
      failures.push(`${rel}: contains ${needle}`);
    }
  }
}

assert.deepEqual(failures, [], `active Bower/HTML import references remain:\n${failures.join('\n')}`);
