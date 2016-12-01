/// <reference path="../../defs/es6-promise.d.ts" />

import {exec} from '../internal/internal';
import {Environment} from './environment';

/**
 * The Broadcast class provides methods to start and stop a stream/recording
 * and pause or unpause a Local Recording.
 *
 * ### Basic Usage
 *
 * ```javascript
 * var xjs = require('xjs');
 * var Stream = new xjs.Stream();
 *
 * Stream.startBroadcast
 * ```
 */

export class Broadcast{
  /**
   * To be moved to a separate thing or have its own thing :)
   */

  getBroadcastChannelList(): Promise<String[]> {
    return new Promise(resolve => {
      exec('CallHost', 'getBroadcastChannelList:'+ id)
    })
  }

  startBroadcast(channel:string, id:string): Promise<boolean> {
    return new Promise(resolve => {
      exec('CallHost', 'startBroadcast:' + id, channel);
      resolve(true);
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