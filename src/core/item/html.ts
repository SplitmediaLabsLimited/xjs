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

export class HTMLItem extends Item implements IItemLayout, IItemColor, IItemChroma, IItemTransition, IItemConfigurable {

  getURL(): Promise<string> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);

      iItem.get('prop:item', slot).then(url => {
        resolve(url);
      });
    });
  }

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
   */
  isChromaEnabled: () => Promise<boolean>;
  /**
   * param: value<boolean>
   */
  setChromaEnabled: (value: boolean) => Promise<HTMLItem>;
  /**
   * return: Promise<KeyingType>
   */
  getKeyingType: () => Promise<KeyingType>;
  /**
   * param: value<KeyingType>
   */
  setKeyingType: (value: KeyingType) => Promise<HTMLItem>;

  // BOTH CHROMA LEGACY AND CHROMA RGB
  /**
   * return: Promise<ChromaAntiAliasLevel>
   */
  getChromaAntiAliasLevel: () => Promise<ChromaAntiAliasLevel>;
  /**
   * param: value<ChromaAntiAliasLevel>
   */
  setChromaAntiAliasLevel: (value: ChromaAntiAliasLevel) => Promise<HTMLItem>;

  // CHROMA LEGACY MODE
  /**
   * return: Promise<number>
   */
  getChromaLegacyBrightness: () => Promise<number>;
  /**
   * param: value<number>
   */
  setChromaLegacyBrightness: (value: number) => Promise<HTMLItem>;
  /**
   * return: Promise<number>
   */
  getChromaLegacySaturation: () => Promise<number>;
  /**
   * param: value<number>
   */
  setChromaLegacySaturation: (value: number) => Promise<HTMLItem>;
  /**
   * return: Promise<number>
   */
  getChromaLegacyHue: () => Promise<number>;
  /**
   * param: value<number>
   */
  setChromaLegacyHue: (value: number) => Promise<HTMLItem>;
  /**
   * return: Promise<number>
   */
  getChromaLegacyThreshold: () => Promise<number>;
  /**
   * param: value<number>
   */
  setChromaLegacyThreshold: (value: number) => Promise<HTMLItem>;
  /**
   * return: Promise<number>
   */
  getChromaLegacyAlphaSmoothing: () => Promise<number>;
  /**
   * param: value<number>
   */
  setChromaLegacyAlphaSmoothing: (value: number) => Promise<HTMLItem>;

  // CHROMA KEY RGB MODE
  /**
   * return: Promise<ChromaPrimaryColors>
   */
  getChromaRGBKeyPrimaryColor: () => Promise<ChromaPrimaryColors>;
  /**
   * param: value<ChromaPrimaryColors>
   */
  setChromaRGBKeyPrimaryColor: (value: ChromaPrimaryColors) => Promise<HTMLItem>;
  /**
   * return: Promise<number>
   */
  getChromaRGBKeyThreshold: () => Promise<number>;
  /**
   * param: value<number>
   */
  setChromaRGBKeyThreshold: (value: number) => Promise<HTMLItem>;
  /**
   * return: Promise<number>
   */
  getChromaRGBKeyExposure: () => Promise<number>;
  /**
   * param: value<number>
   */
  setChromaRGBKeyExposure: (value: number) => Promise<HTMLItem>;

  // COLOR KEY MODE
  /**
   * return: Promise<number>
   */
  getChromaColorKeyThreshold: () => Promise<number>;
  /**
   * param: value<number>
   */
  setChromaColorKeyThreshold: (value: number) => Promise<HTMLItem>;
  /**
   * return: Promise<number>
   */
  getChromaColorKeyExposure: () => Promise<number>;
  /**
   * param: value<number>
   */
  setChromaColorKeyExposure: (value: number) => Promise<HTMLItem>;
  /**
   * return: Promise<Color>
   */
  getChromaColorKeyColor: () => Promise<Color>;
  /**
   * param: value<Color>
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
  saveConfig: (configObj: any) => Promise<HTMLItem>;
  requestSaveConfig: (configObj: any) => Promise<HTMLItem>;
}

applyMixins(HTMLItem, [ItemLayout, ItemColor, ItemChroma, ItemTransition, ItemConfigurable]);