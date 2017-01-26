/// <reference path="../../defs/es6-promise.d.ts" />

import {setMockVersion} from '../internal/util/version';
import init from '../internal/init';
import {Remote} from '../internal/remote'

let isReady: boolean = false;
let isInit: boolean = false;
let remoteType: string = 'local';


let readyPromise: Promise<any> = new Promise(resolve => {
  document.addEventListener('xsplit-js-ready', () => {
    resolve();
  });

  if (isReady) {
    resolve();
  }
});

export function ready(config: Object): Promise<any> {
  if (config && config['remote'] !== undefined) {
    if(config['remote']['type'] !== undefined) {
      remoteType = config['remote']['type'];
    }
    if(config['remote']['sendMessage'] !== undefined) {
      Remote.sendMessage = config['remote']['sendMessage'];
    }
  }

  if(remoteType === 'proxy') {
    Remote.sendMessage('getVersion')
  }

  if (config && config['version'] !== undefined) {
    setMockVersion(config['version']);
  }

  setReady();
  if (isReady && !isInit) {
    setOnce();
    init();
  }

  return readyPromise;
}

export function setReady() {
  isReady = true;
}

export function setOnce() {
  isInit = true;
}
