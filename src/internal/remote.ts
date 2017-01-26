/// <reference path="../../defs/es6-promise.d.ts" />
import {exec} from './internal'

export class Remote {

  static receiveMessage(obj: string) {
    let messageArr;
    if (obj !== undefined) {
      messageArr = obj.split(',');
    }
    // decode message here first
    console.log('Receive::', obj)
    try {
      if(messageArr[0] === 'getVersion') {
        Remote.sendMessage(window.navigator.appVersion)
      } else {
        exec(messageArr[0], messageArr)
      }
    } catch(e) {
      return;
    }
  }

  static sendMessage;
}