/// <reference path="../../../defs/es6-promise.d.ts" />

import {applyMixins} from '../../internal/util/mixin';
import {Item as iItem} from '../../internal/item';
import {App as iApp} from '../../internal/app';
import {ItemLayout, IItemLayout} from './ilayout';
import {ItemColor, IItemColor} from './icolor';
import {ItemChroma, IItemChroma, KeyingType, ChromaPrimaryColors,
  ChromaAntiAliasLevel} from './ichroma';
import {ItemTransition, IItemTransition} from './itransition';
import {IItemAudio, ItemAudio} from './iaudio';
import {Source} from './source';
import {Scene} from '../scene';
import {Transition} from '../transition';
import {Rectangle} from '../../util/rectangle';
import {Color} from '../../util/color';
import {MicrophoneDevice as MicrophoneDevice} from '../../system/microphone';
import {System} from '../../system/system';

/**
 * The CameraSource Class provides methods specifically used for camera items and
 * also methods that are shared between Item Classes. The
 * {@link #core/Scene Scene} class' getItems method would automatically return a
 * CameraSource object if there's a camera item on the specified scene.
 *
 * Inherits from: {@link #core/Source Core/Source}
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 *
 * XJS.Scene.getActiveScene().then(function(scene) {
 *   scene.getItems().then(function(items) {
 *     for (var i in items) {
 *       if (items[i] instanceof XJS.CameraSource) {
 *         // Manipulate your camera item here
 *         items[i].getDeviceId().then(function(id) {
 *           // Do something with the id
 *         });
 *       }
 *     }
 *   });
 * });
 * ```
 *
 *  All methods marked as *Chainable* resolve with the original `CameraSource`
 *  instance.
 */
