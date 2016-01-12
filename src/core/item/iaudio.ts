/// <reference path="../../../defs/es6-promise.d.ts" />

import {Item as iItem} from '../../internal/item';
import {Environment} from '../environment';

export interface IItemAudio {
  getVolume(): Promise<number>;
  setVolume(value: number): Promise<IItemAudio>;
  isMute(): Promise<boolean>;
  setMute(value: boolean): Promise<IItemAudio>;
  isStreamOnlyAudio(): Promise<boolean>;
  setStreamOnlyAudio(value: boolean): Promise<IItemAudio>;
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

  isStreamOnlyAudio(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:sounddev', this._id).then(val => {
        resolve(val === '1');
      });
    });
  }

  setStreamOnlyAudio(value: boolean): Promise<ItemAudio> {
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
