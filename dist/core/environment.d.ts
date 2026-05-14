/**
 * This class allows detection of the context in which the HTML is located.
 */
export declare class Environment {
    private static _isSourcePlugin;
    private static _isSourceProps;
    private static _isExtension;
    private static _initialized;
    /**
     * This method is only used internally.
     */
    static initialize(): void;
    /**
     * return: boolean
     *
     * Determines if this HTML is running as a source.
     */
    static isSourcePlugin(): Boolean;
    /**
     * return: boolean
     *
     * Determines if this HTML is running within the source properties window.
     */
    static isSourceProps(): Boolean;
    /**
     * return: boolean
     *
     * Determines if this HTML is running as an extension plugin.
     */
    static isExtension(): Boolean;
}
