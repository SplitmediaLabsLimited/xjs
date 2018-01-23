/// <reference path="../../defs/es6-promise.d.ts" />

import {exec} from '../internal/internal';
import {Environment} from './environment';
import {Extension} from './extension';
import {StreamInfo} from './streaminfo';
import {XML} from '../internal/util/xml';
import {JSON as JXON} from '../internal/util/json';
import {Scene} from './scene';
import {Item as iItem} from '../internal/item';
import {Remote} from '../internal/remote'
import window from '../util/window';

import {
  versionCompare,
  getVersion,
  handlePreStreamDialogFixVersion
} from '../internal/util/version';

/**
 * The Output class provides methods to start and stop a stream/recording
 * and pause or unpause a Local Recording.
 *
 * This can be used together with {@link #core/StreamInfo StreamInfo Class},
 * where you can check the status of the outputs you start.
 *
 * ### Basic Usage
 *
 * ```javascript
 * var xjs = require('xjs');
 * var streamName;
 * xjs.Output.getOutputList()
 * .then(function(outputs) {
 *   outputs.map(output => {
 *    output.getName()
 *    .then(function(name) {
 *      // You can also save the name on a variable to be able to use it
 *      // when checking for the stream info.
 *      if(name.includes('Twitch')) {
 *        streamName = name
 *        output.startBroadcast();
 *      }
 *    })
 *  })
 * })
 * ```
 *
 * Once there's an active stream, StreamInfo class can be used at any time to
 * check the stream status of that output.
 *
 * ```javascript
 * xjs.StreamInfo.getActiveStreamChannels
 * .then(function(channels) {
 *   var stream = []
 *   channels.forEach(function(channel){
 *     channel.getName()
 *     .then(name => {
 *       if(name === streamName) {
 *         stream.push(channel)
 *       }
 *     })
 *   })
 *   return stream
 * }).then(function(stream) {
 *   // Get any stream information you need here
 *   return stream[0].getStreamRenderedFrames()
 * })
 * ```
 */

export class Output {
  static _callback = {};
  static _id:string;

