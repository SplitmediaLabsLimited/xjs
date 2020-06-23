/// <reference path="../../../defs/es6-promise.d.ts" />

import {Item as iItem} from '../../internal/item';
import {Logger} from '../../internal/util/logger';

export interface ISourceImage {
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

  /**
   * return: Promise<string>
   *
   * Gets the URL path of the image file used as a source
   *
   *
   * #### Usage
   *
   * ```javascript
   * source.getValue().then(function(value) {
   *   // Do something with the value
   * });
   * ```
   */
  getValue(): Promise<string>;

  /**
   * param: (value: string)
   * ```
   * return: Promise<ISourceImage>
   * ```
   *
   * Set the image file to be used as source
   *
   * #### Usage
   *
   * ```javascript
   * source.setValue('C:\\SomeFolder\\SomeFile.png')
   *   .then(function(source) {
   *   // Promise resolves with same Source instance
   * });
   * ```
   */
  setValue(value: string): Promise<any>;
}

export class SourceImage implements ISourceImage {
  private _id: string;
  private _srcId: string;
  private _isItemCall: boolean;
  private _checkPromise;
  private _sceneId: string;

  private _updateId(id?: string, sceneId?: string) {
    this._id = id;
    this._sceneId = sceneId;
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

  getValue(): Promise<string> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'getValue',  true)
        this._checkPromise = iItem.get('prop:srcitem', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('prop:srcitem', this._srcId,
          this._id, this._updateId.bind(this))
      }
      this._checkPromise.then(filename => {
        resolve(filename);
      });
    });
  };

  setValue(filename: string): Promise<SourceImage> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'setValue', true);
        this._checkPromise = iItem.set('prop:item', filename, this._id)  
      } else {
        this._checkPromise = iItem.wrapSet('prop:srcitem', filename,
          this._srcId, this._id, this._updateId.bind(this))
      }
      this._checkPromise
      .then(() => {
        return iItem.set('prop:name', filename, this._id)
      })
      .then(() => {
        resolve(this);
      });
    });
  }
}
