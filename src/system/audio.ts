/// <reference path="../../defs/es6-promise.d.ts" />

import {JSON as JXON} from '../internal/util/json';
import {XML as XML} from '../internal/util/xml';
import {App as iApp} from '../internal/app';

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
export class AudioDevice{

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
   * param?: volume<number> (0 to 100 normal range, > 100 will boost volume level)
   * ```
   * return: Promise<number|AudioDevice>
   * ```
   *
   * Set/Get the application audio level of the primary microphone set
   *
   * ### Usage
   *
   * ```javascript
   * AudioDevice.micLevel().then(function(val) {
   *   var micLevel = val;
   * });
   * ```
   */
  micLevel(volume?: number): Promise<number|AudioDevice> {
    return new Promise((resolve, reject) => {
      if (!volume) {
        resolve(this._level);
      } else {
        if (volume < 0) {
          reject(Error('Volume can only be positive'));
        }

        iApp.getAsList('microphonedev2').then(arr => {
          var audioDevices = arr.map(val => {
            return AudioDevice.parse(val);
          });

          if (audioDevices.length && audioDevices.length > 0) {
            var micDevice = audioDevices[0];
            this._level = volume
            audioDevices[0] = micDevice;
            var dev = '';
            if (Array.isArray(audioDevices)) {
                for (var i = 0; i < audioDevices.length; ++i) {
                    dev += audioDevices[i].toString();
                }
            }
            dev = '<devices>' + dev + '</devices>';
            iApp.set('microphonedev2', dev).then(setVal => {
              resolve(this);
            });
          } else {
            reject(Error('No audio device is set as primary microphone'));
          }
        });
      }
    });
  }

  /**
   * param?: enabled<boolean>
   * ```
   * return: Promise<boolean|AudioDevice>
   * ```
   *
   * Get/Set the primary microphone set is enabled or disabled in the application
   *
   * ### Usage
   *
   * ```javascript
   * AudioDevice.micEnabled().then(function(val) {
   *   var isSet = val;
   * });
   * ```
   */
  micEnabled(enabled?: boolean): Promise<boolean|AudioDevice> {
    return new Promise((resolve, reject) => {
      if(!enabled) {
        resolve(this._enable)
      } else {
        iApp.getAsList('microphonedev2').then(arr => {
          var audioDevices = arr.map(val => {
            return AudioDevice.parse(val);
          });

          if (audioDevices.length && audioDevices.length > 0) {
            var micDevice = audioDevices[0];
            micDevice._setEnabled(enabled);
            audioDevices[0] = micDevice;
            var dev = '';
            if (Array.isArray(audioDevices)) {
                for (var i = 0; i < audioDevices.length; ++i) {
                    dev += audioDevices[i].toString();
                }
            }
            dev = '<devices>' + dev + '</devices>';
            iApp.set('microphonedev2', dev).then(setVal => {
              resolve(this);
            });
          } else {
            reject(Error('No audio device is set as primary microphone'));
          }
        });
      }
    });
  }

  /**
   * param?: volume<number> (0 to 100)
   * ```
   * return: Promise<number|AudioDevice>
   * ```
   *
   * Get/Set the system audio level of the primary microphone set
   *
   * ### Usage
   *
   * ```javascript
   * AudioDevice.systemMicLevel().then(function(val) {
   *   var isSet = val;
   * });
   * ```
   */
  systemMicLevel(volume: number): Promise<boolean|AudioDevice> {
    return new Promise((resolve, reject) => {
      if (volume < 0) {
        reject(Error('Volume can only be positive'));
      }
      iApp.getAsList('microphonedev2').then(arr => {
        var audioDevices = arr.map(val => {
          return AudioDevice.parse(val);
        });

        if (audioDevices.length && audioDevices.length > 0) {
          var micDevice = audioDevices[0];
          micDevice._setSystemLevel(volume);
          audioDevices[0] = micDevice;
          var dev = '';
          if (Array.isArray(audioDevices)) {
              for (var i = 0; i < audioDevices.length; ++i) {
                  dev += audioDevices[i].toString();
              }
          }
          dev = '<devices>' + dev + '</devices>';
          iApp.set('microphonedev2', dev).then(setVal => {
            resolve(this);
          });
        } else {
          reject(Error('No audio device is set as primary microphone'));
        }
      });
    });
  }

