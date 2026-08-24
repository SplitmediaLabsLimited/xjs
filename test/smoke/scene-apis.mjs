import assert from 'node:assert/strict';

console.warn = () => {};

class TestElement {
  constructor(tagName, attributes = []) {
    this.tagName = tagName;
    this.attributes = attributes;
    this.childNodes = [];
    this.textContent = '';
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
    const root = new TestElement('#document');
    const stack = [root];
    for (const token of xml.matchAll(/<([^>]+)>/g)) {
      const body = token[1].trim();
      if (body.startsWith('?') || body.startsWith('!')) {
        continue;
      }
      if (body.startsWith('/')) {
        stack.pop();
        continue;
      }
      const selfClosing = body.endsWith('/');
      const normalized = selfClosing ? body.slice(0, -1).trim() : body;
      const spaceIndex = normalized.search(/\s/);
      const tagName = spaceIndex === -1 ? normalized : normalized.slice(0, spaceIndex);
      const attrSource = spaceIndex === -1 ? '' : normalized.slice(spaceIndex + 1);
      const node = new TestElement(tagName, parseAttributes(attrSource));
      stack[stack.length - 1].childNodes.push(node);
      if (!selfClosing) {
        stack.push(node);
      }
    }

    return {
      childNodes: root.childNodes,
      getElementsByTagName(tagName) {
        const matches = [];
        const visit = (node) => {
          if (node.tagName === tagName) {
            matches.push(node);
          }
          for (const child of node.childNodes) {
            visit(child);
          }
        };
        for (const child of root.childNodes) {
          visit(child);
        }
        return matches;
      },
    };
  }
};

const sceneA = '{11111111-1111-4111-8111-111111111111}';
const sceneB = '{22222222-2222-4222-8222-222222222222}';
const itemA = '{AAAAAAAA-AAAA-4AAA-8AAA-AAAAAAAAAAAA}';
const itemB = '{BBBBBBBB-BBBB-4BBB-8BBB-BBBBBBBBBBBB}';
const itemC = '{CCCCCCCC-CCCC-4CCC-8CCC-CCCCCCCCCCCC}';
const sourceA = '{AAAA0000-AAAA-4AAA-8AAA-AAAAAAAA0000}';
const sourceB = '{BBBB0000-BBBB-4BBB-8BBB-BBBBBBBB0000}';

let activeSceneIndex = '0';
let callbackId = 0;
const latestNewPreset = '{44444444-4444-4444-8444-444444444444}';
const hostCalls = [];
const slotItems = [null, null];
const sceneNames = new Map([
  [sceneA, 'Intro'],
  [sceneB, 'Gameplay'],
  ['i12', 'i12'],
]);
const appProps = new Map([
  [`scenetransitionid:${sceneA}`, 'fade'],
  [`scenetransitiontime:${sceneA}`, '500'],
  [`scenepresetlist:${sceneA}`, '{33333333-3333-4333-8333-333333333333}'],
  [`scenepreset:${sceneA}`, '{33333333-3333-4333-8333-333333333333}'],
  [`scenepresettransitionfunc:${sceneA}`, 'easeInCubic'],
  [`scenepresettransitiontime:${sceneA}`, '650'],
  [`sceneisempty:${sceneA}`, '0'],
  [`sceneisempty:${sceneB}`, '1'],
]);
const itemProps = new Map([
  [
    itemA,
    new Map([
      ['itemlist', `${itemA},${itemB}`],
      ['prop:srcid', sourceA],
      ['prop:cname', 'Widget Custom'],
      ['prop:name', 'Browser Widget'],
      ['prop:item', 'https://example.test/widget.html'],
    ]),
  ],
  [
    itemB,
    new Map([
      ['itemlist', `${itemA},${itemB}`],
      ['prop:srcid', sourceA],
      ['prop:cname', 'Duplicate Custom'],
      ['prop:name', 'Browser Duplicate'],
      ['prop:item', 'https://example.test/dupe.html'],
    ]),
  ],
  [
    itemC,
    new Map([
      ['itemlist', itemC],
      ['prop:srcid', sourceB],
      ['prop:cname', 'Camera Custom'],
      ['prop:name', 'Camera Main'],
      ['prop:item', '@device:pnp:\\\\camera'],
    ]),
  ],
]);

function scenePlacementXml({ uid, name, children = '' }) {
  return `<placement name="${name}" id="${uid}" defpos="1">${children}</placement>`;
}

