/// <reference path="../../defs/es6-promise.d.ts" />

import {App as iApp} from '../internal/app';
import {Rectangle as Rectangle} from '../internal/util/rectangle';
import {JSON as JSON} from '../internal/util/json';
import {XML as XML} from '../internal/util/xml';
import {exec} from '../internal/internal';
import {Environment} from '../internal/environment';

/**
 * The App Class provides you methods to get and set application related
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
   * return: Promise<JSON>
   *
   * Gets the configuration for silence detection
   *
   * #### Usage
   *
   * ```javascript
   * var audioGainP = App.getAudioGain();
   * audioGainP.then(function(res) {
   *   var audioGain = res;
   * });
   * ```
   */
  getAudioGain(): Promise<JSON> {
    return new Promise(resolve => {
      iApp.get('microphonegain').then(val => {
        resolve(JSON.parse(val));
      });
    });
  }

  /**
   * param: config<JSON>
   *
   * Sets the configuration for silence detection
   *
   * #### Usage
   *
   * ```javascript
   * App.setAudioGain(configJSON);
   * ```
   */
  setAudioGain(config: JSON): void {
    config.tag = 'configuration';

    iApp.set('microphonegain', XML.parseJSON(config).toString());
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
   *
   * Sets the transition for scene changes
   *
   * #### Usage
   *
   * ```javascript
   * App.setTransition(transitionid);
   * ```
   */
  setTransition(transition: string): void {
    iApp.set('transitionid', transition);
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
   *
   * Sets the scene transition duration in milliseconds
   *
   * #### Usage
   *
   * ```javascript
   * App.setTransitionTime(transitiontime);
   * ```
   */
  setTransitionTime(time: Number): void {
    iApp.set('transitiontime', time.toString());
  }
}
