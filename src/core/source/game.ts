/// <reference path="../../../defs/es6-promise.d.ts" />

import {GameItem} from '../items/game';


/**
 * The GameSource Class provides methods specifically used for game sources and
 * also methods that is shared between Source Classes. The
 * {@link #core/Scene Scene} class' getSources method would automatically return a
 * GameSource object if there's a game source on the specified scene.
 *
 * Inherits from: {@link #core/Source Core/Source}
 *
 * Implements: {@link #core/IItemChroma Core/IItemChroma},
 * {@link #core/IItemColor Core/IItemColor},
 * {@link #core/IItemLayout Core/IItemLayout},
 * {@link #core/IItemTransition Core/IItemTransition}
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 *
 * XJS.Scene.getActiveScene().then(function(scene) {
 *   scene.getSources().then(function(sources) {
 *     for (var i in sources) {
 *       if (sources[i] instanceof XJS.GameSource) {
 *         // Manipulate your game source here
 *         sources[i].setOfflineImage(path); // just an example here
 *       }
 *     }
 *   });
 * });
 * ```
 *
 *  All methods marked as *Chainable* resolve with the original `GameSource`
 *  instance.
 */
export class GameSource extends GameItem{
  
}