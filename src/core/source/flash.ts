/// <reference path="../../../defs/es6-promise.d.ts" />

import {applyMixins} from '../../internal/util/mixin';
import {Source} from '../source/source';
import {IAudio, Audio} from '../source/iaudio';
import {ISourceFlash, SourceFlash} from './iflash';
import {Rectangle} from '../../util/rectangle';

/**
 * The FlashSource class represents the sources of the flash items that
 * has been added to the stage. A single source could have multiple items linked
 * into it and any changes to the source would affect all items linked to it.
 *
 * Each item is represented by the FlashItem class.
 * See: {@link #core/FlashItem Core/FlashItem}
 *
 * Inherits from: {@link #core/Source Core/Source}
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
 *         // Manipulate your game source here
 *         sources[i].setSilenceDetectionEnabled(true);
 *       }
 *     }
 *   })
 * })
 * ```
 *
 * All methods marked as *Chainable* resolve with the original `FlashSource`
 * instance.
 */
export class FlashSource extends Source implements IAudio, ISourceFlash {
  //Shared with FlashItem

  /**
   * param?: value<Rectangle>
   * ```
   * return: Promise<Rectangle|FlashSource>
   * ```
   *
   * Get/Set the custom resolution (in pixels) for the item, if set,
   * regardless of its layout on the mixer. Returns a (0, 0) Rectangle if no
   * custom resolution has been set.
   *
   * See also: {@link #util/Rectangle Util/Rectangle}
   */
  customResolution:(value?: Rectangle)=> Promise<Rectangle|FlashSource>

  /**
   * param?: value<boolean>
   * ```
   * return: Promise<boolean|FlashSource>
   * ```
   *
   * Check/Set if right click events are sent to the item or not.
   *
   * #### Usage
   *
   * ```javascript
   * item.allowRightClick().then(function(isRightClickAllowed) {
   *   // The rest of your code here
   * });
   * ```
   */
  allowRightClick:(value?: boolean)=> Promise<boolean|FlashSource>

  // ItemAudio

  /** See: {@link #core/IAudio#volume volume} */
  volume:(value?: number)=> Promise<number|FlashSource>

  /** See: {@link #core/IAudio#mute mute} */
  mute:(value?: boolean)=> Promise<boolean|FlashSource>

  /** See: {@link #core/IAudio#autoMute autoMute} */
  autoMute:(value?: boolean)=> Promise<boolean|FlashSource>

  /** See: {@link #core/IAudio#streamOnlyAudio streamOnlyAudio} */
  streamOnlyAudio:(value?: boolean)=> Promise<boolean|FlashSource>

  /** See: {@link #core/IAudio#isAudioAvailable isAudioAvailable} */
  isAudioAvailable: () => Promise<boolean>;
}
applyMixins(FlashSource, [Audio, SourceFlash])

