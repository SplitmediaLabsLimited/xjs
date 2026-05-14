import { EventEmitter } from '../util/eventemitter';
/**
 * The LanguageInfo class allows access to the change in language made in
 * XSplit Broadcaster.
 * This function is not available on Source Properties.
 *
 * This function can be set on both Extensions and Sources.
 * `language-change` event is emitted.
 *
 * Use the `on("language-change", handler: Function)` function to listent to this event.
 *
 *
 */
export declare class LanguageInfo extends EventEmitter {
    static _emitter: LanguageInfo;
    /**
     * param: (event:string, ...params: any[])
     *
     * Allows this class to emit an event.
     */
    static emit(event: string, ...params: any[]): void;
    /**
     * param: (event: string, handler: Function)
     *
     * Allows listening to the event this class emits.
     *
     * #### Usage:
     *
     * ```javascript
     * xjs.LanguageInfo.on('language-change', function(res) {
     *   var lang = res
     *   //Do other manipulation here
     * })
     * ```
     *
     */
    static on(event: string, handler: Function): void;
    static getCode(): Promise<string>;
}
