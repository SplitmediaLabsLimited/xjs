/// <reference path="../../defs/es6-promise.d.ts" />
import {exec, finalCallback} from './internal';
import {setMockVersion} from '../internal/util/version';
import {finishReady} from '../util/ready';
import {EventManager} from './eventmanager';
import {ChannelManager} from '../core/channelmanager';
import {EventEmitter} from '../util/eventemitter';
import {IO} from '../util/io';
import {Extension} from '../core/extension';
import {Output} from '../core/output';

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
          if (message.indexOf('setVersion') === -1) {
            messageObj = JSON.parse(decodeURIComponent(message))
            switch(messageObj['type']) {
              case 'exec':
                Remote.execHandler(message);
                break;
              case 'event-emitter':
                Remote.eventEmitterHandler(message);
                break;
              case 'window':
                Remote.windowHandler(message);
                break;
              case 'extWindow':
                Remote.extWindowHandler(message);
                break;
              case 'broadcastChannels':
                Remote.broadcastChannelsHandler(message);
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
              case 'event-emitter':
                Remote.eventEmitterHandler(message);
                break;
              case 'window':
                Remote.windowHandler(message);
                break;
              case 'extWindow':
                Remote.extWindowHandler(message);
                break;
              case 'broadcastChannels':
                Remote.broadcastChannelsHandler(message);
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
  private static execHandler(message:string) {
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

  // Hanndle emit on/off events
  private static eventEmitterHandler(message:string) {
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

  // Hanndle emit on/off events
  private static windowHandler(message:string) {
    return new Promise(resolve => {
      if (Remote.remoteType === 'remote') {
        IO.finalCallback(message);
      } else if (Remote.remoteType === 'proxy') {
        let messageObj = JSON.parse(decodeURIComponent(message));
        messageObj['callback'] = (result => {
          let retObj = {
            duration: result,
            file: messageObj['file'],
            type: 'window'
          }
          resolve(
            Remote.sendMessage(
              encodeURIComponent(JSON.stringify(retObj))
          ))
        })
        let messageArr = [messageObj['file'],
                    messageObj['callback']]
        IO.getVideoDuration.call(this, messageArr)
      }
    })
  }

  private static extWindowHandler(message: string) {
    return new Promise(resolve => {
      if (Remote.remoteType === 'remote') {
        Extension.finalCallback(message)
      } else if (Remote.remoteType === 'proxy') {
        let messageObj = JSON.parse(decodeURIComponent(message));
        messageObj['callback'] = (result => {
          let retObj = {
            id: result,
            type: 'extWindow'
          }
          resolve(
            Remote.sendMessage(
              encodeURIComponent(JSON.stringify(retObj))
          ))
        })
        let Ext = messageObj['instance'] = new Extension()
        Ext.getId(messageObj['callback'])
      }
    })
  }

  private static broadcastChannelsHandler(message: string) {
    return new Promise(resolve => {
      if (Remote.remoteType === 'remote') {
        Output.finalCallback(message)
      } else if (Remote.remoteType === 'proxy') {
        let messageObj = JSON.parse(decodeURIComponent(message));
        messageObj['callback'] = (result => {
          let retObj = {
            channels: result,
            type: 'broadcastChannels'
          }
          resolve(
            Remote.sendMessage(
              encodeURIComponent(JSON.stringify(retObj))
          ))
        })
        Output._getBroadcastChannels(messageObj['id'], messageObj['callback'])
      }
    })
  }
}
