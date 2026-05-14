import { Rectangle } from '../../util/rectangle';
import { XML } from '../../internal/util/xml';
export interface ISourceFlash {
    /**
     * return: Promise<Rectangle>
     *
     * Gets the custom resolution (in pixels) for the item, if set,
     * regardless of its layout on the mixer. Returns a (0, 0) Rectangle if no
     * custom resolution has been set.
     *
     * See also: {@link #util/Rectangle Util/Rectangle}
     */
    getCustomResolution(): Promise<Rectangle>;
    /**
     * param: (value: Rectangle)
     * ```
     * return: Promise<FlashSource>
     * ```
     *
     * Sets the custom resolution for the item
     * regardless of its layout on the mixer
     *
     * *Chainable.*
     *
     * See also: {@link #util/Rectangle Util/Rectangle}
     */
    setCustomResolution(value: Rectangle): Promise<ISourceFlash>;
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
     * return: Promise<Item>
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
    setAllowRightClick(value: boolean): Promise<ISourceFlash>;
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
    /**
     * return: Promise<string>
     *
     * Gets the URL path of the image file used as a source
     *
     *
     * #### Usage
     *
     * ```javascript
     * source.getValue().then(function(value) {
     *   // Do something with the value
     * });
     * ```
     */
    getValue(): Promise<string | XML>;
    /**
     * param: (value: string)
     * ```
     * return: Promise<ISourcePlayback>
     * ```
     *
     * Set the image file to be used as source
     *
     * #### Usage
     *
     * ```javascript
     * source.setValue('C:\\SomeFolder\\SomeFile.png')
     *   .then(function(source) {
     *   // Promise resolves with same Source instance
     * });
     * ```
     */
    setValue(value: string): Promise<any>;
}
export declare class SourceFlash implements ISourceFlash {
    private _id;
    private _srcId;
    private _isItemCall;
    private _checkPromise;
    private _sceneId;
    private _updateId;
    getCustomResolution(): Promise<Rectangle>;
    setCustomResolution(value: Rectangle): Promise<SourceFlash>;
    getAllowRightClick(): Promise<boolean>;
    setAllowRightClick(value: boolean): Promise<SourceFlash>;
    isSourceAvailable(): Promise<boolean>;
    getValue(): Promise<string>;
    setValue(filename: string): Promise<SourceFlash>;
}
