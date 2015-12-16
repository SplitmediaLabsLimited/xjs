/// <reference path="../../../defs/es6-promise.d.ts" />

import {Item as iItem} from '../../internal/item';
import {Environment} from '../environment';

export interface IItemAudio {

  /**
   * return: Promise<number>
   *
   * Get item's volume level expressed as an integer from 0 to 100
   */
  getVolume(): Promise<number>;

  /**
   * param: (value: number)
   *
   * Set volume level of item as an integer from 0 (muted) to 100 (maximum)
   *
   * *Chainable.*
   */
  setVolume(value: number): Promise<IItemAudio>;

  /**
   * return: Promise<boolean>
   *
   * Check if item's mute option is active
   */
  isMute(): Promise<boolean>;

  /**
   * param: (value: boolean)
   *
   * Set item's Mute property to ON or OFF
   *
   * *Chainable.*
   */
  setMute(value: boolean): Promise<IItemAudio>;

  /**
   * return: Promise<boolean>
   *
   * Checks if audio is also output to system sound
   */
  isStreamOnlyEnabled(): Promise<boolean>;

  /**
   * param: (value: boolean)
   *
   * Sets whether audio should also be output to system sound
   *
   * *Chainable.*
   */
  setStreamOnlyEnabled(value: boolean): Promise<IItemAudio>;

  /**
   * return: Promise<boolean>
   *
   * Checks if audio is available
   */
  isAudioAvailable(): Promise<boolean>;
}

export class ItemAudio implements IItemAudio {
  private _id: string;

  getVolume(): Promise<number> {
    return new Promise(resolve => {
      iItem.get('prop:volume', this._id).then(val => {
        resolve(Number(val));
      });
    });
  }

  setVolume(value: number): Promise<ItemAudio> {
    return new Promise(resolve => {
      value = value < 0 ? 0 : value > 100 ? 100 : value;
      iItem.set('prop:volume', String(value),
        this._id).then(() => {
          resolve(this);
        });
    });
  }

  isMute(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:mute', this._id).then(val => {
        resolve(val === '1');
      });
    });
  }

  setMute(value: boolean): Promise<ItemAudio> {
    return new Promise(resolve => {
      iItem.set('prop:mute', (value ? '1' : '0'), this._id).then(() => {
        resolve(this);
      });
    })
  }

  isStreamOnlyEnabled(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:sounddev', this._id).then(val => {
        resolve(val === '1');
      });
    });
  }

  setStreamOnlyEnabled(value: boolean): Promise<ItemAudio> {
    return new Promise(resolve => {
      iItem.set('prop:sounddev', (value ? '1' : '0'), this._id).then(() => {
        resolve(this);
      });
    })
  }

  isAudioAvailable(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:audioavail', this._id).then(val => {
        resolve(val === '1');
      });
    });
  }
}
