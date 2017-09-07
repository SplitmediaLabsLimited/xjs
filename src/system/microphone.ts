/// <reference path="../../defs/es6-promise.d.ts" />

import {JSON as JXON} from '../internal/util/json';
import {XML} from '../internal/util/xml';
import {App as iApp} from '../internal/app';
import {Addable} from './iaddable';
import {Scene} from '../core/scene';

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
  addToScene(value?: number | Scene ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let scenePrefix = '';
      let scenePromise;
      let checkSplitMode;

      checkSplitMode = new Promise(splitPromise => {
        iApp.getGlobalProperty('splitmode').then(res => {
          if (res === '1' && !value) {
            Scene.getActiveScene().then(val => {
              value = val
              splitPromise(value)
            })
          } else {
            splitPromise(value)
          }
        })
      })

      checkSplitMode.then(value => {
        if (typeof value === 'number' || value instanceof Scene) {
          scenePromise = new Promise((innerResolve, innerReject) => {
            Scene.getSceneCount().then(sceneCount => {
              if (typeof value === 'number') {
                let int = Math.floor(value);
                if (int > sceneCount || int === 0) {
                  innerReject(new Error('Scene not existing.'));
                } else {
                  scenePrefix = 's:' + (int - 1) + '|';
                  innerResolve();
                }
              } else {
                value.getSceneNumber().then(int => {
                  if (int > sceneCount || int === 0) {
                    innerReject(new Error('Scene not existing.'));
                  } else {
                    scenePrefix = 's:' + (int - 1) + '|';
                    innerResolve();
                  }
                });
              }
            });
          });
        } else if (typeof value === 'undefined') {
          scenePromise = Promise.resolve();
        } else {
          scenePromise = Promise.reject(new Error('Optional parameter \'scene\' only accepts integers or an XJS.Scene object'))
        }

        scenePromise.then(() => {
          return iApp.callFunc(scenePrefix + 'additem', this.toXML().toString());
        }).then(() => {
          resolve(true);
        }).catch(err => {
          reject(err);
        });
      })
    });
  }
}
