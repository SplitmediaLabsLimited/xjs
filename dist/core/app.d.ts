import { Rectangle as Rectangle } from '../util/rectangle';
import { AudioDevice as AudioDevice } from '../system/audio';
import { Transition } from './transition';
/**
 * The App Class provides you methods to get and set application-related
 * functionalities.
 *
 * ### Basic Usage
 *
 * ```javascript
 * var xjs = require('xjs');
 * var App = new xjs.App();
 *
 * App.getFrameTime().then(function(frametime) {
 *   window.frametime = frametime;
 * });
 * ```
 *
 * For methods referring to application audio
 * (i.e. mic and speaker settings, silence detection, etc.).
 * This will affect XBC settings
 * but will not be reflected in the General Settings Window
 * (also will not be persistent after logging out of/exiting the application).
 *
 */
export declare class App {
    /**
     * return: Promise<number>
     *
     * Gets application's frame time (duration per frame in 100ns unit)
     *
     * #### Usage
     *
     * ```javascript
     * App.getFrameTime().then(function(res) {
     *   var frameTime = res;
     * });
     * ```
     */
    getFrameTime(): Promise<number>;
    /**
     * Compatibility alias for older examples and functional tests.
     */
    getFrametime(): Promise<number>;
    /**
     * return: Promise<Rectangle>
     *
     * Gets application default output resolution in pixels.
     *
     * See also: {@link #util/Rectangle Util/Rectangle}
     *
     * #### Usage
     *
     * ```javascript
     * App.getResolution().then(function(res) {
     *   var height = res.getHeight();
     *   var width = res.getWidth();
     * });
     * ```
     */
    getResolution(): Promise<Rectangle>;
    /**
     * return: Promise<Rectangle>
     *
     * Gets application viewport display resolution
     *
     * See also: {@link #util/Rectangle Util/Rectangle}
     *
     * #### Usage
     *
     * ```javascript
     * App.getViewport().then(function(res) {
     *   var height = res.getHeight();
     *   var width = res.getWidth();
     * });
     * ```
     */
    getViewport(): Promise<Rectangle>;
    /**
     * return: Promise<string>
     *
     * Refers to XSplit Broadcaster version number
     *
     * #### Usage
     *
     * ```javascript
     * App.getVersion().then(function(res) {
     *   var version = res;
     * });
     * ```
     */
    getVersion(): Promise<string>;
    /**
     * return: Promise<number>
     *
     * Gets the total number of frames rendered
     *
     * #### Usage
     *
     * ```javascript
     * App.getFramesRendered().then(function(res) {
     *   var framesrendered = res;
     * });
     * ```
     */
    getFramesRendered(): Promise<number>;
    /**
     * return: Promise<AudioDevice>
     *
     * Gets the primary microphone device used in the application
     *
     * See also: {@link #system/AudioDevice System/AudioDevice}
     *
     * ### Usage
     *
     * ```javascript
     * App.getPrimaryMic().then(function(audioDevice) {
     *   var primaryMic = audioDevice;
     * });
     * ```
     */
    getPrimaryMic(): Promise<AudioDevice>;
    /**
     * return: Promise<AudioDevice>
     *
     * Gets the primary speaker/audio render device used in the application
     *
     * See also: {@link #system/AudioDevice System/AudioDevice}
     *
     * ### Usage
     *
     * ```javascript
     * App.getPrimarySpeaker().then(function(audioDevice) {
     *   var primarySpeaker = audioDevice;
     * });
     * ```
     */
    getPrimarySpeaker(): Promise<AudioDevice>;
    /**
     * param: volume<number> (0 to 100 normal range, > 100 will boost volume level)
     * ```
     * return: Promise<boolean>
     * ```
     *
     * Sets the application audio level of the primary microphone set
     *
     * ### Usage
     *
     * ```javascript
     * App.setPrimaryMicLevel(volume).then(function(val) {
     *   var isSet = val;
     * });
     * ```
     */
    setPrimaryMicLevel(volume: number): Promise<boolean>;
    /**
     * param: enabled<boolean>
     * ```
     * return: Promise<boolean>
     * ```
     *
     * Sets whether the primary microphone set is enabled or disabled in the applicaation
     *
     * ### Usage
     *
     * ```javascript
     * App.setPrimaryMicEnabled(enabled).then(function(val) {
     *   var isSet = val;
     * });
     * ```
     */
    setPrimaryMicEnabled(enabled: boolean): Promise<boolean>;
    /**
     * param: volume<number> (0 to 100)
     * ```
     * return: Promise<boolean>
     * ```
     *
     * Sets the system audio level of the primary microphone set
     *
     * ### Usage
     *
     * ```javascript
     * App.setPrimaryMicSystemLevel(volume).then(function(val) {
     *   var isSet = val;
     * });
     * ```
     */
    setPrimaryMicSystemLevel(volume: number): Promise<boolean>;
    /**
     * param: hwenabled<number> (0 or 1, or set to 255 to avoid mute change)
     * ```
     * return: Promise<boolean>
     * ```
     *
     * Sets whether the primary microphone set is enabled or disabled in the system
     *
     * ### Usage
     *
     * ```javascript
     * App.setPrimaryMicSystemEnabled(enabled).then(function(val) {
     *   var isSet = val;
     * });
     * ```
     */
    setPrimaryMicSystemEnabled(hwenabled: number): Promise<boolean>;
    /**
     * param: delay<number> (100 nanoseconds in units)
     * ```
     * return: Promise<boolean>
     * ```
     *
     * Sets the loopback capture delay of the primary microphone set
     *
     * ### Usage
     *
     * ```javascript
     * App.setPrimaryMicDelay(delay).then(function(val) {
     *   var isSet = val;
     * });
     * ```
     */
    setPrimaryMicDelay(delay: number): Promise<boolean>;
    /**
     * param: volume<number> (0 to 100 normal range, > 100 will boost volume level)
     * ```
     * return: Promise<boolean>
     * ```
     *
     * Sets the application audio level of the primary speaker/audio render device
     *
     * ### Usage
     *
     * ```javascript
     * App.setPrimarySpeakerLevel(volume).then(function(val) {
     *   var isSet = val;
     * });
     * ```
     */
    setPrimarySpeakerLevel(volume: number): Promise<boolean>;
    /**
     * param: enabled<boolean>
     * ```
     * return: Promise<boolean>
     * ```
     *
     * Sets whether the primary speaker/audio render device set is enabled or disabled in the applicaation
     *
     * ### Usage
     *
     * ```javascript
     * App.setPrimarySpeakerEnabled(enabled).then(function(val) {
     *   var isSet = val;
     * });
     * ```
     */
    setPrimarySpeakerEnabled(enabled: boolean): Promise<boolean>;
    /**
     * param: volume<number> (0 to 100)
     * ```
     * return: Promise<boolean>
     * ```
     *
     * Sets the system audio level of the primary speaker/audio render device set
     *
     * ### Usage
     *
     * ```javascript
     * App.setPrimarySpeakerSystemLevel(volume).then(function(val) {
     *   var isSet = val;
     * });
     * ```
     */
    setPrimarySpeakerSystemLevel(volume: number): Promise<boolean>;
    /**
     * param: hwenabled<number> (0 or 1, or set to 255 to avoid mute change)
     * ```
     * return: Promise<boolean>
     * ```
     *
     * Sets whether the primary speaker/audio render device set is enabled or disabled in the system
     *
     * ### Usage
     *
     * ```javascript
     * App.setPrimarySpeakerSystemEnabled(enabled).then(function(val) {
     *   var isSet = val;
     * });
     * ```
     */
    setPrimarySpeakerSystemEnabled(hwenabled: number): Promise<boolean>;
    /**
     * param: delay<number> (100 nanoseconds in units)
     * ```
     * return: Promise<boolean>
     * ```
     *
     * Sets the loopback capture delay of the primary speaker/audio render device
     *
     * ### Usage
     *
     * ```javascript
     * App.setPrimarySpeakerDelay(delay).then(function(val) {
     *   var isSet = val;
     * });
     * ```
     */
    setPrimarySpeakerDelay(delay: number): Promise<boolean>;
    /**
     * return: Promise<boolean>
     *
     * Gets whether silence detection is enabled
     *
     * ### Usage
     *
     * ```javascript
     * App.isSilenceDetectionEnabled().then(function(val) {
     *   var isEnabled = val;
     * });
     * ```
     */
    isSilenceDetectionEnabled(): Promise<boolean>;
    /**
     * param: enabled<boolean>
     * ```
     * return: Promise<boolean>
     * ```
     *
     * Enables or disables silence detection
     *
     * ### Usage
     *
     * ```javascript
     * App.enableSilenceDetection(enabled).then(function(val) {
     *   var isSet = val;
     * });
     * ```
     */
    enableSilenceDetection(enabled: boolean): Promise<boolean>;
    /**
     * return: Promise<number>
     *
     * Gets silence detection period,
     * the length of time after voice detection before silence is again detected
     *
     * ### Usage
     *
     * ```javascript
     * App.getSilenceDetectionPeriod().then(function(val) {
     *   var silenceDetectionPeriod = val;
     * });
     * ```
     */
    getSilenceDetectionPeriod(): Promise<number>;
    /**
     * param: sdPeriod<number>
     * ```
     * return: Promise<boolean>
     * ```
     *
     * Sets silence detection period (0-60000 ms),
     * the length of time after voice detection before silence is again detected
     *
     * ### Usage
     *
     * ```javascript
     * App.setSilenceDetectionPeriod(sdPeriod).then(function(val) {
     *   var isSet = val;
     * });
     * ```
     */
    setSilenceDetectionPeriod(sdPeriod: number): Promise<boolean>;
    /**
     * return: Promise<number>
     *
     * Gets silence detection threshold/silence amplitude
     *
     * ### Usage
     *
     * ```javascript
     * App.getSilenceDetectionThreshold().then(function(val) {
     *   var silenceDetectionTfhreshold = val;
     * });
     * ```
     */
    getSilenceDetectionThreshold(): Promise<number>;
    /**
     * param: sdThreshold<number>
     * ```
     * return: Promise<boolean>
     * ```
     *
     * Sets silence detection threshold/silence amplitude (values from 0-128)
     *
     * ### Usage
     *
     * ```javascript
     * App.setSilenceDetectionThreshold(sdThreshold).then(function(val) {
     *   var isSet = val;
     * });
     * ```
     */
    setSilenceDetectionThreshold(sdThreshold: number): Promise<boolean>;
    /**
     * return: Promise<boolean>
     *
     * Gets whether noise suppression is enabled
     *
     * ### Usage
     *
     * ```javascript
     * App.isNoiseSuppressionEnabled().then(function(val) {
     *   var isEnabled = val;
     * });
     * ```
     */
    isNoiseSuppressionEnabled(): Promise<boolean>;
    /**
     * param: enabled<boolean>
     * ```
     * return: Promise<boolean>
     * ```
     *
     * Enables or disables noise suppression
     *
     * ### Usage
     *
     * ```javascript
     * App.enableNoiseSuppression(enabled).then(function(val) {
     *   var isSet = val;
     * });
     * ```
     */
    enableNoiseSuppression(enabled: boolean): Promise<boolean>;
    /**
     * return: Promise<Transition>
     *
     * Gets the transition for scene changes
     *
     * See also: {@link #core/Transition Core/Transition}
     *
     * #### Usage
     *
     * ```javascript
     * App.getTransition().then(function(res) {
     *   var transitionid = res;
     * });
     * ```
     */
    getTransition(): Promise<Transition>;
    /**
     * param: transition<Transition>
     * ```
     * return: Promise<boolean>
     * ```
     *
     * Sets the transition for scene changes
     *
     * See also: {@link #core/Transition Core/Transition}
     *
     * #### Usage
     *
     * ```javascript
     * var xjs = require('xjs'),
     *     Transition = xjs.Transition,
     *     App = new xjs.App();
  
     * App.setTransition(Transition.CLOCK).then(function(val) {
     *  var isSet = val;
     * });
     * ```
     */
    setTransition(transition: Transition): Promise<boolean>;
    /**
     * return: Promise<number>
     *
     * Gets the scene transition duration in milliseconds
     *
     * #### Usage
     *
     * ```javascript
     * App.getTransitionTime().then(function(res) {
     *   var transitiontime = res;
     * });
     * ```
     */
    getTransitionTime(): Promise<Number>;
    /**
     * param: time<number>
     * ```
     * return: Promise<boolean>
     * ```
     *
     * Sets the scene transition duration in milliseconds
     *
     * #### Usage
     *
     * ```javascript
     * App.setTransitionTime(time).then(function(val) {
     *  var isSet = val;
     * });
     * ```
     */
    setTransitionTime(time: number): Promise<boolean>;
    /**
     * return: Promise<boolean>
     *
     *  Clears all cookies across all browser instances. Not available to
     *  source plugins (call this from the source properties window instead.)
     *
     * #### Usage
     *
     * ```javascript
     * App.clearBrowserCookies().then(function(val) {
     *  var isCleared = val;
     * });
     * ```
     */
    clearBrowserCookies(cookiePath: string): Promise<boolean>;
    /**
     * return: Promise<string>
     *
     * Returns a hashed string that may be used to differentiate among logged-in
     * users. This will be useful in such cases as persisting data to be used by
     * certain XSplit users only.
     */
    getUserIdHash(): Promise<string>;
}
