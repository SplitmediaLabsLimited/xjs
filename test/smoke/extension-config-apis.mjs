import assert from 'node:assert/strict';

const locationHref = 'http://localhost:3999/xsplit-extension/index.html';
const savedConfig = { test: 'data', nested: { enabled: true } };
const persistedProperties = new Map();
const hostCalls = [];
let callbackId = 0;

Object.defineProperty(globalThis, 'navigator', {
  configurable: true,
  value: {
    appVersion: 'XSplit Broadcaster 3.8.1905.2118 ',
  },
});

globalThis.location = { href: locationHref };
globalThis.external = {
  GetViewId() {
    hostCalls.push(['GetViewId']);
    return undefined;
  },
  PostMessageToParent(message) {
    hostCalls.push(['PostMessageToParent', message]);
    callbackId += 1;
    const asyncId = `iextension_post_${callbackId}`;
    queueMicrotask(() => {
      globalThis.OnAsyncCallback(asyncId, 'extension-window-id');
      globalThis.Setid('extension-window-id');
    });
    return asyncId;
  },
  SetPresProperty(name, value) {
    hostCalls.push(['SetPresProperty', name, value]);
    persistedProperties.set(name, value);
    return '0';
  },
  GetPresProperty(name) {
    hostCalls.push(['GetPresProperty', name]);
    callbackId += 1;
    const asyncId = `iextension_get_${callbackId}`;
    queueMicrotask(() => {
      globalThis.OnAsyncCallback(asyncId, persistedProperties.get(name));
    });
    return asyncId;
  },
};

const xjs = await import(new URL('../../dist/xjs.mjs', import.meta.url));

xjs.Environment.initialize();
assert.equal(xjs.Environment.isExtension(), true);

const extension = xjs.Extension.getInstance();
assert.equal(extension instanceof xjs.Extension, true);
assert.equal(await extension.saveConfig(savedConfig), extension);
assert.deepEqual(await extension.loadConfig(), savedConfig);

await assert.rejects(
  () => extension.saveConfig('not an object'),
  /Configuration object should be in JSON format/
);

assert.equal(persistedProperties.get(locationHref), JSON.stringify(savedConfig));
assert.deepEqual(
  hostCalls.filter((call) => call[0] === 'SetPresProperty'),
  [['SetPresProperty', locationHref, JSON.stringify(savedConfig)]]
);
assert.deepEqual(
  hostCalls.filter((call) => call[0] === 'GetPresProperty'),
  [['GetPresProperty', locationHref]]
);
