/// <reference path="../../../defs/es6-promise.d.ts" />

import {exec} from '../../internal/internal';
import {applyMixins} from '../../internal/util/mixin';
import {Item as iItem} from '../../internal/item';
import {App as iApp} from '../../internal/app';
import {ItemLayout, IItemLayout} from './ilayout';
import {ItemColor, IItemColor} from './icolor';
import {ItemChroma, IItemChroma, KeyingType, ChromaPrimaryColors,
  ChromaAntiAliasLevel} from './ichroma';
import {ItemEffect, IItemEffect, MaskEffect} from './ieffects';
import {ItemTransition, IItemTransition} from './itransition';
import {ItemConfigurable, IItemConfigurable} from './iconfig';
import {IItemAudio, ItemAudio} from './iaudio';
import {Source} from './source';
import {Scene} from '../scene';
import {Transition} from '../transition';
import {Rectangle} from '../../util/rectangle';
import {Color} from '../../util/color';
import {Environment} from '../environment';

/**
 * The HtmlSource class represents a web page source. This covers both source
 * plugins and non-plugin URLs.
 *
 * Inherits from: {@link #core/Source Core/Source}
 *
 * Implements: {@link #core/IItemChroma Core/IItemChroma},
 * {@link #core/IItemColor Core/IItemColor},
 * {@link #core/IItemLayout Core/IItemLayout},
 * {@link #core/IItemTransition Core/IItemTransition},
 * {@link #core/IItemAudio Core/IItemAudio},
 * {@link #core/IItemConfigurable Core/IItemConfigurable},
 * {@link #core/IItemEffect Core/IItemEffect}
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 *
 * XJS.Scene.getActiveScene().then(function(scene) {
 *   scene.getSources().then(function(sources) {
 *     for (var i in sources) {
 *       if (sources[i] instanceof XJS.HtmlSource) {
 *         // Manipulate your HTML source here
 *         sources[i].enableBrowserTransparency(true);
 *       }
 *     }
 *   });
 * });
 * ```
 *
 *  All methods marked as *Chainable* resolve with the original `HtmlSource`
 * instance. Also, any audio setting, i.e. volume, mute, stream only
 * may not be properly reflected in the source unless native browser audio support
 * is enabled. (Tools menu > General Settings > Advanced tab)
 */
