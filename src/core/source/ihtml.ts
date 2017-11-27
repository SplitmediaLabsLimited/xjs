/// <reference path="../../../defs/es6-promise.d.ts" />

import {exec} from '../../internal/internal';
import {Item as iItem} from '../../internal/item';
import {Rectangle} from '../../util/rectangle';
import {Environment} from '../environment';
import {Logger} from '../../internal/util/logger';

export interface ISourceHtml {
  url(value?: string): Promise<string|ISourceHtml>
  browserTransparency(value?: boolean): Promise<boolean|ISourceHtml>
  browser60FPS(value?: boolean): Promise<boolean|ISourceHtml>
  browserCustomSize(value?: Rectangle): Promise<Rectangle|ISourceHtml>
  allowRightClick(value?: boolean): Promise<boolean|ISourceHtml>
  browserJS(value?: string): Promise<string|ISourceHtml>
  browserJSEnabled(value?: boolean): Promise<boolean|ISourceHtml>
  customCSS(value?: string): Promise<string|ISourceHtml>
  customCSSEnabled(value?: boolean): Promise<boolean|ISourceHtml>

  /**
   * param: (func: string, arg: string)
   * ```
   * return: Promise<HtmlSource>
   * ```
   *
   * Allow this source to call a pre-exposed function within the HTML Source
   */
  call(func: string, arg: string): Promise<ISourceHtml>

  // /**
  //  * return: Promise<string>
  //  *
  //  * Gets the URL of this webpage source.
  //  */
  // getURL(): Promise<string>

  // /**
  //  * param: (url: string)
  //  * ```
  //  * return: Promise<HtmlSource>
  //  * ```
  //  *
  //  * Sets the URL of this webpage source.
  //  *
  //  * *Chainable.*
  //  */
  // setURL(value: string): Promise<ISourceHtml>

  // /**
  //  * return: Promise<boolean>
  //  *
  //  * Check if browser is rendered transparent
  //  */
  // isBrowserTransparent(): Promise<boolean>

  // /**
  //  * param: Promise<boolean>
  //  *
  //  * return: Promise<ISourceHtml>
  //  */
  // enableBrowserTransparency(value: boolean): Promise<ISourceHtml>

  // /**
  //  * return: Promise<boolean>
  //  *
  //  * Check if browser can render up to a maximum of 60FPS
  //  */
  // isBrowser60FPS(): Promise<boolean>

  // /**
  //  * param: Promise<boolean>
  //  *
  //  * return: Promise<ISourceHtml>
  //  */
  // enableBrowser60FPS(value: boolean): Promise<ISourceHtml>

  // /**
  //  * return: Promise<Rectangle>
  //  *
  //  * Gets the custom browser window size (in pixels) for the item, if set,
  //  * regardless of its layout on the mixer. Returns a (0, 0) Rectangle if no
  //  * custom size has been set.
  //  */
  // getBrowserCustomSize(): Promise<Rectangle>

  // /**
  //  * param: Promise<Rectangle>
  //  *
  //  * return: Promise<ISourceHtml>
  //  *
  //  * Set the custom brower window size (in pixels) for the item
  //  */
  // setBrowserCustomSize(value: Rectangle): Promise<ISourceHtml>

  // /**
  //  * return: Promise<boolean>
  //  *
  //  * Check if right click events are sent to the item or not.
  //  */
  // getAllowRightClick(): Promise<boolean>

  // /**
  //  * param: (value:boolean)
  //  *
  //  * return: Promise<ISourceHtml>
  //  *
  //  * Allow or disallow right click events to be sent to the item. Note that
  //  * you can only catch right click events using `mouseup/mousedown`
  //  */
  // setAllowRightClick(value: boolean): Promise<ISourceHtml>

  // /**
  //  * return: Promise<string>
  //  *
  //  * Gets the javascript commands to be executed on item upon load
  //  */
  // getBrowserJS(): Promise<string>

