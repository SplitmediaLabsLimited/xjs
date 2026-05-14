import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = new URL('../..', import.meta.url);
const dist = new URL('dist/', root);

const expectedFiles = ['xjs.mjs', 'xjs.cjs', 'xjs.js', 'xjs.min.js', 'index.d.ts'];

for (const file of expectedFiles) {
  assert.equal(existsSync(join(dist.pathname, file)), true, `expected dist/${file} to exist`);
}

const esm = await import(new URL('xjs.mjs', dist));
const require = createRequire(import.meta.url);
const cjs = require(fileURLToPath(new URL('xjs.cjs', dist)));

for (const api of ['App', 'Scene', 'ready', 'exec']) {
  assert.equal(typeof esm[api], typeof cjs[api], `${api} type should match`);
  assert.notEqual(esm[api], undefined, `${api} should be exported from ESM`);
  assert.notEqual(cjs[api], undefined, `${api} should be exported from CJS`);
}

const browserBundle = await import('node:fs/promises').then((fs) =>
  fs.readFile(new URL('xjs.js', dist), 'utf8')
);

assert.match(browserBundle, /require\(['"]xjs['"]\)/, 'browser bundle documents xjs require shim');
assert.match(
  browserBundle,
  /chrome103|CEF 103|xjs-framework/i,
  'browser bundle should retain an identifiable banner'
);
