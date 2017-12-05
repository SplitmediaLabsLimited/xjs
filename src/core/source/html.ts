/// <reference path="../../../defs/es6-promise.d.ts" />

import {applyMixins} from '../../internal/util/mixin';
import {Source} from '../source/source';
import {Item as iItem} from '../../internal/item';
import {Rectangle} from '../../util/rectangle';
import {exec} from '../../internal/internal';
import {Environment} from '../environment';
import {Item} from '../items/item';
import {SourceConfigurable, ISourceConfigurable} from './iconfig';
import {IAudio, Audio} from '../source/iaudio';
import {iSourceHtml, ISourceHtml} from '../source/ihtml'

/**
 * The HtmlSource class represents the sources of the html items that
 * has been added to the stage. A single source could have multiple items linked
 * into it and any changes to the source would affect all items linked to it.
 *
 * Each item is represented by the HtmlItem class.
 * See: {@link #core/HtmlItem Core/HtmlItem}
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
 *       if (sources[i] instanceof XJS.HtmlSource) {
 *         // Manipulate your html source here
 *         sources[i].setSilenceDetectionEnabled(true);
 *       }
 *     }
 *   })
 * })
 * ```
 *
 * All methods marked as *Chainable* resolve with the original `HtmlSource`
 * instance.
 */
export class HtmlSource extends Source implements ISourceConfigurable, IAudio,
  ISourceHtml {

  //iSourceHtml

  /**
   * param: (func: string, arg: string)
   * ```
   * return: Promise<HtmlSource>
   * ```
   *
   * Allow this source to call a pre-exposed function within the HTML Source
   */
  call: () => Promise<HtmlSource>

  /**
   * param?: url<string>
   * ```
   * return: Promise<string|HtmlSource>
   * ```
   *
   * Get/Set the URL of this webpage source.
   *
   * *Chainable.*
   */
  url: (value?: string) => Promise<string|HtmlSource>

  /**
   * param?: value<boolean>
   * ```
   * return: Promise<boolean|HtmlSource>
   * ```
   *
   * Get, Enable or disable transparency of CEF browser
   *
   * *Chainable on Set.*
   */
  browserTransparency: (value?: boolean) => Promise<boolean|HtmlSource>

  /**
   * param?: value<boolean>
   * ```
   * return: Promise<boolean|HtmlSource>
   * ```
   *
   * Get, Enable or disable browser source to render up to a maximum of 60FPS
   *
   * *Chainable on Set.*
   */
  browser60FPS: (value?: boolean) => Promise<boolean|HtmlSource>

  /**
   * param?: value<Rectangle>
   * ```
   * return: Promise<Rectangle|HtmlSource>
   * ```
   *
   * Get/Set the custom browser window size for the item
   * regardless of its layout on the mixer
   *
   * *Chainable on Set.*
   *
   * See also: {@link #util/Rectangle Util/Rectangle}
   */
  browserCustomSize: (value?: Rectangle) => Promise<Rectangle|HtmlSource>

  /**
   * param?: value<boolean>
   * ```
   * return: Promise<boolean|HtmlSource>
   * ```
   *
   * Get, Allow or disallow right click events to be sent to the item. Note that
   * you can only catch right click events using `mouseup/mousedown`
   *
   * *Chainable on Set*
   *
   * #### Usage
   *
   * ```javascript
   * item.allowRightClick().then(function(allow) {
   *   // Promise resolves with the same Item instance
   * });
   * ```
   */
  allowRightClick: (value?: boolean) => Promise<boolean|HtmlSource>

  /**
   * param?: (js: string, refresh: boolean = false)
   * ```
   * return: Promise<string|HtmlSource>
   * ```
   *
   * Get/Set the javascript commands to be executed on item
   * right upon setting and on load. Optionally set second parameter
   * to true to refresh item (needed to clean previously executed JS code.)
   *
   * *Chainable on Set.*
   */
  browserJS: (value?: string) => Promise<string|HtmlSource>

  /**
   * param?: (value: boolean)
   * ```
   * return: Promise<boolean|HtmlSource>
   * ```
   *
   * Get, Enables or disables execution of the set BrowserJs upon load.
   * Note that disabling this will require item to be refreshed
   * in order to remove any BrowserJS previously executed.
   *
   * *Chainable on Set.*
   */
  browserJSEnabled:(value?: boolean) => Promise<boolean|HtmlSource>

  /**
   * param?: (value: string)
   * ```
   * return: Promise<string|HtmlSource>
   * ```
   *
   * Get/Set the custom CSS to be applied to the document upon loading
   *
   * *Chainable on Set.*
   */
  customCSS: (value?: string) => Promise<string|HtmlSource>

  /**
   * param?: (value: boolean)
   * ```
   * return: Promise<boolean|HtmlSource>
   * ```
   *
   * Get, Enables or disables application of custom CSS to the document
   *
   * *Chainable on Set.*
   */
  customCSSEnabled: (value?: boolean) => Promise<boolean|HtmlSource>

  /**
   * return: Promise<boolean>
   *
   * Gets if browser instance is optimized via surface sharing
   */
  isBrowserOptimized: () => Promise<boolean>

  // SourceConfigurable
  /**
   * See: {@link #core/ISourceConfigurable#loadConfig loadConfig}
   */
  loadConfig: () => Promise<any>;

  /**
   * See: {@link #core/ISourceConfigurable#saveConfig saveConfig}
   */
  saveConfig: (configObj: any) => Promise<HtmlSource>;

  /**
   * See: {@link #core/ISourceConfigurable#requestSaveConfig requestSaveConfig}
   */
  requestSaveConfig: (configObj: any) => Promise<HtmlSource>;

  /**
   *
   * See: {@link #core/ISourceConfigurable#applyConfig applyConfig}
   */
  applyConfig: (configObj: any) => Promise<HtmlSource>;

  // ItemAudio

  /** See: {@link #core/IAudio#volume volume} */
  volume:(value?: number)=> Promise<number|HtmlSource>

  /** See: {@link #core/IAudio#mute mute} */
  mute:(value?: boolean)=> Promise<boolean|HtmlSource>

  /** See: {@link #core/IAudio#autoMute autoMute} */
  autoMute:(value?: boolean)=> Promise<boolean|HtmlSource>

  /** See: {@link #core/IAudio#streamOnlyAudio streamOnlyAudio} */
  streamOnlyAudio:(value?: boolean)=> Promise<boolean|HtmlSource>

  /** See: {@link #core/IAudio#isAudioAvailable isAudioAvailable} */
  isAudioAvailable: () => Promise<boolean>;
}

applyMixins(HtmlSource, [iSourceHtml, SourceConfigurable, Audio])