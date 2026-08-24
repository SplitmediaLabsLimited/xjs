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
const htmlItem = '{AAAAAAAA-AAAA-4AAA-8AAA-AAAAAAAAAAAA}';
const flashItem = '{BBBBBBBB-BBBB-4BBB-8BBB-BBBBBBBBBBBB}';
const gameItem = '{CCCCCCCC-CCCC-4CCC-8CCC-CCCCCCCCCCCC}';
const sceneItem = '{DDDDDDDD-DDDD-4DDD-8DDD-DDDDDDDDDDDD}';
const htmlSource = '{AAAA0000-AAAA-4AAA-8AAA-AAAAAAAA0000}';
const flashSource = '{BBBB0000-BBBB-4BBB-8BBB-BBBBBBBB0000}';
const gameSource = '{CCCC0000-CCCC-4CCC-8CCC-CCCCCCCC0000}';
const sceneSource = '{DDDD0000-DDDD-4DDD-8DDD-DDDDDDDD0000}';

const hostCalls = [];
const slotItems = [null, null];
let callbackId = 0;
const currentItemId = htmlItem;

Object.defineProperty(globalThis, 'navigator', {
  configurable: true,
  value: {
    appVersion: 'XSplit Broadcaster 4.5.2501.0101 ',
  },
});

const sceneItems = [
  `<item id="${htmlItem}" srcid="${htmlSource}" type="8" name="Browser Widget" cname="Widget Custom" item="https://example.test/widget.html" custom="" FilePlaylist="" />`,
  `<item id="${flashItem}" srcid="${flashSource}" type="6" name="C:\\\\media\\\\intro.swf" cname="Flash Custom" item="C:\\\\media\\\\intro.swf" custom="" FilePlaylist="" />`,
  `<item id="${gameItem}" srcid="${gameSource}" type="7" name="Game Capture" cname="Game Custom" item="&lt;capture executable=&quot;Game.exe&quot; replace=&quot;&quot; /&gt;" custom="" FilePlaylist="" />`,
  `<item id="${sceneItem}" srcid="${sceneSource}" type="11" name="Scene: Gameplay" cname="Scene Custom" item="${sceneB}" custom="" FilePlaylist="" />`,
].join('');

const sceneConfig = `<configuration cur="0"><placement name="Intro" id="${sceneA}" defpos="1">${sceneItems}</placement><placement name="Gameplay" id="${sceneB}" defpos="1"></placement><global /></configuration>`;

const itemProps = new Map([
  [
    htmlItem,
    new Map([
      ['itemlist', htmlItem],
      [
        'config',
        `<item id="${htmlItem}" srcid="${htmlSource}" type="8" name="Browser Widget" cname="Widget Custom" item="https://example.test/widget.html" custom="" />`,
      ],
      ['prop:srcid', htmlSource],
      ['prop:cname', 'Widget Custom'],
      ['prop:name', 'Browser Widget'],
      ['prop:item', 'https://example.test/widget.html'],
      ['prop:srcitem', 'https://example.test/widget.html'],
      ['prop:BrowserConfiguration', '{"theme":"dark","volume":7}'],
    ]),
  ],
  [
    flashItem,
    new Map([
      ['itemlist', flashItem],
      [
        'config',
        `<item id="${flashItem}" srcid="${flashSource}" type="6" name="C:\\\\media\\\\intro.swf" cname="Flash Custom" item="C:\\\\media\\\\intro.swf" custom="" />`,
      ],
      ['prop:srcid', flashSource],
      ['prop:cname', 'Flash Custom'],
      ['prop:name', 'C:\\media\\intro.swf'],
      ['prop:item', 'C:\\media\\intro.swf'],
      ['prop:srcitem', 'C:\\media\\intro.swf'],
      ['prop:BrowserSize', '640,360'],
      ['prop:BrowserRightClick', '0'],
      ['prop:itemavail', '1'],
    ]),
  ],
  [
    gameItem,
    new Map([
      ['itemlist', gameItem],
      [
        'config',
        `<item id="${gameItem}" srcid="${gameSource}" type="7" name="Game Capture" cname="Game Custom" item="&lt;capture executable=&quot;Game.exe&quot; replace=&quot;&quot; /&gt;" custom="" />`,
      ],
      ['prop:srcid', gameSource],
      ['prop:cname', 'Game Custom'],
      ['prop:name', 'Game Capture'],
      ['prop:item', '<capture executable="Game.exe" replace="" />'],
      ['prop:srcitem', '<capture executable="Game.exe" replace="" />'],
      ['GameCapSurfSharing', '0'],
      ['GameCapShowMouse', '1'],
      ['prop:GameCapAlpha', '0'],
      ['prop:GameCapFrameTimeLimit', '166666'],
    ]),
  ],
  [
    sceneItem,
    new Map([
      ['itemlist', sceneItem],
      [
        'config',
        `<item id="${sceneItem}" srcid="${sceneSource}" type="11" name="Scene: Gameplay" cname="Scene Custom" item="${sceneB}" custom="" />`,
      ],
      ['prop:srcid', sceneSource],
      ['prop:cname', 'Scene Custom'],
      ['prop:name', 'Scene: Gameplay'],
      ['prop:item', sceneB],
      ['prop:srcitem', sceneB],
      ['prop:srctype', `11,${sceneB}`],
    ]),
  ],
]);

