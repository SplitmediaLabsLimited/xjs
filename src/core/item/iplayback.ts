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
      let slot = iItem.attach(this._id);
      iItem.get('sync:syncable', slot).then(val => {
        resolve(val === "1" ? true : false);
      });
    });
  }

  getPlaybackPosition(): Promise<number> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('sync:position', slot).then(val => {
        resolve(Number(val) / 10000000);
      });
    });
  }

  setPlaybackPosition(value: number): Promise<ItemPlayback> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.set('sync:position', String(value * 10000000), slot).then(() => {
        resolve(this);
      });
    });
  }

  getPlaybackDuration(): Promise<number> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('sync:duration', slot).then(val => {
        resolve(Number(val) / 10000000);
      });
    });
  }

  getPlaybackState(): Promise<boolean> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('sync:state', slot).then(val => {
        resolve(val === "running");
      });
    });
  }

  setPlaybackState(value: boolean): Promise<ItemPlayback> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.set('sync:state', value ? "running" : "stopped", slot).then(() => {
        resolve(this);
      });
    });
  }
}