  /**
   * param: hwenabled<number> (0 or 1, or set to 255 to avoid mute change)
   * ```
   * return: Promise<number|AudioDevice>
   * ```
   *
   * Get/Set the primary microphone set is enabled or disabled in the system
   *
   * ### Usage
   *
   * ```javascript
   * AudioDevice.systemMicEnabled().then(function(val) {
   *   var isSet = val;
   * });
   * ```
   */
  systemMicEnabled(hwenabled?: number): Promise<number|AudioDevice> {
    return new Promise((resolve, reject) => {
      if (!hwenabled) {
        resolve(this._hwenable)
      } else {
        if (hwenabled !== 0 && hwenabled !== 1 && hwenabled !== 255) {
          reject(Error('Value can only be 0, 1 or 255'));
        }

        iApp.getAsList('microphonedev2').then(arr => {
          var audioDevices = arr.map(val => {
            return AudioDevice.parse(val);
          });

          if (audioDevices.length && audioDevices.length > 0) {
            var micDevice = audioDevices[0];
            micDevice._setSystemEnabled(hwenabled);
            audioDevices[0] = micDevice;
            var dev = '';
            if (Array.isArray(audioDevices)) {
                for (var i = 0; i < audioDevices.length; ++i) {
                    dev += audioDevices[i].toString();
                }
            }
            dev = '<devices>' + dev + '</devices>';
            iApp.set('microphonedev2', dev).then(setVal => {
              resolve(this);
            });
          } else {
            reject(Error('No audio device is set as primary microphone'));
          }
        });
      }
    });
  }

  /**
   * param?: delay<number> (100 nanoseconds in units)
   * ```
   * return: Promise<number|AudioDevice>
   * ```
   *
   * Get/Set the loopback capture delay of the primary microphone set
   *
   * ### Usage
   *
   * ```javascript
   * AudioDevice.micDelay().then(function(val) {
   *   var isSet = val;
   * });
   * ```
   */
  micDelay(delay?: number): Promise<number|AudioDevice> {
    return new Promise((resolve, reject) => {
      if (!delay) {
        resolve(this._delay)
      } else {
        if (delay < 0) {
          reject(Error('Delay can only be positive'));
        }

        iApp.getAsList('microphonedev2').then(arr => {
          var audioDevices = arr.map(val => {
            return AudioDevice.parse(val);
          });

          if (audioDevices.length && audioDevices.length > 0) {
            var micDevice = audioDevices[0];
            micDevice._setDelay(delay);
            audioDevices[0] = micDevice;
            var dev = '';
            if (Array.isArray(audioDevices)) {
                for (var i = 0; i < audioDevices.length; ++i) {
                    dev += audioDevices[i].toString();
                }
            }
            dev = '<devices>' + dev + '</devices>';
            iApp.set('microphonedev2', dev).then(setVal => {
              resolve(this);
            });
          } else {
            reject(Error('No audio device is set as primary microphone'));
          }
        });
      }
    });
  }

  /**
   * param?: volume<number> (0 to 100 normal range, > 100 will boost volume level)
   * ```
   * return: Promise<number|AudioDevice>
   * ```
   *
   * Get/Set the application audio level of the primary speaker/audio render device
   *
   * ### Usage
   *
   * ```javascript
   * AudioDevice.speakerLevel().then(function(val) {
   *   var isSet = val;
   * });
   * ```
   */
  speakerLevel(volume?: number): Promise<number|AudioDevice> {
    return new Promise((resolve, reject) => {
      if (!volume) {
        resolve(this._level)
      } else {
        if (volume < 0) {
          reject(Error('Volume can only be positive'));
        }

        iApp.getAsList('microphonedev2').then(arr => {
          var audioDevices = arr.map(val => {
            return AudioDevice.parse(val);
          });

          if (audioDevices.length && audioDevices.length > 1) {
            var speakerDevice = audioDevices[1];
            speakerDevice._setLevel(volume);
            audioDevices[1] = speakerDevice;
            var dev = '';
            if (Array.isArray(audioDevices)) {
                for (var i = 0; i < audioDevices.length; ++i) {
                    dev += audioDevices[i].toString();
                }
            }
            dev = '<devices>' + dev + '</devices>';
            iApp.set('microphonedev2', dev).then(setVal => {
              resolve(this);
            });
          } else {
            reject(Error('No audio device is set as primary speaker/audio render device'));
          }
        });
      }
    });
  }

