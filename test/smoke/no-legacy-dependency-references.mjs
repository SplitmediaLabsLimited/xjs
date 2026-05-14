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
const activeTextFiles = new Set(['.gitignore']);

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
    } else if (activeTextFiles.has(entry) || activeTextExtensions.has(extension(entry))) {
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
const forbiddenFilePatterns = [
  new RegExp(`(^|/)${legacyPackageManager}\\.json$`),
  new RegExp(`(^|/)\\.${legacyPackageManager}rc$`),
  new RegExp(`(^|/)${legacyPackageManager}_components(/|$)`),
];

const allowedHistoricalFiles = new Set([
  'RELEASE.md',
  'test/smoke/no-legacy-dependency-references.mjs',
]);

function collectPackageReferences(value, path, references) {
  if (!value || typeof value !== 'object') {
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    const childPath = path ? `${path}.${key}` : key;
    if (key.toLowerCase().includes(legacyPackageManager)) {
      references.push(`${childPath}: legacy package-manager key should not be present`);
    }
    if (typeof child === 'string' && child.toLowerCase().includes(legacyPackageManager)) {
      references.push(`${childPath}: legacy package-manager value should not be present`);
    }
    collectPackageReferences(child, childPath, references);
  }
}

const failures = [];
for (const file of await collectFiles(root)) {
  const rel = relative(root, file);
  for (const pattern of forbiddenFilePatterns) {
    if (pattern.test(rel)) {
      failures.push(`${rel}: legacy package-manager file should not be tracked`);
    }
  }
  const content = await readFile(file, 'utf8');
  for (const needle of forbidden) {
    if (content.includes(needle) && !allowedHistoricalFiles.has(rel)) {
      failures.push(`${rel}: contains ${needle}`);
    }
  }
}

for (const packageFile of ['package.json', 'package-lock.json']) {
  const content = await readFile(join(root, packageFile), 'utf8');
  collectPackageReferences(JSON.parse(content), packageFile, failures);
}

assert.deepEqual(failures, [], `active Bower/HTML import references remain:\n${failures.join('\n')}`);
