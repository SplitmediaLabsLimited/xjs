/// <reference path="../../../defs/es6-promise.d.ts" />

import {applyMixins} from '../../internal/util/mixin';
import {Rectangle} from '../../util/rectangle';
import {Item as iItem} from '../../internal/item';
import {App as iApp} from '../../internal/app';
import {Environment} from '../environment';
import {JSON as JXON} from '../../internal/util/json';
import {XML} from '../../internal/util/xml';
import {Scene} from '../scene';
import {ItemLayout, IItemLayout} from './ilayout';
import {Source} from '../source/source'
import {
  minVersion,
  versionCompare,
  getVersion
} from '../../internal/util/version';
import {iSource} from '../source/isource';

export enum ItemTypes {
  UNDEFINED,
  FILE,
  LIVE,
  TEXT,
  BITMAP,
  SCREEN,
  FLASHFILE,
  GAMESOURCE,
  HTML
}

export enum ViewTypes {
  MAIN,
  PREVIEW,
  THUMBNAIL
}

/**
 * An `Item` represents an object that is used as a item on the stage.
 * Some possible items are games, microphones, or a webpage.
 *
 * Implements: {@link #core/IItemLayout Core/IItemLayout}
 *
 * ### Basic Usage
 *
 * ```javascript
 * var xjs = require('xjs');
 * var Scene = xjs.Scene.getById(0);
 *
 * Scene.getItems().then(function(items) {
 *   if (items.length === 0) return;
 *
 *   // There's a valid item, let's use that
 *   var item = items[items.length - 1];
 *   return item.setCustomName('ItemTesting');
 * }).then(function(item) {
 *   // Do something else here
 * });
 * ```
 * All methods marked as *Chainable* resolve with the original `Item` instance.
 * This allows you to perform sequential operations correctly:
 * ```javascript
 * var xjs = require('xjs');
 * var Item = xjs.Item;
 *
 * // an item that sets its own properties on load
 * xjs.ready()
 *    .then(Item.getItemList)
 *    .then(function(item) {
 *     return item.setCustomName('MyCustomName');
 *  }).then(function(item) {
 *     return item.setKeepLoaded(true);
 *  }).then(function(item) {
 *     // set more properties here
 *  });
 * ```
 */
export class Item extends Source implements IItemLayout {
  constructor(props?: {}) {
    super(props)
    this._isItemCall = true;
  }
  /**
   * return: Promise<ItemTypes>
   *
   * Get the type of the item
   *
   * #### Usage
   *
   * ```javascript
   * item.getType().then(function(type) {
   *   // The rest of your code here
   * });
   * ```
   */
  getType(): Promise<ItemTypes> {
    return new Promise(resolve => {
      iItem.get('prop:type', this._id).then(val => {
        this._type = ItemTypes[ItemTypes[Number(val)]];
        resolve(this._type);
      });
    });
  }

  /**
   * return: Promise<string>
   *
   * Get the ID of the item
   *
   * #### Usage
   *
   * ```javascript
   * item.getId().then(function(id) {
   *   // The rest of your code here
   * });
   * ```
   */
  getId(): Promise<string> {
    return new Promise(resolve => {
      resolve(this._id);
    });
  }

  /**
   * return: Promise<number>
   *
   * Get (1-indexed) Scene ID where the item is loaded
   *
   * #### Usage
   *
   * ```javascript
   * item.getSceneId().then(function(id) {
   *   // The rest of your code here
   * });
   * ```
   */
  getSceneId(): Promise<any> {
    return new Promise(resolve => {
      if (this._sceneId === 'i12') {
        resolve('i12');
      } else {
        resolve(Number(this._sceneId) + 1);
      }
    });
  }

