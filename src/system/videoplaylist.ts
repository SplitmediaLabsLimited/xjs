/// <reference path="../../defs/es6-promise.d.ts" />

import {App as iApp} from '../internal/app';
import {Addable} from './iaddable';
import {JSON as JXON} from '../internal/util/json';
import {XML} from '../internal/util/xml';

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
  private _fileplaylist: string;


  /**
   *  param: (files: string[])
   *
   *  Creates a VideoPlaylist object for several video files.
   */
  constructor(items: string[]){
  this._playlist = items;
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
     * Rerturns: fileplaylist
     */
    this._fileplaylist = this._playlist.toString();
    var replaceMatch = this._fileplaylist.indexOf(',');

    while (replaceMatch != -1){

      this._fileplaylist = this._fileplaylist.replace( ',' , '*'+this._id+'*1*0*100*0*0*0*0*0|');
      replaceMatch = this._fileplaylist.indexOf(',');
      this._id++;
    }

    fileItems.tag            = 'item';
    fileItems['type']        = '1';
    fileItems['name']        = 'Video Playlist';
    fileItems['pos_left']    = '0.250000';
    fileItems['pos_top']     = '0.250000';
    fileItems['pos_right']   = '0.750000';
    fileItems['pos_bottom']  = '0.750000';
    fileItems['item']        = this._playlist[0]+'*0';
    fileItems['FilePlaylist']= this._fileplaylist+'*'+this._id+'*1*0*100*0*0*0*0*0';
    // playlist['FilePlaylist']= this._playlist+'*'+this._id+'*1*'+this._duration+'*100*0*0*0*0*0|';

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
