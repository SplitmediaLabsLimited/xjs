/// <reference path="../../defs/window.d.ts" />

import {Remote} from './remote'

export var DEBUG: boolean = false;

let _callbacks = {};
let _remoteCallbacks = {};
let remoteAsyncId = 0;
let remoteAsync = []

/**
* Executes an external function
*/
export function exec(funcName: string, ...args: any[]) {
  let retObj = {}
  let callback: Function = null,
  ret: any = false;

  if (Remote.remoteType === 'proxy') {
      remoteAsyncId++;
      remoteAsync.push(remoteAsyncId)
  }

  if (args.length > 0) {
    callback = args[args.length - 1];
    if (callback instanceof Function) {
      args.pop();
    } else {
      callback = null;
    }
  }

  // For Remote
  if (Remote.remoteType === 'remote') {
    let message = [
      funcName, String(args)
    ].join(',')

    if (message.indexOf('result') !== -1
          && message.indexOf('asyncId') !== -1) {

      let result = JSON.parse(funcName)
      _remoteCallbacks[remoteAsync[0]].apply(this, [result['result']]);

      delete _remoteCallbacks[result['func']]
      remoteAsync.shift()
      return message;
    } else {
      remoteAsyncId++;
      if (callback !== null) {
        _remoteCallbacks[remoteAsyncId] = callback;
      }
      remoteAsync.push(remoteAsyncId)
      Remote.sendMessage(message)
    }
  }

  if (DEBUG) {
    console.log([
      'internal.exec("', funcName, '") ', JSON.stringify(args)
      ].join(' '));
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
    _callbacks[ret] = callback;
  }

  // For Proxy
  if (Remote.remoteType === 'proxy' && typeof(ret) !== 'number') {
    retObj = {
      'result': ret,
      'asyncId': remoteAsync[0]
    }
    remoteAsync.shift()

    return Remote.sendMessage(JSON.stringify(retObj));
  }

  return ret;
}

window.OnAsyncCallback = function(asyncID: number, result: string) {

  if (Remote.remoteType === 'proxy') {
    let retObj = {
      'result': result,
      'asyncId': remoteAsync[0],
    }
    remoteAsync.shift()
    return Remote.sendMessage(JSON.stringify(retObj));
  } else {
    let callback = _callbacks[asyncID];

    if (callback instanceof Function) {
      callback.call(this, decodeURIComponent(result));
    }
  }
}
