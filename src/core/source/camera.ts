/// <reference path="../../../defs/es6-promise.d.ts" />

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
 * See: {@link: #core/CameraItem Core/CameraItem}
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
 *         // Manipulate your audio device source here
 *         sources[i].setSilenceDetectionEnabled(true);
 *       }
 *     }
 *   })
 * })
 * ```
 */
export class CameraSource extends Source implements IAudio, ISourceCamera {
  // Shared with Camera Item
    /**
   * return: Promise<string>
   *
   * Gets the device ID of the underlying camera device.
   */
  getDeviceId: () => Promise<string>

  /**
   * return: Promise<number>
   *
   * Gets audio delay with respect to video feed in milliseconds
   */
  getAudioOffset: () => Promise<number>

  /**
   * param: (value: number)
   *
   * Sets audio delay with respect to video feed in milliseconds
   */
  setAudioOffset: (value: number) => Promise<ISourceCamera>

  /**
   * return: Promise<MicrophoneDevice>
   *
   * Gets the microphone device tied as an audio input,
   * rejected if no microphone device is used
   */
  getAudioInput: () => Promise<MicrophoneDevice>

  /**
   * param: (value: number)
   *
   * Sets the microphone device to be tied as an audio input
   */
  setAudioInput: (value: MicrophoneDevice) => Promise<ISourceCamera>

  /**
   * return: Promise<boolean>
   *
   * Checks if camera feed is paused
   */
  isStreamPaused: () => Promise<boolean>

  /**
   * param: (value: boolean)
   *
   * Sets whether camera feed is paused or not
   */
  setStreamPaused: (value: boolean) => Promise<CameraSource>

  /**
   * return: Promise<boolean>
   *
   * Checks if camera device is a hardware encoder or not. This check may fail
   * if camera device is reinitializing or not present (value defaults to false)
   *
   */
  isHardwareEncoder: () => Promise<boolean>
  /**
   * return: Promise<boolean>
   *
   * Checks if camera device is active and present.
   *
   */
  isActive: () => Promise<boolean>

  /**
   * return: Promise<number>
   *
   * Gets feed capture delay in milliseconds
   */
  getDelay: () => Promise<number>

  /**
   * param: (value: number)
   *
   * Sets feed capture delay in milliseconds, accepts only positive delay
   */
  setDelay: (value: number) => Promise<CameraSource>

  /**
   * return: Promise<boolean>
   *
   * Checks whether deinterlacing is enforced
   */
  isForceDeinterlace: () => Promise<boolean>

  /**
   * param: (value: boolean)
   *
   * Enables or disables forcing of deinterlacing
   */
  setForceDeinterlace: (value: boolean) => Promise<CameraSource>


  // General Audio

  /** See: {@link #core/IAudio#getVolume getVolume} */
  getVolume: () => Promise<number>;

  /** See: {@link #core/IAudio#isMute isMute} */
  isMute: () => Promise<boolean>;

  /** See: {@link #core/IAudio#setVolume setVolume} */
  setVolume: (value: number) => Promise<CameraSource>;

  /** See: {@link #core/IAudio#setMute setMute} */
  setMute: (value: boolean) => Promise<CameraSource>;

  /** See: {@link #core/IAudio#isStreamOnlyAudio isStreamOnlyAudio} */
  isStreamOnlyAudio: () => Promise<boolean>;

  /** See: {@link #core/IAudio#setStreamOnlyAudio setStreamOnlyAudio} */
  setStreamOnlyAudio: (value: boolean) => Promise<CameraSource>;

  /** See: {@link #core/IAudio#isAudioAvailable isAudioAvailable} */
  isAudioAvailable: () => Promise<boolean>;
}

applyMixins(CameraSource, [Audio, SourceCamera])