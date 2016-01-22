/// <reference path="../../defs/es6-promise.d.ts" />

import {App as iApp} from '../internal/app';
import {Addable} from './iaddable';
import {JSON as JXON} from '../internal/util/json';
import {XML} from '../internal/util/xml';
//import * from '../util/io';

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
 * FilePlaylist Format:<filename>*<id>*<flags>*<duration>*<volume>*<deinterlace>*<in point>*<out point>*<cue points>*<custom data>
 * 
 */
export class VideoPlaylist implements Addable {

  private _playlist: string[];
  private _duration: number;
  private _id: number = 0;
  private _fileplaylist: string = '';


  /**
   *  param: (files: string[])
   *
   *  Creates a VideoPlaylist object for several video files.
   */
  constructor(items: string[]){
  this._playlist = items;
  }

  getVideoDuration() {
    return this._duration;
   }

  /**
   * return: XML
   * Creates an XML object with the playlist properties
   *
   *
   *
   */

  toXML(): XML {
    var fileItems = new JXON();

    /**
     * Convert the array of items into a single string
     * to be added on the FilePlaylist Property
     *
     */

    for (var i = 0 ; i < this._playlist.length ; i++){
      this._playlist[i] = this._playlist[i] + '*'+i+'*1*0*100*0*0*0*0*0|';
      this._fileplaylist += this._playlist[i];
    }

    fileItems.tag            = 'item';
    fileItems['type']        = '1';
    fileItems['name']        = 'Video Playlist';
    fileItems['pos_left']    = '0.250000';
    fileItems['pos_top']     = '0.250000';
    fileItems['pos_right']   = '0.750000';
    fileItems['pos_bottom']  = '0.750000';
    fileItems['item']        = this._playlist[0]+'*0';
    fileItems['FilePlaylist']= this._fileplaylist;

    return XML.parseJSON(fileItems);
  }

  addToScene(): Promise<boolean> {
    return new Promise(resolve => {
      iApp.callFunc('additem',' '+this.toXML()).then(() => {
        resolve(true);
      });
    });
  }
  
}
