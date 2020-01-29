/// <reference path="../../defs/es6-promise.d.ts" />

import {Addable} from './iaddable';
import {Item} from '../core/items/item';
import {Scene} from '../core/scene';
import {App as iApp} from '../internal/app';
import{checkSplitmode} from '../internal/util/splitmode';
import {addToSceneHandler} from '../util/addtosceneutil';

export class Group implements Addable {

  private _items: any[];

  constructor(itemArray ?: string[] | Item[]) {
    this._items = itemArray;
  }

  toStringArray() : string[] {
    var itemStringArray = this._items.map(item => {
      if (item instanceof Item) {
        return item._id;
      } else {
        return item;
      }
    });

    return itemStringArray;
  }

  addToScene(value?: number | Scene ): Promise<any> {
    return new Promise((resolve, reject) => {
      var splitScene;
      var activeSceneIdx;
      iApp.get('scene').then(sceneIdx => {
        activeSceneIdx = sceneIdx;
        return checkSplitmode(value);
      }).then((scenePrefix) => {
        splitScene = scenePrefix;
        if (scenePrefix.split(':')[1]) {
          activeSceneIdx = scenePrefix.split(':')[1]
        }
        return iApp.get(`scenecanaddgroup:${activeSceneIdx}:${this.toStringArray().join(',')}`);
      }).then(canAdd => {
        if (canAdd === '1') {
          return addToSceneHandler(splitScene + 'addgroup', ...this.toStringArray());            
        } else {
          reject('Items provided cannot be grouped');
        }
      }).then(result => {
        resolve(result);
      }).catch(err => {
        reject(err);
      });
    })
  }
}
