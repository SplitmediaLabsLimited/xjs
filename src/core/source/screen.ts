/// <reference path="../../../defs/es6-promise.d.ts" />
import {Source} from '../source/source';
import {Item as iItem} from '../../internal/item';

export class ScreenSource extends Source {

  /**
   * return: Promise<boolean>
   *
   * Checks if the Screen Capture Item captures a window based on
   * the window's title.
   */
  isStickToTitle(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:ScrCapTrackWindowTitle', this._id).then(val => {
        resolve(val === '0');
      });
    });
  }

  /**
   * param: Promise<boolean>
   * ```
   * return: Promise<ScreenSource>
   * ```
   *
   * Set the Screen Capture to capture the window based on the window title.
   * Useful when capturing programs with multiple tabs, for you to only
   * capture a particular tab.
   */
  setStickToTitle(value: boolean): Promise<ScreenSource> {
    return new Promise(resolve => {
      iItem.set('prop:ScrCapTrackWindowTitle', value ? '0' : '1', this._id)
        .then(() => {
          resolve(this);
        });
    });
  }

  /**
   * return Promise<boolean>
   *
   * Checks if the Screen Capture layered window is selected.
   */
  getCaptureLayered(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:ScrCapLayered', this._id).then(val => {
        resolve(val === '1');
      });
    });
  }

  /**
   * param: (value: boolean)
   * ```
   * return Promise<ScreenSource>
   * ```
   *
   * Sets the Screen Capture Layered window
   */
  setCaptureLayered(value: boolean): Promise<ScreenSource> {
    return new Promise(resolve => {
      iItem.set('prop:ScrCapLayered', value ? '1' : '0', this._id).then(val => {
        resolve(this);
      });
    });
  }

  /**
   * return Promise<boolean>
   *
   * Checks if the Exclusive Window capture is selected.
   */
  getOptimizedCapture(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:ScrCapOptCapture1', this._id).then(val => {
        resolve(val === '1');
      });
    });
  }

  /**
   * param: (value: boolean)
   * ```
   * return Promise<ScreenSource>
   * ```
   *
   * Sets the Exclusive Window capture.
   */
  setOptimizedCapture(value: boolean): Promise<ScreenSource> {
    return new Promise(resolve => {
      iItem.set('prop:ScrCapOptCapture1', value ? '1' : '0', this._id).then(val => {
        resolve(this);
      });
    });
  }


  /**
   * return Promise<boolean>
   *
   * Checks if the Show mouse clicks is selected.
   *
   */
  getShowMouseClicks(): Promise<boolean> {
    return new Promise(resolve => {
    iItem.get('prop:ScrCapShowClicks', this._id).then(val => {
        resolve(val === '1');
      });
    });
  }

  /**
   * param: (value: boolean)
   * ```
   * return Promise<ScreenSource>
   * ```
   *
   * Sets the Show mouse clicks.
   */
  setShowMouseClicks(value: boolean): Promise<ScreenSource> {
    return new Promise(resolve => {
    iItem.set('prop:ScrCapShowClicks', value ? '1' : '0', this._id).then(val => {
        resolve(this)
      });
    });
  }

  /**
   * return Promise<boolean>
   *
   * Checks if the Show mouse is selected.
   *
   */
  getShowMouse(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:ScrCapShowMouse', this._id).then(val => {
        resolve(val === '1');
      });
    });
  }

  /**
   * param: (value: boolean)
   * ```
   * return Promise<ScreenSource>
   * ```
   *
   * Sets the Show Mouse.
   */
  setShowMouse(value: boolean): Promise<ScreenSource> {
    return new Promise(resolve => {
      iItem.set('prop:ScrCapShowMouse', value ? '1' : '0', this._id).then(val => {
        if (val === true) {
          iItem.set('prop:ScrCapShowClicks', value ? '1' : '0', this._id);
        }
        resolve(this);
      });
    });
  }
}
