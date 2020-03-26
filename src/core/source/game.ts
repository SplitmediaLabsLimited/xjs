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

  /** See: {@link #core/ISourceGame#isSpecialOptimizationEnabled isSpecialOptimizationEnabled} */
  isSpecialOptimizationEnabled: () => Promise<boolean>

  /** See: {@link #core/ISourceGame#setSpecialOptimizationEnabled setSpecialOptimizationEnabled} */
  setSpecialOptimizationEnabled: (value: boolean) => Promise<GameSource>

  /** See: {@link #core/ISourceGame#isShowMouseEnabled isShowMouseEnabled} */
  isShowMouseEnabled: () => Promise<boolean>

  /** See: {@link #core/ISourceGame#setShowMouseEnabled setShowMouseEnabled} */
  setShowMouseEnabled: (value: boolean) => Promise<GameSource>

  /** See: {@link #core/ISourceGame#setOfflineImage setOfflineImage} */
  setOfflineImage: (path: string) => Promise<GameSource>

  /** See: {@link #core/ISourceGame#getOfflineImage getOfflineImage} */
  getOfflineImage:() => Promise<string>

  /** See: {@link #core/ISourceGame#isTransparent isTransparent} */
  isTransparent:() => Promise<boolean>

  /** See: {@link #core/ISourceGame#setTransparent setTransparent} */
  setTransparent:(value: boolean) => Promise<GameSource>

  /** See: {@link #core/ISourceGame#getGameFPSCap getGameFPSCap} */
  getGameFPSCap:() => Promise<number>

  /** See: {@link #core/ISourceGame#setGameFPSCap setGameFPSCap} */
  setGameFPSCap:(fps: number) => Promise<GameSource>
}
applyMixins(GameSource, [iSourceGame])