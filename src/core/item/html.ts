/// <reference path="../../../defs/es6-promise.d.ts" />

import {exec} from '../../internal/internal';
import {applyMixins} from '../../internal/util/mixin';
import {Item as iItem} from '../../internal/item';
import {App as iApp} from '../../internal/app';
import {ItemLayout, IItemLayout} from './ilayout';
import {ItemColor, IItemColor} from './icolor';
import {ItemChroma, IItemChroma, KeyingType, ChromaPrimaryColors,
  ChromaAntiAliasLevel} from './ichroma';
import {ItemTransition, IItemTransition} from './itransition';
import {ItemConfigurable, IItemConfigurable} from './iconfig';
import {IItemAudio, ItemAudio} from './iaudio';
import {Item} from './item';
import {Scene} from '../scene';
import {Transition} from '../transition';
import {Rectangle} from '../../util/rectangle';
import {Color} from '../../util/color';
import {Environment} from '../environment';

/**
 * The HTMLItem class represents a web page source. This covers both source
 * plugins and non-plugin URLs.
 *
 * Inherits from: {@link #core/Item Core/Item}
 *
 *  All methods marked as *Chainable* resolve with the original `HTMLItem`
 * instance. Also, any audio setting, i.e. volume, mute, stream only
 * may not be properly reflected in the source unless native browser audio support
 * is enabled. (Tools menu > General Settings > Advanced tab)
 */
