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
    event = event instanceof Array ? event : [event];

    if (event instanceof Array) {
      event.forEach(_event => {
        if (EventManager.callbacks[_event] === undefined) {
          EventManager.callbacks[_event] = [];
        }

        if (_event === 'OnSceneAddByUser') {
          exec('AppSubscribeEvents');
        }        

        EventManager.callbacks[_event].push(_cb);
      });
    }
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

  if (EventManager.callbacks[settingsObj['event']] === undefined) return;

  EventManager.callbacks[settingsObj['event']].map(_cb => {
    _cb(settingsObj);
  });
}

window.AppOnEvent = event => {
  if (EventManager.callbacks[event] === undefined) return;

  EventManager.callbacks[event].map(_cb => {
    _cb({ event });
  });
}
