/// <reference path="../../defs/es6-promise.d.ts" />

import { exec } from '../internal/internal';
import { Item as iItem } from '../internal/item';
import { Remote } from '../internal/remote';
import { JSON as JXON } from '../internal/util/json';
import {
  getVersion,
  handlePreStreamDialogFixVersion,
  versionCompare,
} from '../internal/util/version';
import { XML } from '../internal/util/xml';
import window from '../util/window';
import { Environment } from './environment';
import { Extension } from './extension';
import {
  ALL_INDEX,
  LOCAL_RECORDING,
  getOutputParam,
  isOutputTargetActive,
  rememberOutputEvent,
  resolveOutputIndices,
  type BroadcastOptions,
  type OutputTargetOptions,
} from './outputtarget';
import { Scene } from './scene';
import { StreamInfo } from './streaminfo';

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
 *        output.startBroadcast({
 *          suppressPrestreamDialog: true,
 *          outputTarget: 'all'
 *        });
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

function normalizeIsAll(outputTarget?: BroadcastOptions['outputTarget']): boolean {
  return String(outputTarget == null ? '' : outputTarget).toLowerCase() === ALL_INDEX;
}

async function execIndexedHost(
  funcName: string,
  channelName: string,
  extraArgs: string[],
  optionBag: BroadcastOptions | OutputTargetOptions | undefined,
  skipUnlessActive: boolean
): Promise<boolean> {
  const outputTarget = optionBag && optionBag.outputTarget;
  const indices = await resolveOutputIndices(outputTarget);
  if (indices === null) {
    exec('CallHostFunc', funcName, channelName, ...extraArgs);
    return true;
  }

  const isAll = indices.length > 1 || (indices.length === 1 && normalizeIsAll(outputTarget));
  for (let i = 0; i < indices.length; i++) {
    const index = indices[i];
    if (isAll) {
      const active = await isOutputTargetActive(channelName, index);
      if (skipUnlessActive && !active) {
        continue;
      }
      if (!skipUnlessActive && active && funcName === 'startBroadcast') {
        continue;
      }
    }
    rememberOutputEvent(channelName, index);
    exec('CallHostFunc', funcName, channelName, ...extraArgs, getOutputParam(index));
  }
  return true;
}

function execChannelHost(
  funcName: string,
  channelName: string,
  extraArgs: string[],
  optionBag: BroadcastOptions | OutputTargetOptions | undefined,
  skipUnlessActive: boolean
): Promise<boolean> {
  return execIndexedHost(funcName, channelName, extraArgs, optionBag, skipUnlessActive);
}

function execLocalRecordingHost(
  funcName: string,
  extraArgs: string[],
  optionBag: OutputTargetOptions | undefined,
  skipUnlessActive: boolean
): Promise<boolean> {
  return execIndexedHost(funcName, LOCAL_RECORDING, extraArgs, optionBag, skipUnlessActive);
}

export class Output {
  static _callback = {};
  static _id: string;

  static _remoteCallback = {};
  static _proxyCallback = {};

  static _localRecording: boolean = false;
  protected _name: string;

