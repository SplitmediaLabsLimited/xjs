/// <reference path="../../defs/es6-promise.d.ts" />
/// <reference path="../../defs/object.d.ts" />
/// <reference path="../../defs/proxy.d.ts" />

import {Rectangle} from '../util/rectangle';
import {EventEmitter} from '../util/eventemitter';
import {Environment} from '../core/environment';
import {exec} from '../internal/internal';
import {Remote} from '../internal/remote';

let dialogProxy: any;

/**
 *  This class is used to spawn new browser processes that can be used to open
 *  other URLs. Source plugins do not have this functionality (but their
 *  properties windows may use this.)
 *
 *  Note that opening a new dialog replaces the old one. Also, dialogs are
 *  considered to be the same type of window as their parent windows: e.g.,
 *  dialogs from extension windows are considered by the framework to have
 *  access to the same functions as extensions.
 *
 *  Most of the methods are chainable.
 *
 *  Sample usage:
 *
 *  ```javascript
 *  var xjs = require('xjs');
 *  var Dialog = xjs.Dialog;
 *
 *  xjs.ready().then(function() {
 *    var button = document.getElementById('openDialogButton');
 *    button.addEventListener('click', function() {
 *      xjs.Dialog.createDialog('your.url/here.html')
 *      .setSize(500, 800)
 *      .setTitle('ThisDialogReturnsAString')
 *      .setBorderOptions(true, false)
 *      .setButtons(true, true)
 *      .show()
 *      .getResult().then(function(result) {
 *        document.getElementById('input').value = result;
 *      });
 *    });
 *  });
 *
 *  // in the opened dialog, call Dialog.return() to return a value
 *  //
 *  // see documentation below for more details
 *  ```
 */
export class Dialog{
  private _result: string;
  private _resultListener: EventListener;

  private _size: Rectangle;
  private _title: string;
  private _url: string;
  private _showBorder: boolean;
  private _resizable: boolean;
  private _autoclose: boolean;
  private _minimize: boolean;
  private _maximize: boolean;

  constructor() {
    if (Environment.isSourcePlugin()) {
      throw new Error('Dialogs are not available for source plugins.');
    } else {
      if (Remote.remoteType === 'remote') {
        throw new Error('Unable to listen to Dialog window events through Remote')
      }
      this._result = null;

      let eventListener = (e) => {
        // self-deleting event listener
        e.target.removeEventListener(e.type, eventListener);

        if (typeof dialogProxy !== 'undefined' && typeof Proxy !== 'undefined') {
          dialogProxy._result = e.detail;
        } else {
          this._result = e.detail;
        }

        this._resultListener = null;
      };

      document.addEventListener('xsplit-dialog-result', eventListener);
      this._resultListener = eventListener;

      return this;
    }
  }

  /**
   *  param: (url: string)
   *
   *  return: Dialog
   *
   *  Creates a Dialog object pointing to a URL. Call the other methods to
   *  modify the dialog's properties, and `show()` to spawn the dialog.
   *
   * *Chainable.*
   */
  static createDialog(url: string): Dialog {
    let dialog = new Dialog();
    dialog._url = url;
    return dialog;
  }

  /**
   *  param: (url: string)
   *
   *  return: Dialog
   *
   *  Creates a Dialog object pointing to a URL, that autocloses on an outside
   *  click. AutoDialogs only have access to the `setSize` and `show` methods.
   *
   * *Chainable.*
   */
  static createAutoDialog(url: string): Dialog {
    if (Environment.isSourceProps()) {
      throw new Error('Auto dialogs are not available for config windows.');
    } else {
      let dialog = new Dialog();
      dialog._url = url;
      dialog._autoclose = true;
      return dialog;
    }
  }

  /**
   *  param: (result ?: string)
   *
   *  Closes this dialog with an optional string result. For more complex
   *  return values, try JSON.stringify. (Call this method from the dialog.)
   *
   *  As an alternative, lightweight dialogs that do not want to include xjs.js
   *  may simply call native XBC methods to return a value.
   *  ```javascript
   *  external.SetDialogResult(stringResult);
   *  external.Close();
   *  ```
   */
  static return(result ?: string):Promise<any> {
    return new Promise(resolve => {
      if (result !== undefined) {
        exec('SetDialogResult', result).then(res => {
          resolve(res);
          exec('Close');
        });
      } else {
        resolve(exec('Close'));
      }
    })
  }

