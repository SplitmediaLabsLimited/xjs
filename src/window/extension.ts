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
 *  Currently, the following events are available:
 *    - `scene-load`: notifies in the event of a scene change. Handler is a function f(sceneNumber: number)
 *    - `sources-list-highlight`: notifies when a user hovers over a source in the stage, returning its source id, or when the mouse moves out of a source bounding box, returning null. Source id is also returned when hovering over the bottom panel. Handler is a function f(id: string)
 *    - `sources-list-select`: notifies when a user clicks a source in the stage. Handler is a function f(id: string)
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
  
  /**
   * param (flag: number)
   *
   * Modifies this extension's window border.
   *
   * "4" is th e base command on setting border flags.
   * 
   * Flags can be:
   *     (bit 0 - enable border)
   *     (bit 1 - enable caption)
   *     (bit 2 - enable sizing)
   *     (bit 3 - enable minimize btn)
   *     (bit 4 - enable maximize btn)
   */
  setBorder(flag: number){
    App.postMessage("4", String(flag));
  }

  /**
   * Closes this extension window
   */
  close() {
    App.postMessage("1");
  }

  /**
   * Disable Close Button on this extension's window
   */
  disableClose() {
    App.postMessage("5","0")
  }

  /**
   * Enable Close Button on this extension's window
   */
  enableClose() {
    App.postMessage("5", "1")
  }
}

if (Environment.isExtension()) {
  window.OnSceneLoad = function(view: number, scene: number) {
    if (Number(view) === 0) { // only emit events when main view is changing
      ExtensionWindow.getInstance().emit('scene-load', Number(scene));
    }
  };

  window.SourcesListHighlight = (view, id) => {
    if (view === 0) { // main view {
      ExtensionWindow.getInstance().emit('sources-list-highlight', id === '' ?
        null : id);
    }
  };

  window.SourcesListSelect = (view, id) => {
    if (view === 0) { // main view
      ExtensionWindow.getInstance().emit('sources-list-select', id === '' ?
        null : id);
    }
  };
}