  /**
   * return: Promise<ViewTypes>
   *
   * Get the view type of the item
   *
   * #### Usage
   *
   * ```javascript
   * item.getView().then(function(view) {
   *   // view values:
   *   // 0 = main view
   *   // 1 = preview editor
   *   // 2 = thumbnail preview
   * })
   * ```
   */
  getView() {
    return new Promise(resolve => {
      iItem.get('prop:viewid', this._id).then(viewId => {
        let view = ViewTypes.MAIN;
        if (viewId === '1') {
          const preview = iApp.getGlobalProperty('preview_editor_opened')
          view = preview === '1' ? ViewTypes.PREVIEW : ViewTypes.THUMBNAIL;
        }
        resolve(view);
      });
    })
  }

  /**
   * return: XML
   *
   * Convert the Item object to an XML object. Use `toString()` to
   * get the string version of the returned object.
   *
   * #### Usage
   *
   * ```javascript
   * var xml = item.toXML();
   * ```
   */
  toXML(): XML {
    var item: JXON = new JXON();

    for (let prop in this._xmlparams) {
      if (!{}.hasOwnProperty.call(this._xmlparams, prop)) continue;

      item[prop] = this._xmlparams[prop];
    }

    item['tag'] = 'item';
    item['selfclosing'] = true;

    return XML.parseJSON(item);
  }

  /**
   * return: Promise<Item[]>
   *
   * Get the item list of the attached item. This is useful when an item is
   * an instance of a global source, with multiple other items having the same
   * source as the current item.
   *
   * #### Usage
   *
   * ```javascript
   * // item pertains to an actual item instance
   * item.getItemList().then(function(item) {
   *   // This will fetch the item list of the current item
   * }).catch(function(err) {
   *   // Handle the error here. Errors would only occur
   *   // if we try to execute this method on Extension plugins
   * });
   * ```
   */
  getItemList(): Promise<Item[]> {
    return new Promise((resolve, reject) => {
      if (
        versionCompare(getVersion())
          .is
          .lessThan(minVersion)
      ) {
        Scene.searchItemsById(this._id).then(item => {
          const itemArray = [];
          itemArray.push(item);
          resolve(itemArray);
        });
      } else {
        iItem.get('itemlist', this._id).then(itemlist => {
          const promiseArray: Promise<Item>[] = [];
          const itemsArray = itemlist.split(',');

          itemsArray.forEach(itemId => {
            promiseArray.push(new Promise(itemResolve => {
              Scene.searchItemsById(itemId).then(item => {
                itemResolve(item);
              }).catch(() => itemResolve(null));
            }));
          });

          Promise.all(promiseArray).then(results => {
            resolve(results.filter(res => res !== null));
          });
        });
      }
    })
  }

  /**
   *  return: Promise<Item>
   *
   *  Refreshes the specified item.
   *
   *  #### Usage
   *  ```javascript
   *  // Sample 1: let item refresh itself
   *  xjs.Item.getItemList().then(function(item) {
   *    item.refresh(); // execution of JavaScript halts because of refresh
   *  });
   *
   *  // Sample 2: refresh some other item 'otherItem'
   *  otherItem.refresh().then(function(item) {
   *    // further manipulation of other item goes here
   *  });
   *  ```
   */
  refresh(): Promise<Item> {
    return new Promise(resolve => {
      iItem.set('refresh', '', this._id).then(() => {
        resolve(this);
      });
    });
  }

  /**
   * return: Promise<boolean>
   *
   * Removes the video item from the scene.
   *
    *  #### Usage
   *  ```javascript
   *  // let item remove itself
   *  xjs.Item.getItemList().then(function(item) {
   *    item.remove();
   *  });
   */

  remove(): Promise<boolean> {    
     return new Promise(resolve => {
      iItem.set('remove', '', this._id).then((val) => {
        resolve(val);
      });
    });
  }

  /**
   * Duplicate current item. Will duplicate item into the current scene
   */
  duplicate(): Promise<boolean> {
    return new Promise(resolve => {
      iApp.callFunc('additem', this.toXML().toString()).then(() => {
        resolve(true);
      });
    });
  }

  // ItemLayout

