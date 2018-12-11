/// <reference path="../../defs/es6-promise.d.ts" />

import {JSON as JXON} from '../internal/util/json';
import {XML} from '../internal/util/xml';
import {Addable} from './iaddable';
import {Scene} from '../core/scene';
import{checkSplitmode} from '../internal/util/splitmode';
import {addToSceneHandler} from '../util/addtosceneutil';

/**
 * The MicrophoneDevice class provides you with methods to add a microphone
 * device as a source on the stage.
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 * var System = XJS.System;
 *
 * System.getMicrophones().then(function(microphones) {
 *  for (var i in microphones) {
 *    microphones[i].addToScene();
 *  }
 * });
 * ```
 */
export class MicrophoneDevice implements Addable {
  private _disp: string;
  private _name: string;

  /**
   * param: (deviceJXON: JXON)
   * ```
   * return MicrophoneDevice
   * ```
   * Create a MicrophoneDevice onject based on a JXON object
   *
   */
  static parse(jxon: JXON): MicrophoneDevice {
    var m = new MicrophoneDevice();

    m._disp = jxon['disp'];
    m._name = jxon['name'];

    return m;
  }

  /**
   * return: string
   *
   * Gets the display ID
   *
   * #### Usage
   *
   * ```javascript
   * var micDisplayId = device.getDisplayId();
   * ```
   */
  getDisplayId(): string {
    return this._disp;
  }

  /**
   * return: XML
   *
   * Converts Microphone object into an XML object
   *
   * #### Usage
   *
   * ```javascript
   * var microphoneXML = microphone.toXML();
   * ```
   */
  toXML() : XML {
    var microphone = new JXON();

    microphone.tag = 'item';
    microphone['item'] = this._disp;
    microphone['name'] = this._name;
    microphone['type'] = '2'; // type LIVE
    microphone['selfclosing'] = true;

    return XML.parseJSON(microphone);
  }

  /**
   * param: (value?: number | Scene)
   * ```
   * return: Promise<boolean>
   * ```
   *
   * Adds this microphone device to the current scene by default.
   * Accepts an optional parameter value, which, when supplied,
   * points to the scene where item will be added instead.
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
