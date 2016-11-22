/// <reference path="../../../defs/es6-promise.d.ts" />

import {exec} from '../../internal/internal';
import {Item as iItem} from '../../internal/item';
import {Rectangle} from '../../util/rectangle';
import {Environment} from '../environment';
import {Logger} from '../../internal/util/logger'

export interface IHtmlSource {

  /**
   * return: Promise<boolean>
   *
   * Check if browser is rendered transparent
   */
  isBrowserTransparent(): Promise<boolean>

  /**
   * param: Promise<boolean>
   *
   * return: Promise<HtmlSource>
   */
  enableBrowserTransparency(value: boolean): Promise<IHtmlSource>

  /**
   * return: Promise<Rectangle>
   *
   * Gets the custom browser window size (in pixels) for the item, if set,
   * regardless of its layout on the mixer. Returns a (0, 0) Rectangle if no
   * custom size has been set.
   */
  getBrowserCustomSize(): Promise<Rectangle>

  /**
   * param: Promise<Rectangle>
   *
   * return: Promise<iHtmlSource>
   *
   * Gets the custom brower window size (in pixels) for the item
   */
  setBrowserCustomSize(value: Rectangle): Promise<IHtmlSource>

  /**
   * return: Promise<boolean>
   *
   * Check if right click events are sent to the item or not.
   */
  getAllowRightClick(): Promise<boolean>

  /**
   * param: (value:boolean)
   *
   * return: Promise<Source>
   *
   * Allow or disallow right click events to be sent to the item. Note that
   * you can only catch right click events using `mouseup/mousedown`
   */
  setAllowRightClick(value: boolean): Promise<IHtmlSource>

  /**
   * return: Promise<string>
   *
   * Gets the javascript commands to be executed on item upon load
   */
  getBrowserJS(): Promise<string>

  /**
   * param: (js: string, refresh: boolean = false)
   *
   * return: Promise<IHtmlSource>
   *
   * Sets the javascript commands to be executed on item
   * right upon setting and on load. Optionally set second parameter
   * to true to refresh item (needed to clean previously executed JS code.)
   *
   * *Chainable.*
   */
  setBrowserJS(value: string): Promise<IHtmlSource>

  /**
   * return: Promise<boolean>
   *
   * Gets if BrowserJS is enabled and executed on load
   */
  isBrowserJSEnabled(): Promise<boolean>

  /**
   * param: (value: boolean)
   *
   * return: Promise<IHtmlSource>
   *
   * Enables or disables execution of the set BrowserJs upon load.
   */
  enableBrowserJS(value: boolean): Promise<IHtmlSource>

  /**
   * return: Promise<string>
   *
   * Gets the custom CSS applied to the document upon loading
   */
  getCustomCSS(): Promise<string>

  /**
   * param: (value: string)
   *
   * return: Promise<IHtmlSource>
   *
   * Sets the custom CSS to be applied to the document upon loading
   */
  setCustomCSS(value: string): Promise<IHtmlSource>

  /**
   * return: Promise<boolean>
   *
   * Gets if custom CSS is enabled and applied to the document on load
   */
  isCustomCSSEnabled(): Promise<boolean>

  /**
   * param: (value: boolean)
   *
   * return: Promise<IHtmlSource>
   *
   * Enables or disables application of custom CSS to the document
   */
  enableCustomCSS(value: boolean): Promise<IHtmlSource>
}

export class iHtmlSource implements IHtmlSource{
  protected _id: string;
  protected _isItemCall: boolean;

  constructor(props?: {}) {
    props = props ? props : {};

    this._id = props['id'];
  }

  isBrowserTransparent(): Promise<boolean> {
    if(this._isItemCall){
      Logger.warn('isBrowserTransparent', true)
    }
    return new Promise(resolve => {
      iItem.get('prop:BrowserTransparent', this._id).then(isTransparent => {
        resolve(isTransparent === '1');
      });
    });
  }

  enableBrowserTransparency(value: boolean): Promise<iHtmlSource> {
    if(this._isItemCall){
      Logger.warn('enableBrowserTransparency', true)
    }
    return new Promise(resolve => {
      iItem.set('prop:BrowserTransparent', (value ? '1' : '0'),
        this._id).then(() => {
          resolve(this);
      });
    });
  }

  getBrowserCustomSize(): Promise<Rectangle> {
    if(this._isItemCall){
      Logger.warn('getBrowserCustomSize', true)
    }
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

  setBrowserCustomSize(value: Rectangle): Promise<iHtmlSource> {
    if(this._isItemCall){
      Logger.warn('setBrowserCustomSize', true)
    }
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

  getAllowRightClick(): Promise<boolean> {
    if(this._isItemCall){
      Logger.warn('getAllowRightClick', true)
    }
    return new Promise(resolve => {
      iItem.get('prop:BrowserRightClick', this._id).then(val => {
        resolve(val === '1');
      });
    });
  }

  setAllowRightClick(value: boolean): Promise<iHtmlSource> {
    if(this._isItemCall){
      Logger.warn('setAllowRightClick', true)
    }
    return new Promise(resolve => {
      iItem.set('prop:BrowserRightClick', (value ? '1' : '0'), this._id)
        .then(() => {
          resolve(this);
        });
    });
  }

  getBrowserJS(): Promise<string> {
    if(this._isItemCall){
      Logger.warn('getBrowserJS', true)
    }
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

  setBrowserJS(value: string, refresh = false): Promise<iHtmlSource> {
    if(this._isItemCall){
      Logger.warn('setBrowserJS', true)
    }
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
        catch(e) {

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
          iItem.set('refresh', '', this._id).then(() => {
            resolve(this);
          });
        } else {
          resolve(this);
        }
      });
    });
  }

  isBrowserJSEnabled(): Promise<boolean> {
    if(this._isItemCall){
      Logger.warn('isBrowserJSEnabled', true)
    }
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

  enableBrowserJS(value: boolean): Promise<iHtmlSource> {
    if(this._isItemCall){
      Logger.warn('enableBrowserJS', true)
    }
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
            customCSS.replace(/(\r\n|\n|\r)/gm, '')
              .replace(/\s{2,}/g, ' ').replace(/(\[br\])/gm, '') + '";"' +
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

  getCustomCSS(): Promise<string> {
    if(this._isItemCall){
      Logger.warn('getCustomCSS', true)
    }
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

  setCustomCSS(value: string): Promise<iHtmlSource> {
    if(this._isItemCall){
      Logger.warn('setCustomCSS', true)
    }
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
            value.replace(/(\r\n|\n|\r)/gm, '')
              .replace(/\s{2,}/g, ' ').replace(/(\[br\])/gm, '') +
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

  isCustomCSSEnabled(): Promise<boolean> {
    if(this._isItemCall){
      Logger.warn('isCustomCSSEnabled', true)
    }
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

  enableCustomCSS(value: boolean): Promise<iHtmlSource> {
    if(this._isItemCall){
      Logger.warn('enableCustomCSS', true)
    }
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
            customCSS.replace(/(\r\n|\n|\r)/gm, '')
              .replace(/\s{2,}/g, ' ').replace(/(\[br\])/gm, '') +
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
}