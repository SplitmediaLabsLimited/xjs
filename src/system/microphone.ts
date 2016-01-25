/// <reference path="../../defs/es6-promise.d.ts" />

import {JSON as JXON} from '../internal/util/json';
import {XML} from '../internal/util/xml';
import {App as iApp} from '../internal/app';
import {Addable} from './iaddable';

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
   *  Adds this microphone device to the current scene.
   */
  addToScene(): Promise<boolean> {
    return new Promise(resolve => {
      iApp.callFunc('additem', this.toXML().toString()).then(() => {
        resolve(true);
      });
    });
  }
}
