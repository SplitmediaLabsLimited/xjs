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
  /** See: {@link #core/AudioSource#silenceDetection silenceDetection} */
  silenceDetection:(value?: boolean) => Promise<boolean|AudioItem>

  /** See: {@link #core/AudioSource#silenceThreshold silenceThreshold} */
  silenceThreshold:(value?: number) => Promise<number|AudioItem>

  /** See: {@link #core/AudioSource#silencePeriod silencePeriod} */
  silencePeriod:(value?: number)=> Promise<number|AudioItem>

  /** See: {@link #core/AudioSource#audioOffset audioOffset} */
  audioOffset:(value?: number)=> Promise<number|AudioItem>

  // General Audio
  /** See: {@link #core/IAudio#volume volume} */
  volume:(value?: number)=> Promise<number|AudioItem>

  /** See: {@link #core/IAudio#mute mute} */
  mute:(value?: boolean)=> Promise<boolean|AudioItem>

  /** See: {@link #core/IAudio#autoMute autoMute} */
  autoMute:(value?: boolean)=> Promise<boolean|AudioItem>

  /** See: {@link #core/IAudio#streamOnlyAudio streamOnlyAudio} */
  streamOnlyAudio:(value?: boolean)=> Promise<boolean|AudioItem>

  /** See: {@link #core/IAudio#isAudioAvailable isAudioAvailable} */
  isAudioAvailable: () => Promise<boolean>;
}

applyMixins(AudioItem, [SourceAudio, Audio]);
