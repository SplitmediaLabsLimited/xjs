import assert from 'node:assert/strict';

console.warn = () => {};
globalThis.window = globalThis;
globalThis.devicePixelRatio = 2;

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

const hostCalls = [];
let callbackId = 0;
const propsById = new Map();
const slotStores = [null, null];

function setProps(id, props) {
  propsById.set(id, new Map(Object.entries(props)));
}

setProps('{HTML-ITEM}', {
  'prop:srcitem': 'https://example.test/widget.html*{"configUrl":"https://example.test/config.html"}',
  'prop:item': 'https://example.test/widget.html*{"configUrl":"https://example.test/config.html"}',
  'prop:name': 'Browser Widget',
  'prop:BrowserTransparent': '1',
  'prop:Browser60fps': '0',
  'prop:BrowserSize': '1280,720',
  'prop:BrowserRightClick': '0',
  'prop:custom': JSON.stringify({
    customJS: 'console.log("ready")',
    scriptEnabled: 'true',
    customCSS: 'body { color: red; }',
    cssEnabled: 'true',
  }),
  BrowserLoadStatus: 'loaded',
  'prop:itemavail': '1',
});

setProps('{SCREEN-ITEM}', {
  'prop:srcitem': '<screen module="" window="Chrome" hwnd="1001" wclient="1" left="10" top="20" width="300" height="200" />',
  'prop:item': '<screen module="" window="Chrome" hwnd="1001" wclient="1" left="10" top="20" width="300" height="200" />',
  'prop:ScrCapTrackWindowTitle': '0',
  'prop:ScrCapLayered': '0',
  'prop:ScrCapOptCapture1': '1',
  'prop:ScrCapShowClicks': '0',
  'prop:ScrCapShowMouse': '1',
  screenresolution: '0,0,1920,1080',
});

setProps('{REPLAY-ITEM}', {
  'prop:presproperty:channelName': 'Local Recording',
  'prop:presproperty:hotkey': '123',
  'prop:presproperty:buffer': '30',
  'prop:ReplayActive': '1',
  'prop:StartOnLoad': '0',
});

setProps('{CAMERA-ITEM}', {
  'prop:item': '@device:pnp:\\\\camera',
  'prop:srcitem': '@device:pnp:\\\\camera',
  'prop:resolution': '1920,1080',
  'prop:itemaudio': '',
  'prop:StreamPause': '0',
  'prop:hwencoder': '0',
  'prop:activestate': 'active',
  'prop:StreamDelay': '100000',
  'prop:AudioDelay': '300000',
  'prop:fdeinterlace': '0',
  'prop:audioavail': '1',
});

setProps('{PLAYLIST-ITEM}', {
  'prop:srcitem': 'C:\\media\\a.mp4*0',
  'prop:FilePlaylist': 'C:\\media\\a.mp4*0*1*100*100*0*0*0*0*0|C:\\media\\b.mp4*1*1*200*100*0*0*0*0*0',
  'prop:itemavail': '1',
});

Object.defineProperty(globalThis, 'navigator', {
  configurable: true,
  value: {
    appVersion: 'XSplit Broadcaster 3.8.1905.2118 ',
  },
});

function nextAsyncId(prefix) {
  callbackId += 1;
  return `${prefix}_${callbackId}`;
}

function resolveStore(id, slot = 0) {
  return propsById.get(id) ?? slotStores[slot] ?? propsById.get('{HTML-ITEM}');
}

function getLocalPropertyForSlot(slot) {
  return (name, id) => {
  hostCalls.push(['GetLocalPropertyAsync', name, id]);
  const asyncId = nextAsyncId('source_feature_get');
  queueMicrotask(() => {
    const store = resolveStore(id, slot);
    globalThis.OnAsyncCallback(asyncId, store.get(name) ?? '');
  });
  return asyncId;
  };
}

function setLocalPropertyForSlot(slot) {
  return (name, value, id) => {
  hostCalls.push(['SetLocalPropertyAsync', name, value, id]);
  const asyncId = nextAsyncId('source_feature_set');
  queueMicrotask(() => {
    const store = resolveStore(id, slot);
    store.set(name, value);
    globalThis.OnAsyncCallback(asyncId, '0');
  });
  return asyncId;
  };
}

globalThis.external = {
  SearchVideoItem(id) {
    hostCalls.push(['SearchVideoItem', id]);
    slotStores[0] = propsById.get(id);
    return '0';
  },
  SearchVideoItem2(id) {
    hostCalls.push(['SearchVideoItem2', id]);
    slotStores[1] = propsById.get(id);
    return '0';
  },
  GetLocalPropertyAsync: getLocalPropertyForSlot(0),
  GetLocalPropertyAsync2: getLocalPropertyForSlot(1),
  SetLocalPropertyAsync: setLocalPropertyForSlot(0),
  SetLocalPropertyAsync2: setLocalPropertyForSlot(1),
  GetVideoDuration(file) {
    hostCalls.push(['GetVideoDuration', file]);
    queueMicrotask(() => {
      globalThis.OnGetVideoDuration(encodeURIComponent(file), file.includes('missing') ? '' : '123456');
    });
    return '0';
  },
};

const xjs = await import(new URL('../../dist/xjs.mjs', import.meta.url));

