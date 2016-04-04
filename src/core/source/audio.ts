/// <reference path="../../../defs/es6-promise.d.ts" />

import {applyMixins} from '../../internal/util/mixin';
import {Item as iItem} from '../../internal/item';
import {IItemAudio, ItemAudio} from './iaudio';
import {Scene} from '../scene';
import {Source} from './source';
import {Environment} from '../environment';

/**
 * The AudioSource class represents an audio device that has been added
 * to the stage.
 *
 * Inherits from: {@link #core/Source Core/Source}
 *
 * Implements: {@link #core/IItemAudio Core/IItemAudio}
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 *
 * XJS.Scene.getActiveScene().then(function(scene) {
 *   scene.getSources().then(function(sources) {
 *     for (var i in sources) {
 *       if (sources[i] instanceof XJS.AudioSource) {
 *         // Manipulate your audio device source here
 *         sources[i].setSilenceDetectionEnabled(true);
 *       }
 *     }
 *   });
 * });
 * ```
 *
 *  All methods marked as *Chainable* resolve with the original `AudioSource`
 *  instance.
 */
export class AudioSource extends Source implements IItemAudio {
  /**
   * return: Promise<boolean>
   *
   * Check if silence detection is on or off
   */
  isSilenceDetectionEnabled(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:AudioGainEnable', this._id).then(val => {
        resolve(val === '1');
      });
    });
  }

  /**
   * param: (value: boolean)
   *
   * Set silence detection to ON or OFF
   *
   * *Chainable.*
   */
  setSilenceDetectionEnabled(value: boolean): Promise<AudioSource> {
    return new Promise((resolve, reject) => {
      iItem.set('prop:AudioGainEnable', (value ? '1' : '0'), this._id)
      .then(res => {
          resolve(this);
      });
    });
  }

  /**
   * return: Promise<number>
   *
   * Gets silenced detection threshold.
   * Amplitude less than threshold will be detected as silence.
   */
  getSilenceThreshold(): Promise<number> {
    return new Promise(resolve => {
      iItem.get('prop:AudioGain', this._id).then(val => {
        resolve(Number(val));
      });
    });
  }

  /**
   * param: (value: number)
   *
   * Sets silence detection threshold, min of 0, max of 128
   *
   * *Chainable.*
   */
  setSilenceThreshold(value: number): Promise<AudioSource> {
    return new Promise((resolve, reject) => {
      if (typeof value !== 'number') {
        reject(Error('Only numbers are acceptable values for threshold'));
      } else if (value % 1 !== 0 || value < 0 || value > 128) {
        reject(
          Error('Only integers in the range 0-128 are acceptable for threshold')
        );
      } else {
        iItem.set('prop:AudioGain', String(value), this._id).then(res => {
          resolve(this);
        });
      }
    });
  }

  /**
   * return: Promise<number>
   *
   * Gets silenced detection period in ms time unit.
   * Reaction time before filter removes noice/sound less than threshold
   */
  getSilencePeriod(): Promise<number> {
    return new Promise(resolve => {
      iItem.get('prop:AudioGainLatency', this._id).then(val => {
        resolve(Number(val));
      });
    });
  }

  /**
   * param: (value: number)
   *
   * Sets silence detection period, min of 0, max of 10000
   *
   * *Chainable.*
   */
  setSilencePeriod(value: number): Promise<AudioSource> {
    return new Promise((resolve, reject) => {
      if (typeof value !== 'number') {
        reject(Error('Only numbers are acceptable values for period'));
      } else if (value % 1 !== 0 || value < 0 || value > 10000) {
        reject(
          Error('Only integers in the range 0-10000 are acceptable for period')
        );
      } else {
        iItem.set('prop:AudioGainLatency', String(value), this._id).then(res => {
          resolve(this);
        });
      }
    });
  }

  /**
   * return: Promise<number>
   *
   * Gets audio delay (1 unit = 100ns)
   */
  getAudioOffset(): Promise<number> {
    return new Promise(resolve => {
      iItem.get('prop:AudioDelay', this._id).then(val => {
        resolve(Number(val));
      });
    });
  }

  /**
   * param: (value: number)
   *
   * Sets audio delay, accepts only positive delay
   *
   * *Chainable.*
   */
  setAudioOffset(value: number): Promise<ItemAudio> {
    return new Promise((resolve, reject) => {
      if (typeof value !== 'number') {
        reject(Error('Only numbers are acceptable values for period'));
      }
      else if (value < 0) {
        reject(Error('Audio offset cannot be negative'));
      } else {
        iItem.set('prop:AudioDelay', String(value), this._id).then(res => {
          resolve(this);
        });
      }
    });
  }

  // ItemAudio

  /** See: {@link #core/IItemAudio#getVolume getVolume} */
  getVolume: () => Promise<number>;

  /** See: {@link #core/IItemAudio#isMute isMute} */
  isMute:   () => Promise<boolean>;

  /** See: {@link #core/IItemAudio#setVolume setVolume} */
  setVolume: (value: number) => Promise<AudioSource>;

  /** See: {@link #core/IItemAudio#setMute setMute} */
  setMute:  (value: boolean) => Promise<AudioSource>;

  /** See: {@link #core/IItemAudio#isStreamOnlyAudio isStreamOnlyAudio} */
  isStreamOnlyAudio: () => Promise<boolean>;

  /** See: {@link #core/IItemAudio#setStreamOnlyAudio setStreamOnlyAudio} */
  setStreamOnlyAudio: (value: boolean) => Promise<AudioSource>;

  /** See: {@link #core/IItemAudio#isAudioAvailable isAudioAvailable} */
  isAudioAvailable: () => Promise<boolean>;
}

applyMixins(Source, [ItemAudio]);
