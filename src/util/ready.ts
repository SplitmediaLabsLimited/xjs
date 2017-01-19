/// <reference path="../../defs/es6-promise.d.ts" />

import {setMockVersion} from '../internal/util/version';
import init from '../internal/init';

let isReady: boolean = false;
let isInit: boolean = false;
let remoteType: string = 'local';
let sendMessage: string;
const connection = new WebSocket('ws://localhost:1337');

let readyPromise: Promise<any> = new Promise(resolve => {
  document.addEventListener('xsplit-js-ready', () => {
    resolve();
  });

  if (isReady) {
    resolve();
  }
});

export function ready(config: Object): Promise<any> {
  console.log(config)
  if (config && config['version'] !== undefined) {
    setMockVersion(config['version']);
  }
  if (config && config['remote'] !== undefined) {
    if(config['remote']['type'] !== undefined) {
      remoteType = config['remote']['type'];
      sendMessage = config['remote']['sendMessage'];
    }
  }

  setReady();
  if (isReady && !isInit) {
    setOnce();
    init(connection);
    if(remoteType === 'proxy') {
      getRemoteVersion()
    }
  }

  return readyPromise;
}

export function setReady() {
  isReady = true;
}

export function setOnce() {
  isInit = true;
}

export function getRemoteVersion() {
  let xbcPattern = /XSplit Broadcaster\s(.*?)\s/;
  let xbcMatch = navigator.appVersion.match(xbcPattern);
}