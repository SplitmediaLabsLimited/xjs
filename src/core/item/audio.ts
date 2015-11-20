/// <reference path="../../../defs/es6-promise.d.ts" />

import {applyMixins} from '../../internal/util/mixin';
import {Item as iItem} from '../../internal/item';
import {IItemAudio, ItemAudio} from './iaudio';
import {Scene} from '../scene';
import {Item} from './item';
import {Environment} from '../environment';

/**
 * The AudioItem class represents an audio device that has been added
 * to the stage.
 *
 * Inherits from: {@link #core/Item Core/Item}
 *
 *  All methods marked as *Chainable* resolve with the original `AudioItem`
 *  instance.
 */
export class AudioItem extends Item implements IItemAudio {

  isSilenceDetectionEnabled(): Promise<boolean> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:AudioGainEnable', slot).then(val => {
        resolve(val === '1');
      });
    });
  }

  setSilenceDetectionEnabled(value: boolean): Promise<AudioItem> {
    return new Promise((resolve, reject) => {
      if (Environment.isSourcePlugin()) {
        reject(Error('Source plugins cannot update audio sources properties'));
      } else {
        let slot = iItem.attach(this._id);
        iItem.set('prop:AudioGainEnable', (value ? '1' : '0'), slot)
        .then(res => {
          if (!res) {
            reject(Error('Item set property failed'));
          } else {
            resolve(this);
          }
        });
      }
    });
  }

  getSilenceThreshold(): Promise<number> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:AudioGain', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setSilenceThreshold(value: number): Promise<AudioItem> {
    return new Promise((resolve, reject) => {
      if (Environment.isSourcePlugin()) {
        reject(Error('Source plugins cannot update audio sources properties'));
      } else if (typeof value !== 'number') {
        reject(Error('Only numbers are acceptable values for threshold'));
      } else if (value % 1 !== 0 || value < 0 || value > 128) {
        reject(
          Error('Only integers in the range 0-128 are acceptable for threshold')
        );
      } else {
        let slot = iItem.attach(this._id);
        iItem.set('prop:AudioGain', String(value), slot).then(res => {
          if (!res) {
            reject(Error('Item set property failed'));
          } else {
            resolve(this);
          }
        });
      }
    });
  }

  getSilencePeriod(): Promise<number> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:AudioGainLatency', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setSilencePeriod(value: number): Promise<AudioItem> {
    return new Promise((resolve, reject) => {
      if (Environment.isSourcePlugin()) {
        reject(Error('Source plugins cannot update audio sources properties'));
      } else if (typeof value !== 'number') {
        reject(Error('Only numbers are acceptable values for period'));
      } else if (value % 1 !== 0 || value < 0 || value > 10000) {
        reject(
          Error('Only integers in the range 0-10000 are acceptable for period')
        );
      } else {
        let slot = iItem.attach(this._id);
        iItem.set('prop:AudioGainLatency', String(value), slot).then(res => {
          if (!res) {
            reject(Error('Item set property failed'));
          } else {
            resolve(this);
          }
        });
      }
    });
  }

  getAudioOffset(): Promise<number> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:AudioDelay', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setAudioOffset(value: number): Promise<ItemAudio> {
    return new Promise((resolve, reject) => {
      if (Environment.isSourcePlugin()) {
        reject(Error('Source plugins cannot update audio sources properties'));
      } else if (value < 0) {
        reject(Error('Audio offset cannot be negative'));
      } else {
        let slot = iItem.attach(this._id);
        iItem.set('prop:AudioDelay', String(value), slot).then(res => {
          if (!res) {
            reject(Error('Item set property failed'));
          } else {
            resolve(this);
          }
        });
      }
    });
  }

  // ItemAudio

  /**
   * return: Promise<number>
   *
   * Get item's volume level expressed as an integer from 0 to 100
   */
  getVolume: () => Promise<number>;

  /**
   * return: Promise<boolean>
   *
   * Check if item's mute option is active
   */
  isMute:   () => Promise<boolean>;

  /**
   * param: value<number>
   *
   * Set volume level of item as an integer from 0 (muted) to 100 (maximum)
   *
   * *Chainable.*
   */
  setVolume: (value: number) => Promise<AudioItem>;

  /**
   * param: value<boolean>
   *
   * Set item's Mute property to ON or OFF
   *
   * *Chainable.*
   */
  setMute:  (value: boolean) => Promise<AudioItem>;

  /**
   * return: Promise<boolean>
   *
   * Checks if audio is also output to system sound
   */
  isStreamOnlyEnabled: () => Promise<boolean>;

  /**
   * param: value<boolean>
   *
   * Sets whether audio should also be output to system sound
   *
   * *Chainable.*
   */
  setStreamOnlyEnabled: (value: boolean) => Promise<AudioItem>;

  /**
   * return: Promise<boolean>
   *
   * Checks if audio is available
   */
  isAudioAvailable: () => Promise<boolean>;
}

applyMixins(Item, [ItemAudio]);
