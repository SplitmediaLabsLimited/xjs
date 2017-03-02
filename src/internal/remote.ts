/// <reference path="../../defs/es6-promise.d.ts" />
import {exec, finalCallback} from './internal';
import {setMockVersion} from '../internal/util/version';
import {finishReady} from '../util/ready';
import {EventManager} from './eventmanager';
import {ChannelManager} from '../core/channelmanager';
import {EventEmitter} from '../util/eventemitter';

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
                Remote.subscribeHandler(message)
                break;
              case 'emit':
                Remote.emitHandler(message)
                break;
              case 'event-emitter':
                Remote.eventEmitterHandler(message);
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
              case 'event-emitter':
                Remote.eventEmitterHandler(message);
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
    return new Promise(resolve => {
      if (Remote.remoteType === 'remote') {
        // EventManager.finalCallback(message)
      } else if (Remote.remoteType === 'proxy') {
        let messageObj = JSON.parse(decodeURIComponent(message));
        messageObj['callback'] = (result => {
          let retObj = {
            result,
            type: 'subscribe'
          }
          resolve(
            Remote.sendMessage(
              encodeURIComponent(JSON.stringify(retObj))
          ));
        });
        let messageArr = [messageObj['event'],
                    messageObj['callback']];
        EventManager.subscribe.apply(this, messageArr)
      }
    })
  }

  // Hanndle eventemitter on/off events
  static emitHandler(message:string) {
    return new Promise(resolve => {
      if (Remote.remoteType === 'remote') {
        ChannelManager.finalCallback(message);
      } else if (Remote.remoteType === 'proxy') {
        let messageObj = JSON.parse(decodeURIComponent(message));
        messageObj['callback'] = (result => {
          let retObj = {
            result,
            type: 'emit'
          }
          resolve(
            Remote.sendMessage(
              encodeURIComponent(JSON.stringify(retObj))
          ))
        })
        let messageArr = [messageObj['event'],
                    messageObj['callback']]
        ChannelManager.on.apply(this, messageArr)
      }
    })
  }

  // Hanndle test on/off events
  static eventEmitterHandler(message:string) {
    return new Promise(resolve => {
      if (Remote.remoteType === 'remote') {
        EventEmitter.finalCallback(message);
      } else if (Remote.remoteType === 'proxy') {
        let messageObj = JSON.parse(decodeURIComponent(message));
        messageObj['callback'] = (result => {
          let retObj = {
            result,
            type: 'event-emitter',
            event: messageObj['event']
          }
          resolve(
            Remote.sendMessage(
              encodeURIComponent(JSON.stringify(retObj))
          ))
        })
        let messageArr = [messageObj['event'],
                    messageObj['callback']]
        EventEmitter.setCallback.call(this, messageArr)
      }
    })
  }

}
