import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../..', import.meta.url);
const viteConfig = (await import(new URL('vite.config.mjs', root))).default;
const buildScript = await readFile(new URL('scripts/build.mjs', root), 'utf8');

assert.equal(viteConfig.build.target, 'chrome103', 'the Vite browser build must target CEF 103');
assert.equal(
  Array.from(buildScript.matchAll(/buildFormat\('iife',[^\n]+target: 'chrome103'/g)).length,
  2,
  'both browser bundles must explicitly target CEF 103'
);
