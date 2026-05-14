import { Addable } from './iaddable';
import { Scene } from '../core/scene';
/**
 *  Class for adding files (such as images and media)
 *  from your file system to the stage.
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 * var File = XJS.File;
 *
 * var filePromise = new File('C:\\Users\\Public\\Music\\song.mp3').addToScene();
 * ```
 */
export declare class File implements Addable {
    private _path;
    /**
     *  param: (file: string)
     *
     *  Creates a File object pertaining to a file's full path.
     */
    constructor(file: string);
    /**
     * param: (value?: number | Scene)
     * ```
     * return: Promise<any>
     * ```
     *
     * Adds this file to the current scene by default.
     * Accepts an optional parameter value, which, when supplied,
     * points to the scene where item will be added instead.
     * If ready config {listenToItemAdd: true} it returns item id,
     * else returns boolean.
     *
     * Note: There is yet no way to detect error responses for this action.
     */
    addToScene(value?: number | Scene): Promise<any>;
}
