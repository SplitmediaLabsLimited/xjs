import assert from 'node:assert/strict';

const hostCalls = [];
let callbackId = 0;

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
  GetFileContent(path) {
    hostCalls.push(['GetFileContent', path]);
    return 'SGVsbG8sIFhKUyE=';
  },
  GetWebContent(url) {
    hostCalls.push(['GetWebContent', url]);
    callbackId += 1;
    const asyncId = `web_${callbackId}`;
    queueMicrotask(() => {
      globalThis.OnAsyncCallback(asyncId, 'PGgxPlhKUzwvaDE+');
    });
    return asyncId;
  },
  OpenUrl(url) {
    hostCalls.push(['OpenUrl', url]);
    return '0';
  },
  OpenFileDialogAsync(extension, value, flags, filterString) {
    hostCalls.push(['OpenFileDialogAsync', extension, value, flags, filterString]);
    callbackId += 1;
    const asyncId = `dialog_${callbackId}`;
    queueMicrotask(() => {
      if (filterString === 'Cancelled|*.none||') {
        globalThis.OnAsyncCallback(asyncId, 'null');
      } else {
        globalThis.OnAsyncCallback(asyncId, 'C:\\videos\\video.mov|C:\\videos\\audio.ogg');
      }
    });
    return asyncId;
  },
  GetVideoDuration(file) {
    hostCalls.push(['GetVideoDuration', file]);
    queueMicrotask(() => {
      if (file === 'C:\\videos\\video.mov') {
        globalThis.OnGetVideoDuration(encodeURIComponent(file), '22522500');
      } else {
        globalThis.OnGetVideoDurationFailed(encodeURIComponent(file));
      }
    });
    return '0';
  },
};

const xjs = await import(new URL('../../dist/xjs.mjs', import.meta.url));
xjs.Environment.initialize();

assert.equal(await xjs.IO.getFileContent('C:\\notes\\hello.txt'), 'SGVsbG8sIFhKUyE=');
assert.equal(await xjs.IO.getWebContent('https://example.test/'), 'PGgxPlhKUzwvaDE+');
assert.equal(await xjs.IO.openUrl('https://xsplit.com/'), '0');

assert.deepEqual(
  await xjs.IO.openFileDialog({
    allowMultiSelect: true,
    fileMustExist: true,
    forceShowHidden: true,
  }),
  ['C:\\videos\\video.mov', 'C:\\videos\\audio.ogg']
);
assert.deepEqual(
  await xjs.IO.openFileDialog(null, {
    name: 'Image Files',
    extensions: ['jpg', 'bmp'],
  }),
  ['C:\\videos\\video.mov', 'C:\\videos\\audio.ogg']
);
await assert.rejects(
  () =>
    xjs.IO.openFileDialog(null, {
      name: 'Cancelled',
      extensions: ['none'],
    }),
  /File selection cancelled/
);

assert.equal(await xjs.IO.getVideoDuration('C:\\videos\\video.mov'), 22522500);
await assert.rejects(() => xjs.IO.getVideoDuration('C:\\videos\\missing.mov'), /Invalid file path/);
await assert.rejects(() => xjs.IO.getVideoDuration(), /No file indicated/);

assert.deepEqual(hostCalls, [
  ['GetFileContent', 'C:\\notes\\hello.txt'],
  ['GetWebContent', 'https://example.test/'],
  ['OpenUrl', 'https://xsplit.com/'],
  ['OpenFileDialogAsync', null, null, String(0x200 | 0x1000 | 0x10000000), ''],
  ['OpenFileDialogAsync', null, null, '0', 'Image Files|*.jpg;*.bmp||'],
  ['OpenFileDialogAsync', null, null, '0', 'Cancelled|*.none||'],
  ['GetVideoDuration', 'C:\\videos\\video.mov'],
  ['GetVideoDuration', 'C:\\videos\\missing.mov'],
]);
