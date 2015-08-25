/// <reference path="../../../defs/es6-promise.d.ts" />

import {Item as iItem} from '../../internal/item';

export interface IItemAudio {
  getVolume(): Promise<number>;
  setVolume(value: number);
  isMute(): Promise<boolean>;
  setMute(value: boolean);
  getAudioOffset(): Promise<number>;
  setAudioOffset(value: number);
  getAudioOutput(): Promise<boolean>;
  setAudioOutput(value: boolean);
}

export class ItemAudio implements IItemAudio {
  private id: string;

  getVolume(): Promise<number> {
    return new Promise((resolve) => {
      let slot = iItem.attach(this.id);

      iItem.get('prop:volume', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setVolume(value: number) {
    let slot = iItem.attach(this.id);

    value = value < 0 ? 0 : value > 100 ? 100 : value;

    iItem.set('prop:volume', String(value), slot);
  }

  isMute(): Promise<boolean> {
    return new Promise((resolve) => {
      let slot = iItem.attach(this.id);

      iItem.get('prop:mute', slot).then(val => {
        resolve(val === '1');
      });
    });
  }

  setMute(value: boolean) {
    let slot = iItem.attach(this.id);

    iItem.set('prop:mute', (value ? '1' : '0'), slot);
  }

  getAudioOffset(): Promise<number> {
    return new Promise(resolve => {
      let slot = iItem.attach(this.id);

      iItem.get('prop:AudioDelay', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setAudioOffset(value: number) {
    let slot = iItem.attach(this.id);

    iItem.set('prop:mute', String(value), slot);
  }

  getAudioOutput(): Promise<boolean> {
    return new Promise((resolve) => {
      let slot = iItem.attach(this.id);

      iItem.get('prop:sounddev', slot).then(val => {
        resolve(val === '1');
      });
    });
  }

  setAudioOutput(value: boolean) {
    let slot = iItem.attach(this.id);

    iItem.set('prop:sounddev', (value ? '1' : '0'), slot);
  }
}
