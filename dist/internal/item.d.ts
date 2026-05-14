export declare class Item {
    private static baseID;
    private static MAX_SLOTS;
    private static lastSlot;
    private static itemSlotMap;
    private static islockedSourceSlot;
    /** Prepare an item for manipulation */
    static attach(itemID: string, callBack?: Function): Promise<Number>;
    /** used for source plugins. lock an id to slot 0 */
    static lockSourceSlot(itemID: string): void;
    /**
     * Helper function to check if the supplied item id still exist.
     */
    static wrapGet(name: string, srcId?: string, id?: string, updateId?: Function): Promise<unknown>;
    /** Get an item's local property asynchronously */
    static get(name: string, id?: string): Promise<string>;
    /**
     * Helper function to check if the supplied item id still exist.
     */
    static wrapSet(name: string, value: string, srcId?: string, id?: string, updateId?: Function): Promise<unknown>;
    /** Sets an item's local property */
    static set(name: string, value: string, id?: string): Promise<boolean>;
    /** For SourceProps and XBC version 2.7 below */
    static setBaseId(id: string): void;
    /** For SourceProps and XBC version 2.7 below */
    static getBaseId(): string;
}
