/// <reference path="../../defs/es6-promise.d.ts" />

import {App as iApp} from '../internal/app';
import {Addable} from './iaddable';

/**
 *  Special class for adding a video playlist to the stage.
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 * var VideoPlaylist = XJS.VideoPlaylist;
 *
 * var vids = new VideoPlaylist(['C:\\Users\\Public\\Music\\video1.mp4',
      'C:\\Users\\Public\\Music\\video2.mp4']).addToScene();
 * ```
 */
export class VideoPlaylist implements Addable {

  private _files: string[];

  /**
   *  param: (files: string[])
   *
   *  Creates a VideoPlaylist object for several video files.
   */
  constructor(files: string[]) {
    this._files = files;
  }

  /**
   *  return: Promise<boolean>
   *
   *  Adds this file to the current scene.
   */
  addToScene(): Promise<boolean> {
    return undefined; // to be implemented
  }
}
