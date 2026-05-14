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
