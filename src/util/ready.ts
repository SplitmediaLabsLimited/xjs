/// <reference path="../../defs/es6-promise.d.ts" />

import {setMockVersion} from '../internal/util/version';
import init from '../internal/init';

let isReady: boolean = false;
let readyPromise: Promise<any> = new Promise(resolve => {
  document.addEventListener('xsplit-js-ready', () => {
    resolve();
  });

  if (isReady) {
    resolve();
  }
});

export function ready(config: Object): Promise<any> {
  if (config && config['version'] !== undefined) {
    setMockVersion(config['version']);
  }

  init();

  return readyPromise;
}

export function setReady() {
  isReady = true;
}
