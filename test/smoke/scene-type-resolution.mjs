import assert from 'node:assert/strict';

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

const sceneListXml = [
  '<configuration>',
  '<placement name="Main" id="{11111111-1111-1111-1111-111111111111}" defpos="0"/>',
  '<placement name="Preview" id="{22222222-2222-2222-2222-222222222222}" defpos="1"/>',
  '</configuration>',
].join('');

const sceneItemsXml = [
  '<placement name="Main" id="{11111111-1111-1111-1111-111111111111}" defpos="0">',
  '<item id="{ITEM-HTML}" srcid="{SRC-HTML}" type="8" name="Browser Widget" cname="" item="https://example.test/widget.html" FilePlaylist=""/>',
  '<item id="{ITEM-CAMERA}" srcid="{SRC-CAMERA}" type="2" name="Camera" cname="" item="@device:pnp:\\\\camera" FilePlaylist=""/>',
  '<item id="{ITEM-AUDIO}" srcid="{SRC-AUDIO}" type="2" name="Audio" cname="" item="{33D9A762-90C8-11D0-BD43-00A0C911CE86}" FilePlaylist=""/>',
  '<item id="{ITEM-GAME}" srcid="{SRC-GAME}" type="7" name="Game" cname="" item="&lt;src pid=&quot;6304&quot; handle=&quot;1&quot; hwnd=&quot;2&quot; GapiType=&quot;DX9&quot; width=&quot;800&quot; height=&quot;600&quot;/&gt;" FilePlaylist=""/>',
  '<item id="{ITEM-MEDIA}" srcid="{SRC-MEDIA}" type="1" name="Intro" cname="" item="C:\\\\media\\\\intro.mp4*0" FilePlaylist=""/>',
  '<item id="{ITEM-IMAGE}" srcid="{SRC-IMAGE}" type="1" name="Logo" cname="" item="C:\\\\media\\\\logo.gif" FilePlaylist=""/>',
  '<item id="{ITEM-SCREEN}" srcid="{SRC-SCREEN}" type="5" name="Screen" cname="" item="&lt;screen window=&quot;Chrome&quot;/&gt;" FilePlaylist=""/>',
  '<item id="{ITEM-FLASH}" srcid="{SRC-FLASH}" type="6" name="Flash" cname="" item="C:\\\\media\\\\legacy.swf" FilePlaylist=""/>',
  '<item id="{ITEM-REPLAY}" srcid="{SRC-REPLAY}" type="13" name="Replay" cname="" item="replay" FilePlaylist=""/>',
  '<item id="{ITEM-SCENE}" srcid="{SRC-SCENE}" type="14" name="Scene Source" cname="" item="{22222222-2222-2222-2222-222222222222}" FilePlaylist=""/>',
  '<item id="{ITEM-PLAYLIST}" srcid="{SRC-PLAYLIST}" type="1" name="Video Playlist" cname="" item="C:\\\\media\\\\a.mp4*0" FilePlaylist="C:\\\\media\\\\a.mp4*0*1*100*100*0*0*0*0*0|"/>',
  '<item id="{ITEM-GROUP}" srcid="{SRC-GROUP}" type="12" name="Group" cname="" item="" FilePlaylist=""/>',
  '</placement>',
].join('');

const hostCalls = [];
let callbackId = 0;

Object.defineProperty(globalThis, 'navigator', {
  configurable: true,
  value: {
    appVersion: 'XSplit Broadcaster 3.8.1905.2118 ',
  },
});

globalThis.external = {
  GetGlobalProperty(name) {
    hostCalls.push(['GetGlobalProperty', name]);
    if (name === 'splitmode') {
      return '0';
    }
    return '';
  },
  AppGetPropertyAsync(name) {
    hostCalls.push(['AppGetPropertyAsync', name]);
    callbackId += 1;
    const asyncId = `scene_${callbackId}`;
    queueMicrotask(() => {
      if (name === 'sceneconfig') {
        globalThis.OnAsyncCallback(asyncId, encodeURIComponent(sceneListXml));
      } else if (name === 'sceneconfig:{11111111-1111-1111-1111-111111111111}') {
        globalThis.OnAsyncCallback(asyncId, encodeURIComponent(sceneItemsXml));
      } else if (name === 'scene:0') {
        globalThis.OnAsyncCallback(asyncId, '0');
      } else if (name === 'scenename:{11111111-1111-1111-1111-111111111111}') {
        globalThis.OnAsyncCallback(asyncId, 'Main');
      } else {
        globalThis.OnAsyncCallback(asyncId, '');
      }
    });
    return asyncId;
  },
};

const xjs = await import(new URL('../../dist/xjs.mjs', import.meta.url));
xjs.Environment.initialize();

assert.equal(await xjs.Scene.getSceneCount(), 2);
const scene = await xjs.Scene.getById(1);
assert.equal(await scene.getName(), 'Main');
assert.equal(await scene.getSceneNumber(), 1);
assert.equal(await scene.getSceneIndex(), 0);
assert.equal(await scene.getSceneUid(), '{11111111-1111-1111-1111-111111111111}');

const activeScene = await xjs.Scene.getActiveScene();
assert.equal(await activeScene.getSceneUid(), '{11111111-1111-1111-1111-111111111111}');

const items = await scene.getItems();
assert.equal(items.length, 12);
assert.equal(items[0] instanceof xjs.HtmlItem, true);
assert.equal(items[1] instanceof xjs.CameraItem, true);
assert.equal(items[2] instanceof xjs.AudioItem, true);
assert.equal(items[3] instanceof xjs.GameItem, true);
assert.equal(items[4] instanceof xjs.MediaItem, true);
assert.equal(items[5] instanceof xjs.ImageItem, true);
assert.equal(items[6] instanceof xjs.ScreenItem, true);
assert.equal(items[7] instanceof xjs.FlashItem, true);
assert.equal(items[8] instanceof xjs.ReplayItem, true);
assert.equal(items[9] instanceof xjs.SceneItem, true);
assert.equal(items[10] instanceof xjs.VideoPlaylistItem, true);
assert.equal(items[11] instanceof xjs.GroupItem, true);
assert.equal(await items[0].getSceneId(), 1);

const sources = await scene.getSources();
assert.equal(sources.length, 12);
assert.equal(sources[0] instanceof xjs.HtmlSource, true);
assert.equal(sources[1] instanceof xjs.CameraSource, true);
assert.equal(sources[2] instanceof xjs.AudioSource, true);
assert.equal(sources[3] instanceof xjs.GameSource, true);
assert.equal(sources[4] instanceof xjs.MediaSource, true);
assert.equal(sources[5] instanceof xjs.ImageSource, true);
assert.equal(sources[6] instanceof xjs.ScreenSource, true);
assert.equal(sources[7] instanceof xjs.FlashSource, true);
assert.equal(sources[8] instanceof xjs.ReplaySource, true);
assert.equal(sources[9] instanceof xjs.SceneSource, true);
assert.equal(sources[10] instanceof xjs.VideoPlaylistSource, true);
assert.equal(sources[11] instanceof xjs.Source, true);

await assert.rejects(() => xjs.Scene.getById(100), /Invalid parameter/);
await assert.rejects(() => xjs.Scene.getBySceneUid('{AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA}'), /No matching Scene/);
await assert.rejects(() => xjs.Scene.getBySceneUid('not-a-guid'), /Not a valid Unique ID/);

assert.equal(hostCalls.some((call) => call[1] === 'sceneconfig:{11111111-1111-1111-1111-111111111111}'), true);
