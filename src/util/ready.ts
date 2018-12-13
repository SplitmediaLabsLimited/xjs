/// <reference path="../../defs/es6-promise.d.ts" />

import {setMockVersion} from '../internal/util/version';
import init from '../internal/init';
import {Remote} from '../internal/remote'
import {Environment} from '../core/environment';
import {_subscribeEventManager} from '../core/channelmanager'

let isReady: boolean = false;
let isInit: boolean = false;
let readyResolve;

function readyPromise(): Promise<any> {
  return new Promise(resolve => {
    if (typeof document !== 'undefined') {
      document.addEventListener('xsplit-js-ready', () => {
        resolve();
      });
    }

    if (isReady) {
      resolve();
    }
  });
}

export function finishReady(config: Object): Promise<any> {
  return new Promise(resolve => {
    if (config && config['version'] !== undefined) {
      setMockVersion(config['version']);
    }

    setReady();
    if (isReady && !isInit) {
      _subscribeEventManager()
      setOnce();
      init(config);
    }

    if (readyResolve !== undefined && Remote.remoteType === 'remote'){
      readyResolve.call(this, null);
    }
    resolve(readyPromise);

  })
}

export function ready(config: Object): Promise<any> {
  return new Promise((resolve,reject) => {
    Environment.initialize();
    if (config && config['remote'] !== undefined) {
      if(config['remote']['type'] !== undefined) {
        Remote.remoteType = config['remote']['type'];
      }
      if(config['remote']['sendMessage'] !== undefined
        && config['remote']['sendMessage'] instanceof Function) {
        Remote.sendMessage = config['remote']['sendMessage'];
      } else {
        reject(Error('Send message should be instance of function.'))
      }
    }

    if(Remote.remoteType === 'remote') {
      // Create a callback that would resolve ready()
      // Resolve ready() for Remote once finishReady was already called.
      readyResolve = () => { resolve () };

      Remote.sendMessage('getVersion');
    } else {
      resolve(finishReady(config));
    }
  })
}

export function setReady() {
  isReady = true;
}

export function setOnce() {
  isInit = true;
}
