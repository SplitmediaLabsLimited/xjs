/// <reference path="../../../defs/es6-promise.d.ts" />

import {Source} from '../source/source';
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
   * return: Promise<boolean>
   *
   * Checks if the Screen Capture Item captures a window based on
   * the window's title.
   */
  isStickToTitle: () => Promise<boolean>

  /**
   * param: Promise<boolean>
   * ```
   * return: Promise<ScreenSource>
   * ```
   *
   * Set the Screen Capture to capture the window based on the window title.
   * Useful when capturing programs with multiple tabs, for you to only
   * capture a particular tab.
   */
  setStickToTitle: (value: boolean) => Promise<ScreenSource>

  /**
   * return: Promise<boolean>
   *
   * Checks if the Screen Capture layered window is selected.
   */
  getCaptureLayered: () => Promise<boolean>

  /**
   * param: (value: boolean)
   * ```
   * return: Promise<ScreenSource>
   * ```
   *
   * Sets the Screen Capture Layered window
   */
  setCaptureLayered: (value: boolean) => Promise<ScreenSource>

  /**
   * return: Promise<boolean>
   *
   * Checks if the Exclusive Window capture is selected.
   */
  getOptimizedCapture: () => Promise<boolean>

  /**
   * param: (value: boolean)
   * ```
   * return: Promise<ScreenSource>
   * ```
   *
   * Sets the Exclusive Window capture.
   */
  setOptimizedCapture:(value: boolean) => Promise<ScreenSource>

  /**
   * return: Promise<boolean>
   *
   * Checks if the Show mouse clicks is selected.
   *
   * ShowMouseClicks determine if you would want to display the clicks
   * you're doing inside your screen captured area.
   */
  getShowMouseClicks: () => Promise<boolean>


  /**
   * param: (value: boolean)
   * ```
   * return: Promise<ScreenSource>
   * ```
   *
   * Sets the Show mouse clicks.
   *
   * ShowMouseClicks determine if you would want to display the clicks
   * you're doing inside your screen captured area.
   */
  setShowMouseClicks: (value: boolean) => Promise<ScreenSource>

  /**
   * return: Promise<boolean>
   *
   * Checks if the Show mouse is selected.
   *
   * ShowMouse determine if you would want to display the mouse on your
   * screen captured area.
   */
  getShowMouse: () => Promise<boolean>

  /**
   * param: (value: boolean)
   * ```
   * return: Promise<ScreenSource>
   * ```
   *
   * Sets the Show Mouse.
   *
   * ShowMouse determine if you would want to display the mouse on your
   * screen captured area.
   */
  setShowMouse: (value: boolean) => Promise<ScreenSource>

  /**
   * return: Promise<Rectangle>
   *
   * Gets the Capture Area of the Screen Capture Item. Returns a Rectangle
   * object.
   *
   * See also: {@link #util/Rectangle Util/Rectangle}
   */
   getCaptureArea: () => Promise<Rectangle>

  /**
   * param: Promise<Rectangle>
   * ```
   * return: Promise<ScreenSource>
   * ```
   *
   * Sets the Window Capture Area of the Screen Capture Item.
   *
   * *Chainable.*
   *
   * See also: {@link #util/Rectangle Util/Rectangle}
   */
  setCaptureArea: (dimension: Rectangle) => Promise<ScreenSource>

  /**
   * return: Promise<boolean>
   *
   * Checks if the Screen Capture Item only captures the
   * Client area (does not capture the title bar, menu bar, window border, etc.)
   */
  isClientArea: () => Promise<boolean>

  /**
   * param: Promise<boolean>
   * ```
   * return: Promise<ScreenSource>
   * ```
   *
   * Set the Screen Capture to capture the Client area only or include
   * the titlebar, menu bar, window border, etc.
   */
  setClientArea: (value: boolean) => Promise<ScreenSource>
}