  // /**
  //  * param: (js: string, refresh: boolean = false)
  //  *
  //  * return: Promise<ISourceHtml>
  //  *
  //  * Sets the javascript commands to be executed on item
  //  * right upon setting and on load. Optionally set second parameter
  //  * to true to refresh item (needed to clean previously executed JS code.)
  //  *
  //  * *Chainable.*
  //  */
  // setBrowserJS(value: string): Promise<ISourceHtml>

  // /**
  //  * return: Promise<boolean>
  //  *
  //  * Gets if BrowserJS is enabled and executed on load
  //  */
  // isBrowserJSEnabled(): Promise<boolean>

  // /**
  //  * param: (value: boolean)
  //  *
  //  * return: Promise<ISourceHtml>
  //  *
  //  * Enables or disables execution of the set BrowserJs upon load.
  //  */
  // enableBrowserJS(value: boolean): Promise<ISourceHtml>

  // /**
  //  * return: Promise<string>
  //  *
  //  * Gets the custom CSS applied to the document upon loading
  //  */
  // getCustomCSS(): Promise<string>

  // /**
  //  * param: (value: string)
  //  *
  //  * return: Promise<ISourceHtml>
  //  *
  //  * Sets the custom CSS to be applied to the document upon loading
  //  */
  // setCustomCSS(value: string): Promise<ISourceHtml>

  // /**
  //  * return: Promise<boolean>
  //  *
  //  * Gets if custom CSS is enabled and applied to the document on load
  //  */
  // isCustomCSSEnabled(): Promise<boolean>

  // /**
  //  * param: (value: boolean)
  //  *
  //  * return: Promise<ISourceHtml>
  //  *
  //  * Enables or disables application of custom CSS to the document
  //  */
  // enableCustomCSS(value: boolean): Promise<ISourceHtml>

  /**
   * return: Promise<boolean>
   *
   * Gets if browser instance is optimized via surface sharing
   */
  isBrowserOptimized(): Promise<boolean>
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
   * return: Promise<HtmlSource>
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

  url(value?: string): Promise<string|iSourceHtml> {
    return new Promise((resolve, reject) => {
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'url',  true)
      }

      if (this._isItemCall && value) {
        this._checkPromise = iItem.get('prop:srcitem', this._id)
      } else if (!this._isItemCall && value) {
        this._checkPromise = iItem.wrapGet('prop:srcitem', this._srcId, this._id,
        this._updateId.bind(this))
      } else if (this._isItemCall && !value) {
        this._checkPromise = iItem.get('prop:srcitem', this._id)
      }  else if (!this._isItemCall && !value) {
        this._checkPromise = iItem.wrapGet('prop:srcitem', this._srcId, this._id,
        this._updateId.bind(this))
      }

      this._checkPromise.then(url => {
        let _url = String(url).split('*');
        url = _url[0];
        if (!value) {
          resolve(url);
        } else {
          return iItem.set('prop:srcitem', _url.join('*'), this._id);
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

  browserTransparency(value?: boolean): Promise<boolean|iSourceHtml> {
    return new Promise(resolve => {
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'browserTransparency',  true)
      }

      if (this._isItemCall && value) {
        this._checkPromise = iItem.set('prop:BrowserTransparent', (value ? '1' : '0'),
        this._id)
      } else if (!this._isItemCall && value) {
        this._checkPromise = iItem.wrapSet('prop:BrowserTransparent', (value ? '1' : '0'),
        this._srcId, this._id, this._updateId.bind(this))
      } else if (this._isItemCall && !value) {
        this._checkPromise = iItem.get('prop:BrowserTransparent', this._id)
      }  else if (!this._isItemCall && !value) {
        this._checkPromise = iItem.wrapGet('prop:BrowserTransparent', this._srcId, this._id,
        this._updateId.bind(this))
      }

      this._checkPromise.then(isTransparent => {
        if (isTransparent) {
          resolve(isTransparent === '1');
        } else { resolve(this) }
      });
    });
  }

  browser60FPS(value?: boolean): Promise<boolean|iSourceHtml> {
    return new Promise(resolve => {
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'browser60FPS',  true)
      }

      if (this._isItemCall && value) {
        this._checkPromise = iItem.get('prop:Browser60fps', this._id);
      } else if (!this._isItemCall && value) {
        this._checkPromise = iItem.wrapGet('prop:Browser60fps', this._srcId, this._id,
        this._updateId.bind(this))
      } else if (this._isItemCall && !value) {
        this._checkPromise = iItem.get('prop:Browser60fps', this._id);
      }  else if (!this._isItemCall && !value) {
        this._checkPromise = iItem.wrapGet('prop:Browser60fps', this._srcId, this._id,
        this._updateId.bind(this))
      }

      this._checkPromise.then(isBrowser60FPS => {
        if ((isBrowser60FPS === '1') !== value) {
          iItem.set('prop:Browser60fps',  (value ? '1' : '0'), this._id)
          .then(()=>{ resolve(this) })
        } else {
          resolve(isBrowser60FPS === '1');
        }
        resolve(this);
      });
    });
  }

