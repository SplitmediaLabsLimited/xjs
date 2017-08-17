import {exec} from './internal'

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

  static subscribe(event, _cb) {
    return new Promise(resolve => {
      event = event instanceof Array ? event : [event];

      if (event instanceof Array) {
        event.forEach(_event => {
          if (EventManager.callbacks[_event] === undefined) {
            EventManager.callbacks[_event] = [];
          }

          if (_event === 'OnSceneAddByUser') {
            exec('AppSubscribeEvents');
          } else if (_event.startsWith('itempropchange_')) {
            let itemID = _event.split('_')[1];
            exec('ItemSubscribeEvents', itemID);
          }

          EventManager.callbacks[_event].push(_cb);
        });
      }
      resolve(this);
    })
  }
}

const oldSetEvent = window.SetEvent;
window.SetEvent = (args: string) => {
  let settings = [];
  settings = args.split('&');

  let settingsObj = {};
  settings.map(function(el) {
    let _split = el.split('=');
    settingsObj[_split[0]] = _split[1];
  });

  if (EventManager.callbacks[settingsObj['event']] === undefined) return;

  EventManager.callbacks[settingsObj['event']].map(_cb => {
    _cb(settingsObj);
  });

  if(typeof oldSetEvent === 'function') {
    oldSetEvent(args)
  }
}

const oldAppOnEvent = window.AppOnEvent;
window.AppOnEvent = event => {
  if (EventManager.callbacks[event] === undefined) return;

  EventManager.callbacks[event].map(_cb => {
    _cb({ event });
  });
  if (typeof oldAppOnEvent === 'function') {
    oldAppOnEvent(event)
  }
}

const oldOnEvent = window.OnEvent;
window.OnEvent = (event, item, ...eventArgs ) => {
  if (EventManager.callbacks[event + '_' + item] === undefined) return;

  EventManager.callbacks[event + '_' + item].map(_cb => {
    _cb(...eventArgs);
  });
  if (typeof oldOnEvent === 'function') {
    oldOnEvent(event)
  }
}