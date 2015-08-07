/// <reference path="../../defs/es6-promise.d.ts" />

import {App as iApp} from '../internal/app';
import {Rectangle as Rectangle} from '../internal/util/rectangle';
import {JSON as JSON} from '../internal/util/json';
import {XML as XML} from '../internal/util/xml';
import {exec} from '../internal/internal';
import {Environment} from './environment';

export class App{

  /**
   * Gets application's frame time (duration per frame in 100ns unit)
   *
   * @return {Promise<number>}
   */
  getFrametime(): Promise<number> {
    return new Promise(resolve => {
      iApp.get('frametime').then(val => {
        resolve(Number(val));
      });
    });
  }

  /**
   * Gets application default output resolution
   *
   * @return {Promise<Rectangle>}
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
   * Gets application viewport display resolution
   *
   * @return {Promise<Rectangle>}
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
   * Refers to XSplit Broadcaster DLL file version number
   *
   * @return {Promise<string>}
   */
  getVersion() : Promise<string> {
    return new Promise(resolve => {
      resolve(iApp.get('version'));
    });
  }

  /**
   * Gets the total number of frames rendered
   *
   * @return {Promise<number>}
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
   * Gets the configuration for silence detection
   *
   * @return {Promise<JSON>}
   */
  getAudioGain(): Promise<JSON> {
    return new Promise(resolve => {
      iApp.get('microphonegain').then(val => {
        resolve(JSON.parse(val));
      });
    });
  }

  /**
   * Sets the configuration for silence detection
   *
   * @param {JSON} config
   * @return {Promise<JSON>}
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
   * Creates a persistent modal dialog.
   * This method is not available for source
   *
   * @param {string} url
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
   * Creates a dialog that automatically closes on outside click
   *
   * @param {string} url
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
   * Gets the transition for scene changes.
   *
   * @return {Promise<string>}
   */
  getTransition(): Promise<string> {
    return new Promise(resolve => {
      iApp.get('transitionid').then((val) => {
        resolve(val);
      });
    });
  }

  /** Sets the transition for scene changes.
   *
   * @param {string} transition
   */
  setTransition(transition: string): void {
    iApp.set('transitionid', transition);
  }

  /** Gets the scene transition duration in milliseconds.
   *
   * @return {Promise<Number>}
   */
  getTransitionTime(): Promise<Number> {
    return new Promise(resolve => {
      iApp.get('transitiontime').then(val => {
        resolve(Number(val));
      });
    });
  }

  /** Sets the scene transition duration in milliseconds.
   *
   * @param {Number} time
   */
  setTransitionTime(time: Number): void {
    iApp.set('transitiontime', time.toString());
  }
}