  /**
   * param?: enabled<boolean>
   * ```
   * return: Promise<boolean|AudioDevice>
   * ```
   *
   * Get/Set the primary speaker/audio render device set is enabled or disabled in the applicaation
   *
   * ### Usage
   *
   * ```javascript
   * AudioDevice.speakerEnabled(enabled).then(function(val) {
   *   var isSet = val;
   * });
   * ```
   */
  speakerEnabled(enabled?: boolean): Promise<boolean|AudioDevice> {
    return new Promise((resolve, reject) => {
      if (!enabled) {
        resolve(this._enable)
      } else {
        iApp.getAsList('microphonedev2').then(arr => {
          var audioDevices = arr.map(val => {
            return AudioDevice.parse(val);
          });

          if (audioDevices.length && audioDevices.length > 1) {
            var speakerDevice = audioDevices[1];
            speakerDevice._setEnabled(enabled);
            audioDevices[1] = speakerDevice;
            var dev = '';
            if (Array.isArray(audioDevices)) {
                for (var i = 0; i < audioDevices.length; ++i) {
                    dev += audioDevices[i].toString();
                }
            }
            dev = '<devices>' + dev + '</devices>';
            iApp.set('microphonedev2', dev).then(setVal => {
              resolve(this);
            });
          } else {
            reject(Error('No audio device is set as primary speaker/audio render device'));
          }

        });
      }
    });
  }

  /**
   * param?: volume<number> (0 to 100)
   * ```
   * return: Promise<number|AudioDevice>
   * ```
   *
   * Get/Set the system audio level of the primary speaker/audio render device set
   *
   * ### Usage
   *
   * ```javascript
   * AudioDevice.systemSpeakerLevel().then(function(val) {
   *   var isSet = val;
   * });
   * ```
   */
  systemSpeakerLevel(volume?: number): Promise<number|AudioDevice> {
    return new Promise((resolve, reject) => {
      if(!volume) {
        resolve(this._hwlevel)
      } else {
        if (volume < 0) {
          reject(Error('Volume can only be positive'));
        }
        iApp.getAsList('microphonedev2').then(arr => {
          var audioDevices = arr.map(val => {
            return AudioDevice.parse(val);
          });

          if (audioDevices.length && audioDevices.length > 1) {
            var speakerDevice = audioDevices[1];
            speakerDevice._setSystemLevel(volume);
            audioDevices[1] = speakerDevice;
            var dev = '';
            if (Array.isArray(audioDevices)) {
                for (var i = 0; i < audioDevices.length; ++i) {
                    dev += audioDevices[i].toString();
                }
            }
            dev = '<devices>' + dev + '</devices>';
            iApp.set('microphonedev2', dev).then(setVal => {
              resolve(this);
            });
          } else {
            reject(Error('No audio device is set as primary speaker/audio render device'));
          }
        });
      }
    });
  }

