/// <reference path="../../defs/es6-promise.d.ts" />

import {JSON as JXON} from '../internal/util/json';
import {XML as XML} from '../internal/util/xml';

/**
 * The AudioDevice Class is the object returned by
 * {@link #system/System System Class'} getAudioDevices method. It provides you
 * with methods to fetch the audio device object's attributes, and also provides
 * methods to convert it back to an XML object that is compatible with XBC
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
export class AudioDevice{

  static STATE_ACTIVE: string = 'Active';

  static DATAFLOW_RENDER: string = 'Render';
  static DATAFLOW_CAPTURE: string = 'Capture';

  static SYSTEM_LEVEL_MUTE: number = 0;
  static SYSTEM_LEVEL_ENABLE: number = 1;
  static SYSTEM_MUTE_CHANGE_NOT_ALLOWED: number = 255;

  private _id: string;
  private _name: string;
  private _adapter: string;
  private _adapterdev: string;
  private _dSoundGuid: string;

  private _dataFlow: string;
  private _state: string;

  private _defaultConsole: boolean = false;
  private _defaultMultimedia: boolean = false;
  private _defaultCommunication: boolean = false;

  // for microphonedev2
  private _level: number;
  private _enable: boolean;
  private _hwlevel: number;
  private _hwenable: number;
  private _delay: number;
  private _mix: number;

  constructor(props?: {}) {
    props = props || {};

    this._id                   = props['id'];
    this._name                 = props['name'];
    this._adapter              = props['adapter'];
    this._adapterdev           = props['adapterdev'];
    this._dSoundGuid           = props['dSoundGuid'];
    this._dataFlow             = props['dataFlow'];
    this._state                = props['state'];
    this._defaultConsole       = props['defaultConsole'];
    this._defaultMultimedia    = props['defaultMultimedia'];
    this._defaultCommunication = props['defaultCommunication'];
    this._level                = props['level'] !== undefined? props['level'] : 1.000000;
    this._enable               = props['enable'] !== undefined? props['enable'] : true;
    this._hwlevel              = props['hwlevel'] !== undefined? props['hwlevel'] : -1.000000;
    this._hwenable             = props['hwenable'] !== undefined? props['hwenable'] : 255;
    this._delay                = props['delay'] !== undefined? props['delay'] : 0;
    this._mix                  = props['mix'] !== undefined? props['mix'] : 0;
  }

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
  getId(): string {
    return this._id;
  }

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
  getName(): string {
    return this._name;
  }

  /**
   * return: string
   *
   * Gets whether device is capturing or rendering audio
   *
   * #### Usage
   *
   * ```javascript
   * var audioDataFlow = device.getDataFlow();
   *   //where possible values are 'render' or 'capture'
   * ```
   */
  getDataFlow(): string {
    return this._dataFlow;
  }

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
  isDefaultDevice(): boolean {
    return (this._defaultConsole && this._defaultMultimedia);
  }

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
  getLevel(): number {
    return this._level;
  }

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
  _setLevel(level: number) {
    this._level = level;

    return this;
  }

  /**
   * return: boolean
   *
   * Gets whether audio device is the system default
   *
   * #### Usage
   *
   * ```javascript
   * var isAudioDeviceEnabled = audioDevice.isEnabled();
   * ```
   */
  isEnabled(): boolean {
    return this._enable;
  }

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
  _setEnabled(enabled: boolean) {
    this._enable = enabled;

    return this;
  }

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
  getSystemLevel(): number {
    return this._hwlevel;
  }

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
  _setSystemLevel(hwlevel: number) {
    this._hwlevel = hwlevel;

    return this;
  }

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
  getSystemEnabled(): number {
    return this._hwenable;
  }

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
  _setSystemEnabled(hwenabled: number) {
    this._hwenable = hwenabled;

    return this;
  }

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
  getDelay(): number {
    return this._delay;
  }

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
  _setDelay(delay: number) {
    this._delay = delay;

    return this;
  }

  /**
   * return: string
   *
   * Converts the AudioDevice item to XML-formatted string
   *
   * #### Usage
   *
   * ```javascript
   * var audioDeviceXMLString = AudioDevice.toString();
   * ```
   */
  toString(): string {
    var device = new JXON();
    device.tag = 'dev';
    device.selfclosing = true;
    device['id']       = this.getId();
    device['level']    = (this.getLevel()/100).toFixed(6);
    device['enable']   = this.isEnabled() ? 1 : 0;
    device['hwlevel']  = (this.getSystemLevel()/100).toFixed(6);
    device['hwenable'] = this.getSystemEnabled();
    device['delay']    = this.getDelay();
    device['mix']      = this._mix;

    return XML.parseJSON(device).toString();
  }

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
  static parse(deviceJXON: JXON): AudioDevice {

    var audio: AudioDevice = new AudioDevice({
      id : deviceJXON['id'],
      name : deviceJXON['name'],
      adapter : deviceJXON['adapter'],
      adapterdev : deviceJXON['adapterdev'],
      dataFlow : deviceJXON['DataFlow'],
      state : deviceJXON['State'],
      dSoundGuid : deviceJXON['DSoundGuid'],
      defaultCommunication : (deviceJXON['DefaultCommunication'] === '1'),
      defaultConsole : (deviceJXON['DefaultConsole'] === '1'),
      defaultMultimedia : (deviceJXON['DefaultMultimedia'] === '1')
    });

    audio._setLevel(Number(deviceJXON['level'] !== undefined ? deviceJXON['level']*100 : 100))
      ._setEnabled(deviceJXON['enable'] !== undefined ? deviceJXON['enable'] === '1' : true)
      ._setSystemLevel(Number(deviceJXON['hwlevel'] !== undefined ? deviceJXON['hwlevel']*100 : -100))
      ._setSystemEnabled(Number(deviceJXON['hwenable'] !== undefined ? deviceJXON['hwenable'] : 255))
      ._setDelay(Number(deviceJXON['delay'] !== undefined ? deviceJXON['delay'] : 0));

    return audio;
  }
}
