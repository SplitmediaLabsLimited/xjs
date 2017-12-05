/// <reference path="../../../defs/es6-promise.d.ts" />

import {applyMixins} from '../../internal/util/mixin';
import {Source} from '../source/source';
import {Item as iItem} from '../../internal/item';
import {Rectangle} from '../../util/rectangle';
import {iSourceGame, ISourceGame} from './igame';

/**
 * The GameSource class represents the sources of the game items that
 * has been added to the stage. A single source could have multiple items linked
 * into it and any changes to the source would affect all items linked to it.
 *
 * Each item is represented by the GameItem class.
 * See: {@link #core/GameItem Core/GameItem}
 *
 * Inherits from: {@link #core/Source Core/Source}
 *
 * ### Basic Usage
 *
 * ```javascript
 * var xjs = require('xjs');
 *
 * xjs.Scene.getActiveScene().then(function(scene) {
 *   scene.getSources().then(function(sources) {
 *   for (var i in sources) {
 *       if (sources[i] instanceof XJS.GameSource) {
 *         // Manipulate your audio device source here
 *         sources[i].setSilenceDetectionEnabled(true);
 *       }
 *     }
 *   })
 * })
 * ```
 *
 * All methods marked as *Chainable* resolve with the original `GameSource`
 * instance.
 */
export class GameSource extends Source implements ISourceGame{
  //iSourceGame

  /**
   * param?: value<boolean>
   * ```
   * return: Promise<boolean|GameSource>
   * ```
   *
   * Check/Set if Game Special Optimization is currently enabled or not
   */
  specialOptimization:(value?: boolean) => Promise<boolean|GameSource>

  /**
   * param?: value<boolean>
   * ```
   * return: Promise<boolean|GameSource>
   * ```
   *
   * Check/Set if Show Mouse is currently enabled or not
   */
  showMouse:(value?: boolean) => Promise<boolean|GameSource>

  /**
   * param: path<string>
   * ```
   * return: Promise<string|GameSource>
   * ```
   *
   * Get/Set the offline image of a game source
   *
   * *Chainable.*
   */
  offlineImage:(path?: string) => Promise<string|GameSource>
}
applyMixins(GameSource, [iSourceGame])