export class HTMLItem extends Item implements IItemLayout, IItemColor,
  IItemChroma, IItemTransition, IItemConfigurable, IItemAudio {

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
   * return: Promise<HTMLItem>
   * ```
   *
   * Sets the URL of this webpage source.
   *
   * *Chainable.*
   */
  setURL(value: string): Promise<HTMLItem> {
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
   * return: Promise<HTMLItem>
   * ```
   *
   * Sets the javascript commands to be executed on source
   * right upon setting and on load. Optionally set second parameter
   * to true to refresh source (needed to clean previously executed JS code.)
   *
   * *Chainable.*
   */
  setBrowserJS(value: string, refresh = false): Promise<HTMLItem> {
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
   * return: Promise<HTMLItem>
   * ```
   *
   * Enables or disables execution of the set BrowserJs upon load.
   * Note that disabling this will require source to be refreshed
   * in order to remove any BrowserJS previously executed.
   *
   * *Chainable.*
   */
  enableBrowserJS(value: boolean): Promise<HTMLItem> {
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
   * return: Promise<HTMLItem>
   * ```
   *
   * Sets the custom CSS to be applied to the document upon loading
   *
   * *Chainable.*
   */
  setCustomCSS(value: string): Promise<HTMLItem> {
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
   * return: Promise<HTMLItem>
   * ```
   *
   * Enables or disables application of custom CSS to the document
   *
   * *Chainable.*
   */
  enableCustomCSS(value: boolean): Promise<HTMLItem> {
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
   * return: Promise<HTMLItem>
   * ```
   *
   * Enable or disabled transparency of CEF browser
   *
   * *Chainable.*
   */
  enableBrowserTransparency(value: boolean): Promise<HTMLItem> {
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
          var [width, height] = decodeURIComponent(val).split(',');
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
   * return: Promise<HTMLItem>
   * ```
   *
   * Sets the custom browser window size for the source
   * regardless of its layout on the mixer
   *
   * *Chainable.*
   *
   * See also: {@link #util/Rectangle Util/Rectangle}
   */
  setBrowserCustomSize(value: Rectangle): Promise<HTMLItem> {
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

  // ItemLayout

  /**
   * return: Promise<boolean>
   *
   * Check if Aspect Ratio is set to ON or OFF
   */
  isKeepAspectRatio:        () => Promise<boolean>;

  /**
   * return: Promise<boolean>
   *
   * Check if Position Locked is set to ON or OFF
   */
  isPositionLocked:         () => Promise<boolean>;

  /**
   * return: Promise<boolean>
   *
   * Check if Enhance Resize is Enabled or Disabled
   */
  isEnhancedResizeEnabled:   () => Promise<boolean>;

  /**
   * return: Promise<Rectangle>
   *
   * Get the position of the item
   *
   * See also: {@link #util/Rectangle Util/Rectangle}
   */
  getPosition:              () => Promise<Rectangle>;

  /**
   * return: Promise<number>
   *
   * Get Rotate Y value of the item
   */
  getRotateY:              () => Promise<number>;

  /**
   * return: Promise<number>
   *
   * Get Rotate X value of the item
   */
  getRotateX:              () => Promise<number>;

  /**
   * return: Promise<number>
   *
   * Get Rotate Z value of the item
   */
  getRotateZ:              () => Promise<number>;

  /**
   * param: (value: boolean)
   *
   * Set Aspect Ratio to ON or OFF
   *
   * *Chainable.*
   */
  setKeepAspectRatio:       (value: boolean) => Promise<HTMLItem>;

  /**
   * param: (value: boolean)
   *
   * Set Position Lock to ON or OFF
   *
   * *Chainable.*
   */
  setPositionLocked:        (value: boolean) => Promise<HTMLItem>;

  /**
   * param: (value: boolean)
   *
   * Set Enhance Resize to ON or OFF
   *
   * *Chainable.*
   */
  setEnhancedResizeEnabled:  (value: boolean) => Promise<HTMLItem>;

  /**
   * param: (value: Rectangle)
   *
   * Set Item Position. Relative coordinates (0-1) are required.
   *
   * *Chainable.*
   *
   * #### Usage
   *
   * ```javascript
   * var rect = xjs.Rectangle.fromCoordinates(0, 0, 1, 1);
   * item.setPosition(rect).then(function(item) {
   *   // Promise resolves with same Item instance
   * });
   * ```
   *
   * See also: {@link #util/Rectangle Util/Rectangle}
   */
  setPosition:              (value: Rectangle) => Promise<HTMLItem>;

  /**
   * param: (value: number)
   *
   * Set Rotate Y value of the item
   *
   * *Chainable.*
   */
  setRotateY:              (value: number) => Promise<HTMLItem>;

  /**
   * param: (value: number)
   *
   * Set Rotate X value of the item
   *
   * *Chainable.*
   */
  setRotateX:              (value: number) => Promise<HTMLItem>;

  /**
   * param: (value: number)
   *
   * Set Rotate Z value of the item
   *
   * *Chainable.*
   */
  setRotateZ:              (value: number) => Promise<HTMLItem>;

  // ItemColor

  /**
   * return: Promise<number>
   *
   * Get Item Transparency value
   */
  getTransparency: () => Promise<number>;

  /**
   * return: Promise<number>
   *
   * Get Item Brightness value
   */
  getBrightness:   () => Promise<number>;

  /**
   * return: Promise<number>
   *
   * Get Item Contrast value
   */
  getContrast:     () => Promise<number>;

  /**
   * return: Promise<number>
   *
   * Get Item Hue value
   */
  getHue:          () => Promise<number>;

  /**
   * return: Promise<number>
   *
   * Get Item Saturation value
   */
  getSaturation:   () => Promise<number>;

  /**
   * return: Promise<Color>
   *
   * Get Border Color
   */
  getBorderColor:  () => Promise<Color>;

  /**
   * param: (value: number)
   *
   * Set Item Transparency
   *
   * *Chainable.*
   */
  setTransparency: (value: number) => Promise<HTMLItem>;

  /**
   * param: (value: number)
   *
   * Set Item Brightness
   *
   * *Chainable.*
   */
  setBrightness:   (value: number) => Promise<HTMLItem>;

  /**
   * param: (value: number)
   *
   * Set Item Contrast
   *
   * *Chainable.*
   */
  setContrast:     (value: number) => Promise<HTMLItem>;

  /**
   * param: (value: number)
   *
   * Set Item Hue
   *
   * *Chainable.*
   */
  setHue:          (value: number) => Promise<HTMLItem>;

  /**
   * param: (value: number)
   *
   * Set Item Saturation
   *
   * *Chainable.*
   */
  setSaturation:   (value: number) => Promise<HTMLItem>;

  /**
   * param: (value: Color)
   *
   * Set Border Color
   *
   * *Chainable.*
   */
  setBorderColor:  (value: Color) => Promise<HTMLItem>;

  // ItemChroma
  /**
   * return: Promise<boolean>
   */
  isChromaEnabled: () => Promise<boolean>;
  /**
   * param: (value: boolean)
   *
   * *Chainable.*
   */
  setChromaEnabled: (value: boolean) => Promise<HTMLItem>;
  /**
   * return: Promise<KeyingType>
   */
  getKeyingType: () => Promise<KeyingType>;
  /**
   * param: (value: KeyingType)
   * *Chainable.*
   *
   */
  setKeyingType: (value: KeyingType) => Promise<HTMLItem>;

  // BOTH CHROMA LEGACY AND CHROMA RGB
  /**
   * return: Promise<ChromaAntiAliasLevel>
   */
  getChromaAntiAliasLevel: () => Promise<ChromaAntiAliasLevel>;
  /**
   * param: (value: ChromaAntiAliasLevel)
   *
   * *Chainable.*
   */
  setChromaAntiAliasLevel: (value: ChromaAntiAliasLevel) => Promise<HTMLItem>;

  // CHROMA LEGACY MODE
  /**
   * return: Promise<number>
   */
  getChromaLegacyBrightness: () => Promise<number>;
  /**
   * param: (value: number)
   *
   * *Chainable.*
   */
  setChromaLegacyBrightness: (value: number) => Promise<HTMLItem>;
  /**
   * return: Promise<number>
   */
  getChromaLegacySaturation: () => Promise<number>;
  /**
   * param: (value: number)
   *
   * *Chainable.*
   */
  setChromaLegacySaturation: (value: number) => Promise<HTMLItem>;
  /**
   * return: Promise<number>
   */
  getChromaLegacyHue: () => Promise<number>;
  /**
   * param: (value: number)
   *
   * *Chainable.*
   */
  setChromaLegacyHue: (value: number) => Promise<HTMLItem>;
  /**
   * return: Promise<number>
   */
  getChromaLegacyThreshold: () => Promise<number>;
  /**
   * param: (value: number)
   *
   * *Chainable.*
   */
  setChromaLegacyThreshold: (value: number) => Promise<HTMLItem>;
  /**
   * return: Promise<number>
   */
  getChromaLegacyAlphaSmoothing: () => Promise<number>;
  /**
   * param: (value: number)
   *
   * *Chainable.*
   */
  setChromaLegacyAlphaSmoothing: (value: number) => Promise<HTMLItem>;

  // CHROMA KEY RGB MODE
  /**
   * return: Promise<ChromaPrimaryColors>
   */
  getChromaRGBKeyPrimaryColor: () => Promise<ChromaPrimaryColors>;
  /**
   * param: (value: ChromaPrimaryColors)
   *
   * *Chainable.*
   */
  setChromaRGBKeyPrimaryColor: (value: ChromaPrimaryColors) => Promise<HTMLItem>;
  /**
   * return: Promise<number>
   */
  getChromaRGBKeyThreshold: () => Promise<number>;
  /**
   * param: (value: number)
   *
   * *Chainable.*
   */
  setChromaRGBKeyThreshold: (value: number) => Promise<HTMLItem>;
  /**
   * return: Promise<number>
   */
  getChromaRGBKeyExposure: () => Promise<number>;
  /**
   * param: (value: number)
   *
   * *Chainable.*
   */
  setChromaRGBKeyExposure: (value: number) => Promise<HTMLItem>;

  // COLOR KEY MODE
  /**
   * return: Promise<number>
   */
  getChromaColorKeyThreshold: () => Promise<number>;
  /**
   * param: (value: number)
   *
   * *Chainable.*
   */
  setChromaColorKeyThreshold: (value: number) => Promise<HTMLItem>;
  /**
   * return: Promise<number>
   */
  getChromaColorKeyExposure: () => Promise<number>;
  /**
   * param: (value: number)
   *
   * *Chainable.*
   */
  setChromaColorKeyExposure: (value: number) => Promise<HTMLItem>;
  /**
   * return: Promise<Color>
   */
  getChromaColorKeyColor: () => Promise<Color>;
  /**
   * param: (value: Color)
   *
   * *Chainable.*
   */
  setChromaColorKeyColor: (value: Color) => Promise<HTMLItem>;

  // ItemTransition

  /**
   * return: Promise<boolean>
   *
   * Check if item is visible on stage
   */
  isVisible:         () => Promise<boolean>;

  /**
   * param: (value: boolean)
   *
   * Set item to visible or hidden
   *
   * *Chainable.*
   */
  setVisible:        (value: boolean) => Promise<HTMLItem>;

  /**
   * return: Promise<boolean>
   *
   * Get item's transition type for when visibility is toggled
   */
  getTransition:     () => Promise<Transition>;

  /**
   * param: (value: Transition)
   *
   * Set item's transition type for when visibility is toggled
   *
   * *Chainable.*
   */
  setTransition:     (value: Transition) => Promise<HTMLItem>;

  /**
   * return: Promise<number>
   *
   * Get item's transition time in milliseconds
   */
  getTransitionTime: () => Promise<number>;

  /**
   * param: (value: number)
   *
   * Set item's transition time in milliseconds
   *
   * *Chainable.*
   */
  setTransitionTime: (value: number) => Promise<HTMLItem>;

  // ItemConfigurable

  /**
   * return: Promise<any>
   *
   * Gets the configuration JSON
   */
  loadConfig: () => Promise<any>;

  /**
   * param: config<JSON>
   *
   * Persists a JSON object for configuration. Available to sources only.
   *
   * *Chainable.*
   */
  saveConfig: (configObj: any) => Promise<HTMLItem>;

  /**
   * param: config<JSON>
   *
   * Requests the source to save a configuration. This makes the source emit the save-config event.
   *
   * *Chainable.*
   */
  requestSaveConfig: (configObj: any) => Promise<HTMLItem>;

  /**
   * param: config<JSON>
   *
   * Requests the source to save a configuration. This makes the source emit the apply-config event.
   *
   * *Chainable.*
   */
  applyConfig: (configObj: any) => Promise<HTMLItem>;

  // ItemAudio

  /**
   * return: Promise<number>
   *
   * Get item's volume level expressed as an integer from 0 to 100
   */
  getVolume: () => Promise<number>;

  /**
   * return: Promise<boolean>
   *
   * Check if item's mute option is active
   */
  isMute:   () => Promise<boolean>;

  /**
   * param: value<number>
   *
   * Set volume level of item as an integer from 0 (muted) to 100 (maximum)
   *
   * *Chainable.*
   */
  setVolume: (value: number) => Promise<HTMLItem>;

  /**
   * param: value<boolean>
   *
   * Set item's Mute property to ON or OFF
   *
   * *Chainable.*
   */
  setMute:  (value: boolean) => Promise<HTMLItem>;

  /**
   * return: Promise<boolean>
   *
   * Checks if audio is also output to system sound
   */
  isStreamOnlyAudio: () => Promise<boolean>;

  /**
   * param: value<boolean>
   *
   * Sets whether audio should also be output to system sound
   *
   * *Chainable.*
   */
  setStreamOnlyAudio: (value: boolean) => Promise<HTMLItem>;

  /**
   * return: Promise<boolean>
   *
   * Checks if audio is available
   */
  isAudioAvailable: () => Promise<boolean>;
}

applyMixins(HTMLItem, [ItemLayout, ItemColor, ItemChroma, ItemTransition,
  ItemConfigurable, ItemAudio]);
