import { Rectangle } from '../../util/rectangle';
export interface ISourceHtml {
    /**
     * param: (func: string, arg: string)
     * ```
     * return: Promise<ISourceHtml>
     * ```
     *
     * Allow this source to call a pre-exposed function within the HTML Source
     */
    call(func: string, arg: string): Promise<ISourceHtml>;
    /**
     * return: Promise<string>
     *
     * Gets the URL of this webpage source.
     */
    getURL(): Promise<string>;
    /**
     * param: (url: string)
     * ```
     * return: Promise<ISourceHtml>
     * ```
     *
     * Sets the URL of this webpage source.
     *
     * *Chainable.*
     */
    setURL(value: string): Promise<ISourceHtml>;
    /**
     * return: Promise<boolean>
     *
     * Check if browser is rendered transparent
     */
    isBrowserTransparent(): Promise<boolean>;
    /**
     * param: Promise<boolean>
     * ```
     * return: Promise<ISourceHtml>
     * ```
     *
     * Enable or disable transparency of CEF browser
     *
     * *Chainable.*
     */
    enableBrowserTransparency(value: boolean): Promise<ISourceHtml>;
    /**
     * return: Promise<boolean>
     *
     * Check if browser can render up to a maximum of 60FPS
     */
    isBrowser60FPS(): Promise<boolean>;
    /**
     * param: Promise<boolean>
     * ```
     * return: Promise<ISourceHtml>
     * ```
     *
     * Enable or disable browser source to render up to a maximum of 60FPS
     *
     * *Chainable.*
     */
    enableBrowser60FPS(value: boolean): Promise<ISourceHtml>;
    /**
     * return: Promise<Rectangle>
     *
     * Gets the custom browser window size (in pixels) for the item, if set,
     * regardless of its layout on the mixer. Returns a (0, 0) Rectangle if no
     * custom size has been set.
     *
     * See also: {@link #util/Rectangle Util/Rectangle}
     */
    getBrowserCustomSize(): Promise<Rectangle>;
    /**
     * param: Promise<Rectangle>
     * ```
     * return: Promise<ISourceHtml>
     * ```
     *
     * Sets the custom browser window size for the item
     * regardless of its layout on the mixer
     *
     * *Chainable.*
     *
     * See also: {@link #util/Rectangle Util/Rectangle}
     */
    setBrowserCustomSize(value: Rectangle): Promise<ISourceHtml>;
    /**
     * return: Promise<boolean>
     *
     * Check if right click events are sent to the item or not.
     *
     * #### Usage
     *
     * ```javascript
     * item.getAllowRightClick().then(function(isRightClickAllowed) {
     *   // The rest of your code here
     * });
     * ```
     */
    getAllowRightClick(): Promise<boolean>;
    /**
     * param: (value:boolean)
     * ```
     * return: Promise<ISourceHtml>
     * ```
     *
     * Allow or disallow right click events to be sent to the item. Note that
     * you can only catch right click events using `mouseup/mousedown`
     *
     * *Chainable*
     *
     * #### Usage
     *
     * ```javascript
     * item.setAllowRightClick(true).then(function(item) {
     *   // Promise resolves with the same Item instance
     * });
     * ```
     */
    setAllowRightClick(value: boolean): Promise<ISourceHtml>;
    /**
     * return: Promise<string>
     *
     * Gets the javascript commands to be executed on item upon load
     */
    getBrowserJS(): Promise<string>;
    /**
     * param: (js: string, refresh: boolean = false)
     *
     * return: Promise<ISourceHtml>
     *
     * Sets the javascript commands to be executed on item
     * right upon setting and on load. Optionally set second parameter
     * to true to refresh item (needed to clean previously executed JS code.)
     *
     * *Chainable.*
     */
    setBrowserJS(value: string): Promise<ISourceHtml>;
    /**
     * return: Promise<boolean>
     *
     * Gets if BrowserJS is enabled and executed on load
     */
    isBrowserJSEnabled(): Promise<boolean>;
    /**
     * param: (value: boolean)
     * ```
     * return: Promise<ISourceHtml>
     * ```
     *
     * Enables or disables execution of the set BrowserJs upon load.
     * Note that disabling this will require item to be refreshed
     * in order to remove any BrowserJS previously executed.
     *
     * *Chainable.*
     */
    enableBrowserJS(value: boolean): Promise<ISourceHtml>;
    /**
     * return: Promise<string>
     *
     * Gets the custom CSS applied to the document upon loading
     */
    getCustomCSS(): Promise<string>;
    /**
     * param: (value: string)
     * ```
     * return: Promise<ISourceHtml>
     * ```
     *
     * Sets the custom CSS to be applied to the document upon loading
     *
     * *Chainable.*
     */
    setCustomCSS(value: string): Promise<ISourceHtml>;
    /**
     * return: Promise<boolean>
     *
     * Gets if custom CSS is enabled and applied to the document on load
     */
    isCustomCSSEnabled(): Promise<boolean>;
    /**
     * param: (value: boolean)
     *
     * return: Promise<ISourceHtml>
     *
     * Enables or disables application of custom CSS to the document
     */
    enableCustomCSS(value: boolean): Promise<ISourceHtml>;
    /**
     * return: Promise<boolean>
     *
     * Gets if browser instance is optimized via surface sharing
     */
    isBrowserOptimized(): Promise<boolean>;
    /**
     * return: Promise<string>
     *
     * Gets the load status of the html
     * May return as any of the following:
     * - 'LOADED' -> HTML is already loaded
     * - 'NOT LOADED' -> HTML is not yet loaded
     * - 'LOAD ERROR' -> Error in loading HTML
     * - 'UNKNOWN' -> URL used is invalid or when status is checked right after adding new HTML source
     * - 'UNAVAILABLE' -> Method for getting load status is unavailable for the XBC version
     */
    getBrowserLoadStatus: () => Promise<string>;
    /**
     * return: Promise<boolean>
     *
     * Gets if source will refresh upon showing (via setVisible)
     */
    isReloadOnShowEnabled(): Promise<boolean>;
    /**
     * param: (value: boolean)
     *
     * return: Promise<ISourceHtml>
     *
     * Enables or disables refresh of source upon showing (via setVisible)
     */
    enableReloadOnShow(value: boolean): Promise<ISourceHtml>;
    /**
     * return: Promise<boolean>
     *
     * Gets if source will refresh upon entering a scene containing an item of it (via setVisible)
     */
    isReloadOnSceneEnterEnabled(): Promise<boolean>;
    /**
     * param: (value: boolean)
     *
     * return: Promise<ISourceHtml>
     *
     * Enables or disables refresh of source upon entering a scene containing an item of it (via setVisible)
     */
    enableReloadOnSceneEnter(value: boolean): Promise<ISourceHtml>;
    /**
     * return: Promise<boolean>
     *
     * Check if file used as source is available
     *
     * #### Usage
     *
     * ```javascript
     * item.isSourceAvailable().then(function(isAvail) {
     *   // The rest of your code here
     * });
     * ```
     */
    isSourceAvailable(): Promise<boolean>;
}
export declare class iSourceHtml implements ISourceHtml {
    private _id;
    private _srcId;
    private _isItemCall;
    private _checkPromise;
    private _sceneId;
    private _updateId;
    /**
     * param: (func: string, arg: string)
     * ```
     * return: Promise<ISourceHtml>
     * ```
     *
     * Allow this item to call a pre-exposed function within the HTML Item
     */
    call(func: string, arg: string): Promise<iSourceHtml>;
    /**
     * return: Promise<string>
     *
     * Gets the URL of this webpage item.
     */
    getURL(): Promise<string>;
    /**
     * param: (url: string)
     * ```
     * return: Promise<ISourceHtml>
     * ```
     *
     * Sets the URL of this webpage item.
     *
     * *Chainable.*
     */
    setURL(value: string): Promise<iSourceHtml>;
    isBrowserTransparent(): Promise<boolean>;
    enableBrowserTransparency(value: boolean): Promise<iSourceHtml>;
    isBrowser60FPS(): Promise<boolean>;
    enableBrowser60FPS(value: boolean): Promise<iSourceHtml>;
    getBrowserCustomSize(): Promise<Rectangle>;
    setBrowserCustomSize(value: Rectangle): Promise<iSourceHtml>;
    getAllowRightClick(): Promise<boolean>;
    setAllowRightClick(value: boolean): Promise<iSourceHtml>;
    getBrowserJS(): Promise<string>;
    setBrowserJS(value: string, refresh?: boolean): Promise<iSourceHtml>;
    isBrowserJSEnabled(): Promise<boolean>;
    enableBrowserJS(value: boolean): Promise<iSourceHtml>;
    getCustomCSS(): Promise<string>;
    setCustomCSS(value: string): Promise<iSourceHtml>;
    isCustomCSSEnabled(): Promise<boolean>;
    enableCustomCSS(value: boolean): Promise<iSourceHtml>;
    isBrowserOptimized(): Promise<boolean>;
    getBrowserLoadStatus(): Promise<string>;
    isReloadOnShowEnabled(): Promise<boolean>;
    enableReloadOnShow(value: boolean): Promise<iSourceHtml>;
    isReloadOnSceneEnterEnabled(): Promise<boolean>;
    enableReloadOnSceneEnter(value: boolean): Promise<iSourceHtml>;
    isSourceAvailable(): Promise<boolean>;
}
