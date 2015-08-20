/// <reference path="../../defs/es6-promise.d.ts" />

import {App as iApp} from '../internal/app';
import {AudioDevice as AudioDevice} from '../system/audio';
import {Rectangle as Rectangle} from '../internal/util/rectangle';
import {JSON as JXON} from '../internal/util/json';
import {XML as XML} from '../internal/util/xml';
import {exec} from '../internal/internal';
import {Environment} from '../internal/environment';

var DEFAULT_SILENCE_DETECTION_THRESHOLD: number = 5;
var DEFAULT_SILENCE_DETECTION_PERIOD: number = 1000;

/**
 * The App Class provides you methods to get and set application-related
 * functionalities.
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('XJS');
 * var App = new XJS.App();
 *
 * App.getFrameTime().then(function(frametime) {
 *   window.frametime = frametime;
 * });
 * ```
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
   * var frameTimeP = App.getFrameTime();
   * frameTimeP.then(function(res) {
   *   var frameTime = res;
   * });
   * ```
   */
  getFrametime(): Promise<number> {
    return new Promise(resolve => {
      iApp.get('frametime').then(val => {
        resolve(Number(val));
      });
    });
  }

  /**
   * return: Promise<Rectangle>
   *
   * Gets application default output resolution
   *
   * #### Usage
   *
   * ```javascript
   * var resolutionP = App.getResolution();
   * resolutionP.then(function(res) {
   *   var height = res.getHeight();
   *   var width = res.getWidth();
   * });
   * ```
   */
  getResolution() : Promise<Rectangle> {
    return new Promise(resolve => {
      iApp.get('resolution').then(val => {
        var dimensions = val.split(",");
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
   * #### Usage
   *
   * ```javascript
   * var viewPortP = App.getViewport();
   * viewPortP.then(function(res) {
   *   var height = res.getHeight();
   *   var width = res.getWidth();
   * });
   * ```
   */
  getViewport() : Promise<Rectangle> {
    return new Promise(resolve => {
      iApp.get('viewport').then(val => {
        var dimensions = val.split(",");
        resolve(Rectangle.fromDimensions(parseInt(dimensions[0]),
          parseInt(dimensions[1])))
      });
    });
  }

  /**
   * return: Promise<string>
   *
   * Refers to XSplit Broadcaster DLL file version number
   *
   * #### Usage
   *
   * ```javascript
   * var versionP = App.getVersion();
   * versionP.then(function(res) {
   *   var version = res;
   * });
   * ```
   */
  getVersion() : Promise<string> {
    return new Promise(resolve => {
      resolve(iApp.get('version'));
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
   * var framesrenderedP = App.getFramesRendered();
   * framesrenderedP.then(function(res) {
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
   * return: Promise<AudioDevice>
   *
   * Gets the primary microphone device used in the application
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
    return new Promise(resolve => {
      iApp.getAsList('microphonedev2').then(arr => {
        var audioDevices = arr.map(val => {
          return AudioDevice.parse(val);
        });

        if (audioDevices.length && audioDevices.length > 0)
        {
          resolve(audioDevices[0]);
        }
        else
        {
          resolve(new AudioDevice({ id: "empty" }));
        }
      });
    });
  }

  /**
   * return: Promise<AudioDevice>
   *
   * Gets the primary speaker/audio render device used in the application
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
    return new Promise(resolve => {
      iApp.getAsList('microphonedev2').then(arr => {
        var audioDevices = arr.map(val => {
          return AudioDevice.parse(val);
        });

        if (audioDevices.length && audioDevices.length > 1)
        {
          resolve(audioDevices[1]);
        }
        else
        {
          resolve(new AudioDevice({ id: "empty" }));
        }
      });
    });
  }

  /**
   * param: device<AudioDevice>
   * ```
   * return: Promise<boolean>
   * ```
   *
   * Sets the primary microphone device to be used in the application
   *
   * ### Usage
   *
   * ```javascript
   * App.setPrimaryMic(device).then(function(val) {
   *   var isSet = val;
   * });
   * ```
   */
  setPrimaryMic(device: AudioDevice): Promise<boolean> {
    return new Promise(resolve => {
      iApp.getAsList('microphonedev2').then(arr => {
        var audioDevices = arr.map(val => {
          return AudioDevice.parse(val);
        });
        audioDevices[0] = device;
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
      });
    });
  }

  /**
   * param: device<AudioDevice>
   * ```
   * return: Promise<boolean>
   * ```
   *
   * Sets the primary speaker/audio render device to be used in the application
   *
   * ### Usage
   *
   * ```javascript
   * App.setPrimarySpeaker(device).then(function(val) {
   *   var isSet = val;
   * });
   * ```
   */
  setPrimarySpeaker(device: AudioDevice): Promise<boolean> {
    return new Promise(resolve => {
      iApp.getAsList('microphonedev2').then(arr => {
        var audioDevices = arr.map(val => {
          return AudioDevice.parse(val);
        });
        audioDevices[1] = device;
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
      });
    });
  }

  /**
   * ```
   * return: Promise<boolean>
   * ```
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
        var silenceDetectionObj = JXON.parse(decodeURIComponent(val));
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
        var silenceDetectionObj = JXON.parse(decodeURIComponent(val));
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
        var silenceDetectionObj = JXON.parse(decodeURIComponent(val));
        silenceDetectionObj['gain'] = (sdThreshold.toString());
        iApp.set('microphonegain',XML.parseJSON(silenceDetectionObj).toString())
        .then(setVal => {
          resolve(setVal);
        });
      });
    });
  }

  // Dialog Services

  static BORDER_ENABLE: number          = 1;
  static BORDER_ENABLE_CAPTION: number  = 2;
  static BORDER_ENABLE_SIZING: number   = 4;
  static BORDER_ENABLE_MINIMIZE: number = 8;
  static BORDER_ENABLE_MAXIMIZE: number = 16;

  /**
   * param: url<string>[, width<number>[, height<number>[, flags<number>[, title<string>]]]]
   *
   * Creates a persistent modal dialog.<br/>
   * This method is not available for source
   *
   * #### Usage
   *
   * ```javascript
   * // you may use the following:
   * //     * App.BORDER_ENABLE (1)
   * //     * App.BORDER_ENABLE_CAPTION (2)
   * //     * App.BORDER_ENABLE_SIZING (4)
   * //     * App.BORDER_ENABLE_MINIMIZE (8)
   * //     * App.BORDER_ENABLE_MAXIMIZE (16)
   * App.newDialog(url, width, height, flags, title);
   * ```
   */
  newDialog(
    url: string,
    width: number = 300,
    height: number = 300,
    flags?: number,
    title?: string
  ): void {
    if (Environment.isSourceHtml()) {
      throw new TypeError('function is not available for source');
    } else if (url !== undefined && url !== '') {
      var params: any[] = ['NewDialog', url, '', width + ',' + height];
      for (let i = 3; i < arguments.length; i++) {
        if (arguments[i] !== undefined) params.push(String(arguments[i]));
      }
      exec.apply(this, params);
    } else {
      throw new Error('URL parameter expected');
    }
  }

  /**
   * param: url<string>[, width<number>[, height<number>]]
   *
   * Creates a dialog that automatically closes on outside click
   *
   * #### Usage
   *
   * ```javascript
   * App.newAutoDialog(url, width, height);
   * ```
   */
  newAutoDialog(url: string, width: number = 300, height: number = 300): void {
    if (Environment.isSourceHtml()) {
      throw new TypeError('function is not available for source');
    } else if (url !== undefined && url !== '') {
      exec('NewAutoDialog', url, width + ',' + height);
    } else {
      throw new Error('URL parameter expected');
    }
  }

  /**
   * Close a created dialog
   */
  closeDialog(): void {
    if (Environment.isSourceHtml()) {
      throw new TypeError('function is not available for source');
    } else {
      exec('CloseDialog');
    }
  }

  // Transition Services

  static TRANSITION_CLOCK: string            = 'clock';
  static TRANSITION_COLLAPSE: string         = 'collapse';
  static TRANSITION_FADE: string             = 'fade';
  static TRANSITION_FAN: string              = 'fan';
  static TRANSITION_HOLE: string             = 'hole';
  static TRANSITION_MOVE_BOTTOM: string      = 'move_bottom';
  static TRANSITION_MOVE_LEFT: string        = 'move_left';
  static TRANSITION_MOVE_LEFT_RIGHT: string  = 'move_left_right';
  static TRANSITION_MOVE_RIGHT: string       = 'move_right';
  static TRANSITION_MOVE_TOP: string         = 'move_top';
  static TRANSITION_MOVE_TOP_BOTTOM: string  = 'move_top_bottom';
  static TRANSITION_WAVE: string             = 'wave';

  /**
   * return: Promise<string>
   *
   * Gets the transition for scene changes
   *
   * #### Usage
   *
   * ```javascript
   * var transitionP = App.getTransition();
   * transitionP.then(function(res) {
   *   var transitionid = res;
   * });
   * ```
   */
  getTransition(): Promise<string> {
    return new Promise(resolve => {
      iApp.get('transitionid').then((val) => {
        resolve(val);
      });
    });
  }

  /**
   * param: transition<string>
   * ```
   * return: Promise<string>
   * ```
   *
   * Sets the transition for scene changes
   *
   * ### Usage
   *
   * ```javascript
   * // you may use the following:
   * //     * App.TRANSITION_CLOCK
   * //     * App.TRANSITION_COLLAPSE
   * //     * App.TRANSITION_FADE
   * //     * App.TRANSITION_FAN
   * //     * App.TRANSITION_HOLE
   * //     * App.TRANSITION_MOVE_BOTTOM
   * //     * App.TRANSITION_MOVE_LEFT
   * //     * App.TRANSITION_MOVE_LEFT_RIGHT
   * //     * App.TRANSITION_MOVE_RIGHT
   * //     * App.TRANSITION_MOVE_TOP
   * //     * App.TRANSITION_MOVE_TOP_BOTTOM
   * //     * App.TRANSITION_WAVE
   * App.setTransition(App.TRANSITION_CLOCK).then(function(val) {
   *  var isSet = val;
   * });
   * ```
   */
  setTransition(transition: string): Promise<boolean> {
    return new Promise(resolve => {
      iApp.set('transitionid', transition).then(val => {
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
   * var transitionTimeP = App.getTransitionTime();
   * transitionTimeP.then(function(res) {
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
   * param: transition<number>
   * ```
   * return: Promise<string>
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
}
