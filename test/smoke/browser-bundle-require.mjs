import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('../..', import.meta.url);
const bundle = await readFile(new URL('dist/xjs.js', root), 'utf8');

const delegatedCalls = [];
const sandbox = {
  console,
  setTimeout,
  clearTimeout,
  Promise,
  previousRequireResult: { delegated: true },
};

sandbox.globalThis = sandbox;
sandbox.self = sandbox;
sandbox.window = sandbox;
sandbox.navigator = { appVersion: 'XSplit Broadcaster 4.0.0' };
sandbox.require = (name) => {
  delegatedCalls.push(name);
  return sandbox.previousRequireResult;
};

vm.createContext(sandbox);
vm.runInContext(bundle, sandbox, {
  filename: 'dist/xjs.js',
});

assert.equal(typeof sandbox.XJS, 'object', 'browser bundle should expose XJS globally');
assert.equal(typeof sandbox.require, 'function', 'browser bundle should install a require shim');
assert.equal(
  sandbox.require('xjs'),
  sandbox.XJS,
  'require("xjs") should return the browser exports'
);
assert.equal(sandbox.require.xjs, sandbox.XJS, 'require shim should expose the xjs exports');
assert.equal(
  sandbox.require('other-module'),
  sandbox.previousRequireResult,
  'require shim should delegate unknown modules'
);
assert.deepEqual(delegatedCalls, ['other-module']);

for (const api of [
  'App',
  'Scene',
  'Extension',
  'ExtensionWindow',
  'Dialog',
  'Source',
  'Item',
  'System',
  'Color',
  'Rectangle',
  'ready',
  'exec',
]) {
  assert.notEqual(sandbox.XJS[api], undefined, `${api} should be exported by the browser bundle`);
}
