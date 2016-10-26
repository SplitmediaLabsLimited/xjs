/// <reference path="../../../defs/es6-promise.d.ts" />

import {applyMixins} from '../../internal/util/mixin';
import {Item as iItem} from '../../internal/item';
import {App as iApp} from '../../internal/app';
import {ItemLayout, IItemLayout} from './ilayout';
import {ItemColor, IItemColor} from './icolor';
import {ItemChroma, IItemChroma, KeyingType, ChromaPrimaryColors,
  ChromaAntiAliasLevel} from './ichroma';
import {ItemEffect, IItemEffect, MaskEffect} from './ieffects';
import {ItemTransition, IItemTransition} from './itransition';
import {IItemAudio, ItemAudio} from './iaudio';
import {Item} from './item';
import {Scene} from '../scene';
import {Transition} from '../transition';
import {Rectangle} from '../../util/rectangle';
import {Color} from '../../util/color';
import {CameraSource} from '../source/camera';
import {MicrophoneDevice as MicrophoneDevice} from '../../system/microphone';
import {System} from '../../system/system';

/**
 * The CameraItem Class provides methods specifically used for camera items and
 * also methods that are shared between Item Classes. The
 * {@link #core/Scene Scene} class' getItems method would automatically return a
 * CameraItem object if there's a camera item on the specified scene.
 *
 * Inherits from: {@link #core/Item Core/Item}
 *
 * Implements: {@link #core/IItemChroma Core/IItemChroma},
 * {@link #core/IItemColor Core/IItemColor},
 * {@link #core/IItemLayout Core/IItemLayout},
 * {@link #core/IItemTransition Core/IItemTransition},
 * {@link #core/IItemAudio Core/IItemAudio},
 * {@link #core/IItemEffect Core/IItemEffect}
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 *
 * XJS.Scene.getActiveScene().then(function(scene) {
 *   scene.getItems().then(function(items) {
 *     for (var i in items) {
 *       if (items[i] instanceof XJS.CameraItem) {
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
 *  All methods marked as *Chainable* resolve with the original `CameraItem`
 *  instance.
 */
