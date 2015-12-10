/// <reference path="../../defs/es6-promise.d.ts" />

import {App as iApp} from '../internal/app';
import {Addable} from './iaddable';

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

  private _getPath(): Promise<string> {
    return new Promise(resolve => {
      resolve(this._path);
    });
  }

  /**
   *  return: Promise<boolean>
   *
   *  Adds this file to the current scene.
   */
  addToScene(): Promise<boolean> {
    return new Promise(resolve => {
      iApp.callFunc('addfile', this._path).then(() => {
        resolve(true);
      });
    });
  }
}
