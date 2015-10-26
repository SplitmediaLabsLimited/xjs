/// <reference path="../../../defs/es6-promise.d.ts" />

import {Item as iItem} from '../../internal/item';

export interface IItemPlayback {
  getSyncable(): Promise<boolean>;
  getPlaybackPosition(): Promise<number>;
  setPlaybackPosition(value: number): Promise<IItemPlayback>;
  getPlaybackDuration(): Promise<number>;
  getPlaybackState(): Promise<boolean>;
  setPlaybackState(value: boolean): Promise<IItemPlayback>;
}

export class ItemPlayback implements IItemPlayback {
  private _id: string;

  getSyncable(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('sync:syncable', this._id).then(val => {
        resolve(val === "1" ? true : false);
      });
    });
  }

  getPlaybackPosition(): Promise<number> {
    return new Promise(resolve => {
      iItem.get('sync:position', this._id).then(val => {
        resolve(Number(val) / 10000000);
      });
    });
  }

  setPlaybackPosition(value: number): Promise<ItemPlayback> {
    return new Promise(resolve => {
      iItem.set('sync:position', String(value * 10000000),
        this._id).then(() => {
          resolve(this);
      });
    });
  }

  getPlaybackDuration(): Promise<number> {
    return new Promise(resolve => {
      iItem.get('sync:duration', this._id).then(val => {
        resolve(Number(val) / 10000000);
      });
    });
  }

  getPlaybackState(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('sync:state', this._id).then(val => {
        resolve(val === "running");
      });
    });
  }

  setPlaybackState(value: boolean): Promise<ItemPlayback> {
    return new Promise(resolve => {
      iItem.set('sync:state', value ? "running" : "stopped",
        this._id).then(() => {
          resolve(this);
      });
    });
  }
}
