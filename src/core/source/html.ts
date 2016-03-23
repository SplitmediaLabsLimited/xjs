/// <reference path="../../../defs/es6-promise.d.ts" />


import {HtmlItem} from '../items/html';

/**
 * The HtmlSource class represents a web page source. This covers both source
 * plugins and non-plugin URLs.
 *
 * Inherits from: {@link #core/Source Core/Source}
 *
 * Implements: {@link #core/IItemChroma Core/IItemChroma},
 * {@link #core/IItemColor Core/IItemColor},
 * {@link #core/IItemLayout Core/IItemLayout},
 * {@link #core/IItemTransition Core/IItemTransition},
 * {@link #core/IItemAudio Core/IItemAudio},
 * {@link #core/IItemConfigurable Core/IItemConfigurable}
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 *
 * XJS.Scene.getActiveScene().then(function(scene) {
 *   scene.getSources().then(function(sources) {
 *     for (var i in sources) {
 *       if (sources[i] instanceof XJS.HtmlSource) {
 *         // Manipulate your HTML source here
 *         sources[i].enableBrowserTransparency(true);
 *       }
 *     }
 *   });
 * });
 * ```
 *
 *  All methods marked as *Chainable* resolve with the original `HtmlSource`
 * instance. Also, any audio setting, i.e. volume, mute, stream only
 * may not be properly reflected in the source unless native browser audio support
 * is enabled. (Tools menu > General Settings > Advanced tab)
 */
export class HtmlSource extends HtmlItem{
  
}