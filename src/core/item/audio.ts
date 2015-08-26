/// <reference path="../../../defs/es6-promise.d.ts" />

import {applyMixins} from '../../internal/util/mixin';
import {Item as iItem} from '../../internal/item';
import {IItemAudio, ItemAudio} from './iaudio';
import {Scene} from '../scene';
import {Item} from './item';

/**
 * The AudioItem class represents an audio device that has been added
 * to the stage.
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
      let slot = iItem.attach(this._id);

      iItem.set('prop:AudioGainEnable', (value ? '1' : '0'), slot)
      .then(res => {
        if (!res) {
          reject(Error('Item set property failed'));
        }

         resolve(this);
      });
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
      if (typeof value !== 'number') {
        reject(Error('Only numbers are acceptable values for threshold'));
      } else if (value % 1 !== 0 || value < 0 || value > 128) {
        reject(
          Error('Only integers in the range 0-128 are acceptable for threshold')
        );
      }

      let slot = iItem.attach(this._id);

      iItem.set('prop:AudioGain', String(value), slot).then(res => {
        if (!res) {
          reject(Error('Item set property failed'));
        }

        resolve(this);
      });
    })
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
      if (typeof value !== 'number') {
        reject(Error('Only numbers are acceptable values for period'));
      } else if (value % 1 !== 0 || value < 0 || value > 10000) {
        reject(
          Error('Only integers in the range 0-10000 are acceptable for period')
        );
      }

      let slot = iItem.attach(this._id);

      iItem.set('prop:AudioGainLatency', String(value), slot).then(res => {
        if (!res) {
          reject(Error('Item set property failed'));
        }

        resolve(this);
      });
    });
  }

  // ItemAudio

  /** Get item's volume level expressed as an integer from 0 to 100 */
  getVolume: () => Promise<number>;

  /** Check if item's mute option is active */
  isMute:   () => Promise<boolean>;

  /** Set volume level of item as an integer from 0 (muted) to 100 (maximum) */
  setVolume: (value: number) => void;

  /** Set item's Mute property to ON or OFF */
  setMute:  (value: boolean) => void;

  /** Gets delay in milliseconds */
  getAudioOffset: () => Promise<number>;

  /** Sets delay in milliseconds */
  setAudioOffset: (value: number) => void;

  /** Checks if audio is also output to system sound */
  getAudioOutput: () => Promise<boolean>;

  /** Sets whether audio should also be output to system sound */
  setAudioOutput: (value: boolean) => void;
}

applyMixins(Item, [ItemAudio]);
