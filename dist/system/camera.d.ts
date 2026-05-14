import { JSON as JXON } from '../internal/util/json';
import { XML } from '../internal/util/xml';
import { Addable } from './iaddable';
import { Scene } from '../core/scene';
/**
 * The CameraDevice Class is the object returned by
 * {@link #system/System System Class} getCameraDevices method. It provides
 * you with methods to fetch the Camera Device's id, name, and to add it as
 * a source in the current scene.
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 * var System = XJS.System;
 *
 * System.getCameraDevices().then(function(cameras) {
 *   for (var i in cameras) {
 *     xml = cameras[i].toXML();
 *     // do something with the XML here
 *   }
 * });
 * ```
 */
export declare class CameraDevice implements Addable {
    private _id;
    private _name;
    constructor(props?: {});
    /**
     * return: string
     *
     * Get the ID of the device. The ID of the device is based on the `disp`
     * attribute of the devices XML
     *
     * #### Usage
     *
     * ```javascript
     * var cameraID = device.getId();
     * ```
     */
    getId(): string;
    /**
     * return: string
     *
     * Get the Name of the device.
     *
     * #### Usage
     *
     * ```javascript
     * var cameraName = device.getName();
     * ```
     */
    getName(): string;
    /**
     * return: XML
     *
     * Convert the current CameraDevice object to XML
     *
     * #### Usage
     *
     * ```javascript
     * var xml = device.toXML();
     * ```
     */
    toXML(): XML;
    /**
     * param: (deviceJSON: JXON)
     * ```
     * return: CameraDevice
     * ```
     *
     * Create a CameraDevice object based on a JXON object
     *
     * #### Usage
     *
     * ```javascript
     * var camera = CameraDevice.parse(JSONObj);
     * ```
     */
    static parse(deviceJSON: JXON): CameraDevice;
    /**
     * param: (value?: number | Scene)
     * ```
     * return: Promise<any>
     * ```
     *
     * Adds this camera device to the current scene by default.
     * Accepts an optional parameter value, which, when supplied,
     * points to the scene where item will be added instead.
     * If ready config {listenToItemAdd: true} it returns item id,
     * else returns boolean.
     *
     * Note: There is yet no way to detect error responses for this action.
     */
    addToScene(value?: number | Scene): Promise<any>;
}
