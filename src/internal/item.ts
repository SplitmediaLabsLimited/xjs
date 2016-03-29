/// <reference path="../../defs/es6-promise.d.ts" />

import {exec} from './internal';
import {Environment} from '../core/environment';

export class Item {

  private static baseID: string;

  private static MAX_SLOTS: number = 2;
  private static lastSlot: number = Item.MAX_SLOTS - 1;
  private static itemSlotMap: string[] = [];
  private static islockedSourceSlot: boolean = false;

  /** Prepare an item for manipulation */
  static attach(itemID: string): number {
    let slot = Item.itemSlotMap.indexOf(itemID);
    if (slot === -1) {
      slot = ++Item.lastSlot % Item.MAX_SLOTS;
      if (Item.islockedSourceSlot && slot === 0) {
        ++slot; // source cannot attach to first slot
      }
      Item.lastSlot = slot;
      Item.itemSlotMap[slot] = itemID;
      if (!Environment.isSourcePlugin()) {
        exec('SearchVideoItem' +
          (String(slot) === '0' ? '' : (slot + 1)),
          itemID
        );
      } else {
        exec('AttachVideoItem' +
          (String(slot) === '0' ? '' : (slot + 1)),
          itemID
        );
      }
    }
    return slot;
  }

  /** Get an item's local property asynchronously */
  static get(name: string, id?: string): Promise<string> {
    return new Promise(resolve => {
      const slot = id !== undefined && id !== null ? - 1 : Item.attach(id);

      exec('GetLocalPropertyAsync' +
        (String(slot) === '-1' ? '' : slot + 1),
        name,
        val => {
          resolve(val);
        });
    });
  }

  /** Sets an item's local property */
  static set(name: string, value: string, id?: string): Promise<boolean> {
    return new Promise(resolve => {
      const slot = id !== undefined && id !== null ? - 1 : Item.attach(id);

      exec('SetLocalPropertyAsync' +
        (String(slot) === '-1' ? '' : slot + 1),
        name,
        value,
        val => {
          resolve(!(Number(val) < 0));
        });
    });
  }

  /** Calls a function defined in an item/source */
  static callFunc(func: string, arg: string): void {
    exec('CallInner', func, arg);
  }

  /** helper function to get current source on init */
  static setBaseId(id: string): void {
    Item.baseID = id;
  }

  /** helper function for Source.getCurrentSource() */
  static getBaseId(): string {
    return Item.baseID;
  }
}
