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

const itemId = '{VISUAL-ITEM}';
const props = new Map([
  ['prop:alpha', '64'],
  ['prop:cc_brightness', '10'],
  ['prop:cc_contrast', '-5'],
  ['prop:cc_hue', '45'],
  ['prop:cc_saturation', '25'],
  ['prop:border', '0'],
  ['prop:cc_dynamicrange', '0'],
  ['prop:key_chromakey', '0'],
  ['prop:key_chromakeytype', '0'],
  ['prop:key_antialiasing', '1'],
  ['prop:key_chromabr', '100'],
  ['prop:key_chromasat', '120'],
  ['prop:key_chromahue', '90'],
  ['prop:key_chromarang', '80'],
  ['prop:key_chromaranga', '70'],
  ['prop:key_chromargbkeyprimary', '1'],
  ['prop:key_chromargbkeythresh', '50'],
  ['prop:key_chromargbkeybalance', '60'],
  ['prop:key_colorrang', '40'],
  ['prop:key_colorranga', '30'],
  ['prop:key_colorrgb', '00FF00'],
  ['prop:visible', '1'],
  ['prop:transitionid', 'fade'],
  ['prop:transitiontime', '500'],
  ['prop:edgeeffectid', ''],
  ['prop:edgeeffectmaskmode', '0'],
  ['prop:edgeeffectmask', ''],
  ['prop:edgeeffectcfg', ''],
  ['prop:effects', '<effects/>'],
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
  const asyncId = nextAsyncId('visual_get');
  queueMicrotask(() => {
    globalThis.OnAsyncCallback(asyncId, props.get(name) ?? '');
  });
  return asyncId;
}

function setLocalProperty(name, value) {
  hostCalls.push(['SetLocalPropertyAsync', name, value]);
  const asyncId = nextAsyncId('visual_set');
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
};

const xjs = await import(new URL('../../dist/xjs.mjs', import.meta.url));
const item = new xjs.HtmlItem({
  id: itemId,
  srcid: '{VISUAL-SOURCE}',
  sceneId: '0',
  type: xjs.ItemTypes.HTML,
});

assert.equal(await item.getTransparency(), 64);
assert.equal(await item.setTransparency(128), item);
assert.equal(await item.getTransparency(), 128);
assert.equal(await item.setBrightness(-20), item);
assert.equal(await item.getBrightness(), -20);
assert.equal(await item.setContrast(30), item);
assert.equal(await item.getContrast(), 30);
assert.equal(await item.setHue(-45), item);
assert.equal(await item.getHue(), -45);
assert.equal(await item.setSaturation(75), item);
assert.equal(await item.getSaturation(), 75);
await assert.rejects(() => item.setTransparency(256), /range 0-255/);
await assert.rejects(() => item.setBrightness(-101), /range -100 to 100/);
await assert.rejects(() => item.setHue(181), /range -180 to 180/);

assert.equal((await item.getBorderColor()).isTransparent(), true);
const borderColor = xjs.Color.fromRGBString('#336699');
assert.equal(await item.setBorderColor(borderColor), item);
assert.equal(props.get('prop:border'), String(borderColor.getIbgr() - 0x80000000));
assert.equal(await item.isFullDynamicColorRange(), false);
assert.equal(await item.setFullDynamicColorRange(true), item);
assert.equal(await item.isFullDynamicColorRange(), true);

assert.equal(await item.isChromaEnabled(), false);
assert.equal(await item.setChromaEnabled(true), item);
assert.equal(await item.isChromaEnabled(), true);
assert.equal(await item.setKeyingType(xjs.KeyingType.RGBKEY), item);
assert.equal(await item.getKeyingType(), xjs.KeyingType.RGBKEY);
assert.equal(await item.setChromaAntiAliasLevel(xjs.ChromaAntiAliasLevel.HIGH), item);
assert.equal(await item.getChromaAntiAliasLevel(), xjs.ChromaAntiAliasLevel.HIGH);
assert.equal(await item.setChromaLegacyBrightness(101), item);
assert.equal(await item.getChromaLegacyBrightness(), 101);
assert.equal(await item.setChromaLegacySaturation(121), item);
assert.equal(await item.getChromaLegacySaturation(), 121);
assert.equal(await item.setChromaLegacyHue(91), item);
assert.equal(await item.getChromaLegacyHue(), 91);
assert.equal(await item.setChromaLegacyThreshold(81), item);
assert.equal(await item.getChromaLegacyThreshold(), 81);
assert.equal(await item.setChromaLegacyAlphaSmoothing(71), item);
assert.equal(await item.getChromaLegacyAlphaSmoothing(), 71);
assert.equal(await item.setChromaRGBKeyPrimaryColor(xjs.ChromaPrimaryColors.BLUE), item);
assert.equal(await item.getChromaRGBKeyPrimaryColor(), xjs.ChromaPrimaryColors.BLUE);
assert.equal(await item.setChromaRGBKeyThreshold(51), item);
assert.equal(await item.getChromaRGBKeyThreshold(), 51);
assert.equal(await item.setChromaRGBKeyExposure(61), item);
assert.equal(await item.getChromaRGBKeyExposure(), 61);
assert.equal(await item.setChromaColorKeyThreshold(41), item);
assert.equal(await item.getChromaColorKeyThreshold(), 41);
assert.equal(await item.setChromaColorKeyExposure(31), item);
assert.equal(await item.getChromaColorKeyExposure(), 31);
assert.equal((await item.getChromaColorKeyColor()).getRgb(), '00FF00');
const chromaColorKey = xjs.Color.fromRGBString('#123456');
assert.equal(await item.setChromaColorKeyColor(chromaColorKey), item);
assert.equal(props.get('prop:key_colorrgb'), String(chromaColorKey.getIbgr()));
await assert.rejects(() => item.setKeyingType(3), /KeyingType/);
await assert.rejects(() => item.setChromaLegacyHue(181), /0-180/);

assert.equal(await item.isVisible(), true);
assert.equal(await item.setVisible(false), item);
assert.equal(await item.isVisible(), false);
assert.equal(String(await item.getTransition()), 'fade');
assert.equal(await item.setTransition(xjs.Transition.NONE), item);
assert.equal(await item.getTransition(), xjs.Transition.NONE);
assert.equal(await item.setTransitionTime(1200), item);
assert.equal(await item.getTransitionTime(), 1200);
await assert.rejects(() => item.setTransition('fade'), /Transition object/);
await assert.rejects(() => item.setTransitionTime(60001), /range 0 to 60000/);

assert.equal(await item.getMaskEffect(), xjs.MaskEffect.NONE);
assert.equal(await item.setMaskEffect(xjs.MaskEffect.SHAPE), item);
assert.equal(await item.getMaskEffect(), xjs.MaskEffect.SHAPE);
assert.equal(await item.setBorderEffectRadius(25), item);
assert.equal(await item.getBorderEffectRadius(), 25);
assert.equal(await item.setBorderEffectThickness(15), item);
assert.equal(await item.getBorderEffectThickness(), 15);
assert.equal(await item.setBorderEffectOpacity(80), item);
assert.equal(await item.getBorderEffectOpacity(), 80);
assert.equal(await item.setBorderEffectColor(xjs.Color.fromRGBString('#FF8800')), item);
assert.equal((await item.getBorderEffectColor()).getRgb(), 'FF8800');
assert.equal(await item.setShadowEffectColor(xjs.Color.fromRGBString('#112233')), item);
assert.equal((await item.getShadowEffectColor()).getRgb(), '112233');
assert.equal(await item.setShadowEffectThickness(20), item);
assert.equal(await item.getShadowEffectThickness(), 20);
assert.equal(await item.setShadowEffectBlur(30), item);
assert.equal(await item.getShadowEffectBlur(), 30);
assert.equal(await item.setShadowEffectOpacity(70), item);
assert.equal(await item.getShadowEffectOpacity(), 70);
assert.equal(await item.setShadowEffectOffsetX(-10), item);
assert.equal(await item.getShadowEffectOffsetX(), -10);
assert.equal(await item.setShadowEffectOffsetY(12), item);
assert.equal(await item.getShadowEffectOffsetY(), 12);
await assert.rejects(() => item.setBorderEffectRadius(101), /0 - 100/);
await assert.rejects(() => item.setShadowEffectOffsetX(-101), /-100 to 100/);

assert.equal(await item.setMaskEffect(xjs.MaskEffect.FILE_BIND_TO_STAGE), item);
assert.equal(await item.getMaskEffect(), xjs.MaskEffect.FILE_BIND_TO_STAGE);
assert.equal(await item.setFileMask('C:\\Masks\\round.png'), item);
assert.equal(await item.getFileMask(), 'C:\\Masks\\round.png');
assert.equal(await item.isFileMaskingGuideVisible(), false);
assert.equal(await item.showFileMaskingGuide(true), item);
assert.equal(await item.isFileMaskingGuideVisible(), true);

assert.equal(String(await item.getFilter()), 'none');
assert.equal(await item.setFilter(xjs.Filter.COOL, { intensity: 55 }), item);
assert.equal(String(await item.getFilter()), 'cool');
assert.deepEqual(await item.getFilterConfig(), { intensity: 55.00000000000001 });
assert.equal(
  await item.setFilter(xjs.Filter.LUT, {
    intensity: 25,
    resourceFile: 'C:\\LUTs\\warm.cube',
  }),
  item
);
assert.equal(String(await item.getFilter()), 'lut');
assert.deepEqual(await item.getFilterConfig(), {
  intensity: 25,
  resourceFile: 'C:\\LUTs\\warm.cube',
});
assert.equal(await item.removeFilter(), item);
assert.equal(String(await item.getFilter()), 'none');
await assert.rejects(() => item.setFilter('missing-filter'), /Filter non-existent/);

assert.equal(
  hostCalls.some((call) => call[0] === 'SearchVideoItem'),
  true
);
assert.equal(props.get('prop:alpha'), '128');
assert.equal(props.get('prop:cc_dynamicrange'), '1');
assert.equal(props.get('prop:key_chromakey'), '1');
assert.equal(props.get('prop:visible'), '0');
assert.equal(props.get('prop:transitiontime'), '1200');
assert.equal(props.get('prop:edgeeffectid'), '');
assert.equal(props.get('prop:edgeeffectmaskmode'), '4');
assert.equal(props.get('prop:edgeeffectmask'), 'C:\\Masks\\round.png');
assert.match(props.get('prop:effects'), /<effects\/>/);
