import assert from 'node:assert/strict';

console.warn = () => {};

const itemId = '{ITEM-1}';
const props = new Map([
  ['prop:name', 'Initial Name'],
  ['prop:cname', 'Initial Custom'],
  ['prop:item', 'C:\\media\\intro.mp4'],
  ['prop:keeploaded', '1'],
  ['prop:type', '8'],
  ['prop:viewid', '0'],
  ['prop:keep_ar', '1'],
  ['prop:lockmove', '0'],
  ['prop:mipmaps', '0'],
  ['prop:pos', '0,0,0.5,0.5'],
  ['prop:crop', '0,0,0,0'],
  ['prop:rotate_x', '0'],
  ['prop:rotate_y', '0'],
  ['prop:rotate_z', '0'],
  ['prop:rotate_canvas', '0'],
  ['prop:zorder', '0'],
  ['stats:frames', '100'],
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
  const asyncId = nextAsyncId('item_get');
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
  const asyncId = nextAsyncId('item_set');
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
  SearchVideoItem2(id) {
    hostCalls.push(['SearchVideoItem2', id]);
    return '0';
  },
  GetLocalPropertyAsync: getLocalProperty,
  GetLocalPropertyAsync2: getLocalProperty,
  SetLocalPropertyAsync: setLocalProperty,
  SetLocalPropertyAsync2: setLocalProperty,
  GetGlobalProperty(name) {
    hostCalls.push(['GetGlobalProperty', name]);
    if (name === 'preview_editor_opened') {
      return '1';
    }
    return '';
  },
};

const xjs = await import(new URL('../../dist/xjs.mjs', import.meta.url));
const item = new xjs.Item({
  id: itemId,
  srcid: '{SRC-1}',
  sceneId: '2',
  type: xjs.ItemTypes.HTML,
  name: 'Initial Name',
  cname: 'Initial Custom',
  item: 'C:\\media\\intro.mp4',
  keeploaded: '1',
});

assert.equal(await item.getId(), itemId);
assert.equal(await item.setName('Updated Name'), item);
assert.equal(await item.getName(), 'Updated Name');
assert.equal(await item.setCustomName('Updated Custom'), item);
assert.equal(await item.getCustomName(), 'Updated Custom');
assert.equal(String(await item.getValue()), 'C:\\media\\intro.mp4');
assert.equal(await item.setValue('https://example.test/widget.html'), item);
assert.equal(String(await item.getValue()), 'https://example.test/widget.html');
assert.equal(await item.getKeepLoaded(), true);
assert.equal(await item.setKeepLoaded(false), item);
assert.equal(await item.getKeepLoaded(), false);
assert.equal(await item.getType(), xjs.ItemTypes.HTML);
assert.equal(await item.getSceneId(), 3);

assert.equal(await item.isKeepAspectRatio(), true);
assert.equal(await item.setKeepAspectRatio(false), item);
assert.equal(await item.isKeepAspectRatio(), false);
assert.equal(await item.isPositionLocked(), false);
assert.equal(await item.setPositionLocked(true), item);
assert.equal(await item.isPositionLocked(), true);
assert.equal(await item.isEnhancedResizeEnabled(), false);
assert.equal(await item.setEnhancedResizeEnabled(true), item);
assert.equal(await item.isEnhancedResizeEnabled(), true);

const initialPosition = await item.getPosition();
assert.equal(initialPosition.getLeft(), 0);
assert.equal(initialPosition.getRight(), 0.5);
const newPosition = xjs.Rectangle.fromCoordinates(0.25, 0.25, 0.75, 0.75);
assert.equal(await item.setPosition(newPosition), item);
assert.equal((await item.getPosition()).toCoordinateString(), '0.25,0.25,0.75,0.75');

assert.deepEqual(await item.getCropping(), {
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
});
assert.equal(await item.setCropping({ left: 0.1, top: 0.2, right: 0.3, bottom: 0.4 }), item);
assert.deepEqual(await item.getCropping(), {
  left: 0.1,
  top: 0.2,
  right: 0.3,
  bottom: 0.4,
});
await assert.rejects(() => item.setCropping({ left: 0 }), /insufficient properties/);

assert.equal(await item.setRotateX(15), item);
assert.equal(await item.getRotateX(), 15);
assert.equal(await item.setRotateY(-20), item);
assert.equal(await item.getRotateY(), -20);
assert.equal(await item.setRotateZ(30), item);
assert.equal(await item.getRotateZ(), 30);
await assert.rejects(() => item.setRotateX('bad'), /integer/);
await assert.rejects(() => item.setRotateY(361), /Invalid value/);

props.set('prop:viewid', '1');
assert.equal(await item.getView(), xjs.ViewTypes.PREVIEW);

assert.equal(await item.sendBackward(), item);
assert.equal(props.get('prop:zorder'), '-');
assert.match(String(item.toXML()), /id="\{ITEM-1\}"/);
assert.match(String(item.toXML()), /type="8"/);

assert.equal(hostCalls.some((call) => call[0] === 'SearchVideoItem'), true);
assert.equal(props.get('prop:name'), 'Updated Name');
assert.equal(props.get('prop:cname'), 'Updated Custom');
assert.equal(props.get('prop:item'), 'https://example.test/widget.html');
assert.equal(props.get('prop:keeploaded'), '0');
