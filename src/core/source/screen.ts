/// <reference path="../../../defs/es6-promise.d.ts" />

import {Source} from '../source/source';
import {applyMixins} from '../../internal/util/mixin';
import {Rectangle} from '../../util/rectangle';
import {ISourceScreen, iSourceScreen} from './iscreen';

/**
 * The ScreenSource class represents the sources of the screen device items that
 * has been added to the stage. A single source could have multiple items linked
 * into it and any changes to the source would affect all items linked to it.
 *
 * Each item is represented by the ScreenItem class.
 * See: {@link #core/ScreenItem Core/ScreenItem}
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
 *       if (sources[i] instanceof XJS.ScreenSource) {
 *         // Manipulate your screen source here
 *         sources[i].setSilenceDetectionEnabled(true);
 *       }
 *     }
 *   })
 * })
 * ```
 *
 *  All methods marked as *Chainable* resolve with the original `ScreenSource`
 *  instance.
 */
export class ScreenSource extends Source implements ISourceScreen {
  /**
   * See: {@link #core/ISourceScreen#isStickToTitle isStickToTitle}
   */
  isStickToTitle: () => Promise<boolean>

  /**
   * See: {@link #core/ISourceScreen#setStickToTitle setStickToTitle}
   */
  setStickToTitle: (value: boolean) => Promise<ScreenSource>

  /**
   * See: {@link #core/ISourceScreen#getCaptureLayered getCaptureLayered}
   */
  getCaptureLayered: () => Promise<boolean>

  /**
   * See: {@link #core/ISourceScreen#setCaptureLayered setCaptureLayered}
   */
  setCaptureLayered: (value: boolean) => Promise<ScreenSource>

  /**
   * See: {@link #core/ISourceScreen#getOptimizedCapture getOptimizedCapture}
   */
  getOptimizedCapture: () => Promise<boolean>

  /**
   * See: {@link #core/ISourceScreen#setOptimizedCapture setOptimizedCapture}
   */
  setOptimizedCapture:(value: boolean) => Promise<ScreenSource>

  /**
   * See: {@link #core/ISourceScreen#getShowMouseClicks getShowMouseClicks}
   */
  getShowMouseClicks: () => Promise<boolean>


  /**
   * See: {@link #core/ISourceScreen#setShowMouseClicks setShowMouseClicks}
   */
  setShowMouseClicks: (value: boolean) => Promise<ScreenSource>

  /**
   * See: {@link #core/ISourceScreen#getShowMouse getShowMouse}
   */
  getShowMouse: () => Promise<boolean>

  /**
   * See: {@link #core/ISourceScreen#setShowMouse setShowMouse}
   */
  setShowMouse: (value: boolean) => Promise<ScreenSource>

  /**
   * See: {@link #core/ISourceScreen#getCaptureArea getCaptureArea}
   */
   getCaptureArea: () => Promise<Rectangle>

  /**
   * See: {@link #core/ISourceScreen#setCaptureArea setCaptureArea}
   */
  setCaptureArea: (dimension: Rectangle) => Promise<ScreenSource>

  /**
   * See: {@link #core/ISourceScreen#isClientArea isClientArea}
   */
  isClientArea: () => Promise<boolean>

  /**
   * See: {@link #core/ISourceScreen#setClientArea setClientArea}
   */
  setClientArea: (value: boolean) => Promise<ScreenSource>
}

applyMixins(ScreenSource, [iSourceScreen])