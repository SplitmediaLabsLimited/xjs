/// <reference path="../../../defs/es6-promise.d.ts" />

import {applyMixins} from '../../internal/util/mixin';
import {Source} from '../source/source';
import {IAudio, Audio} from '../source/iaudio';
import {ISourceFlash, SourceFlash} from './iflash';
import {Rectangle} from '../../util/rectangle';

/**
 * The FlashSource class represents the sources of the audio device items that
 * has been added to the stage.
 *
 * Each item is represented by the AudioItem class.
 * See: {@link: #core/FlashItem Core/FlashItem}
 *
 * ### Basic Usage
 *
 * ```javascript
 * var xjs = require('xjs');
 *
 * xjs.Scene.getActiveScene().then(function(scene) {
 *   scene.getSources().then(function(sources) {
 *   for (var i in sources) {
 *       if (sources[i] instanceof XJS.FlashSource) {
 *         // Manipulate your audio device Source here
 *         sources[i].setSilenceDetectionEnabled(true);
 *       }
 *     }
 *   })
 * })
 */
export class FlashSource extends Source implements IAudio, ISourceFlash {
  //Shared with FlashItem
  /**
   * return: Promise<Rectangle>
   *
   * Gets the custom resolution (in pixels) for the item, if set,
   * regardless of its layout on the mixer. Returns a (0, 0) Rectangle if no
   * custom resolution has been set.
   *
   * See also: {@link #util/Rectangle Util/Rectangle}
   */
  getCustomResolution: () => Promise<Rectangle>

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
  setCustomResolution: (value: Rectangle) => Promise<ISourceFlash>
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
  getAllowRightClick: () => Promise<boolean>

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
  setAllowRightClick: (value: boolean) => Promise<ISourceFlash>

  // ItemAudio

  /** See: {@link #core/IAudio#getVolume getVolume} */
  getVolume: () => Promise<number>;

  /** See: {@link #core/IAudio#isMute isMute} */
  isMute: () => Promise<boolean>;

  /** See: {@link #core/IAudio#setVolume setVolume} */
  setVolume: (value: number) => Promise<FlashSource>;

  /** See: {@link #core/IAudio#setMute setMute} */
  setMute: (value: boolean) => Promise<FlashSource>;

  /** See: {@link #core/IAudio#isStreamOnlyAudio isStreamOnlyAudio} */
  isStreamOnlyAudio: () => Promise<boolean>;

  /** See: {@link #core/IAudio#setStreamOnlyAudio setStreamOnlyAudio} */
  setStreamOnlyAudio: (value: boolean) => Promise<FlashSource>;

  /** See: {@link #core/IAudio#isAudioAvailable isAudioAvailable} */
  isAudioAvailable: () => Promise<boolean>;
}
applyMixins(FlashSource, [Audio, SourceFlash])

