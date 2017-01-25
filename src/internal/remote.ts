/// <reference path="../../defs/es6-promise.d.ts" />
import {exec} from './internal'

export class Remote {
  static asyncId;

  static receiveMessage(obj: string) {
    // decode message here first
    console.log('Receive::', obj)
    let funcName = obj['message'];
    Remote.asyncId = obj['asyncId']
    let args = obj['args']
    if (funcName === 'getVersion') {
      Remote.returnMessage(window.navigator.appVersion)
    } else {
      exec(funcName, args)
    }

  }

  static returnMessage;
}