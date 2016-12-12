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
 * See: {@link: #core/GameItem Core/GameItem}
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
 */
export class GameSource extends Source implements ISourceGame{
  //iSourceGame

  /**
   * return: Promise<boolean>
   *
   * Check if Game Special Optimization is currently enabled or not
   */
  isSpecialOptimizationEnabled: () => Promise<boolean>

  /**
   * param: Promise<boolean>
   *
   * Set Game Special Optimization to on or off
   *
   * *Chainable.*
   */
  setSpecialOptimizationEnabled: (value: boolean) => Promise<GameSource>

  /**
   * return: Promise<boolean>
   *
   * Check if Show Mouse is currently enabled or not
   */
  isShowMouseEnabled: () => Promise<boolean>

  /**
   * param: (value: boolean)
   *
   * Set Show Mouse in game to on or off
   *
   * *Chainable.*
   */
  setShowMouseEnabled: (value: boolean) => Promise<GameSource>

  /**
   * param: path<string>
   *
   * Set the offline image of a game item
   *
   * *Chainable.*
   */
  setOfflineImage: (path: string) => Promise<GameSource>

  /**
   * return: Promise<string>
   *
   * Get the offline image of a game item
   */
  getOfflineImage:() => Promise<string>
}
applyMixins(GameSource, [iSourceGame])