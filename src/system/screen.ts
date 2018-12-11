/// <reference path="../../defs/es6-promise.d.ts" />

import {Addable} from './iaddable';
import {exec} from '../internal/internal';
import {Scene} from '../core/scene';
import {Environment} from '../core/environment';
import {JSON as JXON} from '../internal/util/json';
import {XML} from '../internal/util/xml';
import{checkSplitmode} from '../internal/util/splitmode';
import {addToSceneHandler} from '../util/addtosceneutil';

/**
 * The Screen Class is the object returned by {@link #system/System System Class}
 * getAvailableScreens method. It provides you with methods to add the screen object
 * to the current scene or any scene specified or use it's static method to fire a
 * selector for you to manually select a screen/screen region to capture and add on
 * your selected scene.
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 * var System = XJS.System;
 *
 * System.getAvailableScreens().then(function(screens) {
 *  for (var i in screens) {
 *    screens[i].addToScene();
 *  }
 * });
 * ```
 */
export class Screen implements Addable {
  private _title: string;
  private _processDetail: string;
  private _class: string;
  private _hwnd: string;

  constructor(props?: {}) {
    this._title = props['title'];
    this._processDetail = props['processDetail'];
    this._class = props['class'];
    this._hwnd = props['hwnd'];
  }

  /**
   * param: (value?: number | Scene)
   * ```
   * return: Promise<any>
   * ```
   *
   * Adds the prepared screen instance to the current screen by defualt.
   * Accpets optional parameter value, whhich when supplied, points
   * to the scene where the item will be added instead.
   * If ready config {listenToItemAdd: true} it returns item id,
   * else returns boolean.
   *
   * Note: There is yet no way to detect error responses for this action.
   */
  addToScene(value?:number | Scene): Promise<any> {
    return new Promise((resolve, reject) => {
      let scenePrefix = ''
      if (this instanceof Screen && !Environment.isSourcePlugin()) {
        checkSplitmode(value).then((prefix) => {
          scenePrefix = prefix
          return `<screen module="${this._processDetail}" window="${this._title}" class="${this._class}" hwnd="${this._hwnd}" wclient="1" left="0" top="0" width="0" height="0" />`
        }).then(screen => {
          return addToSceneHandler(scenePrefix + 'addscreen', screen)
        }).then(result => {
          resolve(result);
        }).catch(err => {
          reject(err);
        });
      } else {
        reject(Error('Instance is not a Screen'))
      }
    })
  }

  /**
   * param: (value?: number | Scene)
   * ```
   * return: Promise<any>
   * ```
   *
   * Initializes the screen region selector crosshair
   * so user may select a desktop region or a window to add to the stage in the current scene.
   * Accepts an optional parameter value, which, when supplied,
   * points to the scene where item will be added instead.
   * If ready config {listenToItemAdd: true} it returns item id,
   * else returns boolean.
   *
   * Note: There is yet no way to detect error responses for this action.
   */
  static addToScene(value?: number | Scene ): Promise<any> {
    return new Promise((resolve, reject) => {
      checkSplitmode(value).then((scenePrefix) => {
        return addToSceneHandler(scenePrefix + 'addscreen', null);
      }).then(result => {
        resolve(result);
      }).catch(err => {
        reject(err);
      });
    });
  }

  /**
   * param: Object
   * ```
   * return Screen
   * ```
   *
   * Converts an object into a Screen object.
   *
   * #### Usage
   *
   * ```javascript
   * var XJS = require('xjs');
   * var screen = XJS.Screen.parse(jsonObj);
   * ```
   */
  static parse(screenInfo): Screen {
    var screen = new Screen({
      'title': screenInfo['title'],
      'class': screenInfo['class'],
      'processDetail': screenInfo['processDetail'],
      'hwnd': screenInfo['hwnd']
    });

    return screen;
  }
}
