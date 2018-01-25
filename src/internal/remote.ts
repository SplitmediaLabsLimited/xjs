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

/**
 * This class is used as a middleware for communication for a remote and proxy
 * xjs. Receiving, Sending and Routing of messages is done here to make the
 * calls reach their supposed methods, be processed and then returned to the
 * caller as if it is just running locally.
 *
 * Note that this class does not create/handle the connection used to send/receive
 * messages and should be declared initially upon readying the xjs, together with
 * what type it is (remote/proxy).
 * You can use websockets, datachannnels, etc... for this.
 *
 * Initial declaration on ready:
 *
 * ```javascript
 * var xjs = require('xjs');
 *
 * xjs.ready({
 *  remote: {
 *    type: 'remote' // remote/proxy, default is local
 *    sendMessage: function(message) {
 *      myConnection.send(message) // this will be assigned to Remote.sendMessage
 *    }
 *  }
 * })
 *
 * // Then handle received messages(string) should be passed to
 * xjs.Remote.receiveMessage(message)
 * ```
 *
 * Once this is set up, you can already use xjs normally as if you are just making
 * calls locally.
 */

export class Remote {
  private static _isVersion = false;

  /**
   * Initial assignment should be done on xjs.ready()
   * Assign preferred method of sending message.
   */
  static sendMessage;

  /**
   * Initial assignment should be done on xjs.ready()
   * Types:
   *  - local (default)
   *  - remote
   *  - proxy
   */
  static remoteType = 'local';

  /**
   * param: (value: string)
   *
   * Handles received messages to properly relay it to either the proxy
   * and make the actual calls, or remote and return the results from
   * proxy.
   *
   */
  static receiveMessage(message: string) {
    let messageObj = {};

    return new Promise((resolve, reject) => {
      if (Remote.remoteType === 'remote' && !Remote._isVersion && message.indexOf('setVersion') !== -1) {
        // Receive version on first message from proxy
        Remote._isVersion = true;
        let mockVersion = message;
        let msgArray = message.split("::");
        if (typeof msgArray[1] !== 'undefined') {
          mockVersion = msgArray[1];
        }
        resolve(finishReady({version: mockVersion}));
      } else if (Remote.remoteType === 'proxy' && message !== undefined && message === 'getVersion') {
        // First message to get and send version
        Remote.sendMessage('setVersion::' + window.navigator.appVersion);
        resolve(true);
      } else if (Remote.remoteType === 'local') {
        reject(Error('Remote calls do not work on local mode.'));
      }

      if (message !== undefined) {
        try {
          messageObj = JSON.parse(decodeURIComponent(message))
        } catch(e) {
          // ....
        }
      }

      if (Object.keys(messageObj).length !== 0) {
        switch(messageObj['type']) {
          case 'exec':
            Remote._execHandler(message);
            break;
          case 'event-emitter':
            Remote._eventEmitterHandler(message);
            break;
          case 'event-manager':
            Remote._eventManagerHandler(message);
            break;
          case 'window':
            Remote._allWindowHandler(message);
            break;
          case 'extWindow':
            Remote._allWindowHandler(message);
            break;
          case 'broadcastChannels':
            Remote._allWindowHandler(message);
            break;
          default:
            reject(Error('Call type is undefined.'))
            break;
        }
      }
    })
  }

  // Handle exec messages
  private static _execHandler(message:string) {
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
          let messageArr = [messageObj['funcName'], ...messageObj['args'] ,
                  messageObj['callback']];
          exec.apply(this, messageArr);
        })
      }
    })
  }

  // Handle emit on/off events
  private static _eventEmitterHandler(message:string) {
    return new Promise(resolve => {
      if (Remote.remoteType === 'remote') {
        EventEmitter._finalCallback(message);
      } else if (Remote.remoteType === 'proxy') {
        let messageObj = JSON.parse(decodeURIComponent(message));
        messageObj['callback'] = (result => {
          let retObj = {
            result,
            type: 'event-emitter',
            id: messageObj['id'],
            event: messageObj['event']
          }
          resolve(
            Remote.sendMessage(
              encodeURIComponent(JSON.stringify(retObj))
          ))
        })
        let messageArr = [messageObj['event'],
                    messageObj['callback'],messageObj['id']]
        EventEmitter._setCallback.call(this, messageArr)
      }
    })
  }

  private static _eventManagerHandler(message:string) {
    return new Promise(resolve => {
      if (Remote.remoteType === 'remote') {
        EventManager._finalCallback(message);
      } else if (Remote.remoteType === 'proxy') {
        let messageObj = JSON.parse(decodeURIComponent(message));
        messageObj['callback'] = (result => {
          let retObj = {
            result,
            type: 'event-manager',
            id: messageObj['id'],
            event: messageObj['event']
          }
          resolve(
            Remote.sendMessage(
              encodeURIComponent(JSON.stringify(retObj))
          ))
        })
        let messageArr = [messageObj['event'],
                    messageObj['callback'],messageObj['id']]
                    EventManager._setCallback.call(this, messageArr)
      }
    })
  }

  private static _allWindowHandler(message:string) {
    return new Promise(resolve => {
      if (Remote.remoteType === 'remote') {
        let messageObj = JSON.parse(decodeURIComponent(message));
        if (messageObj['type'] === 'window') {
          IO._finalCallback(message);
        } else if (messageObj['type'] === 'extWindow') {
          Extension._finalCallback(message)
        } else if (messageObj['type'] === 'broadcastChannels') {
          Output._finalCallback(message)
        } else if (messageObj['type'] === 'event-manager') {
          EventManager._finalCallback(message)
        }
      } else if (Remote.remoteType === 'proxy') {
        let messageObj = JSON.parse(decodeURIComponent(message));
        messageObj['callback'] = (result => {
          let retObj = {
            result,
            file: messageObj['file'],
            type: messageObj['type']
          }
          resolve(
            Remote.sendMessage(
              encodeURIComponent(JSON.stringify(retObj))
          ))
        })
        if (messageObj['type'] === 'window') {
          let messageArr = [messageObj['file'],
                      messageObj['callback']]
          IO.getVideoDuration.call(this, messageArr)
        } else if (messageObj['type'] === 'extWindow') {
          let Ext = messageObj['instance'] = new Extension()
          Ext.getId(messageObj['callback'])
        } else if (messageObj['type'] === 'broadcastChannels') {
          Output._getBroadcastChannels(messageObj['id'], messageObj['name'], messageObj['callback'])
        } else if (messageObj['type'] === 'event-manager') {
          EventManager._finalCallback(messageObj['event'])
        }
      }
    })
  }
}
