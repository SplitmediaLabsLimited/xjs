/// <reference path="../../../defs/es6-promise.d.ts" />

import {Item as iItem} from '../../internal/item';
import {Environment} from '../environment';

export interface IItemAudio {
  getVolume(): Promise<number>;
  setVolume(value: number);
  isMute(): Promise<boolean>;
  setMute(value: boolean);
  getAudioOffset(): Promise<number>;
  setAudioOffset(value: number);
  isStreamOnlyEnabled(): Promise<boolean>;
  setStreamOnlyEnabled(value: boolean);
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
        reject(Error('Source plugins cannot update audio sources properties'));
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
