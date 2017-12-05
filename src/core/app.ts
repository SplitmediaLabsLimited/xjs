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
   * return: Promise<AudioDevice[]>
   *
   * Gets the primary speaker device used in the application
   *
   * See also: {@link #system/AudioDevice System/AudioDevice}
   *
   * ### Usage
   *
   * ```javascript
   * App.primarySpeaker().then(function(audioDevice) {
   *   var primarySpeaker = audioDevice;
   * });
   * ```
   */
  primarySpeaker(): Promise<AudioDevice> {
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
   * return: Promise<AudioDevice[]>
   *
   * Gets the primary microphone device used in the application
   *
   * See also: {@link #system/AudioDevice System/AudioDevice}
   *
   * ### Usage
   *
   * ```javascript
   * App.primaryMic().then(function(audioDevice) {
   *   var primaryMic = audioDevice;
   * });
   * ```
   */
  primaryMic(): Promise<AudioDevice> {
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
  frameTime(): Promise<number> {
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
  resolution() : Promise<Rectangle> {
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
  viewport() : Promise<Rectangle> {
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
  version() : Promise<string> {
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
   * App.framesRendered().then(function(res) {
   *   var framesrendered = res;
   * });
   * ```
   */
  framesRendered() : Promise<number> {
    return new Promise(resolve => {
      iApp.get('framesrendered').then(val => {
        resolve(Number(val));
      });
    });
  }

  // Audio Services
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
   * App.enableSilenceDetection().then(function(val) {
   *   var isSet = val;
   * });
   * ```
   */
  silenceDetection(enabled?: boolean): Promise<boolean|App> {
    return new Promise(resolve => {
      iApp.get('microphonegain').then(val => {
        var silenceDetectionObj = JXON.parse(val);
        if(enabled) {
          silenceDetectionObj['enable'] = (enabled ? '1' : '0');
          iApp.set('microphonegain',XML.parseJSON(silenceDetectionObj).toString())
          .then(setVal => {
            resolve(setVal);
          });
        } else {
          resolve(silenceDetectionObj['enable'] == '1')
        }
      });
    });
  }

  /**
   * param?: sdPeriod<number>
   * ```
   * return: Promise<number|App>
   * ```
   *
   * Sets silence detection period (0-60000 ms),
   * the length of time after voice detection before silence is again detected
   *
   * ### Usage
   *
   * ```javascript
   * App.silenceDetectionPeriod().then(function(val) {
   *   var isSet = val;
   * });
   * ```
   */
  silenceDetectionPeriod(sdPeriod?: number): Promise<number|App> {
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
        if(sdPeriod) {
          silenceDetectionObj['latency'] = (sdPeriod.toString());
          iApp.set('microphonegain',XML.parseJSON(silenceDetectionObj).toString())
          .then(setVal => {
            resolve(this);
          });
        } else {
          resolve(silenceDetectionObj['latency'] !== undefined ?
            Number(silenceDetectionObj['latency']) : DEFAULT_SILENCE_DETECTION_PERIOD);
        }
      });
    });
  }

  /**
   * param?: sdThreshold<number>
   * ```
   * return: Promise<number|App>
   * ```
   *
   * Sets silence detection threshold/silence amplitude (values from 0-128)
   *
   * ### Usage
   *
   * ```javascript
   * App.silenceDetectionThreshold().then(function(val) {
   *   var isSet = val;
   * });
   * ```
   */
  silenceDetectionThreshold(sdThreshold?: number): Promise<number|App> {
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
        if(sdThreshold) {
          silenceDetectionObj['gain'] = (sdThreshold.toString());
          iApp.set('microphonegain',XML.parseJSON(silenceDetectionObj).toString())
          .then(setVal => {
            resolve(this);
          });
        } else {
          resolve(silenceDetectionObj['gain'] !== undefined ?
          Number(silenceDetectionObj['gain']) : DEFAULT_SILENCE_DETECTION_THRESHOLD);
        }
      });
    });
  }

  // Transition Services

  /**
   * param?: transition<Transition>
   * ```
   * return: Promise<Transition|App>
   * ```
   *
   * Get/Set the transition for scene changes
   *
   * See also: {@link #core/Transition Core/Transition}
   *
   * #### Usage
   *
   * ```javascript
   * var xjs = require('xjs'),
   *     Transition = xjs.Transition,
   *     App = new xjs.App();

   * App.transition().then(function(val) {
   *  var isSet = val;
   * });
   * ```
   */
  transition(transition?: Transition): Promise<Transition|App> {
    return new Promise(resolve => {
      if (transition) {
        iApp.set('transitionid', transition.toString()).then(val => {
          resolve(val);
        });
      } else {
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
      }
    });
  }

  /**
   * param?: time<number>
   * ```
   * return: Promise<number|App>
   * ```
   *
   * Get/Set the scene transition duration in milliseconds
   *
   * #### Usage
   *
   * ```javascript
   * App.transitionTime().then(function(val) {
   *  var isSet = val;
   * });
   * ```
   */
  transitionTime(time?: number): Promise<number|App> {
    return new Promise(resolve => {
      if (time) {
        iApp.set('transitiontime', time.toString()).then(val => {
          resolve(val);
        });
      } else {
        iApp.get('transitiontime').then(val => {
          resolve(Number(val));
        });
      }
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
  clearBrowserCookies(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (Environment.isSourcePlugin()) {
        reject(Error('This method is not available to source plugins.'));
      } else {
        exec('CallHost', 'deletecookie:videoitemprop');
        resolve(true);
      }
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
