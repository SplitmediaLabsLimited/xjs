import { Addable } from './iaddable';
import { XML } from '../internal/util/xml';
import { Scene } from '../core/scene';
/**
 *  Special class for adding a video playlist to the stage.
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 * var VideoPlaylist = XJS.VideoPlaylist;
 *
 * var vids = new VideoPlaylist(['C:\\Users\\Public\\Music\\video1.mp4',
      'C:\\Users\\Public\\Music\\video2.mp4']).addToScene();
 * ```
 */
export declare class VideoPlaylist implements Addable {
    private _playlist;
    private _id;
    private _fileplaylist;
    private _testJSON;
    /**
     *  param: (files: string[])
     *
     *  Creates a VideoPlaylist object for several video files.
     */
    constructor(items: string[]);
    /**
     * return: XML
     *
     * Creates an XML object with the playlist properties. This method is used
     * internally for the `addToScene` method.
     */
    toXML(): Promise<XML>;
    /**
     * param: (value?: number | Scene)
     * ```
     *  return: Promise<any>
     * ```
     *
     * Adds the prepared video playlist to the current scene by default.
     * Accepts an optional parameter value, which when supplied,
     * points to the scene where item will be added instead.
     * If ready config {listenToItemAdd: true} it returns item id,
     * else returns boolean.
     * This function is not available to sources.
     *
     * Note: There is yet no way to detect error responses for this action.
     */
    addToScene(value?: number | Scene): Promise<any>;
}
