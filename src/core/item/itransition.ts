/// <reference path="../../../defs/es6-promise.d.ts" />

import {Item as iItem} from '../../internal/item';
import {Transition} from '../transition';

export interface IItemTransition {
  isVisible(): Promise<boolean>;
  setVisible(value: boolean);
  getTransition(): Promise<Transition>;
  setTransition(value: Transition);
  getTransitionTime(): Promise<number>;
  setTransitionTime(value: number);
}

export class ItemTransition implements IItemTransition {
  private _id: string;

  isVisible(): Promise<boolean> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);

      iItem.get('prop:visible', slot).then(val => {
        resolve(val === '1' ? true : false);
      });
    });
  }

  setVisible(value: boolean) {
    let slot = iItem.attach(this._id);

    iItem.set('prop:visible', value ? '1' : '0', slot);
  }

  getTransition(): Promise<Transition> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);

      iItem.get('prop:transitionid', slot).then(val => {
        if (val === '') { // NONE
          resolve(Transition.NONE);
        } else {
          resolve(Transition[val.toUpperCase()]);
        }
      });
    });
  }

  setTransition(value: Transition) {
    let slot = iItem.attach(this._id);

    iItem.set('prop:transitionid', value.toString(), slot);
  }

  getTransitionTime(): Promise<number> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);

      iItem.get('prop:transitiontime', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setTransitionTime(value: number) {
    let slot = iItem.attach(this._id);

    if (value < 0 || value > 60000) {
      throw new RangeError('Transparency may only be in the range 0 to 60000.');
    };

    iItem.set('prop:transitiontime', String(value), slot);
  }
}
