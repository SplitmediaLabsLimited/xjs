/// <reference path="../../../defs/es6-promise.d.ts" />

import {Item as iItem} from '../../internal/item';
import {JSON as JXON} from '../../internal/util/json';
import {Logger} from '../../internal/util/logger';

export interface ISourceMedia {
  /**
   * return: Promise<object>
   *
   * Gets file information such as codecs, bitrate, resolution, etc.
   *
   * sample file info object format:
   *
   * {
   *  "audio": {
   *    "duration":"1436734690",
   *    "samplerate":"44100",
   *    "bitrate":"128000",
   *    "codec":"mp3"},
   *  "video":{
   *    "frameduration":"333670",
   *    "bitrate":"1132227",
   *    "duration":"1436436440",
   *    "height":"240",
   *    "width":"320",
   *    "codec":"mpeg4"}
   * }
   *
   * #### Usage
   *
   * ```javascript
   * mediaItem.getFileInfo().then(function(value) {
   *   // Do something with the value
   *   var audioCodec;
   *   if (typeof value['audio'] !== 'undefined' && typeof value['audio']['codec']) {
   *     audioCodec = value['audio']['codec'];
   *   }
   * });
   * ```
   */
  getFileInfo(): Promise<Object>

  /**
   * return: Promise<boolean>
   *
   * Check if file used as source is available
   *
   * #### Usage
   *
   * ```javascript
   * item.isSourceAvailable().then(function(isAvail) {
   *   // The rest of your code here
   * });
   * ```
   */
  isSourceAvailable(): Promise<boolean>
}

export class SourceMedia implements ISourceMedia {
  private _id: string;
  private _isItemCall: boolean;
  private _srcId: string;
  private _checkPromise;
  private _sceneId: string;

  private _updateId(id?: string, sceneId?: string) {
    this._id = id;
    this._sceneId = sceneId;
  }

  getFileInfo(): Promise<Object> {
    return new Promise((resolve, reject) => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'getFileInfo', true)
        this._checkPromise = iItem.get('FileInfo', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('FileInfo', this._srcId,
          this._id, this._updateId.bind(this))
      }
      this._checkPromise.then(val => {
        try {
          let fileInfoObj: Object = {};
          let fileInfoJXON = JXON.parse(val);
          if (typeof fileInfoJXON['children'] !== 'undefined'
            && fileInfoJXON['children'].length > 0) {
            let fileInfoChildren = fileInfoJXON['children'];
            for (var i = fileInfoChildren.length - 1; i >= 0; i--) {
              var child = fileInfoChildren[i];
              var childObj: Object = {};
              var childObjKeys = Object.keys(child);
              for (var j = childObjKeys.length - 1; j >= 0; j--) {
                var key = childObjKeys[j];
                if (key !== 'value' && key !== 'tag') {
                  childObj[key] = child[key];
                }
              }
              var tag = child['tag'];
              fileInfoObj[tag] = childObj;
            }
            resolve(fileInfoObj);
          } else {
            resolve(fileInfoObj);
          }
        } catch (e) {
          reject(Error('Error retrieving file information'));
        }
      });
    });
  }

  isSourceAvailable(): Promise<boolean> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'isSourceAvailable', true)
        iItem.get('prop:itemavail', this._id).then(val => {
          resolve(val === '1');
        });
      } else {
        iItem.wrapGet('prop:itemavail', this._srcId, this._id, this._updateId.bind(this)).then(val => {
          resolve(val === '1');
        });
      }
    });
  }  
}
