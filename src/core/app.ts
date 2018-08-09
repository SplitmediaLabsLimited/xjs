/// <reference path="../../defs/es6-promise.d.ts" />

import {App as iApp} from '../internal/app';
import {Rectangle as Rectangle} from '../util/rectangle';
import {AudioDevice as AudioDevice} from '../system/audio';
import {JSON as JXON} from '../internal/util/json';
import {XML as XML} from '../internal/util/xml';
import {exec} from '../internal/internal';
import {Environment} from './environment';
import {Transition} from './transition';
import {mockVersion} from '../internal/util/version';

var DEFAULT_SILENCE_DETECTION_THRESHOLD: number = 5;
var DEFAULT_SILENCE_DETECTION_PERIOD: number = 1000;

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
export class App{

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
  getFrameTime(): Promise<number> {
    return new Promise(resolve => {
      iApp.get('frametime').then(val => {
        resolve(Number(val));
      });
    });
  }

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
  getResolution() : Promise<Rectangle> {
    return new Promise(resolve => {
      iApp.get('resolution').then(val => {
        var dimensions = val.split(',');
        resolve(Rectangle.fromDimensions(parseInt(dimensions[0]),
          parseInt(dimensions[1])));
      });
    });
  }

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
  getViewport() : Promise<Rectangle> {
    return new Promise(resolve => {
      iApp.get('viewport').then(val => {
        var dimensions = val.split(',');
        resolve(Rectangle.fromDimensions(parseInt(dimensions[0]),
          parseInt(dimensions[1])))
      });
    });
  }

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
  getVersion() : Promise<string> {
    return new Promise((resolve, reject) => {
      var xbcPattern = /XSplit Broadcaster\s(.*?)\s/;
      var xbcMatch = navigator.appVersion.match(xbcPattern);
      xbcMatch = xbcMatch || mockVersion.match(xbcPattern);
      if (xbcMatch !== null) {
        resolve(xbcMatch[1]);
      } else {
        reject(Error('not loaded in XSplit Broadcaster'));
      }
    });
  }

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
  getFramesRendered() : Promise<number> {
    return new Promise(resolve => {
      iApp.get('framesrendered').then(val => {
        resolve(Number(val));
      });
    });
  }

  // Audio Services

