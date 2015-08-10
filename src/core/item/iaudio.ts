/// <reference path="../../../defs/es6-promise.d.ts" />

import {Item as iItem} from '../../internal/item';

export interface IItemAudio {
  getVolume(): Promise<number>;
  setVolume(value: number);
  isMuted(): Promise<boolean>;
  setMuted(value: boolean);
}

export class ItemAudio implements IItemAudio {
  private id: string;

  getVolume(): Promise<number> {
    return new Promise((resolve) => {
      let slot = iItem.attach(this.id);

      iItem.get('prop:volume', slot).then((val) => {
        resolve(Number(val));
      });
    });
  }

  setVolume(value: number) {
    let slot = iItem.attach(this.id);

    value = value < 0 ? 0 : value > 100 ? 100 : value;

    iItem.set('prop:volume', String(value), slot);
  }

  isMuted(): Promise<boolean> {
    return new Promise((resolve) => {
      let slot = iItem.attach(this.id);

      iItem.get('prop:mute', slot).then((val) => {
        resolve(val === '1');
      });
    });
  }

  setMuted(value: boolean) {
    let slot = iItem.attach(this.id);

    iItem.set('prop:mute', (value ? '1' : '0'), slot);
  }
}
