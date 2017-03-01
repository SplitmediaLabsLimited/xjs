import {exec} from './internal'
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
  static _remoteCallbacks = {};
  static _proxyCallbacks = {};

  static subscribe(event, _cb) {
    return new Promise((resolve, reject) => {
      event = event instanceof Array ? event : [event];

      console.log('Subscribe called before ready::', Remote.remoteType)
      if (Remote.remoteType === 'remote') {
        let message = {
          event,
          type: 'subscribe'
        }
        resolve (Remote.sendMessage(encodeURIComponent(JSON.stringify(message))))
      }

      if (event instanceof Array) {
        event.forEach(_event => {
          if (EventManager.callbacks[_event] === undefined) {
            EventManager.callbacks[_event] = [];
          }

          if (_event === 'OnSceneAddByUser') {
            exec('AppSubscribeEvents');
          }

          if (_cb instanceof Function) {
            if (Remote.remoteType === 'remote') {
              EventManager._remoteCallbacks[_event].push(_cb);
            } else if (Remote.remoteType === 'proxy') {
              console.log('Proxy Callback::', _cb)
              EventManager._proxyCallbacks[_event].push(_cb);
            } else {
              EventManager.callbacks[_event].push(_cb);
            }
          } else {
            reject(Error('Callback should be a function.'))
          }
        });
      }
    })
  }

  static finalCallback(message) {
    const result = JSON.parse(message);
    console.log(result)
    EventManager._remoteCallbacks[result['event']].map(_cb => {
      console.log(_cb)
    })
  }
}


window.SetEvent = (args: string) => {
  let settings = [];
  settings = args.split('&');

  let settingsObj = {};
  settings.map(function(el) {
    let _split = el.split('=');
    settingsObj[_split[0]] = _split[1];
  });


  if (Remote.remoteType === 'proxy') {
    if (EventManager._proxyCallbacks[settingsObj['event']] === undefined) return;

    EventManager._proxyCallbacks[settingsObj['event']].map(_cb => {
      _cb(settingsObj);
    });
  } else {
    if (EventManager.callbacks[settingsObj['event']] === undefined) return;

    EventManager.callbacks[settingsObj['event']].map(_cb => {
      _cb(settingsObj);
    });
  }
}

window.AppOnEvent = event => {

  if (Remote.remoteType === 'proxy') {
    if (EventManager._proxyCallbacks[event] === undefined) return;

    EventManager._proxyCallbacks[event].map(_cb => {
      _cb({ event });
    });
  } else {
    if (EventManager.callbacks[event] === undefined) return;

    EventManager.callbacks[event].map(_cb => {
      _cb({ event });
    });
  }
}
