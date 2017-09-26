/// <reference path="../../defs/es6-promise.d.ts" />

import {EventEmitter} from '../util/eventemitter';
import {EventManager} from '../internal/eventmanager';

/**
 * The LanguageManager class allows access to the change in language made in
 * XSplit Broadcaster.
 * This function is not available on Source Properties.
 *
 * This function can be set on both Extensions and Sources.
 * `language-change` event is emitted.
 *
 * Use the `on("language-change", handler: Function)` function to listent to this event.
 *
 *
 */
export class LanguageManager extends EventEmitter {
  static _emitter = new LanguageManager();

  /**
   * param: (event:string, ...params: any[])
   *
   * Allows this class to emit an event.
   */
  static emit(event: string, ...params:any[]) {
    params.unshift(event);
    LanguageManager._emitter.emit.apply(LanguageManager._emitter, params);
  }

  /**
   * param: (event: string, handler: Function)
   *
   * Allows listening to the event this class emits.
   *
   * #### Usage:
   *
   * ```javascript
   * xjs.LanguageManager.on('language-change', function(res) {
   *   var lang = res
   *   //Do other manipulation here
   * })
   * ```
   *
   */
  static on(event: string, handler: Function) {
    LanguageManager._emitter.on(event, (lang) => {
      handler.call(this, { lang })
    })
  }
}

EventManager.subscribe(['LanguageChanged'],
  (langObj: string) => {
    let eventString;
    if (langObj.hasOwnProperty('event') &&
    langObj.hasOwnProperty('lang')) {
    eventString = langObj['event'];
    if (langObj['event'] === 'LanguageChanged') {
      eventString = 'language-change';
    }
    LanguageManager.emit(eventString, langObj['lang']);
    }
})