  /**
   * return: Promise<AudioDevice[]>
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
  getPrimaryMic(): Promise<AudioDevice[]> {
    return new Promise((resolve, reject) => {
      iApp.getAsList('microphonedev2').then(arr => {
        var audioDevices = arr.map(val => {
          return AudioDevice.parse(val);
        });

        if (audioDevices.length && audioDevices.length > 0) {
          resolve(audioDevices[0]);
        } else {
          reject(Error('No audio device is set as primary microphone'));
        }
      });
    });
  }

  /**
   * return: Promise<AudioDevice[]>
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
  getPrimarySpeaker(): Promise<AudioDevice[]> {
    return new Promise((resolve, reject) => {
      iApp.getAsList('microphonedev2').then(arr => {
        var audioDevices = arr.map(val => {
          return AudioDevice.parse(val);
        });

        if (audioDevices.length && audioDevices.length > 1) {
          resolve(audioDevices[1]);
        } else {
          reject(Error('No audio device is set as primary speaker'));
        }
      });
    });
  }

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
  setPrimaryMicLevel(volume: number): Promise<boolean> {
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
          micDevice._setLevel(volume);
          audioDevices[0] = micDevice;
          var dev = '';
          if (Array.isArray(audioDevices)) {
              for (var i = 0; i < audioDevices.length; ++i) {
                  dev += audioDevices[i].toString();
              }
          }
          dev = '<devices>' + dev + '</devices>';
          iApp.set('microphonedev2', dev).then(setVal => {
            resolve(setVal);
          });
        } else {
          reject(Error('No audio device is set as primary microphone'));
        }
      });
    });
  }

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
  setPrimaryMicEnabled(enabled: boolean): Promise<boolean> {
    return new Promise((resolve, reject) => {

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
            resolve(setVal);
          });
        } else {
          reject(Error('No audio device is set as primary microphone'));
        }

      });
    });
  }

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
  setPrimaryMicSystemLevel(volume: number): Promise<boolean> {
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
            resolve(setVal);
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
  setPrimaryMicSystemEnabled(hwenabled: number): Promise<boolean> {
    return new Promise((resolve, reject) => {

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
            resolve(setVal);
          });
        } else {
          reject(Error('No audio device is set as primary microphone'));
        }

      });
    });
  }

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
  setPrimaryMicDelay(delay: number): Promise<boolean> {
    return new Promise((resolve, reject) => {

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
            resolve(setVal);
          });
        } else {
          reject(Error('No audio device is set as primary microphone'));
        }

      });
    });
  }

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
  setPrimarySpeakerLevel(volume: number): Promise<boolean> {
    return new Promise((resolve, reject) => {

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
            resolve(setVal);
          });
        } else {
          reject(Error('No audio device is set as primary speaker/audio render device'));
        }
      });
    });
  }

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
  setPrimarySpeakerEnabled(enabled: boolean): Promise<boolean> {
    return new Promise((resolve, reject) => {

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
            resolve(setVal);
          });
        } else {
          reject(Error('No audio device is set as primary speaker/audio render device'));
        }

      });
    });
  }

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
  setPrimarySpeakerSystemLevel(volume: number): Promise<boolean> {
    return new Promise((resolve, reject) => {

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
            resolve(setVal);
          });
        } else {
          reject(Error('No audio device is set as primary speaker/audio render device'));
        }

      });
    });
  }

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
  setPrimarySpeakerSystemEnabled(hwenabled: number): Promise<boolean> {
    return new Promise((resolve, reject) => {

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
            resolve(setVal);
          });
        } else {
          reject(Error('No audio device is set as primary speaker/audio render device'));
        }

      });
    });
  }

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
  setPrimarySpeakerDelay(delay: number): Promise<boolean> {
    return new Promise((resolve, reject) => {

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
            resolve(setVal);
          });
        } else {
          reject(Error('No audio device is set as primary speaker/audio render device'));
        }

      });
    });
  }

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
  isSilenceDetectionEnabled(): Promise<boolean> {
    return new Promise(resolve => {
      iApp.get('microphonegain').then(val => {
        var micGainObj = JXON.parse(val);
        resolve(micGainObj['enable'] == '1');
      });
    });
  }

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
  enableSilenceDetection(enabled: boolean): Promise<boolean> {
    return new Promise(resolve => {
      iApp.get('microphonegain').then(val => {
        var silenceDetectionObj = JXON.parse(val);
        silenceDetectionObj['enable'] = (enabled ? '1' : '0');
        iApp.set('microphonegain',XML.parseJSON(silenceDetectionObj).toString())
        .then(setVal => {
          resolve(setVal);
        });
      });
    });
  }

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
  getSilenceDetectionPeriod(): Promise<number> {
    return new Promise(resolve => {
      iApp.get('microphonegain').then(val => {
        var micGainObj = JXON.parse(val);
        resolve(micGainObj['latency'] !== undefined ?
          Number(micGainObj['latency']) : DEFAULT_SILENCE_DETECTION_PERIOD);
      });
    });
  }

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
  setSilenceDetectionPeriod(sdPeriod: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (typeof sdPeriod !== 'number') {
        reject(Error('Silence detection period must be a number'));
      } else if (sdPeriod % 1 != 0) {
        reject(Error('Silence detection period must be an integer'));
      } else if (sdPeriod < 0 || sdPeriod > 60000) {
        reject(Error('Silence detection must be in the range 0-60000.'));
      }

      iApp.get('microphonegain').then(val => {
        var silenceDetectionObj = JXON.parse(val);
        silenceDetectionObj['latency'] = (sdPeriod.toString());
        iApp.set('microphonegain',XML.parseJSON(silenceDetectionObj).toString())
        .then(setVal => {
          resolve(setVal);
        });
      });
    });
  }

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
  getSilenceDetectionThreshold(): Promise<number> {
    return new Promise(resolve => {
      iApp.get('microphonegain').then(val => {
        var micGainObj = JXON.parse(val);
        resolve(micGainObj['gain'] !== undefined ?
          Number(micGainObj['gain']) : DEFAULT_SILENCE_DETECTION_THRESHOLD);
      });
    });
  }

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
  setSilenceDetectionThreshold(sdThreshold: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (typeof sdThreshold !== 'number') {
        reject(Error('Silence detection threshold must be a number'));
      } else if (sdThreshold % 1 != 0) {
        reject(Error('Silence detection threshold must be an integer'));
      } else if (sdThreshold < 0 || sdThreshold > 128) {
        reject(Error('Silence detection threshold must be in the range 0-128.'));
      }
      iApp.get('microphonegain').then(val => {
        var silenceDetectionObj = JXON.parse(val);
        silenceDetectionObj['gain'] = (sdThreshold.toString());
        iApp.set('microphonegain',XML.parseJSON(silenceDetectionObj).toString())
        .then(setVal => {
          resolve(setVal);
        });
      });
    });
  }

  // Transition Services

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
  getTransition(): Promise<Transition> {
    return new Promise(resolve => {
      iApp.get('transitionid').then(val => {
        if (val === '') { // NONE
          resolve(Transition.NONE);
        } else {
          let currTransition = Transition[val.toUpperCase()];
          if (typeof currTransition !== 'undefined') {
            resolve(currTransition);
          } else {
            Transition.getSceneTransitions().then(transitions => {
              let inTransition = false;
              let transitionObj;
              let i;

              for (i = 0; i < transitions.length; i++) {
                transitionObj = transitions[i];
                if (transitionObj.toString() === val) {
                  inTransition = true;
                  break;
                }
              }
              if (inTransition) {
                resolve(transitionObj);
              } else {
                resolve(new Transition(val));
              }
            }).catch(err => {
              resolve(new Transition(val));
            });
          }
        }
      });
    });
  }

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
  setTransition(transition: Transition): Promise<boolean> {
    return new Promise(resolve => {
      iApp.set('transitionid', transition.toString()).then(val => {
        resolve(val);
      });
    });
  }

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
  getTransitionTime(): Promise<Number> {
    return new Promise(resolve => {
      iApp.get('transitiontime').then(val => {
        resolve(Number(val));
      });
    });
  }

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
  setTransitionTime(time: number): Promise<boolean> {
    return new Promise(resolve => {
      iApp.set('transitiontime', time.toString()).then(val => {
        resolve(val);
      });
    });
  }

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
  clearBrowserCookies(cookiePath: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if(typeof window.external['CallHostFunc'] === 'function') {
        if(cookiePath && cookiePath !== '') {
          exec('CallHostFunc', 'deleteCookie', cookiePath);
        }
      } else {
        if (Environment.isSourcePlugin()) {
          reject(Error('This method is not available to source plugins.'));
        } else {
          exec('CallHost', 'deletecookie:videoitemprop');
        }
      }     
      resolve(true);      
    });
  }

  /**
   * return: Promise<string>
   *
   * Returns a hashed string that may be used to differentiate among logged-in
   * users. This will be useful in such cases as persisting data to be used by
   * certain XSplit users only.
   */
  getUserIdHash(): Promise<string> {
    return new Promise(resolve => {
      iApp.getGlobalProperty('userid').then( res => {
        resolve(res);
      })
    });
  }
}
