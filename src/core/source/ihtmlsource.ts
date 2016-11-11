/// <reference path="../../../defs/es6-promise.d.ts" />

import {exec} from '../../internal/internal';
import {Item as iItem} from '../../internal/item';
import {Rectangle} from '../../util/rectangle';
import {Environment} from '../environment';
import {Logger} from '../../internal/util/logger'

export class iHtmlSource {
  protected _id: string;
  protected _isItemCall: boolean;

  constructor(props?: {}) {
    props = props ? props : {};

    this._id = props['id'];
  }
  /**
   * return: Promise<boolean>
   *
   * Check if browser is rendered transparent
   */
  isBrowserTransparent(): Promise<boolean> {
    let called: boolean = false;
    if(this._isItemCall){
      Logger.warn('isBrowserTransparent is a Source specific method. \
Use this through Source to avoid this warning.', called ? true : true)
    }
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
  enableBrowserTransparency(value: boolean): Promise<iHtmlSource> {
    let called: boolean = false;
    if(this._isItemCall){
      Logger.warn('enableBrowserTransparency is a Source specific method. \
Use this through Source to avoid this warning.', called ? true : true)
    }
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
   * Gets the custom browser window size (in pixels) for the item, if set,
   * regardless of its layout on the mixer. Returns a (0, 0) Rectangle if no
   * custom size has been set.
   *
   * See also: {@link #util/Rectangle Util/Rectangle}
   */
  getBrowserCustomSize(): Promise<Rectangle> {
    let called: boolean = false;
    if(this._isItemCall){
      Logger.warn('getBrowserCustomSize is a Source specific method. \
Use this through Source to avoid this warning.', called ? true : true)
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

  /**
   * param: Promise<Rectangle>
   * ```
   * return: Promise<IiHtmlSource>
   * ```
   *
   * Sets the custom browser window size for the item
   * regardless of its layout on the mixer
   *
   * *Chainable.*
   *
   * See also: {@link #util/Rectangle Util/Rectangle}
   */
  setBrowserCustomSize(value: Rectangle): Promise<iHtmlSource> {
    let called: boolean = false;
    if(this._isItemCall){
      Logger.warn('setBrowserCustomSize is a Source specific method. \
Use this through Source to avoid this warning.', called ? true : true)
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
  getAllowRightClick(): Promise<boolean> {
    let called: boolean = false;
    if(this._isItemCall){
      Logger.warn('getAllowRightClick is a Source specific method. \
Use this through Source to avoid this warning.', called ? true : true)
    }
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
  setAllowRightClick(value: boolean): Promise<iHtmlSource> {
    let called: boolean = false;
    if(this._isItemCall){
      Logger.warn('setAllowRightClick is a Source specific method. \
Use this through Source to avoid this warning.', called ? true : true)
    }
    return new Promise(resolve => {
      iItem.set('prop:BrowserRightClick', (value ? '1' : '0'), this._id)
        .then(() => {
          resolve(this);
        });
    });
  }

  /**
   * return: Promise<string>
   *
   * Gets the javascript commands to be executed on item upon load
   */
  getBrowserJS(): Promise<string> {
    let called: boolean = false;
    if(this._isItemCall){
      Logger.warn('getBrowserJS is a Source specific method. \
Use this through Source to avoid this warning.', called ? true : true)
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

  /**
   * param: (js: string, refresh: boolean = false)
   * ```
   * return: Promise<IiHtmlSource>
   * ```
   *
   * Sets the javascript commands to be executed on item
   * right upon setting and on load. Optionally set second parameter
   * to true to refresh item (needed to clean previously executed JS code.)
   *
   * *Chainable.*
   */
  setBrowserJS(value: string, refresh = false): Promise<iHtmlSource> {
    let called: boolean = false;
    if(this._isItemCall){
      Logger.warn('setBrowserJS is a Source specific method. \
Use this through Source to avoid this warning.', called ? true : true)
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

  /**
   * return: Promise<boolean>
   *
   * Gets if BrowserJS is enabled and executed on load
   */
  isBrowserJSEnabled(): Promise<boolean> {
    let called: boolean = false;
    if(this._isItemCall){
      Logger.warn('isBrowserJSEnabled is a Source specific method. \
Use this through Source to avoid this warning.', called ? true : true)
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

  /**
   * param: (value: boolean)
   * ```
   * return: Promise<IiHtmlSource>
   * ```
   *
   * Enables or disables execution of the set BrowserJs upon load.
   * Note that disabling this will require item to be refreshed
   * in order to remove any BrowserJS previously executed.
   *
   * *Chainable.*
   */
  enableBrowserJS(value: boolean): Promise<iHtmlSource> {
    let called: boolean = false;
    if(this._isItemCall){
      Logger.warn('enableBrowserJS is a Source specific method. \
Use this through Source to avoid this warning.', called ? true : true)
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

  /**
   * return: Promise<string>
   *
   * Gets the custom CSS applied to the document upon loading
   */
  getCustomCSS(): Promise<string> {
    let called: boolean = false;
    if(this._isItemCall){
      Logger.warn('getCustomCSS is a Source specific method. \
Use this through Source to avoid this warning.', called ? true : true)
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

  /**
   * param: (value: string)
   * ```
   * return: Promise<IiHtmlSource>
   * ```
   *
   * Sets the custom CSS to be applied to the document upon loading
   *
   * *Chainable.*
   */
  setCustomCSS(value: string): Promise<iHtmlSource> {
    let called: boolean = false;
    if(this._isItemCall){
      Logger.warn('setCustomCSS is a Source specific method. \
Use this through Source to avoid this warning.', called ? true : true)
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

  /**
   * return: Promise<boolean>
   *
   * Gets if custom CSS is enabled and applied to the document on load
   */
  isCustomCSSEnabled(): Promise<boolean> {
    let called: boolean = false;
    if(this._isItemCall){
      Logger.warn('isCustomCSSEnabled is a Source specific method. \
Use this through Source to avoid this warning.', called ? true : true)
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

  /**
   * param: (value: boolean)
   * ```
   * return: Promise<IiHtmlSource>
   * ```
   *
   * Enables or disables application of custom CSS to the document
   *
   * *Chainable.*
   */
  enableCustomCSS(value: boolean): Promise<iHtmlSource> {
    let called: boolean = false;
    if(this._isItemCall){
      Logger.warn('enableCustomCSS is a Source specific method. \
Use this through Source to avoid this warning.', called ? true : true)
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