const html = new xjs.HtmlItem({ id: '{HTML-ITEM}', srcid: '{HTML-SRC}', sceneId: '0', type: xjs.ItemTypes.HTML });
assert.equal(await html.getURL(), 'https://example.test/widget.html');
assert.equal(await html.setURL('https://example.test/updated.html'), html);
assert.equal(propsById.get('{HTML-ITEM}').get('prop:item'), 'https://example.test/updated.html*{"configUrl":"https://example.test/config.html"}');
assert.equal(await html.isBrowserTransparent(), true);
assert.equal(await html.enableBrowserTransparency(false), html);
assert.equal(await html.isBrowserTransparent(), false);
assert.equal((await html.getBrowserCustomSize()).getWidth(), 640);
assert.equal(await html.setBrowserCustomSize(xjs.Rectangle.fromDimensions(800, 450)), html);
assert.equal(propsById.get('{HTML-ITEM}').get('prop:BrowserSize'), '1600,900');
assert.equal(await html.getAllowRightClick(), false);
assert.equal(await html.setAllowRightClick(true), html);
assert.equal(await html.getAllowRightClick(), true);
assert.equal(await html.getBrowserJS(), 'console.log("ready")');
assert.equal(await html.getCustomCSS(), 'body { color: red; }');
assert.equal(await html.getBrowserLoadStatus(), 'LOADED');
assert.equal(await html.isSourceAvailable(), true);

const screen = new xjs.ScreenItem({ id: '{SCREEN-ITEM}', srcid: '{SCREEN-SRC}', sceneId: '0', type: xjs.ItemTypes.SCREEN });
assert.equal(await screen.isStickToTitle(), true);
assert.equal(await screen.setStickToTitle(false), screen);
assert.equal(await screen.isStickToTitle(), false);
assert.equal(await screen.getCaptureLayered(), false);
assert.equal(await screen.setCaptureLayered(true), screen);
assert.equal(await screen.getCaptureLayered(), true);
assert.equal(await screen.getOptimizedCapture(), true);
assert.equal(await screen.getShowMouse(), true);
assert.equal(await screen.setShowMouse(false), screen);
assert.equal(await screen.getShowMouse(), false);
assert.equal(await screen.getShowMouseClicks(), false);
assert.equal(await screen.setShowMouseClicks(true), screen);
assert.equal(await screen.getShowMouseClicks(), true);
assert.equal((await screen.getCaptureArea()).toCoordinateString(), '10,20,310,220');
assert.equal(await screen.setCaptureArea(xjs.Rectangle.fromCoordinates(50, 60, 250, 260)), screen);
assert.equal((await screen.getCaptureArea()).toCoordinateString(), '50,60,250,260');
assert.equal(await screen.isClientArea(), true);
assert.equal(await screen.setClientArea(false), screen);
assert.equal(await screen.isClientArea(), false);

const replay = new xjs.ReplayItem({ id: '{REPLAY-ITEM}', srcid: '{REPLAY-SRC}', sceneId: '0', type: xjs.ItemTypes.REPLAY });
assert.equal(await replay.getChannel(), 'Local Recording');
assert.equal(await replay.setChannel('Local Streaming'), replay);
assert.equal(await replay.getChannel(), 'Local Streaming');
assert.equal(await replay.getHotkey(), 123);
assert.equal(await replay.setHotkey(456), replay);
assert.equal(await replay.getReplayTime(), 30);
assert.equal(await replay.setReplayTime(60), replay);
await assert.rejects(() => replay.setReplayTime(121), /up to 120/);
assert.equal(await replay.getReplayState(), 1);
assert.equal(await replay.stopReplay(), replay);
assert.equal(await replay.getReplayState(), 0);
assert.equal(await replay.isAutostartOnSceneLoad(), false);
assert.equal(await replay.setAutostartOnSceneLoad(true), replay);
assert.equal(await replay.isAutostartOnSceneLoad(), true);

const camera = new xjs.CameraItem({ id: '{CAMERA-ITEM}', srcid: '{CAMERA-SRC}', sceneId: '0', type: xjs.ItemTypes.LIVE });
assert.equal(await camera.getDeviceId(), '@device:pnp:\\\\camera');
assert.equal((await camera.getResolution()).toDimensionString(), '1920,1080');
assert.equal(await camera.getAudioOffset(), 20);
await assert.rejects(() => camera.getAudioInput(), /No tied audio input/);
assert.equal(await camera.isStreamPaused(), false);
assert.equal(await camera.setStreamPaused(true), camera);
assert.equal(await camera.isStreamPaused(), true);
assert.equal(await camera.isHardwareEncoder(), false);
assert.equal(await camera.isActive(), true);
assert.equal(await camera.getDelay(), 10);
assert.equal(await camera.setForceDeinterlace(true), camera);
assert.equal(await camera.isForceDeinterlace(), true);

const playlist = new xjs.VideoPlaylistItem({ id: '{PLAYLIST-ITEM}', srcid: '{PLAYLIST-SRC}', sceneId: '0', type: xjs.ItemTypes.FILE });
assert.equal(await playlist.getVideoNowPlaying(), 'C:\\media\\a.mp4');
assert.deepEqual(await playlist.getVideoPlaylistSources(), ['C:\\media\\a.mp4', 'C:\\media\\b.mp4']);
assert.equal(await playlist.setVideoNowPlaying('C:\\media\\b.mp4'), playlist);
assert.equal(propsById.get('{PLAYLIST-ITEM}').get('prop:srcitem'), 'C:\\media\\b.mp4*1');
await assert.rejects(() => playlist.setVideoNowPlaying('C:\\media\\missing.mp4'), /File not found/);
assert.equal(await playlist.isSourceAvailable(), true);

assert.equal(hostCalls.some((call) => call[0] === 'SearchVideoItem'), true);
