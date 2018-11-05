/// <reference path="../../../defs/es6-promise.d.ts" />

import {applyMixins} from '../../internal/util/mixin';
import {Rectangle} from '../../util/rectangle';
import {EventEmitter} from '../../util/eventemitter';
import {Item as iItem} from '../../internal/item';
import {App as iApp} from '../../internal/app';
import {EventManager} from '../../internal/eventmanager';
import {Environment} from '../environment';
import {JSON as JXON} from '../../internal/util/json';
import {XML} from '../../internal/util/xml';
import {Scene} from '../scene';
import {ItemLayout, IItemLayout} from './ilayout';
import {
  minVersion,
  versionCompare,
  getVersion,
  itemSubscribeEventVersion,
  globalsrcMinVersion
} from '../../internal/util/version';

import {iSource, ISource, ItemTypes} from '../source/isource';
import {Source} from '../source/source'
import {GameSource} from '../source/game';
import {CameraSource} from '../source/camera';
import {AudioSource} from '../source/audio';
import {VideoPlaylistSource} from '../source/videoplaylist'
import {HtmlSource} from '../source/html';
import {FlashSource} from '../source/flash';
import {ScreenSource} from '../source/screen';
import {ImageSource} from '../source/image';
import {MediaSource, MediaTypes} from '../source/media';

/**
 * Used by items to determine the its view type.
 *
 * Check `getView()` method of {@link #core/Item#getView Core/Item}
 */
export enum ViewTypes {
  MAIN,
  PREVIEW,
  THUMBNAIL
}

/**
 * An `Item` is rendered from a {@link #core/Source Source} and represents an
 * object that is used as an item on the stage. Multiple items may be linked to
 * a single source and any changes made to the source would affect all linked
 * items.
 *
 * Implements: {@link #core/IItemLayout Core/IItemLayout}
 *
 * ### Basic Usage
 *
 * ```javascript
 * var xjs = require('xjs');
 * var Scene = xjs.Scene.getById(1);
 *
 * Scene.getItems().then(function(items) {
 *   if (items.length === 0) return;
 *
 *   // There's a valid item, let's use that
 *   var item = items[items.length - 1];
 *   return item.setKeepAspectRatio(true);
 * }).then(function(item) {
 *   // Do something else here
 * });
 * ```
 * All methods marked as *Chainable* resolve with the original `Item` instance.
 * This allows you to perform sequential operations correctly:
 * ```javascript
 * var xjs = require('xjs');
 * var Source = xjs.Source;
 *
 * // an item that sets its own properties on load
 * xjs.ready()
 *    .then(Source.getCurrentSource)
 *    .then(function(source) {
 *    return source.getItemList()
 *  }).then(function(items) {
 *    return items[0].setEnhancedResizeEnabled(true)
 *  }).then(function(items) {
 *    return items[0].setPositionLocked(true)
 *  }).then(function(items) {
 *    //set more properties here
 *  })
 * ```
 */
export class Item extends Source implements IItemLayout, ISource {
  static _emitter = new EventEmitter();
  static _subscriptions = [];

  constructor(props?: {}) {
    super(props)
    this._isItemCall = true;
  }