  /**
   *  param: (width: number, height: number)
   *
   *  return: Dialog
   *
   *  Sets the size in pixels of the dialog to be displayed.
   *
   * *Chainable.*
   */
  setSize(width: number = 300, height: number = 300): Dialog {
    this._size = Rectangle.fromDimensions(width, height);
    return this;
  }

  /**
   *  param: (title: string)
   *
   *  return: Dialog
   *
   *  Sets the title of the dialog to be displayed.
   *
   * *Chainable.*
   */
  setTitle(title: string): Dialog {
    if (this._autoclose) {
      throw new Error('Autoclosing dialogs cannot use this method.');
    }

    this._title = title;
    return this;
  }

  /**
   *  param: (showBorder: boolean, resizable: boolean)
   *
   *  return: Dialog
   *
   *  Specifies the border and resizable flags for the dialog to be displayed.
   *
   * *Chainable.*
   */
  setBorderOptions(showBorder: boolean = false,
      resizable: boolean = false): Dialog {
    if (this._autoclose) {
      throw new Error('Autoclosing dialogs cannot use this method.');
    }

    this._showBorder = showBorder;
    this._resizable = resizable;
    return this;
  }

  /**
   *  param: (isMinimizeActive: boolean, isMaximizeActive: boolean)
   *
   *  return: Dialog
   *
   *  Specifies if the window buttons (minimize and maximize) should be active.
   *
   * *Chainable.*
   */
  setButtons(isMinimizeActive: boolean = false,
      isMaximizeActive: boolean = false): Dialog {
    if (this._autoclose) {
      throw new Error('Autoclosing dialogs cannot use this method.');
    }

    this._minimize = isMinimizeActive;
    this._maximize = isMaximizeActive;
    return this;
  }

  /**
   *  return: Dialog
   *
   *  After configuring the dialog, call this function to spawn it.
   *
   * *Chainable.*
   */
  show(): Promise<Dialog> {
    return new Promise(resolve => {
      this._result = null;

      if (this._autoclose) {
        exec('NewAutoDialog', this._url, '', this._size === undefined ?
        undefined : (this._size.getWidth() + ',' +
        this._size.getHeight())).then(result => {
          resolve(this)
        })
      } else {
        exec('NewDialog', this._url, '', this._size === undefined ?
        undefined : (this._size.toDimensionString()),
        this._calculateFlags(),
        this._title).then(result => {
          resolve(this)
        })
      }
    })
  }

  /**
   *  return: Promise<string>
   *
   *  Gets the string result returned from the spawned dialog.
   */
  getResult(): Promise<string> {
    return new Promise(resolve => {
      if (this._result !== null) {
        resolve(this._result);
      } else if (this._resultListener === null) { // no listener yet, attach one

        let eventListener = (e) => {
          // self-deleting event listener
          e.target.removeEventListener(e.type, eventListener);
          this._result = e.detail;
          this._resultListener = null;
          resolve(this._result);
        };

        document.addEventListener('xsplit-dialog-result', eventListener);
        this._resultListener = eventListener;
      } else if(typeof Proxy === 'undefined') {
        Object.observe(this, changes => {
          // Search for changes with the name as result
          let change = changes.filter(elem => {
            return elem.name === '_result';
          });
          if (change !== undefined && change.length > 0) {
            resolve(change[0].object._result);
          }
        })
      } else {
        dialogProxy = new Proxy( this, {
          set: (target, property, value, receiver) => {
            if (property === '_result') {
              this._result = value;
              resolve(value);
            }
            return true;
          }
        });
      }
    });
  }

  /**
   *  Closes the dialog that this window spawned.
   */
  close(): Promise<any> {
    return new Promise(resolve => {
      resolve(exec('CloseDialog'));
    })
  }

  private _calculateFlags(): String {
    let flags = 0;
    if (this._showBorder) { flags += 1; }
    if (this._resizable) { flags += 4; }
    if (this._minimize) { flags += 8; }
    if (this._maximize) { flags += 16; }

    if (this._title || this._minimize || this._maximize) {
      flags += 2;
    }

    return String(flags);
  }
}

const oldOnDialogResult = window.OnDialogResult;
window.OnDialogResult = function(result) {
  if (Environment.isSourceProps() || Environment.isExtension()) {
    document.dispatchEvent(new CustomEvent('xsplit-dialog-result', {
      detail: result }));
  }
  if (typeof oldOnDialogResult === 'function') {
    oldOnDialogResult(result)
  }
}
