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
   * param?: Promise<boolean>
   * ```
   * return: Promise<boolean|ScreenSource>
   * ```
   *
   * Get/Set the Screen Capture to capture the window based on the window title.
   * Useful when capturing programs with multiple tabs, for you to only
   * capture a particular tab.
   */
  stickToTitle: (value?: boolean) => Promise<boolean|ScreenSource>

  /**
   * param?: (value: boolean)
   * ```
   * return: Promise<boolean|ScreenSource>
   * ```
   *
   * Get/Set the Screen Capture Layered window
   */
  captureLayered: (value?: boolean) => Promise<boolean|ScreenSource>

  /**
   * param?: (value: boolean)
   * ```
   * return: Promise<boolean|ScreenSource>
   * ```
   *
   * Get/Set the Exclusive Window capture.
   */
  optimizedCapture: (value?: boolean) => Promise<boolean|ScreenSource>


  /**
   * param?: (value: boolean)
   * ```
   * return: Promise<boolean|ScreenSource>
   * ```
   *
   * Get/Set the Show mouse clicks.
   *
   * ShowMouseClicks determine if you would want to display the clicks
   * you're doing inside your screen captured area.
   */
  showMouseClicks: (value?: boolean) => Promise<boolean|ScreenSource>

  /**
   * param?: (value: boolean)
   * ```
   * return: Promise<boolean|ScreenSource>
   * ```
   *
   * Get/Set the Show Mouse.
   *
   * ShowMouse determine if you would want to display the mouse on your
   * screen captured area.
   */
  showMouse: (value?: boolean) => Promise<boolean|ScreenSource>

  /**
   * param?: Promise<Rectangle>
   * ```
   * return: Promise<Rectangle|ScreenSource>
   * ```
   *
   * Get/Set the Window Capture Area of the Screen Capture Item.
   *
   * *Chainable.*
   *
   * See also: {@link #util/Rectangle Util/Rectangle}
   */
  captureArea: (dimension?: Rectangle) => Promise<Rectangle|ScreenSource>

  /**
   * param?: Promise<boolean>
   * ```
   * return: Promise<boolean|ScreenSource>
   * ```
   *
   * Get/Set the Screen Capture to capture the Client area only or include
   * the titlebar, menu bar, window border, etc.
   */
  clientAreaOnly: (value?: boolean) => Promise<boolean|ScreenSource>
}

applyMixins(ScreenSource, [iSourceScreen])