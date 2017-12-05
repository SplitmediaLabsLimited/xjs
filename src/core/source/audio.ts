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
  silenceDetection:(value?: boolean) => Promise<boolean|AudioSource>

  /**
   * param?: value<number>
   * ```
   * return: Promise<number|AudioSource>
   * ```
   *
   * Gets silenced detection threshold.
   * Amplitude less than threshold will be detected as silence.
   */
  silenceThreshold:(value?: number) => Promise<number|AudioSource>

  /**
   * param?: value<number>
   * ```
   * return: Promise<number|AudioSource>
   * ```
   *
   * Gets silenced detection period in ms time unit.
   * Reaction time before filter removes noice/sound less than threshold
   */
  silencePeriod:(value?: number)=> Promise<number|AudioSource>

  /**
   * param?: value<number>
   * ```
   * return: Promise<number|AudioSource>
   * ```
   *
   * Get/Set audio delay (1 unit = 100ns)
   */
  audioOffset:(value?: number)=> Promise<number|AudioSource>

  // General Audio

  /** See: {@link #core/IAudio#volume volume} */
  volume:(value?: number)=> Promise<number|AudioSource>

  /** See: {@link #core/IAudio#mute mute} */
  mute:(value?: boolean)=> Promise<boolean|AudioSource>

  /** See: {@link #core/IAudio#autoMute autoMute} */
  autoMute:(value?: boolean)=> Promise<boolean|AudioSource>

  /** See: {@link #core/IAudio#streamOnlyAudio streamOnlyAudio} */
  streamOnlyAudio:(value?: boolean)=> Promise<boolean|AudioSource>

  /** See: {@link #core/IAudio#isAudioAvailable isAudioAvailable} */
  isAudioAvailable: () => Promise<boolean>;


}
applyMixins(AudioSource, [SourceAudio, Audio])

