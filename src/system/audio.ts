/// <reference path="../../defs/es6-promise.d.ts" />

import {JSON as JXON} from '../internal/util/json';
import {XML as XML} from '../internal/util/xml';

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
   * Gets the device ID
   *
   * #Return
   *
   * ```
   * string
   * ```
   *
   * #Usage
   *
   * ````
   * var audioDeviceID = device.getID();
   * ```
   */
  getId(): string {
    return this.id;
  }

  /**
   * Gets the device name
   *
   * #Return
   *
   * ```
   * string
   * ```
   *
   * #Usage
   *
   * ````
   * var audioDeviceName = device.getName();
   * ```
   */
  getName(): string {
    return this.name;
  }

  /**
   * Gets whether device is capturing or rendering audio
   *
   * #Return
   *
   * ```
   * string
   * ```
   *
   * #Usage
   *
   * ````
   * var audioDeviceName = device.getName();
   * // possible values, "render"/"capture"
   * ```
   */
  getDataFlow(): string {
    return this.dataFlow;
  }

  /**
   * Gets whether audio device is the system default
   *
   * #Return
   *
   * ```
   * boolean
   * ```
   *
   * #Usage
   *
   * ````
   * var audioIsDefaultDevice = audioDevice.isDefaultDevice();
   * ```
   */
  isDefaultDevice(): boolean {
    return (this.defaultConsole && this.defaultMultimedia);
  }

  /**
   * Gets the device audio level in the application
   *
   * #Return
   *
   * ```
   * number
   * ```
   *
   * #Usage
   *
   * ````
   * var audioDeviceVolumeLevel = audioDevice.getLevel();
   * ```
   */
  getLevel(): number {
    return this.level;
  }

  /**
   * Sets the device audio level in the application
   *
   * #Parameter
   *
   * ```
   * number
   * ```
   *
   * #Return
   *
   * ```
   * AudioDevice (used for chaining)
   * ```
   *
   * #Usage
   *
   * ````
   * audioDevice.setLevel(100);
   * ```
   */
  setLevel(level: number) {
    this.level = level;

    return this;
  }

  /**
   * Gets whether audio device is enabled/muted in the application
   *
   * #Return
   *
   * ```
   * boolean
   * ```
   *
   * #Usage
   *
   * ````
   * var isAudioDeviceEnabled = audioDevice.isEnabled();
   * ```
   */
  isEnabled(): boolean {
    return this.enable;
  }

  /**
   * Enables audio device/sets software mute
   *
   * #Parameter
   *
   * ```
   * boolean
   * ```
   *
   * #Return
   *
   * ```
   * AudioDevice (used for chaining)
   * ```
   *
   * #Usage
   *
   * ````
   * audioDevice.setLevel(100);
   * ```
   */
  setEnabled(enabled: boolean) {
    this.enable = enabled;

    return this;
  }

  /**
   * Gets the device system volume
   *
   * #Return
   *
   * ```
   * number
   * ```
   *
   * #Usage
   *
   * ````
   * var appVolumeLevel = audioDevice.getLevel();
   * ```
   */
  getSystemLevel(): number {
    return this.hwlevel;
  }

  /**
   * Sets the device system volume
   *
   * #Parameter
   *
   * ```
   * number
   * ```
   *
   * #Return
   *
   * ```
   * AudioDevice (used for chaining)
   * ```
   *
   * #Usage
   *
   * ````
   * audioDevice.setLevel(100);
   * ```
   */
  setSystemLevel(hwlevel: number) {
    this.hwlevel = hwlevel;

    return this;
  }

  /**
   * Gets whether audio device is enabled/muted in the system
   *
   * #Return
   *
   * ```
   * boolean
   * ```
   *
   * #Usage
   *
   * ````
   * var isAudioDeviceEnabled = audioDevice.isEnabled();
   * ```
   */
  isSystemEnabled(): boolean {
    return this.hwenable;
  }

  /**
   * Enables audio device/sets software mute
   *
   * #Parameter
   *
   * ```
   * boolean
   * ```
   *
   * #Return
   *
   * ```
   * AudioDevice (used for chaining)
   * ```
   *
   * #Usage
   *
   * ````
   * audioDevice.setLevel(100);
   * ```
   */
  setSystemEnabled(hwenabled: boolean) {
    this.hwenable = hwenabled;

    return this;
  }

  /**
   * Get the loopback capture delay value 
   *
   * #Return
   *
   * ```
   * number (100 nanoseconds units)
   * ```
   *
   * #Usage
   *
   * ````
   * var audioDelay = audioDevice.getDelay();
   * ```
   */
  getDelay(): number {
    return this.delay;
  }

  /**
   * Sets the loopback capture delay value 
   *
   * #Parameter
   *
   * ```
   * number (100 nanoseconds units)
   * ```
   *
   * #Return
   *
   * ```
   * AudioDevice (used for chaining)
   * ```
   *
   * #Usage
   *
   * ````
   * audioDevice.setLevel(100);
   * ```
   */
  setDelay(delay: number) {
    this.delay = delay;

    return this;
  }

  /**
   * Converts the AudioDevice item to XML string
   *
   * #Return
   *
   * ```
   * string (XML format)
   * ```
   *
   * #Usage
   *
   * ````
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
   * Converts a JSON object into an AudioDevice object
   *
   * #Parameter
   *
   * ```
   * deviceJXON: JXON
   * ```
   *
   * #Return
   *
   * ```
   * AudioDevice
   * ```
   *
   * #Usage
   *
   * ````
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
