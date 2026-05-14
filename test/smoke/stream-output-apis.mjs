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
const recstatXml = [
  '<stat>',
  '<channel name="Local Streaming">',
  '<stat video="21800992" audio="1383326" output="29635585" frmdropped="0" frmcoded="145267"/>',
  '<channel serviceName="LocalStreaming" name="Local Streaming" displayName="Local Streaming"/>',
  '</channel>',
  '</stat>',
].join('');

Object.defineProperty(globalThis, 'navigator', {
  configurable: true,
  value: {
    appVersion: 'XSplit Broadcaster 3.8.1905.2118 ',
  },
});

globalThis.external = {
  AppGetPropertyAsync(name) {
    hostCalls.push(['AppGetPropertyAsync', name]);
    callbackId += 1;
    const asyncId = `stream_${callbackId}`;
    queueMicrotask(() => {
      if (name === 'recstat') {
        globalThis.OnAsyncCallback(asyncId, encodeURIComponent(recstatXml));
      } else if (name === 'streamdrops:Local Streaming') {
        globalThis.OnAsyncCallback(asyncId, '10,813');
      } else if (name === 'streamtime:Local Streaming') {
        globalThis.OnAsyncCallback(asyncId, '100000');
      } else {
        globalThis.OnAsyncCallback(asyncId, '');
      }
    });
    return asyncId;
  },
  GetGlobalProperty(name) {
    hostCalls.push(['GetGlobalProperty', name]);
    if (name === 'bandwidthusage-all') {
      return JSON.stringify([
        { ChannelName: 'Local Streaming', AvgBitrate: 536, Dropped: 10, NotDropped: 946 },
        { ChannelName: 'Local Recording', AvgBitrate: 0, Dropped: 0, NotDropped: 0 },
      ]);
    }
    return '';
  },
  CallHostFunc(funcName, ...params) {
    hostCalls.push(['CallHostFunc', funcName, ...params]);
    return '0';
  },
  CallHost(funcName, ...params) {
    hostCalls.push(['CallHost', funcName, ...params]);
    return '0';
  },
};

const xjs = await import(new URL('../../dist/xjs.mjs', import.meta.url));

const channels = await xjs.StreamInfo.getActiveStreamChannels();
assert.equal(channels.length, 1);
const [channel] = channels;
assert.equal(await channel.getName(), 'Local Streaming');
assert.equal(await channel.getStreamDrops(), 10);
assert.equal(await channel.getStreamRenderedFrames(), 813);
assert.equal(await channel.getStreamTime(), 10000);
assert.equal(await channel.getBandwidthUsage(), 536);
assert.equal(await channel.getGOPDrops(), 10);

assert.equal(await xjs.Output.setSceneToRecord(''), true);
assert.equal(await xjs.Output.setSceneToRecord(2), true);
await assert.rejects(() => xjs.Output.setSceneToRecord(0), /Invalid parameters/);
assert.equal(await xjs.Output.startLocalRecording(), true);
assert.equal(await xjs.Output.stopLocalRecording(), true);
assert.equal(await xjs.Output.pauseLocalRecording(), true);
assert.equal(await xjs.Output.unpauseLocalRecording(), true);

assert.deepEqual(
  hostCalls.filter((call) => call[0] === 'CallHostFunc' || call[0] === 'CallHost'),
  [
    ['CallHostFunc', 'setSceneToRecord', '-1'],
    ['CallHostFunc', 'setSceneToRecord', '1'],
    ['CallHostFunc', 'startBroadcast', 'Local Recording', 'suppressPrestreamDialog=1'],
    ['CallHostFunc', 'stopBroadcast', 'Local Recording'],
    ['CallHostFunc', 'pauseRecording', 'Local Recording'],
    ['CallHostFunc', 'unpauseRecording', 'Local Recording'],
  ]
);