const sceneAItems = [
  `<item id="${itemA}" srcid="${sourceA}" type="8" name="Browser Widget" cname="Widget Custom" item="https://example.test/widget.html" custom="" FilePlaylist="" />`,
  `<item id="${itemB}" srcid="${sourceA}" type="8" name="Browser Duplicate" cname="Duplicate Custom" item="https://example.test/dupe.html" custom="" FilePlaylist="" />`,
  `<item id="${itemC}" srcid="${sourceB}" type="2" name="Camera Main" cname="Camera Custom" item="@device:pnp:\\\\camera" custom="" FilePlaylist="" />`,
].join('');

function getSceneConfig() {
  return (
    `<configuration cur="${activeSceneIndex}">` +
    scenePlacementXml({ uid: sceneA, name: sceneNames.get(sceneA), children: sceneAItems }) +
    scenePlacementXml({ uid: sceneB, name: sceneNames.get(sceneB), children: '' }) +
    '<global />' +
    '</configuration>'
  );
}

function getSingleSceneConfig(uid) {
  if (uid === sceneA) {
    return scenePlacementXml({ uid: sceneA, name: sceneNames.get(sceneA), children: sceneAItems });
  }
  if (uid === sceneB) {
    return scenePlacementXml({ uid: sceneB, name: sceneNames.get(sceneB), children: '' });
  }
  return scenePlacementXml({ uid, name: sceneNames.get(uid) ?? 'Unknown', children: '' });
}

Object.defineProperty(globalThis, 'navigator', {
  configurable: true,
  value: {
    appVersion: 'XSplit Broadcaster 4.5.2501.0101 ',
  },
});

function nextAsyncId(prefix) {
  callbackId += 1;
  return `${prefix}_${callbackId}`;
}

function getAppProperty(name) {
  hostCalls.push(['AppGetPropertyAsync', name]);
  const asyncId = nextAsyncId('scene_get');
  queueMicrotask(() => {
    let value = '';
    if (name === 'sceneconfig') {
      value = getSceneConfig();
    } else if (name.startsWith('sceneconfig:')) {
      value = getSingleSceneConfig(name.slice('sceneconfig:'.length));
    } else if (name === 'scene:0') {
      value = activeSceneIndex;
    } else if (name === 'scenecount') {
      value = '2';
    } else if (name.startsWith('scenename:')) {
      value = sceneNames.get(name.slice('scenename:'.length)) ?? '';
    } else if (name === `scenenewpreset:${sceneA}`) {
      value = latestNewPreset;
      appProps.set(
        `scenepresetlist:${sceneA}`,
        `${appProps.get(`scenepresetlist:${sceneA}`)},${latestNewPreset}`
      );
    } else {
      value = appProps.get(name) ?? '';
    }
    globalThis.OnAsyncCallback(asyncId, encodeURIComponent(value));
  });
  return asyncId;
}

function setAppProperty(name, value) {
  hostCalls.push(['AppSetPropertyAsync', name, value]);
  const asyncId = nextAsyncId('scene_set');
  queueMicrotask(() => {
    if (name === 'scene:0') {
      activeSceneIndex = value;
    } else if (name.startsWith('scenename:')) {
      sceneNames.set(name.slice('scenename:'.length), value);
    } else if (name === `sceneremovepreset:${sceneA}`) {
      const current = appProps.get(`scenepresetlist:${sceneA}`) ?? '';
      appProps.set(
        `scenepresetlist:${sceneA}`,
        current
          .split(',')
          .filter((preset) => preset !== value)
          .join(',')
      );
    } else {
      appProps.set(name, value);
    }
    globalThis.OnAsyncCallback(asyncId, '0');
  });
  return asyncId;
}

function getLocalPropertyForSlot(slot) {
  return (name) => {
    hostCalls.push([slot === 0 ? 'GetLocalPropertyAsync' : 'GetLocalPropertyAsync2', name]);
    const asyncId = nextAsyncId('scene_item_get');
    queueMicrotask(() => {
      const itemId = slotItems[slot];
      globalThis.OnAsyncCallback(
        asyncId,
        encodeURIComponent(itemProps.get(itemId)?.get(name) ?? '')
      );
    });
    return asyncId;
  };
}

