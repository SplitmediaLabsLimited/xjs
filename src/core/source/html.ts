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
   * See: {@link #core/ISourceHtml#call call}
   */
  call: () => Promise<HtmlSource>

  /**
   * See: {@link #core/ISourceHtml#getURL getURL}
   */
  getURL: () => Promise<string>

  /**
   * See: {@link #core/ISourceHtml#setURL setURL}
   */
  setURL: () => Promise<HtmlSource>

  /**
   * See: {@link #core/ISourceHtml#isBrowserTransparent isBrowserTransparent}
   */
  isBrowserTransparent: () => Promise<boolean>

  /**
   * See: {@link #core/ISourceHtml#enableBrowserTransparency enableBrowserTransparency}
   */
  enableBrowserTransparency: (value: boolean) => Promise<HtmlSource>

  /**
   * See: {@link #core/ISourceHtml#isBrowser60FPS isBrowser60FPS}
   */
  isBrowser60FPS: () => Promise<boolean>

  /**
   * See: {@link #core/ISourceHtml#enableBrowser60FPS enableBrowser60FPS}
   */
  enableBrowser60FPS: (value: boolean) => Promise<HtmlSource>

  /**
   * See: {@link #core/ISourceHtml#getBrowserCustomSize getBrowserCustomSize}
   */
  getBrowserCustomSize: () => Promise<Rectangle>

  /**
   * See: {@link #core/ISourceHtml#setBrowserCustomSize setBrowserCustomSize}
   */
  setBrowserCustomSize: (value: Rectangle) => Promise<HtmlSource>

  /**
   * See: {@link #core/ISourceHtml#getAllowRightClick getAllowRightClick}
   */
  getAllowRightClick: () => Promise<boolean>

  /**
   * See: {@link #core/ISourceHtml#setAllowRightClick setAllowRightClick}
   */
  setAllowRightClick: (value: boolean) => Promise<HtmlSource>

  /**
   * See: {@link #core/ISourceHtml#getBrowserJS getBrowserJS}
   */
  getBrowserJS: () => Promise<string>

  /**
   * See: {@link #core/ISourceHtml#setBrowserJS setBrowserJS}
   */
  setBrowserJS: () => Promise<HtmlSource>

  /**
   * See: {@link #core/ISourceHtml#isBrowserJSEnabled isBrowserJSEnabled}
   */
  isBrowserJSEnabled: () => Promise<boolean>

  /**
   * See: {@link #core/ISourceHtml#enableBrowserJS enableBrowserJS}
   */
  enableBrowserJS: (value: boolean) => Promise<HtmlSource>

  /**
   * See: {@link #core/ISourceHtml#getCustomCSS getCustomCSS}
   */
  getCustomCSS: () => Promise<string>

  /**
   * See: {@link #core/ISourceHtml#setCustomCSS setCustomCSS}
   */
  setCustomCSS: (value: string) => Promise<HtmlSource>

  /**
   * See: {@link #core/ISourceHtml#isCustomCSSEnabled isCustomCSSEnabled}
   */
  isCustomCSSEnabled: () => Promise<boolean>

  /**
   * See: {@link #core/ISourceHtml#enableCustomCSS enableCustomCSS}
   */
  enableCustomCSS: (value: boolean) => Promise<HtmlSource>

  /**
   * See: {@link #core/ISourceHtml#isBrowserOptimized isBrowserOptimized}
   */
  isBrowserOptimized: () => Promise<boolean>
  
  /**
   * See: {@link #core/ISourceHtml#getBrowserLoadStatus getBrowserLoadStatus}
   */
  getBrowserLoadStatus: () => Promise<string>

  /**
   * See: {@link #core/ISourceHtml#isReloadOnShowEnabled isReloadOnShowEnabled}
   */
  isReloadOnShowEnabled: () => Promise<boolean>

  /**
   * See: {@link #core/ISourceHtml#enableReloadOnShow enableReloadOnShow}
   */
  enableReloadOnShow: (value: boolean) => Promise<HtmlSource>

  /**
   * See: {@link #core/ISourceHtml#isReloadOnSceneEnter isReloadOnSceneEnter}
   */
  isReloadOnSceneEnter: () => Promise<boolean>

  /**
   * See: {@link #core/ISourceHtml#enableReloadOnSceneEnter enableReloadOnSceneEnter}
   */
  enableReloadOnSceneEnter: (value: boolean) => Promise<HtmlSource>

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

  /** See: {@link #core/IAudio#getVolume getVolume} */
  getVolume: () => Promise<number>;

  /** See: {@link #core/IAudio#isMute isMute} */
  isMute: () => Promise<boolean>;

  /** See: {@link #core/IAudio#isAutoMute isAutoMute} */
  isAutoMute: () => Promise<boolean>;

  /** See: {@link #core/IAudio#setVolume setVolume} */
  setVolume: (value: number) => Promise<HtmlSource>;

  /** See: {@link #core/IAudio#setMute setMute} */
  setMute: (value: boolean) => Promise<HtmlSource>;

  /** See: {@link #core/IAudio#setAutoMute setAutoMute} */
  setAutoMute: (value: boolean) => Promise<HtmlSource>;

  /** See: {@link #core/IAudio#isStreamOnlyAudio isStreamOnlyAudio} */
  isStreamOnlyAudio: () => Promise<boolean>;

  /** See: {@link #core/IAudio#setStreamOnlyAudio setStreamOnlyAudio} */
  setStreamOnlyAudio: (value: boolean) => Promise<HtmlSource>;

  /** See: {@link #core/IAudio#isAudioAvailable isAudioAvailable} */
  isAudioAvailable: () => Promise<boolean>;
}

applyMixins(HtmlSource, [iSourceHtml, SourceConfigurable, Audio])