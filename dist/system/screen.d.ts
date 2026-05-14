import { Addable } from './iaddable';
import { Scene } from '../core/scene';
/**
 * The Screen Class is the object returned by {@link #system/System System Class}
 * getAvailableScreens method. It provides you with methods to add the screen object
 * to the current scene or any scene specified or use it's static method to fire a
 * selector for you to manually select a screen/screen region to capture and add on
 * your selected scene.
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 * var System = XJS.System;
 *
 * System.getAvailableScreens().then(function(screens) {
 *  for (var i in screens) {
 *    screens[i].addToScene();
 *  }
 * });
 * ```
 */
export declare class Screen implements Addable {
    private _title;
    private _processDetail;
    private _class;
    private _hwnd;
    constructor(props?: {});
    /**
     * param: (value?: number | Scene)
     * ```
     * return: Promise<any>
     * ```
     *
     * Adds the prepared screen instance to the current screen by defualt.
     * Accpets optional parameter value, whhich when supplied, points
     * to the scene where the item will be added instead.
     * If ready config {listenToItemAdd: true} it returns item id,
     * else returns boolean.
     *
     * Note: There is yet no way to detect error responses for this action.
     */
    addToScene(value?: number | Scene): Promise<any>;
    /**
     * param: (value?: number | Scene)
     * ```
     * return: Promise<any>
     * ```
     *
     * Initializes the screen region selector crosshair
     * so user may select a desktop region or a window to add to the stage in the current scene.
     * Accepts an optional parameter value, which, when supplied,
     * points to the scene where item will be added instead.
     * If ready config {listenToItemAdd: true} it returns item id,
     * else returns boolean.
     *
     * Note: There is yet no way to detect error responses for this action.
     */
    static addToScene(value?: number | Scene): Promise<any>;
    /**
     * param: Object
     * ```
     * return Screen
     * ```
     *
     * Converts an object into a Screen object.
     *
     * #### Usage
     *
     * ```javascript
     * var XJS = require('xjs');
     * var screen = XJS.Screen.parse(jsonObj);
     * ```
     */
    static parse(screenInfo: any): Screen;
}
