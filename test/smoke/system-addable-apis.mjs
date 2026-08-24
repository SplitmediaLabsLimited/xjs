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

const hostCalls = [];
let callbackId = 0;
let defaultPosition = '4';

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
  CallDll(funcName, ...params) {
    hostCalls.push(['CallDll', funcName, ...params]);
    if (funcName === 'xsplit.EnumParentWindows') {
      return '1001,1002';
    }
    if (funcName === 'xsplit.GetWindowTitle') {
      return params[0] === '1001' ? 'Chrome Fixture' : 'XSplit Broadcaster';
    }
    if (funcName === 'xsplit.GetWindowClassName') {
      return params[0] === '1001' ? 'Chrome_WidgetWin_1' : 'XSplitMain';
    }
    if (funcName === 'xsplit.GetWindowProcessId') {
      return params[0] === '1001' ? '14528' : '2000';
    }
    if (funcName === 'xsplit.GetProcessDetailsKernel') {
      return params[0] === '14528'
        ? '\\Device\\Chrome\\chrome.exe'
        : '\\Device\\XSplit\\xsplit.exe';
    }
    return '';
  },
  AppGetPropertyAsync(name) {
    hostCalls.push(['AppGetPropertyAsync', name]);
    callbackId += 1;
    const asyncId = `addable_property_${callbackId}`;
    queueMicrotask(() => {
      if (name === 'scene:0') {
        globalThis.OnAsyncCallback(asyncId, '0');
      } else if (name === 'sceneconfig:0') {
        globalThis.OnAsyncCallback(
          asyncId,
          encodeURIComponent(`<placement name="Scene 1" defpos="${defaultPosition}" />`)
        );
      } else {
        globalThis.OnAsyncCallback(asyncId, '');
      }
    });
    return asyncId;
  },
  AppCallFuncAsync(funcName, ...params) {
    hostCalls.push(['AppCallFuncAsync', funcName, ...params]);
    callbackId += 1;
    const asyncId = `addable_call_${callbackId}`;
    queueMicrotask(() => {
      globalThis.OnAsyncCallback(asyncId, '0');
    });
    return asyncId;
  },
  GetVideoDuration(file) {
    hostCalls.push(['GetVideoDuration', file]);
    queueMicrotask(() => {
      if (file === 'C:\\videos\\clip.mov') {
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

assert.equal(await new xjs.File('C:\\images\\title.png').addToScene(), true);
assert.equal(await xjs.Screen.addToScene(), true);
assert.equal(
  await xjs.Screen.parse({
    title: 'Chrome Fixture',
    class: 'Chrome_WidgetWin_1',
    processDetail: '\\device\\chrome\\chrome.exe',
    hwnd: '1001',
  }).addToScene(),
  true
);

const screens = await xjs.System.getAvailableScreens();
assert.equal(Array.isArray(screens), true);

const playlist = new xjs.VideoPlaylist(['C:\\videos\\clip.mov']);
const playlistXml = await playlist.toXML();
assert.match(String(playlistXml), /name="Video Playlist"/);
assert.match(String(playlistXml), /pos_left="0.25"/);
assert.match(String(playlistXml), /FilePlaylist="C:\\videos\\clip.mov\*0\*1\*22522500/);

defaultPosition = '1';
assert.equal(await new xjs.VideoPlaylist(['C:\\videos\\clip.mov']).addToScene(), true);
await assert.rejects(
  () => new xjs.VideoPlaylist(['C:\\videos\\missing.mov']).addToScene(),
  /One or more files included are invalid/
);
await assert.rejects(() => new xjs.VideoPlaylist([]).addToScene(), /No media file included/);

const appCalls = hostCalls.filter((call) => call[0] === 'AppCallFuncAsync');
assert.equal(appCalls.length, 4);
assert.match(appCalls[0][1], /^e:EVENT-XJS-CREATE-.+\|addfile$/);
assert.equal(appCalls[0][2], 'C:\\images\\title.png');
assert.match(appCalls[1][1], /^e:EVENT-XJS-CREATE-.+\|addscreen$/);
assert.equal(appCalls[1][2], null);
assert.match(appCalls[2][1], /^e:EVENT-XJS-CREATE-.+\|addscreen$/);
assert.match(appCalls[2][2], /window="Chrome Fixture"/);
assert.match(appCalls[3][1], /^e:EVENT-XJS-CREATE-.+\|additem$/);
assert.match(appCalls[3][2], /pos_left="0.5"/);
assert.match(appCalls[3][2], /pos_right="1"/);

assert.equal(
  hostCalls.some((call) => call[0] === 'CallDll' && call[1] === 'xsplit.EnumParentWindows'),
  true
);
