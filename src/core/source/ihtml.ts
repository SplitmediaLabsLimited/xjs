/// <reference path="../../../defs/es6-promise.d.ts" />

import {exec} from '../../internal/internal';
import {Item as iItem} from '../../internal/item';
import {Rectangle} from '../../util/rectangle';
import {Environment} from '../environment';
import {Logger} from '../../internal/util/logger';

const LoadStatus = {
  loaded : 'LOADED',
  not_loaded: 'NOT LOADED',
  load_error: 'LOAD ERROR',
  unknown: 'UNKNOWN'
}

export interface ISourceHtml {
  /**
   * param: (func: string, arg: string)
   * ```
   * return: Promise<ISourceHtml>
   * ```
   *
   * Allow this source to call a pre-exposed function within the HTML Source
   */
  call(func: string, arg: string): Promise<ISourceHtml>

  /**
   * return: Promise<string>
   *
   * Gets the URL of this webpage source.
   */
  getURL(): Promise<string>

  /**
   * param: (url: string)
   * ```
   * return: Promise<ISourceHtml>
   * ```
   *
   * Sets the URL of this webpage source.
   *
   * *Chainable.*
   */
  setURL(value: string): Promise<ISourceHtml>

  /**
   * return: Promise<boolean>
   *
   * Check if browser is rendered transparent
   */
  isBrowserTransparent(): Promise<boolean>

  /**
   * param: Promise<boolean>
   * ```
   * return: Promise<ISourceHtml>
   * ```
   *
   * Enable or disable transparency of CEF browser
   *
   * *Chainable.*
   */
  enableBrowserTransparency(value: boolean): Promise<ISourceHtml>

  /**
   * return: Promise<boolean>
   *
   * Check if browser can render up to a maximum of 60FPS
   */
  isBrowser60FPS(): Promise<boolean>

  /**
   * param: Promise<boolean>
   * ```
   * return: Promise<ISourceHtml>
   * ```
   *
   * Enable or disable browser source to render up to a maximum of 60FPS
   *
   * *Chainable.*
   */
  enableBrowser60FPS(value: boolean): Promise<ISourceHtml>

  /**
   * return: Promise<Rectangle>
   *
   * Gets the custom browser window size (in pixels) for the item, if set,
   * regardless of its layout on the mixer. Returns a (0, 0) Rectangle if no
   * custom size has been set.
   *
   * See also: {@link #util/Rectangle Util/Rectangle}
   */
  getBrowserCustomSize(): Promise<Rectangle>

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
  setBrowserCustomSize(value: Rectangle): Promise<ISourceHtml>

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
  getAllowRightClick(): Promise<boolean>

  /**
   * param: (value:boolean)
   * ```
   * return: Promise<ISourceHtml>
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
  setAllowRightClick(value: boolean): Promise<ISourceHtml>

  /**
   * return: Promise<string>
   *
   * Gets the javascript commands to be executed on item upon load
   */
  getBrowserJS(): Promise<string>

  /**
   * param: (js: string, refresh: boolean = false)
   *
   * return: Promise<ISourceHtml>
   *
   * Sets the javascript commands to be executed on item
   * right upon setting and on load. Optionally set second parameter
   * to true to refresh item (needed to clean previously executed JS code.)
   *
   * *Chainable.*
   */
  setBrowserJS(value: string): Promise<ISourceHtml>

  /**
   * return: Promise<boolean>
   *
   * Gets if BrowserJS is enabled and executed on load
   */
  isBrowserJSEnabled(): Promise<boolean>

  /**
   * param: (value: boolean)
   * ```
   * return: Promise<ISourceHtml>
   * ```
   *
   * Enables or disables execution of the set BrowserJs upon load.
   * Note that disabling this will require item to be refreshed
   * in order to remove any BrowserJS previously executed.
   *
   * *Chainable.*
   */
  enableBrowserJS(value: boolean): Promise<ISourceHtml>

  /**
   * return: Promise<string>
   *
   * Gets the custom CSS applied to the document upon loading
   */
  getCustomCSS(): Promise<string>

  /**
   * param: (value: string)
   * ```
   * return: Promise<ISourceHtml>
   * ```
   *
   * Sets the custom CSS to be applied to the document upon loading
   *
   * *Chainable.*
   */
  setCustomCSS(value: string): Promise<ISourceHtml>

  /**
   * return: Promise<boolean>
   *
   * Gets if custom CSS is enabled and applied to the document on load
   */
  isCustomCSSEnabled(): Promise<boolean>

  /**
   * param: (value: boolean)
   *
   * return: Promise<ISourceHtml>
   *
   * Enables or disables application of custom CSS to the document
   */
  enableCustomCSS(value: boolean): Promise<ISourceHtml>

