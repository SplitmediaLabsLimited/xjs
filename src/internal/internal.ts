/// <reference path="../../defs/window.d.ts" />

import {Remote} from './remote'

export var DEBUG: boolean = false;

let _callbacks = {};
let counter = 0;

/**
* Executes an external function
*/
export function exec(funcName: string, ...args: any[]) {
  return new Promise(resolve => {
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

      console.log('Send this to Proxy::', message)
      Remote.sendMessage(encodeURIComponent(message));
    } else if (Remote.remoteType === 'proxy') {
      // console.log('Proxy Got::', funcName, args)
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
        _callbacks[counter] = callback;
      } else if (Remote.remoteType === 'proxy') {
        _callbacks[ret] = callback;
      } else {
        _callbacks[ret] = callback;
      }
    }

    if (Remote.remoteType === 'proxy' && typeof(ret) !== 'number') {
      console.log('Sync Proxy::', ret)
      _callbacks[ret].call(this, decodeURIComponent(ret))
    } else {
      resolve(ret);
    }
  })
}

// Only used by remote to use saved callback
export function callCallback(message) {
  return new Promise(resolve => {
    let result = JSON.parse(message);
    console.log('Remote Final Callback::', result)
    if (typeof(result['asyncId']) === 'number') {
      _callbacks[result['asyncId']].apply(this, [result['result']]);
    }
    resolve(result['result']);
  })
}

window.OnAsyncCallback = function(asyncID: number, result: string) {
  // Used by proxy to return Async calls
  if (Remote.remoteType === 'proxy') {
    console.log('Async Proxy::', result)
    let callback = _callbacks[asyncID];

    callback.call(this, decodeURIComponent(result));
  } else {
    let callback = _callbacks[asyncID];

    if (callback instanceof Function) {
      callback.call(this, decodeURIComponent(result));
    }
  }
}
