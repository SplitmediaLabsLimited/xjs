/// <reference path="../../defs/es6-promise.d.ts" />

import {EventEmitter} from '../util/eventemitter';
import {EventManager} from '../internal/eventmanager';
import {exec} from '../internal/internal';

/**
 * The LanguageInfo class allows access to the change in language made in
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
export class LanguageInfo extends EventEmitter {
  static _emitter = new LanguageInfo();

  /**
   * param: (event:string, ...params: any[])
   *
   * Allows this class to emit an event.
   */
  static emit(event: string, ...params:any[]) {
    params.unshift(event);
    LanguageInfo._emitter.emit.apply(LanguageInfo._emitter, params);
  }

  /**
   * param: (event: string, handler: Function)
   *
   * Allows listening to the event this class emits.
   *
   * #### Usage:
   *
   * ```javascript
   * xjs.LanguageInfo.on('language-change', function(res) {
   *   var lang = res
   *   //Do other manipulation here
   * })
   * ```
   *
   */
  static on(event: string, handler: Function) {
    LanguageInfo._emitter.on(event, (lang) => {
      handler.call(this, { lang })
    })
  }

  static getCode(): Promise<string> {
    return new Promise(resolve => {
      exec('CallHostFunc', 'getProperty', 'html:language', langCode => {
        resolve(langCode);
      });
    });
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
    LanguageInfo.emit(eventString, langObj['lang']);
    }
})