/// <reference path="../../defs/es6-promise.d.ts" />
import {exec, callCallback} from './internal'
import {setMockVersion} from '../internal/util/version';

export class Remote {
  private static isVersion = false;

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
            callCallback(decodeURIComponent(message)).then(result => {
              resolve(result)
            });
          }
        }
      } else if (Remote.remoteType === 'proxy') {
        if (message !== undefined) {
          messageArr = decodeURIComponent(message).split(',');
          if (message === 'getVersion' || messageArr[0] === 'getVersion') {
            Remote.sendMessage('setVersion:: ' + window.navigator.appVersion);
            resolve(true);
          } else {
            let asyncId = Number(messageArr.pop())
            messageArr.push(result => {
              let retObj = {
                result,
                asyncId
              }
              resolve(Remote.sendMessage(encodeURIComponent(JSON.stringify(retObj))))
            })
            exec.apply(this, messageArr);
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
