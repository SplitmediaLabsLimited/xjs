import {exec} from './internal'
import window from '../util/window';
import {Remote} from './remote'

/**
 * Usage:
 *
 * ```
 * EventManager.subscribe('StreamStart', callback);
 * ```
 *
 * OR
 *
 * ```
 * EventManager.subscribe(['StreamStart', 'StreamEnd'], callback);
 * ```
 */
export class EventManager {
  static callbacks = {};
  static _remoteHandlers = {};
  static _proxyHandlers = {};

  static subscribe(event, _cb, id?) {
    return new Promise(resolve => {
      event = event instanceof Array ? event : [event];
      if (Remote.remoteType === 'remote') {
        let message = {
          event,
          id,
          type: 'event-manager'
        }
        event.forEach(_event => {
          if (EventManager._remoteHandlers[_event] === undefined) {
            EventManager._remoteHandlers[_event] = [];
          }

          if (_event === 'OnSceneAddByUser') {
            exec('AppSubscribeEvents');
          } else if (_event.startsWith('itempropchange_') ||
                     _event.startsWith('itemdestroyed_')) {
            let itemID = _event.split('_')[1];
            exec('ItemSubscribeEvents', itemID);
          }

          EventManager._remoteHandlers[_event].push(_cb);
        });
        Remote.sendMessage(encodeURIComponent(JSON.stringify(message)))
      } else if (Remote.remoteType === 'proxy') {
        event.forEach(_event => {
          if (EventManager._proxyHandlers[_event] === undefined) {
            EventManager._proxyHandlers[_event] = [];
          }

          if (_event === 'OnSceneAddByUser') {
            exec('AppSubscribeEvents');
          } else if (_event.startsWith('itempropchange_') ||
                     _event.startsWith('itemdestroyed_')) {
            let itemID = _event.split('_')[1];
            exec('ItemSubscribeEvents', itemID);
          }

          EventManager._proxyHandlers[_event].push(_cb);
        });
      } else {
        if (event instanceof Array) {
          event.forEach(_event => {
            if (EventManager.callbacks[_event] === undefined) {
              EventManager.callbacks[_event] = [];
            }

            if (_event === 'OnSceneAddByUser') {
              exec('AppSubscribeEvents');
            } else if (_event.startsWith('itempropchange_') ||
                       _event.startsWith('itemdestroyed_')) {
              let itemID = _event.split('_')[1];
              exec('ItemSubscribeEvents', itemID);
            }

            EventManager.callbacks[_event].push(_cb);
          });
        }
        resolve(this);
      }
    })
  }

  static _setCallback(message:string) {
    return new Promise(resolve => {
      if (EventManager._proxyHandlers[message[0]] === undefined) {
          EventManager._proxyHandlers[message[0]] = [];
      }
      resolve (EventManager._proxyHandlers[message[0]].push(message[1]))
    })
  }

  static _finalCallback(message:string) {
    return new Promise(resolve => {
      const result = JSON.parse(decodeURIComponent(message))
      if (EventManager._remoteHandlers[result['event']] !== undefined) {
        result['result']['id'] = result['id']
        for (let handler of EventManager._remoteHandlers[result['event']]) {
          handler.apply(this, [result['result']])
        }
      }
    })
  }
}

window.OnMetersUpdate = (evt) => {}

const oldSetEvent = window.SetEvent;
window.SetEvent = (args: string) => {
  let settings = [];
  settings = args.split('&');

  let settingsObj = {};
  settings.map(function(el) {
    let _split = el.split('=');
    settingsObj[_split[0]] = _split[1];
  });

  if (Remote.remoteType === 'proxy') {
    if (EventManager._proxyHandlers[settingsObj['event']] === undefined) return;

    EventManager._proxyHandlers[settingsObj['event']].map(_cb => {
      _cb(settingsObj);
    });
  } else {
    if (EventManager.callbacks[settingsObj['event']] === undefined) return;

    EventManager.callbacks[settingsObj['event']].map(_cb => {
      _cb(settingsObj);
    });
  }

  if(typeof oldSetEvent === 'function') {
    oldSetEvent(args)
  }
}

const oldAppOnEvent = window.AppOnEvent;
window.AppOnEvent = event => {
  if (Remote.remoteType === 'proxy') {
    if (EventManager._proxyHandlers[event] === undefined) return;
    EventManager._proxyHandlers[event].map(_cb => {
      _cb({ event });
    })
  } else {
    if (EventManager.callbacks[event] === undefined) return;

    EventManager.callbacks[event].map(_cb => {
      _cb({ event });
    });
  }
  if (typeof oldAppOnEvent === 'function') {
    oldAppOnEvent(event)
  }
}

const oldOnEvent = window.OnEvent;
window.OnEvent = (event, item, ...eventArgs ) => {
  if (Remote.remoteType === 'proxy') {
    if (EventManager._proxyHandlers[event + '_' + item] === undefined) return;

      EventManager._proxyHandlers[event + '_' + item].map(_cb => {
        _cb(...eventArgs);
      });
  } else {
    if (EventManager.callbacks[event + '_' + item] === undefined) return;

    EventManager.callbacks[event + '_' + item].map(_cb => {
      _cb(...eventArgs);
    });
  }

  if (typeof oldOnEvent === 'function') {
    oldOnEvent(event)
  }
}