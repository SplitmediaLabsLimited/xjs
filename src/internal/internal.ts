/// <reference path="../../defs/window.d.ts" />

import {Remote} from './remote'

export var DEBUG: boolean = false;

let _callbacks = {};
let remoteAsyncId: number = 100;

/**
* Executes an external function
*/
export function exec(funcName: string, ...args: any[]) {
  remoteAsyncId++
  let callback: Function = null,
  ret: any = false;
  let remoteCheck;

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

  Remote.sendMessage(ret,remoteAsyncId)
  // register callback if present
  if (callback !== null) {
    _callbacks[ret] = callback;
  }

  return ret;
}

window.OnAsyncCallback = function(asyncID: number, result: string) {
  let callback = _callbacks[asyncID];

  if (callback instanceof Function) {
    callback.call(this, decodeURIComponent(result));
  }
}