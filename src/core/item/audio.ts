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
      iItem.get('prop:AudioGainEnable', this._id).then(val => {
        resolve(val === '1');
      });
    });
  }

  setSilenceDetectionEnabled(value: boolean): Promise<AudioItem> {
    return new Promise((resolve, reject) => {
      if (Environment.isSourcePlugin()) {
        reject(Error('Source plugins cannot update audio sources properties'));
      } else {
        iItem.set('prop:AudioGainEnable', (value ? '1' : '0'), this._id)
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
      iItem.get('prop:AudioGain', this._id).then(val => {
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
        iItem.set('prop:AudioGain', String(value), this._id).then(res => {
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
      iItem.get('prop:AudioGainLatency', this._id).then(val => {
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
        iItem.set('prop:AudioGainLatency', String(value), this._id).then(res => {
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

  /** Get item's volume level expressed as an integer from 0 to 100 */
  getVolume: () => Promise<number>;

  /** Check if item's mute option is active */
  isMute:   () => Promise<boolean>;

  /** Set volume level of item as an integer from 0 (muted) to 100 (maximum) */
  setVolume: (value: number) => Promise<AudioItem>;

  /** Set item's Mute property to ON or OFF */
  setMute:  (value: boolean) => Promise<AudioItem>;

  /** Gets delay in milliseconds */
  getAudioOffset: () => Promise<number>;

  /** Sets delay in milliseconds */
  setAudioOffset: (value: number) => Promise<AudioItem>;

  /** Checks if audio is also output to system sound */
  isStreamOnlyEnabled: () => Promise<boolean>;

  /** Sets whether audio should also be output to system sound */
  setStreamOnlyEnabled: (value: boolean) => Promise<AudioItem>;
}

applyMixins(Item, [ItemAudio]);