export class CameraSource extends Source implements IItemLayout, IItemColor,
  IItemChroma, IItemTransition, IItemAudio {
    private _delayExclusionObject = {
      roxio : "vid_1b80&pid_e0(01|11|12)",
      hauppauge1 : "vid_2040&pid_49(0[0-3]|8[0-3])",
      hauppauge2 : "vid_2040&pid_e50[012a4]"
    };

  /**
   * return: Promise<string>
   *
   * Gets the device ID of the underlying camera device.
   */
  getDeviceId(): Promise<string> {
    return new Promise(resolve => {
      iItem.get('prop:item', this._id).then(val => {
        resolve(val);
      });
    });
  }

  /**
   * return: Promise<boolean>
   *
   * Checks if camera feed is paused
   */
  isStreamPaused(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:StreamPause', this._id).then(val => {
        resolve(val === '1');
      });
    });
  }

  /**
   * param: (value: boolean)
   *
   * Sets whether camera feed is paused or not
   */
  setStreamPaused(value: boolean): Promise<CameraSource> {
    return new Promise((resolve, reject) => {
      iItem.set('prop:StreamPause', value ? '1' : '0',
        this._id).then(() => {
          return iItem.get('prop:StreamPause', this._id);
        })
        .then(val => {
          if (value === (val === ('1'))) {
            resolve(this);
          } else {
            reject(new Error('Camera feed cannot be paused/resumed or is not present'));
          }
      });
    });
  }

  /**
   * return: Promise<boolean>
   *
   * Checks if camera device is a hardware encoder or not. This check may fail
   * if camera device is reinitializing or not present (value defaults to false)
   *
   */
  isHardwareEncoder(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:hwencoder', this._id).then(val => {
        resolve(val === '1');
      });
    });
  }

  /**
   * return: Promise<number>
   *
   * Gets feed capture delay in milliseconds
   */
  getDelay(): Promise<number> {
    return new Promise(resolve => {
      var streamDelay, audioDelay;
      iItem.get('prop:StreamDelay', this._id).then(val => {
        streamDelay = Number(val);
        return iItem.get('prop:AudioDelay', this._id);
      })
      .then(val => {
        audioDelay = Number(val);

        if (streamDelay < audioDelay) {
          resolve(streamDelay/10000);
        } else {
          resolve(audioDelay/10000);
        }
      });
    });
  }

  /**
   * param: (value: number)
   *
   * Sets feed capture delay in milliseconds, accepts only positive delay
   *
   * *Chainable.*
   */
  setDelay(value: number): Promise<CameraSource> {
    return new Promise((resolve, reject) => {
      var isPositive, audioOffset;
      this.isHardwareEncoder().then(val => {
        if (val === true) {
          reject(new Error('Cannot set delay to hardware encoder devices'));
        } else {
          return this.getValue();
        }
      })
      .then(val => {
        for (var key in this._delayExclusionObject)
        {
          var regex = new RegExp(
            this._delayExclusionObject[key].toLowerCase(), 'g' );
          if(typeof val === 'string' && val.toLowerCase().match(regex) != null)
          {
            reject(new Error('Cannot set delay to specific device'));
            break;
          }
        }
        return this.getAudioOffset();
      })
      .then(val => {
        audioOffset = val;
        if (audioOffset >= 0) {
          isPositive = true;
          return iItem.set('prop:StreamDelay', String(value * 10000), this._id);
        } else {
          isPositive = false;
          return iItem.set('prop:StreamDelay',
            String((value + (audioOffset * -1)) * 10000), this._id);
        }
      })
      .then(val => {
        if (isPositive) {
          return iItem.set('prop:AudioDelay',
            String((value + audioOffset) * 10000), this._id);
        } else {
          return iItem.set('prop:AudioDelay', String(value * 10000), this._id);
        }
      }). then(val => {
        resolve(this);
      });
    });
  }

  /**
   * return: Promise<number>
   *
   * Gets audio delay with respect to video feed in milliseconds
   */
  getAudioOffset(): Promise<number> {
    return new Promise(resolve => {
      var streamDelay, audioDelay;
      iItem.get('prop:StreamDelay', this._id).then(val => {
        streamDelay = Number(val);
        return iItem.get('prop:AudioDelay', this._id);
      })
      .then(val => {
        audioDelay = Number(val);
        resolve((audioDelay - streamDelay)/10000);
      });
    });
  }

  /**
   * param: (value: number)
   *
   * Sets audio delay with respect to video feed in milliseconds
   *
   * *Chainable.*
   */
  setAudioOffset(value: number): Promise<CameraSource> {
    return new Promise((resolve, reject) => {
      var itemAudio, delay;
      iItem.get('prop:itemaudio', this._id).then(val => {
        itemAudio = val;
        return this.isAudioAvailable();
      })
      .then(val => {
        if (val === false && itemAudio === '') {
          reject(new Error('Device has no audio'));
        } else {
          return this.getDelay();
        }
      })
      .then(val => {
        delay = val;
        if (value >= 0) {
          return iItem.set('prop:StreamDelay', String(delay * 10000), this._id);
        } else {
          return iItem.set('prop:StreamDelay',
            String((delay + (value * -1)) * 10000), this._id);
        }
      })
      .then(val => {
        if (value >= 0) {
          return iItem.set('prop:AudioDelay',
            String((delay + value) * 10000), this._id);
        } else {
          return iItem.set('prop:AudioDelay', String(delay * 10000), this._id);
        }
      }). then(val => {
        resolve(this);
      });
    });
  }

  /**
   * return: Promise<MicrophoneDevice>
   *
   * Gets the microphone device tied as an audio input,
   * rejected if no microphone device is used
   */
  getAudioInput(): Promise<MicrophoneDevice> {
    return new Promise((resolve, reject) => {
      var itemAudioId;
      iItem.get('prop:itemaudio', this._id).then(val => {
        if (val === '') {
          reject(new Error('No tied audio input'));
        } else {
          itemAudioId = val;
          return System.getMicrophones();
        }
      })
      .then(val => {
        var micDevice;
        if (val !== undefined) {
          for (var i = 0; i < val.length; ++i) {
            if (val[i].getDisplayID() === itemAudioId) {
              micDevice = val[i];
              break;
            }
          }
        }

        if (micDevice !== undefined) {
          resolve(micDevice);
        } else {
          reject(new Error('Tied audio input not present'));
        }
      });
    });
  }

  /**
   * param: (value: number)
   *
   * Sets the microphone device to be tied as an audio input
   *
   * *Chainable.*
   */
  setAudioInput(value: MicrophoneDevice): Promise<CameraSource> {
    return new Promise((resolve, reject) => {
      iItem.set('prop:itemaudio', value.getDisplayID(), this._id)
      .then(val => {
        resolve(this);
      });
    });
  }

  // ItemLayout

  /**
   * return: Promise<boolean>
   *
   * Check if Aspect Ratio is set to ON or OFF
   */
  isKeepAspectRatio:        () => Promise<boolean>;

  /**
   * return: Promise<boolean>
   *
   * Check if Position Locked is set to ON or OFF
   */
  isPositionLocked:         () => Promise<boolean>;

  /**
   * return: Promise<boolean>
   *
   * Check if Enhance Resize is Enabled or Disabled
   */
  isEnhancedResizeEnabled:   () => Promise<boolean>;

  /**
   * return: Promise<Rectangle>
   *
   * Get the position of the item
   *
   * See also: {@link #util/Rectangle Util/Rectangle}
   */
  getPosition:              () => Promise<Rectangle>;

  /**
   * return: Promise<number>
   *
   * Get Rotate Y value of the item
   */
  getRotateY:              () => Promise<number>;

  /**
   * return: Promise<number>
   *
   * Get Rotate X value of the item
   */
  getRotateX:              () => Promise<number>;

  /**
   * return: Promise<number>
   *
   * Get Rotate Z value of the item
   */
  getRotateZ:              () => Promise<number>;

  /**
   * param: (value: boolean)
   *
   * Set Aspect Ratio to ON or OFF
   *
   * *Chainable.*
   */
  setKeepAspectRatio:       (value: boolean) => Promise<CameraSource>;

  /**
   * param: (value: boolean)
   *
   * Set Position Lock to ON or OFF
   *
   * *Chainable.*
   */
  setPositionLocked:        (value: boolean) => Promise<CameraSource>;

  /**
   * param: (value: boolean)
   *
   * Set Enhance Resize to ON or OFF
   *
   * *Chainable.*
   */
  setEnhancedResizeEnabled:  (value: boolean) => Promise<CameraSource>;

  /**
   * param: (value: Rectangle)
   *
   * Set Item Position. Relative coordinates (0-1) are required.
   *
   * *Chainable.*
   *
   * #### Usage
   *
   * ```javascript
   * var rect = xjs.Rectangle.fromCoordinates(0, 0, 1, 1);
   * item.setPosition(rect).then(function(item) {
   *   // Promise resolves with same Item instance
   * });
   * ```
   *
   * See also: {@link #util/Rectangle Util/Rectangle}
   */
  setPosition:              (value: Rectangle) => Promise<CameraSource>;

  /**
   * param: (value: number)
   *
   * Set Rotate Y value of the item
   *
   * *Chainable.*
   */
  setRotateY:              (value: number) => Promise<CameraSource>;

  /**
   * param: (value: number)
   *
   * Set Rotate X value of the item
   *
   * *Chainable.*
   */
  setRotateX:              (value: number) => Promise<CameraSource>;

  /**
   * param: (value: number)
   *
   * Set Rotate Z value of the item
   *
   * *Chainable.*
   */
  setRotateZ:              (value: number) => Promise<CameraSource>;

  // ItemColor

  /**
   * return: Promise<number>
   *
   * Get Item Transparency value
   */
  getTransparency: () => Promise<number>;

  /**
   * return: Promise<number>
   *
   * Get Item Brightness value
   */
  getBrightness:   () => Promise<number>;

  /**
   * return: Promise<number>
   *
   * Get Item Contrast value
   */
  getContrast:     () => Promise<number>;

  /**
   * return: Promise<number>
   *
   * Get Item Hue value
   */
  getHue:          () => Promise<number>;

  /**
   * return: Promise<number>
   *
   * Get Item Saturation value
   */
  getSaturation:   () => Promise<number>;

  /**
   * return: Promise<Color>
   *
   * Get Border Color
   */
  getBorderColor:  () => Promise<Color>;

  /**
   * param: (value: number)
   *
   * Set Item Transparency
   *
   * *Chainable.*
   */
  setTransparency: (value: number) => Promise<CameraSource>;

  /**
   * param: (value: number)
   *
   * Set Item Brightness
   *
   * *Chainable.*
   */
  setBrightness:   (value: number) => Promise<CameraSource>;

  /**
   * param: (value: number)
   *
   * Set Item Contrast
   *
   * *Chainable.*
   */
  setContrast:     (value: number) => Promise<CameraSource>;

  /**
   * param: (value: number)
   *
   * Set Item Hue
   *
   * *Chainable.*
   */
  setHue:          (value: number) => Promise<CameraSource>;

  /**
   * param: (value: number)
   *
   * Set Item Saturation
   *
   * *Chainable.*
   */
  setSaturation:   (value: number) => Promise<CameraSource>;

  /**
   * param: (value: Color)
   *
   * Set Border Color
   *
   * *Chainable.*
   */
  setBorderColor:  (value: Color) => Promise<CameraSource>;

  // special color options pinning

  /**
   * param: (value: boolean)
   *
   * Set this to true to share color settings across all instances of this
   * camera device on the stage.
   *
   * *Chainable.*
   */
  setColorOptionsPinned(value: boolean): Promise<CameraSource> {
    return new Promise(resolve => {
      iItem.set('prop:cc_pin', value ? '1' : '0', this._id).then(() => {
        resolve(this);
      });
    });
  }

  /**
   * return: Promise<boolean>
   *
   * Checks whether color settings are shared across all instances of
   * this camera device on the stage.
   */
  getColorOptionsPinned(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:cc_pin', this._id).then(val => {
        resolve(val === '1' ? true : false);
      });
    });
  }

  // ItemChroma

  /**
   * return: Promise<boolean>
   *
   * Determines whether any type of chroma keying is enabled.
   */
  isChromaEnabled: () => Promise<boolean>;

  /**
   * param: (value: boolean)
   *
   * Enables or disables chroma keying. Use together with `getKeyingType()`.
   *
   * *Chainable.*
   */
  setChromaEnabled: (value: boolean) => Promise<CameraSource>;

  /**
   * return: Promise<KeyingType>
   *
   * Determines the chroma keying type being used.
   */
  getKeyingType: () => Promise<KeyingType>;

  /**
   * param: (value: KeyingType)
   *
   * Sets the chroma keying scheme to any one of three possible choices: Chroma RGB Key, Color Key, or Legacy Mode.
   *
   * *Chainable.*
   *
   * After setting the keying type, you may tweak settings specific to that type.
   * - RGB Key: methods prefixed with `getChromaRGBKey-\*` or `setChromaRGBKey-\*`
   * - Color Key: methods prefixed with `getChromaColorKey-\*` or `setChromaColorKey-\*`
   * - Chroma Legacy Mode: methods prefixed with `getChromaLegacy-\*` or `setChromaLegacy-\*`
   */
  setKeyingType: (value: KeyingType) => Promise<CameraSource>;

  /**
   * return: Promise<ChromaAntiAliasLevel>
   *
   * Gets the antialiasing level for chroma keying.
   */
  getChromaAntiAliasLevel: () => Promise<ChromaAntiAliasLevel>;

  /**
   * param: (value: ChromaAntiAliasLevel)
   *
   * Sets the antialiasing level for chroma keying.
   *
   * *Chainable.*
   */
  setChromaAntiAliasLevel: (value: ChromaAntiAliasLevel) => Promise<CameraSource>;

  // CHROMA LEGACY MODE

  /**
   * return: Promise<number>
   *
   * Gets the brightness setting (0-255). Only relevant when chroma keying is in Legacy mode.
   */
  getChromaLegacyBrightness: () => Promise<number>;

  /**
   * param: (value: number)
   *
   * Sets the brightness setting (0-255). Only relevant when chroma keying is in Legacy mode.
   *
   * *Chainable.*
   */
  setChromaLegacyBrightness: (value: number) => Promise<CameraSource>;

  /**
   * return: Promise<number>
   *
   * Gets the saturation setting (0-255).  Only relevant when chroma keying is in Legacy mode.
   */
  getChromaLegacySaturation: () => Promise<number>;

  /**
   * param: (value: number)
   *
   * Sets the saturation setting (0-255).  Only relevant when chroma keying is in Legacy mode.
   *
   * *Chainable.*
   */
  setChromaLegacySaturation: (value: number) => Promise<CameraSource>;

  /**
   * return: Promise<number>
   *
   * Gets the hue setting (0-180).  Only relevant when chroma keying is in Legacy mode.
   */
  getChromaLegacyHue: () => Promise<number>;

  /**
   * param: (value: number)
   *
   * Sets the hue setting (0-180).  Only relevant when chroma keying is in Legacy mode.
   *
   * *Chainable.*
   */
  setChromaLegacyHue: (value: number) => Promise<CameraSource>;

  /**
   * return: Promise<number>
   *
   * Gets the threshold setting (0-255). Only relevant when chroma keying is in Legacy mode.
   */
  getChromaLegacyThreshold: () => Promise<number>;

  /**
   * param: (value: number)
   *
   * Sets the threshold setting (0-255). Only relevant when chroma keying is in Legacy mode.
   *
   * *Chainable.*
   */
  setChromaLegacyThreshold: (value: number) => Promise<CameraSource>;

  /**
   * return: Promise<number>
   *
   * Gets the alpha smoothing setting (0-255). Only relevant when chroma keying is in Legacy mode.
   */
  getChromaLegacyAlphaSmoothing: () => Promise<number>;

  /**
   * param: (value: number)
   *
   * Sets the alpha smoothing setting (0-255). Only relevant when chroma keying is in Legacy mode.
   *
   * *Chainable.*
   */
  setChromaLegacyAlphaSmoothing: (value: number) => Promise<CameraSource>;

  // CHROMA KEY RGB MODE

  /**
   * return: Promise<ChromaPrimaryColors>
   *
   * Gets the primary color setting for chroma key. Only relevant when chroma keying is in RGB mode.
   */
  getChromaRGBKeyPrimaryColor: () => Promise<ChromaPrimaryColors>;

  /**
   * param: (value: ChromaPrimaryColors)
   *
   * Sets the primary color setting for chroma key. Only relevant when chroma keying is in RGB mode.
   *
   * *Chainable.*
   */
  setChromaRGBKeyPrimaryColor: (value: ChromaPrimaryColors) => Promise<CameraSource>;

  /**
   * return: Promise<number>
   *
   * Gets the threshold setting (0-255). Only relevant when chroma keying is in RGB mode.
   */
  getChromaRGBKeyThreshold: () => Promise<number>;

  /**
   * param: (value: number)
   *
   * Sets the threshold setting (0-255). Only relevant when chroma keying is in RGB mode.
   *
   * *Chainable.*
   */
  setChromaRGBKeyThreshold: (value: number) => Promise<CameraSource>;

  /**
   * return: Promise<number>
   *
   * Gets the exposure setting (0-255). Only relevant when chroma keying is in RGB mode.
   */
  getChromaRGBKeyExposure: () => Promise<number>;

  /**
   * param: (value: number)
   *
   * Sets the exposure setting (0-255). Only relevant when chroma keying is in RGB mode.
   *
   * *Chainable.*
   */
  setChromaRGBKeyExposure: (value: number) => Promise<CameraSource>;

  // COLOR KEY MODE

  /**
   * return: Promise<number>
   *
   * Gets the threshold setting (0-255). Only relevant when chroma keying is in color key mode.
   */
  getChromaColorKeyThreshold: () => Promise<number>;

  /**
   * param: (value: number)
   *
   * Sets the threshold setting (0-255). Only relevant when chroma keying is in color key mode.
   *
   * *Chainable.*
   */
  setChromaColorKeyThreshold: (value: number) => Promise<CameraSource>;

  /**
   * return: Promise<number>
   *
   * Gets the exposure setting (0-255). Only relevant when chroma keying is in color key mode.
   */
  getChromaColorKeyExposure: () => Promise<number>;

  /**
   * param: (value: number)
   *
   * Sets the exposure setting (0-255). Only relevant when chroma keying is in color key mode.
   *
   * *Chainable.*
   */
  setChromaColorKeyExposure: (value: number) => Promise<CameraSource>;

  /**
   * return: Promise<Color>
   *
   * Gets the color setting for keying in color key mode.
   */
  getChromaColorKeyColor: () => Promise<Color>;

  /**
   * param: (value: Color)
   *
   * Sets the color setting for keying in color key mode.
   *
   * *Chainable.*
   */
  setChromaColorKeyColor: (value: Color) => Promise<CameraSource>;

  // special chroma options pinning

  /**
   * param: (value: boolean)
   *
   * Set this to true to share chroma keying settings across all instances of
   * this camera device on the stage.
   *
   * *Chainable.*
   */
  setKeyingOptionsPinned(value: boolean): Promise<CameraSource> {
    return new Promise(resolve => {
      iItem.set('prop:key_pin', value ? '1' : '0', this._id).then(() => {
        resolve(this);
      });
    });

  }

  /**
   * return: Promise<boolean>
   *
   * Checks whether chroma keying settings are shared across all instances of
   * this camera device on the stage.
   */
  getKeyingOptionsPinned(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:key_pin', this._id).then(val => {
        resolve(val === '1' ? true : false);
      });
    });
  }

  // ItemTransition

  /**
   * return: Promise<boolean>
   *
   * Check if item is visible on stage
   */
  isVisible:         () => Promise<boolean>;

  /**
   * param: (value: boolean)
   *
   * Set item to visible or hidden
   *
   * *Chainable.*
   */
  setVisible:        (value: boolean) => Promise<CameraSource>;

  /**
   * return: Promise<boolean>
   *
   * Get item's transition type for when visibility is toggled
   */
  getTransition:     () => Promise<Transition>;

  /**
   * param: (value: Transition)
   *
   * Set item's transition type for when visibility is toggled
   *
   * *Chainable.*
   */
  setTransition:     (value: Transition) => Promise<CameraSource>;

  /**
   * return: Promise<number>
   *
   * Get item's transition time in milliseconds
   */
  getTransitionTime: () => Promise<number>;

  /**
   * param: (value: number)
   *
   * Set item's transition time in milliseconds
   *
   * *Chainable.*
   */
  setTransitionTime: (value: number) => Promise<CameraSource>;

 // ItemAudio

  /**
   * return: Promise<number>
   *
   * Get item's volume level expressed as an integer from 0 to 100
   */
  getVolume: () => Promise<number>;

  /**
   * return: Promise<boolean>
   *
   * Check if item's mute option is active
   */
  isMute:   () => Promise<boolean>;

  /**
   * param: value<number>
   *
   * Set volume level of item as an integer from 0 (muted) to 100 (maximum)
   *
   * *Chainable.*
   */
  setVolume: (value: number) => Promise<CameraSource>;

  /**
   * param: value<boolean>
   *
   * Set item's Mute property to ON or OFF
   *
   * *Chainable.*
   */
  setMute:  (value: boolean) => Promise<CameraSource>;

  /**
   * return: Promise<boolean>
   *
   * Checks if audio is also output to system sound
   */
  isStreamOnlyEnabled: () => Promise<boolean>;

  /**
   * param: value<boolean>
   *
   * Sets whether audio should also be output to system sound
   *
   * *Chainable.*
   */
  setStreamOnlyEnabled: (value: boolean) => Promise<CameraSource>;

  /**
   * return: Promise<boolean>
   *
   * Checks if audio is available
   */
  isAudioAvailable: () => Promise<boolean>;
}

applyMixins(CameraSource, [ItemLayout, ItemColor,ItemChroma, ItemTransition,
  ItemAudio]);
