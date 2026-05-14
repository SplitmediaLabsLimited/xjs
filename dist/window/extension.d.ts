import { EventEmitter } from '../util/eventemitter';
/** This utility class represents the extension window. It allows manipulation
 *  of the window (e.g., resizing), and also serves as an event emitter
 *  for all events that the window should be able to handle.
 *
 *  Currently, the following events are available:
 *    - `scene-load`: notifies in the event of a scene change. Handler is a function f(sceneNumber: number). For Split Mode `scene-load` listens to the changes on the preview window.
 *    - `sources-list-highlight`: notifies when a user hovers over a source in the stage, returning its source id, or when the mouse moves out of a source bounding box, returning null. Source id is also returned when hovering over the bottom panel. Handler is a function f(id: string)
 *    - `sources-list-select`: notifies when a user clicks a source in the stage. Source id is also returned when source is selected from the bottom panel. Handler is a function f(id: string)
 *    - `sources-list-update`: notifies when there are changes on list sources whether on stage or bottom panel. Handler is a function(ids: string) where ids are comma separated source ids.
 *    - `scene-delete` : notifies when a scene is deleted. Handler is a function f(index: number, uid: string). Works only on version 2.8.1606.1601 or higher.
 *    - `scene-add` : notifies when a scene is added. Handler is a function f(index: number, uid: string). Works only on version 2.8.1606.1701 or higher.
 *    - `scene-delete-all` : notifies all scenes are deleted. Handler is a function f(type: newpres/loadpres). Works only on version 3.3.1801.1901 or higher.
 *    - `bscn-load` : notifies when user loads a scene file via XBC, File menu > Load Scene...
  *   - `push-to-live` : notifies when a particular scene was pushed to live by user. Handler is a function f(sceneIndex: number).
 *
 *  Use the `on(event: string, handler: Function)` function to listen to an event.
 *
 */
export declare class ExtensionWindow extends EventEmitter {
    private static _instance;
    static _subscriptions: string[];
    static _encounteredFirstSceneChange: boolean;
    /**
     * ** For deprecation, the need for getting the instance of an ExtensionWindow looks redundant,
     * `** since an ExtensionWinow should technically have a single instance`
     *
     * Gets the instance of the window utility. Use this instead of the constructor.
     */
    static getInstance(): ExtensionWindow;
    /**
     *  ** For Deprecation
     *
     *  Use getInstance()
     */
    constructor();
    /**
     *  param: (event: string, ...params: any[])
     *
     *  Allows this class to emit an event.
     */
    static emit(event: string, ...params: any[]): void;
    /**
     *  param: (event: string, handler: Function)
     *
     *  Allows listening to events that this class emits.
     *
     */
    static on(event: string, handler: Function): Promise<any>;
    static off(event: string, handler: Function): void;
    /** param: (width: number, height: number)
     *
     *  Resizes this extension's window.
     */
    static resize(width: number, height: number): void;
    /**
     * `** For deprecation, please use the static method instead`
     */
    resize(width: number, height: number): void;
    static _value: string;
    /**
     * param: (value: string)
     *
     * Renames the extension window.
     */
    static setTitle(value: string): Promise<any>;
    /**
     * `** For deprecation, please use the static method instead`
     */
    setTitle(value: string): Promise<any>;
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
    static setBorder(flag: number): void;
    /**
     * `** For deprecation, please use the static method instead`
     * */
    setBorder(flag: number): void;
    /**
     * Closes this extension window
     */
    static close(): void;
    /**
     * `** For deprecation, please use the static method instead`
     * */
    close(): void;
    /**
     * Disable Close Button on this extension's window
     */
    static disableClose(): void;
    /**
     * `** For deprecation, please use the static method instead`
     * */
    disableClose(): void;
    /**
     * Enable Close Button on this extension's window
     */
    static enableClose(): void;
    /**
     * `** For deprecation, please use the static method instead`
     * */
    enableClose(): void;
}
