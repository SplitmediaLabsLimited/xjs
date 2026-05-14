import { EventEmitter } from './eventemitter';
export declare class AddToSceneEventEmitter extends EventEmitter {
    private static _instance;
    constructor();
    static getInstance(): AddToSceneEventEmitter;
}
export declare function guid(a: any): string;
export declare function addToSceneHandler(cmd: string, ...args: string[]): Promise<any>;
