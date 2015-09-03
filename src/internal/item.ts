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
      if (Environment.isScriptPlugin()) {
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

  /** used for source plugins. lock an id to slot 0 */
  static lockSourceSlot(itemID: string) {
    if (itemID !== undefined) {
      Item.islockedSourceSlot = true;
      Item.itemSlotMap[0] = itemID;
    } else {
      Item.islockedSourceSlot = false;
      Item.itemSlotMap[0] = '';
    }
  }

  /** Get an item's local property asynchronously */
  static get(name: string, slot: number = 0): Promise<string> {
    return new Promise(resolve => {
      exec('GetLocalPropertyAsync' +
        (String(slot) === '0' ? '' : slot + 1),
        name,
        val => {
          resolve(val);
        });
    });
  }

  /** Sets an item's local property */
  static set(name: string, value: string, slot: number = 0): Promise<boolean> {
    return new Promise(resolve => {
      exec('SetLocalPropertyAsync' +
        (String(slot) === '0' ? '' : slot + 1),
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
  static setBaseID(id: string): void {
    Item.baseID = id;
  }

  /** helper function for Item.getCurrentSource() */
  static getBaseID(): string {
    return Item.baseID;
  }
}
