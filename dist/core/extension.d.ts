export declare class Extension {
    private static _instance;
    private _presName;
    static _proxyCallback: {};
    static _remoteCallback: {};
    static _callback: {};
    protected _id: string;
    /**
     *  Gets the instance of the Extension class. Use this instead of the constructor.
     */
    static getInstance(): Extension;
    constructor();
    /**
     * param: (configObj: JSON)
     * ```
     * return: Promise<ExtensionWindow|Error>
     * ```
     *
     * Save the configuration object to the presentation
     */
    saveConfig(configObj: any): Promise<any>;
    /**
     * return: Promise<JSON>
     *
     * Get the saved configuration from the presentation
     */
    loadConfig(): Promise<any>;
    /**
     *  return: Promise<string>
     *
     *  Get the extension id.
     */
    getId(handler?: Function): Promise<string>;
    static _finalCallback(message: any): Promise<unknown>;
}
