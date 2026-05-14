import { JSON as JXON } from '../internal/util/json';
/**
 * The AudioDevice Class is the object returned by
 * {@link #system/System System Class} getAudioDevices method. It provides you
 * with methods to fetch the audio device object's attributes, and also provides
 * methods to convert it back to an XML object that is compatible with XBC.
 *
 * If you are looking to add a microphone device to the stage, please see
 * {@link #system/MicrophoneDevice System/MicrophoneDevice} instead.
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 * var System = XJS.System;
 *
 * System.getAudioDevices().then(function(audios) {
 *   for (var i in audios) {
 *     // Do not include the imaginary xsplit audio device if that ever exist
 *     if (audios[i].getName().indexOf('xsplit') === -1) {
 *       xml = audios[i].toXML();
 *       // do something with the XML here
 *     }
 *   }
 * });
 * ```
 */
export declare class AudioDevice {
    static SYSTEM_LEVEL_MUTE: number;
    static SYSTEM_LEVEL_ENABLE: number;
    static SYSTEM_MUTE_CHANGE_NOT_ALLOWED: number;
    private _id;
    private _name;
    private _adapter;
    private _adapterdev;
    private _dSoundGuid;
    private _dataFlow;
    private _state;
    private _defaultConsole;
    private _defaultMultimedia;
    private _defaultCommunication;
    private _level;
    private _enable;
    private _hwlevel;
    private _hwenable;
    private _delay;
    private _mix;
    constructor(props?: {});
    /**
     * return: string
     *
     * Gets the device ID
     *
     * #### Usage
     *
     * ```javascript
     * var audioDeviceID = device.getId();
     * ```
     */
    getId(): string;
    /**
     * return: string
     *
     * Gets the device name
     *
     * #### Usage
     *
     * ```javascript
     * var audioDeviceName = device.getName();
     * ```
     */
    getName(): string;
    /**
     * return: string
     *
     * Gets whether device is capturing or rendering audio
     *
     * #### Usage
     *
     * ```javascript
     * var audioDataFlow = device.getDataFlow();
     *   //where possible values are 'Render' or 'Capture'
     * ```
     */
    getDataFlow(): string;
    /**
     * return: boolean
     *
     * Gets whether audio device is the system default
     *
     * #### Usage
     *
     * ```javascript
     * var audioIsDefaultDevice = audioDevice.isDefaultDevice();
     * ```
     */
    isDefaultDevice(): boolean;
    /**
     * return: number
     *
     * Gets the device audio level in the application
     *
     * #### Usage
     *
     * ```javascript
     * var audioDeviceVolumeLevel = audioDevice.getLevel();
     * ```
     */
    getLevel(): number;
    /**
     * param: level<number>
     * ```
     * return: AudioDevice (used for chaining)
     * ```
     *
     * Sets the device audio level in the application
     *
     * #### Usage
     *
     * ```javascript
     * audioDevice._setLevel(100);
     * ```
     */
    _setLevel(level: number): this;
    /**
     * return: boolean
     *
     * Gets whether the audio device is enabled/not
     *
     * #### Usage
     *
     * ```javascript
     * var isAudioDeviceEnabled = audioDevice.isEnabled();
     * ```
     */
    isEnabled(): boolean;
    /**
     * param: enabled<boolean>
     * ```
     * return: AudioDevice (used for chaining)
     * ```
     *
     * Enables audio device/sets software mute
     *
     * #### Usage
     *
     * ```javascript
     * audioDevice._setEnabled(true);
     * ```
     */
    _setEnabled(enabled: boolean): this;
    /**
     * return: number
     *
     * Gets the device system volume
     *
     * #### Usage
     *
     * ```javascript
     * var systemVolumeLevel = audioDevice.getSystemLevel();
     * ```
     */
    getSystemLevel(): number;
    /**
     * param: volume<number>
     * ```
     * return: AudioDevice (used for chaining)
     * ```
     *
     * Sets the device system volume
     *
     * #### Usage
     *
     * ```javascript
     * audioDevice._setSystemLevel(100);
     * ```
     */
    _setSystemLevel(hwlevel: number): this;
    /**
     * return: number
     *
     * Gets whether audio device is enabled/muted in the system
     *
     * #### Usage
     *
     * ```javascript
     * var systemAudioDeviceEnabled = audioDevice.getSystemEnabled();
     * ```
     */
    getSystemEnabled(): number;
    /**
     * param: systemEnabled<number>
     * ```
     * return: AudioDevice (used for chaining)
     * ```
     *
     * Enables audio device/sets software mute
     *
     * #### Usage
     *
     * ```javascript
     * // you may use the following:
     * //     * AudioDevice.SYSTEM_LEVEL_MUTE (0)
     * //     * AudioDevice.SYSTEM_LEVEL_ENABLE (1)
     * //     * AudioDevice.SYSTEM_MUTE_CHANGE_NOT_ALLOWED (255)
     * audioDevice._setSystemEnabled(AudioDevice.SYSTEM_LEVEL_MUTE);
     * ```
     */
    _setSystemEnabled(hwenabled: number): this;
    /**
     * return: number (100 nanoseconds in units)
     *
     * Get the loopback capture delay value
     *
     * #### Usage
     *
     * ```javascript
     * var audioDelay = audioDevice.getDelay();
     * ```
     */
    getDelay(): number;
    /**
     * param: delay<number> (100 nanoseconds in units)
     * ```
     * return: AudioDevice (used for chaining)
     * ```
     *
     * Sets the loopback capture delay value
     *
     * #### Usage
     *
     * ```javascript
     * audioDevice._setDelay(100);
     * ```
     */
    _setDelay(delay: number): this;
    /**
     * return: string
     *
     * Converts the AudioDevice object to XML-formatted string
     *
     * #### Usage
     *
     * ```javascript
     * var audioDeviceXMLString = AudioDevice.toString();
     * ```
     */
    toString(): string;
    /**
     * param: deviceJXON<JSON>
     * ```
     * return: AudioDevice
     * ```
     *
     * Converts a JSON object into an AudioDevice object
     *
     * #### Usage
     *
     * ```javascript
     * var newAudioDevice = AudioDevice.parse(deviceJSONObj);
     * ```
     */
    static parse(deviceJXON: JXON): AudioDevice;
}
