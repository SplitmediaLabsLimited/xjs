/// <reference path="../../defs/es6-promise.d.ts" />

import {Environment} from '../core/environment';
import {EventEmitter} from '../util/eventemitter';
import {exec} from '../internal/internal';
import {App} from '../internal/app';

const _RESIZE = '2';

/** This utility class represents the extension window. It allows manipulation
 *  of the window (e.g., resizing), and also serves as an event emitter
 *  for all events that the window should be able to handle.
 *
 *  Currently, only the following event is available:
 *    - `scene-load`: notifies in the event of a scene change. Handler is a function f(sceneNumber: number)
 *
 *  Use the `on(event: string, handler: Function)` function to listen to an event.
 *
 */
export class ExtensionWindow extends EventEmitter {
  private static _instance: ExtensionWindow;

  /**
   *  Gets the instance of the window utility. Use this instead of the constructor.
   */
  static getInstance() {
    if (ExtensionWindow._instance === undefined) {
      ExtensionWindow._instance = new ExtensionWindow();
    }
    return ExtensionWindow._instance;
  }

  /**
   *  Use getInstance() instead.
   */
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

if (Environment.isExtension()) {
  window.OnSceneLoad = function(view: number, scene: number) {
    if (Number(view) === 0) { // only emit events when main view is changing
      ExtensionWindow.getInstance().emit('scene-load', Number(scene));
    }
  };
}
