/// <reference path="../../defs/es6-promise.d.ts" />

import {JSON as JXON} from '../internal/util/json';
import {XML as XML} from '../internal/util/xml';

export class AudioDevice{

  static STATE_ACTIVE: string = 'Active';

  static DATAFLOW_RENDER: string = 'Render';
  static DATAFLOW_CAPTURE: string = 'Capture';

  static SYSTEM_LEVEL_MUTE: number = 0;
  static SYSTEM_LEVEL_ENABLE: number = 1;
  static SYSTEM_MUTE_CHANGE_NOT_ALLOWED: number = 255;

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
  private hwenable: number;
  private delay: number;
  private mix: number;

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
    this.hwenable             = props['hwenable'] !== undefined? props['hwenable'] : 255;
    this.delay                = props['delay'] !== undefined? props['delay'] : 0;
    this.mix                  = props['mix'] !== undefined? props['mix'] : 0;
  }

  /**
   * return: id<string>
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
   * return: name<string>
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
   * return: dataflow<string>
   *
   * Gets whether device is capturing or rendering audio
   *
   * #### Usage
   *
   * ```javascript
   * var audioDataFlow = device.getDataFlow();
   *   //where possible values are "render" or "capture"
   * ```
   */
  getDataFlow(): string {
    return this.dataFlow;
  }

  /**
   * return: isDefaultDevice<boolean>
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
   * return: appDeviceVolume<number>
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
   * param: volume<number>
   * ```
   * return: audioDevice<AudioDevice>, for chaining
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
   * return: isEnabled<boolean>
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
    return this.enable;
  }

  /**
   * param: enabled<boolean>
   * ```
   * return: audioDevice<AudioDevice>, for chaining
   * ```
   *
   * Enables audio device/sets software mute
   *
   * #### Usage
   *
   * ```javascript
   * audioDevice.setEnabled(true);
   * ```
   */
  setEnabled(enabled: boolean) {
    this.enable = enabled;

    return this;
  }

  /**
   * return: systemDeviceVolume<number>
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
    return this.hwlevel;
  }

  /**
   * param: volume<number>
   * ```
   * return: audioDevice<AudioDevice>, for chaining
   * ```
   *
   * Sets the device system volume
   *
   * #### Usage
   *
   * ```javascript
   * audioDevice.setSystemLevel(100);
   * ```
   */
  setSystemLevel(hwlevel: number) {
    this.hwlevel = hwlevel;

    return this;
  }

  /**
   * return: isSystemEnabled<number>
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
    return this.hwenable;
  }

  /**
   * param: systemEnabled<number>
   * ```
   * return: audioDevice<AudioDevice>, for chaining
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
   * audioDevice.setSystemEnabled(AudioDevice.SYSTEM_LEVEL_MUTE);
   * ```
   */
  setSystemEnabled(hwenabled: number) {
    this.hwenable = hwenabled;

    return this;
  }

  /**
   * return: delay<number> (100 nanoseconds in units)
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
   * param: delay<number> (100 nanoseconds in units)
   * ```
   * return: audioDevice<AudioDevice>, for chaining
   * ```
   *
   * Sets the loopback capture delay value
   *
   * #### Usage
   *
   * ```javascript
   * audioDevice.setDelay(100);
   * ```
   */
  setDelay(delay: number) {
    this.delay = delay;

    return this;
  }

  /**
   * return: xmlString<string>
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
    device['level']    = this.getLevel().toFixed(6);
    device['enable']   = this.isEnabled() ? 1 : 0;
    device['hwlevel']  = this.getSystemLevel().toFixed(6);
    device['hwenable'] = this.getSystemEnabled();
    device['delay']    = this.getDelay();
    device['mix']      = this.mix;
    
    return XML.parseJSON(device).toString();
  }

  /**
   * param: deviceJXON<JSON>
   * ```
   * return: audioDevice<AudioDevice>
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
      .setSystemLevel(Number(deviceJXON['hwlevel'] !== undefined ? deviceJXON['hwlevel'] : -1))
      .setSystemEnabled(deviceJXON['hwenable'] !== undefined ? deviceJXON['hwenable'] : 255)
      .setDelay(Number(deviceJXON['delay'] !== undefined ? deviceJXON['delay'] : 0)); 

    return audio;
  }
}