  static _remoteCallback = {};
  static _proxyCallback = {};

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
   *        output.startBroadcast({
   *          suppressPrestreamDialog : true
   *        });
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
          innerReject(Error('Outputs class is only accessible from Source Plugins and Extensions.'));
        });
      }
      _checkId.then(id => {
        Output._getBroadcastChannels(id).then(result => {
          const results = JXON.parse(result)
          let channels = []
          for (var i=0; i< results.children.length; i++) {
            channels.push(new Output({
              name: results.children[i]['name']
                .replace(/&apos;/g, "'")
                .replace(/&quot;/g, '"')
                .replace(/&gt;/g, '>')
                .replace(/&lt;/g, '<')
                .replace(/&amp;/g, '&')
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
   *  Gets the actual name of the Output.
   */
  getName(): Promise<string> {
    return new Promise(resolve => {
      resolve(this._name);
    });
  }

  /**
   *  return: Promise<string>
   *
   *  Gets the name of the Output as displayed in the Outputs menu.
   */
  getDisplayName(): Promise<string> {
    return new Promise(resolve => {
      Output._getBroadcastXML(Output._id, this._name).then(channelXML => {
        const channelJXON = JXON.parse(channelXML);
        resolve(channelJXON['displayName']
          .replace(/&apos;/g, "'")
          .replace(/&quot;/g, '"')
          .replace(/&gt;/g, '>')
          .replace(/&lt;/g, '<')
          .replace(/&amp;/g, '&'));
      });
    });
  }

  /**
   * param: ([options]) -- see below
   *
   * ```
   * return: Promise<boolean>
   * ```
   *
   * Start a broadcast of the provided channel.
   *
   * Accepts an optional JSON object argument,
   * which can be used to indicate certain flags, such as (additional options may be added):
   * - `suppressPrestreamDialog` : used to bypass the showing of the pre-stream dialog
   *  of the outputs supporting it, will use last settings provided
   */
  startBroadcast(optionBag ?: {
    suppressPrestreamDialog ?: boolean
  }): Promise<boolean> {
    return new Promise(resolve => {
      if (versionCompare(getVersion()).is.greaterThanOrEqualTo(handlePreStreamDialogFixVersion) &&
        typeof optionBag !== 'undefined' && optionBag !== null &&
        optionBag['suppressPrestreamDialog']) {
        exec('CallHostFunc', 'startBroadcast', this._name, 'suppressPrestreamDialog=1');
        resolve(true);
      } else {
        exec('CallHost', 'startBroadcast', this._name);
        resolve(true);    
      }
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
      if (this._name === 'Local Recording') {
        StreamInfo.getActiveStreamChannels().then(channels => {
          Output._localRecording = false;
          for (var i=0; i < channels.length; i++) {
            if(channels[i]['_name'] === 'Local Recording') {
              Output._localRecording = true;
              break;
            }
          }
          if(Output._localRecording) {
            exec('CallHost', 'pauseRecording');
            resolve(true);
          } else {
            reject(Error('Local recording is not active.'));
          }
        })

      } else {
        reject(Error('Output is not a local recording'));
      }
    });
  }

  /**
   * return: Promise<boolean>
   *
   * Unpause a local recording.
   */
  unpauseLocalRecording(): Promise<boolean> {
    return new Promise((resolve,reject) => {
      if (this._name === 'Local Recording') {
        StreamInfo.getActiveStreamChannels().then(channels => {
          Output._localRecording = false;
          for (var i=0; i < channels.length; i++) {
            if(channels[i]['_name'] === 'Local Recording') {
              Output._localRecording = true;
              break;
            }
          }
          if(Output._localRecording) {
            exec('CallHost', 'unpauseRecording');
            resolve(true);
          } else {
            reject(Error('Local recording is not active.'));
          }
        })

      } else {
        reject(Error('Output is not a local recording'));
      }
    })
  }

  static _getBroadcastChannels(id:string, handler?:Function) {
    Output._id = id;
    return new Promise((resolve, reject) => {
      if(Environment.isSourcePlugin()) {
        let isID: boolean = /^{[A-F0-9\-]*}$/i.test(Output._id);
        if (!isID) {
          reject(Error('Not a valid ID format for items'));
        }
      }
      if (Remote.remoteType === 'remote') {
        let message = {
            type: 'broadcastChannels',
            id: Output._id
          }
          Extension._remoteCallback[Output._id] = ({resolve});
          Remote.sendMessage(encodeURIComponent(JSON.stringify(message)));
      } else if (Remote.remoteType === 'proxy') {
        if (Output._proxyCallback[Output._id] === undefined){
          Output._proxyCallback[Output._id] = [];
        }
        Output._proxyCallback[Output._id] = handler;
        exec('CallHost', 'getBroadcastChannelList:'+Output._id);
      } else {
        if (Output._callback[Output._id] === undefined){
          Output._callback[Output._id] = [];
        }
        Output._callback[Output._id] = ({resolve});
        exec('CallHost', 'getBroadcastChannelList:'+Output._id);
      }
    })
  }

  // @TODO: possible area for simplification
  // nearly same as above, just different function name, and extra parameter
  static _getBroadcastXML(id:string, name, handler?:Function) {
    Output._id = id;
    return new Promise((resolve, reject) => {
      if(Environment.isSourcePlugin()) {
        let isID: boolean = /^{[A-F0-9\-]*}$/i.test(Output._id);
        if (!isID) {
          reject(Error('Not a valid ID format for items'));
        }
      }
      if (Remote.remoteType === 'remote') {
        let message = {
            type: 'broadcastChannelXML',
            id: Output._id + '_xml',
            name: name
          }
          Extension._remoteCallback[Output._id + '_xml'] = ({resolve});
          Remote.sendMessage(encodeURIComponent(JSON.stringify(message)));
      } else if (Remote.remoteType === 'proxy') {
        if (Output._proxyCallback[Output._id + '_xml'] === undefined){
          Output._proxyCallback[Output._id + '_xml'] = [];
        }
        Output._proxyCallback[Output._id + '_xml'] = handler;
        exec('CallHost', 'getBroadcastChannelXml:'+ Output._id, name);
      } else {
        if (Output._callback[Output._id + '_xml'] === undefined){
          Output._callback[Output._id + '_xml'] = [];
        }
        Output._callback[Output._id + '_xml'] = ({resolve});
        exec('CallHost', 'getBroadcastChannelXml:'+ Output._id, name);
      }
    })
  }

  static _finalCallback(message:string) {
    return new Promise(resolve => {
      const result = JSON.parse(decodeURIComponent(message))
      Extension._remoteCallback[Output._id].resolve(result['result'])
    })
  }

  static _finalCallbackXML(message:string) {
    return new Promise(resolve => {
      const result = JSON.parse(decodeURIComponent(message))
      Extension._remoteCallback[Output._id + '_xml'].resolve(result['result'])
    })
  }
}

const oldSetBroadcastChannelList =window.SetBroadcastChannelList;
window.SetBroadcastChannelList = function(channels) {
  if (Remote.remoteType === 'proxy') {
    Output._proxyCallback[Output._id].call(this, channels)
  } else {
    Output._callback[Output._id].resolve(channels)
  }

  if (typeof oldSetBroadcastChannelList === 'function') {
    oldSetBroadcastChannelList(channels)
  }
}

const oldSetBroadcastChannelXml =window.SetBroadcastChannelXml;
window.SetBroadcastChannelXml = function(channelXML) {
  if (Remote.remoteType === 'proxy') {
    Output._proxyCallback[Output._id + '_xml'].call(this, channelXML)
  } else {
    Output._callback[Output._id + '_xml'].resolve(channelXML)
  }

  if (typeof oldSetBroadcastChannelXml === 'function') {
    oldSetBroadcastChannelXml(channelXML)
  }
}