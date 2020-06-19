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
  /** See: {@link #core/ISourceFlash#getCustomResolution getCustomResolution} */
  getCustomResolution: () => Promise<Rectangle>

  /** See: {@link #core/ISourceFlash#setCustomResolution setCustomResolution} */
  setCustomResolution: (value: Rectangle) => Promise<FlashSource>

  /** See: {@link #core/ISourceFlash#getAllowRightClick getAllowRightClick} */
  getAllowRightClick: () => Promise<boolean>

  /** See: {@link #core/ISourceFlash#setAllowRightClick setAllowRightClick} */
  setAllowRightClick: (value: boolean) => Promise<FlashSource>

  /** See: {@link #core/ISourceFlash#isSourceAvailable isSourceAvailable} */
  isSourceAvailable: () => Promise<boolean>

  // ItemAudio

  /** See: {@link #core/IAudio#getVolume getVolume} */
  getVolume: () => Promise<number>;

  /** See: {@link #core/IAudio#isMute isMute} */
  isMute: () => Promise<boolean>;

  /** See: {@link #core/IAudio#isAutoMute isAutoMute} */
  isAutoMute: () => Promise<boolean>;

  /** See: {@link #core/IAudio#setVolume setVolume} */
  setVolume: (value: number) => Promise<FlashSource>;

  /** See: {@link #core/IAudio#setMute setMute} */
  setMute: (value: boolean) => Promise<FlashSource>;

  /** See: {@link #core/IAudio#setAutoMute setAutoMute} */
  setAutoMute: (value: boolean) => Promise<FlashSource>;

  /** See: {@link #core/IAudio#isStreamOnlyAudio isStreamOnlyAudio} */
  isStreamOnlyAudio: () => Promise<boolean>;

  /** See: {@link #core/IAudio#setStreamOnlyAudio setStreamOnlyAudio} */
  setStreamOnlyAudio: (value: boolean) => Promise<FlashSource>;

  /** See: {@link #core/IAudio#isAudioAvailable isAudioAvailable} */
  isAudioAvailable: () => Promise<boolean>;
}
applyMixins(FlashSource, [Audio, SourceFlash])

