/// <reference path="../../../defs/es6-promise.d.ts" />

import {applyMixins} from '../../internal/util/mixin';
import {Item as iItem} from '../../internal/item';
import {IAudio, Audio} from '../source/iaudio';
import {ISourceAudio, SourceAudio} from '../source/iaudiosource';
import {Scene} from '../scene';
import {Item} from './item';
import {Environment} from '../environment';

/**
 * The AudioItem class represents an audio device that has been added
 * to the stage.
 *
 * Inherits from: {@link #core/Item Core/Item}
 *
 * Implements: {@link #core/IAudio Core/IAudio}
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 *
 * XJS.Scene.getActiveScene().then(function(scene) {
 *   scene.getItems().then(function(items) {
 *     for (var i in items) {
 *       if (items[i] instanceof XJS.AudioItem) {
 *         // Manipulate your audio device item here
 *         items[i].setSilenceDetectionEnabled(true);
 *       }
 *     }
 *   });
 * });
 * ```
 *
 *  All methods marked as *Chainable* resolve with the original `AudioItem`
 *  instance.
 */
export class AudioItem extends Item implements ISourceAudio, IAudio {

  // SourceAudio
  silenceDetection:(value?: boolean) => Promise<boolean|AudioItem>
  silenceThreshold:(value?: number) => Promise<number|AudioItem>
  silencePeriod:(value?: number)=> Promise<number|AudioItem>
  audioOffset:(value?: number)=> Promise<number|AudioItem>
  volume:(value?: number)=> Promise<number|AudioItem>
  mute:(value?: boolean)=> Promise<boolean|AudioItem>
  autoMute:(value?: boolean)=> Promise<boolean|AudioItem>
  streamOnlyAudio:(value?: boolean)=> Promise<boolean|AudioItem>

  // /** See: {@link #core/AudioSource#isSilenceDetectionEnabled isSilenceDetectionEnabled} */
  // isSilenceDetectionEnabled: () => Promise<boolean>

  // /** See: {@link #core/AudioSource#setSilenceDetectionEnabled setSilenceDetectionEnabled} */
  // setSilenceDetectionEnabled: (value: boolean) => Promise<AudioItem>

  // /** See: {@link #core/AudioSource#getSilenceThreshold getSilenceThreshold} */
  // getSilenceThreshold: () => Promise<number>

  // /** See: {@link #core/AudioSource#setSilenceThreshold setSilenceThreshold} */
  // setSilenceThreshold: (value: number) => Promise<AudioItem>

  // /** See: {@link #core/AudioSource#getSilencePeriod getSilencePeriod} */
  // getSilencePeriod: () => Promise<number>

  // /** See: {@link #core/AudioSource#setSilencePeriod setSilencePeriod} */
  // setSilencePeriod: (value: number) => Promise<AudioItem>

  // /** See: {@link #core/AudioSource#getAudioOffset getAudioOffset} */
  // getAudioOffset: () => Promise<number>

  // /** See: {@link #core/AudioSource#setAudioOffset setAudioOffset} */
  // setAudioOffset: (value: number) => Promise<SourceAudio>

  // General Audio

  /** See: {@link #core/IAudio#getVolume getVolume} */
  // getVolume: () => Promise<number>;

  /** See: {@link #core/IAudio#isMute isMute} */
  // isMute: () => Promise<boolean>;

  /** See: {@link #core/IAudio#isAutoMute isAutoMute} */
  // isAutoMute: () => Promise<boolean>;

  /** See: {@link #core/IAudio#setVolume setVolume} */
  // setVolume: (value: number) => Promise<AudioItem>;

  /** See: {@link #core/IAudio#setMute setMute} */
  // setMute: (value: boolean) => Promise<AudioItem>;

  /** See: {@link #core/IAudio#setAutoMute setAutoMute} */
  // setAutoMute: (value: boolean) => Promise<AudioItem>;

  /** See: {@link #core/IAudio#isStreamOnlyAudio isStreamOnlyAudio} */
  // isStreamOnlyAudio: () => Promise<boolean>;

  /** See: {@link #core/IAudio#setStreamOnlyAudio setStreamOnlyAudio} */
  // setStreamOnlyAudio: (value: boolean) => Promise<AudioItem>;

  /** See: {@link #core/IAudio#isAudioAvailable isAudioAvailable} */
  isAudioAvailable: () => Promise<boolean>;
}

applyMixins(AudioItem, [SourceAudio, Audio]);
