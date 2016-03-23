/// <reference path="../../../defs/es6-promise.d.ts" />


import {CameraItem} from '../items/camera';


/**
 * The CameraSource Class provides methods specifically used for camera sources and
 * also methods that are shared between Source Classes. The
 * {@link #core/Scene Scene} class' getSources method would automatically return a
 * CameraSource object if there's a camera source on the specified scene.
 *
 * Inherits from: {@link #core/Source Core/Source}
 *
 * Implements: {@link #core/IItemChroma Core/IItemChroma},
 * {@link #core/IItemColor Core/IItemColor},
 * {@link #core/IItemLayout Core/IItemLayout},
 * {@link #core/IItemTransition Core/IItemTransition},
 * {@link #core/IItemAudio Core/IItemAudio}
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 *
 * XJS.Scene.getActiveScene().then(function(scene) {
 *   scene.getSources().then(function(sources) {
 *     for (var i in sources) {
 *       if (sources[i] instanceof XJS.CameraSource) {
 *         // Manipulate your camera sources here
 *         sources[i].getDeviceId().then(function(id) {
 *           // Do something with the id
 *         });
 *       }
 *     }
 *   });
 * });
 * ```
 *
 *  All methods marked as *Chainable* resolve with the original `CameraSource`
 *  instance.
 */
export class CameraSource extends CameraItem{
}

