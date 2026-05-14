import { Rectangle } from '../../util/rectangle';
import { EventEmitter } from '../../util/eventemitter';
import { XML } from '../../internal/util/xml';
import { Scene } from '../scene';
import { IItemLayout } from './ilayout';
import { ISource, ItemTypes } from '../source/isource';
import { Source } from '../source/source';
/**
 * Used by items to determine the its view type.
 *
 * Check `getView()` method of {@link #core/Item#getView Core/Item}
 */
export declare enum ViewTypes {
    MAIN = 0,
    PREVIEW = 1,
    THUMBNAIL = 2
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
export declare class Item extends Source implements IItemLayout, ISource {
    static _emitter: EventEmitter;
    static _subscriptions: any[];
    constructor(props?: {});
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
    on(event: string, handler: Function): void;
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
    off(event: string, handler: Function): void;
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
    static getItemList(): Promise<Item[]>;
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
    getId: () => Promise<string>;
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
    getFPS(): Promise<number>;
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
    getView(): Promise<string>;
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
    getSceneId(): Promise<number>;
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
    toXML(): XML;
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
    duplicate(options?: {
        linked?: boolean;
        scene?: number | Scene;
    }): Promise<Item>;
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
    unlink(): Promise<Item>;
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
    remove(): Promise<boolean>;
    /** See: {@link #core/Source#getItemList getItemList} */
    getItemList: () => Promise<Item[]>;
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
    getSource(): Promise<Source>;
    /**
     * return: Promise<boolean>
     *
     * Checks if item is part of a group
     *
     * #### Usage
     * ```javascript
     * item.isChildItem()
     * .then(function(isChild) {
     *   console.log(isChild);
     * });
     * ```
     */
    isChildItem(): Promise<boolean>;
    /**
     * return: Promise<boolean>
     *
     * Get the GroupItem that contains this item.
     * This rejects if item is not a child item or non-existent
     *
     * #### Usage
     * ```javascript
     * item.getParentItem()
     * .then(function(parentItem) {
     *   console.log(parentItem);
     * });
     * ```
     */
    getParentItem(): Promise<Item>;
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
    /**
     * See: {@link #core/Source#setName setName}
     */
    setName: (value: string) => Promise<Item>;
    /**
     * See: {@link #core/Source#getName getName}
     */
    getName: () => Promise<string>;
    /**
     * See: {@link #core/Source#setCustomName setCustomName}
     */
    setCustomName: () => Promise<Item>;
    /**
     * See: {@link #core/Source#getCustomName getCustomName}
     */
    getCustomName: () => Promise<string>;
    /**
     * See: {@link #core/Source#getValue getValue}
     */
    getValue: () => Promise<string | XML>;
    /**
     * See: {@link #core/Source#setValue setValue}
     */
    setValue: (value: string | XML) => Promise<Item>;
    /**
     * See: {@link #core/Source#getKeepLoaded getKeepLoaded}
     */
    getKeepLoaded: () => Promise<boolean>;
    /**
     * See: {@link #core/Source#setKeepLoaded setKeepLoaded}
     */
    setKeepLoaded: (value: boolean) => Promise<Item>;
    /**
     * See: {@link #core/Source#refresh refresh}
     */
    refresh: () => Promise<Source>;
    /** See: {@link #core/Source#getType getType} */
    getType: () => Promise<ItemTypes>;
}
