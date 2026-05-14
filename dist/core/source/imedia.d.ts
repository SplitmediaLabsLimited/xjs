export interface ISourceMedia {
    /**
     * return: Promise<object>
     *
     * Gets file information such as codecs, bitrate, resolution, etc.
     *
     * sample file info object format:
     *
     * {
     *  "audio": {
     *    "duration":"1436734690",
     *    "samplerate":"44100",
     *    "bitrate":"128000",
     *    "codec":"mp3"},
     *  "video":{
     *    "frameduration":"333670",
     *    "bitrate":"1132227",
     *    "duration":"1436436440",
     *    "height":"240",
     *    "width":"320",
     *    "codec":"mpeg4"}
     * }
     *
     * #### Usage
     *
     * ```javascript
     * mediaItem.getFileInfo().then(function(value) {
     *   // Do something with the value
     *   var audioCodec;
     *   if (typeof value['audio'] !== 'undefined' && typeof value['audio']['codec']) {
     *     audioCodec = value['audio']['codec'];
     *   }
     * });
     * ```
     */
    getFileInfo(): Promise<Object>;
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
export declare class SourceMedia implements ISourceMedia {
    private _id;
    private _isItemCall;
    private _srcId;
    private _checkPromise;
    private _sceneId;
    private _updateId;
    getFileInfo(): Promise<Object>;
    isSourceAvailable(): Promise<boolean>;
}
