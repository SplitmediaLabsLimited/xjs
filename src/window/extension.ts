/// <reference path="../../defs/es6-promise.d.ts" />

import {Environment} from '../core/environment';
import {EventEmitter} from '../util/eventemitter';
import {EventManager} from '../internal/eventmanager';
import {JSON as JXON} from '../internal/util/json';
import {Scene} from '../core/scene';
import {exec} from '../internal/internal';
import {App} from '../internal/app';
import {ViewTypes} from '../core/items/item';
import {Extension} from '../core/extension'
import {splitMode} from '../internal/util/splitmode'

const _RESIZE = '2';

/** This utility class represents the extension window. It allows manipulation
 *  of the window (e.g., resizing), and also serves as an event emitter
 *  for all events that the window should be able to handle.
 *
 *  Currently, the following events are available:
 *    - `scene-load`: notifies in the event of a scene change. Handler is a function f(sceneNumber: number). For Split Mode `scene-load` listens to the changes on the preview window.
 *    - `sources-list-highlight`: notifies when a user hovers over a source in the stage, returning its source id, or when the mouse moves out of a source bounding box, returning null. Source id is also returned when hovering over the bottom panel. Handler is a function f(id: string)
 *    - `sources-list-select`: notifies when a user clicks a source in the stage. Source id is also returned when source is selected from the bottom panel. Handler is a function f(id: string)
 *    - `sources-list-update`: notifies when there are changes on list sources whether on stage or bottom panel. Handler is a function(ids: string) where ids are comma separated source ids.
 *    - `scene-delete` : notifies when a user deletes a scene. Handler is a function f(index: number). Works only on version 2.8.1606.1601 or higher.
 *    - `scene-add` : notifies when a user adds a scene. Handler is a function f(index: number). Works only on version 2.8.1606.1701 or higher.
 *
 *  Use the `on(event: string, handler: Function)` function to listen to an event.
 *
 */
export class ExtensionWindow extends EventEmitter {
  private static _instance: ExtensionWindow;
  static _subscriptions: string[] = [];

  /**
   *  param: (event: string, ...params: any[])
   *
   *  Allows this class to emit an event.
   */
  static emit(event: string, ...params: any[]) {
    params.unshift(event);
    try {
      ExtensionWindow
        .emit
        .apply(ExtensionWindow._instance, params);
    } catch(event) {
      ExtensionWindow
        ._instance
        .emit
        .apply(ExtensionWindow._instance, params);
    }
  }

  /**
   *  param: (event: string, handler: Function)
   *
   *  Allows listening to events that this class emits.
   *
   */
  static on(event: string, handler: Function): Promise<any> {
    return new Promise((resolve,reject) => {
      ExtensionWindow.on(event, handler);

      if(event === 'scene-delete') {
        if (ExtensionWindow._subscriptions.indexOf('SceneDeleted') < 0) {
          ExtensionWindow._subscriptions.push('SceneDeleted');
          EventManager.subscribe('SceneDeleted', function(settingsObj) {
            if (Environment.isExtension()) {
              ExtensionWindow.emit(event, settingsObj['index'] === '' ?
              null : Number(settingsObj['index']) + 1);
            }
            resolve(this);
          });
        } else {
          resolve(this);
        }
      } else if(event === 'scene-add') {
        if (ExtensionWindow._subscriptions.indexOf('OnSceneAddByUser') < 0) {
          ExtensionWindow._subscriptions.push('OnSceneAddByUser');
          EventManager.subscribe('OnSceneAddByUser', function(settingsObj) {
            Scene.getSceneCount().then(function(count){
              if (Environment.isExtension()) {
                ExtensionWindow.emit(event, count);
                resolve(this);
              } else {
                reject(Error('ExtensionWindow class is only available for extensions.'));
              }
            });
          });
        } else {
          resolve(this);
        }
      } else if(['sources-list-highlight', 'sources-list-select',
      'sources-list-update', 'scene-load'].indexOf(event) >= 0 ) {
        //Just subscribe to the event. Emitter is already handled.
        if (['sources-list-highlight', 'sources-list-select',
        'sources-list-update'].indexOf(event) >= 0) {
          App.getGlobalProperty('splitmode').then(split => {
            const view = split === '1' ? ViewTypes.PREVIEW : ViewTypes.MAIN
            try{
              exec( 'SourcesListSubscribeEvents',
                view.toString() ).then(res => {
                  resolve(this);
                })
            } catch (ex) {
              // This exception most probably for older versions which
              // would work without subscribing to source list events.
            }
          })
        } else {
          resolve(this);
        }
      } else {
        reject(Error('Warning! The event "' + event + '" is not yet supported.'));
      }
    })
  }

