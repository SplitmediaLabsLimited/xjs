/// <reference path="../../defs/es6-promise.d.ts" />
/// <reference path="../../defs/window.d.ts" />

import { EventManager } from '../internal/eventmanager';
import { Remote } from '../internal/remote';
import { JSON as JXON } from '../internal/util/json';
import { EventEmitter } from '../util/eventemitter';
import { Environment } from './environment';
import { resolveStreamEventChannelName } from './outputtarget';
import { StreamInfo } from './streaminfo';

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
 *    - `recording-renamed`
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

  static _proxyCallbacks = {};
  static _remoteCallbacks = {};

  /**
   *  param: (event: string, handler: Function)
   *
   *  Allows listening to events that this class emits. Currently there are three:
   *  `stream-start`, `stream-end` and `recording-renamed`.
   *
   *  For `stream-start` and `stream-end`, `res.channel._name` may include
   *  `&output:N` for the true target of that event (one event per index).
   *  Host payloads that omit the suffix are resolved from `OutputIdx`,
   *  Settings XML, or the most recent start/stop target for that channel.
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
    if (Environment.isSourceProps()) {
      console.warn(
        'Channel Manager: stream-related events are not received' + ' via the Source Properties'
      );
    }
    ChannelManager._emitter.on(event, (params) => {
      try {
        const channelInfoObj = JSON.parse(decodeURIComponent(params));

        if (Object.hasOwn(channelInfoObj, 'ChannelName')) {
          const channelName = resolveStreamEventChannelName(
            channelInfoObj['ChannelName'],
            channelInfoObj
          );
          const infoJSON: JXON = JXON.parse(channelInfoObj['Settings']);
          let statJSON: JXON;
          const addedInfo: Object = {};

          if (event === 'stream-end') {
            channelInfoObj['Dropped'] = Number(channelInfoObj['Dropped']) || 0;
            channelInfoObj['NotDropped'] = Number(channelInfoObj['NotDropped']) || 0;
            channelInfoObj['StreamTime'] = Number(channelInfoObj['StreamTime'] / 10) || 0;
            channelInfoObj['Audio'] = Number(channelInfoObj['Audio']) || 0;
            channelInfoObj['Video'] = Number(channelInfoObj['Video']) || 0;
            channelInfoObj['Output'] = Number(channelInfoObj['Output']) || 0;

            statJSON = JXON.parse(
              '<stat' +
                ' video="' +
                channelInfoObj['Video'] +
                '" audio="' +
                channelInfoObj['Audio'] +
                '" output="' +
                channelInfoObj['Output'] +
                '" frmdropped="' +
                channelInfoObj['Dropped'] +
                '" frmcoded="' +
                channelInfoObj['NotDropped'] +
                '" />'
            );
            addedInfo['streamTime'] = channelInfoObj['StreamTime'];
          } else if (event === 'stream-start') {
            statJSON = JXON.parse('<stat />');
          }

          const eventChannel: StreamInfo = new StreamInfo({
            name: channelName,
            stat: statJSON,
            channel: infoJSON,
          });

          handler.call(ChannelManager, {
            error: false,
            channel: eventChannel,
            streamTime: addedInfo['streamTime'],
          });
        } else if (Object.hasOwn(channelInfoObj, 'new') && Object.hasOwn(channelInfoObj, 'old')) {
          if (event === 'recording-renamed') {
            const name = decodeURIComponent(channelInfoObj['new']).replace(/\\/g, '/');
            const nameArr = name.split('/');
            const newName = nameArr[nameArr.length - 1];

            handler.call(ChannelManager, {
              error: false,
              recordingInfo: {
                oldName: channelInfoObj['old'],
                newName: newName,
                fullPath: decodeURIComponent(channelInfoObj['new']),
              },
            });
          }
        }
      } catch (e) {
        handler.call(ChannelManager, { error: true });
      }
    });
  }

  static off(event: string, handler: Function) {
    ChannelManager._emitter.off(event, handler);
  }
}

export function _subscribeEventManager() {
  EventManager.subscribe(
    ['StreamStart', 'StreamEnd', 'RecordingRenamed'],
    (settingsObj: Record<string, string>) => {
      let eventString;
      if (Object.hasOwn(settingsObj, 'event') && Object.hasOwn(settingsObj, 'info')) {
        eventString = settingsObj['event'];
        if (settingsObj['event'] === 'StreamStart') {
          eventString = 'stream-start';
        } else if (settingsObj['event'] === 'StreamEnd') {
          eventString = 'stream-end';
        }
        ChannelManager.emit(eventString, settingsObj['info']);
      }
      if (
        Object.hasOwn(settingsObj, 'event') &&
        Object.hasOwn(settingsObj, 'old') &&
        Object.hasOwn(settingsObj, 'new')
      ) {
        eventString = settingsObj['event'];
        if (settingsObj['event'] === 'RecordingRenamed') {
          eventString = 'recording-renamed';
          const renameInfo = {
            old: settingsObj['old'],
            new: settingsObj['new'],
          };
          ChannelManager.emit(eventString, encodeURIComponent(JSON.stringify(renameInfo)));
        }
      }
    }
  );
}
