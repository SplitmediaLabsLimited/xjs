/// <reference path="../../defs/es6-promise.d.ts" />

import {EventEmitter} from '../util/eventemitter';
import {exec} from '../internal/internal';
import {App} from '../internal/app';

const _RESIZE = '2';

/** This utility class represents the extension window. It should allow manipulation
 *  of the window (e.g., resizing), and should also serve as an event emitter
 *  for all events that the window should be able to handle.
 *
 *  Use the ```on(event: string, handler: Function)``` function to listen to an event.
 */
export class ExtensionWindow extends EventEmitter {
  private static _instance: ExtensionWindow;

  static getInstance() {
    if (ExtensionWindow._instance === undefined) {
      ExtensionWindow._instance = new ExtensionWindow();
    }
    return ExtensionWindow._instance;
  }

  constructor() {
    super();

    ExtensionWindow._instance = this;
  }

  /** param: (width: number, height: number)
   *
   *  Resizes this extension's window.
   */
  resize(width: number, height: number) {
    App.postMessage(_RESIZE, String(width), String(height));
  }
}
