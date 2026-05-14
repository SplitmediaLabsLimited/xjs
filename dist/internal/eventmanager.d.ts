/**
 * Usage:
 *
 * ```
 * EventManager.subscribe('StreamStart', callback);
 * ```
 *
 * OR
 *
 * ```
 * EventManager.subscribe(['StreamStart', 'StreamEnd'], callback);
 * ```
 */
export declare class EventManager {
    static callbacks: {};
    static _remoteHandlers: {};
    static _proxyHandlers: {};
    static _appEventsList: string[];
    static subscribe(event: any, _cb: any, id?: any): Promise<unknown>;
    static _setCallback(message: string): Promise<unknown>;
    static _finalCallback(message: string): Promise<unknown>;
}