  /**
   * See: {@link #core/IItemLayout#isKeepAspectRatio isKeepAspectRatio}
   */
  isKeepAspectRatio: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemLayout#isPositionLocked isPositionLocked}
   */
  isPositionLocked: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemLayout#isEnhancedResizeEnabled isEnhancedResizeEnabled}
   */
  isEnhancedResizeEnabled: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemLayout#getCanvasRotate getCanvasRotate}
   */
  getCanvasRotate: () => Promise<number>;

  /**
   * See: {@link #core/IItemLayout#getCropping getCropping}
   */
  getCropping: () => Promise<Object>;

  /**
   * See: {@link #core/IItemLayout#getEnhancedRotate getEnhancedRotate}
   */
  getEnhancedRotate: () => Promise<number>;

  /**
   * See: {@link #core/IItemLayout#getPosition getPosition}
   */
  getPosition: () => Promise<Rectangle>;

  /**
   * See: {@link #core/IItemLayout#getRotateY getRotateY}
   */
  getRotateY: () => Promise<number>;

  /**
   * See: {@link #core/IItemLayout#getRotateX getRotateX}
   */
  getRotateX: () => Promise<number>;

  /**
   * See: {@link #core/IItemLayout#getRotateZ getRotateZ}
   */
  getRotateZ: () => Promise<number>;

  /**
   * See: {@link #core/IItemLayout#setCanvasRotate setCanvasRotate}
   */
  setCanvasRotate: (value: number) => Promise<Item>;

  /**
   * See: {@link #core/IItemLayout#setCropping setCropping}
   */
  setCropping: (value: Object) => Promise<Item>;

  /**
   * See: {@link #core/IItemLayout#setCroppingEnhanced setCroppingEnhanced}
   */
  setCroppingEnhanced: (value: Object) => Promise<Item>;

  /**
   * See: {@link #core/IItemLayout#setEnhancedRotate setEnhancedRotate}
   */
  setEnhancedRotate: (value: number) => Promise<Item>;

  /**
   * See: {@link #core/IItemLayout#setKeepAspectRatio setKeepAspectRatio}
   */
  setKeepAspectRatio: (value: boolean) => Promise<Item>;

  /**
   * See: {@link #core/IItemLayout#setPositionLocked setPositionLocked}
   */
  setPositionLocked: (value: boolean) => Promise<Item>;

  /**
   * See: {@link #core/IItemLayout#setEnhancedResizeEnabled setEnhancedResizeEnabled}
   */
  setEnhancedResizeEnabled: (value: boolean) => Promise<Item>;

  /**
   * See: {@link #core/IItemLayout#setPosition setPosition}
   */
  setPosition: (value: Rectangle) => Promise<Item>;

  /**
   * See: {@link #core/IItemLayout#setRotateY setRotateY}
   */
  setRotateY: (value: number) => Promise<Item>;

  /**
   * See: {@link #core/IItemLayout#setRotateX setRotateX}
   */
  setRotateX: (value: number) => Promise<Item>;

  /**
   * See: {@link #core/IItemLayout#setRotateZ setRotateZ}
   */
  setRotateZ: (value: number) => Promise<Item>;

  // iSource
  /**
   * param: (value: string)
   * ```
   * return: Promise<Source>
   * ```
   *
   * Sets the name of the item.
   *
   * *Chainable.*
   *
   * #### Usage
   *
   * ```javascript
   * item.setName('newNameHere').then(function(item) {
   *   // Promise resolves with same Item instance when name has been set
   *   return item.getName();
   * }).then(function(name) {
   *   // 'name' should be the updated value by now.
   * });
   * ```
   */
  setName: (value: string) => Promise<Item>

  /**
   * return: Promise<string>
   *
   * Gets the name of the item.
   *
   * #### Usage
   *
   * ```javascript
   * item.getName().then(function(name) {
   *   // Do something with the name
   * });
   * ```
   */
  getName: () => Promise<string>

