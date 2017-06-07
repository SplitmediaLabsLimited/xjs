/// <reference path="../../defs/es6-promise.d.ts" />

import {App as iApp} from '../internal/app';
import {Addable} from './iaddable';
import {Scene} from '../core/scene';

/**
 *  Class for adding files (such as images and media)
 *  from your file system to the stage.
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 * var File = XJS.File;
 *
 * var filePromise = new File('C:\\Users\\Public\\Music\\song.mp3').addToScene();
 * ```
 */
export class File implements Addable {

  private _path: string;

  /**
   *  param: (file: string)
   *
   *  Creates a File object pertaining to a file's full path.
   */
  constructor(file: string) {
    this._path = file;
  }

  /**
   * param: (value?: number | Scene)
   * ```
   * return: Promise<boolean>
   * ```
   *
   * Adds this file to the current scene by default.
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
        return iApp.callFunc(scenePrefix + 'addfile', this._path);
      }).then(() => {
        resolve(true);
      }).catch(err => {
        reject(err);
      });
    });
  }
}