  /**
   * param?: hwenabled<number> (0 or 1, or set to 255 to avoid mute change)
   * ```
   * return: Promise<number|AudioDevice>
   * ```
   *
   * Get/Set the primary speaker/audio render device set is enabled or disabled in the system
   *
   * ### Usage
   *
   * ```javascript
   * AudioDevice.systemSpeakerEnabled().then(function(val) {
   *   var isSet = val;
   * });
   * ```
   */
  systemSpeakerEnabled(hwenabled?: number): Promise<number|AudioDevice> {
    return new Promise((resolve, reject) => {
      if (!hwenabled) {
        resolve(this._hwenable)
      } else {
        if (hwenabled !== 0 && hwenabled !== 1 && hwenabled !== 255) {
          reject(Error('Value can only be 0, 1 or 255'));
        }

        iApp.getAsList('microphonedev2').then(arr => {
          var audioDevices = arr.map(val => {
            return AudioDevice.parse(val);
          });

          if (audioDevices.length && audioDevices.length > 1) {
            var speakerDevice = audioDevices[1];
            speakerDevice._setSystemEnabled(hwenabled);
            audioDevices[1] = speakerDevice;
            var dev = '';
            if (Array.isArray(audioDevices)) {
                for (var i = 0; i < audioDevices.length; ++i) {
                    dev += audioDevices[i].toString();
                }
            }
            dev = '<devices>' + dev + '</devices>';
            iApp.set('microphonedev2', dev).then(setVal => {
              resolve(this);
            });
          } else {
            reject(Error('No audio device is set as primary speaker/audio render device'));
          }
        });
      }
    });
  }

  /**
   * param?: delay<number> (100 nanoseconds in units)
   * ```
   * return: Promise<number|AudioDevice>
   * ```
   *
   * Get/Set the loopback capture delay of the primary speaker/audio render device
   *
   * ### Usage
   *
   * ```javascript
   * App.speakerDelay().then(function(val) {
   *   var isSet = val;
   * });
   * ```
   */
  speakerDelay(delay?: number): Promise<number|AudioDevice> {
    return new Promise((resolve, reject) => {
      if (!delay) {
        resolve(this._delay)
      } else {
        if (delay < 0) {
          reject(Error('Delay can only be positive'));
        }

        iApp.getAsList('microphonedev2').then(arr => {
          var audioDevices = arr.map(val => {
            return AudioDevice.parse(val);
          });

          if (audioDevices.length && audioDevices.length > 1) {
            var speakerDevice = audioDevices[1];
            speakerDevice._setDelay(delay);
            audioDevices[1] = speakerDevice;
            var dev = '';
            if (Array.isArray(audioDevices)) {
                for (var i = 0; i < audioDevices.length; ++i) {
                    dev += audioDevices[i].toString();
                }
            }
            dev = '<devices>' + dev + '</devices>';
            iApp.set('microphonedev2', dev).then(setVal => {
              resolve(this);
            });
          } else {
            reject(Error('No audio device is set as primary speaker/audio render device'));
          }

        });
      }
    });
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
  _getLevel(): number {
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
   * Gets whether the audio device is enabled/not
   *
   * #### Usage
   *
   * ```javascript
   * var isAudioDeviceEnabled = audioDevice.isEnabled();
   * ```
   */
  _isEnabled(): boolean {
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
  _getSystemLevel(): number {
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
  _getSystemEnabled(): number {
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
  _getDelay(): number {
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
   * Converts the AudioDevice object to XML-formatted string
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
    device['level']    = (this._getLevel()/100).toFixed(6);
    device['enable']   = this._isEnabled() ? 1 : 0;
    device['hwlevel']  = (this._getSystemLevel()/100).toFixed(6);
    device['hwenable'] = this._getSystemEnabled();
    device['delay']    = this._getDelay();
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
      defaultMultimedia : (deviceJXON['DefaultMultimedia'] === '1'),
      mix: deviceJXON['mix']
    });

    audio._setLevel(Number(deviceJXON['level'] !== undefined ? deviceJXON['level']*100 : 100))
      ._setEnabled(deviceJXON['enable'] !== undefined ? deviceJXON['enable'] === '1' : true)
      ._setSystemLevel(Number(deviceJXON['hwlevel'] !== undefined ? deviceJXON['hwlevel']*100 : -100))
      ._setSystemEnabled(Number(deviceJXON['hwenable'] !== undefined ? deviceJXON['hwenable'] : 255))
      ._setDelay(Number(deviceJXON['delay'] !== undefined ? deviceJXON['delay'] : 0));

    return audio;
  }
}
