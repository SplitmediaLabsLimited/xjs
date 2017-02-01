/// <reference path="../../defs/window.d.ts" />

import {Remote} from './remote'

export var DEBUG: boolean = false;

let _callbacks = {};
Remote.remoteAsyncId = 0;

/**
* Executes an external function
*/
export function exec(funcName: string, ...args: any[]) {
  Remote.remoteAsyncId++;
  let callback: Function = null,
  ret: any = false;

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

  if (
    window.external &&
    window.external[funcName] &&
    window.external[funcName] instanceof Function
    ) {
    ret = window.external[funcName].apply(this, args);
  }

  let retObj = {
    'result': ret,
    'asyncId': Remote.remoteAsyncId
  }

  // register callback if present
  if (callback !== null) {
    _callbacks[ret] = callback;
  }

  if (Remote.remoteType === 'proxy' && typeof(ret) !== 'number') {
    return Remote.sendMessage(JSON.stringify(retObj));
  }

  return ret;
}

window.OnAsyncCallback = function(asyncID: number, result: string) {
  let retObj = {
    'result': result,
    'asyncId': Remote.remoteAsyncId
  }

  if (Remote.remoteType === 'proxy') {
    return Remote.sendMessage(JSON.stringify(retObj));
  } else {
    let callback = _callbacks[Remote.remoteAsyncId];

    if (callback instanceof Function) {
      callback.call(this, decodeURIComponent(result));
    }
  }
}
