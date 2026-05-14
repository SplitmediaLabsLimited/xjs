import { EventEmitter } from '../util/eventemitter';
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
export declare class SourcePropsWindow extends EventEmitter {
    private static _instance;
    private _mode;
    private static _MODE_FULL;
    private static _MODE_TABBED;
    /**
     *  Gets the instance of the window utility. Use this instead of the constructor.
     */
    static getInstance(): SourcePropsWindow;
    /**
     *  Use getInstance() instead.
     */
    constructor();
    private _notify;
    /**
     *  Informs the application that the plugin intends to use the entire window for rendering its configuration.
     */
    useFullWindow(): void;
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
    useTabbedWindow(config: {
        customTabs: string[];
        tabOrder: string[];
    }): void;
    private _setRenderMode;
    private _setTabOrder;
    private _declareCustomTabs;
    private _informConfigLoaded;
    /**
     *  param: width<number>, height<number>
     *
     *  Resizes the properties window. Currently only works when using full
     *  window mode.
     */
    resize(width: number, height: number): void;
    /**
     *  param: name<string>
     *
     *  Changes the title of the source properties dialog.
     *  Note: The title change is temporary, as re-opening the source properties
     *  resets the title to the display name of the source
     *  (custom name takes precedence over name)
     */
    requestDialogTitleChange(name: string): void;
    /** Closes the properties window. */
    close(): Promise<any>;
    /**
     *  param: show<boolean>
     *
     *  Toggles on/off the load indicator of the source properties dialog
     */
    showLoading(show: boolean): void;
}
