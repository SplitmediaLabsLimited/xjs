/// <reference path="../../../defs/es6-promise.d.ts" />

import {applyMixins} from '../../internal/util/mixin';
import {Source} from '../source/source';
import {Item as iItem} from '../../internal/item';
import {Rectangle} from '../../util/rectangle';
import {exec} from '../../internal/internal';
import {Environment} from '../environment';
import {Item} from '../items/item';
import {SourceConfigurable, ISourceConfigurable} from './iconfig';
import {ISourceAudio, SourceAudio} from './iaudio';
import {iSourceHtml, ISourceHtml} from '../source/ihtml'

export class HtmlSource extends Source implements ISourceConfigurable, ISourceAudio,
  ISourceHtml {

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

  /** See: {@link #core/ISourceAudio#getVolume getVolume} */
  getVolume: () => Promise<number>;

  /** See: {@link #core/ISourceAudio#isMute isMute} */
  isMute: () => Promise<boolean>;

  /** See: {@link #core/ISourceAudio#setVolume setVolume} */
  setVolume: (value: number) => Promise<HtmlSource>;

  /** See: {@link #core/ISourceAudio#setMute setMute} */
  setMute: (value: boolean) => Promise<HtmlSource>;

  /** See: {@link #core/ISourceAudio#isStreamOnlyAudio isStreamOnlyAudio} */
  isStreamOnlyAudio: () => Promise<boolean>;

  /** See: {@link #core/ISourceAudio#setStreamOnlyAudio setStreamOnlyAudio} */
  setStreamOnlyAudio: (value: boolean) => Promise<HtmlSource>;

  /** See: {@link #core/ISourceAudio#isAudioAvailable isAudioAvailable} */
  isAudioAvailable: () => Promise<boolean>;

  //iSourceHtml
  /**
   * return: Promise<boolean>
   *
   * Check if browser is rendered transparent
   */
  isBrowserTransparent: () => Promise<boolean>

  /**
   * param: Promise<boolean>
   * ```
   * return: Promise<HtmlSource>
   * ```
   *
   * Enable or disabled transparency of CEF browser
   *
   * *Chainable.*
   */
  enableBrowserTransparency: (value: boolean) => Promise<HtmlSource>

  /**
   * return: Promise<Rectangle>
   *
   * Gets the custom browser window size (in pixels) for the item, if set,
   * regardless of its layout on the mixer. Returns a (0, 0) Rectangle if no
   * custom size has been set.
   *
   * See also: {@link #util/Rectangle Util/Rectangle}
   */
  getBrowserCustomSize: () => Promise<Rectangle>

  /**
   * param: Promise<Rectangle>
   * ```
   * return: Promise<ISourceHtml>
   * ```
   *
   * Sets the custom browser window size for the item
   * regardless of its layout on the mixer
   *
   * *Chainable.*
   *
   * See also: {@link #util/Rectangle Util/Rectangle}
   */
  setBrowserCustomSize: (value: Rectangle) => Promise<HtmlSource>

  /**
   * return: Promise<boolean>
   *
   * Check if right click events are sent to the item or not.
   *
   * #### Usage
   *
   * ```javascript
   * item.getAllowRightClick().then(function(isRightClickAllowed) {
   *   // The rest of your code here
   * });
   * ```
   */
  getAllowRightClick: () => Promise<boolean>

  /**
   * param: (value:boolean)
   * ```
   * return: Promise<Source>
   * ```
   *
   * Allow or disallow right click events to be sent to the item. Note that
   * you can only catch right click events using `mouseup/mousedown`
   *
   * *Chainable*
   *
   * #### Usage
   *
   * ```javascript
   * item.setAllowRightClick(true).then(function(item) {
   *   // Promise resolves with the same Item instance
   * });
   * ```
   */
  setAllowRightClick: (value: boolean) => Promise<HtmlSource>

  /**
   * return: Promise<string>
   *
   * Gets the javascript commands to be executed on item upon load
   */
  getBrowserJS: () => Promise<string>

  /**
   * param: (js: string, refresh: boolean = false)
   * ```
   * return: Promise<ISourceHtml>
   * ```
   *
   * Sets the javascript commands to be executed on item
   * right upon setting and on load. Optionally set second parameter
   * to true to refresh item (needed to clean previously executed JS code.)
   *
   * *Chainable.*
   */
  setBrowserJS: () => Promise<HtmlSource>

  /**
   * return: Promise<boolean>
   *
   * Gets if BrowserJS is enabled and executed on load
   */
  isBrowserJSEnabled: () => Promise<boolean>

  /**
   * param: (value: boolean)
   * ```
   * return: Promise<HtmlSource>
   * ```
   *
   * Enables or disables execution of the set BrowserJs upon load.
   * Note that disabling this will require item to be refreshed
   * in order to remove any BrowserJS previously executed.
   *
   * *Chainable.*
   */
  enableBrowserJS: (value: boolean) => Promise<HtmlSource>

  /**
   * return: Promise<string>
   *
   * Gets the custom CSS applied to the document upon loading
   */
  getCustomCSS: () => Promise<string>

  /**
   * param: (value: string)
   * ```
   * return: Promise<HtmlSource>
   * ```
   *
   * Sets the custom CSS to be applied to the document upon loading
   *
   * *Chainable.*
   */
  setCustomCSS: (value: string) => Promise<HtmlSource>

  /**
   * return: Promise<boolean>
   *
   * Gets if custom CSS is enabled and applied to the document on load
   */
  isCustomCSSEnabled: () => Promise<boolean>

  /**
   * param: (value: boolean)
   * ```
   * return: Promise<HtmlSource>
   * ```
   *
   * Enables or disables application of custom CSS to the document
   *
   * *Chainable.*
   */
  enableCustomCSS: (value: boolean) => Promise<HtmlSource>

}

applyMixins(HtmlSource, [iSourceHtml, SourceConfigurable, SourceAudio])