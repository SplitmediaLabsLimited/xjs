/// <reference path="../../defs/es6-promise.d.ts" />
import {exec, callCallback} from './internal'
import {setMockVersion} from '../internal/util/version';

export class Remote {
  static isVersion = false;

  static receiveMessage(message: string) {
    let messageArr = [];
    let result;
    return new Promise((resolve, reject) => {
      if (Remote.remoteType === 'remote') {
        if(!Remote.isVersion && message.indexOf('setVersion') !== -1) {
          setMockVersion(message)
          Remote.isVersion = true
          resolve(message)
        } else {
          if (message.indexOf('setVersion') !== -1) {
            reject(Error('Version was already set.'))
          } else {
            resolve(callCallback(decodeURIComponent(message)));
          }
        }
      } else if (Remote.remoteType === 'proxy') {
        console.log('Received::', message)
        if (message !== undefined) {
          messageArr = decodeURIComponent(message).split(',')
          // decode message here first
          if (message === 'getVersion' || messageArr[0] === 'getVersion') {
            Remote.sendMessage('setVersion:: ' + window.navigator.appVersion);
            resolve(true);
          } else {
            resolve(exec.apply(this, messageArr));
          }
        }
      } else if (Remote.remoteType === 'local') {
        reject(Error('Remote calls do not work on local mode.'))
      }
    })
  }

  static sendMessage;

  static remoteType = 'local';
}
