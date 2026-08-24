import assert from 'node:assert/strict';

const forwardedAsyncCallbacks = [];
const hostCalls = [];
let callbackId = 0;

Object.defineProperty(globalThis, 'navigator', {
  configurable: true,
  value: {
    appVersion: 'XSplit Broadcaster 3.8.1905.2118 ',
  },
});

globalThis.OnAsyncCallback = (asyncId, ...results) => {
  forwardedAsyncCallbacks.push([asyncId, ...results]);
};

globalThis.external = {
  CallHost(command, value) {
    hostCalls.push(['CallHost', command, value]);
    return `host:${command}:${value}`;
  },
  AppGetPropertyAsync(name) {
    hostCalls.push(['AppGetPropertyAsync', name]);
    callbackId += 1;
    const asyncId = `async_${callbackId}`;
    queueMicrotask(() => {
      globalThis.OnAsyncCallback(
        asyncId,
        encodeURIComponent(`${name}:value with spaces`),
        encodeURIComponent('second,value')
      );
    });
    return asyncId;
  },
  AppSetPropertyAsync(name, value) {
    hostCalls.push(['AppSetPropertyAsync', name, value]);
    callbackId += 1;
    const asyncId = `async_${callbackId}`;
    queueMicrotask(() => {
      globalThis.OnAsyncCallback(asyncId, value === 'valid' ? '0' : '-1');
    });
    return asyncId;
  },
};

const xjs = await import(new URL('../../dist/xjs.mjs', import.meta.url));
const waitForMicrotasks = () => new Promise((resolve) => setTimeout(resolve, 0));

assert.equal(await xjs.exec('CallHost', 'set-mode', 'enabled'), 'host:set-mode:enabled');

let asyncValues;
const asyncReturnedId = await xjs.exec('AppGetPropertyAsync', 'sample', (...values) => {
  asyncValues = values;
});
await waitForMicrotasks();
assert.equal(asyncReturnedId, 'async_1');
assert.deepEqual(asyncValues, ['sample:value with spaces', 'second,value']);

let setValue;
const setReturnedId = await xjs.exec('AppSetPropertyAsync', 'feature', 'valid', (value) => {
  setValue = value;
});
await waitForMicrotasks();
assert.equal(setReturnedId, 'async_2');
assert.equal(setValue, '0');

assert.deepEqual(forwardedAsyncCallbacks, [
  ['async_1', 'sample%3Avalue%20with%20spaces', 'second%2Cvalue'],
  ['async_2', '0'],
]);
assert.deepEqual(hostCalls, [
  ['CallHost', 'set-mode', 'enabled'],
  ['AppGetPropertyAsync', 'sample'],
  ['AppSetPropertyAsync', 'feature', 'valid'],
]);
