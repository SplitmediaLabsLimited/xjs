/// <reference path="../../../defs/es6-promise.d.ts" />

import {applyMixins} from '../../internal/util/mixin';
import {Item as iItem} from '../../internal/item';
import {App as iApp} from '../../internal/app';
import {ItemLayout, IItemLayout} from './ilayout';
import {ItemColor, IItemColor} from './icolor';
import {ItemChroma, IItemChroma, KeyingType, ChromaPrimaryColors,
  ChromaAntiAliasLevel} from './ichroma';
import {ItemTransition, IItemTransition} from './itransition';
import {ItemConfigurable, IItemConfigurable} from './iconfig';
import {Item} from './item';
import {Scene} from '../scene';
import {Transition} from '../transition';
import {Rectangle} from '../../util/rectangle';
import {Color} from '../../util/color';

/**
 * The HTMLItem class represents a web page source. This covers both source
 * plugins and non-plugin URLs.
 *
 * Inherits from: {@link #core/Item Core/Item}
 */
export class HTMLItem extends Item implements IItemLayout, IItemColor, IItemChroma, IItemTransition, IItemConfigurable {

  /**
   * return: Promise<string>
   *
   * Gets the URL of this webpage source.
   */
  getURL(): Promise<string> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);

      iItem.get('prop:item', slot).then(url => {
        resolve(url);
      });
    });
  }

  /**
   * param: value<string>
   *
   * Sets the URL of this webpage source.
   */
  setURL(value: string): Promise<HTMLItem> {
    return new Promise((resolve, reject) => {
      let slot = iItem.attach(this._id);

      iItem.set('prop:item', value, slot).then(code => {
        if (code) {
          resolve(this);
        } else {
          reject('Invalid value');
        }
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
   * param: value<boolean>
   *
   * Set Aspect Ratio to ON or OFF
   */
  setKeepAspectRatio:       (value: boolean) => Promise<HTMLItem>;

  /**
   * param: value<boolean>
   *
   * Set Position Lock to ON or OFF
   */
  setPositionLocked:        (value: boolean) => Promise<HTMLItem>;

  /**
   * param: value<boolean>
   *
   * Set Enhance Resize to ON or OFF
   */
  setEnhancedResizeEnabled:  (value: boolean) => Promise<HTMLItem>;

  /**
   * param: value<Rectangle>
   *
   * Set Item position
   */
  setPosition:              (value: Rectangle) => Promise<HTMLItem>;

  /**
   * param: value<number>
   *
   * Set Rotate Y value of the item
   */
  setRotateY:              (value: number) => Promise<HTMLItem>;

  /**
   * param: value<number>
   *
   * Set Rotate X value of the item
   */
  setRotateX:              (value: number) => Promise<HTMLItem>;

  /**
   * param: value<number>
   *
   * Set Rotate Z value of the item
   */
  setRotateZ:              (value: number) => Promise<HTMLItem>;

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
   * param: value<number>
   *
   * Set Item Transparency
   */
  setTransparency: (value: number) => Promise<HTMLItem>;

  /**
   * param: value<number>
   *
   * Set Item Brightness
   */
  setBrightness:   (value: number) => Promise<HTMLItem>;

  /**
   * param: value<number>
   *
   * Set Item Contrast
   */
  setContrast:     (value: number) => Promise<HTMLItem>;

  /**
   * param: value<number>
   *
   * Set Item Hue
   */
  setHue:          (value: number) => Promise<HTMLItem>;

  /**
   * param: value<number>
   *
   * Set Item Saturation
   */
  setSaturation:   (value: number) => Promise<HTMLItem>;

  /**
   * param: value<Color>
   *
   * Set Border Color
   */
  setBorderColor:  (value: Color) => Promise<HTMLItem>;

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
   */
  setChromaEnabled: (value: boolean) => Promise<HTMLItem>;

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
   * After setting the keying type, you may tweak settings specific to that type.
   * - RGB Key: methods prefixed with `getChromaRGBKey-\*` or `setChromaRGBKey-\*`
   * - Color Key: methods prefixed with `getChromaColorKey-\*` or `setChromaColorKey-\*`
   * - Chroma Legacy Mode: methods prefixed with `getChromaLegacy-\*` or `setChromaLegacy-\*`
   */
  setKeyingType: (value: KeyingType) => Promise<HTMLItem>;

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
   */
  setChromaAntiAliasLevel: (value: ChromaAntiAliasLevel) => Promise<HTMLItem>;

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
   */
  setChromaLegacyBrightness: (value: number) => Promise<HTMLItem>;

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
   */
  setChromaLegacySaturation: (value: number) => Promise<HTMLItem>;

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
   */
  setChromaLegacyHue: (value: number) => Promise<HTMLItem>;

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
   */
  setChromaLegacyThreshold: (value: number) => Promise<HTMLItem>;

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
   */
  setChromaLegacyAlphaSmoothing: (value: number) => Promise<HTMLItem>;

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
   */
  setChromaRGBKeyPrimaryColor: (value: ChromaPrimaryColors) => Promise<HTMLItem>;

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
   */
  setChromaRGBKeyThreshold: (value: number) => Promise<HTMLItem>;

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
   */
  setChromaRGBKeyExposure: (value: number) => Promise<HTMLItem>;

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
   */
  setChromaColorKeyThreshold: (value: number) => Promise<HTMLItem>;

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
   */
  setChromaColorKeyExposure: (value: number) => Promise<HTMLItem>;

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
   */
  setChromaColorKeyColor: (value: Color) => Promise<HTMLItem>;

  // ItemTransition

  /**
   * return: Promise<boolean>
   *
   * Check if item is visible on stage
   */
  isVisible:         () => Promise<boolean>;

  /**
   * param: value<boolean>
   *
   * Set item to visible or hidden
   */
  setVisible:        (value: boolean) => Promise<HTMLItem>;

  /**
   * return: Promise<boolean>
   *
   * Get item's transition type for when visibility is toggled
   */
  getTransition:     () => Promise<Transition>;

  /**
   * param: value<Transition>
   *
   * Set item's transition type for when visibility is toggled
   */
  setTransition:     (value: Transition) => Promise<HTMLItem>;

  /**
   * return: Promise<number>
   *
   * Get item's transition time in milliseconds
   */
  getTransitionTime: () => Promise<number>;

  /**
   * param: value<number>
   *
   * Set item's transition time in milliseconds
   */
  setTransitionTime: (value: number) => Promise<HTMLItem>;

  // ItemConfigurable

  /**
   * return: Promise<any>
   *
   * Gets the configuration JSON
   */
  loadConfig: () => Promise<any>;

  /**
   * param: config<JSON>
   *
   * Persists a JSON object for configuration. Available to sources only.
   */
  saveConfig: (configObj: any) => Promise<HTMLItem>;

  /**
   * param: config<JSON>
   *
   * Requests the source to save a configuration. This makes the source emit the save-config event.
   */
  requestSaveConfig: (configObj: any) => Promise<HTMLItem>;

  /**
   * param: config<JSON>
   *
   * Requests the source to save a configuration. This makes the source emit the apply-config event.
   */
  applyConfig: (configObj: any) => Promise<HTMLItem>;
}

applyMixins(HTMLItem, [ItemLayout, ItemColor, ItemChroma, ItemTransition, ItemConfigurable]);
