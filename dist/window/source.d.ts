import { EventEmitter } from '../util/eventemitter';
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
export declare class SourcePluginWindow extends EventEmitter {
    private static _instance;
    static _subscriptions: string[];
    /**
     * ** For deprecation, the need for getting the instance of a SourcePluginWindow looks redundant,
     * `** since a SourcePluginWindow should technically have a single instance`
     *
     * Gets the instance of the window utility. Use this instead of the constructor.
     */
    static getInstance(): SourcePluginWindow;
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
    static on(event: string, handler: Function): void;
    static off(event: string, handler: Function): void;
    private _hideGlobalConfig;
}