  /**
   * return: Promise<boolean>
   *
   * Gets if browser instance is optimized via surface sharing
   */
  isBrowserOptimized(): Promise<boolean>

  /**
   * return: Promise<string>
   *
   * Gets the load status of the html
   * May return as any of the following:
   * - 'LOADED' -> HTML is already loaded
   * - 'NOT LOADED' -> HTML is not yet loaded
   * - 'LOAD ERROR' -> Error in loading HTML
   * - 'UNKNOWN' -> URL used is invalid or when status is checked right after adding new HTML source
   * - 'UNAVAILABLE' -> Method for getting load status is unavailable for the XBC version
   */
  getBrowserLoadStatus: () => Promise<string>

  /**
   * return: Promise<boolean>
   *
   * Gets if source will refresh upon showing (via setVisible)
   */
  isReloadOnShowEnabled(): Promise<boolean>

  /**
   * param: (value: boolean)
   *
   * return: Promise<ISourceHtml>
   *
   * Enables or disables refresh of source upon showing (via setVisible)
   */
  enableReloadOnShow(value: boolean): Promise<ISourceHtml>

  /**
   * return: Promise<boolean>
   *
   * Gets if source will refresh upon entering a scene containing an item of it (via setVisible)
   */
  isReloadOnSceneEnterEnabled(): Promise<boolean>

  /**
   * param: (value: boolean)
   *
   * return: Promise<ISourceHtml>
   *
   * Enables or disables refresh of source upon entering a scene containing an item of it (via setVisible)
   */
  enableReloadOnSceneEnter(value: boolean): Promise<ISourceHtml>

  /**
   * return: Promise<boolean>
   *
   * Check if file used as source is available
   *
   * #### Usage
   *
   * ```javascript
   * item.isSourceAvailable().then(function(isAvail) {
   *   // The rest of your code here
   * });
   * ```
   */
  isSourceAvailable(): Promise<boolean>
}

export class iSourceHtml implements ISourceHtml{
  private _id: string;
  private _srcId: string;
  private _isItemCall: boolean;
  private _checkPromise;
  private _sceneId: string;

  private _updateId(id?: string, sceneId?: string) {
    this._id = id;
    this._sceneId = sceneId;
  }

