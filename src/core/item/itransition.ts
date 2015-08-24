/// <reference path="../../../defs/es6-promise.d.ts" />

import {Item as iItem} from '../../internal/item';

export interface IItemTransition {
  isVisible(): Promise<boolean>;
  setVisible(value: boolean);
  getTransition(): Promise<string>;
  setTransition(value: string);
  getTransitionTime(): Promise<number>;
  setTransitionTime(value: number);
}

export class ItemTransition implements IItemTransition {
  private id: string;

  isVisible(): Promise<boolean> {
    return new Promise(resolve => {
      let slot = iItem.attach(this.id);

      iItem.get('prop:visible', slot).then(val => {
        resolve(val === '1' ? true : false);
      });
    });
  }

  setVisible(value: boolean) {
    let slot = iItem.attach(this.id);

    iItem.set('prop:visible', value ? '1' : '0', slot);
  }

  getTransition(): Promise<string> {
    return new Promise(resolve => {
      resolve();
    });
  }

  setTransition(value: string) {
    let slot = iItem.attach(this.id);

    iItem.set('prop:transitionid', value, slot);
  }

  getTransitionTime(): Promise<number> {
    return new Promise(resolve => {
      let slot = iItem.attach(this.id);

      iItem.get('prop:transitiontime', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setTransitionTime(value: number) {
    let slot = iItem.attach(this.id);

    iItem.set('prop:transitionid', String(value), slot);
  }
}
