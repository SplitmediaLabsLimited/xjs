import assert from 'node:assert/strict';

Object.defineProperty(globalThis, 'navigator', {
  configurable: true,
  value: {
    appVersion: 'XSplit Broadcaster 3.8.1905.2118 ',
  },
});

globalThis.external = {
  GetConfiguration() {
    return '{}';
  },
};

const xjs = await import(new URL('../../dist/xjs.mjs', import.meta.url));

xjs.Environment.initialize();
assert.equal(xjs.Environment.isSourcePlugin(), true);
assert.equal(xjs.SourcePluginWindow.getInstance() instanceof xjs.SourcePluginWindow, true);

const sceneDeleteEvents = [];
xjs.SourcePluginWindow.on('scene-delete', (index) => {
  sceneDeleteEvents.push(index);
});

globalThis.SetEvent('event=SceneDeleted&index=9');
globalThis.SetEvent('event=SceneDeleted&index=');
assert.deepEqual(sceneDeleteEvents, [10, null]);
