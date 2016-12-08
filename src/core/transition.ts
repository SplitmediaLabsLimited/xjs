/// <reference path="../../defs/es6-promise.d.ts" />

import {App as iApp} from '../internal/app';

/**
 * The Transition class represents a preset transition within XSplit Broadcaster.
 * This may be used to set the application's transition scheme when switching scenes,
 * or to set an individual item's transition when its visibility changes.
 *
 * Simply use one of the available Transition objects such as Transition.FAN or
 * Transition.COLLAPSE as the parameter to the `setTransition()` method of an
 * App instance, or a valid Item instance that supports transitions (this
 * includes {@link #core/CameraItem Core/CameraItem},
 * {@link #core/FlashItem Core/FlashItem},
 * {@link #core/GameItem Core/GameItem},
 * {@link #core/HtmlItem Core/HtmlItem},
 * {@link #core/ImageItem Core/ImageItem},
 * {@link #core/MediaItem Core/MediaItem}, and
 * {@link #core/ScreenItem Core/ScreenItem}.)
 *
 * For scene transitions, you can also use custom stinger transitions,
 * which are exposed through the static method Transition.getSceneTransitions
 */
export class Transition {
  private _value: string;
  private _key: string;

  private static _transitionMap = {
    NONE: '',
    CLOCK: 'clock',
    COLLAPSE: 'collapse',
    FADE: 'fade',
    FAN: 'fan',
    HOLE: 'hole',
    MOVE_BOTTOM: 'move_bottom',
    MOVE_LEFT: 'move_left',
    MOVE_LEFT_RIGHT: 'move_left_right',
    MOVE_RIGHT: 'move_right',
    MOVE_TOP: 'move_top',
    MOVE_TOP_BOTTOM: 'move_top_bottom',
    WAVE: 'wave'
  }

  static NONE: Transition =  new Transition('NONE');
  static CLOCK: Transition =  new Transition('CLOCK');
  static COLLAPSE: Transition =  new Transition('COLLAPSE');
  static FADE: Transition =  new Transition('FADE');
  static FAN: Transition =  new Transition('FAN');
  static HOLE: Transition =  new Transition('HOLE');
  static MOVE_BOTTOM: Transition =  new Transition('MOVE_BOTTOM');
  static MOVE_LEFT: Transition =  new Transition('MOVE_LEFT');
  static MOVE_LEFT_RIGHT: Transition =  new Transition('MOVE_LEFT_RIGHT');
  static MOVE_RIGHT: Transition =  new Transition('MOVE_RIGHT');
  static MOVE_TOP: Transition =  new Transition('MOVE_TOP');
  static MOVE_TOP_BOTTOM: Transition =  new Transition('MOVE_TOP_BOTTOM');
  static WAVE: Transition =  new Transition('WAVE');

  constructor(key: string, setValue = null) {
    var value = Transition._transitionMap[key];

    if (typeof value !== 'undefined') {
      this._key = key; // retain key so that NONE is readable
      this._value = value;
    } else if (key.substring(0,8) === 'stinger:') {
      if (typeof setValue !== 'undefined' && setValue !== null ) {
        this._key = setValue;
      } else {
        var fileName = key.split(',')[0].split('\\').pop().split('/').pop();
        var m = fileName.lastIndexOf('.webm');
        if (m >= 0 && m + fileName.length >= fileName.length) {
            fileName = fileName.substring(0, m);
        }
        var n = fileName.lastIndexOf('_');
        if (n >= 0 && n + fileName.length >= fileName.length) {
          fileName = fileName.substring(0, n) + ': ' +
            fileName.substring(n+1) + 'ms';
        }
        this._key = fileName;
      }
      this._value = key;
    } else {
      this._key = key; // retain key so that NONE is readable
      this._value = key.toLowerCase();
    }
  }

  /**
   * Converts this transition object to the underlying string representation to be read by XSplit Broadcaster.
   */
  toString(): string {
    return this._value;
  }

  /**
   * Converts this transition object to a easily identifiable string such as 'NONE'.
   */
  toTransitionKey(): string {
    return this._key;
  }

  /**
   * return: Promise<Transition[]>
   *
   * Get all available transitions for use in scene change
   *
   * ** MINIMUM XBC REQUIREMENT **
   * requires XBC v.2.7.1602.0502 and above
   *
   * #### Usage
   *
   * ```javascript
   * Transtition.getSceneTransitions().then(function(transitions) {
   *   for (var i = 0; i < transitions.length; i++) {
   *     transitions.toString(); // Returns the value of the transition
   *     transitions.toTransitionKey(); // Returns the key of the transition
   *   }
   * })
   * ```
   */
  static getSceneTransitions(): Promise<Transition[]> {
    return new Promise(resolve => {
      var transitions: Transition[] = [];
      var transitionString = iApp.getGlobalProperty('transitions');
      try {
        if (transitionString !== '') {
          var transitionArray = JSON.parse(transitionString);
          for (var i = transitionArray.length - 1; i >= 0; i--) {
            var transitionObject = transitionArray[i];
            if (transitionObject.hasOwnProperty('Id') &&
              transitionObject.hasOwnProperty('Name')) {
                transitions.push(new Transition(transitionObject['Id'], transitionObject['Name']))
            }
          }
          resolve(transitions);
        } else {
          resolve(transitions);
        }
      } catch(e) {
        throw new Error('Error retrieving available transitions');
      }
    });
  }
}
