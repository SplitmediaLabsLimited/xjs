export declare class EventEmitter {
    private _handlers;
    static _remoteHandlers: {};
    static _proxyHandlers: {};
    /** This function attaches a handler to an event. Duplicate handlers are allowed. */
    on(event: string, handler: Function, _id?: string): void;
    /** This function removes a handler to an event.*/
    off(event: string, handler: Function): void;
    /** This function lets an event trigger with any number of supplied parameters. */
    emit(event: string, ...params: any[]): void;
    static _setCallback(message: string): Promise<unknown>;
    static _finalCallback(message: string): Promise<void>;
}
