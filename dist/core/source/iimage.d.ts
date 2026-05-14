import { XML } from '../../internal/util/xml';
export interface ISourceImage {
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
     * return: Promise<ISourceImage>
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
export declare class SourceImage implements ISourceImage {
    private _id;
    private _srcId;
    private _isItemCall;
    private _checkPromise;
    private _sceneId;
    private _updateId;
    isSourceAvailable(): Promise<boolean>;
    getValue(): Promise<string>;
    setValue(filename: string): Promise<SourceImage>;
}