function nextAsyncId(prefix) {
  callbackId += 1;
  return `${prefix}_${callbackId}`;
}

function getStoreForSlot(slot) {
  return itemProps.get(slotItems[slot] ?? currentItemId);
}

function getLocalPropertyForSlot(slot) {
  return (name) => {
    hostCalls.push([slot === 0 ? 'GetLocalPropertyAsync' : 'GetLocalPropertyAsync2', name]);
    const asyncId = nextAsyncId('source_current_get');
    queueMicrotask(() => {
      globalThis.OnAsyncCallback(
        asyncId,
        encodeURIComponent(getStoreForSlot(slot)?.get(name) ?? '')
      );
    });
    return asyncId;
  };
}

function setLocalPropertyForSlot(slot) {
  return (name, value) => {
    hostCalls.push([slot === 0 ? 'SetLocalPropertyAsync' : 'SetLocalPropertyAsync2', name, value]);
    const asyncId = nextAsyncId('source_current_set');
    queueMicrotask(() => {
      getStoreForSlot(slot)?.set(name, value);
      globalThis.OnAsyncCallback(asyncId, '0');
    });
    return asyncId;
  };
}

function getAppProperty(name) {
  hostCalls.push(['AppGetPropertyAsync', name]);
  const asyncId = nextAsyncId('source_current_app_get');
  queueMicrotask(() => {
    let value = '';
    if (name === 'sceneconfig') {
      value = sceneConfig;
    } else if (name === `sceneconfig:${sceneA}`) {
      value = `<placement name="Intro" id="${sceneA}" defpos="1">${sceneItems}</placement>`;
    } else if (name === `sceneconfig:${sceneB}`) {
      value = `<placement name="Gameplay" id="${sceneB}" defpos="1"></placement>`;
    } else if (name === 'scene:0') {
      value = '0';
    } else if (name === `scenename:${sceneA}`) {
      value = 'Intro';
    } else if (name === `scenename:${sceneB}`) {
      value = 'Gameplay';
    }
    globalThis.OnAsyncCallback(asyncId, encodeURIComponent(value));
  });
  return asyncId;
}

function setAppProperty(name, value) {
  hostCalls.push(['AppSetPropertyAsync', name, value]);
  const asyncId = nextAsyncId('source_current_app_set');
  queueMicrotask(() => {
    globalThis.OnAsyncCallback(asyncId, '0');
  });
  return asyncId;
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
  SetLocalPropertyAsync: setLocalPropertyForSlot(0),
  SetLocalPropertyAsync2: setLocalPropertyForSlot(1),
  AppGetPropertyAsync: getAppProperty,
  AppSetPropertyAsync: setAppProperty,
  GetGlobalProperty(name) {
    hostCalls.push(['GetGlobalProperty', name]);
    return name === 'splitmode' ? '0' : '';
  },
  SetBrowserProperty(name, value) {
    hostCalls.push(['SetBrowserProperty', name, value]);
    itemProps.get(currentItemId)?.set(`browser:${name}`, value);
    return '0';
  },
  CallInner(method, payload) {
    hostCalls.push(['CallInner', method, payload]);
    return '0';
  },
  CallInner2(method, payload) {
    hostCalls.push(['CallInner2', method, payload]);
    return '0';
  },
};

const xjs = await import(new URL('../../dist/xjs.mjs', import.meta.url));
xjs.Environment.initialize();

const currentSource = await xjs.Source.getCurrentSource();
assert.equal(currentSource instanceof xjs.HtmlSource, true);
assert.equal(await currentSource.getId(), htmlSource);
assert.deepEqual(await currentSource.loadConfig(), { theme: 'dark', volume: 7 });
assert.equal(await currentSource.saveConfig({ theme: 'light' }), currentSource);
assert.deepEqual(JSON.parse(itemProps.get(htmlItem).get('browser:Configuration')), {
  theme: 'light',
});
assert.equal(await currentSource.requestSaveConfig({ theme: 'requested' }), currentSource);
assert.deepEqual(JSON.parse(hostCalls.findLast((call) => call[0] === 'CallInner')?.[2]), {
  request: 'saveConfig',
  data: { theme: 'requested' },
});
assert.equal(await currentSource.applyConfig({ theme: 'applied' }), currentSource);
assert.deepEqual(JSON.parse(hostCalls.findLast((call) => call[0] === 'CallInner')?.[2]), {
  request: 'applyConfig',
  data: { theme: 'applied' },
});
await assert.rejects(() => currentSource.saveConfig('bad'), /JSON format/);