export class CameraItem extends CameraSource implements IItemLayout, IItemColor,
  IItemChroma, IItemTransition, IItemAudio, IItemEffect {
  protected _delayExclusionObject = {
    roxio: "vid_1b80&pid_e0(01|11|12)",
    hauppauge1: "vid_2040&pid_49(0[0-3]|8[0-3])",
    hauppauge2: "vid_2040&pid_e50[012a4]"
  };

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
      }).then(val => {
        audioDelay = Number(val);
        resolve((audioDelay - streamDelay) / 10000);
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
  setAudioOffset(value: number): Promise<CameraItem> {
    return new Promise((resolve, reject) => {
      var itemAudio, delay;
      iItem.get('prop:itemaudio', this._id).then(val => {
        itemAudio = val;
        return this.isAudioAvailable();
      }).then(val => {
        if (val === false && itemAudio === '') {
          reject(new Error('Device has no audio'));
        } else {
          return this.getDelay();
        }
      }).then(val => {
        delay = val;
        if (value >= 0) {
          return iItem.set('prop:StreamDelay', String(delay * 10000), this._id);
        } else {
          return iItem.set('prop:StreamDelay',
            String((delay + (value * -1)) * 10000), this._id);
        }
      }).then(val => {
        if (value >= 0) {
          return iItem.set('prop:AudioDelay',
            String((delay + value) * 10000), this._id);
        } else {
          return iItem.set('prop:AudioDelay', String(delay * 10000), this._id);
        }
      }).then(val => {
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
      }).then(val => {
        var micDevice;
        if (val !== undefined) {
          for (var i = 0; i < val.length; ++i) {
            if (val[i].getDisplayId() === itemAudioId) {
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
  setAudioInput(value: MicrophoneDevice): Promise<CameraItem> {
    return new Promise((resolve, reject) => {
      iItem.set('prop:itemaudio', value.getDisplayId(), this._id)
        .then(val => {
          resolve(this);
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
   *
   * *Chainable.*
   */
  setStreamPaused(value: boolean): Promise<CameraSource> {
    return new Promise((resolve, reject) => {
      iItem.set('prop:StreamPause', value ? '1' : '0',
        this._id).then(() => {
          return iItem.get('prop:StreamPause', this._id);
        }).then(val => {
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
    return new Promise((resolve, reject) => {
      iItem.get('prop:hwencoder', this._id).then(val => {
        if (val === '1') {
          resolve(true);
        } else {
          this.isActive().then(isActive => {
            if (isActive) {
              resolve(false);
            } else {
              reject(new Error
                ('Cannot check hardware encoding. Device not present'));
            }
          })
        }
      });
    });
  }

  /**
   * return: Promise<boolean>
   *
   * Checks if camera device is active and present.
   *
   */
  isActive(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:activestate', this._id).then(val => {
        resolve(val === 'active');
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
      }).then(val => {
        audioDelay = Number(val);

        if (streamDelay < audioDelay) {
          resolve(streamDelay / 10000);
        } else {
          resolve(audioDelay / 10000);
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
      }).then(val => {
        for (var key in this._delayExclusionObject) {
          var regex = new RegExp(
            this._delayExclusionObject[key].toLowerCase(), 'g');
          if (typeof val === 'string' && val.toLowerCase().match(regex) != null) {
            reject(new Error('Cannot set delay to specific device'));
            break;
          }
        }
        return this.getAudioOffset();
      }).then(val => {
        audioOffset = val;
        if (audioOffset >= 0) {
          isPositive = true;
          return iItem.set('prop:StreamDelay', String(value * 10000), this._id);
        } else {
          isPositive = false;
          return iItem.set('prop:StreamDelay',
            String((value + (audioOffset * -1)) * 10000), this._id);
        }
      }).then(val => {
        if (isPositive) {
          return iItem.set('prop:AudioDelay',
            String((value + audioOffset) * 10000), this._id);
        } else {
          return iItem.set('prop:AudioDelay', String(value * 10000), this._id);
        }
      }).then(val => {
        resolve(this);
      });
    });
  }

  /**
   * return: Promise<boolean>
   *
   * Checks whether deinterlacing is enforced
   */
  isForceDeinterlace(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:fdeinterlace', this._id).then(val => {
        resolve(val === '3');
      });
    });
  }

  /**
   * param: (value: boolean)
   *
   * Enables or disables forcing of deinterlacing
   *
   * *Chainable.*
   */
  setForceDeinterlace(value: boolean): Promise<CameraSource> {
    return new Promise(resolve => {
      iItem.set('prop:fdeinterlace', (value ? '3' : '0'), this._id).then(() => {
        resolve(this);
      });
    })
  }

  // ItemLayout

  /**
   * See: {@link #core/IItemLayout#isKeepAspectRatio isKeepAspectRatio}
   */
  isKeepAspectRatio: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemLayout#isPositionLocked isPositionLocked}
   */
  isPositionLocked: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemLayout#isEnhancedResizeEnabled isEnhancedResizeEnabled}
   */
  isEnhancedResizeEnabled: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemLayout#getCanvasRotate getCanvasRotate}
   */
  getCanvasRotate: () => Promise<number>;

  /**
   * See: {@link #core/IItemLayout#getCropping getCropping}
   */
  getCropping: () => Promise<Object>;

  /**
   * See: {@link #core/IItemLayout#getEnhancedRotate getEnhancedRotate}
   */
  getEnhancedRotate: () => Promise<number>;

  /**
   * See: {@link #core/IItemLayout#getPosition getPosition}
   */
  getPosition: () => Promise<Rectangle>;

  /**
   * See: {@link #core/IItemLayout#getRotateY getRotateY}
   */
  getRotateY: () => Promise<number>;

  /**
   * See: {@link #core/IItemLayout#getRotateX getRotateX}
   */
  getRotateX: () => Promise<number>;

  /**
   * See: {@link #core/IItemLayout#getRotateZ getRotateZ}
   */
  getRotateZ: () => Promise<number>;

  /**
   * See: {@link #core/IItemLayout#setCanvasRotate setCanvasRotate}
   */
  setCanvasRotate: (value: number) => Promise<CameraItem>;

  /**
   * See: {@link #core/IItemLayout#setCropping setCropping}
   */
  setCropping: (value: Object) => Promise<CameraItem>;

  /**
   * See: {@link #core/IItemLayout#setCroppingEnhanced setCroppingEnhanced}
   */
  setCroppingEnhanced: (value: Object) => Promise<CameraItem>;

  /**
   * See: {@link #core/IItemLayout#setEnhancedRotate setEnhancedRotate}
   */
  setEnhancedRotate: (value: number) => Promise<CameraItem>;

  /**
   * See: {@link #core/IItemLayout#setKeepAspectRatio setKeepAspectRatio}
   */
  setKeepAspectRatio: (value: boolean) => Promise<CameraItem>;

  /**
   * See: {@link #core/IItemLayout#setPositionLocked setPositionLocked}
   */
  setPositionLocked: (value: boolean) => Promise<CameraItem>;

  /**
   * See: {@link #core/IItemLayout#setEnhancedResizeEnabled setEnhancedResizeEnabled}
   */
  setEnhancedResizeEnabled: (value: boolean) => Promise<CameraItem>;

  /**
   * See: {@link #core/IItemLayout#setPosition setPosition}
   */
  setPosition: (value: Rectangle) => Promise<CameraItem>;

  /**
   * See: {@link #core/IItemLayout#setRotateY setRotateY}
   */
  setRotateY: (value: number) => Promise<CameraItem>;

  /**
   * See: {@link #core/IItemLayout#setRotateX setRotateX}
   */
  setRotateX: (value: number) => Promise<CameraItem>;

  /**
   * See: {@link #core/IItemLayout#setRotateZ setRotateZ}
   */
  setRotateZ: (value: number) => Promise<CameraItem>;

  // ItemColor

  /**
   * See: {@link #core/IItemColor#getTransparency getTransparency}
   */
  getTransparency: () => Promise<number>;

  /**
   * See: {@link #core/IItemColor#getBrightness getBrightness}
   */
  getBrightness: () => Promise<number>;

  /**
   * See: {@link #core/IItemColor#getContrast getContrast}
   */
  getContrast: () => Promise<number>;

  /**
   * See: {@link #core/IItemColor#getHue getHue}
   */
  getHue: () => Promise<number>;

  /**
   * See: {@link #core/IItemColor#getSaturation getSaturation}
   */
  getSaturation: () => Promise<number>;

  /**
   * See: {@link #core/IItemColor#getBorderColor getBorderColor}
   */
  getBorderColor: () => Promise<Color>;

  /**
   * See: {@link #core/IItemColor#isFullDynamicColorRange isFullDynamicColorRange}
   */
  isFullDynamicColorRange: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemColor#setTransparency setTransparency}
   */
  setTransparency: (value: number) => Promise<CameraItem>;

  /**
   * See: {@link #core/IItemColor#setBrightness setBrightness}
   */
  setBrightness: (value: number) => Promise<CameraItem>;

  /**
   * See: {@link #core/IItemColor#setContrast setContrast}
   */
  setContrast: (value: number) => Promise<CameraItem>;

  /**
   * See: {@link #core/IItemColor#setHue setHue}
   */
  setHue: (value: number) => Promise<CameraItem>;

  /**
   * See: {@link #core/IItemColor#setSaturation setSaturation}
   */
  setSaturation: (value: number) => Promise<CameraItem>;

  /**
   * See: {@link #core/IItemColor#setBorderColor setBorderColor}
   */
  setBorderColor: (value: Color) => Promise<CameraItem>;

  /**
   * See: {@link #core/IItemColor#setFullDynamicColorRange setFullDynamicColorRange}
   */
  setFullDynamicColorRange: (value: boolean) => Promise<CameraItem>;

  // special color options pinning

  /**
   * param: (value: boolean)
   *
   * Set this to true to share color settings across all instances of this
   * camera device on the stage.
   *
   * *Chainable.*
   */
  setColorOptionsPinned(value: boolean): Promise<CameraItem> {
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
   * See: {@link #core/IItemChroma#isChromaEnabled isChromaEnabled}
   */
  isChromaEnabled: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemChroma#setChromaEnabled setChromaEnabled}
   */
  setChromaEnabled: (value: boolean) => Promise<CameraItem>;

  /**
   * See: {@link #core/IItemChroma#getKeyingType getKeyingType}
   */
  getKeyingType: () => Promise<KeyingType>;

  /**
   * See: {@link #core/IItemChroma#setKeyingType setKeyingType}
   */
  setKeyingType: (value: KeyingType) => Promise<CameraItem>;

  // BOTH CHROMA LEGACY AND CHROMA RGB

  /**
   * See: {@link #core/IItemChroma#getChromaAntiAliasLevel getChromaAntiAliasLevel}
   */
  getChromaAntiAliasLevel: () => Promise<ChromaAntiAliasLevel>;

  /**
   * See: {@link #core/IItemChroma#setChromaAntiAliasLevel setChromaAntiAliasLevel}
   */
  setChromaAntiAliasLevel: (value: ChromaAntiAliasLevel) => Promise<CameraItem>;

  // CHROMA LEGACY MODE

  /**
   * See: {@link #core/IItemChroma#getChromaLegacyBrightness getChromaLegacyBrightness}
   */
  getChromaLegacyBrightness: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaLegacyBrightness setChromaLegacyBrightness}
   */
  setChromaLegacyBrightness: (value: number) => Promise<CameraItem>;

  /**
   * See: {@link #core/IItemChroma#getChromaLegacySaturation getChromaLegacySaturation}
   */
  getChromaLegacySaturation: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaLegacySaturation setChromaLegacySaturation}
   */
  setChromaLegacySaturation: (value: number) => Promise<CameraItem>;

  /**
   * See: {@link #core/IItemChroma#getChromaLegacyHue getChromaLegacyHue}
   */
  getChromaLegacyHue: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaLegacyHue setChromaLegacyHue}
   */
  setChromaLegacyHue: (value: number) => Promise<CameraItem>;

  /**
   * See: {@link #core/IItemChroma#getChromaLegacyThreshold getChromaLegacyThreshold}
   */
  getChromaLegacyThreshold: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaLegacyThreshold setChromaLegacyThreshold}
   */
  setChromaLegacyThreshold: (value: number) => Promise<CameraItem>;

  /**
   * See: {@link #core/IItemChroma#getChromaLegacyAlphaSmoothing getChromaLegacyAlphaSmoothing}
   */
  getChromaLegacyAlphaSmoothing: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaLegacyAlphaSmoothing setChromaLegacyAlphaSmoothing}
   */
  setChromaLegacyAlphaSmoothing: (value: number) => Promise<CameraItem>;

  // CHROMA KEY RGB MODE

  /**
   * See: {@link #core/IItemChroma#getChromaRGBKeyPrimaryColor getChromaRGBKeyPrimaryColor}
   */
  getChromaRGBKeyPrimaryColor: () => Promise<ChromaPrimaryColors>;

  /**
   * See: {@link #core/IItemChroma#setChromaRGBKeyPrimaryColor setChromaRGBKeyPrimaryColor}
   */
  setChromaRGBKeyPrimaryColor: (value: ChromaPrimaryColors) => Promise<CameraItem>;

  /**
   * See: {@link #core/IItemChroma#getChromaRGBKeyThreshold getChromaRGBKeyThreshold}
   */
  getChromaRGBKeyThreshold: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaRGBKeyThreshold setChromaRGBKeyThreshold}
   */
  setChromaRGBKeyThreshold: (value: number) => Promise<CameraItem>;

  /**
   * See: {@link #core/IItemChroma#getChromaRGBKeyExposure getChromaRGBKeyExposure}
   */
  getChromaRGBKeyExposure: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaRGBKeyExposure setChromaRGBKeyExposure}
   */
  setChromaRGBKeyExposure: (value: number) => Promise<CameraItem>;

  // COLOR KEY MODE

  /**
   * See: {@link #core/IItemChroma#getChromaColorKeyThreshold getChromaColorKeyThreshold}
   */
  getChromaColorKeyThreshold: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaColorKeyThreshold setChromaColorKeyThreshold}
   */
  setChromaColorKeyThreshold: (value: number) => Promise<CameraItem>;

  /**
   * See: {@link #core/IItemChroma#getChromaColorKeyExposure getChromaColorKeyExposure}
   */
  getChromaColorKeyExposure: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaColorKeyExposure setChromaColorKeyExposure}
   */
  setChromaColorKeyExposure: (value: number) => Promise<CameraItem>;

  /**
   * See: {@link #core/IItemChroma#getChromaColorKeyColor getChromaColorKeyColor}
   */
  getChromaColorKeyColor: () => Promise<Color>;

  /**
   * See: {@link #core/IItemChroma#setChromaColorKeyColor setChromaColorKeyColor}
   */
  setChromaColorKeyColor: (value: Color) => Promise<CameraItem>;

  // special chroma options pinning

  /**
   * param: (value: boolean)
   *
   * Set this to true to share chroma keying settings across all instances of
   * this camera device on the stage.
   *
   * *Chainable.*
   */
  setKeyingOptionsPinned(value: boolean): Promise<CameraItem> {
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
   * See: {@link #core/IItemTransition#isVisible isVisible}
   */
  isVisible: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemTransition#setVisible setVisible}
   */
  setVisible: (value: boolean) => Promise<CameraItem>;

  /**
   * See: {@link #core/IItemTransition#getTransition getTransition}
   */
  getTransition: () => Promise<Transition>;

  /**
   * See: {@link #core/IItemTransition#setTransition setTransition}
   */
  setTransition: (value: Transition) => Promise<CameraItem>;

  /**
   * See: {@link #core/IItemTransition#getTransitionTime getTransitionTime}
   */
  getTransitionTime: () => Promise<number>;

  /**
   * See: {@link #core/IItemTransition#setTransitionTime setTransitionTime}
   */
  setTransitionTime: (value: number) => Promise<CameraItem>;

  // ItemAudio

  /** See: {@link #core/IItemAudio#getVolume getVolume} */
  getVolume: () => Promise<number>;

  /** See: {@link #core/IItemAudio#isMute isMute} */
  isMute: () => Promise<boolean>;

  /** See: {@link #core/IItemAudio#setVolume setVolume} */
  setVolume: (value: number) => Promise<CameraItem>;

  /** See: {@link #core/IItemAudio#setMute setMute} */
  setMute: (value: boolean) => Promise<CameraItem>;

  /** See: {@link #core/IItemAudio#isStreamOnlyAudio isStreamOnlyAudio} */
  isStreamOnlyAudio: () => Promise<boolean>;

  /** See: {@link #core/IItemAudio#setStreamOnlyAudio setStreamOnlyAudio} */
  setStreamOnlyAudio: (value: boolean) => Promise<CameraItem>;

  /** See: {@link #core/IItemAudio#isAudioAvailable isAudioAvailable} */
  isAudioAvailable: () => Promise<boolean>;

  // ItemEffect

  /** See: {@link #core/IItemEffect#getMaskEffect getMaskEffect} */
  getMaskEffect: () => Promise<MaskEffect>;

  /** See: {@link #core/IItemEffect#setMaskEffect setMaskEffect} */
  setMaskEffect: (value: MaskEffect) => Promise<CameraItem>;

  /** See: {@link #core/IItemEffect#getBorderEffectRadius getBorderEffectRadius} */
  getBorderEffectRadius: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setBorderEffectRadius setBorderEffectRadius} */
  setBorderEffectRadius: (value: number) => Promise<CameraItem>;

  /** See: {@link #core/IItemEffect#getBorderEffectThickness getBorderEffectThickness} */
  getBorderEffectThickness: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setBorderEffectThickness setBorderEffectThickness} */
  setBorderEffectThickness: (value: number) => Promise<CameraItem>;

  /** See: {@link #core/IItemEffect#getBorderEffectOpacity getBorderEffectOpacity} */
  getBorderEffectOpacity: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setBorderEffectOpacity setBorderEffectOpacity} */
  setBorderEffectOpacity: (value: number) => Promise<CameraItem>;

  /** See: {@link #core/IItemEffect#getBorderEffectColor getBorderEffectColor} */
  getBorderEffectColor: () => Promise<Color>;

  /** See: {@link #core/IItemEffect#setBorderEffectColor setBorderEffectColor} */
  setBorderEffectColor: (value: Color) => Promise<CameraItem>;

  /** See: {@link #core/IItemEffect#getShadowEffectColor getShadowEffectColor} */
  getShadowEffectColor: () => Promise<Color>;

  /** See: {@link #core/IItemEffect#setShadowEffectColor setShadowEffectColor} */
  setShadowEffectColor: (value: Color) => Promise<CameraItem>;

  /** See: {@link #core/IItemEffect#getShadowEffectThickness getShadowEffectThickness} */
  getShadowEffectThickness: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setShadowEffectThickness setShadowEffectThickness} */
  setShadowEffectThickness: (value: number) => Promise<CameraItem>;

  /** See: {@link #core/IItemEffect#getShadowEffectBlur getShadowEffectBlur} */
  getShadowEffectBlur: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setShadowEffectBlur setShadowEffectBlur} */
  setShadowEffectBlur: (value: number) => Promise<CameraItem>;

  /** See: {@link #core/IItemEffect#getShadowEffectOpacity getShadowEffectOpacity} */
  getShadowEffectOpacity: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setShadowEffectOpacity setShadowEffectOpacity} */
  setShadowEffectOpacity: (value: number) => Promise<CameraItem>;

  /** See: {@link #core/IItemEffect#getShadowEffectOffsetX getShadowEffectOffsetX} */
  getShadowEffectOffsetX: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setShadowEffectOffsetX setShadowEffectOffsetX} */
  setShadowEffectOffsetX: (value: number) => Promise<CameraItem>;

  /** See: {@link #core/IItemEffect#getShadowEffectOffsetY getShadowEffectOffsetY} */
  getShadowEffectOffsetY: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setShadowEffectOffsetY setShadowEffectOffsetY} */
  setShadowEffectOffsetY: (value: number) => Promise<CameraItem>;

  /** See: {@link #core/IItemEffect#getFileMask getFileMask} */
  getFileMask: () => Promise<string>;

  /** See: {@link #core/IItemEffect#setFileMask setFileMask} */
  setFileMask: (value: string) => Promise<CameraItem>;

  /** See: {@link #core/IItemEffect#isFileMaskingGuideVisible isFileMaskingGuideVisible} */
  isFileMaskingGuideVisible: () => Promise<boolean>;

  /** See: {@link #core/IItemEffect#showFileMaskingGuide showFileMaskingGuide} */
  showFileMaskingGuide: (value: boolean) => Promise<CameraItem>;
}

applyMixins(CameraItem, [Item, ItemLayout, ItemColor, ItemChroma, ItemTransition,
  ItemAudio, ItemEffect]);
