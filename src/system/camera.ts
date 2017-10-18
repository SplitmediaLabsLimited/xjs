/// <reference path="../../defs/es6-promise.d.ts" />

import {JSON as JXON} from '../internal/util/json';
import {XML} from '../internal/util/xml';
import {Addable} from './iaddable';
import {App as iApp} from '../internal/app';
import {Scene} from '../core/scene';

/**
 * The CameraDevice Class is the object returned by
 * {@link #system/System System Class} getCameraDevices method. It provides
 * you with methods to fetch the Camera Device's id, name, and to add it as
 * a source in the current scene.
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 * var System = XJS.System;
 *
 * System.getCameraDevices().then(function(cameras) {
 *   for (var i in cameras) {
 *     xml = cameras[i].toXML();
 *     // do something with the XML here
 *   }
 * });
 * ```
 */
export class CameraDevice implements Addable {
  private _id: string;
  private _name: string;

  constructor(props?: {}) {
    this._id   = props['id'];
    this._name = props['name'];
  }

  /**
   * return: string
   *
   * Get the ID of the device. The ID of the device is based on the `disp`
   * attribute of the devices XML
   *
   * #### Usage
   *
   * ```javascript
   * var cameraID = device.getId();
   * ```
   */
  getId(): string {
    return this._id;
  }

  /**
   * return: string
   *
   * Get the Name of the device.
   *
   * #### Usage
   *
   * ```javascript
   * var cameraName = device.getName();
   * ```
   */
  getName(): string {
    return this._name;
  }

  /**
   * return: XML
   *
   * Convert the current CameraDevice object to XML
   *
   * #### Usage
   *
   * ```javascript
   * var xml = device.toXML();
   * ```
   */
  toXML(): XML {
    var json = new JXON();
    json['disp'] = this._id;
    json['name'] = this._name;
    return XML.parseJSON(json);
  }

  /**
   * param: (deviceJSON: JXON)
   * ```
   * return: CameraDevice
   * ```
   *
   * Create a CameraDevice object based on a JXON object
   *
   * #### Usage
   *
   * ```javascript
   * var camera = CameraDevice.parse(JSONObj);
   * ```
   */
  static parse(deviceJSON: JXON): CameraDevice {
    var cam = new CameraDevice({
      id:   deviceJSON['disp'].replace(/&amp;/ig, '&'),
      name: deviceJSON['name']
    });

    return cam;
  }

  /**
   * param: (value?: number | Scene)
   * ```
   * return: Promise<boolean>
   * ```
   *
   * Adds this camera device to the current scene by default.
   * Accepts an optional parameter value, which, when supplied,
   * points to the scene where item will be added instead.
   */
  addToScene(value?: number | Scene ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let scenePrefix = '';
      let scenePromise;
      if (typeof value === 'number' || value instanceof Scene) {
        scenePromise = new Promise((innerResolve, innerReject) => {
          Scene.getSceneCount().then(sceneCount => {
            if (typeof value === 'number') {
              let int = Math.floor(value);
              if (int > sceneCount || int === 0) {
                innerReject(Error('Scene not existing.'));
              } else {
                scenePrefix = 's:' + (int - 1) + '|';
                innerResolve();
              }
            } else {
              value.getSceneNumber().then(int => {
                if (int > sceneCount || int === 0) {
                  innerReject(Error('Scene not existing.'));
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
        scenePromise = Promise.reject(Error('Optional parameter \'scene\' only accepts integers or an XJS.Scene object'))
      }

      scenePromise.then(() => {
        return iApp.callFunc(scenePrefix + 'addcamera', 'dev:' + this._id);
      }).then(() => {
        resolve(true);
      }).catch(err => {
        reject(err);
      });
    });
  }
}