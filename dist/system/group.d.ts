import { Addable } from './iaddable';
import { Item } from '../core/items/item';
import { Scene } from '../core/scene';
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
export declare class Group implements Addable {
    private _items;
    constructor(itemArray?: string[] | Item[]);
    toStringArray(): string[];
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
    addToScene(value?: number | Scene): Promise<any>;
}
