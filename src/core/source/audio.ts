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
  /** See: {@link #core/ISourceAudio#isSilenceDetectionEnabled isSilenceDetectionEnabled} */
  isSilenceDetectionEnabled: () => Promise<boolean>

  /** See: {@link #core/ISourceAudio#setSilenceDetectionEnabled setSilenceDetectionEnabled} */
  setSilenceDetectionEnabled: (value: boolean) => Promise<AudioSource>

  /** See: {@link #core/ISourceAudio#getSilenceThreshold getSilenceThreshold} */
  getSilenceThreshold: () => Promise<number>

  /** See: {@link #core/ISourceAudio#setSilenceThreshold setSilenceThreshold} */
  setSilenceThreshold: (value: number) => Promise<AudioSource>

  /** See: {@link #core/ISourceAudio#getSilencePeriod getSilencePeriod} */
  getSilencePeriod: () => Promise<number>

  /** See: {@link #core/ISourceAudio#setSilencePeriod setSilencePeriod} */
  setSilencePeriod: (value: number) => Promise<AudioSource>

  /** See: {@link #core/ISourceAudio#getAudioOffset getAudioOffset} */
  getAudioOffset: () => Promise<number>

  /** See: {@link #core/ISourceAudio#setAudioOffset setAudioOffset} */
  setAudioOffset: (value: number) => Promise<SourceAudio>

  // General Audio

  /** See: {@link #core/IAudio#getVolume getVolume} */
  getVolume: () => Promise<number>;

  /** See: {@link #core/IAudio#isMute isMute} */
  isMute: () => Promise<boolean>;

  /** See: {@link #core/IAudio#isAutoMute isAutoMute} */
  isAutoMute: () => Promise<boolean>;

  /** See: {@link #core/IAudio#setVolume setVolume} */
  setVolume: (value: number) => Promise<AudioSource>;

  /** See: {@link #core/IAudio#setMute setMute} */
  setMute: (value: boolean) => Promise<AudioSource>;

  /** See: {@link #core/IAudio#setAutoMute setAutoMute} */
  setAutoMute: (value: boolean) => Promise<AudioSource>;

  /** See: {@link #core/IAudio#isStreamOnlyAudio isStreamOnlyAudio} */
  isStreamOnlyAudio: () => Promise<boolean>;

  /** See: {@link #core/IAudio#setStreamOnlyAudio setStreamOnlyAudio} */
  setStreamOnlyAudio: (value: boolean) => Promise<AudioSource>;

  /** See: {@link #core/IAudio#isAudioAvailable isAudioAvailable} */
  isAudioAvailable: () => Promise<boolean>;


}
applyMixins(AudioSource, [SourceAudio, Audio])

