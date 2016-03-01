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
   * Creates an XML object with the playlist properties. This method is used
   * internally for the `addToScene` method.
   */

  toXML(): Promise<string> {

    return new Promise((resolve, reject) => {
      let filePromises = this._playlist.map((filename) => {
        return new Promise(ioResolve => {
          IO.getVideoDuration(filename).then(duration => {
            ioResolve(duration);
          }).catch(err => {
            ioResolve(err);
          })  
        })
      });

      Promise.all(filePromises).then(duration => {
        var fileItems = new JXON();

        let isError = false;
        for (var i = 0; i < this._playlist.length; i++) {
          if (typeof duration === 'object') {
            isError = true;
            break;
          }
          this._fileplaylist += this._playlist[i] + '*' + i + '*1*' +
            duration[i] + '*100*0*0*0*0*0|';
        }

        if (!isError) {
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
        } else {
          reject('One or more files included are invalid.');
        }
      });
    });
  }

  /**
   *  Adds the prepared video playlist to the current scene.
   *
   *  This function is not available to sources.
   */
  addToScene(): Promise <boolean> {
    return new Promise((resolve, reject) => {
      if (Environment.isSourcePlugin()) {
        reject(Error('This function is not available to sources.'));
      } else {
        this.toXML().then(fileitem => {
          iApp.callFunc('additem', ' ' + fileitem)
          .then(() => { resolve(true) });
        }).catch(err => {
          reject(err);
        });
      }
    });
  }
}