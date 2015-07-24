/// <reference path="../../defs/es6-promise.d.ts" />

import {exec} from './internal';
import {Environment} from './environment';

export class Item {
  private name: string;
  private value: string;
  private id: string;
  private sceneID: Number;
  private viewID: Number;

  private static baseID: string;

  private static MAX_SLOTS: number = 2;
  private static lastSlot: number = Item.MAX_SLOTS - 1;
  private static itemSlotMap: string[] = [];
  private static islockedSourceSlot: boolean = false;

  constructor(props: any) {
    var props = props || {};
    this.name       = props.name;
    this.value      = props.item ;
    this.id         = props.id;
    this.sceneID    = props.sceneID;
    this.viewID     = props.viewID;
  }


  /** Prepare an item for manipulation */
  static attach(itemID: string, view: number): number {
    if (Environment.isScriptPlugin()) {
      return Item.cacheItemID(itemID);
    } else {
      return Item.cacheItemID(itemID, view);
    }
  }

  // returns 0-indexed slot where item ID is cached/attached
  private static cacheItemID(itemID: string, viewID?: number): number {
    let slot = Item.itemSlotMap.indexOf(itemID);
    if (slot === -1) {
      slot = ++Item.lastSlot % Item.MAX_SLOTS;
      if (Item.islockedSourceSlot && slot === 0) {
        ++slot; // source cannot attach to first slot
      }
      Item.lastSlot = slot;
      Item.itemSlotMap[slot] = itemID;
      if (viewID === undefined) {
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
    return new Promise((resolve) => {
      exec('GetLocalPropertyAsync' +
        (String(slot) === '0' ? '' : slot + 1),
        name,
        (val) => {
          resolve(val);
        });
    });
  }

  /** Sets an item's local property */
  static set(name: string, value: string, slot: number = 0): void {
    exec('SetLocalPropertyAsync' +
      (String(slot) === '0' ? '' : slot + 1),
      name,
      value);
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
