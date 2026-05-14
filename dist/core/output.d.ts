/**
 * The Output class provides methods to start and stop a stream/recording
 * and pause or unpause a Local Recording.
 *
 * This can be used together with {@link #core/StreamInfo StreamInfo Class},
 * where you can check the status of the outputs you start.
 *
 * ### Basic Usage
 *
 * ```javascript
 * var xjs = require('xjs');
 * var streamName;
 * xjs.Output.getOutputList()
 * .then(function(outputs) {
 *   outputs.map(output => {
 *    output.getName()
 *    .then(function(name) {
 *      // You can also save the name on a variable to be able to use it
 *      // when checking for the stream info.
 *      if(name.includes('Twitch')) {
 *        streamName = name
 *        output.startBroadcast();
 *      }
 *    })
 *  })
 * })
 * ```
 *
 * Once there's an active stream, StreamInfo class can be used at any time to
 * check the stream status of that output.
 *
 * ```javascript
 * xjs.StreamInfo.getActiveStreamChannels
 * .then(function(channels) {
 *   var stream = []
 *   channels.forEach(function(channel){
 *     channel.getName()
 *     .then(name => {
 *       if(name === streamName) {
 *         stream.push(channel)
 *       }
 *     })
 *   })
 *   return stream
 * }).then(function(stream) {
 *   // Get any stream information you need here
 *   return stream[0].getStreamRenderedFrames()
 * })
 * ```
 */
export declare class Output {
    static _callback: {};
    static _id: string;
    static _remoteCallback: {};
    static _proxyCallback: {};
    static _localRecording: boolean;
    protected _name: string;
    constructor(props?: {
        name: string;
    });
    /**
     * param: (id: string)
     *
     * ```
     * return Promise<Output[]>
     * ```
     *
     * Fetch all available Outputs you can broadcast on based on your installed
     * Broadcast plugin.
     *
     * ### Basic Usage
     *
     * ```javascript
     * var xjs = require('xjs');
     *
     * xjs.Output.getOutputList()
     * .then(function(outputs) {
     *   outputs.map(output => {
     *    output.getName()
     *    .then(function(name) {
     *      if(name.includes('Twitch')) {
     *        output.startBroadcast({
     *          suppressPrestreamDialog : true
     *        });
     *      }
     *    })
     *  })
     * })
     * ```
     */
    static getOutputList(): Promise<Output[]>;
    /**
     * param: scene<number|Scene>
     * ```
     * return: Promise<boolean>
     * ```
     *
     * Sets a scene to record. Set to live scene or blank string to reset
     */
    static setSceneToRecord(scene: any): Promise<boolean>;
    /**
     * return: Promise<boolean>
     *
     * Start a local recording.
     */
    static startLocalRecording(): Promise<boolean>;
    /**
     * return: Promise<boolean>
     *
     * Unpause a local recording.
     */
    static stopLocalRecording(): Promise<boolean>;
    /**
     * return: Promise<boolean>
     *
     * Pause a local recording.
     */
    static pauseLocalRecording(): Promise<boolean>;
    /**
     * return: Promise<boolean>
     *
     * Unpause a local recording.
     */
    static unpauseLocalRecording(): Promise<boolean>;
    /**
     *  return: Promise<string>
     *
     *  Gets the actual name of the Output.
     */
    getName(): Promise<string>;
    /**
     *  return: Promise<string>
     *
     *  Gets the name of the Output as displayed in the Outputs menu.
     */
    getDisplayName(): Promise<string>;
    /**
     * param: ([options]) -- see below
     *
     * ```
     * return: Promise<boolean>
     * ```
     *
     * Start a broadcast of the provided channel.
     *
     * Accepts an optional JSON object argument,
     * which can be used to indicate certain flags, such as (additional options may be added):
     * - `suppressPrestreamDialog` : used to bypass the showing of the pre-stream dialog
     *  of the outputs supporting it, will use last settings provided
     */
    startBroadcast(optionBag?: {
        suppressPrestreamDialog?: boolean;
    }): Promise<boolean>;
    /**
     * return: Promise<boolean>
     *
     * Stop a broadcast of the provided channel.
     */
    stopBroadcast(): Promise<boolean>;
    /**
     * ** For Deprecation, please use the static method instead
     *
     * return: Promise<boolean>
     *
     * Pause a local recording.
     */
    pauseLocalRecording(): Promise<boolean>;
    /**
     * ** For Deprecation, please use the static method instead
     *
     * return: Promise<boolean>
     *
     * Unpause a local recording.
     */
    unpauseLocalRecording(): Promise<boolean>;
    static _getBroadcastChannels(id: string, ...args: any[]): Promise<unknown>;
    static _finalCallback(message: string): Promise<unknown>;
}
