import { EventEmitter } from '../util/eventemitter';
/**
 *  The ChannelManager class allows limited access to channels (also termed as outputs)
 *  that are being used or set in XSplit Broadcaster.
 *  This function is not available on Source Properties.
 *
 *  The class also emits events for developers to know when a stream has started
 *  or ended.
 *
 *  The following events are emitted.
 *    - `stream-start`
 *    - `stream-end`
 *    - `recording-renamed`
 *
 *  Use the `on(event: string, handler: Function)` function to listen to events.
 *
 */
export declare class ChannelManager extends EventEmitter {
    static _emitter: ChannelManager;
    /**
     *  param: (event: string, ...params: any[])
     *
     *  Allows this class to emit an event.
     */
    static emit(event: string, ...params: any[]): void;
    static _proxyCallbacks: {};
    static _remoteCallbacks: {};
    /**
     *  param: (event: string, handler: Function)
     *
     *  Allows listening to events that this class emits. Currently there are three:
     *  `stream-start`, `stream-end` and `recording-renamed`.
     *
     *  #### Usage:
     *
     * ```javascript
     * ChannelManager.on('stream-start', function(res) {
     *   if (!res.error) { // No error
     *     var channel = res.channel; // Channel Object
     *     var streamTime = res.streamTime;
     *   }
     * });
     * ```
     */
    static on(event: string, handler: Function): void;
    static off(event: string, handler: Function): void;
}
export declare function _subscribeEventManager(): void;