  /**
   * param: (event: string,  handler: Function)
   *
   * Allows listening to events per instance.
   * Currently there are only two:
   * `item-changed` and `item-destroyed`.
   *
   * Item change is triggered thru any property change:
   * - via js(source plugin/extension),
   * - via visibility-toggling through the sources list,
   * - or via the source properties dialog
   *
   *  #### Usage:
   *
   * ```javascript
   * let itemChange = function(...args) {
   *   console.log('Item has changed');
   * }
   *
   * let current;
   * let items;
   * xjs.Scene.getActiveScene()
   * .then( scene => {
   *   current = scene;
   *   return current.getItems();
   * }).then( list => {
   *   items = list;
   *   items[0].on('item-changed', itemChange);
   * });
   * ```
   *
   * Duplicate handlers are allowed.
   */
  on(event: string, handler: Function) {
    Item._emitter.on(event + '_' + this._id, handler);
    // add additional functionality for events
    let isItemSubscribeEventsSupported = versionCompare(getVersion()).
      is.greaterThanOrEqualTo(itemSubscribeEventVersion);

    if (event === 'item-changed' && isItemSubscribeEventsSupported &&
      !Environment.isSourceProps() && Item._subscriptions.indexOf('itempropchange_' + this._id) < 0) {
      Item._subscriptions.push('itempropchange_' + this._id);
      EventManager.subscribe('itempropchange_' + this._id, (...eventArgs) => {
        Item._emitter.emit('item-changed_' + this._id, ...eventArgs);
      });
    } else if (event === 'item-destroyed' && isItemSubscribeEventsSupported &&
      !Environment.isSourceProps() && Item._subscriptions.indexOf('itemdestroyed_' + this._id) < 0) {
      Item._subscriptions.push('itemdestroyed_' + this._id);
      EventManager.subscribe('itemdestroyed_' + this._id, (...eventArgs) => {
        Item._emitter.emit('item-destroyed_' + this._id, ...eventArgs);
      });
    }
  }

  /**
   * param: (event: string,  handler: Function)
   *
   * Removes specificied event handler bound by `on`.
   * Note that this can only be done for named function handlers.
   *
   *  #### Usage:
   *
   * ```javascript
   * let itemChange = function(...args) {
   *   console.log('Item has changed');
   * }
   *
   * let current;
   * let items;
   * xjs.Scene.getActiveScene()
   * .then( scene => {
   *   current = scene;
   *   return current.getItems();
   * }).then( list => {
   *   items = list;
   *   items[0].on('item-changed', itemChange);
   *   setTimeout( ()=> {
   *     items[0].off('item-changed', itemChange);
   *   }, 10000);
   * });
   * ```
   */
  off(event: string, handler: Function) {
    Item._emitter.off(event + '_' + this._id, handler);
  }

  /**
   * return: Promise<Item[]>
   *
   * Gets the list of linked items of the current Item.
   * Linked items are items linked to a single source.
   *
   * #### Usage
   *
   * ```javascript
   * xjs.Item.getItemList().then(function(items) {
   *   for (var i = 0 ; i < items.length ; i++) {
   *     // Manipulate each item here
   *     items[i].setKeepAspectRatio(true);
   *   }
   * })
   * ```
   *
   * This is simply a shortcut to:
   * `xjs.Item.getCurrentSource()` -> `source.getItemList()`
   */
  static getItemList(): Promise<Item[]> {
    return new Promise(resolve => {
      resolve(Source.getItemList())
    })
  }

  /**
   * return: Promise<string>
   *
   * Get the ID of the Item
   *
   * #### Usage
   *
   * ```javascript
   * item.getId().then(function(id) {
   *   // The rest of your code here
   * });
   * ```
   */
  getId: () => Promise<string>

