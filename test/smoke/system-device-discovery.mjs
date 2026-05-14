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

const propertyXml = {
  wasapienum: [
    '<list>',
    '<dev name="Speakers (XSplit Stream Audio Renderer)" adapter="XSplit" adapterdev="Speakers" id="xsplit" DataFlow="Render" State="Active"/>',
    '<dev name="Microphone (HD Webcam C615)" adapter="HD Webcam C615" adapterdev="Microphone" id="mic-1" DataFlow="Capture" State="Active" DSoundGuid="{MIC}" DefaultConsole="1" DefaultMultimedia="1" level="0.500000" enable="1" hwlevel="0.800000" hwenable="1" delay="1000"/>',
    '<dev name="Stereo Mix (Realtek)" adapter="Realtek" adapterdev="Stereo Mix" id="mix-1" DataFlow="Capture" State="Not present"/>',
    '<dev name="Speakers (Realtek)" adapter="Realtek" adapterdev="Speakers" id="speaker-1" DataFlow="Render" State="Active"/>',
    '</list>',
  ].join(''),
  'dshowenum:vsrc': [
    '<list>',
    '<dev disp="@DEVICE:PNP:\\\\?\\USB#VID_8086&PID_0A66&MI_02#" name="Intel(R) RealSense(TM) 3D Camera Virtual Driver"/>',
    '<dev disp="clsid:{39F50F4C-99E1-464A-B6F9-D605B4FB5918}" name="Elgato Game Capture HD"/>',
    '<dev disp="@device:pnp:\\\\?\\usb#vid_046d&pid_082c#global" name="HD Webcam C615"/>',
    '<dev disp="@device:sw:{VHSplitProc}_XSplitBroadcaster_1_staticsource_VIDEO" name="XSplitBroadcaster"/>',
    '</list>',
  ].join(''),
  gsenum: [
    '<configuration>',
    '<src pid="6304" handle="378066208" hwnd="656086" GapiType="DX9" width="800" height="600" flags="1" wndname="Terraria" lastframets="10075574" fpsRender="47.804348" fpsCapture="30.000000" imagename="Terraria.exe" replace="0"/>',
    '</configuration>',
  ].join(''),
  'dshowenum:asrc': [
    '<list>',
    '<dev disp="@device:cm:\\\\wave:{MIC1}" name="Microphone A" WaveInId="0"/>',
    '<dev disp="@device:sw:{VHSplitProc}_XSplitBroadcaster_1_staticsource_AUDIO" name="XSplitBroadcaster"/>',
    '<dev disp="@device:cm:\\\\wave:{NOID}" name="No Wave"/>',
    '</list>',
  ].join(''),
};

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
    hostCalls.push(['AppGetPropertyAsync', name]);
    callbackId += 1;
    const asyncId = `devices_${callbackId}`;
    queueMicrotask(() => {
      globalThis.OnAsyncCallback(asyncId, encodeURIComponent(propertyXml[name] ?? ''));
    });
    return asyncId;
  },
};

const xjs = await import(new URL('../../dist/xjs.mjs', import.meta.url));

const audioDevices = await xjs.System.getAudioDevices();
assert.equal(audioDevices.length, 2);
assert.deepEqual(
  audioDevices.map((device) => device.getName()),
  ['Microphone (HD Webcam C615)', 'Speakers (Realtek)']
);
assert.equal(audioDevices[0].getId(), 'mic-1');
assert.equal(audioDevices[0].getDataFlow(), 'Capture');
assert.equal(audioDevices[0].isDefaultDevice(), true);
assert.equal(audioDevices[0].getLevel(), 50);
assert.equal(audioDevices[0].isEnabled(), true);
assert.equal(audioDevices[0].getSystemLevel(), 80);
assert.equal(audioDevices[0].getSystemEnabled(), 1);
assert.equal(audioDevices[0].getDelay(), 1000);
assert.match(audioDevices[0].toString(), /id="mic-1"/);

const captureDevices = await xjs.System.getAudioDevices(xjs.AudioDeviceDataflow.CAPTURE);
assert.deepEqual(
  captureDevices.map((device) => device.getName()),
  ['Microphone (HD Webcam C615)']
);

const allDevices = await xjs.System.getAudioDevices(
  xjs.AudioDeviceDataflow.ALL,
  xjs.AudioDeviceState.ALL
);
assert.deepEqual(
  allDevices.map((device) => device.getName()),
  ['Microphone (HD Webcam C615)', 'Stereo Mix (Realtek)', 'Speakers (Realtek)']
);

const cameras = await xjs.System.getCameraDevices();
assert.deepEqual(
  cameras.map((camera) => camera.getName()),
  ['Elgato Game Capture HD', 'HD Webcam C615']
);
assert.equal(cameras[1].getId(), '@device:pnp:\\\\?\\usb#vid_046d&pid_082c#global');
assert.match(cameras[1].toXML().toString(), /HD Webcam C615/);

const games = await xjs.System.getGames();
assert.equal(games.length, 1);
assert.equal(games[0].getPid(), 6304);
assert.equal(games[0].getHandle(), 378066208);
assert.equal(games[0].getWindowHandle(), 656086);
assert.equal(games[0].getGapiType(), 'DX9');
assert.equal(games[0].getResolution().getWidth(), 800);
assert.equal(games[0].getResolution().getHeight(), 600);
assert.equal(games[0].isFullscreen(), true);
assert.equal(games[0].getWindowName(), 'Terraria');
assert.equal(games[0].getLastFrameTimestamp(), 10075574);
assert.equal(games[0].getFpsRender(), 47.804348);
assert.equal(games[0].getFpsCapture(), 30);
assert.equal(games[0].getImageName(), 'Terraria.exe');
assert.equal(games[0].getReplace(), '0');

const autoDetectGame = xjs.Game.autoDetect();
assert.equal(autoDetectGame.getPid(), 0);
assert.equal(autoDetectGame.getResolution().getWidth(), 0);
assert.equal(autoDetectGame.getWindowName(), '');
assert.equal(autoDetectGame.getFpsCapture(), 0);

const microphones = await xjs.System.getMicrophones();
assert.equal(microphones.length, 1);
assert.equal(microphones[0].getName(), 'Microphone A');
assert.equal(microphones[0].getDisplayId(), '@device:cm:\\\\wave:{MIC1}');
assert.match(microphones[0].toXML().toString(), /Microphone A/);

assert.deepEqual(hostCalls, [
  ['AppGetPropertyAsync', 'wasapienum'],
  ['AppGetPropertyAsync', 'wasapienum'],
  ['AppGetPropertyAsync', 'wasapienum'],
  ['AppGetPropertyAsync', 'dshowenum:vsrc'],
  ['AppGetPropertyAsync', 'gsenum'],
  ['AppGetPropertyAsync', 'dshowenum:asrc'],
]);