  constructor(props?: { name: string }) {
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
        _checkId = Extension.getInstance().getId();
      } else if (Environment.isSourcePlugin()) {
        _checkId = iItem.get('itemlist').then((result) => {
          const results = result.split(',');
          return results[0];
        });
      } else {
        _checkId = new Promise((innerResolve, innerReject) => {
          innerReject(
            Error('Outputs class is only accessible from Source Plugins and Extensions.')
          );
        });
      }
      _checkId
        .then((id) => {
          Output._getBroadcastChannels(id).then((result) => {
            const results = JXON.parse(result);
            const channels = [];
            for (var i = 0; i < results.children.length; i++) {
              channels.push(
                new Output({
                  name: results.children[i]['name']
                    .replace(/&apos;/g, "'")
                    .replace(/&quot;/g, '"')
                    .replace(/&gt;/g, '>')
                    .replace(/&lt;/g, '<')
                    .replace(/&amp;/g, '&'),
                })
              );
            }
            resolve(channels);
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * param: scene<number|Scene>
   * ```
   * return: Promise<boolean>
   * ```
   *
   * Sets a scene to record. Set to live scene or blank string to reset
   */
  static setSceneToRecord(scene: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (scene === '' || scene === Scene.liveScene()) {
        exec('CallHostFunc', 'setSceneToRecord', '-1');
        resolve(true);
      } else if (scene instanceof Scene) {
        scene
          .getSceneIndex()
          .then((sceneIndex) => {
            exec('CallHostFunc', 'setSceneToRecord', Number(sceneIndex));
            resolve(true);
          })
          .catch((err) => {
            reject(err);
          });
      } else if (typeof scene === 'number') {
        if (scene < 1 || !Number['isInteger'](Number(scene))) {
          reject(Error('Invalid parameters. Valid range is greater than 0.'));
        } else {
          exec('CallHostFunc', 'setSceneToRecord', String(scene - 1));
          resolve(true);
        }
      } else {
        reject(Error('Invalid parameters. Valid range is greater than 0 or a Scene object.'));
      }
    });
  }

  /**
   * param: ([options]) -- see below
   *
   * ```
   * return: Promise<boolean>
   * ```
   *
   * Start a local recording.
   *
   * Accepts an optional JSON object argument:
   * - `outputTarget` : optional 0-based target output index (`0` … `count-1`) or `'all'`.
   *   Count comes from host `getProperty('viewoutputscount')` and is not a fixed max of 2.
   *   `'all'` fans out to each index; the host only receives numeric `output=N` (never `output=all`).
   *   Omit for legacy single-target / default behavior.
   */
  static startLocalRecording(optionBag?: OutputTargetOptions): Promise<boolean> {
    return execLocalRecordingHost(
      'startBroadcast',
      ['suppressPrestreamDialog=1'],
      optionBag,
      false
    );
  }

  /**
   * param: ([options]) -- see below
   *
   * ```
   * return: Promise<boolean>
   * ```
   *
   * Stop a local recording.
   *
   * Accepts an optional JSON object argument:
   * - `outputTarget` : optional 0-based target output index (`0` … `count-1`) or `'all'`.
   *   Count comes from host `getProperty('viewoutputscount')` and is not a fixed max of 2.
   *   `'all'` fans out to each index; the host only receives numeric `output=N` (never `output=all`).
   *   Omit for legacy single-target / default behavior.
   */
  static stopLocalRecording(optionBag?: OutputTargetOptions): Promise<boolean> {
    return execLocalRecordingHost('stopBroadcast', [], optionBag, true);
  }

  /**
   * param: ([options]) -- see below
   *
   * ```
   * return: Promise<boolean>
   * ```
   *
   * Pause a local recording.
   *
   * Accepts an optional JSON object argument:
   * - `outputTarget` : optional 0-based target output index (`0` … `count-1`) or `'all'`.
   *   Count comes from host `getProperty('viewoutputscount')` and is not a fixed max of 2.
   *   `'all'` fans out to each index; the host only receives numeric `output=N` (never `output=all`).
   *   Omit for legacy single-target / default behavior.
   */
  static pauseLocalRecording(optionBag?: OutputTargetOptions): Promise<boolean> {
    return execLocalRecordingHost('pauseRecording', [], optionBag, false);
  }

  /**
   * param: ([options]) -- see below
   *
   * ```
   * return: Promise<boolean>
   * ```
   *
   * Unpause a local recording.
   *
   * Accepts an optional JSON object argument:
   * - `outputTarget` : optional 0-based target output index (`0` … `count-1`) or `'all'`.
   *   Count comes from host `getProperty('viewoutputscount')` and is not a fixed max of 2.
   *   `'all'` fans out to each index; the host only receives numeric `output=N` (never `output=all`).
   *   Omit for legacy single-target / default behavior.
   */
  static unpauseLocalRecording(optionBag?: OutputTargetOptions): Promise<boolean> {
    return execLocalRecordingHost('unpauseRecording', [], optionBag, false);
  }

  /**
   *  return: Promise<string>
   *
   *  Gets the actual name of the Output.
   */
  getName(): Promise<string> {
    return new Promise((resolve) => {
      resolve(this._name);
    });
  }

  /**
   *  return: Promise<string>
   *
   *  Gets the name of the Output as displayed in the Outputs menu.
   */
  getDisplayName(): Promise<string> {
    return new Promise((resolve) => {
      Output._getBroadcastChannels(Output._id, this._name).then((channelJXON) => {
        channelJXON['displayName'] = channelJXON['displayName']
          ? channelJXON['displayName']
              .replace(/&apos;/g, "'")
              .replace(/&quot;/g, '"')
              .replace(/&gt;/g, '>')
              .replace(/&lt;/g, '<')
              .replace(/&amp;/g, '&')
          : this._name;
        resolve(channelJXON['displayName']);
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
   * - `outputTarget` : optional 0-based target output index (`0` … `count-1`) or `'all'`.
   *   Count comes from host `getProperty('viewoutputscount')` and is not a fixed max of 2.
   *   `'all'` fans out to each index; the host only receives numeric `output=N` (never `output=all`).
   *   Omit for legacy single-target / default behavior.
   *
   * ```javascript
   * output.startBroadcast({ suppressPrestreamDialog: true });
   * output.startBroadcast({ suppressPrestreamDialog: true, outputTarget: 'all' });
   * output.startBroadcast({ outputTarget: '0' });
   * ```
   */
  startBroadcast(optionBag?: BroadcastOptions): Promise<boolean> {
    const suppress =
      versionCompare(getVersion()).is.greaterThanOrEqualTo(handlePreStreamDialogFixVersion) &&
      typeof optionBag !== 'undefined' &&
      optionBag !== null &&
      !!optionBag.suppressPrestreamDialog;
    const extraArgs = suppress ? ['suppressPrestreamDialog=1'] : [];
    return execChannelHost('startBroadcast', this._name, extraArgs, optionBag, false);
  }

  /**
   * param: ([options]) -- see below
   *
   * ```
   * return: Promise<boolean>
   * ```
   *
   * Stop a broadcast of the provided channel.
   *
   * Accepts an optional JSON object argument:
   * - `outputTarget` : optional 0-based target output index (`0` … `count-1`) or `'all'`.
   *   Count comes from host `getProperty('viewoutputscount')` and is not a fixed max of 2.
   *   `'all'` fans out to each index; the host only receives numeric `output=N` (never `output=all`).
   *   Omit for legacy single-target / default behavior.
   */
  stopBroadcast(optionBag?: OutputTargetOptions): Promise<boolean> {
    return execChannelHost('stopBroadcast', this._name, [], optionBag, true);
  }

  /**
   * ** For Deprecation, please use the static method instead
   *
   * return: Promise<boolean>
   *
   * Pause a local recording.
   */
  pauseLocalRecording(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this._name === 'Local Recording') {
        StreamInfo.getActiveStreamChannels().then((channels) => {
          Output._localRecording = false;
          for (var i = 0; i < channels.length; i++) {
            if (channels[i]['_name'] === 'Local Recording') {
              Output._localRecording = true;
              break;
            }
          }
          if (Output._localRecording) {
            exec('CallHostFunc', 'pauseRecording');
            resolve(true);
          } else {
            reject(Error('Local recording is not active.'));
          }
        });
      } else {
        reject(Error('Output is not a local recording'));
      }
    });
  }

  /**
   * ** For Deprecation, please use the static method instead
   *
   * return: Promise<boolean>
   *
   * Unpause a local recording.
   */
  unpauseLocalRecording(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this._name === 'Local Recording') {
        StreamInfo.getActiveStreamChannels().then((channels) => {
          Output._localRecording = false;
          for (var i = 0; i < channels.length; i++) {
            if (channels[i]['_name'] === 'Local Recording') {
              Output._localRecording = true;
              break;
            }
          }
          if (Output._localRecording) {
            exec('CallHostFunc', 'unpauseRecording');
            resolve(true);
          } else {
            reject(Error('Local recording is not active.'));
          }
        });
      } else {
        reject(Error('Output is not a local recording'));
      }
    });
  }

  static _getBroadcastChannels(id: string, ...args: any[]) {
    let callback: Function = null;
    let name;
    let callbackName;
    if (args.length === 1) {
      if (typeof args[0] === 'string') {
        name = args[0];
        callbackName = id + '_' + name;
        Output._id = id;
      }
    } else if (args.length === 2) {
      if (typeof args[0] === 'string') {
        name = args[0];
        callbackName = id + '_' + name;
        Output._id = id;
      } else {
        Output._id = id;
      }
      if (args[1] instanceof Function) {
        callback = args[1];
      }
    } else {
      Output._id = id;
    }
    return new Promise((resolve, reject) => {
      if (Environment.isSourcePlugin()) {
        const isID: boolean = /^{[A-F0-9-]*}$/i.test(Output._id);
        if (!isID) {
          reject(Error('Not a valid ID format for items'));
        }
      }
      if (Remote.remoteType === 'remote') {
        const message = {
          type: 'broadcastChannels',
          id,
          name: name ? name : undefined,
        };
        Extension._remoteCallback[name ? callbackName : Output._id] = { resolve };
        Remote.sendMessage(encodeURIComponent(JSON.stringify(message)));
      } else if (Remote.remoteType === 'proxy') {
        if (Output._proxyCallback[name ? callbackName : Output._id] === undefined) {
          Output._proxyCallback[name ? callbackName : Output._id] = [];
        }

        Output._proxyCallback[name ? callbackName : Output._id] = callback;
        name
          ? exec('CallHostFunc', 'getBroadcastChannelXml', name, '0', (channelXML) => {
              window.SetBroadcastChannelXml(channelXML, name);
            })
          : exec('CallHostFunc', 'getBroadcastChannelList', window.SetBroadcastChannelList);
      } else {
        if (Output._callback[name ? callbackName : Output._id] === undefined) {
          Output._callback[name ? callbackName : Output._id] = [];
        }
        Output._callback[name ? callbackName : Output._id] = { resolve };
        name
          ? exec('CallHostFunc', 'getBroadcastChannelXml', name, '0', (channelXML) => {
              window.SetBroadcastChannelXml(channelXML, name);
            })
          : exec('CallHostFunc', 'getBroadcastChannelList', window.SetBroadcastChannelList);
      }
    });
  }

  static _finalCallback(message: string) {
    return new Promise((resolve) => {
      const result = JSON.parse(decodeURIComponent(message));
      Extension._remoteCallback[Output._id].resolve(result['result']);
    });
  }
}

const oldSetBroadcastChannelList = window.SetBroadcastChannelList;
window.SetBroadcastChannelList = function (channels) {
  if (Remote.remoteType === 'proxy') {
    Output._proxyCallback[Output._id].call(this, channels);
  } else {
    Output._callback[Output._id].resolve(channels);
  }

  if (typeof oldSetBroadcastChannelList === 'function') {
    oldSetBroadcastChannelList(channels);
  }
};

const oldSetBroadcastChannelXml = window.SetBroadcastChannelXml;
window.SetBroadcastChannelXml = function (channelXML, name) {
  const channelJXON = JXON.parse(channelXML);
  channelJXON['name'] = channelJXON['name'] ? channelJXON['name'] : name;
  channelJXON['displayName'] = channelJXON['displayName'] ? channelJXON['displayName'] : name;
  channelJXON['name'] = channelJXON['name']
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&');
  if (Remote.remoteType === 'proxy') {
    Output._proxyCallback[Output._id + '_' + channelJXON['name']].call(this, channelXML);
  } else {
    Output._callback[Output._id + '_' + channelJXON['name']].resolve(channelJXON);
  }

  if (typeof oldSetBroadcastChannelXml === 'function') {
    oldSetBroadcastChannelXml(channelXML);
  }
};
