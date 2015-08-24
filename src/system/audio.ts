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

  private id: string;
  private name: string;
  private adapter: string;
  private adapterdev: string;
  private dSoundGuid: string;

  private dataFlow: string;
  private state: string;

  private defaultConsole: boolean = false;
  private defaultMultimedia: boolean = false;
  private defaultCommunication: boolean = false;

  // for microphonedev2
  private level: number;
  private enable: boolean;
  private hwlevel: number;
  private hwenable: boolean;
  private delay: number;

  constructor(props?: {}) {
    props = props || {};

    this.id                   = props['id'];
    this.name                 = props['name'];
    this.adapter              = props['adapter'];
    this.adapterdev           = props['adapterdev'];
    this.dSoundGuid           = props['dSoundGuid'];
    this.dataFlow             = props['dataFlow'];
    this.state                = props['state'];
    this.defaultConsole       = props['defaultConsole'];
    this.defaultMultimedia    = props['defaultMultimedia'];
    this.defaultCommunication = props['defaultCommunication'];
    this.level                = props['level'] !== undefined? props['level'] : 1.000000;
    this.enable               = props['enable'] !== undefined? props['enable'] : true;
    this.hwlevel              = props['hwlevel'] !== undefined? props['hwlevel'] : -1.000000;
    this.hwenable             = props['hwenable'] !== undefined? props['hwenable'] : true;
    this.delay                = props['delay'] !== undefined? props['delay'] : 0;
  }

  /**
   * return: string
   *
   * Gets the device ID
   *
   * #### Usage
   *
   * ```javascript
   * var audioDeviceID = device.getID();
   * ```
   */
  getId(): string {
    return this.id;
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
    return this.name;
  }

  /**
   * return: string
   *
   * Gets whether device is capturing or rendering audio
   *
   * #### Usage
   *
   * ```javascript
   * var audioDeviceName = device.getName();
   * // possible values, "render"/"capture"
   * ```
   */
  getDataFlow(): string {
    return this.dataFlow;
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
    return (this.defaultConsole && this.defaultMultimedia);
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
    return this.level;
  }

  /**
   * param: number
   * ```
   * return: AudioDevice
   * ```
   *
   * Sets the device audio level in the application
   *
   * #### Usage
   *
   * ```javascript
   * audioDevice.setLevel(100);
   * ```
   */
  setLevel(level: number) {
    this.level = level;

    return this;
  }

  /**
   * return: boolean
   *
   * Gets whether audio device is enabled/muted in the application
   *
   * #### Usage
   *
   * ```javascript
   * var isAudioDeviceEnabled = audioDevice.isEnabled();
   * ```
   */
  isEnabled(): boolean {
    return this.enable;
  }

  /**
   * param: boolean
   * ```
   * return: AudioDevice (used for chaining)
   * ```
   *
   * Enables audio device/sets software mute
   *
   * #### Usage
   *
   * ```javascript
   * audioDevice.setLevel(100);
   * ```
   */
  setEnabled(enabled: boolean) {
    this.enable = enabled;

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
   * var appVolumeLevel = audioDevice.getLevel();
   * ```
   */
  getSystemLevel(): number {
    return this.hwlevel;
  }

  /**
   * param: number
   * ```
   * return: AudioDevice (used for chaining)
   * ```
   *
   * Sets the device system volume
   *
   * #### Usage
   *
   * ```javascript
   * audioDevice.setLevel(100);
   * ```
   */
  setSystemLevel(hwlevel: number) {
    this.hwlevel = hwlevel;

    return this;
  }

  /**
   * return: boolean
   *
   * Gets whether audio device is enabled/muted in the system
   *
   * #### Usage
   *
   * ```javascript
   * var isAudioDeviceEnabled = audioDevice.isEnabled();
   * ```
   */
  isSystemEnabled(): boolean {
    return this.hwenable;
  }

  /**
   * param: boolean
   * ```
   * return: AudioDevice (used for chaining)
   * ```
   *
   * Enables audio device/sets software mute
   *
   * #### Usage
   *
   * ```javascript
   * audioDevice.setLevel(100);
   * ```
   */
  setSystemEnabled(hwenabled: boolean) {
    this.hwenable = hwenabled;

    return this;
  }

  /**
   * return: number (100 nanoseconds units)
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
    return this.delay;
  }

  /**
   * param: number (100 nanoseconds units)
   * ```
   * return: AudioDevice (used for chaining)
   * ```
   *
   * Sets the loopback capture delay value
   *
   * #### Usage
   *
   * ```javascript
   * audioDevice.setLevel(100);
   * ```
   */
  setDelay(delay: number) {
    this.delay = delay;

    return this;
  }

  /**
   * return: string (XML format)
   *
   * Converts the AudioDevice item to XML string
   *
   * #### Usage
   *
   * ```javascript
   * var audioDeviceXMLString = AudioDevice.toString;
   * ```
   */
  /** Converts the AudioDevice item to XML string */
  toString(): string {
    var device = new JXON();
    device.tag = 'dev';
    device.selfclosing = true;
    device['id']       = this.getId();
    device['level']    = this.getLevel();
    device['enable']   = this.isEnabled() ? 1 : 0;
    device['hwlevel']  = this.getSystemLevel();
    device['hwenable'] = this.isSystemEnabled() ? 1 : 0;
    device['delay']    = this.getDelay();

    return XML.parseJSON(device).toString();
  }

  /**
   * param: JXON
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

    audio.setLevel(Number(deviceJXON['level'] !== undefined ? deviceJXON['level'] : 1))
      .setEnabled(deviceJXON['enable'] !== undefined ? deviceJXON['enable'] === '1' : true)
      .setSystemLevel(Number(deviceJXON['hwlevel'] !== undefined ? deviceJXON['hwlevel'] : 1))
      .setSystemEnabled(deviceJXON['hwenable'] !== undefined ? deviceJXON['hwenable'] === '1' : true)
      .setDelay(Number(deviceJXON['delay'] !== undefined ? deviceJXON['delay'] : 1));

    return audio;
  }

}
