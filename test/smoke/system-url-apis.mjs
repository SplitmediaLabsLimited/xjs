import assert from 'node:assert/strict';

const hostCalls = [];
let callbackId = 0;
const cursor = { x: 100, y: 200 };

Object.defineProperty(globalThis, 'navigator', {
  configurable: true,
  value: {
    appVersion: 'XSplit Broadcaster 3.8.1905.2118 ',
  },
});

globalThis.external = {
  GetViewId() {
    return undefined;
  },
  GetGlobalProperty(name) {
    hostCalls.push(['GetGlobalProperty', name]);
    if (name === 'splitmode') {
      return '0';
    }
    return '';
  },
  GetCursorPos() {
    hostCalls.push(['GetCursorPos']);
    return `${cursor.x},${cursor.y}`;
  },
  SetCursorPos(x, y) {
    hostCalls.push(['SetCursorPos', x, y]);
    cursor.x = Number(x);
    cursor.y = Number(y);
    return '0';
  },
  AppGetPropertyAsync(name) {
    hostCalls.push(['AppGetPropertyAsync', name]);
    callbackId += 1;
    const asyncId = `system_${callbackId}`;
    queueMicrotask(() => {
      if (name === 'html:fontlist') {
        globalThis.OnAsyncCallback(asyncId, 'Times,Arial,Helvetica');
      } else {
        globalThis.OnAsyncCallback(asyncId, '');
      }
    });
    return asyncId;
  },
  AppCallFuncAsync(funcName, ...params) {
    hostCalls.push(['AppCallFuncAsync', funcName, ...params]);
    callbackId += 1;
    const asyncId = `url_${callbackId}`;
    queueMicrotask(() => {
      globalThis.OnAsyncCallback(asyncId, '0');
    });
    return asyncId;
  },
};

const xjs = await import(new URL('../../dist/xjs.mjs', import.meta.url));
xjs.Environment.initialize();

assert.deepEqual(await xjs.System.getCursorPosition(), { x: 100, y: 200 });
assert.equal(await xjs.System.setCursorPosition({ x: 320, y: 240 }), true);
assert.deepEqual(await xjs.System.getCursorPosition(), { x: 320, y: 240 });
await assert.rejects(
  () => xjs.System.setCursorPosition({ x: 'bad', y: 240 }),
  /Invalid parameters/
);
assert.deepEqual(await xjs.System.getFonts(), ['Times', 'Arial', 'Helvetica']);

assert.equal(await new xjs.Url('http://www.xsplit.com').addToScene(), true);
assert.equal(await new xjs.Url('https://www.xsplit.com').addToScene(), true);
assert.equal(await new xjs.Url('www.xsplit.com').addToScene(), true);
await assert.rejects(
  () => new xjs.Url('ftp://xsplit.com').addToScene(),
  /only add HTTP or HTTPS URLs/
);
await assert.rejects(
  () => new xjs.Url('custom://xsplit.com').addToScene(),
  /only add HTTP or HTTPS URLs/
);

const addUrlCalls = hostCalls.filter((call) => call[0] === 'AppCallFuncAsync');
assert.deepEqual(
  addUrlCalls.map((call) => call[2]),
  ['http://www.xsplit.com', 'https://www.xsplit.com', 'http://www.xsplit.com']
);
for (const call of addUrlCalls) {
  assert.match(call[1], /^e:EVENT-XJS-CREATE-.+\|addurl$/);
}
