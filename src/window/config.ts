/// <reference path="../../defs/es6-promise.d.ts" />

import {Environment} from '../core/environment';
import {EventEmitter} from '../util/eventemitter';
import {exec} from '../internal/internal';
import {Remote} from '../internal/remote';

/** This utility class exposes functionality for source plugin developers to
 *  handle the properties window for their source plugins. The framework also
 *  uses this class for its own internal purposes.
 *
 *  Developers can use this class to specify how their configuration HTML
 *  should be rendered within the built-in window in XSplit Broadcaster.
 *  This class also serves as an event emitter for specific important events.
 *
 * Inherits from: {@link #util/EventEmitter Util/EventEmitter}
 *
 *  At the moment, the only relevant event for developers is:
 *    - `set-selected-tab`: used when using Tabbed mode. Passes the name of the selected tab so properties window can update itself accordingly.
 *
 *  Use the `on(event: string, handler: Function)` function to listen to an event.
 */
export class SourcePropsWindow extends EventEmitter {
  private static _instance: SourcePropsWindow;
  private _mode;
  private static _MODE_FULL: string = 'full';
  private static _MODE_TABBED: string = 'embedded';

  /**
   *  Gets the instance of the window utility. Use this instead of the constructor.
   */
  static getInstance() {
    if (SourcePropsWindow._instance === undefined) {
      SourcePropsWindow._instance = new SourcePropsWindow();
    }
    return SourcePropsWindow._instance;
  }

  /**
   *  Use getInstance() instead.
   */
  constructor() {
    super();
    if (!Environment.isSourceProps()) {
      throw new Error('SourcePropsWindow class is only available for source properties');
    }
    if (Remote.remoteType === 'remote') {
      throw new Error("Unable to listen to SourcePropsWindow events through Remote");
    } else {
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

      SourcePropsWindow._instance = this;
    }
  }

  // helper function to communicate with built-in container
  private _notify(obj: {}) {
    window.parent.postMessage(JSON.stringify(obj), '*');
  }

  /**
   *  Informs the application that the plugin intends to use the entire window for rendering its configuration.
   */
  useFullWindow() {
    this._setRenderMode(SourcePropsWindow._MODE_FULL);
    // use default size to avoid layout issues. plugin can resize later
    this.resize(354, 390);
  }

  /**
   *  param: ({customTabs: string[], tabOrder: string[]})
   *
   *  Informs the application that the plugin intends to use the existing tab
   *  system to render its properties window.
   *
   *  The `customTabs` node should contain a list of tab titles that the plugin
   *  will create for itself.
   *
   *  The `tabOrder` node contains the desired order of tabs. This list comes
   *  from the specified custom tabs, and the set of reusable XSplit tabs:
   *  'Color', 'Layout' and 'Transition'.
   */
  useTabbedWindow(config: { customTabs: string[], tabOrder: string[] }) {
    this._setRenderMode(SourcePropsWindow._MODE_TABBED);
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
   *  Resizes the properties window. Currently only works when using full
   *  window mode.
   */
  resize(width: number, height: number) {
    this._notify({
      event: 'resize',
      value: JSON.stringify({
        width: width,
        height: height
      })
    });
  };

  /**
   *  param: name<string>
   *
   *  Changes the title of the source properties dialog.
   *  Note: The title change is temporary, as re-opening the source properties
   *  resets the title to the display name of the source
   *  (custom name takes precedence over name)
   */
  requestDialogTitleChange(name: string) {
    this._notify({
      event: 'change-dialog-title',
      value: name
    });
  };

  /** Closes the properties window. */
  close():Promise<any> {
    return new Promise(resolve => {
      resolve(exec('Close'));
    })
  };

  /**
   *  param: show<boolean>
   *
   *  Toggles on/off the load indicator of the source properties dialog
   */
  showLoading(show: boolean) {
    this._notify({
      event: 'show-overlay',
      value: show
    }); 
  }
}
