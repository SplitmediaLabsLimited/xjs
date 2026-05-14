import assert from 'node:assert/strict';

const hostProperties = new Map([
  ['frametime', '12'],
  ['resolution', '900, 600'],
  ['viewport', '1280, 720'],
  ['framesrendered', '12683'],
]);
const requestedProperties = [];
let callbackId = 0;

Object.defineProperty(globalThis, 'navigator', {
  configurable: true,
  value: {
    appVersion: 'XSplit Broadcaster 2.8.1603.0401 ',
  },
});

globalThis.external = {
  AppGetPropertyAsync(name) {
    requestedProperties.push(name);
    callbackId += 1;
    const asyncId = `iapp_${callbackId}`;
    queueMicrotask(() => {
      globalThis.OnAsyncCallback(asyncId, hostProperties.get(name));
    });
    return asyncId;
  },
};

const xjs = await import(new URL('../../dist/xjs.mjs', import.meta.url));
const app = new xjs.App();

assert.equal(await app.getFrameTime(), 12);
assert.equal(await app.getFrametime(), 12);
assert.equal(await app.getFramesRendered(), 12683);
assert.equal(await app.getVersion(), '2.8.1603.0401');

const resolution = await app.getResolution();
assert.equal(resolution.getWidth(), 900);
assert.equal(resolution.getHeight(), 600);

const viewport = await app.getViewport();
assert.equal(viewport.getWidth(), 1280);
assert.equal(viewport.getHeight(), 720);

assert.deepEqual(requestedProperties, [
  'frametime',
  'frametime',
  'framesrendered',
  'resolution',
  'viewport',
]);
