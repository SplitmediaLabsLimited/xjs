export interface ISourceConfigurable {
    /**
     * return: Promise<any>
     *
     * Gets the configuration JSON
     */
    loadConfig(): Promise<any>;
    /**
     * param: config<JSON>
     *
     * Persists a JSON object for configuration. Available to sources only.
     *
     * *Chainable.*
     */
    saveConfig(configObj: any): any;
    /**
     * param: config<JSON>
     *
     * Requests the source to save a configuration. This makes the source emit
     * the save-config event.
     *
     * *Chainable.*
     */
    requestSaveConfig(configObj: any): any;
    /**
     * param: config<JSON>
     *
     * Requests the source to save a configuration. This makes the source emit
     * the apply-config event.
     *
     * *Chainable.*
     */
    applyConfig(configObj: any): any;
}
export declare class SourceConfigurable {
    private _id;
    private _srcId;
    private _isItemCall;
    private _checkPromise;
    private _sceneId;
    private _updateId;
    loadConfig(): Promise<any>;
    saveConfig(configObj: any): Promise<any>;
    requestSaveConfig(configObj: any): Promise<any>;
    applyConfig(configObj: any): Promise<any>;
}
