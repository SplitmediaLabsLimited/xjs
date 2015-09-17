/// <reference path="../../defs/es6-promise.d.ts" />

import {Rectangle} from '../util/rectangle';
import {EventEmitter} from '../util/eventemitter';
import {Environment} from '../core/environment';
import {exec} from '../internal/internal';

/**
 *  This class is used to spawn new browser processes that can be used to open
 *  other URLS. Source plugins do not have this functionality (but their
 *  configuration windows may use this.)
 *
 *  Note that opening a new dialog replaces the old one.
 */
export class Dialog{
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
   */
  static createAutoDialog(url: string): Dialog {
    let dialog = new Dialog();
    dialog._url = url;
    dialog._autoclose = true;
    return dialog;
  }

  /**
   *  param: (result: string)
   *
   *  Closes this dialog with an optional string result.
   */
  static return(result ?: string) {
    if (result !== undefined) {
      exec('SetDialogResult', result);
    }

    exec('Close');
  }

  /**
   *  return: Dialog
   *
   *  After configuring the dialog, call this function to spawn it.
   */
  show(): Dialog {
    if (this._autoclose) {
      exec('NewAutoDialog', this._url, '', this._size === undefined ?
        undefined : (this._size.getWidth() + ',' + this._size.getHeight()));
    } else {
      exec('NewDialog', this._url, '', this._size === undefined ?
        undefined : (this._size.getWidth() + ',' + this._size.getHeight()),
        this._calculateFlags(),
        this._title)
    }

    return this;
  }

  /**
   *  return: Promise<string>
   *
   *  Gets the string result returned from the spawned dialog.
   */
  getResult(): Promise<string> {
    return new Promise(resolve => {
      let eventListener = (e) => {
        // self-deleting event listener
        e.target.removeEventListener(e.type, eventListener);
        resolve(e.detail);
      }

      document.addEventListener('xsplit-dialog-result', eventListener);
    });
  }

  /**
   *  Closes the created dialog.
   */
  close(): void {
    exec('CloseDialog');
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

if (Environment.isSourceConfig() || Environment.isExtension()) {
  window.OnDialogResult = function(result) {
    document.dispatchEvent(new CustomEvent('xsplit-dialog-result', {
      detail: result }));
  }
}
