/// <reference path="../../defs/es6-promise.d.ts" />
/// <reference path="../../defs/window.d.ts" />

import {EventEmitter} from '../util/eventemitter';
import {Channel} from '../core/channel';
import {JSON as JXON} from '../internal/util/json';

/**
 *  The ChannelManager class allows limited access to channels (also termed as outputs)
 *  that are being used or set in XSplit Broadcaster.
 *
 *  The class also emits events for developers to know when a stream is started or ended.
 *
 *  The following events are emitted.
 *    - `stream-started`
 *    - `stream-ended`
 *
 *  Use the `on(event: string, handler: Function)` function to listen to events.
 *
 */
export class ChannelManager extends EventEmitter {

  static _emitter = new ChannelManager();

  /**
   *  param: (event: string, ...params: any[])
   *
   *  Allows this class to emit an event.
   */
  static emit(event: string, ...params: any[]) {
    params.unshift(event);
    ChannelManager._emitter.emit.apply(ChannelManager._emitter, params);
  }

  /**
   *  param: (event: string, handler: Function)
   *
   *  Allows listening to events that this class emits. Currently there are two:
   *  `stream-started` and `stream-ended`.
   */
  static on(event: string, handler: Function) {
    // ChannelManager._emitter.on(event, handler);
    ChannelManager._emitter.on(event, (params) => {
      try {
        let channelInfoObj = JSON.parse(decodeURIComponent(params));
        if (channelInfoObj.hasOwnProperty('ChannelName')) {
          
          let channelName = channelInfoObj['ChannelName'];
          let infoJSON: JXON = JXON.parse(channelInfoObj['Settings']);
          let statJSON: JXON;
          let addedInfo: Object = {};

          if (event === 'stream-end') {
            statJSON = JXON.parse('<stat frmdropped="' +
              channelInfoObj['Dropped'] +
              '" frmcoded="' + channelInfoObj['NotDropped'] + '" />');
            addedInfo['streamTime'] = channelInfoObj['StreamTime'];
          } else if (event === 'stream-start') {
            statJSON = JXON.parse('<stat />');
          }

          let eventChannel: Channel = new Channel({
            name: channelName,
            stat: statJSON,
            channel: infoJSON
          });

          handler.call(this, eventChannel, addedInfo);

        }
      } catch (e) {

      }
    });
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

  if (settingsObj.hasOwnProperty('event') &&
      settingsObj.hasOwnProperty('info')) {
    let eventString = settingsObj['event'];
    if (settingsObj['event'] === 'StreamStart') {
      eventString = 'stream-start';
    } else if (settingsObj['event'] === 'StreamEnd') {
      eventString = 'stream-end';
    }
    ChannelManager.emit(eventString, settingsObj['info']);
  }
}