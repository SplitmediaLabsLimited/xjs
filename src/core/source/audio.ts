/// <reference path="../../../defs/es6-promise.d.ts" />

import {applyMixins} from '../../internal/util/mixin';
import {Source} from '../source/source';
import {IAudio, Audio} from '../source/iaudio';
import {ISourceAudio, SourceAudio} from '../source/iaudiosource';

/**
 * The AudioSource class represents the sources of the audio device items that
 * has been added to the stage. A single source could have multiple items linked
 * into it and any changes to the source would affect all items linked to it.
 *
 * Each item is represented by the AudioItem class.
 * See: {@link #core/AudioItem Core/AudioItem}
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
 *       if (sources[i] instanceof XJS.AudioSource) {
 *         // Manipulate your audio device source here
 *         sources[i].setSilenceDetectionEnabled(true);
 *       }
 *     }
 *   })
 * })
 * ```
 *
 * All methods marked as *Chainable* resolve with the original `AudioSource`
 * instance.
 */
export class AudioSource extends Source implements ISourceAudio, IAudio {
  // SourceAudio
  /**
   * return: Promise<boolean>
   *
   * Check if silence detection is on or off
   */
  isSilenceDetectionEnabled: () => Promise<boolean>

  /**
   * param: (value: boolean)
   *
   * Set silence detection to ON or OFF
   *
   * *Chainable.*
   */
  setSilenceDetectionEnabled: (value: boolean) => Promise<AudioSource>

  /**
   * return: Promise<number>
   *
   * Gets silenced detection threshold.
   * Amplitude less than threshold will be detected as silence.
   */
  getSilenceThreshold: () => Promise<number>

  /**
   * param: (value: number)
   *
   * Sets silence detection threshold, min of 0, max of 128
   *
   * *Chainable.*
   */
  setSilenceThreshold: (value: number) => Promise<AudioSource>

  /**
   * return: Promise<number>
   *
   * Gets silenced detection period in ms time unit.
   * Reaction time before filter removes noice/sound less than threshold
   */
  getSilencePeriod: () => Promise<number>

  /**
   * param: (value: number)
   *
   * Sets silence detection period, min of 0, max of 10000
   *
   * *Chainable.*
   */
  setSilencePeriod: (value: number) => Promise<AudioSource>

  /**
   * return: Promise<number>
   *
   * Gets audio delay (1 unit = 100ns)
   */
  getAudioOffset: () => Promise<number>

  /**
   * param: (value: number)
   *
   * Sets audio delay, accepts only positive delay
   *
   * *Chainable.*
   */
  setAudioOffset: (value: number) => Promise<SourceAudio>

  // General Audio

  /** See: {@link #core/IAudio#getVolume getVolume} */
  getVolume: () => Promise<number>;

  /** See: {@link #core/IAudio#isMute isMute} */
  isMute:   () => Promise<boolean>;

  /** See: {@link #core/IAudio#setVolume setVolume} */
  setVolume: (value: number) => Promise<AudioSource>;

  /** See: {@link #core/IAudio#setMute setMute} */
  setMute:  (value: boolean) => Promise<AudioSource>;

  /** See: {@link #core/IAudio#isStreamOnlyAudio isStreamOnlyAudio} */
  isStreamOnlyAudio: () => Promise<boolean>;

  /** See: {@link #core/IAudio#setStreamOnlyAudio setStreamOnlyAudio} */
  setStreamOnlyAudio: (value: boolean) => Promise<AudioSource>;

  /** See: {@link #core/IAudio#isAudioAvailable isAudioAvailable} */
  isAudioAvailable: () => Promise<boolean>;


}
applyMixins(AudioSource, [SourceAudio, Audio])

