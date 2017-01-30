/// <reference path="../../defs/es6-promise.d.ts" />
import {exec} from './internal'
import {setMockVersion} from '../internal/util/version';

export class Remote {
  static isVersion = false;

  static receiveMessage(message: string) {
    let messageArr = [];
    return new Promise(resolve => {
      if (Remote.remoteType === 'remote') {
        if(!Remote.isVersion) {
          setMockVersion(message)
          Remote.isVersion = true
          resolve(message)
        } else {
          // Do something with return here
          let result = JSON.parse(message)
          resolve(result)
        }
      } else if (Remote.remoteType === 'proxy') {
        console.log('Received::', message)
        if (message !== undefined) {
          messageArr = message.split(',')
          // decode message here first
          if (message === 'getVersion' || messageArr[0] === 'getVersion') {
            Remote.sendMessage(window.navigator.appVersion);
            resolve(true);
          } else {
            resolve(exec.apply(this, messageArr));
          }
        }
      }
    })
  }

  static sendMessage;

  static remoteType = 'local';
}
