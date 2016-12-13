/// <reference path="../../defs/es6-promise.d.ts" />

import {Global} from '../internal/global';
import {Environment} from '../core/environment';
import {EventEmitter} from '../util/eventemitter';
import {EventManager} from '../internal/eventmanager';
import {deleteSceneEventFixVersion, versionCompare, getVersion} from '../internal/util/version';
import {Scene} from '../core/scene';
import {exec} from '../internal/internal';

/** This utility class is used internally by the framework for certain important
 *  processes. This class also exposes certain important events that the source
 *  plugin may emit.
 *
 * Inherits from: {@link #util/EventEmitter Util/EventEmitter}
 *
 *  Currently, the following events are available:
 *    - `save-config`: signals the source that it should save the configuration object. Handler is a function f(config: JSON)
 *    - `apply-config`: signals the source that it should apply the changes that this configuration object describes. Handler is a function f(config: JSON)
 *    - `set-background-color`: only used when the native Color tab is reused and background color is set. Handler is a function f(colorHexNoNumberSign: string)
 *    - `scene-load`: signals the source that the active scene is the scene where it is loaded. Only works on sources loaded in memory
 *    - `scene-delete` : notifies when a user deletes a scene. Handler is a function f(index: number). Works only on version 2.8.1606.1601 or higher.
 *
 *  Use the `on(event: string, handler: Function)` function to listen to an event.
 */
export class SourcePluginWindow extends EventEmitter {
  private static _instance: SourcePluginWindow;
  static _subscriptions: string[];

  /**
   *  Gets the instance of the window utility. Use this instead of the constructor.
   */
  static getInstance() {
    if (SourcePluginWindow._instance === undefined) {
      SourcePluginWindow._instance = new SourcePluginWindow();
    }
    return SourcePluginWindow._instance;
  }

  /**
   *  Use getInstance() instead.
   */
  constructor() {
    super();
    if (!Environment.isSourcePlugin()) {
      throw new Error('SourcePluginWindow class is only available for source plugins');
    }
    this.on('message-source', function(message) {
      if (message.request !== undefined) {
        if (message.request === 'saveConfig') {
          this.emit('save-config', this._hideGlobalConfig(message.data));
        } else if (message.request === 'applyConfig') {
          this.emit('apply-config', this._hideGlobalConfig(message.data));
        }
      }
    });

    SourcePluginWindow._instance = this;
  }

  /**
   *  param: (event: string, ...params: any[])
   *
   *  Allows this class to emit an event.
   */
  static emit(event: string, ...params: any[]) {
    params.unshift(event);
    SourcePluginWindow
      .getInstance()
      .emit
      .apply(SourcePluginWindow._instance, params);
  }

  /**
   *  param: (event: string, handler: Function)
   *
   *  Allows listening to events that this class emits. 
   *
   */
  static on(event: string, handler: Function) {
    SourcePluginWindow.getInstance().on(event, handler);
    
    let isDeleteSceneEventFixed = versionCompare(getVersion()).is.greaterThanOrEqualTo(deleteSceneEventFixVersion);

    if(event === 'scene-delete' && isDeleteSceneEventFixed) {
      if (SourcePluginWindow._subscriptions.indexOf('SceneDeleted') < 0) {
        EventManager.subscribe("SceneDeleted", function(settingsObj) {
          SourcePluginWindow.emit(event, settingsObj['index'] === '' ? null : settingsObj['index']);
        });
      }
    } else if(['set-background-color', 'set-background-color', 'apply-config', 'save-config'].indexOf(event) >= 0 ) {

      //Just register the events so not to throw warning. Emitter already created.

    } else {
      console.warn('Warning! The event "' + event + '" is not yet supported on this version.');
    }  

  }

  // We modify the configuration sent from the source properties window
  // so that we do not see 'persistent' configuration such as config-url.
  // When saving, this is restored back to the config object through
  // Item#saveConfig().
  //
  // Note that we could have chosen to hide this from Item#requestSaveConfig()
  // or Item#applyConfig() calls, but unfortunately, the context of the source
  // properties window cannot always correctly determine the global config nodes
  // when dealing with sources other than the current source (right-clicked.)
  private _hideGlobalConfig(data: any) {
    let persist = Global.getPersistentConfig();

    for (var key in persist) {
      delete data[key];
    }

    return data;
  }
}

// for source plugins
window.MessageSource = function(message: string) {
  SourcePluginWindow.emit('message-source',
    JSON.parse(message));
};

window.SetConfiguration = function(configObj: string) {
  try {
    var data = JSON.parse(configObj);
    SourcePluginWindow.emit('apply-config', data);
    SourcePluginWindow.emit('save-config', data);
  } catch (e) {
    // syntax error probably happened, exit gracefully
    return;
  }
};

window.setBackGroundColor = function(color: string) {
  SourcePluginWindow.emit('set-background-color', color);
};

let prevOnSceneLoad = window.OnSceneLoad;
window.OnSceneLoad = function(...args: any[]) {
  if (Environment.isSourcePlugin()) {
    SourcePluginWindow.emit('scene-load');
  }

  if (prevOnSceneLoad !== undefined) {
    prevOnSceneLoad(...args)
  }
}