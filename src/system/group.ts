/// <reference path="../../defs/es6-promise.d.ts" />

import {Addable} from './iaddable';
import {Item} from '../core/items/item';
import {Scene} from '../core/scene';
import {App as iApp} from '../internal/app';
import{checkSplitmode} from '../internal/util/splitmode';
import {addToSceneHandler} from '../util/addtosceneutil';

/**
 *  Class for combining several Items into a group
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 * var myScene;
 * var Group = XJS.Group;
 * xjs.Scene.getActiveScene()
 * .then(function(scene) {
 *   myScene = scene;
 *   return myScene.getItems();
 * }).then(function(items) {
 *   var newGroup = new Group(items);
 *   newGroup.addToScene();
 * })
 * 
 *
 * ```
 */
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

  /**
   * param: (value?: number | Scene)
   * ```
   * return: Promise<any>
   * ```
   *
   * Adds this group to the current scene by default.
   * Accepts an optional parameter value, which, when supplied,
   * points to the scene where item will be added instead.
   * If ready config {listenToItemAdd: true} it returns item id,
   * else returns boolean.
   *
   * Note: There is yet no way to detect error responses for this action.
   */
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
