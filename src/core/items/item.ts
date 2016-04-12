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
export class Item implements IItemLayout {
  protected _id: string;
  protected _type: ItemTypes;
  protected _value: any;
  private _name: string;
  private _cname: string;
  private _sceneId: number;
  private _keepLoaded: boolean;

  private _xmlparams: {};

  private static minVersion = '2.8.1603.0401';

  private static _versionCompare(version: string): any {
    const parts = version.split('.');
    const comp = (prev, curr, idx) => {
      if ((parts[idx] < curr && prev !== -1) || prev === 1) {
        return 1;
      } else if (parts[idx] > curr || prev === -1) {
        return -1;
      } else {
        return 0;
      }
    }

    return {
      is: {
        lessThan: (compare: string) => {
          let cParts = compare.split('.');
          return cParts.reduce(comp, parts[0]) === 1;
        },
        greaterThan: (compare: string) => {
          let cParts = compare.split('.');
          return cParts.reduce(comp, parts[0]) === -1;
        },
        equalsTo: (compare: string) => {
          let cParts = compare.split('.');
          return cParts.reduce(comp, parts[0]) === 0;
        }
      }
    };
  }

  constructor(props?: {}) {
    props = props ? props : {};

    this._name = props['name'];
    this._cname = props['cname'];
    this._id = props['id'];
    this._sceneId = props['sceneId'];
    this._value = props['value'];
    this._keepLoaded = props['keeploaded'];
    this._type = Number(props['type']);

    this._xmlparams = props;
  }

  /**
   * param: (value: string)
   * ```
   * return: Promise<Item>
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
  setName(value: string): Promise<Item> {
    return new Promise(resolve => {
      this._name = value;
      iItem.set('prop:name', this._name, this._id).then(() => {
        resolve(this);
      });
    });
  }

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
  getName(): Promise<string> {
    return new Promise(resolve => {
      iItem.get('prop:name', this._id).then(val => {
        this._name = val;
        resolve(val);
      });
    });
  }

  /**
   * param: (value: string)
   * ```
   * return: Promise<Item>
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
  setCustomName(value: string): Promise<Item> {
    return new Promise(resolve => {
      this._cname = value;
      iItem.set('prop:cname', this._cname, this._id).then(() => {
        resolve(this);
      });
    });
  }

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
  getCustomName(): Promise<string> {
    return new Promise(resolve => {
      iItem.get('prop:cname', this._id).then(val => {
        this._cname = val;
        resolve(val);
      });
    });
  }

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
  getValue(): Promise<string | XML> {
    return new Promise(resolve => {
      iItem.get('prop:item', this._id).then(val => {
        val = (val === 'null') ? '' : val;
        if (val === '') { // don't return XML for null values
          this._value = '';
          resolve(val);
        } else {
          try {
            this._value = XML.parseJSON(JXON.parse(val));
            resolve(this._value);
          } catch (e) {
            // value is not valid XML (it is a string instead)
            this._value = val;
            resolve(val);
          }
        }
      });
    });
  }

  /**
   * param: (value: string)
   * ```
   * return: Promise<Item>
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
  setValue(value: string | XML): Promise<Item> {
    return new Promise(resolve => {
      var val: string = (typeof value === 'string') ?
        <string>value : (<XML>value).toString();
      if (typeof value !== 'string') { // XML
        this._value = JXON.parse(val);
      } else {
        this._value = val;
      }
      iItem.set('prop:item', val, this._id).then(() => {
        resolve(this);
      });
    });
  }

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
  getKeepLoaded(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:keeploaded', this._id).then(val => {
        this._keepLoaded = (val === '1');
        resolve(this._keepLoaded);
      });
    });
  }

  /**
   * param: (value: boolean)
   * ```
   * return: Promise<Item>
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
  setKeepLoaded(value: boolean): Promise<Item> {
    return new Promise(resolve => {
      this._keepLoaded = value;
      iItem.set('prop:keeploaded', (this._keepLoaded ? '1' : '0'), this._id)
        .then(() => {
          resolve(this);
        });
    });
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
  getSceneId(): Promise<number> {
    return new Promise(resolve => {
      resolve(Number(this._sceneId) + 1);
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

    item['tag'] = 'item';
    item['name'] = this._name;
    item['item'] = this._value;
    item['type'] = this._type;
    item['selfclosing'] = true;

    if (this._cname) {
      item['cname'] = this._cname;
    }

    return XML.parseJSON(item);
  }

  /**
   * return: Promise<Item>
   *
   * > #### For Deprecation
   * This method is deprecated and will be removed soon. Please use
   * {@link #core/Item#getItemList getItemList} instead.
   *
   * Get the current source (when function is called by sources), or the source
   * that was right-clicked to open the source properties window (when function is called
   * from the source properties window)
   *
   * #### Usage
   *
   * ```javascript
   * xjs.Source.getCurrentSource().then(function(source) {
   *   // This will fetch the current source (the plugin)
   * }).catch(function(err) {
   *   // Handle the error here. Errors would only occur
   *   // if we try to execute this method on Extension plugins
   * });
   * ```
   */
  static getCurrentSource(): Promise<Item> {
    return new Promise((resolve, reject) => {
      console.warn('Warning! This method is deprecated and will be removed ' +
        'soon. Please use getItemList instead. (Only works for XSplit ' +
        'Broadcaster versions above 2.8.xxxx.xxxx');
      if (Environment.isExtension()) {
        reject(Error('Extensions do not have sources ' +
          'associated with them.'));
      } else if (
        (Environment.isSourcePlugin() || Environment.isSourceConfig()) &&
        Item
          ._versionCompare(Environment.getVersion())
          .is
          .greaterThan(Item.minVersion)
      ) {
        Item.getItemList().then(items => {
          if (items.length > 0) {
            Scene.searchSourcesById(items[0]._id).then(item => {
              resolve(item);
            });
          } else {
            reject(Error('Cannot get item list'))
          }
        });
      } else if (Environment.isSourcePlugin() || Environment.isSourceConfig()) {
        Scene.searchSourcesById(iItem.getBaseId()).then(item => {
          resolve(item);
        });
      }
    });
  }

  /**
   * return: Promise<Item[]>
   *
   * Get the current item (when function is called by items), or the item
   * that was right-clicked to open the source properties window (when function is called
   * from the source properties window)
   *
   * #### Usage
   *
   * ```javascript
   * xjs.Item.getItemList().then(function(item) {
   *   // This will fetch the current item (the plugin)
   * }).catch(function(err) {
   *   // Handle the error here. Errors would only occur
   *   // if we try to execute this method on Extension plugins
   * });
   * ```
   */
  static getItemList(): Promise<Item[]> {
    return new Promise((resolve, reject) => {
      if (Environment.isExtension()) {
        reject(Error('Extensions do not have sources associated with them.'));
      } else if (
        Item
          ._versionCompare(Environment.getVersion())
          .is
          .lessThan(Item.minVersion)
      ) {
        reject(Error('Only available on versions above ' + Item.minVersion));
      } else if (Environment.isSourcePlugin() || Environment.isSourceConfig()) {
        iItem.get('itemlist').then(itemlist => {
          const promiseArray: Promise<Item>[] = [];
          const itemsArray = itemlist.split(',');

          itemsArray.forEach(itemId => {
            promiseArray.push(new Promise(itemResolve => {
              itemResolve(new Item({ id: itemId }));
            }));
          });

          Promise.all(promiseArray).then(results => {
            resolve(results);
          });
        });
      }
    });
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

}

applyMixins(Item, [ItemLayout]);
