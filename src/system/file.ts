/// <reference path="../../defs/es6-promise.d.ts" />

import {App as iApp} from '../internal/app';
import {Addable} from './iaddable';
import {Scene} from '../core/scene';
import{checkSplitmode} from '../internal/util/splitmode';

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
      checkSplitmode(value).then((scenePrefix) => {
        return iApp.callFunc(scenePrefix + 'addfile', this._path);
      }).then(() => {
        resolve(true);
      }).catch(err => {
        reject(err);
      });
    })
  }
}
