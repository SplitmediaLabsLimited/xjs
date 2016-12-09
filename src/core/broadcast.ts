/// <reference path="../../defs/es6-promise.d.ts" />

import {exec} from '../internal/internal';
import {Environment} from './environment';
import {BroadcastManager} from './broadcastmanager';

/**
 * The Broadcast class provides methods to start and stop a stream/recording
 * and pause or unpause a Local Recording.
 *
 * ### Basic Usage
 *
 * ```javascript
 * var xjs = require('xjs');
 * var Broadcast = new xjs.Broadcast();
 *
 * Broadcast.startBroadcast
 * ```
 */

export class Broadcast {

  /**
   * To be moved to a separate thing or have its own thing :)
   */
  // Should this be on core#channel ???
  static getBroadcastChannelList(id: string): Promise<String[]> {
    return new Promise(resolve => {
      BroadcastManager.getBroadcastChannels(id).then(result => {
        console.log('Final::', result)
      })
    })
  }

  startBroadcast(channel:string, id:string): Promise<boolean> {
    return new Promise(resolve => {
      exec('CallHost', 'startBroadcast:' + id, channel);
      resolve(true); // Should return channel list
    })
  }

  stopBroadcast(channel:string, id:string): Promise<boolean> {
    return new Promise(resolve => {
      exec('CallHost', 'stopBroadcast:' + id, channel);
      resolve(true);
    })
  }

  // can only be used by local recording
  pauseLocalRecording(id): Promise<boolean> {
    return new Promise(resolve => {
      exec('CallHost', 'pauseRecording:'+ id); //id refers to source/extension id of caller
      resolve(true)
    })
  }

  unpauseLocalRecording(id): Promise<boolean> {
    return new Promise(resolve => {
      exec('CallHost', 'unpauseRecording:'+ id); //id refers to source/extension id of caller
      resolve(true)
    })
  }
}