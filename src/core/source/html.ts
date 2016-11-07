/// <reference path="../../../defs/es6-promise.d.ts" />

import {applyMixins} from '../../internal/util/mixin';
import {Source} from '../source/source';
import {Item as iItem} from '../../internal/item';
import {Rectangle} from '../../util/rectangle';
import {exec} from '../../internal/internal';
import {Environment} from '../environment';
import {Item} from '../items/item';
import {ItemConfigurable, IItemConfigurable} from '../items/iconfig';
import {IItemAudio, ItemAudio} from '../items/iaudio';
import {iHtmlSource} from '../source/ihtmlsource'

export class HtmlSource extends Source implements IItemConfigurable, IItemAudio {
  // ItemConfigurable

  /**
   * See: {@link #core/IItemConfigurable#loadConfig loadConfig}
   */
  loadConfig: () => Promise<any>;

  /**
   * See: {@link #core/IItemConfigurable#saveConfig saveConfig}
   */
  saveConfig: (configObj: any) => Promise<HtmlSource>;

  /**
   * See: {@link #core/IItemConfigurable#requestSaveConfig requestSaveConfig}
   */
  requestSaveConfig: (configObj: any) => Promise<HtmlSource>;

  /**
   *
   * See: {@link #core/IItemConfigurable#applyConfig applyConfig}
   */
  applyConfig: (configObj: any) => Promise<HtmlSource>;

  // ItemAudio

  /** See: {@link #core/IItemAudio#getVolume getVolume} */
  getVolume: () => Promise<number>;

  /** See: {@link #core/IItemAudio#isMute isMute} */
  isMute: () => Promise<boolean>;

  /** See: {@link #core/IItemAudio#setVolume setVolume} */
  setVolume: (value: number) => Promise<HtmlSource>;

  /** See: {@link #core/IItemAudio#setMute setMute} */
  setMute: (value: boolean) => Promise<HtmlSource>;

  /** See: {@link #core/IItemAudio#isStreamOnlyAudio isStreamOnlyAudio} */
  isStreamOnlyAudio: () => Promise<boolean>;

  /** See: {@link #core/IItemAudio#setStreamOnlyAudio setStreamOnlyAudio} */
  setStreamOnlyAudio: (value: boolean) => Promise<HtmlSource>;

  /** See: {@link #core/IItemAudio#isAudioAvailable isAudioAvailable} */
  isAudioAvailable: () => Promise<boolean>;

  //iHtmlSource
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
   * return: Promise<IHtmlSource>
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
   * return: Promise<IHtmlSource>
   * ```
   *
   * Sets the javascript commands to be executed on item
   * right upon setting and on load. Optionally set second parameter
   * to true to refresh item (needed to clean previously executed JS code.)
   *
   * *Chainable.*
   */
  setBrowserJS: () => Promise<HtmlSource>


}

applyMixins(HtmlSource, [ItemConfigurable, ItemAudio, iHtmlSource])