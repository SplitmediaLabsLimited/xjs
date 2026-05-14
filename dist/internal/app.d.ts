import { JSON as JXON } from './util/json';
export declare class App {
    /** Get the value of the given property */
    static get(name: string): Promise<string>;
    /** Sets the value of a property */
    static set(name: string, value: string): Promise<boolean>;
    /** Gets the value of the given property as list */
    static getAsList(name: string): Promise<JXON[]>;
    /** Gets all the items of the given condition as list */
    static getAsItemList(name: string): Promise<JXON[]>;
    /** Get the value of the given global property */
    static getGlobalProperty(name: string): Promise<any>;
    /** Calls a DLL function synchronously */
    static callDll(func: string, ...arg: string[]): Promise<string>;
    /** Calls an application method asynchronously */
    static callFunc(func: string, ...args: string[]): Promise<string>;
    static postMessage(key: string, ...args: any[]): Promise<string>;
}
