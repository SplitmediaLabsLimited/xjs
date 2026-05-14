export declare class Global {
    private static persistedConfig;
    private static initialPromises;
    private static listenToItemAdd;
    static addInitializationPromise(promise: Promise<any>): void;
    static getInitializationPromises(): Promise<any>[];
    static setPersistentConfig(config: {}): void;
    static getPersistentConfig(): {};
    static isListenToItemAdd(): boolean;
    static setListenToItemAdd(): void;
}
