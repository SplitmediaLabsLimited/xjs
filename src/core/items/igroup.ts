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

  unGroup(): Promise<IItemGroup>;

  getItems(): Promise<Item[]>;

  addItems(itemArray: any): Promise<IItemGroup>;

  removeItems(itemArray: any): Promise<IItemGroup>;
}

export class ItemGroup implements IItemGroup {
  private _id: string;

  unGroup(): Promise<IItemGroup> {
    return new Promise(resolve => {
      iApp.callFunc('removefromgroupall', this._id).then(val => {
        resolve(this);
      });
    });
  }

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
}
