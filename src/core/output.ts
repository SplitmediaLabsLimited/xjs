/// <reference path="../../defs/es6-promise.d.ts" />

import {exec} from '../internal/internal';
import {Environment} from './environment';
import {Extension} from './extension';
import {StreamInfo} from './streaminfo';
import {XML} from '../internal/util/xml';
import {JSON as JXON} from '../internal/util/json';
import {Scene} from './scene';
import {Item as iItem} from '../internal/item';

/**
 * The Output class provides methods to start and stop a stream/recording
 * and pause or unpause a Local Recording.
 */

export class Output {
  static _callback = {};
  static _id:string;

  static _localRecording:boolean = false;
  protected _name: string;

  constructor(props?: {name: string}) {

    this._name = props.name;
  }

  /**
   * param: (id: string)
   *
   * ```
   * return Promise<Output[]>
   * ```
   *
   * Fetch all available Outputs you can broadcast on based on your installed
   * Broadcast plugin.
   *
   * ### Basic Usage
   *
   * ```javascript
   * var xjs = require('xjs');
   *
   * xjs.Output.getOutputList()
   * .then(function(outputs) {
   *   outputs.map(output => {
   *    output.getName()
   *    .then(function(name) {
   *      if(name.includes('Twitch')) {
   *        output.startBroadcast();
   *      }
   *    })
   *  })
   * })
   * ```
   */
  static getOutputList(): Promise<Output[]> {
    return new Promise((resolve, reject) => {
      let _id: string;
      let _checkId;
      if (Environment.isExtension()) {
        _checkId = Extension.getInstance().getId()
      } else if (Environment.isSourcePlugin()) {
        _checkId = iItem.get('itemlist').then(result => {
          let results = result.split(',');
          return results[0];
        });
      } else {
        _checkId = new Promise((innerResolve, innerReject) => {
          innerReject(Error('Outputs class is not accessible to source properties.'));
        });
      }
      _checkId.then(id => {
        Output._getBroadcastChannels(id).then(result => {
          const results = JXON.parse(result)
          let channels = []
          for (var i=0; i< results.children.length; i++) {
            channels.push(new Output({
              name: results.children[i]['name']
            }));
          }
          resolve(channels)
        });
      }).catch(function(err) {
        reject(err);
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
   * return: Promise<boolean>
   *
   * Stop a broadcast of the provided channel.
   */
  stopBroadcast(): Promise<boolean> {
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
      StreamInfo.getActiveStreamChannels().then(channels => {
        for (var i=0; i < channels.length; i++) {
          if(channels[i]['_name'] === 'Local Recording') {
            Output._localRecording = true
          } else {
            Output._localRecording = false
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
      StreamInfo.getActiveStreamChannels().then(channels => {
        for (var i=0; i < channels.length; i++) {
          if(channels[i]['_name'] === 'Local Recording') {
            Output._localRecording = true
          } else {
            Output._localRecording = false
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

  private static _getBroadcastChannels(id:string) {
    Output._id = id;
    return new Promise((resolve, reject) => {
      if(Environment.isSourcePlugin()) {
        let isID: boolean = /^{[A-F0-9\-]*}$/i.test(Output._id);
        if (!isID) {
          reject(Error('Not a valid ID format for items'));
        }
      }
      if (Output._callback[Output._id] === undefined){
        Output._callback[Output._id] = [];
      }
      Output._callback[Output._id] = ({resolve});
      exec('CallHost', 'getBroadcastChannelList:'+Output._id);
    })
  }
}

window.SetBroadcastChannelList = function(channels) {
  Output._callback[Output._id].resolve(channels)
}