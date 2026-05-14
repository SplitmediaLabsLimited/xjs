import assert from 'node:assert/strict';

const hostCalls = [];
const sentMessages = [];
let asyncId = 100;

Object.defineProperty(globalThis, 'navigator', {
  configurable: true,
  value: {
    appVersion: 'XSplit Broadcaster 4.5.2501.0101 ',
  },
});

globalThis.external = {
  CallHost(command, value) {
    hostCalls.push(['CallHost', command, value]);
    return encodeURIComponent(`sync:${command}:${value}`);
  },
  AppGetPropertyAsync(name) {
    hostCalls.push(['AppGetPropertyAsync', name]);
    asyncId += 1;
    const id = asyncId;
    queueMicrotask(() => {
      globalThis.OnAsyncCallback(id, encodeURIComponent(`${name}:proxy-value`));
    });
    return id;
  },
};

const xjs = await import(new URL('../../dist/xjs.mjs', import.meta.url));
const waitForMicrotasks = () => new Promise((resolve) => setTimeout(resolve, 0));
const decodeMessage = (message) => JSON.parse(decodeURIComponent(message));

await xjs.Remote.setSendMessage((message) => {
  sentMessages.push(message);
  return true;
});

await assert.rejects(
  () => xjs.Remote.receiveMessage(encodeURIComponent(JSON.stringify({ type: 'exec' }))),
  /local mode/
);

xjs.Remote.remoteType = 'remote';
const remoteExec = xjs.exec('AppGetPropertyAsync', 'remote-prop');
assert.equal(sentMessages.length, 1);
const remoteRequest = decodeMessage(sentMessages.at(-1));
assert.deepEqual(remoteRequest, {
  funcName: 'AppGetPropertyAsync',
  args: ['remote-prop'],
  asyncId: 1,
  type: 'exec',
});
void xjs.Remote.receiveMessage(encodeURIComponent(JSON.stringify({
  type: 'exec',
  asyncId: remoteRequest.asyncId,
  result: 'remote-result',
})));
assert.equal(await remoteExec, 'remote-result');

let remoteCallbackValue;
void xjs.exec('AppGetPropertyAsync', 'remote-callback', (value) => {
  remoteCallbackValue = value;
});
const remoteCallbackRequest = decodeMessage(sentMessages.at(-1));
assert.deepEqual(remoteCallbackRequest, {
  funcName: 'AppGetPropertyAsync',
  args: ['remote-callback'],
  asyncId: 2,
  type: 'exec',
});
void xjs.Remote.receiveMessage(encodeURIComponent(JSON.stringify({
  type: 'exec',
  asyncId: remoteCallbackRequest.asyncId,
  result: 'callback-result',
})));
await waitForMicrotasks();
assert.equal(remoteCallbackValue, 'callback-result');

xjs.Remote.remoteType = 'proxy';
sentMessages.length = 0;
void xjs.Remote.receiveMessage(encodeURIComponent(JSON.stringify({
  type: 'exec',
  asyncId: 7,
  funcName: 'CallHost',
  args: ['mode', 'on'],
})));
await waitForMicrotasks();
assert.deepEqual(decodeMessage(sentMessages.at(-1)), {
  result: 'sync:mode:on',
  asyncId: 7,
  type: 'exec',
});

void xjs.Remote.receiveMessage(encodeURIComponent(JSON.stringify({
  type: 'exec',
  asyncId: 8,
  funcName: 'AppGetPropertyAsync',
  args: ['proxy-prop'],
})));
await waitForMicrotasks();
assert.deepEqual(decodeMessage(sentMessages.at(-1)), {
  result: 'proxy-prop:proxy-value',
  asyncId: 8,
  type: 'exec',
});

assert.deepEqual(hostCalls, [
  ['AppGetPropertyAsync', 'remote-prop'],
  ['AppGetPropertyAsync', 'remote-callback'],
  ['CallHost', 'mode', 'on'],
  ['AppGetPropertyAsync', 'proxy-prop'],
]);

xjs.Remote.remoteType = 'local';
