/// <reference path="../../../defs/es6-promise.d.ts" />

import {Item as iItem} from '../../internal/item';
import {Rectangle} from '../../util/rectangle';

export interface ISourceFlash {
  /**
   * return: Promise<Rectangle>
   *
   * Gets the custom resolution (in pixels) for the item, if set,
   * regardless of its layout on the mixer. Returns a (0, 0) Rectangle if no
   * custom resolution has been set.
   */
  getCustomResolution(): Promise<Rectangle>

  /**
   * param: (value: Rectangle)
   * ```
   * return: Promise<FlashSource>
   * ```
   *
   * Sets the custom resolution for the item
   * regardless of its layout on the mixer
   */
  setCustomResolution(value: Rectangle): Promise<ISourceFlash>
  /**
   * return: Promise<boolean>
   *
   * Check if right click events are sent to the item or not.
   */
  getAllowRightClick(): Promise<boolean>

  /**
   * param: (value:boolean)
   * ```
   * return: Promise<Item>
   * ```
   *
   * Allow or disallow right click events to be sent to the item. Note that
   * you can only catch right click events using `mouseup/mousedown`
   */
  setAllowRightClick(value: boolean): Promise<ISourceFlash>
}

export class SourceFlash implements ISourceFlash {
  private _id: string;

  getCustomResolution(): Promise<Rectangle> {
    return new Promise(resolve => {
      let customSize;
      iItem.get('prop:BrowserSize', this._id).then(val => {
        if (val !== '') {
          var [width, height] = decodeURIComponent(val).split(',');
          customSize = Rectangle.fromDimensions(Number(width), Number(height));
        } else {
          customSize = Rectangle.fromDimensions(0, 0);
        }
        resolve(customSize);
      });
    });
  }

  setCustomResolution(value: Rectangle): Promise<SourceFlash> {
    return new Promise(resolve => {
      iItem.set('prop:BrowserSize', value.toDimensionString(),
        this._id).then(() => {
          resolve(this);
      });
    });
  }

  getAllowRightClick(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:BrowserRightClick', this._id).then(val => {
        resolve(val === '1');
      });
    });
  }

  setAllowRightClick(value: boolean): Promise<SourceFlash> {
    return new Promise(resolve => {
      iItem.set('prop:BrowserRightClick', (value ? '1' : '0'), this._id)
        .then(() => {
          resolve(this);
        });
    });
  }
}
