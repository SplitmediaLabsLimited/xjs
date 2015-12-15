/// <reference path="../../../defs/es6-promise.d.ts" />

import {Item as iItem} from '../../internal/item';
import {Environment} from '../environment';

export interface IItemAudio {

  /** Get item's volume level expressed as an integer from 0 to 100 */
  getVolume(): Promise<number>;

  /** Set volume level of item as an integer from 0 (muted) to 100 (maximum) */
  setVolume(value: number): Promise<IItemAudio>;

  /** Check if item's mute option is active */
  isMute(): Promise<boolean>;

  /** Set item's Mute property to ON or OFF */
  setMute(value: boolean): Promise<IItemAudio>;

  /** Gets delay in milliseconds */
  getAudioOffset(): Promise<number>;

  /** Sets delay in milliseconds */
  setAudioOffset(value: number): Promise<IItemAudio>;

  /** Checks if audio is also output to system sound */
  isStreamOnlyEnabled(): Promise<boolean>;

  /** Sets whether audio should also be output to system sound */
  setStreamOnlyEnabled(value: boolean): Promise<IItemAudio>;
}

export class ItemAudio implements IItemAudio {
  private _id: string;

  getVolume(): Promise<number> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:volume', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setVolume(value: number): Promise<ItemAudio> {
    return new Promise((resolve, reject) => {
      if (Environment.isSourcePlugin()) {
        reject(Error('Source plugins cannot update audio source properties.'));
      } else {
        let slot = iItem.attach(this._id);
        value = value < 0 ? 0 : value > 100 ? 100 : value;
        iItem.set('prop:volume', String(value), slot).then(res => {
          if (!res) {
            reject(Error('Item set property failed'));
          } else {
            resolve(this);
          }
        });
      }
    });
  }

  isMute(): Promise<boolean> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:mute', slot).then(val => {
        resolve(val === '1');
      });
    });
  }

  setMute(value: boolean): Promise<ItemAudio> {
    return new Promise((resolve, reject) => {
      if (Environment.isSourcePlugin()) {
        reject(Error('Source plugins cannot update audio sources properties'));
      } else {
        let slot = iItem.attach(this._id);
        iItem.set('prop:mute', (value ? '1' : '0'), slot).then(res => {
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

  isStreamOnlyEnabled(): Promise<boolean> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:sounddev', slot).then(val => {
        resolve(val === '1');
      });
    });
  }

  setStreamOnlyEnabled(value: boolean): Promise<ItemAudio> {
    return new Promise((resolve, reject) => {
      if (Environment.isSourcePlugin()) {
        reject(Error('Source plugins cannot update audio sources properties'));
      } else {
        let slot = iItem.attach(this._id);
        iItem.set('prop:sounddev', (value ? '1' : '0'), slot).then(res => {
          if (!res) {
            reject(Error('Item set property failed'));
          } else {
            resolve(this);
          }
        });
      }
    });
  }
}
