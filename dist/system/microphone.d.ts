import { JSON as JXON } from '../internal/util/json';
import { XML } from '../internal/util/xml';
import { Addable } from './iaddable';
import { Scene } from '../core/scene';
/**
 * The MicrophoneDevice class provides you with methods to add a microphone
 * device as a source on the stage.
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 * var System = XJS.System;
 *
 * System.getMicrophones().then(function(microphones) {
 *  for (var i in microphones) {
 *    microphones[i].addToScene();
 *  }
 * });
 * ```
 */
export declare class MicrophoneDevice implements Addable {
    private _disp;
    private _name;
    /**
     * param: (deviceJXON: JXON)
     * ```
     * return MicrophoneDevice
     * ```
     * Create a MicrophoneDevice onject based on a JXON object
     *
     */
    static parse(jxon: JXON): MicrophoneDevice;
    /**
     * return: string
     *
     * Gets the display ID
     *
     * #### Usage
     *
     * ```javascript
     * var micDisplayId = device.getDisplayId();
     * ```
     */
    getDisplayId(): string;
    /**
     * return: string
     *
     * Gets the device name
     *
     * #### Usage
     *
     * ```javascript
     * var micName = device.getName();
     * ```
     */
    getName(): string;
    /**
     * return: XML
     *
     * Converts Microphone object into an XML object
     *
     * #### Usage
     *
     * ```javascript
     * var microphoneXML = microphone.toXML();
     * ```
     */
    toXML(): XML;
    /**
     * param: (value?: number | Scene)
     * ```
     * return: Promise<any>
     * ```
     *
     * Adds this microphone device to the current scene by default.
     * Accepts an optional parameter value, which, when supplied,
     * points to the scene where item will be added instead.
     * If ready config {listenToItemAdd: true} it returns item id,
     * else returns boolean.
     *
     * Note: There is yet no way to detect error responses for this action.
     */
    addToScene(value?: number | Scene): Promise<any>;
}