globalThis.external = {
  GetViewId() {
    hostCalls.push(['GetViewId']);
    return '0';
  },
  SearchVideoItem(id) {
    hostCalls.push(['SearchVideoItem', id]);
    slotItems[0] = id;
    return '0';
  },
  SearchVideoItem2(id) {
    hostCalls.push(['SearchVideoItem2', id]);
    slotItems[1] = id;
    return '0';
  },
  GetLocalPropertyAsync: getLocalPropertyForSlot(0),
  GetLocalPropertyAsync2: getLocalPropertyForSlot(1),
  AppGetPropertyAsync: getAppProperty,
  AppSetPropertyAsync: setAppProperty,
  SourcesListOrderSave(view, ids) {
    hostCalls.push(['SourcesListOrderSave', view, ids]);
    return '0';
  },
  GetGlobalProperty(name) {
    hostCalls.push(['GetGlobalProperty', name]);
    if (name === 'splitmode') {
      return '0';
    }
    if (name === 'transitions') {
      return JSON.stringify([
        { Id: 'fade', Name: 'Fade', Content: null, Type: '.re3' },
        { Id: 'none', Name: 'None', Content: null, Type: null },
      ]);
    }
    return '';
  },
};

const xjs = await import(new URL('../../dist/xjs.mjs', import.meta.url));
xjs.Environment.initialize();

assert.equal(await xjs.Scene.getSceneCount(), 2);
const firstScene = await xjs.Scene.getById(1);
assert.equal(await firstScene.getName(), 'Intro');
assert.equal(await firstScene.getSceneNumber(), 1);
assert.equal(await firstScene.getSceneIndex(), 0);
assert.equal(await firstScene.getSceneUid(), sceneA);
assert.equal(await xjs.Scene.getBySceneIndex(1).then((scene) => scene.getName()), 'Gameplay');
assert.equal(await xjs.Scene.getBySceneUid(sceneA).then((scene) => scene.getName()), 'Intro');
assert.deepEqual(
  await xjs.Scene.getByName('Intro').then((scenes) =>
    Promise.all(scenes.map((scene) => scene.getSceneUid()))
  ),
  [sceneA]
);
await assert.rejects(() => xjs.Scene.getById(10), /Invalid parameter/);
await assert.rejects(() => xjs.Scene.getBySceneUid('not-a-uid'), /Unique ID/);

assert.equal(await xjs.Scene.getActiveScene().then((scene) => scene.getSceneUid()), sceneA);
assert.equal(await xjs.Scene.setActiveScene(2), true);
assert.equal(await xjs.Scene.getActiveScene().then((scene) => scene.getSceneUid()), sceneB);
assert.equal(await xjs.Scene.setActiveScene(firstScene), true);
assert.equal(await xjs.Scene.getActiveScene().then((scene) => scene.getSceneUid()), sceneA);
await assert.rejects(() => xjs.Scene.setActiveScene(0), /greater than 0/);
await assert.rejects(() => xjs.Scene.setActiveScene('1'), /Scene object/);

assert.equal(await firstScene.setName('Intro Updated'), true);
assert.equal(await firstScene.getName(), 'Intro Updated');
assert.equal(String(await firstScene.getTransitionOverride()), 'fade');
assert.equal(await firstScene.setTransitionOverride(xjs.Transition.NONE), true);
assert.equal(String(await firstScene.getTransitionOverride()), '');
assert.equal(await firstScene.setTransitionTime(1200), true);
assert.equal(await firstScene.getTransitionTime(), 1200);

const items = await firstScene.getItems();
assert.equal(items.length, 3);
assert.equal(items[0] instanceof xjs.HtmlItem, true);
assert.equal(items[2] instanceof xjs.CameraItem, true);
assert.equal(await firstScene.getTopLevelItems().then((topItems) => topItems.length), 3);
assert.equal(await firstScene.isEmpty(), false);
assert.equal(await xjs.Scene.getBySceneIndex(1).then((scene) => scene.isEmpty()), true);

const sources = await firstScene.getSources();
assert.equal(sources.length, 2);
assert.equal(sources[0] instanceof xjs.HtmlSource, true);
assert.equal(sources[1] instanceof xjs.CameraSource, true);

