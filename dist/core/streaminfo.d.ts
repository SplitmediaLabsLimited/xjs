import { JSON as JXON } from '../internal/util/json';
/**
 * The StreamInfo class provides methods to monitor the current active streams
 *  activity and other details.
 *
 * This can be used together with {@link #core/Output Output Class} and check
 * the details of the currently live outputs.
 *
 * ### Basic Usage
 *
 * ```javascript
 * var xjs = require('xjs');
 *
 * xjs.ready()
 * .then(xjs.StreamInfo.getActiveStreamChannels)
 * .then(function(channels) {
 *   var stream = []
 *   channels.forEach(function(channel){
 *     channel.getName()
 *     .then(name => {
 *       if(name.includes('Twitch')) {
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
export declare class StreamInfo {
    private _name;
    private _stat;
    private _channel;
    /** StreamInfo constructor (only used internally) */
    constructor(props: {
        name: string;
        stat: JXON;
        channel: JXON;
    });
    /**
     *  return: Promise<StreamInfo[]>
     *
     *  Gets the list of currently active channels.
     */
    static getActiveStreamChannels(): Promise<StreamInfo[]>;
    /**
     *  return: Promise<string>
     *
     *  Gets the name of the channel.
     */
    getName(): Promise<string>;
    /**
     * return: Promise<number>
     *
     * Gets the number of frames dropped
     */
    getStreamDrops(): Promise<number>;
    /**
     * return: Promise<number>
     *
     * Gets the number of GOP frames dropped
     */
    getGOPDrops(): Promise<number>;
    /**
     * return: Promise<number>
     *
     * Gets the number of frames rendered
     */
    getStreamRenderedFrames(): Promise<number>;
    /**
     * return: Promise<number>
     *
     * Gets the current duration of the stream in microseconds
     */
    getStreamTime(): Promise<number>;
    /**
     * return: Promise<number>
     *
     * Gets the current bandwidth usage of the stream
     */
    getBandwidthUsage(): Promise<number>;
}
