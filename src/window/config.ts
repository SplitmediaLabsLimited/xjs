/// <reference path="../../defs/es6-promise.d.ts" />

import {EventEmitter} from '../util/eventemitter';
import {exec} from '../internal/internal';

/** This utility class exposes functionality for source plugin developers to
 *  handle the configuration window for their source plugins. The framework also
 *  uses this class for its own internal purposes.
 *
 *  Developers can use this class to specify how their configuration HTML
 *  should be rendered within the built-in window in XSplit Broadcaster.
 *  This class also serves as an event emitter for specific important events.
 *
 *  At the moment, the only relevant event for developers is:
 *  - ```set-selected-tab```: used when using Tabbed mode. Passes the name of the selected tab so configuration window can update itself accordingly.
 *
 *  Use the ```on(event: string, handler: Function)``` function to listen to an event.
 */
export class SourceConfigWindow extends EventEmitter {
  private static _instance: SourceConfigWindow;
  private _mode;
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
      }
    }.bind(this));

    this.on('config-load', () => {
      this._informConfigLoaded();
    });

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
    this._mode = renderMode;
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

  private _informConfigLoaded() {
    this._notify({ event: 'load' });
  }

  /**
   *  param: width<number>, height<number>
   *
   *  Resizes the configuration window.
   */
  resizeConfig(width: number, height: number) {
    if (this._mode === 'full') {
      this._notify({
        event: 'resize',
        value: JSON.stringify({
          width: width,
          height: height
        })
      });
    }
    else if (this._mode !== 'embedded'){
      exec('SetDialogSize', String(width), String(height));
    }
  };

  /** Closes the configuration window. */
  closeConfig() {
    exec('Close');
  };
}