export class HtmlSource extends Source implements IItemLayout, IItemColor,
  IItemChroma, IItemTransition, IItemConfigurable, IItemAudio, IItemEffect {

  /**
   * return: Promise<string>
   *
   * Gets the URL of this webpage source.
   */
  getURL(): Promise<string> {
    return new Promise(resolve => {
      iItem.get('prop:item', this._id).then(url => {
        let _url = String(url).split('*');
        url = _url[0];
        resolve(url);
      });
    });
  }

  /**
   * param: (url: string)
   * ```
   * return: Promise<HtmlSource>
   * ```
   *
   * Sets the URL of this webpage source.
   *
   * *Chainable.*
   */
  setURL(value: string): Promise<HtmlSource> {
    return new Promise((resolve, reject) => {
      iItem.set('prop:item', value, this._id).then(code => {
        if (code) {
          resolve(this);
        } else {
          reject('Invalid value');
        }
      });
    });
  }

  /**
   * return: Promise<string>
   *
   * Gets the javascript commands to be executed on source upon load
   */
  getBrowserJS(): Promise<string> {
    return new Promise(resolve => {
      iItem.get('prop:custom', this._id).then(custom => {
        let customJS = '';
        try {
          let customObject = JSON.parse(custom);
          if (customObject.hasOwnProperty('customJS')) {
            customJS = customObject['customJS'];
          }
        }
        catch(e) {

        }
        resolve(customJS);
      });
    });
  }

  /**
   * param: (js: string, refresh: boolean = false)
   * ```
   * return: Promise<HtmlSource>
   * ```
   *
   * Sets the javascript commands to be executed on source
   * right upon setting and on load. Optionally set second parameter
   * to true to refresh source (needed to clean previously executed JS code.)
   *
   * *Chainable.*
   */
  setBrowserJS(value: string, refresh = false): Promise<HtmlSource> {
    return new Promise((resolve, reject) => {
      let customObject = {};

      iItem.get('prop:custom', this._id).then(custom => {

        let customJS = '';
        let customCSS = '';
        let scriptString = ' ';
        let scriptEnabled = true;
        let cssEnabled = true;

        try {
          customObject = JSON.parse(custom);
          if (customObject.hasOwnProperty('cssEnabled')) {
            cssEnabled = (customObject['cssEnabled'] == 'true');
          }
          if (customObject.hasOwnProperty('scriptEnabled')) {
            scriptEnabled = (customObject['scriptEnabled'] == 'true');
          }
          if (customObject.hasOwnProperty('customCSS')) {
            customCSS = customObject['customCSS'];
          }
        }
        catch (e) {

        }

        customObject['cssEnabled'] = cssEnabled.toString();
        customObject['scriptEnabled'] = scriptEnabled.toString();
        customObject['customCSS'] = customCSS;
        customObject['customJS'] = value;

        if (cssEnabled === true) {
          let cssScript = "var xjsCSSOverwrite = document.createElement('style');xjsCSSOverwrite.id = 'splitmedialabsCSSOverwrite';xjsCSSOverwrite.type = 'text/css';var h = document.querySelector('head');var existing = document.querySelector('head #splitmedialabsCSSOverwrite');if (existing != null)h.removeChild(existing);xjsCSSOverwrite.innerHTML = '" + customCSS.replace(/(\r\n|\n|\r)/gm, '').replace(/\s{2,}/g, ' ').replace(/(\[br\])/gm, '') + "';h.appendChild(xjsCSSOverwrite);";
          scriptString = scriptString + cssScript;
        }
        if (value !== '' && scriptEnabled === true) {
          scriptString = scriptString + value;
        }
        return iItem.set('prop:BrowserJs', scriptString, this._id);
      })
      .then(() => {
        return iItem.set('prop:custom', JSON.stringify(customObject), this._id);
      })
      .then(() => {
        if (refresh) {
          iItem.set('refresh', '', this._id).then(() =>  {
            resolve(this);
          });
        } else {
          resolve(this);
        }
      });
    });
  }

  /**
   * return: Promise<boolean>
   *
   * Gets if BrowserJS is enabled and executed on load
   */
  isBrowserJSEnabled(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:custom', this._id).then(custom => {
        let enabled = true;
        try {
          let customObject = JSON.parse(custom);
          if (customObject.hasOwnProperty('scriptEnabled')) {
            enabled = (customObject['scriptEnabled'] == 'true');
          }
        }
        catch(e) {

        }
        resolve(enabled);
      });
    });
  }

  /**
   * param: (value: boolean)
   * ```
   * return: Promise<HtmlSource>
   * ```
   *
   * Enables or disables execution of the set BrowserJs upon load.
   * Note that disabling this will require source to be refreshed
   * in order to remove any BrowserJS previously executed.
   *
   * *Chainable.*
   */
  enableBrowserJS(value: boolean): Promise<HtmlSource> {
    return new Promise((resolve, reject) => {
      let customObject = {};

      iItem.get('prop:custom', this._id).then(custom => {

        let customJS = '';
        let customCSS = '';
        let scriptString = ' ';
        let scriptEnabled = true;
        let cssEnabled = true;

        try {
          customObject = JSON.parse(custom);
          if (customObject.hasOwnProperty('cssEnabled')) {
            cssEnabled = (customObject['cssEnabled'] == 'true');
          }
          if (customObject.hasOwnProperty('customJS')) {
            customJS = customObject['customJS'];
          }
          if (customObject.hasOwnProperty('customCSS')) {
            customCSS = customObject['customCSS'];
          }
        }
        catch(e) {

        }

        customObject['cssEnabled'] = cssEnabled.toString();
        customObject['scriptEnabled'] = value.toString();
        customObject['customJS'] = customJS;
        customObject['customCSS'] = customCSS;

        if (cssEnabled === true) {
          let cssScript =
          'var xjsCSSOverwrite = document.createElement("style");' +
          'xjsCSSOverwrite.id = "splitmedialabsCSSOverwrite";' +
          'xjsCSSOverwrite.type = "text/css";' +
          'var h = document.querySelector("head");' +
          'var existing = document' +
            '.querySelector("head #splitmedialabsCSSOverwrite");' +
          'if (existing != null)h.removeChild(existing);' +
          'xjsCSSOverwrite.innerHTML = "' +
          customCSS.replace(/(\r\n|\n|\r)/gm,'')
            .replace(/\s{2,}/g, ' ').replace(/(\[br\])/gm,'') + '";"' +
          'h.appendChild(xjsCSSOverwrite);';
          scriptString = scriptString + cssScript;
        }
        if (customJS !== '' && value === true) {
          scriptString = scriptString + customJS;
        }
        return iItem.set('prop:BrowserJs', scriptString, this._id);
      })
      .then(() => {
        return iItem.set('prop:custom', JSON.stringify(customObject), this._id);
      })
      .then(() => {
        if (!value) {
          iItem.set('refresh', '', this._id).then(() => {
            resolve(this);
          });
        } else {
          resolve(this);
        }
      });
    });
  }

  /**
   * return: Promise<string>
   *
   * Gets the custom CSS applied to the document upon loading
   */
  getCustomCSS(): Promise<string> {
    return new Promise(resolve => {
      iItem.get('prop:custom', this._id).then(custom => {
        let customCSS = '';
        try {
          let customObject = JSON.parse(custom);
          if (customObject.hasOwnProperty('customCSS')) {
            customCSS = customObject['customCSS'];
          }
        }
        catch(e) {

        }
        resolve(customCSS);
      });
    });
  }

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
  setCustomCSS(value: string): Promise<HtmlSource> {
    return new Promise((resolve, reject) => {
      let customObject = {};

      iItem.get('prop:custom', this._id).then(custom => {

        let customJS = '';
        let customCSS = '';
        let scriptString = ' ';
        let scriptEnabled = true;
        let cssEnabled = true;

        try {
          customObject = JSON.parse(custom);
          if (customObject.hasOwnProperty('cssEnabled')) {
            cssEnabled = (customObject['cssEnabled'] == 'true');
          }
          if (customObject.hasOwnProperty('scriptEnabled')) {
            scriptEnabled = (customObject['scriptEnabled'] == 'true');
          }
          if (customObject.hasOwnProperty('customJS')) {
            customJS = customObject['customJS'];
          }
        }
        catch(e) {

        }

        customObject['cssEnabled'] = cssEnabled.toString();
        customObject['scriptEnabled'] = scriptEnabled.toString();
        customObject['customJS'] = customJS;
        customObject['customCSS'] = value;

        if (cssEnabled === true) {
          let cssScript =
          'var xjsCSSOverwrite = document.createElement("style");' +
          'xjsCSSOverwrite.id = "splitmedialabsCSSOverwrite";' +
          'xjsCSSOverwrite.type = "text/css";' +
          'var h = document.querySelector("head");' +
          'var existing = document' +
            '.querySelector("head #splitmedialabsCSSOverwrite");' +
          'if (existing != null)h.removeChild(existing);' +
          'xjsCSSOverwrite.innerHTML = "' +
          value.replace(/(\r\n|\n|\r)/gm,'')
            .replace(/\s{2,}/g, ' ').replace(/(\[br\])/gm,'')+
          '";h.appendChild(xjsCSSOverwrite);';
          scriptString = scriptString + cssScript;
        }
        if (customJS !== '' && scriptEnabled === true) {
          scriptString = scriptString + customJS;
        }
        return iItem.set('prop:BrowserJs', scriptString, this._id);
      })
      .then(() => {
        return iItem.set('prop:custom', JSON.stringify(customObject), this._id);
      })
      .then(() => {
        resolve(this);
      });
    });
  }

  /**
   * return: Promise<boolean>
   *
   * Gets if custom CSS is enabled and applied to the document on load
   */
  isCustomCSSEnabled(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:custom', this._id).then(custom => {
        let enabled = true;
        try {
          let customObject = JSON.parse(custom);
          if (customObject.hasOwnProperty('cssEnabled')) {
            enabled = (customObject['cssEnabled'] == 'true');
          }
        }
        catch(e) {

        }
        resolve(enabled);
      });
    });
  }

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
  enableCustomCSS(value: boolean): Promise<HtmlSource> {
    return new Promise((resolve, reject) => {
      let customObject = {};

      iItem.get('prop:custom', this._id).then(custom => {

        let customJS = '';
        let customCSS = '';
        let scriptString = ' ';
        let scriptEnabled = true;
        let cssEnabled = true;

        try {
          customObject = JSON.parse(custom);
          if (customObject.hasOwnProperty('scriptEnabled')) {
            scriptEnabled = (customObject['scriptEnabled'] == 'true');
          }
          if (customObject.hasOwnProperty('customJS')) {
            customJS = customObject['customJS'];
          }
          if (customObject.hasOwnProperty('customCSS')) {
            customCSS = customObject['customCSS'];
          }
        }
        catch(e) {

        }

        customObject['scriptEnabled'] = scriptEnabled.toString();
        customObject['cssEnabled'] = value.toString();
        customObject['customJS'] = customJS;
        customObject['customCSS'] = customCSS;

        if (value === true) {
          let cssScript =
          'var xjsCSSOverwrite = document.createElement("style");' +
          'xjsCSSOverwrite.id = "splitmedialabsCSSOverwrite";' +
          'xjsCSSOverwrite.type = "text/css";' +
          'var h = document.querySelector("head");' +
          'var existing = document' +
            '.querySelector("head #splitmedialabsCSSOverwrite");' +
          'if (existing != null)h.removeChild(existing);' +
          'xjsCSSOverwrite.innerHTML = "' +
          customCSS.replace(/(\r\n|\n|\r)/gm,'')
            .replace(/\s{2,}/g, ' ').replace(/(\[br\])/gm,'') +
          '";h.appendChild(xjsCSSOverwrite);';
          scriptString = scriptString + cssScript;
        }
        if (customJS !== '' && value === scriptEnabled) {
          scriptString = scriptString + customJS;
        }
        return iItem.set('prop:BrowserJs', scriptString, this._id);
      })
      .then(() => {
        return iItem.set('prop:custom', JSON.stringify(customObject), this._id);
      })
      .then(() => {
        if (!value) {
          let cssScript = "var h = document.querySelector('head');var existing3 = document.querySelector('head #splitmedialabsCSSOverwrite');if (existing3 != null)h.removeChild(existing3);";
          if (Environment.isSourcePlugin()) {
            eval(cssScript);
          } else {
            exec('CallInner', 'eval', cssScript);
          }
          resolve(this);
        } else {
          resolve(this);
        }
      });
    });
  }

  /**
   * return: Promise<boolean>
   *
   * Check if browser is rendered transparent
   */
  isBrowserTransparent(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:BrowserTransparent', this._id).then(isTransparent => {
        resolve(isTransparent === '1');
      });
    });
  }

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
  enableBrowserTransparency(value: boolean): Promise<HtmlSource> {
    return new Promise(resolve => {
      iItem.set('prop:BrowserTransparent', (value ? '1' : '0'),
        this._id).then(() => {
          resolve(this);
      });
    });
  }

  /**
   * return: Promise<Rectangle>
   *
   * Gets the custom browser window size (in pixels) for the source, if set,
   * regardless of its layout on the mixer. Returns a (0, 0) Rectangle if no
   * custom size has been set.
   *
   * See also: {@link #util/Rectangle Util/Rectangle}
   */
  getBrowserCustomSize():Promise<Rectangle> {
    return new Promise(resolve => {
      let customSize;
      iItem.get('prop:BrowserSize', this._id).then(val => {
        if (val !== '') {
          var [width, height] = String(val).split(',');
          customSize = Rectangle.fromDimensions(
            Number(width) / window.devicePixelRatio,
            Number(height) / window.devicePixelRatio
          );
        } else {
          customSize = Rectangle.fromDimensions(0, 0);
        }
        resolve(customSize);
      });
    });
  }

  /**
   * param: Promise<Rectangle>
   * ```
   * return: Promise<HtmlSource>
   * ```
   *
   * Sets the custom browser window size for the source
   * regardless of its layout on the mixer
   *
   * *Chainable.*
   *
   * See also: {@link #util/Rectangle Util/Rectangle}
   */
  setBrowserCustomSize(value: Rectangle): Promise<HtmlSource> {
    return new Promise(resolve => {
      // Set the correct width and height based on the DPI settings
      value.setWidth(value.getWidth() * window.devicePixelRatio);
      value.setHeight(value.getHeight() * window.devicePixelRatio);

      iItem.set('prop:BrowserSize', value.toDimensionString(), this._id)
        .then(() => {
          resolve(this);
      });
    });
  }

  /**
   * return: Promise<boolean>
   *
   * Check if right click events are sent to the source or not.
   *
   * #### Usage
   *
   * ```javascript
   * source.getAllowRightClick().then(function(isRightClickAllowed) {
   *   // The rest of your code here
   * });
   * ```
   */
  getAllowRightClick(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:BrowserRightClick', this._id).then(val => {
        resolve(val === '1');
      });
    });
  }

  /**
   * param: (value:boolean)
   * ```
   * return: Promise<Source>
   * ```
   *
   * Allow or disallow right click events to be sent to the source. Note that
   * you can only catch right click events using `mouseup/mousedown`
   *
   * *Chainable*
   *
   * #### Usage
   *
   * ```javascript
   * source.setAllowRightClick(true).then(function(source) {
   *   // Promise resolves with the same Source instance
   * });
   * ```
   */
  setAllowRightClick(value: boolean): Promise<Source> {
    return new Promise(resolve => {
      iItem.set('prop:BrowserRightClick', (value ? '1' : '0'), this._id)
        .then(() => {
          resolve(this);
        });
    });
  }

  /**
   * param: (func: string, arg: string)
   * ```
   * return: Promise<HtmlSource>
   * ```
   *
   * Allow this source to communicate with another source.
   */
  call(func: string, arg: string): Promise<HtmlSource> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      exec('CallInner' +
        (String(slot) === '0' ? '' : slot + 1),
        func,
        arg);
      resolve(this);
    });
  }

  // ItemLayout

  /**
   * See: {@link #core/IItemLayout#isKeepAspectRatio isKeepAspectRatio}
   */
  isKeepAspectRatio: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemLayout#isPositionLocked isPositionLocked}
   */
  isPositionLocked: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemLayout#isEnhancedResizeEnabled isEnhancedResizeEnabled}
   */
  isEnhancedResizeEnabled: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemLayout#getCanvasRotate getCanvasRotate}
   */
  getCanvasRotate: () => Promise<number>;

  /**
   * See: {@link #core/IItemLayout#getCropping getCropping}
   */
  getCropping: () => Promise<Object>;

  /**
   * See: {@link #core/IItemLayout#getEnhancedRotate getEnhancedRotate}
   */
  getEnhancedRotate: () => Promise<number>;

  /**
   * See: {@link #core/IItemLayout#getPosition getPosition}
   */
  getPosition: () => Promise<Rectangle>;

  /**
   * See: {@link #core/IItemLayout#getRotateY getRotateY}
   */
  getRotateY: () => Promise<number>;

  /**
   * See: {@link #core/IItemLayout#getRotateX getRotateX}
   */
  getRotateX: () => Promise<number>;

  /**
   * See: {@link #core/IItemLayout#getRotateZ getRotateZ}
   */
  getRotateZ: () => Promise<number>;

  /**
   * See: {@link #core/IItemLayout#setCanvasRotate setCanvasRotate}
   */
  setCanvasRotate: (value: number) => Promise<HtmlSource>;

  /**
   * See: {@link #core/IItemLayout#setCropping setCropping}
   */
  setCropping: (value: Object) => Promise<HtmlSource>;

  /**
   * See: {@link #core/IItemLayout#setCroppingEnhanced setCroppingEnhanced}
   */
  setCroppingEnhanced: (value: Object) => Promise<HtmlSource>;

  /**
   * See: {@link #core/IItemLayout#setEnhancedRotate setEnhancedRotate}
   */
  setEnhancedRotate:        (value: number) => Promise<HtmlSource>;

  /**
   * See: {@link #core/IItemLayout#setKeepAspectRatio setKeepAspectRatio}
   */
  setKeepAspectRatio: (value: boolean) => Promise<HtmlSource>;

  /**
   * See: {@link #core/IItemLayout#setPositionLocked setPositionLocked}
   */
  setPositionLocked:        (value: boolean) => Promise<HtmlSource>;

  /**
   * See: {@link #core/IItemLayout#setEnhancedResizeEnabled setEnhancedResizeEnabled}
   */
  setEnhancedResizeEnabled:  (value: boolean) => Promise<HtmlSource>;

  /**
   * See: {@link #core/IItemLayout#setPosition setPosition}
   */
  setPosition:              (value: Rectangle) => Promise<HtmlSource>;

  /**
   * See: {@link #core/IItemLayout#setRotateY setRotateY}
   */
  setRotateY:              (value: number) => Promise<HtmlSource>;

  /**
   * See: {@link #core/IItemLayout#setRotateX setRotateX}
   */
  setRotateX:              (value: number) => Promise<HtmlSource>;

  /**
   * See: {@link #core/IItemLayout#setRotateZ setRotateZ}
   */
  setRotateZ:              (value: number) => Promise<HtmlSource>;

  // ItemColor

  /**
   * See: {@link #core/IItemColor#getTransparency getTransparency}
   */
  getTransparency: () => Promise<number>;

  /**
   * See: {@link #core/IItemColor#getBrightness getBrightness}
   */
  getBrightness: () => Promise<number>;

  /**
   * See: {@link #core/IItemColor#getContrast getContrast}
   */
  getContrast: () => Promise<number>;

  /**
   * See: {@link #core/IItemColor#getHue getHue}
   */
  getHue: () => Promise<number>;

  /**
   * See: {@link #core/IItemColor#getSaturation getSaturation}
   */
  getSaturation: () => Promise<number>;

  /**
   * See: {@link #core/IItemColor#getBorderColor getBorderColor}
   */
  getBorderColor: () => Promise<Color>;

  /**
   * See: {@link #core/IItemColor#isFullDynamicColorRange isFullDynamicColorRange}
   */
  isFullDynamicColorRange: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemColor#setTransparency setTransparency}
   */
  setTransparency: (value: number) => Promise<HtmlSource>;

  /**
   * See: {@link #core/IItemColor#setBrightness setBrightness}
   */
  setBrightness:   (value: number) => Promise<HtmlSource>;

  /**
   * See: {@link #core/IItemColor#setContrast setContrast}
   */
  setContrast:     (value: number) => Promise<HtmlSource>;

  /**
   * See: {@link #core/IItemColor#setHue setHue}
   */
  setHue:          (value: number) => Promise<HtmlSource>;

  /**
   * See: {@link #core/IItemColor#setSaturation setSaturation}
   */
  setSaturation:   (value: number) => Promise<HtmlSource>;

  /**
   * See: {@link #core/IItemColor#setBorderColor setBorderColor}
   */
  setBorderColor:  (value: Color) => Promise<HtmlSource>;

  /**
   * See: {@link #core/IItemColor#setFullDynamicColorRange setFullDynamicColorRange}
   */
  setFullDynamicColorRange: (value: boolean) => Promise<HtmlSource>;

  // ItemChroma

  /**
   * See: {@link #core/IItemChroma#isChromaEnabled isChromaEnabled}
   */
  isChromaEnabled: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemChroma#setChromaEnabled setChromaEnabled}
   */
  setChromaEnabled: (value: boolean) => Promise<HtmlSource>;

  /**
   * See: {@link #core/IItemChroma#getKeyingType getKeyingType}
   */
  getKeyingType: () => Promise<KeyingType>;

  /**
   * See: {@link #core/IItemChroma#setKeyingType setKeyingType}
   */
  setKeyingType: (value: KeyingType) => Promise<HtmlSource>;

  // BOTH CHROMA LEGACY AND CHROMA RGB

  /**
   * See: {@link #core/IItemChroma#getChromaAntiAliasLevel getChromaAntiAliasLevel}
   */
  getChromaAntiAliasLevel: () => Promise<ChromaAntiAliasLevel>;

  /**
   * See: {@link #core/IItemChroma#setChromaAntiAliasLevel setChromaAntiAliasLevel}
   */
  setChromaAntiAliasLevel: (value: ChromaAntiAliasLevel) => Promise<HtmlSource>;

  // CHROMA LEGACY MODE

  /**
   * See: {@link #core/IItemChroma#getChromaLegacyBrightness getChromaLegacyBrightness}
   */
  getChromaLegacyBrightness: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaLegacyBrightness setChromaLegacyBrightness}
   */
  setChromaLegacyBrightness: (value: number) => Promise<HtmlSource>;

  /**
   * See: {@link #core/IItemChroma#getChromaLegacySaturation getChromaLegacySaturation}
   */
  getChromaLegacySaturation: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaLegacySaturation setChromaLegacySaturation}
   */
  setChromaLegacySaturation: (value: number) => Promise<HtmlSource>;

  /**
   * See: {@link #core/IItemChroma#getChromaLegacyHue getChromaLegacyHue}
   */
  getChromaLegacyHue: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaLegacyHue setChromaLegacyHue}
   */
  setChromaLegacyHue: (value: number) => Promise<HtmlSource>;

  /**
   * See: {@link #core/IItemChroma#getChromaLegacyThreshold getChromaLegacyThreshold}
   */
  getChromaLegacyThreshold: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaLegacyThreshold setChromaLegacyThreshold}
   */
  setChromaLegacyThreshold: (value: number) => Promise<HtmlSource>;

  /**
   * See: {@link #core/IItemChroma#getChromaLegacyAlphaSmoothing getChromaLegacyAlphaSmoothing}
   */
  getChromaLegacyAlphaSmoothing: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaLegacyAlphaSmoothing setChromaLegacyAlphaSmoothing}
   */
  setChromaLegacyAlphaSmoothing: (value: number) => Promise<HtmlSource>;

  // CHROMA KEY RGB MODE

  /**
   * See: {@link #core/IItemChroma#getChromaRGBKeyPrimaryColor getChromaRGBKeyPrimaryColor}
   */
  getChromaRGBKeyPrimaryColor: () => Promise<ChromaPrimaryColors>;

  /**
   * See: {@link #core/IItemChroma#setChromaRGBKeyPrimaryColor setChromaRGBKeyPrimaryColor}
   */
  setChromaRGBKeyPrimaryColor: (value: ChromaPrimaryColors) => Promise<HtmlSource>;

  /**
   * See: {@link #core/IItemChroma#getChromaRGBKeyThreshold getChromaRGBKeyThreshold}
   */
  getChromaRGBKeyThreshold: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaRGBKeyThreshold setChromaRGBKeyThreshold}
   */
  setChromaRGBKeyThreshold: (value: number) => Promise<HtmlSource>;

  /**
   * See: {@link #core/IItemChroma#getChromaRGBKeyExposure getChromaRGBKeyExposure}
   */
  getChromaRGBKeyExposure: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaRGBKeyExposure setChromaRGBKeyExposure}
   */
  setChromaRGBKeyExposure: (value: number) => Promise<HtmlSource>;

  // COLOR KEY MODE

  /**
   * See: {@link #core/IItemChroma#getChromaColorKeyThreshold getChromaColorKeyThreshold}
   */
  getChromaColorKeyThreshold: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaColorKeyThreshold setChromaColorKeyThreshold}
   */
  setChromaColorKeyThreshold: (value: number) => Promise<HtmlSource>;

  /**
   * See: {@link #core/IItemChroma#getChromaColorKeyExposure getChromaColorKeyExposure}
   */
  getChromaColorKeyExposure: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaColorKeyExposure setChromaColorKeyExposure}
   */
  setChromaColorKeyExposure: (value: number) => Promise<HtmlSource>;

  /**
   * See: {@link #core/IItemChroma#getChromaColorKeyColor getChromaColorKeyColor}
   */
  getChromaColorKeyColor: () => Promise<Color>;

  /**
   * See: {@link #core/IItemChroma#setChromaColorKeyColor setChromaColorKeyColor}
   */
  setChromaColorKeyColor: (value: Color) => Promise<HtmlSource>;

  // ItemTransition

  /**
   * See: {@link #core/IItemTransition#isVisible isVisible}
   */
  isVisible: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemTransition#setVisible setVisible}
   */
  setVisible:        (value: boolean) => Promise<HtmlSource>;

  /**
   * See: {@link #core/IItemTransition#getTransition getTransition}
   */
  getTransition: () => Promise<Transition>;

  /**
   * See: {@link #core/IItemTransition#setTransition setTransition}
   */
  setTransition:     (value: Transition) => Promise<HtmlSource>;

  /**
   * See: {@link #core/IItemTransition#getTransitionTime getTransitionTime}
   */
  getTransitionTime: () => Promise<number>;

  /**
   * See: {@link #core/IItemTransition#setTransitionTime setTransitionTime}
   */
  setTransitionTime: (value: number) => Promise<HtmlSource>;

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

  // ItemEffect

  /** See: {@link #core/IItemEffect#getMaskEffect getMaskEffect} */
  getMaskEffect: () => Promise<MaskEffect>;

  /** See: {@link #core/IItemEffect#setMaskEffect setMaskEffect} */
  setMaskEffect: (value: MaskEffect) => Promise<HtmlSource>;

  /** See: {@link #core/IItemEffect#getBorderEffectRadius getBorderEffectRadius} */
  getBorderEffectRadius: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setBorderEffectRadius setBorderEffectRadius} */
  setBorderEffectRadius: (value: number) => Promise<HtmlSource>;

  /** See: {@link #core/IItemEffect#getBorderEffectThickness getBorderEffectThickness} */
  getBorderEffectThickness: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setBorderEffectThickness setBorderEffectThickness} */
  setBorderEffectThickness: (value: number) => Promise<HtmlSource>;

  /** See: {@link #core/IItemEffect#getBorderEffectOpacity getBorderEffectOpacity} */
  getBorderEffectOpacity: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setBorderEffectOpacity setBorderEffectOpacity} */
  setBorderEffectOpacity: (value: number) => Promise<HtmlSource>;

  /** See: {@link #core/IItemEffect#getBorderEffectColor getBorderEffectColor} */
  getBorderEffectColor: () => Promise<Color>;

  /** See: {@link #core/IItemEffect#setBorderEffectColor setBorderEffectColor} */
  setBorderEffectColor: (value: Color) => Promise<HtmlSource>;

   /** See: {@link #core/IItemEffect#getShadowEffectColor getShadowEffectColor} */
  getShadowEffectColor: () => Promise<Color>;

  /** See: {@link #core/IItemEffect#setShadowEffectColor setShadowEffectColor} */
  setShadowEffectColor: (value: Color) => Promise<HtmlSource>;

  /** See: {@link #core/IItemEffect#getShadowEffectThickness getShadowEffectThickness} */
  getShadowEffectThickness: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setShadowEffectThickness setShadowEffectThickness} */
  setShadowEffectThickness: (value: number) => Promise<HtmlSource>;

  /** See: {@link #core/IItemEffect#getShadowEffectBlur getShadowEffectBlur} */
  getShadowEffectBlur: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setShadowEffectBlur setShadowEffectBlur} */
  setShadowEffectBlur: (value: number) => Promise<HtmlSource>;

  /** See: {@link #core/IItemEffect#getShadowEffectOpacity getShadowEffectOpacity} */
  getShadowEffectOpacity: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setShadowEffectOpacity setShadowEffectOpacity} */
  setShadowEffectOpacity: (value: number) => Promise<HtmlSource>;

  /** See: {@link #core/IItemEffect#getShadowEffectOffsetX getShadowEffectOffsetX} */
  getShadowEffectOffsetX: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setShadowEffectOffsetX setShadowEffectOffsetX} */
  setShadowEffectOffsetX: (value: number) => Promise<HtmlSource>;

  /** See: {@link #core/IItemEffect#getShadowEffectOffsetY getShadowEffectOffsetY} */
  getShadowEffectOffsetY: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setShadowEffectOffsetY setShadowEffectOffsetY} */
  setShadowEffectOffsetY: (value: number) => Promise<HtmlSource>;

  /** See: {@link #core/IItemEffect#getFileMask getFileMask} */
  getFileMask: () => Promise<string>;

  /** See: {@link #core/IItemEffect#setFileMask setFileMask} */
  setFileMask: (value: string) => Promise<HtmlSource>;

  /** See: {@link #core/IItemEffect#isFileMaskingGuideVisible isFileMaskingGuideVisible} */
  isFileMaskingGuideVisible: () => Promise<boolean>;

  /** See: {@link #core/IItemEffect#showFileMaskingGuide showFileMaskingGuide} */
  showFileMaskingGuide: (value: boolean) => Promise<HtmlSource>;
}

applyMixins(HtmlSource, [ItemLayout, ItemColor, ItemChroma, ItemTransition,
  ItemConfigurable, ItemAudio, ItemEffect]);
