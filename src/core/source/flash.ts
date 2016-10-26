/// <reference path="../../../defs/es6-promise.d.ts" />

import {applyMixins} from '../../internal/util/mixin';
import {Source} from '../source/source';
import {Item as iItem} from '../../internal/item';
import {Rectangle} from '../../util/rectangle';
import {IItemAudio, ItemAudio} from '../items/iaudio';

export class FlashSource extends Source implements IItemAudio{
  /**
   * return: Promise<Rectangle>
   *
   * Gets the custom resolution (in pixels) for the item, if set,
   * regardless of its layout on the mixer. Returns a (0, 0) Rectangle if no
   * custom resolution has been set.
   *
   * See also: {@link #util/Rectangle Util/Rectangle}
   */
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

  /**
   * param: (value: Rectangle)
   * ```
   * return: Promise<FlashSource>
   * ```
   *
   * Sets the custom resolution for the item
   * regardless of its layout on the mixer
   *
   * *Chainable.*
   *
   * See also: {@link #util/Rectangle Util/Rectangle}
   */
  setCustomResolution(value: Rectangle): Promise<FlashSource> {
    return new Promise(resolve => {
      iItem.set('prop:BrowserSize', value.toDimensionString(),
        this._id).then(() => {
          resolve(this);
      });
    });
  }
  /**
   * return: Promise<boolean>
   *
   * Check if right click events are sent to the item or not.
   *
   * #### Usage
   *
   * ```javascript
   * item.getAllowRightClick().then(function(isRightClickAllowed) {
   *   // The rest of your code here
   * });
   * ```
   */
  getAllowRightClick(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:BrowserRightClick', this._id).then(val => {
        resolve(val === '1');
      });
    });
  }

  /**
   * param: (value:boolean)
   * ```
   * return: Promise<Item>
   * ```
   *
   * Allow or disallow right click events to be sent to the item. Note that
   * you can only catch right click events using `mouseup/mousedown`
   *
   * *Chainable*
   *
   * #### Usage
   *
   * ```javascript
   * item.setAllowRightClick(true).then(function(item) {
   *   // Promise resolves with the same Item instance
   * });
   * ```
   */
  setAllowRightClick(value: boolean): Promise<Source> {
    return new Promise(resolve => {
      iItem.set('prop:BrowserRightClick', (value ? '1' : '0'), this._id)
        .then(() => {
          resolve(this);
        });
    });
  }

  // ItemAudio

  /** See: {@link #core/IItemAudio#getVolume getVolume} */
  getVolume: () => Promise<number>;

  /** See: {@link #core/IItemAudio#isMute isMute} */
  isMute: () => Promise<boolean>;

  /** See: {@link #core/IItemAudio#setVolume setVolume} */
  setVolume: (value: number) => Promise<FlashSource>;

  /** See: {@link #core/IItemAudio#setMute setMute} */
  setMute: (value: boolean) => Promise<FlashSource>;

  /** See: {@link #core/IItemAudio#isStreamOnlyAudio isStreamOnlyAudio} */
  isStreamOnlyAudio: () => Promise<boolean>;

  /** See: {@link #core/IItemAudio#setStreamOnlyAudio setStreamOnlyAudio} */
  setStreamOnlyAudio: (value: boolean) => Promise<FlashSource>;

  /** See: {@link #core/IItemAudio#isAudioAvailable isAudioAvailable} */
  isAudioAvailable: () => Promise<boolean>;

}

applyMixins(FlashSource, [ItemAudio])
