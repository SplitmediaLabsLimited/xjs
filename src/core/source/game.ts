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
   * Set the offline image of a game source
   *
   * *Chainable.*
   */
  setOfflineImage: (path: string) => Promise<GameSource>

  /**
   * return: Promise<string>
   *
   * Get the offline image of a game source
   */
  getOfflineImage:() => Promise<string>

  /**
   * return: Promise<boolean>
   *
   * Get the transparency of a game item.
   * Please note that game transparency only works if Game Special Optimization is also enabled.
   */
  isTransparent:() => Promise<boolean>

  /**
   * param: value<boolean>
   *
   * Set the transparency of a game item
   * Please note that game transparency only works if Game Special Optimization is also enabled.
   *
   * *Chainable.*
   */
  setTransparent:(value: boolean) => Promise<GameSource>

  /**
   * return: Promise<number>
   *
   * Get the maximum number of frames per second the game is being limited to by XBC
   */
  getGameFPSCap:() => Promise<number>

  /**
   * param: path<string>
   *
   * Set the maximum number of frames per second the game is being limited to by XBC.
   * Accepter values are either 0 (disable capping) or within the range of 24 to 300 fps
   *
   * *Chainable.*
   */
  setGameFPSCap:(fps: number) => Promise<GameSource>
}
applyMixins(GameSource, [iSourceGame])