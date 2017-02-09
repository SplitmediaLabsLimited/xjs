/// <reference path="../../defs/window.d.ts" />

import {Remote} from './remote'

export var DEBUG: boolean = false;

let _callbacks = {};
let _proxyCallbacks = {};
let _remoteCallbacks = {};
let counter = 0;

/**
* Executes an external function
*/
export function exec(funcName: string, ...args: any[]): Promise<any> {
  return new Promise((resolve, reject) => {
    let callback: Function = null;
    let ret: any = false;

    if (args.length > 0) {
      callback = args[args.length - 1];
      if (callback instanceof Function) {
        args.pop();
      } else {
        callback = null;
      }
    }

    if (DEBUG) {
      console.log([
        'internal.exec("', funcName, '") ', JSON.stringify(args)
      ].join(' '));
    }

    // For Remote
    if (Remote.remoteType === 'remote') {
      counter++;
      let message;

      if (args.length >= 1) {
        message = [
          funcName, String(args), counter
        ].join()
      } else {
        message = [
          funcName, counter
        ].join()
      }

      Remote.sendMessage(encodeURIComponent(message));
    }

    if (
      window.external &&
      window.external[funcName] &&
      window.external[funcName] instanceof Function
    ) {
      ret = window.external[funcName].apply(this, args);
    }

    // register callback if present
    if (callback !== null) {
      if (Remote.remoteType === 'remote') {
        _remoteCallbacks[counter] = callback;
      } else if (Remote.remoteType === 'proxy') {
        _proxyCallbacks[ret] = callback;
      } else {
        _callbacks[ret] = callback;
      }
    } else { //if Remote and Sync create a callback
      if (Remote.remoteType === 'remote' ) {
        _remoteCallbacks[counter] = result => {
          resolve(result);
        }
      }
    }

    if (Remote.remoteType === 'proxy' && typeof(ret) !== 'number') {
      _proxyCallbacks[ret].call(this, decodeURIComponent(ret))
    } else if (Remote.remoteType === 'local') {
      resolve(ret);
    }
  })
}

// Only used by remote to use saved callback
export function callCallback(message) {
  return new Promise(resolve => {
    let result = JSON.parse(message);
    if (typeof(result['asyncId']) === 'number'
      && _remoteCallbacks[result['asyncId']] !== undefined) {
      _remoteCallbacks[result['asyncId']].apply(this, [result['result']]);
    } else {
      resolve(result['result']);
    }
  })
}

window.OnAsyncCallback = function(asyncID: number, result: string) {
  // Used by proxy to return Async calls
  if (Remote.remoteType === 'proxy') {
    let callback = _proxyCallbacks[asyncID];

    callback.call(this, decodeURIComponent(result));
  } else {
    let callback = _callbacks[asyncID];

    if (callback instanceof Function) {
      callback.call(this, decodeURIComponent(result));
    }
  }
}
