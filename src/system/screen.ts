/// <reference path="../../defs/es6-promise.d.ts" />

import {Addable} from './iaddable';
import {exec} from '../internal/internal';
import {App as iApp} from '../internal/app';
import {Scene} from '../core/scene';
import {Environment} from '../core/environment';
import {JSON as JXON} from '../internal/util/json';
import {XML} from '../internal/util/xml';

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
   * return: Promise<boolean>
   * ```
   *
   * Adds the prepared screen instance to the current screen by defualt.
   * Accpets optional parameter value, whhich when supplied, points
   * to the scene where the item will be added instead.
   *
   */
  addToScene(value?:number | Scene): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this instanceof Screen && !Environment.isSourcePlugin()) {
        let scenePrefix = '';
        let scenePromise;
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
          return `<screen module="${this._processDetail}" window="${this._title}" class="${this._class}" hwnd="${this._hwnd}" wclient="1" left="0" top="0" width="0" height="0" />`
        }).then(screen => {
          return iApp.callFunc(scenePrefix + 'addscreen', screen)
        }).then(() => {
          resolve(true)
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
   * return: Promise<boolean>
   * ```
   *
   * Initializes the screen region selector crosshair
   * so user may select a desktop region or a window to add to the stage in the current scene.
   * Accepts an optional parameter value, which, when supplied,
   * points to the scene where item will be added instead.
   *
   */
  static addToScene(value?: number | Scene ): Promise<boolean> {
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
          exec('AppCallFunc', scenePrefix + 'addscreen');
          resolve(true);
        }).catch(err => {
          reject(err);
        });
      })
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
