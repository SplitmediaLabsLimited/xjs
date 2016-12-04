/// <reference path="../../../defs/es6-promise.d.ts" />

import {applyMixins} from '../../internal/util/mixin';
import {Source} from '../source/source';
import {Item as iItem} from '../../internal/item';
import {Rectangle} from '../../util/rectangle';
import {iSourceGame, ISourceGame} from './igame';

/**
 * An GameSource represents an object of an item on the stage.
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