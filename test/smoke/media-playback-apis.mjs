import assert from 'node:assert/strict';

console.warn = () => {};

const itemId = '{MEDIA-ITEM}';
const props = new Map([
  ['prop:srcitem', 'C:\\media\\intro.mp4'],
  ['prop:FilePlaylist', 'C:\\media\\intro.mp4*0*1*10000000*100*0*0*0*0*0|'],
  ['prop:name', 'Intro'],
  ['prop:volume', '75'],
  ['prop:mute', '0'],
  ['prop:keepaudio', '1'],
  ['prop:sounddev', '0'],
  ['prop:audioavail', '1'],
  ['sync:syncable', '1'],
  ['sync:position', '25000000'],
  ['sync:duration', '90000000'],
  ['sync:state', 'stopped'],
  ['prop:InPoint', '10000000'],
  ['prop:OutPoint', '80000000'],
  ['prop:OpWhenFinished', '0'],
  ['prop:StartOnLoad', '0'],
  ['prop:fdeinterlace', '0'],
  ['prop:RememberPosition', '1'],
  ['prop:ShowPosition', '0'],
  ['prop:CuePoints', '30000000p,60000000r'],
]);
const hostCalls = [];
let callbackId = 0;

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

function getLocalProperty(name) {
  hostCalls.push(['GetLocalPropertyAsync', name]);
  const asyncId = nextAsyncId('media_get');
  queueMicrotask(() => {
    if (name === 'itemlist') {
      globalThis.OnAsyncCallback(asyncId, itemId);
    } else {
      globalThis.OnAsyncCallback(asyncId, props.get(name) ?? '');
    }
  });
  return asyncId;
}

function setLocalProperty(name, value) {
  hostCalls.push(['SetLocalPropertyAsync', name, value]);
  const asyncId = nextAsyncId('media_set');
  queueMicrotask(() => {
    props.set(name, value);
    globalThis.OnAsyncCallback(asyncId, '0');
  });
  return asyncId;
}

globalThis.external = {
  SearchVideoItem(id) {
    hostCalls.push(['SearchVideoItem', id]);
    return '0';
  },
  GetLocalPropertyAsync: getLocalProperty,
  GetLocalPropertyAsync2: getLocalProperty,
  SetLocalPropertyAsync: setLocalProperty,
  SetLocalPropertyAsync2: setLocalProperty,
};

const xjs = await import(new URL('../../dist/xjs.mjs', import.meta.url));
const media = new xjs.MediaItem({
  id: itemId,
  srcid: '{MEDIA-SOURCE}',
  sceneId: '0',
  type: xjs.ItemTypes.FILE,
  item: 'C:\\media\\intro.mp4',
});

assert.equal(await media.getVolume(), 75);
assert.equal(await media.setVolume(150), media);
assert.equal(props.get('prop:volume'), '100');
assert.equal(await media.setVolume(-10), media);
assert.equal(props.get('prop:volume'), '0');
assert.equal(await media.isMute(), false);
assert.equal(await media.setMute(true), media);
assert.equal(await media.isMute(), true);
assert.equal(await media.isAutoMute(), false);
assert.equal(await media.setAutoMute(true), media);
assert.equal(props.get('prop:keepaudio'), '0');
assert.equal(await media.isStreamOnlyAudio(), false);
assert.equal(await media.setStreamOnlyAudio(true), media);
assert.equal(await media.isStreamOnlyAudio(), true);
assert.equal(await media.isAudioAvailable(), true);

assert.equal(await media.isSeekable(), true);
assert.equal(await media.getPlaybackPosition(), 2.5);
assert.equal(await media.setPlaybackPosition(4.25), media);
assert.equal(props.get('sync:position'), '42500000');
assert.equal(await media.getPlaybackDuration(), 9);
assert.equal(await media.isPlaying(), false);
assert.equal(await media.setPlaying(true), media);
assert.equal(await media.isPlaying(), true);
assert.equal(await media.getPlaybackStartPosition(), 1);
assert.equal(await media.setPlaybackStartPosition(2), media);
assert.equal(props.get('prop:InPoint'), '20000000');
assert.equal(await media.getPlaybackEndPosition(), 8);
assert.equal(await media.setPlaybackEndPosition(7), media);
assert.equal(props.get('prop:OutPoint'), '70000000');
assert.equal(await media.getActionAfterPlayback(), xjs.ActionAfterPlayback.NONE);
assert.equal(await media.setActionAfterPlayback(xjs.ActionAfterPlayback.LOOP), media);
assert.equal(props.get('prop:OpWhenFinished'), String(xjs.ActionAfterPlayback.LOOP));
assert.equal(await media.isAutostartOnSceneLoad(), false);
assert.equal(await media.setAutostartOnSceneLoad(true), media);
assert.equal(await media.isAutostartOnSceneLoad(), true);
assert.equal(await media.isForceDeinterlace(), false);
assert.equal(await media.setForceDeinterlace(true), media);
assert.equal(await media.isForceDeinterlace(), true);
assert.equal(await media.isRememberingPlaybackPosition(), true);
assert.equal(await media.setRememberingPlaybackPosition(false), media);
assert.equal(await media.isRememberingPlaybackPosition(), false);
assert.equal(await media.isShowingPlaybackPosition(), false);
assert.equal(await media.setShowingPlaybackPosition(true), media);
assert.equal(await media.isShowingPlaybackPosition(), true);

const cuePoints = await media.getCuePoints();
assert.equal(cuePoints.length, 2);
assert.equal(cuePoints[0].getTime(), 3);
assert.equal(cuePoints[0].getAction(), xjs.CuePoint.PAUSE);
assert.equal(await media.setCuePoints([new xjs.CuePoint(5, xjs.CuePoint.CUT)]), media);
assert.equal(props.get('prop:CuePoints'), '50000000s');

assert.equal(await media.isVideo(), true);
assert.equal(await media.isAudio(), false);
assert.equal(await media.getValue(), 'C:\\media\\intro.mp4');
assert.equal(await media.setValue('C:\\media\\updated.mov'), media);
assert.equal(props.get('prop:srcitem'), 'C:\\media\\updated.mov');
assert.equal(props.get('prop:name'), 'C:\\media\\updated.mov');
assert.equal(props.get('prop:CuePoints'), '');
await assert.rejects(() => media.setValue('C:\\media\\not-supported.txt'), /valid media type/);

assert.equal(
  hostCalls.some((call) => call[0] === 'SearchVideoItem'),
  true
);
