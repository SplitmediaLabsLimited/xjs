/// <reference path="../../../defs/es6-promise.d.ts" />

import {Item as iItem} from '../../internal/item';
import {App as iApp} from '../../internal/app';
import {ItemTypeResolve} from '../../util/itemtyperesolve';
import {Scene} from '../../core/scene';

import {Item} from './item';

// import {Scene} from '../scene';
// import {Rectangle} from '../../util/rectangle';

const findItem = (presetArray, id) => {
  let itemViaID = undefined;
  presetArray.find(item => {
    const children = item.children || [];
    const result = children.find(child => child['id'] === id);
    if (result) {
      itemViaID = result;
    }
    return result !== undefined;
  });
  const groupItem = itemViaID
  return itemViaID;
}

const getID = (item: any) => {
  if (item instanceof Item) {
    return item._id;
  } else {
    return item;
  }
}

const toItemString = (items: any) : string =>  {
  if (!Array.isArray(items)) {
    return getID(items);
  }

  const itemStringArray = items.map(item => {
    return getID(item);
  });

  return itemStringArray.join(',');
}

export interface IItemGroup {

  /**
   * return: Promise<Item[]>
   *
   * Get all the items present in the group
   *
   * #### Usage
   *
   * ```javascript
   * grpItem.getItems().then(function(items) {
   *  // do something to each item in items array
   * });
   * ```
   */
  getItems(): Promise<Item[]>;

  /**
   * param: (items: string || string[] || Item || Item[])
   * ```
   * return: Promise<Item[]>
   * ```
   *
   * Adds items into the group.
   * Accepts an item ID or Item object or an array of those.
   * Rejects when any of the provided items cannot be added into the group,
   * such as, but not limited to already added into the group or another group,
   * in another scene, or non-existent
   *
   * #### Usage
   *
   * ```javascript
   * var myItems;
   * Scene.getItems()
   * .then(function(items) {
   *   // assuming myItems[0] is the group Item
   *   // can be added as a single Item object
   *   myItems[0].addItems(myItems[2]);
   *   // or via the item's id
   *   myItems[0].addItems(myItems[3]._id);
   *   // or via an array of them
   *   myItems[0].addItems([myItems[4],myItems[5]]);
   * });
   * ```
   */
  addItems(itemArray: any): Promise<IItemGroup>;

  /**
   * param: (items: string || string[] || Item || Item[])
   * ```
   * return: Promise<Item[]>
   * ```
   *
   * Removes the items from the group.
   * This doesn't actually remove the item from the scene,
   * but only detaches itself from the group.
   * Accepts an item ID or Item object or an array of those.
   * Rejects when any of the provided items cannot be removed from the group,
   *
   * #### Usage
   *
   * ```javascript
   * var myItems;
   * Scene.getItems()
   * .then(function(items) {
   *   // assuming myItems[0] is the group Item
   *   // can remove a single Item object
   *   myItems[0].removeItems(myItems[2]);
   *   // or via the item's id
   *   myItems[0].removeItems(myItems[3]._id);
   *   // or via an array of them
   *   myItems[0].removeItems([myItems[4],myItems[5]]);
   * });
   * ```
   */
  removeItems(itemArray: any): Promise<IItemGroup>;

  /**
   * return: Promise<Item[]>
   *
   * Removes all the items within the group.
   * This doesn't actually remove the items from the scene,
   * but only detaches itself from the group.
   * This also persists the group item in the scene.
   * You would need to specifically remove the GroupItem if needed.
   *
   * #### Usage
   *
   * ```javascript
   * Scene.getItems()
   * .then(function(items) {
   *   if (myItems[0] instanceof XJS.GroupItem) {
   *     return myItems[0].unGroup();
   *   }
   * }).then(function() {
   *   myItems[0].remove()
   * });
   * ```
   */
  unGroup(): Promise<IItemGroup>;
}

export class ItemGroup implements IItemGroup {
  private _id: string;

  getItems(): Promise<Item[]> {
    return new Promise((resolve, reject) => {
      iApp.getAsList('sceneconfig')
      .then(jsonArray => {
        // get group item here
        const groupItem = findItem(jsonArray, this._id);
        const children = (groupItem.children[0].children) ? groupItem.children[0].children : [];
        const childItems = children.map(item => ItemTypeResolve(item));
        resolve(childItems);
      }).catch(err => {
        reject('Group item non-existent');
      })
    });
  }

  addItems(items: any): Promise<ItemGroup> {
    return new Promise((resolve, reject) => {
      const itemArrayString = toItemString(items);
      iItem.get('prop:scene', this._id)
      .then(sceneIndex => {
        if (sceneIndex === '') {
          reject('Item is not a group item or non-existent');
        }
        return iApp.get(`scenecanaddtogroup:${sceneIndex}:${this._id},${itemArrayString}`);
      }).then(canAdd => {
        if (canAdd === '1') {
          return iApp.callFunc('addtogroup', `${this._id},${itemArrayString}`);
        } else {
          reject('One or more items provided cannot be added to the group');
        }
      }).then(result => {
        resolve(this);
      }).catch(err => {
        reject(err);
      });
    })
  }

  removeItems(items: any): Promise<ItemGroup> {
    return new Promise((resolve, reject) => {
      const itemArrayString = toItemString(items);
      iItem.get('prop:scene', this._id)
      .then(sceneIndex => {
        if (sceneIndex === '') {
          reject('Item is not a group item or non-existent');
        }
        return iApp.get(`scenecanremovefromgroup:${sceneIndex}:${this._id},${itemArrayString}`);
      }).then(canRemove => {
        if (canRemove === '1' || canRemove === '2') {
          return iApp.callFunc('removefromgroup', `${this._id},${itemArrayString}`);
        } else {
          reject('One or more items provided cannot be removed from the group');
        }
      }).then(result => {
        resolve(this);
      }).catch(err => {
        reject(err);
      });
    })
  }

  unGroup(): Promise<IItemGroup> {
    return new Promise(resolve => {
      iApp.callFunc('removefromgroupall', this._id).then(val => {
        resolve(this);
      });
    });
  }
}
