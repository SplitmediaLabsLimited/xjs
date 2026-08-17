import assert from 'node:assert/strict';

const hostCalls = [];

class TestElement {
  constructor(tagName, attributes = [], childNodes = [], textContent = '') {
    this.tagName = tagName;
    this.attributes = attributes;
    this.childNodes = childNodes;
    this.textContent = textContent;
  }
}

function parseAttributes(source) {
  return Array.from(source.matchAll(/([^\s=]+)="([^"]*)"/g), (match) => ({
    name: match[1],
    value: match[2],
  }));
}

globalThis.Element = TestElement;
globalThis.DOMParser = class {
  parseFromString(xml) {
    const rootMatch = xml.match(/^<([^\s>/]+)([^>]*)>([\s\S]*)<\/\1>$/);
    if (!rootMatch) {
      return {
        childNodes: [],
        getElementsByTagName: (tag) =>
          tag === 'parsererror' ? [new TestElement('parsererror')] : [],
      };
    }

    const children = Array.from(
      rootMatch[3].matchAll(/<([^\s>/]+)([^>]*)\/>/g),
      (match) => new TestElement(match[1], parseAttributes(match[2]))
    );
    const root = new TestElement(rootMatch[1], parseAttributes(rootMatch[2]), children);

    return {
      childNodes: [root],
      getElementsByTagName: (tag) => (tag === 'parsererror' ? [] : []),
    };
  }
};

Object.defineProperty(globalThis, 'navigator', {
  configurable: true,
  value: {
    appVersion: 'XSplit Broadcaster 3.8.1905.2118 ',
  },
});

globalThis.location = {
  href: 'http://localhost:3999/xsplit-extension/index.html',
};
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
  AppSubscribeEvents() {
    hostCalls.push(['AppSubscribeEvents']);
    return '0';
  },
  SourcesListSubscribeEvents(view) {
    hostCalls.push(['SourcesListSubscribeEvents', view]);
    return '0';
  },
};

const xjs = await import(new URL('../../dist/xjs.mjs', import.meta.url));
const waitForMicrotasks = () => new Promise((resolve) => setTimeout(resolve, 0));

xjs.Environment.initialize();
const extensionWindow = xjs.ExtensionWindow.getInstance();
assert.equal(extensionWindow instanceof xjs.ExtensionWindow, true);

const highlightEvents = [];
await xjs.ExtensionWindow.on('sources-list-highlight', (id) => {
  highlightEvents.push(id);
});
globalThis.SourcesListHighlight('0', '');
globalThis.SourcesListHighlight('1', '{ignored-preview-id}');
globalThis.SourcesListHighlight('0', '{main-highlight-id}');
await waitForMicrotasks();
assert.deepEqual(highlightEvents, [null, '{main-highlight-id}']);

const selectEvents = [];
await xjs.ExtensionWindow.on('sources-list-select', (id) => {
  selectEvents.push(id);
});
globalThis.SourcesListSelect('0', '');
globalThis.SourcesListSelect('1', '{ignored-preview-id}');
globalThis.SourcesListSelect('0', '{main-select-id}');
await waitForMicrotasks();
assert.deepEqual(selectEvents, [null, '{main-select-id}']);

const updateEvents = [];
await xjs.ExtensionWindow.on('sources-list-update', (idString) => {
  updateEvents.push(idString);
});
globalThis.SourcesListUpdate(
  '0',
  encodeURIComponent('<placement><item id="{source-a}"/><item id="{source-b}"/></placement>')
);
await waitForMicrotasks();
assert.deepEqual(updateEvents, ['{source-a},{source-b}']);

const sceneLoadEvents = [];
await xjs.ExtensionWindow.on('scene-load', (sceneIndex) => {
  sceneLoadEvents.push(sceneIndex);
});
globalThis.OnSceneLoad('1', '4');
globalThis.OnSceneLoad('0', 'i12');
globalThis.OnSceneLoad('0', '3');
await waitForMicrotasks();
assert.deepEqual(sceneLoadEvents, [3]);

const sceneAddEvents = [];
xjs.ExtensionWindow.on('scene-add', (index, uid) => {
  sceneAddEvents.push([index, uid]);
});
globalThis.AppOnEvent(
  'OnSceneAdd',
  'ignored',
  '&sceneid:{11111111-1111-4111-8111-111111111111}&scene:2'
);
assert.deepEqual(sceneAddEvents, [[3, '{11111111-1111-4111-8111-111111111111}']]);

const sceneDeleteEvents = [];
xjs.ExtensionWindow.on('scene-delete', (index, uid) => {
  sceneDeleteEvents.push([index, uid]);
});
globalThis.AppOnEvent(
  'OnSceneDelete',
  'ignored',
  '&sceneid:{22222222-2222-4222-8222-222222222222}&scene:4'
);
assert.deepEqual(sceneDeleteEvents, [[5, '{22222222-2222-4222-8222-222222222222}']]);

const sceneDeleteAllEvents = [];
xjs.ExtensionWindow.on('scene-delete-all', (type) => {
  sceneDeleteAllEvents.push(type);
});
globalThis.AppOnEvent('OnSceneDeleteAll', 'newpres');
assert.deepEqual(sceneDeleteAllEvents, ['newpres']);

await assert.rejects(
  () => xjs.ExtensionWindow.on('some-other-event', () => {}),
  /not yet supported/
);

assert.deepEqual(
  hostCalls.filter((call) => call[0] === 'SourcesListSubscribeEvents'),
  [
    ['SourcesListSubscribeEvents', '0'],
    ['SourcesListSubscribeEvents', '1'],
    ['SourcesListSubscribeEvents', '0'],
    ['SourcesListSubscribeEvents', '1'],
    ['SourcesListSubscribeEvents', '0'],
    ['SourcesListSubscribeEvents', '1'],
  ]
);
assert.equal(
  hostCalls.filter((call) => call[0] === 'AppSubscribeEvents').length,
  3
);