  /**
   * return: Promise<Number>
   *
   * Get the frames rendered per second of an item
   *
   * #### Usage
   *
   * ```javascript
   * item.getFPS().then(function(fps) {
   *   // The rest of your code here
   * });
   * ```
   */
  getFPS(): Promise<number>{
    return new Promise(resolve => {
      let initial;
      iItem.get('stats:frames', this._id).then(frames => {
        initial = (frames === 'null' || frames === '') ? 0 : Number(frames);

        return new Promise(innerResolve => {
          setTimeout(innerResolve, 1000);
        });
      }).then( () => {
        return iItem.get('stats:frames', this._id);
      }).then(frames => {
        let final = (frames === 'null' || frames === '') ? 0 : Number(frames);
        resolve(final - initial);
      });
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
  getView(): Promise<string> {
    return new Promise(resolve => {
      iItem.get('prop:viewid', this._id).then(viewId => {
        let view = ViewTypes.MAIN;
        if (viewId === '1') {
          let preview;
          iApp.getGlobalProperty('preview_editor_opened').then(result => {
            preview = result;
            view = preview === '1' ? ViewTypes.PREVIEW : ViewTypes.THUMBNAIL;
            resolve(view);
          })
        } else {
          resolve(view);
        }
      });
    })
  }

  /**
   * return: Promise<number>
   *
   * Get (1-indexed) Scene ID where the source is loaded
   *
   * #### Usage
   *
   * ```javascript
   * source.getSceneId().then(function(id) {
   *   // The rest of your code here
   * });
   * ```
   */
  getSceneId(): Promise<number> {
    return new Promise(resolve => {
      if (String(this._sceneId) === 'i12') {
        resolve('i12')
      } else {
        resolve(Number(this._sceneId) + 1);
      }
    });
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
   * param: (options: {linked?:<boolean>, scene?:<Scene> })
   * ```
   * return: Promise<Item>
   * ```
   * Duplicate an item into the current scene or to a specified scene as
   * Linked or Unlinked.
   *
   * Linked items would generally have a single source, and any changes in the
   * property of an item would be applied to all linked items.
   *
   *  *Chainable*
   *
   * #### Usage
   * ```javascript
   * // item pertains to an actual Item instance
   * // Sample 1
   * item.duplicate() // duplicate selected item to the current scene as unlinked
   *```
   * Duplicate the selected item to a specific scene and set it to be linked to
   * a single source with the original item.
   * ```javascript
   * // Sample 2
   * var toScene = xjs.Scene.getById(2)
   * item.duplicate({linked:true, scene:toScene})
   *
   * ```
   */
  duplicate(options?: { linked?: boolean, scene?: Scene }): Promise<Item> {
    return new Promise((resolve, reject) => {
      if(versionCompare(getVersion())
        .is
        .lessThan(globalsrcMinVersion)) {
        iApp.callFunc('additem', this.toXML().toString()).then(() => {
          resolve(this)
        })
      } else {
        if(options){
          if(options.linked) {
            iItem.set('prop:keeploaded', '1', this._id)
          }
          if(options.scene !== undefined && options.linked !== undefined) {
            if(options.scene instanceof Scene) {
              options.scene.getSceneNumber().then((id) => {
                iApp.callFunc(`link:${options.linked ? 1 : 0}|s:${id}|additem`,
                this.toXML().toString())
                  .then(() => {
                  resolve(this);
                });
              })
            } else {
              reject(Error('Invalid parameters. Accepted format is "(options: {linked?:<boolean>, scene?:<Scene>})"'));
            }
          } else if(options.linked === undefined) {
            if(options.scene instanceof Scene) {
              options.scene.getSceneNumber().then((id) => {
                iApp.callFunc(`link:0|s:${id}|additem`,
                  this.toXML().toString())
                  .then(() => {
                  resolve(this);
                });
              })
            } else {
              reject(Error('Invalid parameters. Accepted format is:: "(options: {linked?:<boolean>, scene?:<Scene>})"'));
            }
          } else if(options.scene === undefined) {
            iApp.callFunc(`link:${options.linked ? 1 : 0}|s:${this._sceneId}|additem`,
            this.toXML().toString())
              .then(() => {
              resolve(this);
            });
          }
        } else {
          iApp.callFunc('link:0|additem', this.toXML().toString())
              .then(() => {
              resolve(this);
            });
        }
      }
    });
  }

  /**
   * return: Promise<Item>
   *
   * Unlinks selected item.
   *
   * Unlinks an item to the source of other linked items and renders its
   * own source.
   *
   * #### Usage
   * ```javascript
   * item.unlink()
   * ```
   *
   * Note: Once you unlink an Item, there's still no method to reverse the
   * process.
   *
   */
  unlink(): Promise<Item> {
    return new Promise(resolve => {
      iItem.set('prop:globalsrc', '0', this._id)
        .then(() => {
        resolve(this)
      })
    })
  }

  /**
   * return: Promise<boolean>
   *
   * Removes selected item
   *
   * #### Usage
   * ```javascript
   * item.remove()
   * ```
   */
  remove(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.set('remove', '', this._id)
        .then(() => {
        resolve(true)
      })
    })
  }

  /** See: {@link #core/Source#getItemList getItemList} */
  getItemList: () => Promise<Item[]>

  /**
   * return: Promise<Source>
   *
   * Gets the Source of an item, linked items would only have 1 source.
   *
   * *Chainable*
   *
   * #### Usage
   * ```javascript
   * item.getSource().then(function(source) {
   *   //Manipulate source here
   *   source.setName('New Name')
   * })
   * ```
   */
  getSource(): Promise<Source> {
    return new Promise((resolve, reject) => {
      iItem.get('config', this._id)
      .then(config => {
        let item = JXON.parse(config);
        let type = Number(item['type']);
        if (type === ItemTypes.GAMESOURCE) {
          resolve(new GameSource(item));
        } else if ((type === ItemTypes.HTML || type === ItemTypes.FILE) &&
          item['name'].indexOf('Video Playlist') === 0 &&
          item['FilePlaylist'] !== '') {
          resolve(new VideoPlaylistSource(item));
        } else if (type === ItemTypes.HTML) {
          resolve(new HtmlSource(item));
        } else if (type === ItemTypes.SCREEN) {
          resolve(new ScreenSource(item));
        } else if (type === ItemTypes.BITMAP ||
          type === ItemTypes.FILE &&
          /\.gif$/.test(item['item'])) {
          resolve(new ImageSource(item));
        } else if (type === ItemTypes.FILE &&
            /\.(gif|xbs)$/.test(item['item']) === false &&
            /^(rtsp|rtmp):\/\//.test(item['item']) === false &&
            new RegExp(MediaTypes.join('|')).test(item['item']) === true) {
          resolve(new MediaSource(item));
        } else if (Number(item['type']) === ItemTypes.LIVE &&
          item['item'].indexOf(
            '{33D9A762-90C8-11D0-BD43-00A0C911CE86}') === -1) {
          resolve(new CameraSource(item));
        } else if (Number(item['type']) === ItemTypes.LIVE &&
          item['item'].indexOf(
            '{33D9A762-90C8-11D0-BD43-00A0C911CE86}') !== -1) {
          resolve(new AudioSource(item));
        } else if (Number(item['type']) === ItemTypes.FLASHFILE) {
          resolve(new FlashSource(item));
        } else {
          resolve(new Source(item));
        }
      }).catch(err => {
        reject(err);
      });
    })
  }

  // ItemLayout

  /**
   * See: {@link #core/IItemLayout#bringForward bringForward}
   */
  bringForward: () => Promise<Item>;

  /**
   * See: {@link #core/IItemLayout#bringToFront bringToFront}
   */
  bringToFront: () => Promise<Item>;

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
   * See: {@link #core/IItemLayout#sendBackward sendBackward}
   */
  sendBackward: () => Promise<Item>;

  /**
   * See: {@link #core/IItemLayout#sendToBack sendToBack}
   */
  sendToBack: () => Promise<Item>;

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
   * See: {@link #core/Source#setName setName}
   */
  setName: (value: string) => Promise<Item>

  /**
   * See: {@link #core/Source#getName getName}
   */
  getName: () => Promise<string>

  /**
   * See: {@link #core/Source#setCustomName setCustomName}
   */
  setCustomName: () => Promise<Item>

  /**
   * See: {@link #core/Source#getCustomName getCustomName}
   */
  getCustomName: ()  => Promise<string>

  /**
   * See: {@link #core/Source#getValue getValue}
   */
  getValue: () => Promise<string | XML>

  /**
   * See: {@link #core/Source#setValue setValue}
   */
  setValue: (value: string | XML) => Promise<Item>

  /**
   * See: {@link #core/Source#getKeepLoaded getKeepLoaded}
   */
  getKeepLoaded: () => Promise<boolean>

  /**
   * See: {@link #core/Source#setKeepLoaded setKeepLoaded}
   */
  setKeepLoaded: (value: boolean) => Promise<Item>

  /**
   * See: {@link #core/Source#refresh refresh}
   */
  refresh: () => Promise<Source>

  /** See: {@link #core/Source#getType getType} */
  getType: () => Promise<ItemTypes>
}

applyMixins(Item, [iSource, ItemLayout]);
