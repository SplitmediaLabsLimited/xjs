/// <reference path="../../defs/es6-promise.d.ts" />
import {exec, finalCallback} from './internal';
import {setMockVersion} from '../internal/util/version';
import {finishReady} from '../util/ready';

export class Remote {
  private static isVersion = false;

  static sendMessage;

  static remoteType = 'local';

  static receiveMessage(message: string) {
    let messageObj = {};

    return new Promise((resolve, reject) => {
      if (Remote.remoteType === 'remote') {
        // Receive version on first message from proxy
        if(!Remote.isVersion && message.indexOf('setVersion') !== -1) {
          Remote.isVersion = true;
          resolve(finishReady({message}));
        } else {
          if (message.indexOf('setVersion') !== -1) {
            reject(Error('Version was already set.'));
          } else {
            messageObj = JSON.parse(decodeURIComponent(message))
            switch(messageObj['type']) {
              case 'exec':
                Remote.execHandler(message);
                break;
              case 'subscribe':
                // Callback method for EventManager
                break;
              case 'emit':
                // Callback method for EventEmitter
                break;
              default:
                reject(Error('Call type is undefined.'))
                break;
            }

          }
        }
      } else if (Remote.remoteType === 'proxy') {
        if (message !== undefined) {
          if (message === 'getVersion') {
            // First message to get and send version
            Remote.sendMessage('setVersion:: ' + window.navigator.appVersion);
            resolve(true);
          } else {
            // Succeeding messages from exec/event/emit
            messageObj = JSON.parse(decodeURIComponent(message));
            switch(messageObj['type']) {
              case 'exec':
                Remote.execHandler(message);
                break;
              case 'subscribe':
                Remote.subscribeHandler(message);
                break;
              case 'emit':
                Remote.emitHandler(message);
                break;
              default:
                reject(Error('Call type is undefined.'))
                break;
            }
          }
        }
      } else if (Remote.remoteType === 'local') {
        reject(Error('Remote calls do not work on local mode.'));
      }
    })
  }

  // Handle exec messages
  static execHandler(message:string) {
    return new Promise(resolve => {
      if (Remote.remoteType === 'remote') {
        finalCallback(decodeURIComponent(message))
        .then(result => {
          resolve(result);
        });
      } else if (Remote.remoteType === 'proxy') {
        let messageObj = {};
        return new Promise((resolve, reject) => {
          messageObj = JSON.parse(decodeURIComponent(message));
          messageObj['callback'] = (result => {
            let retObj = {
              result,
              asyncId: Number(messageObj['asyncId']),
              type: 'exec'
            }
            resolve(
              Remote.sendMessage(
                encodeURIComponent(JSON.stringify(retObj)))
            );
          })
          let messageArr = [messageObj['funcName'],
                  messageObj['args'] ? String(messageObj['args']) : undefined,
                  messageObj['callback']];
          exec.apply(this, messageArr);
        })
      }
    })
  }

  // Handle eventmanager subscribe events
  static subscribeHandler(message:string) {

  }

  // Hanndle eventemitter on/off events
  static emitHandler(message:string) {

  }
}
