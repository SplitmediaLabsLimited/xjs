/// <reference path="../../../defs/es6-promise.d.ts" />

import {Item as iItem} from '../../internal/item';
import {Transition} from '../transition';

export interface IItemTransition {

  /**
   * return: Promise<boolean>
   *
   * Check if item is visible on stage
   */
  isVisible(): Promise<boolean>;

  /**
   * param: value<boolean>
   *
   * Set item to visible or hidden
   *
   * *Chainable.*
   */
  setVisible(value: boolean): Promise<IItemTransition>;

  /**
   * return: Promise<boolean>
   *
   * Get item's transition type for when visibility is toggled
   */
  getTransition(): Promise<Transition>;

  /**
   * param: value<Transition>
   *
   * Set item's transition type for when visibility is toggled
   *
   * *Chainable.*
   */
  setTransition(value: Transition): Promise<IItemTransition>;

  /**
   * return: Promise<number>
   *
   * Get item's transition time in milliseconds
   */
  getTransitionTime(): Promise<number>;
  
  /**
   * param: value<number>
   *
   * Set item's transition time in milliseconds
   *
   * *Chainable.*
   */
  setTransitionTime(value: number): Promise<IItemTransition>;
}

export class ItemTransition implements IItemTransition {
  private _id: string;

  isVisible(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:visible', this._id).then(val => {
        resolve(val === '1' ? true : false);
      });
    });
  }

  setVisible(value: boolean): Promise<ItemTransition> {
    return new Promise(resolve => {
      iItem.set('prop:visible', value ? '1' : '0', this._id).then(() => {
        resolve(this);
      });
    });
  }

  getTransition(): Promise<Transition> {
    return new Promise(resolve => {
      iItem.get('prop:transitionid', this._id).then(val => {
        if (val === '') { // NONE
          resolve(Transition.NONE);
        } else {
          resolve(Transition[val.toUpperCase()]);
        }
      });
    });
  }

  setTransition(value: Transition): Promise<ItemTransition> {
    return new Promise(resolve => {
      iItem.set('prop:transitionid', value.toString(), this._id).then(() => {
        resolve(this);
      });
    });
  }

  getTransitionTime(): Promise<number> {
    return new Promise(resolve => {
      iItem.get('prop:transitiontime', this._id).then(val => {
        resolve(Number(val));
      });
    });
  }

  setTransitionTime(value: number): Promise<ItemTransition> {
    return new Promise((resolve, reject) => {
      if (value < 0 || value > 60000) {
        reject(RangeError('Transparency may only be in the range 0 to 60000.'));
      } else {
        iItem.set('prop:transitiontime', String(value), this._id).then(() => {
          resolve(this);
        });
      }
    });

  }
}
