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

const transitionPayload = [
  {
    Id: 'stinger:C:\\Program Files\\XSplit\\Stinger_1100.webm,11000000',
    Name: 'Stinger: 1100ms',
    Content: null,
    Type: '.webm',
  },
  { Id: 'fade', Name: 'Fade', Content: null, Type: '.re3' },
  { Id: 'none', Name: 'None', Content: null, Type: null },
];

let transitionsEnabled = true;
const hostCalls = [];
let callbackId = 0;

Object.defineProperty(globalThis, 'navigator', {
  configurable: true,
  value: {
    appVersion: 'XSplit Broadcaster 3.8.1905.2118 ',
  },
});

globalThis.external = {
  AppGetPropertyAsync(name) {
    callbackId += 1;
    const asyncId = `channel_${callbackId}`;
    queueMicrotask(() => {
      if (name === 'streamdrops:Local Streaming') {
        globalThis.OnAsyncCallback(asyncId, '10,77048');
      } else {
        globalThis.OnAsyncCallback(asyncId, '');
      }
    });
    return asyncId;
  },
  GetGlobalProperty(name) {
    hostCalls.push(['GetGlobalProperty', name]);
    if (name === 'transitions' && transitionsEnabled) {
      return JSON.stringify(transitionPayload);
    }
    return '';
  },
};

const xjs = await import(new URL('../../dist/xjs.mjs', import.meta.url));

assert.equal(String(xjs.Transition.FADE), 'fade');
assert.equal(xjs.Transition.FADE.toTransitionKey(), 'FADE');
const inferredStinger = new xjs.Transition(
  'stinger:C:\\Transitions\\BlackBerry_18450.webm,184500000'
);
assert.equal(inferredStinger.toTransitionKey(), 'BlackBerry: 18450ms');
assert.equal(String(inferredStinger), 'stinger:C:\\Transitions\\BlackBerry_18450.webm,184500000');

const transitions = await xjs.Transition.getSceneTransitions();
assert.deepEqual(
  transitions.map((transition) => transition.toTransitionKey()),
  ['None', 'Fade', 'Stinger: 1100ms']
);
assert.deepEqual(transitions.map(String), [
  'none',
  'fade',
  'stinger:C:\\Program Files\\XSplit\\Stinger_1100.webm,11000000',
]);

transitionsEnabled = false;
assert.deepEqual(await xjs.Transition.getSceneTransitions(), []);

const streamStart = new Promise((resolve) => {
  xjs.ChannelManager.on('stream-start', resolve);
});
const streamEnd = new Promise((resolve) => {
  xjs.ChannelManager.on('stream-end', resolve);
});
const recordingRenamed = new Promise((resolve) => {
  xjs.ChannelManager.on('recording-renamed', resolve);
});

const channelSettings =
  '<channel serviceName="LocalStreaming" name="Local Streaming" displayName="Local Streaming"/>';
xjs.ChannelManager.emit(
  'stream-start',
  encodeURIComponent(
    JSON.stringify({
      ChannelName: 'Local Streaming',
      Settings: channelSettings,
    })
  )
);
xjs.ChannelManager.emit(
  'stream-end',
  encodeURIComponent(
    JSON.stringify({
      ChannelName: 'Local Streaming',
      Settings: channelSettings,
      Dropped: 10,
      NotDropped: 77048,
      StreamTime: 54500,
      Audio: 1383326,
      Video: 21800992,
      Output: 29635585,
    })
  )
);
xjs.ChannelManager.emit(
  'recording-renamed',
  encodeURIComponent(
    JSON.stringify({
      old: 'old-file.mp4',
      new: encodeURIComponent('C:\\Recordings\\new-file.mp4'),
    })
  )
);

const startEvent = await streamStart;
assert.equal(startEvent.error, false);
assert.equal(await startEvent.channel.getName(), 'Local Streaming');
assert.equal(startEvent.streamTime, undefined);

const endEvent = await streamEnd;
assert.equal(endEvent.error, false);
assert.equal(await endEvent.channel.getName(), 'Local Streaming');
assert.equal(await endEvent.channel.getStreamDrops(), 10);
assert.equal(await endEvent.channel.getStreamRenderedFrames(), 77048);
assert.equal(endEvent.streamTime, 5450);

const renameEvent = await recordingRenamed;
assert.deepEqual(renameEvent, {
  error: false,
  recordingInfo: {
    oldName: 'old-file.mp4',
    newName: 'new-file.mp4',
    fullPath: 'C:\\Recordings\\new-file.mp4',
  },
});

xjs.ChannelManager.on('stream-start', (event) => {
  assert.equal(event.error, true);
});
xjs.ChannelManager.emit('stream-start', '%E0%A4%A');

assert.deepEqual(hostCalls, [
  ['GetGlobalProperty', 'transitions'],
  ['GetGlobalProperty', 'transitions'],
]);