  browserCustomSize(value?: Rectangle): Promise<Rectangle|iSourceHtml> {
    return new Promise(resolve => {
      let customSize;
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'browserCustomSize',  true)
      }

      if (this._isItemCall && value) {
        this._checkPromise = iItem.set('prop:BrowserSize', value.toDimensionString(), this._id)
      } else if (!this._isItemCall && value) {
        this._checkPromise = iItem.wrapSet('prop:BrowserSize', value.toDimensionString(),
        this._srcId, this._id, this._updateId.bind(this))
      } else if (this._isItemCall && !value) {
        this._checkPromise = iItem.get('prop:BrowserSize', this._id)
      }  else if (!this._isItemCall && !value) {
        this._checkPromise = iItem.wrapGet('prop:BrowserSize', this._srcId, this._id,
        this._updateId.bind(this))
      }

      this._checkPromise.then(val => {
        if (value) {
          resolve(this)
        } else {
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
        }
      });
    });
  }

  allowRightClick(value?: boolean): Promise<boolean|iSourceHtml> {
    return new Promise(resolve => {
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'allowRightClick',  true)
      }

      if (this._isItemCall && value) {
        this._checkPromise = iItem.set('prop:BrowserRightClick', (value ? '1' : '0'), this._id)
      } else if (!this._isItemCall && value) {
        this._checkPromise = iItem.wrapSet('prop:BrowserRightClick', (value ? '1' : '0'),
        this._srcId, this._id, this._updateId.bind(this))
      } else if (this._isItemCall && !value) {
        this._checkPromise = iItem.get('prop:BrowserRightClick', this._id)
      }  else if (!this._isItemCall && !value) {
        this._checkPromise = iItem.wrapGet('prop:BrowserRightClick', this._srcId, this._id,
        this._updateId.bind(this))
      }

      this._checkPromise.then(val => {
        if(val) {
          resolve(val === '1');
        } else {
          resolve(this);
        }
      });
    });
  }

  browserJS(value?: string, refresh = false): Promise<string|iSourceHtml> {
    return new Promise((resolve, reject) => {
      let customObject = {};
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'browserJS',  true)
      }

      if (this._isItemCall && value) {
        this._checkPromise = iItem.get('prop:custom', this._id)
      } else if (!this._isItemCall && value) {
        this._checkPromise = iItem.wrapGet('prop:custom', this._srcId, this._id,
        this._updateId.bind(this))
      } else if (this._isItemCall && !value) {
        this._checkPromise = iItem.get('prop:custom', this._id)
      }  else if (!this._isItemCall && !value) {
        this._checkPromise = iItem.wrapGet('prop:custom', this._srcId, this._id,
        this._updateId.bind(this))
      }

      this._checkPromise.then(custom => {
        let customJS = '';
        let customCSS = '';
        let scriptString = ' ';
        let scriptEnabled = true;
        let cssEnabled = true;
        if (value) {
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
        } else {
          try {
            let customObject = JSON.parse(custom);
            if (customObject.hasOwnProperty('customJS')) {
              customJS = customObject['customJS'];
            }
          }
          catch(e) {

          }
          resolve(customJS);
        }
      }).then(() => {
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

  browserJSEnabled(value?: boolean, refresh = false): Promise<boolean|iSourceHtml> {
    return new Promise((resolve, reject) => {
      let customObject = {};
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'browserJSEnabled',  true)
      }

      if (this._isItemCall && value) {
        this._checkPromise = iItem.get('prop:custom', this._id)
      } else if (!this._isItemCall && value) {
        this._checkPromise = iItem.wrapGet('prop:custom', this._srcId, this._id,
          this._updateId.bind(this))
      } else if (this._isItemCall && !value) {
        this._checkPromise = iItem.get('prop:custom', this._id)
      }  else if (!this._isItemCall && !value) {
        this._checkPromise = iItem.wrapGet('prop:custom', this._srcId, this._id,
        this._updateId.bind(this))
      }

      this._checkPromise.then(custom => {
        let customJS = '';
        let customCSS = '';
        let scriptString = ' ';
        let scriptEnabled = true;
        let enabled = true;
        if (value) {
          try {
            customObject = JSON.parse(custom);
            if (customObject.hasOwnProperty('cssEnabled')) {
              enabled = (customObject['cssEnabled'] == 'true');
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

          customObject['cssEnabled'] = enabled.toString();
          customObject['scriptEnabled'] = value.toString();
          customObject['customJS'] = customJS;
          customObject['customCSS'] = customCSS;

          if (enabled === true) {
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
        } else {
          try {
            let customObject = JSON.parse(custom);
            if (customObject.hasOwnProperty('scriptEnabled')) {
              enabled = (customObject['scriptEnabled'] == 'true');
            }
          }
          catch(e) {

          }
          resolve(enabled);
        }
      }).then(() => {
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

  customCSS(value?: string): Promise<string|iSourceHtml> {
    return new Promise((resolve, reject) => {
      let customObject = {};
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'customCSS',  true)
      }

      if (this._isItemCall && value) {
        this._checkPromise = iItem.get('prop:custom', this._id)
      } else if (!this._isItemCall && value) {
        this._checkPromise = iItem.wrapGet('prop:custom', this._srcId, this._id,
          this._updateId.bind(this))
      } else if (this._isItemCall && !value) {
        this._checkPromise = iItem.get('prop:custom', this._id)
      }  else if (!this._isItemCall && !value) {
        this._checkPromise = iItem.wrapGet('prop:custom', this._srcId, this._id,
          this._updateId.bind(this))
      }

      this._checkPromise.then(custom => {
        let customJS = '';
        let customCSS = '';
        let scriptString = ' ';
        let scriptEnabled = true;
        let cssEnabled = true;
        if (!value) {
          try {
            let customObject = JSON.parse(custom);
            if (customObject.hasOwnProperty('customCSS')) {
              customCSS = customObject['customCSS'];
            }
          }
          catch(e) {

          }
          resolve(customCSS);
        } else {
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
        }
      }).then(() => {
        return iItem.set('prop:custom', JSON.stringify(customObject), this._id);
      })
      .then(() => {
        resolve(this);
      });
    });
  }

  customCSSEnabled(value?: boolean): Promise<boolean|iSourceHtml> {
    return new Promise((resolve, reject) => {
      let customObject = {};
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'customCSSEnabled',  true)
      }

      if (this._isItemCall && value) {
        this._checkPromise = iItem.get('prop:custom', this._id)
      } else if (!this._isItemCall && value) {
        this._checkPromise = iItem.wrapGet('prop:custom', this._srcId, this._id,
          this._updateId.bind(this))
      } else if (this._isItemCall && !value) {
        this._checkPromise = iItem.get('prop:custom', this._id)
      }  else if (!this._isItemCall && !value) {
        this._checkPromise = iItem.wrapGet('prop:custom', this._srcId, this._id,
          this._updateId.bind(this))
      }

      this._checkPromise.then(custom => {
        let customJS = '';
        let customCSS = '';
        let scriptString = ' ';
        let scriptEnabled = true;
        let enabled = true;
        if (value) {
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
        } else {
          try {
            let customObject = JSON.parse(custom);
            if (customObject.hasOwnProperty('cssEnabled')) {
              enabled = (customObject['cssEnabled'] == 'true');
            }
          }
          catch(e) {

          }
          resolve(enabled);
        }
      }).then(() => {
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
}