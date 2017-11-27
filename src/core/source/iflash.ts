/// <reference path="../../../defs/es6-promise.d.ts" />

import {Item as iItem} from '../../internal/item';
import {Rectangle} from '../../util/rectangle';
import {Logger} from '../../internal/util/logger';

export interface ISourceFlash {
  customResolution(value?: Rectangle): Promise<Rectangle|ISourceFlash>
  allowRightClick(value?: boolean): Promise<boolean|ISourceFlash>
  /**
   * return: Promise<Rectangle>
   *
   * Gets the custom resolution (in pixels) for the item, if set,
   * regardless of its layout on the mixer. Returns a (0, 0) Rectangle if no
   * custom resolution has been set.
   */
  // getCustomResolution(): Promise<Rectangle>

  /**
   * param: (value: Rectangle)
   * ```
   * return: Promise<FlashSource>
   * ```
   *
   * Sets the custom resolution for the item
   * regardless of its layout on the mixer
   */
  // setCustomResolution(value: Rectangle): Promise<ISourceFlash>
  /**
   * return: Promise<boolean>
   *
   * Check if right click events are sent to the item or not.
   */
  // getAllowRightClick(): Promise<boolean>

  /**
   * param: (value:boolean)
   * ```
   * return: Promise<Item>
   * ```
   *
   * Allow or disallow right click events to be sent to the item. Note that
   * you can only catch right click events using `mouseup/mousedown`
   */
  // setAllowRightClick(value: boolean): Promise<ISourceFlash>
}

export class SourceFlash implements ISourceFlash {
  private _id: string;
  private _srcId: string;
  private _isItemCall: boolean;
  private _checkPromise;
  private _sceneId: string;

  private _updateId(id?: string, sceneId?: string) {
    this._id = id;
    this._sceneId = sceneId;
  }

  customResolution(value?: Rectangle): Promise<Rectangle|SourceFlash> {
    return new Promise((resolve, reject) => {
      let customSize
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'customResolution',  true)
      }

      if (this._isItemCall && value) {
        iItem.set('prop:BrowserSize', value.toDimensionString(),
        this._id).then(() => {
          resolve(this);
        });
      } else if (!this._isItemCall && value) {
        iItem.wrapSet('prop:BrowserSize', value.toDimensionString(),
        this._srcId, this._id, this._updateId.bind(this)).then(() => {
          resolve(this);
        });
      } else if (this._isItemCall && !value) {
        this._checkPromise = iItem.get('prop:BrowserSize', this._id)
      } else if (!this._isItemCall && !value) {
        this._checkPromise = iItem.wrapGet('prop:BrowserSize', this._srcId,
        this._id, this._updateId.bind(this))
      }

      this._checkPromise.then(val => {
        if (val !== '') {
          var [width, height] = decodeURIComponent(val).split(',');
          customSize = Rectangle.fromDimensions(Number(width), Number(height));
        } else {
          customSize = Rectangle.fromDimensions(0, 0);
        }
        resolve(customSize);
      });
    })
  }

  allowRightClick(value?: boolean): Promise<boolean|SourceFlash> {
    return new Promise((resolve, reject) => {
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'allowRightClick',  true)
      }

      if (this._isItemCall && value) {
        iItem.set('prop:BrowserRightClick', (value ? '1' : '0'), this._id)
        .then(() => {
          resolve(this);
        });
      } else if (!this._isItemCall && value) {
        iItem.wrapSet('prop:BrowserRightClick', (value ? '1' : '0'), this._srcId, this._id, this._updateId.bind(this))
        .then(() => {
          resolve(this);
        });
      } else if (this._isItemCall && !value) {
        iItem.get('prop:BrowserRightClick', this._id).then(val => {
          resolve(val === '1');
        });
      } else if (!this._isItemCall && !value) {
        iItem.wrapGet('prop:BrowserRightClick', this._srcId, this._id, this._updateId.bind(this)).then(val => {
          resolve(val === '1');
        });
      }
    })
  }
}
