/// <reference path="../../defs/es6-promise.d.ts" />

import {exec} from '../internal/internal';
import {Environment} from './environment';
import {BroadcastManager} from './broadcastmanager';
import {Channel} from './channel';

/**
 * The Broadcast class provides methods to start and stop a stream/recording
 * and pause or unpause a Local Recording.
 *
 * ### Basic Usage
 *
 * ```javascript
 * var xjs = require('xjs');
 *
 * xjs.Broadcast.startBroadcast('Local Recording')
 * ```
 */

export class Broadcast {

  // For start and stop broadcast, check if the provided channel is on the list
  // Could also check if it's live
  // Also check if id is in proper id format
  /**
   * param: (channel: string)
   *
   * return: Promise<boolean>
   *
   * Start a broadcast of the provided channel.
   */
  static startBroadcast(channel:string): Promise<boolean> {
    return new Promise(resolve => {
      exec('CallHost', 'startBroadcast', channel);
      resolve(true);
    })
  }

  /**
   * param: (channel: string)
   *
   * return: Promise<boolean>
   *
   * Stop a broadcast of the provided channel.
   */
  static stopBroadcast(channel:string): Promise<boolean> {
    return new Promise(resolve => {
      exec('CallHost', 'stopBroadcast', channel);
      resolve(true);
    })
  }

  /**
   * return: Promise<boolean>
   *
   * Pause a local recording.
   */
  static pauseLocalRecording(): Promise<boolean> {
    return new Promise(resolve => {
      exec('CallHost', 'pauseRecording');
      resolve(true)
    })
  }

  /**
   * return: Promise<boolean>
   *
   * Unpause a local recording.
   */
  static unpauseLocalRecording(): Promise<boolean> {
    return new Promise(resolve => {
      exec('CallHost', 'unpauseRecording');
      resolve(true)
    })
  }
}