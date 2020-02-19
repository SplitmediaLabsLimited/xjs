/// <reference path="../../defs/es6-promise.d.ts" />

import {Addable} from './iaddable';
import {Item} from '../core/items/item';
import {Scene} from '../core/scene';
import {App as iApp} from '../internal/app';
import{checkSplitmode} from '../internal/util/splitmode';
import {JSON as JXON} from '../internal/util/json';
import {XML} from '../internal/util/xml';
import {addToSceneHandler} from '../util/addtosceneutil';

var REPLAY_INCREMENT_COUNTER = 0;

const generateReplayName = function(): string {
  REPLAY_INCREMENT_COUNTER++;
  return Date.now() + `_replay#${REPLAY_INCREMENT_COUNTER}`;
}

/**
 *  The Class for combining several Items into a group.
 *  This can be initialized with an optional object parameter,
 *  which may contain the following:
 *    * buffer - the replay time, which ranges from 1-120 seconds. Default is 10.
 *    * channelName - the name of the channel where the replay will come from. Default is auto.
 *    * hotkey - the numerical equivalent of the keyboard combination to trigger the replay. Default is 0. 
 *             - This allots for the modifiers shift(65536), ctrl(131072), and alt(262144) keys
 *             - Sample computation for Ctrl + Shift + K = (keycode.which | 131072) | 65536 = 75 | 131072 | 65536 = 196683
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 * var Replay = XJS.Replay;
 * xjs.Output.getOutputList()
 * .then(function(outputs) {
 *   return outputs[0].getName();
 * }).then(function(name) {
 *   var newReplay = new Replay({
 *     buffer: 20,
 *     channelName: name
 *   });
 *   newReplay.addToScene();
 * })
 *
 * ```
 */
export class Replay implements Addable {

  private _buffer: number;
  private _channelName: string;
  private _hotkey: number;
  private _propName: string;

  constructor(replayOptions ?: Object) {
    this._buffer = replayOptions && replayOptions['buffer'] || 10;
    this._channelName = replayOptions && replayOptions['channelName'] || 'auto';
    this._hotkey = replayOptions && replayOptions['hotkey'] || 0;
    this._propName = 'Replay';
  }

  toXML(): XML {
    var replay = new JXON();

    replay.tag = 'item';
    replay['item'] = generateReplayName();
    replay['name'] = this._propName
    replay['type'] = '13'; // type REPLAY
    replay['selfclosing'] = false;

    var bufferJXON = new JXON();
    bufferJXON.tag = 'presproperty';
    bufferJXON.value = String(this._buffer);
    bufferJXON['__map_id'] = 'buffer'
    bufferJXON['selfclosing'] = false;

    var channelNameJXON = new JXON();
    channelNameJXON.tag = 'presproperty';
    channelNameJXON.value = this._channelName;
    channelNameJXON['__map_id'] = 'channelName'
    channelNameJXON['selfclosing'] = false;

    var hotkeyJXON = new JXON();
    hotkeyJXON.tag = 'presproperty';
    hotkeyJXON.value = String(this._hotkey);
    hotkeyJXON['__map_id'] = 'hotkey'
    hotkeyJXON['selfclosing'] = false;

    replay.children = [bufferJXON, channelNameJXON, hotkeyJXON];

    return XML.parseJSON(replay);
  }


  /**
   * param: (value?: number | Scene)
   * ```
   * return: Promise<any>
   * ```
   *
   * Adds this replay object to the current scene by default.
   * Accepts an optional parameter value, which, when supplied,
   * points to the scene where item will be added instead.
   * If ready config {listenToItemAdd: true} it returns item id,
   * else returns boolean.
   *
   * Note: There is yet no way to detect error responses for this action.
   */
  addToScene(value?: number | Scene ): Promise<any> {
    return new Promise((resolve, reject) => {
      checkSplitmode(value).then((scenePrefix) => {
        return addToSceneHandler(scenePrefix + 'additem', this.toXML().toString());
      }).then(result => {
        resolve(result);
      }).catch(err => {
        reject(err);
      });
    });
  }
}
