/// <reference path="../../defs/es6-promise.d.ts" />

import {MyEventEmitter} from './eventemitter';
import {exec} from '../internal/internal';

/** This utility class exposes functionality for source plugin developers to
 *  handle the configuration window for their source plugins.
 *
 *  Developers can use this class to specify how their configuration HTML
 *  should be rendered within the built-in window in XSplit Broadcaster.
 *  This class also serves as an event emitter for specific important events.
 *
 *  The framework also uses this class for its own internal purposes.
 */
export class SourceConfigWindow extends MyEventEmitter {
  private static _instance: SourceConfigWindow;

  private static _MODE_FULL: string = 'full';
  private static _MODE_TABBED: string = 'embedded';

  static getInstance() {
    if (SourceConfigWindow._instance === undefined) {
      SourceConfigWindow._instance = new SourceConfigWindow();
    }
    return SourceConfigWindow._instance;
  }

  constructor() {
    super();
    window.addEventListener('message', function(event) {
      try {
        var data = JSON.parse(event.data);
      } catch (e) {
        // syntax error probably happened, exit gracefully
        return;
      }

      switch(data.event) {
        // currently, restrict messages to selected set
        case 'set-selected-tab':
          this.emit(data.event, data.value);
          break;
        case 'async-callback':
          this.emit(data.event, {
              asyncId : data.value.asyncId,
              result  : data.value.result
            });
          break;
        case 'config-load':
          this.emit(data.event);
          break;
      }
    }.bind(this));

    SourceConfigWindow._instance = this;
  }

  // helper function to communicate with built-in container
  private _notify(obj: {}) {
    window.parent.postMessage(JSON.stringify(obj), '*');
  }

  useFullWindow() {
    this._setRenderMode(SourceConfigWindow._MODE_FULL);
  }

  useTabbedWindow(config: { customTabs: string[], tabOrder: string[] }) {
    this._setRenderMode(SourceConfigWindow._MODE_TABBED);
    this._declareCustomTabs(config.customTabs);
    this._setTabOrder(config.tabOrder);
  }

  private _setRenderMode(renderMode: string) {
    this._notify({
      event: 'set-mode',
      value: renderMode
    });
  };

  private _setTabOrder(tabArray: string[]) {
    this._notify({
      event: 'set-tab-order',
      value: JSON.stringify(tabArray)
    });
  };

  private _declareCustomTabs(tabArray: string[]) {
    this._notify({
      event: 'set-custom-tabs',
      value: JSON.stringify(tabArray)
    });
  };

  resizeConfig(width: number, height: number) {
    exec('SetDialogSize', width, height);
    this._notify({
      event: 'resize',
      value: JSON.stringify({
        width: width,
        height: height
      })
    });
  };

  closeConfig() {
    exec('Close');
  };
}
