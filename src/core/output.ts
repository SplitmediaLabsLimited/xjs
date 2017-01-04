/// <reference path="../../defs/es6-promise.d.ts" />

import {exec} from '../internal/internal';
import {Environment} from './environment';
import {Channel} from './channel';
import {XML} from '../internal/util/xml';
import {JSON as JXON} from '../internal/util/json';

/**
 * The Output class provides methods to start and stop a stream/recording
 * and pause or unpause a Local Recording.
 *
 * ### Basic Usage
 *
 * ```javascript
 * var xjs = require('xjs');
 *
 * xjs.Output.startBroadcast('Local Recording')
 * ```
 */



  /**
   * Ideal situation
   * getOutputChannelList would return an array of objects(channels)
   * start/stop broadcast would then be called through channel.start/stop
   *
   */

export class Output {
  static _callback = {};
  static _id:string;

  static _localRecording:boolean = false;
  protected _channels: JXON;
  protected _name: string;

  constructor(props?: {name: string}) {

    this._name = props.name;
  }

  /**
   * param: (id: string)
   * id refers to the item id of the source/extension caller
   *
   * Fetch all available Channels you can broadcast on based on your installed
   * Broadcast plugin.
   */

  //Something similar with getActiveStreamChannels
  static getOutputChannelList(id: string): Promise<Output[]> {
    return new Promise(resolve => {
      Output.getBroadcastChannels(id).then(result => {
        let testArr = []
        var resultArr = String(result).match(/"(?:[^"\\]|\\.)*"/g)
        for (var i = 0; i<resultArr.length; i++) {
          resultArr[i] = resultArr[i].replace(/["]+/g, '')
        }
        for (var i = 0; i< resultArr.length; i++) {
          testArr.push(new Output({
            name: resultArr[i]
          }))
        }
        resolve(testArr)
      })
    })
  }

  /**
   *  return: Promise<string>
   *
   *  Gets the name of the Output.
   */
  getName(): Promise<string> {
    return new Promise(resolve => {
      resolve(this._name);
    });
  }

  /**
   * param: (channel: string)
   *
   * return: Promise<boolean>
   *
   * Start a broadcast of the provided channel.
   */
  startBroadcast(): Promise<boolean> {
    return new Promise(resolve => {
      exec('CallHost', 'startBroadcast', this._name);
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
  stopBroadcast(channel:string): Promise<boolean> {
    return new Promise(resolve => {
      exec('CallHost', 'stopBroadcast', this._name);
      resolve(true);
    })
  }

  /**
   * return: Promise<boolean>
   *
   * Pause a local recording.
   */
  pauseLocalRecording(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      Channel.getActiveStreamChannels().then(channels => {
        for (var i=0; i < channels.length; i++) {
          if(channels[i]['_name'] === 'Local Recording') {
            Output._localRecording = true
          }
        }
        if(Output._localRecording) {
          exec('CallHost', 'pauseRecording');
          resolve(true)
        } else {
          reject(Error('Local recording is not active.'))
        }
      })
    })
  }

  /**
   * return: Promise<boolean>
   *
   * Unpause a local recording.
   */
  unpauseLocalRecording(): Promise<boolean> {
    return new Promise((resolve,reject) => {
      Channel.getActiveStreamChannels().then(channels => {
        for (var i=0; i < channels.length; i++) {
          if(channels[i]['_name'] === 'Local Recording') {
            Output._localRecording = true
          }
        }
        if(Output._localRecording) {
          exec('CallHost', 'unpauseRecording');
          resolve(true)
        } else {
          reject(Error('Local recording is not active.'))
        }
      })
    })
  }

  private static getBroadcastChannels(id:string) {
    Output._id = id;
    return new Promise((resolve, reject) => {
      let isID: boolean = /^{[A-F0-9\-]*}$/i.test(Output._id);
      if (!isID) {
        reject(Error('Not a valid ID format for items'));
      } else {
        if (Output._callback[Output._id] === undefined){
          Output._callback[Output._id] = [];
        }
        Output._callback[Output._id] = ({resolve});
        exec('CallHost', 'getBroadcastChannelList:'+Output._id)
      }
    })
  }
}

window.SetBroadcastChannelList = function(channels) {
  Output._callback[Output._id].resolve(channels)
}