  /**
   * param: (func: string, arg: string)
   * ```
   * return: Promise<ISourceHtml>
   * ```
   *
   * Allow this item to call a pre-exposed function within the HTML Item
   */
  call(func: string, arg: string): Promise<iSourceHtml> {
    return new Promise(resolve => {
      let slot
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'call', true)
        this._checkPromise = iItem.attach(this._id)
      } else {
        this._checkPromise = iItem.attach(this._id)
      }
      this._checkPromise.then(res => {
        slot = res;
        exec('CallInner' +
          (String(slot) === '0' ? '' : slot + 1),
          func,
          arg);
        resolve(this);
      });
    });
  }

  /**
   * return: Promise<string>
   *
   * Gets the URL of this webpage item.
   */
  getURL(): Promise<string> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'getURL', true)
        this._checkPromise = iItem.get('prop:srcitem', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('prop:srcitem', this._srcId, this._id,
          this._updateId.bind(this))
      }
      this._checkPromise.then(url => {
          let _url = String(url).split('*');
          url = _url[0];
          resolve(url);
        });
    });
  }

  /**
   * param: (url: string)
   * ```
   * return: Promise<ISourceHtml>
   * ```
   *
   * Sets the URL of this webpage item.
   *
   * *Chainable.*
   */
  setURL(value: string): Promise<iSourceHtml> {
    return new Promise((resolve, reject) => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'setURL', true)
        this._checkPromise = iItem.get('prop:srcitem', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('prop:srcitem', this._srcId, this._id,
          this._updateId.bind(this))
      }
      this._checkPromise.then(url => {
        const _url = String(url).split('*');
        _url[0] = value;
        return iItem.set(this._isItemCall ? 'prop:item' : 'prop:srcitem', _url.join('*'), this._id);
      }).then(code => {
        if (code) {
          return iItem.set('prop:name', value, this._id);
        } else {
          return Promise.resolve(code);
        }
      }).then(code => {
        if (code) {
          resolve(this);
        } else {
          reject(Error('Invalid value'));
        }
      });
    });
  }

  isBrowserTransparent(): Promise<boolean> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'isBrowserTransparent', true)
        this._checkPromise = iItem.get('prop:BrowserTransparent', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('prop:BrowserTransparent', this._srcId, this._id,
          this._updateId.bind(this))
      }
      this._checkPromise.then(isTransparent => {
        resolve(isTransparent === '1');
      });
    });
  }

  enableBrowserTransparency(value: boolean): Promise<iSourceHtml> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'enableBrowserTransparency', true)
        this._checkPromise = iItem.set('prop:BrowserTransparent', (value ? '1' : '0'),
        this._id)
      } else {
        this._checkPromise = iItem.wrapSet('prop:BrowserTransparent', (value ? '1' : '0'),
        this._srcId, this._id, this._updateId.bind(this))
      }
      this._checkPromise.then(() => {
        resolve(this);
      });
    });
  }

  isBrowser60FPS(): Promise<boolean> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'isBrowser60FPS', true);
        this._checkPromise = iItem.get('prop:Browser60fps', this._id);
      } else {
        this._checkPromise = iItem.wrapGet('prop:Browser60fps', this._srcId, this._id,
          this._updateId.bind(this))
      }
      this._checkPromise.then(isBrowser60FPS => {
        resolve(isBrowser60FPS === '1');
      });
    });
  }

  enableBrowser60FPS(value: boolean): Promise<iSourceHtml> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'isBrowser60FPS', true);
        this._checkPromise = iItem.get('prop:Browser60fps', this._id);
      } else {
        this._checkPromise = iItem.wrapGet('prop:Browser60fps', this._srcId, this._id,
          this._updateId.bind(this))
      }
      this._checkPromise.then(isBrowser60FPS => {
        if ((isBrowser60FPS === '1') !== value) {
          iItem.set('prop:Browser60fps',  (value ? '1' : '0'), this._id);
        }
        resolve(this);
      });
    });
  }

  getBrowserCustomSize(): Promise<Rectangle> {
    return new Promise(resolve => {
      let customSize;
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'getBrowserCustomSize', true)
        this._checkPromise = iItem.get('prop:BrowserSize', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('prop:BrowserSize', this._srcId, this._id,
          this._updateId.bind(this))
      }
      this._checkPromise.then(val => {
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

  setBrowserCustomSize(value: Rectangle): Promise<iSourceHtml> {
    return new Promise(resolve => {
      // Set the correct width and height based on the DPI settings
      value.setWidth(value.getWidth() * window.devicePixelRatio);
      value.setHeight(value.getHeight() * window.devicePixelRatio);

      if(this._isItemCall){
        Logger.warn('sourceWarning', 'setBrowserCustomSize', true)
        this._checkPromise = iItem.set('prop:BrowserSize', value.toDimensionString(), this._id)
      } else {
        this._checkPromise = iItem.wrapSet('prop:BrowserSize', value.toDimensionString(),
          this._srcId, this._id, this._updateId.bind(this))
      }
      this._checkPromise.then(() => {
        resolve(this);
      });
    });
  }

  getAllowRightClick(): Promise<boolean> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'getAllowRightClick', true)
        this._checkPromise = iItem.get('prop:BrowserRightClick', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('prop:BrowserRightClick', this._srcId, this._id,
          this._updateId.bind(this))
      }
      this._checkPromise.then(val => {
        resolve(val === '1');
      });
    });
  }

  setAllowRightClick(value: boolean): Promise<iSourceHtml> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'setAllowRightClick', true)
        this._checkPromise = iItem.set('prop:BrowserRightClick', (value ? '1' : '0'), this._id)
      } else {
        this._checkPromise = iItem.wrapSet('prop:BrowserRightClick', (value ? '1' : '0'),
          this._srcId, this._id, this._updateId.bind(this))
      }
      this._checkPromise.then(() => {
         resolve(this);
      });
    });
  }

  getBrowserJS(): Promise<string> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'getBrowserJS', true)
        this._checkPromise = iItem.get('prop:custom', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('prop:custom', this._srcId, this._id,
          this._updateId.bind(this))
      }
      this._checkPromise.then(custom => {
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

  setBrowserJS(value: string, refresh = false): Promise<iSourceHtml> {
    return new Promise((resolve, reject) => {
      let customObject = {};
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'setBrowserJS', true)
        this._checkPromise = iItem.get('prop:custom', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('prop:custom', this._srcId, this._id,
          this._updateId.bind(this))
      }

      this._checkPromise.then(custom => {

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
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'isBrowserJSEnabled', true)
        this._checkPromise = iItem.get('prop:custom', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('prop:custom', this._srcId, this._id,
          this._updateId.bind(this))
      }
      this._checkPromise.then(custom => {
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

  enableBrowserJS(value: boolean): Promise<iSourceHtml> {
    return new Promise((resolve, reject) => {
      let customObject = {};

      if(this._isItemCall){
        Logger.warn('sourceWarning', 'enableBrowserJS', true)
        this._checkPromise = iItem.get('prop:custom', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('prop:custom', this._srcId, this._id,
          this._updateId.bind(this))
      }
      this._checkPromise.then(custom => {

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
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'getCustomCSS', true)
        this._checkPromise = iItem.get('prop:custom', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('prop:custom', this._srcId, this._id,
          this._updateId.bind(this))
      }
      this._checkPromise.then(custom => {
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

  setCustomCSS(value: string): Promise<iSourceHtml> {
    return new Promise((resolve, reject) => {
      let customObject = {};

      if(this._isItemCall){
        Logger.warn('sourceWarning', 'setCustomCSS', true)
        this._checkPromise = iItem.get('prop:custom', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('prop:custom', this._srcId, this._id,
          this._updateId.bind(this))
      }
      this._checkPromise.then(custom => {

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
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'isCustomCSSEnabled', true)
        this._checkPromise = iItem.get('prop:custom', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('prop:custom', this._srcId, this._id,
          this._updateId.bind(this))
      }
      this._checkPromise.then(custom => {
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

  enableCustomCSS(value: boolean): Promise<iSourceHtml> {
    return new Promise((resolve, reject) => {
      let customObject = {};

      if(this._isItemCall){
        Logger.warn('sourceWarning', 'enableCustomCSS', true)
        this._checkPromise = iItem.get('prop:custom', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('prop:custom', this._srcId, this._id,
          this._updateId.bind(this))
      }
      this._checkPromise.then(custom => {

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

  isBrowserOptimized(): Promise<boolean> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'isBrowserOptimized', true)
        this._checkPromise = iItem.get('prop:GameCapSurfSharingCurrent', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('prop:GameCapSurfSharingCurrent', this._srcId, this._id,
          this._updateId.bind(this))
      }
      this._checkPromise.then(val => {
        resolve(val === '1');
      });
    });
  }

  getBrowserLoadStatus(): Promise<string> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'getBrowserLoadStatus', true)
        this._checkPromise = iItem.get('BrowserLoadStatus', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('BrowserLoadStatus', this._srcId, this._id,
          this._updateId.bind(this))
      }
      this._checkPromise.then(loadStatus => {
        if (loadStatus === 'null') {
          resolve('UNAVAILABLE');
        } else {
          resolve(LoadStatus[loadStatus]);
        }
      });
    });
  }

  isReloadOnShowEnabled(): Promise<boolean> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'isReloadOnShowEnabled', true)
        this._checkPromise = iItem.get('prop:RefreshOnSrcShow', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('prop:RefreshOnSrcShow', this._srcId, this._id,
          this._updateId.bind(this))
      }
      this._checkPromise.then(val => {
        resolve(val === '1');
      });
    });
  }

  enableReloadOnShow(value: boolean): Promise<iSourceHtml> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'enableReloadOnShow', true)
        this._checkPromise = iItem.set('prop:RefreshOnSrcShow', (value ? '1' : '0'), this._id)
      } else {
        this._checkPromise = iItem.wrapSet('prop:RefreshOnSrcShow', (value ? '1' : '0'),
          this._srcId, this._id, this._updateId.bind(this))
      }
      this._checkPromise.then(() => {
         resolve(this);
      });
    });
  }

  isReloadOnSceneEnterEnabled(): Promise<boolean> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'isReloadOnShowEnabled', true)
        this._checkPromise = iItem.get('prop:RefreshOnScnLoad', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('prop:RefreshOnScnLoad', this._srcId, this._id,
          this._updateId.bind(this))
      }
      this._checkPromise.then(val => {
        resolve(val === '1');
      });
    });
  }

  enableReloadOnSceneEnter(value: boolean): Promise<iSourceHtml> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'enableReloadOnShow', true)
        this._checkPromise = iItem.set('prop:RefreshOnScnLoad', (value ? '1' : '0'), this._id)
      } else {
        this._checkPromise = iItem.wrapSet('prop:RefreshOnScnLoad', (value ? '1' : '0'),
          this._srcId, this._id, this._updateId.bind(this))
      }
      this._checkPromise.then(() => {
         resolve(this);
      });
    });
  }

  isSourceAvailable(): Promise<boolean> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'isSourceAvailable', true)
        iItem.get('prop:itemavail', this._id).then(val => {
          resolve(val === '1');
        });
      } else {
        iItem.wrapGet('prop:itemavail', this._srcId, this._id, this._updateId.bind(this)).then(val => {
          resolve(val === '1');
        });
      }
    });
  }
}