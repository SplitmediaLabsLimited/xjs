/// <reference path="../../../defs/es6-promise.d.ts" />

import {Item as iItem} from '../../internal/item';
import {JSON as JXON} from '../../internal/util/json';
import {Logger} from '../../internal/util/logger';

export interface ISourceMedia {
  /**
   * return: Promise<object>
   *
   * Gets file information such as codecs, bitrate, resolution, etc.
   */
  getFileInfo(): Promise<Object>
}

export class SourceMedia implements ISourceMedia {
  private _id: string;
  private _isItemCall: boolean;

  getFileInfo(): Promise<Object> {
    if(this._isItemCall){
      Logger.warn('sourceWarning', 'getFileInfo', true)
    }
    return new Promise((resolve, reject) => {
      iItem.get('FileInfo', this._id).then(val => {
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
}
