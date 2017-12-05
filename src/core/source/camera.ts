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
  /**
   * return: Promise<string>
   *
   * Gets the device ID of the underlying camera device.
   */
  deviceId:() => Promise<string>

  /**
   * param?: value<number>
   * ```
   * return: Promise<number|CameraSource>
   * ```
   *
   * Get/Set audio delay with respect to video feed in milliseconds
   */
  audioOffset:(value?:number) => Promise<number|CameraSource>

  /**
   * param?: value<MicrophoneDevice>
   * ```
   * return: Promise<MicrophoneDevice|CameraSource>
   * ```
   *
   * Get/Set the microphone device tied as an audio input,
   * rejected if no microphone device is used
   */
  audioInput:(value?:MicrophoneDevice) => Promise<MicrophoneDevice|CameraSource>

  /**
   * param?: value<boolean>
   * ```
   * return: Promise<boolean|CameraSource>
   * ```
   *
   * Get/Set if camera feed is paused
   */
  streamPause:(value?:boolean) => Promise<boolean|CameraSource>

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
   * Get/Set feed capture delay in milliseconds
   */
  delay:(value?:number) => Promise<number|CameraSource>

  /**
   * return: Promise<boolean>
   *
   * Get/Set whether deinterlacing is enforced
   */
  forceDeinterlace:(value?:boolean) => Promise<boolean|CameraSource>


  // General Audio

  /** See: {@link #core/IAudio#volume volume} */
  volume:(value?: number)=> Promise<number|CameraSource>

  /** See: {@link #core/IAudio#mute mute} */
  mute:(value?: boolean)=> Promise<boolean|CameraSource>

  /** See: {@link #core/IAudio#autoMute autoMute} */
  autoMute:(value?: boolean)=> Promise<boolean|CameraSource>

  /** See: {@link #core/IAudio#streamOnlyAudio streamOnlyAudio} */
  streamOnlyAudio:(value?: boolean)=> Promise<boolean|CameraSource>

  /** See: {@link #core/IAudio#isAudioAvailable isAudioAvailable} */
  isAudioAvailable: () => Promise<boolean>;
}

applyMixins(CameraSource, [Audio, SourceCamera])