/// <reference path="../../defs/window.d.ts" />

import {Remote} from './remote';
import window from '../util/window';

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
    // For Remote, parse message and send to proxy
    if (Remote.remoteType === 'remote') {
      counter++;
      let message = {};

      if (args.length >= 1) {
        message = {
          funcName,
          args,
          asyncId: counter,
          type: 'exec'
        }
      } else {
        message = {
          funcName,
          asyncId: counter,
          type: 'exec'
        }
      }

      Remote.sendMessage(encodeURIComponent(JSON.stringify(message)));
    }

    if (
      window.external &&
      window.external[funcName] &&
      window.external[funcName] instanceof Function
    ) {
      ret = window.external[funcName](...args);
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
    } else { //if Remote and Sync create its callback
      if (Remote.remoteType === 'remote' ) {
        _remoteCallbacks[counter] = result => {
          resolve(result);
        }
      }
    }

    // Sync calls end here for proxy and local
    if (Remote.remoteType === 'proxy' && typeof(ret) !== 'number') {
      if (_proxyCallbacks[ret] !== undefined) {
        let result = _proxyCallbacks[ret](decodeURIComponent(ret));
        delete _proxyCallbacks[ret];
        resolve(result);
      } else {
        resolve(ret);  
      }
    } else if (Remote.remoteType === 'local') {
      resolve(ret);
    }
  })
}

// Only used by remote to use saved callback
export function finalCallback(message) {
  return new Promise(resolve => {
    const result = JSON.parse(message);
    if (typeof(result['asyncId']) === 'number'
      && _remoteCallbacks[result['asyncId']] !== undefined) {
      _remoteCallbacks[result['asyncId']](result['result']);
      delete _remoteCallbacks[result['asyncId']];
    } else {
      resolve(result['result']);
    }
  })
}

let asyncCallback = window.OnAsyncCallback;
window.OnAsyncCallback = function(asyncID: number, result: string) {
  // Used by proxy to return Async calls
  if (Remote.remoteType === 'proxy') {
    let callback = _proxyCallbacks[asyncID];
    if (callback instanceof Function) {
      callback(decodeURIComponent(result));
      delete _proxyCallbacks[asyncID];
    }
  } else {
    let callback = _callbacks[asyncID];

    if (callback instanceof Function) {
      callback(decodeURIComponent(result));
      delete _callbacks[asyncID];
    }
  }

  if(typeof asyncCallback === 'function') {
    asyncCallback(asyncID, result);
  }
}
