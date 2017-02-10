/// <reference path="../../defs/es6-promise.d.ts" />
import {exec, finalCallback} from './internal';
import {setMockVersion} from '../internal/util/version';
import {finishReady} from '../util/ready';

export class Remote {
  private static isVersion = false;

  static receiveMessage(message: string) {
    let messageObj = {};
    let result;
    return new Promise((resolve, reject) => {
      if (Remote.remoteType === 'remote') {
        // Receive version on first message from proxy
        if(!Remote.isVersion && message.indexOf('setVersion') !== -1) {
          Remote.isVersion = true
          resolve(finishReady({message}))
        } else {
          if (message.indexOf('setVersion') !== -1) {
            reject(Error('Version was already set.'))
          } else {
            finalCallback(decodeURIComponent(message)).then(result => {
              resolve(result)
            });
          }
        }
      } else if (Remote.remoteType === 'proxy') {
        if (message !== undefined) {
          if (message === 'getVersion') {
            // First message to get and send version
            Remote.sendMessage('setVersion:: ' + window.navigator.appVersion);
            resolve(true);
          } else {
            // Succeeding messages, actual exec calls.
            messageObj = JSON.parse(decodeURIComponent(message))
            messageObj['callback'] = (result => {
              let retObj = {
                result,
                asyncId: Number(messageObj['asyncId'])
              }
              resolve(Remote.sendMessage(encodeURIComponent(JSON.stringify(retObj))))
            })
            let messageArr = [messageObj['funcName'],
                    messageObj['args'] ? String(messageObj['args']) : undefined,
                    messageObj['callback']]
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