  static off(event: string, handler: Function) {
    ExtensionWindow.off(event, handler);
  }

  /** param: (width: number, height: number)
   *
   *  Resizes this extension's window.
   */
  static resize(width: number, height: number) {
    App.postMessage(_RESIZE, String(width), String(height));
  }

  static _value: string;

  /**
   * param: (value: string)
   *
   * Renames the extension window.
   */
  static setTitle(value: string):Promise<any> {
    return new Promise(resolve => {
      let ext = Extension.getInstance()
      ext.getId().then(id => {
        exec("CallHost", "setExtensionWindowTitle:" + id, value)
        .then(res => {
          resolve(res)
        })
      })
    })
  };

  /**
   * param (flag: number)
   *
   * Modifies this extension's window border.
   *
   * '4' is th e base command on setting border flags.
   *
   * Flags can be:
   *     (bit 0 - enable border)
   *     (bit 1 - enable caption)
   *     (bit 2 - enable sizing)
   *     (bit 3 - enable minimize btn)
   *     (bit 4 - enable maximize btn)
   */
  static setBorder(flag: number){
    App.postMessage('4', String(flag));
  }

  /**
   * Closes this extension window
   */
  static close() {
    App.postMessage('1');
  }

  /**
   * Disable Close Button on this extension's window
   */
  static disableClose() {
    App.postMessage('5','0')
  }

  /**
   * Enable Close Button on this extension's window
   */
  static enableClose() {
    App.postMessage('5', '1')
  }
}

// for extensions
const oldSourcesListUpdate = window.SourcesListUpdate;
window.SourcesListUpdate = (view, sources) => {
  App.getGlobalProperty('splitmode').then(res => {
    const checkSplit = res === '1' ? 1 : 0;
    if (Number(view) === checkSplit) { // main view {
      let propsJSON: JXON = JXON.parse( decodeURIComponent(sources) ),
            propsArr: JXON[] = [],
            ids = [];

      if (propsJSON.children && propsJSON.children.length > 0) {
         propsArr = propsJSON.children;
         for(var i=0; i < propsArr.length; i++){
           ids.push(propsArr[i]['id']);
         }
      }

      ExtensionWindow.emit( 'sources-list-update', ids.join(',') );
    }
    if (typeof oldSourcesListUpdate === 'function') {
      oldSourcesListUpdate(view, sources);
    }
  })
};

const oldSourcesListHighlight = window.SourcesListHighlight;
window.SourcesListHighlight = (view, id) => {
    splitMode().then(checkSplit => {
      if (Number(view) === checkSplit) { // main view {
        ExtensionWindow.emit('sources-list-highlight', id === '' ?
          null : id);
      }
      if (typeof oldSourcesListHighlight === 'function') {
        oldSourcesListHighlight(view, id);
      }
    })
};

const oldSourcesListSelect = window.SourcesListSelect;
window.SourcesListSelect = (view, id) => {
  splitMode().then(checkSplit => {
    if (Number(view) === checkSplit) { // main view
      ExtensionWindow.emit('sources-list-select', id === '' ?
        null : id);
    }
    if (typeof oldSourcesListSelect === 'function') {
      oldSourcesListSelect(view, id);
    }
  })
};

const oldOnSceneLoad = window.OnSceneLoad;
window.OnSceneLoad = function(...args: any[]) {
  splitMode().then(checkSplit => {
    if (Environment.isExtension()) {
      let view = args[0];
      let scene = args[1];
      if (Number(view) === checkSplit && scene !== 'i12'){
        ExtensionWindow.emit('scene-load', Number(scene));
      }
    }

    if (typeof oldOnSceneLoad === 'function') {
      oldOnSceneLoad(...args);
    }
  })
}