assert.deepEqual(
  await xjs.Source.getItemList().then((items) => Promise.all(items.map((item) => item.getId()))),
  [htmlItem]
);
assert.deepEqual(
  await xjs.Source.getAllSources().then((sources) =>
    Promise.all(sources.map((source) => source.getId()))
  ),
  [htmlSource, flashSource, gameSource, sceneSource]
);

const flash = new xjs.FlashSource({
  id: flashItem,
  srcid: flashSource,
  sceneId: '0',
  type: xjs.ItemTypes.FLASHFILE,
});
assert.equal((await flash.getCustomResolution()).toDimensionString(), '640,360');
assert.equal(await flash.setCustomResolution(xjs.Rectangle.fromDimensions(800, 450)), flash);
assert.equal(itemProps.get(flashItem).get('prop:BrowserSize'), '800,450');
assert.equal(await flash.getAllowRightClick(), false);
assert.equal(await flash.setAllowRightClick(true), flash);
assert.equal(await flash.getAllowRightClick(), true);
assert.equal(await flash.isSourceAvailable(), true);
assert.equal(await flash.getValue(), 'C:\\media\\intro.swf');
assert.equal(await flash.setValue('C:\\media\\updated.swf'), flash);
assert.equal(itemProps.get(flashItem).get('prop:srcitem'), 'C:\\media\\updated.swf');

const game = new xjs.GameSource({
  id: gameItem,
  srcid: gameSource,
  sceneId: '0',
  type: xjs.ItemTypes.GAMESOURCE,
});
assert.equal(await game.isSpecialOptimizationEnabled(), false);
assert.equal(await game.setSpecialOptimizationEnabled(true), game);
assert.equal(await game.isSpecialOptimizationEnabled(), true);
assert.equal(await game.isShowMouseEnabled(), true);
assert.equal(await game.setShowMouseEnabled(false), game);
assert.equal(await game.isShowMouseEnabled(), false);
assert.equal(await game.getOfflineImage(), '');
assert.equal(await game.setOfflineImage('C:\\Images\\offline.png'), game);
assert.match(itemProps.get(gameItem).get('prop:srcitem'), /replace="C:\\Images\\offline.png"/);
await assert.rejects(() => game.setOfflineImage('C:\\Images\\offline.txt'), /Invalid file path/);
assert.equal(await game.isTransparent(), false);
assert.equal(await game.setTransparent(true), game);
assert.equal(await game.isTransparent(), true);
assert.equal(await game.getGameFPSCap(), 60);
assert.equal(await game.setGameFPSCap(120), game);
assert.equal(itemProps.get(gameItem).get('prop:GameCapFrameTimeLimit'), '83333');
assert.equal(await game.setGameFPSCap(0), game);
assert.equal(await game.getGameFPSCap(), 0);
await assert.rejects(() => game.setGameFPSCap(23), /range of 24 to 300/);

const sceneBackedSource = new xjs.SceneSource({
  id: sceneItem,
  srcid: sceneSource,
  sceneId: '0',
  type: xjs.ItemTypes.SCENE,
});
assert.equal(await sceneBackedSource.getScene().then((scene) => scene.getSceneUid()), sceneB);
assert.equal(await sceneBackedSource.setScene(0), sceneBackedSource);
assert.equal(itemProps.get(sceneItem).get('prop:srctype'), `11,${sceneA}`);
assert.equal(await sceneBackedSource.setScene(xjs.Scene.liveScene()), sceneBackedSource);
assert.equal(itemProps.get(sceneItem).get('prop:srctype'), '14,0');
itemProps.get(sceneItem).set('prop:srcitem', '0');
assert.equal(await sceneBackedSource.getScene(), xjs.Scene.liveScene());
await assert.rejects(() => sceneBackedSource.setScene(-1), /greater than 0/);

assert.equal(
  hostCalls.some((call) => call[0] === 'SetBrowserProperty'),
  true
);
assert.equal(
  hostCalls.some((call) => call[0] === 'CallInner'),
  true
);
assert.equal(
  hostCalls.some((call) => call[0] === 'SearchVideoItem'),
  true
);