assert.equal(
  await xjs.Scene.searchItemsById(itemA.toLowerCase()).then((item) => item.getId()),
  itemA
);
assert.equal(await xjs.Scene.searchItemsById('{DDDDDDDD-DDDD-4DDD-8DDD-DDDDDDDDDDDD}'), null);
assert.equal(
  await xjs.Scene.searchScenesByItemId(itemC).then((scene) => scene.getSceneUid()),
  sceneA
);
assert.deepEqual(
  await xjs.Scene.searchItemsByName('Camera Custom').then((matches) =>
    Promise.all(matches.map((item) => item.getId()))
  ),
  [itemC]
);
assert.deepEqual(
  await xjs.Scene.filterItems((item, resolve) => resolve(item instanceof xjs.HtmlItem)).then(
    (matches) => Promise.all(matches.map((item) => item.getId()))
  ),
  [itemA, itemB]
);
assert.deepEqual(
  await xjs.Scene.filterScenesByItems((item, resolve) =>
    resolve(item instanceof xjs.CameraItem)
  ).then((matches) => Promise.all(matches.map((scene) => scene.getSceneUid()))),
  [sceneA]
);
await assert.rejects(() => xjs.Scene.filterItems('bad'), /not a function/);

assert.deepEqual(
  await xjs.Scene.searchSourcesById(sourceA.toLowerCase()).then((matches) =>
    Promise.all(matches.map((source) => source.getId()))
  ),
  [sourceA]
);
assert.deepEqual(
  await xjs.Scene.searchScenesBySourceId(sourceB).then((matches) =>
    Promise.all(matches.map((scene) => scene.getSceneUid()))
  ),
  [sceneA]
);
assert.deepEqual(
  await xjs.Scene.searchSourcesByName('Camera').then((matches) =>
    Promise.all(matches.map((source) => source.getId()))
  ),
  [sourceB]
);
assert.deepEqual(
  await xjs.Scene.filterSources((source, resolve) =>
    resolve(source instanceof xjs.HtmlSource)
  ).then((matches) => Promise.all(matches.map((source) => source.getId()))),
  [sourceA]
);
assert.deepEqual(
  await xjs.Scene.filterScenesBySources((source, resolve) =>
    resolve(source instanceof xjs.CameraSource)
  ).then((matches) => Promise.all(matches.map((scene) => scene.getSceneUid()))),
  [sceneA]
);
await assert.rejects(() => xjs.Scene.searchSourcesById('bad'), /valid ID/);
await assert.rejects(() => xjs.Scene.filterSources('bad'), /not a function/);

assert.equal(await firstScene.setItemOrder([items[2], items[1], items[0]]), firstScene);
assert.deepEqual(
  hostCalls.findLast((call) => call[0] === 'SourcesListOrderSave'),
  ['SourcesListOrderSave', '0', `${itemA},${itemB},${itemC}`]
);

assert.deepEqual(await firstScene.getPresets(), [
  '{00000000-0000-0000-0000-000000000000}',
  '{33333333-3333-4333-8333-333333333333}',
]);
assert.equal(await firstScene.getActivePreset(), '{33333333-3333-4333-8333-333333333333}');
assert.equal(await firstScene.switchToPreset('{00000000-0000-0000-0000-000000000000}'), true);
assert.equal(await firstScene.addPreset(), latestNewPreset);
assert.equal(await firstScene.removePreset(latestNewPreset), true);
await assert.rejects(
  () => firstScene.removePreset('{00000000-0000-0000-0000-000000000000}'),
  /default preset/
);
assert.equal(await firstScene.getPresetTransitionEasing(), 'easeInCubic');
assert.equal(await firstScene.setPresetTransitionEasing('none'), true);
assert.equal(await firstScene.getPresetTransitionEasing(), 'none');
await assert.rejects(() => firstScene.setPresetTransitionEasing('bounce'), /not supported/);
assert.equal(await firstScene.getPresetTransitionTime(), 650);
assert.equal(await firstScene.setPresetTransitionTime(750), true);
assert.equal(await firstScene.getPresetTransitionTime(), 750);
await assert.rejects(() => firstScene.setPresetTransitionTime('bad'), /number/);

const liveScene = xjs.Scene.liveScene();
assert.equal(await liveScene.getSceneUid(), sceneA);
assert.equal(await liveScene.getName(), 'Intro Updated');
assert.equal(await liveScene.getItems().then((liveItems) => liveItems.length), 3);
assert.equal(await liveScene.setPresetTransitionTime(850), true);
assert.equal(await firstScene.getPresetTransitionTime(), 850);

assert.equal(
  hostCalls.some((call) => call[0] === 'AppGetPropertyAsync' && call[1] === 'sceneconfig'),
  true
);
assert.equal(
  hostCalls.some((call) => call[0] === 'AppSetPropertyAsync' && call[1] === 'scene:0'),
  true
);
