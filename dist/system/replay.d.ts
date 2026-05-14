import { Addable } from './iaddable';
import { Scene } from '../core/scene';
import { XML } from '../internal/util/xml';
/**
 *  The Class for combining several Items into a group.
 *  This can be initialized with an optional object parameter,
 *  which may contain the following:
 *    * buffer - the replay time, which ranges from 1-120 seconds. Default is 10.
 *    * channelName - the name of the channel where the replay will come from. Default is auto.
 *    * hotkey - the numerical equivalent of the keyboard combination to trigger the replay. Default is 0.
 *             - This allots for the modifiers shift(65536), ctrl(131072), and alt(262144) keys
 *             - Sample computation for Ctrl + Shift + K = (keycode.which | 131072) | 65536 = 75 | 131072 | 65536 = 196683
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 * var Replay = XJS.Replay;
 * xjs.Output.getOutputList()
 * .then(function(outputs) {
 *   return outputs[0].getName();
 * }).then(function(name) {
 *   var newReplay = new Replay({
 *     buffer: 20,
 *     channelName: name
 *   });
 *   newReplay.addToScene();
 * })
 *
 * ```
 */
export declare class Replay implements Addable {
    private _buffer;
    private _channelName;
    private _hotkey;
    private _propName;
    constructor(replayOptions?: Object);
    toXML(): XML;
    /**
     * param: (value?: number | Scene)
     * ```
     * return: Promise<any>
     * ```
     *
     * Adds this replay object to the current scene by default.
     * Accepts an optional parameter value, which, when supplied,
     * points to the scene where item will be added instead.
     * If ready config {listenToItemAdd: true} it returns item id,
     * else returns boolean.
     *
     * Note: There is yet no way to detect error responses for this action.
     */
    addToScene(value?: number | Scene): Promise<any>;
}