  /**
   * param: (value: string)
   * ```
   * return: Promise<Source>
   * ```
   *
   * Sets the custom name of the item.
   *
   * The main difference between `setName` and `setCustomName` is that the CustomName
   * can be edited by users using XBC through the bottom panel. `setName` on
   * the other hand would update the item's internal name property.
   *
   * *Chainable.*
   *
   * #### Usage
   *
   * ```javascript
   * item.setCustomName('newNameHere').then(function(item) {
   *   // Promise resolves with same Item instance when custom name has been set
   *   return item.getCustomName();
   * }).then(function(name) {
   *   // 'name' should be the updated value by now.
   * });
   * ```
   */
  setCustomName: () => Promise<Item>

  /**
   * return: Promise<string>
   *
   * Gets the custom name of the item.
   *
   * #### Usage
   *
   * ```javascript
   * item.getCustomName().then(function(name) {
   *   // Do something with the name
   * });
   * ```
   */
  getCustomName: ()  => Promise<string>

  /**
   * return: Promise<string|XML>
   *
   * Gets a special string that refers to the item's main definition.
   *
   * This method can resolve with an XML object, which is an object generated by
   * the framework. Call `toString()` to transform into an XML String. (See the
   * documentation for `setValue` for more details.)
   *
   * #### Usage
   *
   * ```javascript
   * item.getValue().then(function(value) {
   *   // Do something with the value
   * });
   * ```
   */
  getValue: () => Promise<string | XML>

  /**
   * param: (value: string)
   * ```
   * return: Promise<Source>
   * ```
   *
   * Set the item's main definition; this special string defines the item's
   * "identity". Each type of item requires a different format for this value.
   *
   * *Chainable.*
   *
   * **WARNING:**
   * Please do note that using this method COULD break the current item, possibly modifying
   * its type IF you set an invalid string for the current item.
   *
   * #### Possible values by item type
   * - FILE - path/URL
   * - LIVE - Device ID
   * - BITMAP - path
   * - SCREEN - XML string
   * - FLASHFILE - path
   * - GAMESOURCE - XML string
   * - HTML - path/URL or html:<plugin>
   *
   * #### Usage
   *
   * ```javascript
   * item.setValue('@DEVICE:PNP:\\?\USB#VID_046D&amp;PID_082C&amp;MI_02#6&amp;16FD2F8D&amp;0&amp;0002#{65E8773D-8F56-11D0-A3B9-00A0C9223196}\GLOBAL')
   *   .then(function(item) {
   *   // Promise resolves with same Item instance
   * });
   * ```
   */
  setValue: (value: string | XML) => Promise<Item>

  /**
   * return: Promise<boolean>
   *
   * Check if item is kept loaded in memory
   *
   * #### Usage
   *
   * ```javascript
   * item.getKeepLoaded().then(function(isLoaded) {
   *   // The rest of your code here
   * });
   * ```
   */
  getKeepLoaded: () => Promise<boolean>

  /**
   * param: (value: boolean)
   * ```
   * return: Promise<Source>
   * ```
   *
   * Set Keep loaded option to ON or OFF
   *
   * Items with Keep loaded set to ON would emit `scene-load` event each time
   * the active scene switches to the item's current scene.
   *
   * *Chainable.*
   *
   * #### Usage
   *
   * ```javascript
   * item.setKeepLoaded(true).then(function(item) {
   *   // Promise resolves with same Item instance
   * });
   * ```
   */
  setKeepLoaded: (value: boolean) => Promise<Item>

  /**
   * return: Promise<string>
   *
   * Get the Source ID of the item.
   * *Available only on XSplit Broadcaster verions higher than 2.8.1603.0401*
   *
   * #### Usage
   *
   * ```javascript
   * item.getSourceId().then(function(id) {
   *   // The rest of your code here
   * });
   * ```
   */
  getSourceId: () => Promise<string>

}

applyMixins(Item, [iSource, ItemLayout]);
