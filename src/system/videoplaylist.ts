/// <reference path="../../defs/es6-promise.d.ts" />

import {App as iApp} from '../internal/app';
import {Addable} from './iaddable';
import {JSON as JXON} from '../internal/util/json';
import {XML} from '../internal/util/xml';
import {IO} from '../util/io';
import {Environment} from '../core/environment';
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

  private _playlist: string[];
  private _id: number = 0;
  private _fileplaylist: string = '';
  private _testJSON: string;

  /**
   *  param: (files: string[])
   *
   *  Creates a VideoPlaylist object for several video files.
   */
  constructor(items: string[]) {
    this._playlist = items;
  }

  /**
   * return: XML
   *
   * Creates an XML object with the playlist properties
   */

  toXML(): Promise<string> {
    return new Promise(resolve => {
      let filePromises = this._playlist.map((filename) => {
        return IO.getVideoDuration(filename)
      });

      Promise.all(filePromises).then(values => {
        // this._playlist[0] ~~ values[0]
        console.log(values);
        var fileItems = new JXON();

        for (var i = 0; i < values.length; i++) {
          this._fileplaylist += this._playlist[i] + '*' + i + '*1*' + values[i] + '*100*0*0*0*0*0|';
        }
        /**
         * Convert the array of items into a single string
         * to be added on the FilePlaylist Property
         *
         */
        fileItems.tag = 'item';
        fileItems['type'] = '1';
        fileItems['name'] = 'Video Playlist';
        fileItems['pos_left'] = '0.250000';
        fileItems['pos_top'] = '0.250000';
        fileItems['pos_right'] = '0.750000';
        fileItems['pos_bottom'] = '0.750000';
        fileItems['item']           = this._playlist[0] + '*0';
        fileItems['FilePlaylist']   = this._fileplaylist;
        resolve(XML.parseJSON(fileItems));
      });
    });
  }

  addToScene(): Promise <boolean> {
    return new Promise((resolve, reject) => {
      if (Environment.isSourcePlugin()) {
        reject(Error('File selection cancelled.'));
      } else {
        this.toXML().then(value => {
          iApp.callFunc('additem', ' ' + value)
          .then(() => { resolve(true) });
        })
      }
    });
  }
}



