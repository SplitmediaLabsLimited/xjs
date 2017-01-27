/// <reference path="../../defs/es6-promise.d.ts" />
import {exec} from './internal'
import {setMockVersion} from '../internal/util/version';

export class Remote {

  static receiveMessage(message: string) {
    let messageArr;
    let isVersion = false;

    if (Remote.remoteType === 'remote') {
      console.log('Receive::', message, Remote.remoteType)
      if(!isVersion) {
        setMockVersion(message)
        isVersion = true
      } else {
        // Do something with return here
      }
    } else if (Remote.remoteType === 'proxy') {
      console.log('Receive::', message, Remote.remoteType)
      if (message !== undefined) {
        // decode message here first
        if (message === 'getVersion') {
          Remote.sendMessage(window.navigator.appVersion)
        } else {
          exec(message)
        }
      }
    }
  }

  static sendMessage;

  static remoteType = 'local';
}