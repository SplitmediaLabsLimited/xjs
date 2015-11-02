/// <reference path="../../../defs/es6-promise.d.ts" />

import {applyMixins} from '../../internal/util/mixin';
import {Item as iItem} from '../../internal/item';
import {App as iApp} from '../../internal/app';
import {ItemLayout, IItemLayout} from './ilayout';
import {ItemColor, IItemColor} from './icolor';
import {ItemChroma, IItemChroma, KeyingType, ChromaPrimaryColors,
  ChromaAntiAliasLevel} from './ichroma';
import {ItemTransition, IItemTransition} from './itransition';
import {Item} from './item';
import {Scene} from '../scene';
import {Transition} from '../transition';
import {Rectangle} from '../../util/rectangle';
import {Color} from '../../util/color';

/**
 * The CameraItem Class provides methods specifically used for camera items and
 * also methods that are shared between Item Classes. The
 * {@link #core/Scene Scene} class' getItems method would automatically return a
 * CameraItem object if there's a camera item on the specified scene.
 *
 * Inherits from: {@link #core/Item Core/Item}
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
export class CameraItem extends Item implements IItemLayout, IItemColor, IItemChroma, IItemTransition {
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
  setKeepAspectRatio:       (value: boolean) => Promise<CameraItem>;

  /**
   * param: (value: boolean)
   *
   * Set Position Lock to ON or OFF
   *
   * *Chainable.*
   */
  setPositionLocked:        (value: boolean) => Promise<CameraItem>;

  /**
   * param: (value: boolean)
   *
   * Set Enhance Resize to ON or OFF
   *
   * *Chainable.*
   */
  setEnhancedResizeEnabled:  (value: boolean) => Promise<CameraItem>;

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
  setPosition:              (value: Rectangle) => Promise<CameraItem>;

  /**
   * param: (value: number)
   *
   * Set Rotate Y value of the item
   *
   * *Chainable.*
   */
  setRotateY:              (value: number) => Promise<CameraItem>;

  /**
   * param: (value: number)
   *
   * Set Rotate X value of the item
   *
   * *Chainable.*
   */
  setRotateX:              (value: number) => Promise<CameraItem>;

  /**
   * param: (value: number)
   *
   * Set Rotate Z value of the item
   *
   * *Chainable.*
   */
  setRotateZ:              (value: number) => Promise<CameraItem>;

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
  setTransparency: (value: number) => Promise<CameraItem>;

  /**
   * param: (value: number)
   *
   * Set Item Brightness
   *
   * *Chainable.*
   */
  setBrightness:   (value: number) => Promise<CameraItem>;

  /**
   * param: (value: number)
   *
   * Set Item Contrast
   *
   * *Chainable.*
   */
  setContrast:     (value: number) => Promise<CameraItem>;

  /**
   * param: (value: number)
   *
   * Set Item Hue
   *
   * *Chainable.*
   */
  setHue:          (value: number) => Promise<CameraItem>;

  /**
   * param: (value: number)
   *
   * Set Item Saturation
   *
   * *Chainable.*
   */
  setSaturation:   (value: number) => Promise<CameraItem>;

  /**
   * param: (value: Color)
   *
   * Set Border Color
   *
   * *Chainable.*
   */
  setBorderColor:  (value: Color) => Promise<CameraItem>;

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
  setChromaEnabled: (value: boolean) => Promise<CameraItem>;

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
  setKeyingType: (value: KeyingType) => Promise<CameraItem>;

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
  setChromaAntiAliasLevel: (value: ChromaAntiAliasLevel) => Promise<CameraItem>;

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
  setChromaLegacyBrightness: (value: number) => Promise<CameraItem>;

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
  setChromaLegacySaturation: (value: number) => Promise<CameraItem>;

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
  setChromaLegacyHue: (value: number) => Promise<CameraItem>;

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
  setChromaLegacyThreshold: (value: number) => Promise<CameraItem>;

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
  setChromaLegacyAlphaSmoothing: (value: number) => Promise<CameraItem>;

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
  setChromaRGBKeyPrimaryColor: (value: ChromaPrimaryColors) => Promise<CameraItem>;

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
  setChromaRGBKeyThreshold: (value: number) => Promise<CameraItem>;

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
  setChromaRGBKeyExposure: (value: number) => Promise<CameraItem>;

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
  setChromaColorKeyThreshold: (value: number) => Promise<CameraItem>;

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
  setChromaColorKeyExposure: (value: number) => Promise<CameraItem>;

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
  setVisible:        (value: boolean) => Promise<CameraItem>;

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
  setTransition:     (value: Transition) => Promise<CameraItem>;

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
  setTransitionTime: (value: number) => Promise<CameraItem>;
}

applyMixins(CameraItem, [ItemLayout, ItemColor, ItemChroma, ItemTransition]);
