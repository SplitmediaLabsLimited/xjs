/// <reference path="../../../defs/es6-promise.d.ts" />

import {applyMixins} from '../../internal/util/mixin';
import {Item as iItem} from '../../internal/item';
import {ISourceAudio, SourceAudio} from '../source/iaudio';
import {Scene} from '../scene';
import {Item} from './item';
import {Environment} from '../environment';

/**
 * The AudioItem class represents an audio device that has been added
 * to the stage.
 *
 * Inherits from: {@link #core/Item Core/Item}
 *
 * Implements: {@link #core/ISourceAudio Core/ISourceAudio}
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
export class AudioItem extends Item implements ISourceAudio {

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
  setSilenceDetectionEnabled(value: boolean): Promise<AudioItem> {
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
  setSilenceThreshold(value: number): Promise<AudioItem> {
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
  setSilencePeriod(value: number): Promise<AudioItem> {
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
  setAudioOffset(value: number): Promise<SourceAudio> {
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

  // SourceAudio

  /** See: {@link #core/ISourceAudio#getVolume getVolume} */
  getVolume: () => Promise<number>;

  /** See: {@link #core/ISourceAudio#isMute isMute} */
  isMute:   () => Promise<boolean>;

  /** See: {@link #core/ISourceAudio#setVolume setVolume} */
  setVolume: (value: number) => Promise<AudioItem>;

  /** See: {@link #core/ISourceAudio#setMute setMute} */
  setMute:  (value: boolean) => Promise<AudioItem>;

  /** See: {@link #core/ISourceAudio#isStreamOnlyAudio isStreamOnlyAudio} */
  isStreamOnlyAudio: () => Promise<boolean>;

  /** See: {@link #core/ISourceAudio#setStreamOnlyAudio setStreamOnlyAudio} */
  setStreamOnlyAudio: (value: boolean) => Promise<AudioItem>;

  /** See: {@link #core/ISourceAudio#isAudioAvailable isAudioAvailable} */
  isAudioAvailable: () => Promise<boolean>;
}

applyMixins(AudioItem, [SourceAudio]);
