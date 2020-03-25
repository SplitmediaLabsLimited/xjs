/// <reference path="../../../defs/es6-promise.d.ts" />

import {Rectangle} from '../../util/rectangle';
import {applyMixins} from '../../internal/util/mixin';
import {Source} from '../source/source';
import {IAudio, Audio} from '../source/iaudio';
import {SourceCamera, ISourceCamera} from '../source/icamera';
import {MicrophoneDevice as MicrophoneDevice} from '../../system/microphone';

/**
 * The CameraSource class represents the sources of the camera device items that
 * has been added to the stage. A single source could have multiple items linked
 * into it and any changes to the source would affect all items linked to it.
 *
 * Each item is represented by the CameraItem class.
 * See: {@link #core/CameraItem Core/CameraItem}
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
 *       if (sources[i] instanceof XJS.CameraSource) {
 *         // Manipulate your camera device source here
 *         sources[i].setSilenceDetectionEnabled(true);
 *       }
 *     }
 *   })
 * })
 * ```
 *
 * All methods marked as *Chainable* resolve with the original `CameraSource`
 * instance.
 */
export class CameraSource extends Source implements IAudio, ISourceCamera {
  // Shared with Camera Item
  /** See: {@link #core/ISourceCamera#getDeviceId getDeviceId} */
  getDeviceId: () => Promise<string>

  /** See: {@link #core/ISourceCamera#getResolution getResolution} */
  getResolution: () => Promise<Rectangle>

  /** See: {@link #core/ISourceCamera#getAudioOffset getAudioOffset} */
  getAudioOffset: () => Promise<number>

  /** See: {@link #core/ISourceCamera#setAudioOffset setAudioOffset} */
  setAudioOffset: (value: number) => Promise<CameraSource>

  /** See: {@link #core/ISourceCamera#getAudioInput getAudioInput} */
  getAudioInput: () => Promise<MicrophoneDevice>

  /** See: {@link #core/ISourceCamera#setAudioInput setAudioInput} */
  setAudioInput: (value: MicrophoneDevice) => Promise<CameraSource>

  /** See: {@link #core/ISourceCamera#isStreamPaused isStreamPaused} */
  isStreamPaused: () => Promise<boolean>

  /** See: {@link #core/ISourceCamera#setStreamPaused setStreamPaused} */
  setStreamPaused: (value: boolean) => Promise<CameraSource>

  /** See: {@link #core/ISourceCamera#isHardwareEncoder isHardwareEncoder} */
  isHardwareEncoder: () => Promise<boolean>

  /** See: {@link #core/ISourceCamera#isActive isActive} */
  isActive: () => Promise<boolean>

  /** See: {@link #core/ISourceCamera#getDelay getDelay} */
  getDelay: () => Promise<number>

  /** See: {@link #core/ISourceCamera#setDelay setDelay} */
  setDelay: (value: number) => Promise<CameraSource>

  /** See: {@link #core/ISourceCamera#isForceDeinterlace isForceDeinterlace} */
  isForceDeinterlace: () => Promise<boolean>

  /** See: {@link #core/ISourceCamera#setForceDeinterlace setForceDeinterlace} */
  setForceDeinterlace: (value: boolean) => Promise<CameraSource>

  // General Audio

  /** See: {@link #core/IAudio#getVolume getVolume} */
  getVolume: () => Promise<number>;

  /** See: {@link #core/IAudio#isMute isMute} */
  isMute: () => Promise<boolean>;

  /** See: {@link #core/IAudio#isAutoMute isAutoMute} */
  isAutoMute: () => Promise<boolean>;

  /** See: {@link #core/IAudio#setVolume setVolume} */
  setVolume: (value: number) => Promise<CameraSource>;

  /** See: {@link #core/IAudio#setMute setMute} */
  setMute: (value: boolean) => Promise<CameraSource>;

  /** See: {@link #core/IAudio#setAutoMute setAutoMute} */
  setAutoMute: (value: boolean) => Promise<CameraSource>;

  /** See: {@link #core/IAudio#isStreamOnlyAudio isStreamOnlyAudio} */
  isStreamOnlyAudio: () => Promise<boolean>;

  /** See: {@link #core/IAudio#setStreamOnlyAudio setStreamOnlyAudio} */
  setStreamOnlyAudio: (value: boolean) => Promise<CameraSource>;

  /** See: {@link #core/IAudio#isAudioAvailable isAudioAvailable} */
  isAudioAvailable: () => Promise<boolean>;
}

applyMixins(CameraSource, [Audio, SourceCamera])
