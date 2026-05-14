export declare class Logger {
    static onceWarningsShown: {};
    static onceMessage: string;
    static warnMessage: string;
    static log(message: string): void;
    static warn(type: string, warnCaller: string, once?: boolean): void;
}
