/// <reference path="../../defs/es6-promise.d.ts" />

import {JSON as JXON} from '../internal/util/json';
import {XML as XML} from '../internal/util/xml';

export class AudioDevice{

  private id: string;
  private name: string;
  private adapter: string;
  private adapterdev: string;
  private DSoundGuid: string;

  private DataFlow: string;
  private State: string;

  private DefaultConsole: boolean = false;
  private DefaultMultimedia: boolean = false;
  private DefaultCommunication: boolean = false;

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
    return this.DataFlow;
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

    var audio = new AudioDevice();
    audio.id = deviceJXON['id'];
    audio.name = deviceJXON['name'];
    audio.adapter = deviceJXON['adapter'];
    audio.adapterdev = deviceJXON['adapterdev'];
    audio.DataFlow = deviceJXON['DataFlow'];
    audio.State = deviceJXON['tate'];
    audio.DSoundGuid = deviceJXON['DSoundGuid'];
    audio.DefaultCommunication = (deviceJXON['DefaultCommunication'] === '1');
    audio.DefaultConsole = (deviceJXON['DefaultConsole'] === '1');
    audio.DefaultMultimedia = (deviceJXON['DefaultMultimedia'] === '1');

    return audio;
  }

}
