import assert from 'node:assert/strict';

class TestDocument {
  constructor() {
    this.listeners = new Map();
  }

  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) || [];
    listeners.push(listener);
    this.listeners.set(type, listeners);
  }

  removeEventListener(type, listener) {
    const listeners = this.listeners.get(type) || [];
    this.listeners.set(type, listeners.filter((candidate) => candidate !== listener));
  }

  dispatchEvent(event) {
    event.target = this;
    for (const listener of this.listeners.get(event.type) || []) {
      listener(event);
    }
    return true;
  }
}

class TestCustomEvent {
  constructor(type, init = {}) {
    this.type = type;
    this.detail = init.detail;
  }
}

const hostState = {};
const hostCalls = [];

Object.defineProperty(globalThis, 'navigator', {
  configurable: true,
  value: {
    appVersion: 'XSplit Broadcaster 3.8.1905.2118 ',
  },
});

globalThis.document = new TestDocument();
globalThis.CustomEvent = TestCustomEvent;
globalThis.location = {
  href: 'http://localhost:3999/xsplit-extension/index.html',
};
globalThis.external = {
  GetViewId() {
    return undefined;
  },
  NewDialog(url, reserved, size, flags, title, cookieConfig) {
    hostCalls.push(['NewDialog', url, reserved, size, flags, title, cookieConfig]);
    Object.assign(hostState, { dialogUrl: url, dialogSize: size, dialogFlags: flags, dialogTitle: title, cookieConfig });
    return '0';
  },
  NewAutoDialog(url, reserved, size) {
    hostCalls.push(['NewAutoDialog', url, reserved, size]);
    Object.assign(hostState, { autoDialogUrl: url, autoDialogSize: size });
    return '0';
  },
  CloseDialog() {
    hostCalls.push(['CloseDialog']);
    hostState.dialogClosedByParent = true;
    return '0';
  },
  SetDialogResult(result) {
    hostCalls.push(['SetDialogResult', result]);
    hostState.dialogResult = result;
    return '0';
  },
  Close() {
    hostCalls.push(['Close']);
    hostState.dialogClosed = true;
    return '0';
  },
  PostMessageToParent(message, ...args) {
    hostCalls.push(['PostMessageToParent', message, ...args]);
    if (message === '8') {
      queueMicrotask(() => globalThis.Setid('extension-window-id'));
    }
    return `post-${hostCalls.length}`;
  },
  CallHost(command, value) {
    hostCalls.push(['CallHost', command, value]);
    if (command.startsWith('setExtensionWindowTitle:')) {
      hostState.extensionTitle = value;
    }
    return '0';
  },
};

const xjs = await import(new URL('../../dist/xjs.mjs', import.meta.url));
xjs.Environment.initialize();

const dialog = xjs.Dialog.createDialog('https://example.test/dialog.html')
  .setSize(640, 480)
  .setTitle('Dialog Title')
  .setBorderOptions(true, true)
  .setButtons(true, false)
  .setCookiePath('/tmp/xjs-cookies');

assert.equal(await dialog.show(), dialog);
assert.equal(hostState.dialogUrl, 'https://example.test/dialog.html');
assert.equal(hostState.dialogSize, '640,480');
assert.equal(hostState.dialogFlags, '15');
assert.equal(hostState.dialogTitle, 'Dialog Title');
assert.equal(hostState.cookieConfig, '<configuration cookiepath="/tmp/xjs-cookies" />');

const resultPromise = dialog.getResult();
globalThis.OnDialogResult('dialog-result');
assert.equal(await resultPromise, 'dialog-result');

await dialog.close();
assert.equal(hostState.dialogClosedByParent, true);

const autoDialog = xjs.Dialog.createAutoDialog('https://example.test/auto.html').setSize(320, 240);
assert.equal(await autoDialog.show(), autoDialog);
assert.equal(hostState.autoDialogUrl, 'https://example.test/auto.html');
assert.equal(hostState.autoDialogSize, '320,240');
assert.throws(() => autoDialog.setTitle('not allowed'), /Autoclosing dialogs cannot use this method/);

await xjs.Dialog.return('child-result');
assert.equal(hostState.dialogResult, 'child-result');
assert.equal(hostState.dialogClosed, true);

const extensionWindow = xjs.ExtensionWindow.getInstance();
extensionWindow.resize(800, 600);
extensionWindow.setBorder(7);
extensionWindow.disableClose();
extensionWindow.enableClose();
extensionWindow.close();
await extensionWindow.setTitle('Extension Title');

assert.deepEqual(
  hostCalls.filter((call) => call[0] === 'PostMessageToParent' && call[1] !== '8'),
  [
    ['PostMessageToParent', '2', '800', '600'],
    ['PostMessageToParent', '4', '7'],
    ['PostMessageToParent', '5', '0'],
    ['PostMessageToParent', '5', '1'],
    ['PostMessageToParent', '1'],
  ]
);
assert.equal(
  hostCalls.filter((call) => call[0] === 'PostMessageToParent' && call[1] === '8').length,
  2
);
assert.deepEqual(
  hostCalls.filter((call) => call[0] === 'CallHost'),
  [['CallHost', 'setExtensionWindowTitle:extension-window-id', 'Extension Title']]
);
