/// <reference path="../../defs/es6-promise.d.ts" />

import {setMockVersion} from '../internal/util/version';
import init from '../internal/init';
import {Remote} from '../internal/remote'

let isReady: boolean = false;
let isInit: boolean = false;

let readyPromise: Promise<any> = new Promise(resolve => {
  document.addEventListener('xsplit-js-ready', () => {
    resolve();
  });

  if (isReady) {
    resolve();
  }
});

export function ready(config: Object): Promise<any> {
  return new Promise(resolve => {
    if (config && config['remote'] !== undefined) {
      if(config['remote']['type'] !== undefined) {
        Remote.remoteType = config['remote']['type'];
      }
      if(config['remote']['sendMessage'] !== undefined) {
        Remote.sendMessage = config['remote']['sendMessage'];
      }
    }

    if(Remote.remoteType === 'remote') {
      Remote.sendMessage('getVersion');
    } else if (Remote.remoteType === 'proxy') {
      setMockVersion(window.navigator.appVersion);
    }
    if (config && config['version'] !== undefined) {
      setMockVersion(config['version']);
    }

    setReady();
    if (isReady && !isInit) {
      setOnce();
      init();
    }

    resolve(readyPromise);
  })
}

export function setReady() {
  isReady = true;
}

export function setOnce() {
  isInit = true;
}
