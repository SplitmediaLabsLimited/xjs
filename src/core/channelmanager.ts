/// <reference path="../../defs/es6-promise.d.ts" />
/// <reference path="../../defs/window.d.ts" />

import {EventEmitter} from '../util/eventemitter';
import {EventManager} from '../internal/eventmanager';
import {Channel} from './channel';
import {JSON as JXON} from '../internal/util/json';
import {Environment} from './environment';

/**
 *  The ChannelManager class allows limited access to channels (also termed as outputs)
 *  that are being used or set in XSplit Broadcaster.
 *  This function is not available on Source Properties.
 *
 *  The class also emits events for developers to know when a stream has started
 *  or ended.
 *
 *  The following events are emitted.
 *    - `stream-start`
 *    - `stream-end`
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
   *  `stream-start` and `stream-end`.
   *
   *  #### Usage:
   *
   * ```javascript
   * ChannelManager.on('stream-start', function(res) {
   *   if (!res.error) { // No error
   *     var channel = res.channel; // Channel Object
   *     var streamTime = res.streamTime;
   *   }
   * });
   * ```
   */
  static on(event: string, handler: Function) {
    // ChannelManager._emitter.on(event, handler);
    if (Environment.isSourceProps()) {
      console.warn('Channel Manager: stream-related events are not received' +
        ' via the Source Properties');
    }
    ChannelManager._emitter.on(event, (params) => {
      try {
        let channelInfoObj = JSON.parse(decodeURIComponent(params));
        if (channelInfoObj.hasOwnProperty('ChannelName')) {

          let channelName = channelInfoObj['ChannelName'];
          let infoJSON: JXON = JXON.parse(channelInfoObj['Settings']);
          let statJSON: JXON;
          let addedInfo: Object = {};

          if (event === 'stream-end') {
            channelInfoObj['Dropped'] = Number(channelInfoObj['Dropped']) || 0;
            channelInfoObj['NotDropped'] = Number(channelInfoObj['NotDropped']) || 0;
            channelInfoObj['StreamTime'] = Number(channelInfoObj['StreamTime']) || 0;
            
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

          handler.call(this, {
            error: false,
            channel: eventChannel,
            streamTime: addedInfo['streamTime']
          });
        }
      } catch (e) {
        handler.call(this, { error: true })
      }
    });
  }
}

EventManager.subscribe(['StreamStart', 'StreamEnd'], (settingsObj: string) => {
  let settings = [];

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
});