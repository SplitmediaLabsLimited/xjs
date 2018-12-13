/// <reference path="../../defs/es6-promise.d.ts" />
/// <reference path="../../defs/window.d.ts" />

import { EventEmitter } from './eventemitter';
import { App as iApp } from '../internal/app';
import { Global } from '../internal/global';
import { exec } from '../internal/internal';
import window from './window';

export class AddToSceneEventEmitter extends EventEmitter {
  private static _instance: AddToSceneEventEmitter;

  constructor() {
    super();
    if (Global.isListenToItemAdd()) {
      //create listener for adding items
      const prevAppOnItemAdded = window.AppOnItemAdded;
      window.AppOnItemAdded = (...args) => {
        this.emit(args[0], args[1]);
        if (typeof prevAppOnItemAdded === 'function')
          prevAppOnItemAdded(...args);
      };
      exec('AppSubscribeEvents');
    }
  }

  //Gets/Creates the instance of the AddToSceneEventEmitter class.
  static getInstance() {
    if (AddToSceneEventEmitter._instance === undefined) {
      AddToSceneEventEmitter._instance = new AddToSceneEventEmitter();
    }
    return AddToSceneEventEmitter._instance;
  }
}

//https://gist.github.com/jed/982883
export function guid(a: any): string {
  return a
    ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
    : ('' + 1e7 + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, guid);
}

export function addToSceneHandler(cmd: string, args: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const eventId = 'EVENT-XJS-CREATE-' + guid(null) + '-' + Date.now();
    if (Global.isListenToItemAdd()) {
      const _addToScene = AddToSceneEventEmitter.getInstance();
      const itemCreated = itemId => {
        _addToScene.off(eventId, itemCreated);
        resolve(itemId);
      };
      _addToScene.on(eventId, itemCreated);
    }
    //actual creation of item
    iApp
      .callFunc('e:' + eventId + '|' + cmd, args)
      .then(() => {
        if (!Global.isListenToItemAdd()) resolve(true);
      })
      .catch(err => {
        reject(err);
      });
  });
}
