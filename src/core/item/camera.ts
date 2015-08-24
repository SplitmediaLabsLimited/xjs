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
import {Rectangle} from '../../util/rectangle';
import {Color} from '../../util/color';

export class CameraItem extends Item implements IItemLayout, IItemColor, IItemChroma, IItemTransition {
  private _id: string;
  // ItemLayout

  /** Check if Aspect Ratio is set to ON or OFF */
  isKeepAspectRatio:        () => Promise<boolean>;

  /** Check if Position Locked is set to ON or OFF */
  isPositionLocked:         () => Promise<boolean>;

  /** Check if Enhance Resize is Enabled or Disabled */
  isEnhancedResizeEnabled:   () => Promise<boolean>;

  /** Get the position of the item */
  getPosition:              () => Promise<Rectangle>;

  /** Set Aspect Ratio to ON or OFF */
  setKeepAspectRatio:       (value: boolean) => void;

  /** Set Position Lock to ON or OFF */
  setPositionLocked:        (value: boolean) => void;

  /** Set Enhance Resize to ON or OFF */
  setEnhancedResizeEnabled:  (value: boolean) => void;

  /** Set Item position */
  setPosition:              (value: Rectangle) => void;

  // ItemColor

  /** Get Item Transparency value */
  getTransparency: () => Promise<number>;

  /** Get Item Brightness value */
  getBrightness:   () => Promise<number>;

  /** Get Item Contrast value */
  getContrast:     () => Promise<number>;

  /** Get Item Hue value */
  getHue:          () => Promise<number>;

  /** Get Item Saturation value */
  getSaturation:   () => Promise<number>;

  /** Get Border Color */
  getBorderColor:  () => Promise<Color>;

  /** Set Item Transparency */
  setTransparency: (value: number) => void;

  /** Set Item Brightness */
  setBrightness:   (value: number) => void;

  /** Set Item Contrast */
  setContrast:     (value: number) => void;

  /** Set Item Hue */
  setHue:          (value: number) => void;

  /** Set Item Saturation */
  setSaturation:   (value: number) => void;

  /** Set Border Color */
  setBorderColor:  (value: Color) => void;

  // special color options pinning

  /** Set this to true to share color settings across all instances of this
   *  camera device on the stage.
   */
  setColorOptionsPinned(value: boolean) {
    let slot = iItem.attach(this.id);

    iItem.set('prop:cc_pin', value ? '1' : '0', slot);
  }

  /** Checks whether color settings are shared across all instances of
   *  this camera device on the stage.
   */
  getColorOptionsPinned(): Promise<boolean> {
    return new Promise(resolve => {
      let slot = iItem.attach(this.id);

      iItem.get('prop:cc_pin', slot).then(val => {
        resolve(val === '1' ? true : false);
      });
    });
  }

  // ItemChroma
  isChromaEnabled: () => Promise<boolean>; // prop:key_chromakey
  setChromaEnabled: (value: boolean) => void;
  getKeyingType: () => Promise<KeyingType>; // prop:key_chromakeytype
  setKeyingType: (value: KeyingType) => void;

  // BOTH CHROMA LEGACY AND CHROMA RGB
  getChromaAntiAliasLevel: () => Promise<ChromaAntiAliasLevel>; // prop:key_antialiasing
  setChromaAntiAliasLevel: (value: ChromaAntiAliasLevel) => void;

  // CHROMA LEGACY MODE
  getChromaLegacyBrightness: () => Promise<number>; // prop:key_chromabr  // ONLY FOR LEGACY MODE. Brightness
  setChromaLegacyBrightness: (value: number) => void;
  getChromaLegacySaturation: () => Promise<number>; // prop:key_chromasat // ONLY FOR LEGACY MODE. Saturation
  setChromaLegacySaturation: (value: number) => void;
  getChromaLegacyHue: () => Promise<number>; // prop:key_chromahue // ONLY FOR LEGACY MODE. Hue
  setChromaLegacyHue: (value: number) => void;
  getChromaLegacyThreshold: () => Promise<number>; // prop:key_chromarang // ONLY FOR LEGACY MODE. (below hue). Threshold?
  setChromaLegacyThreshold: (value: number) => void;
  getChromaLegacyAlphaSmoothing: () => Promise<number>; // prop:key_chromaranga // ONLY FOR LEGACY MODE. Alpha Smoothing
  setChromaLegacyAlphaSmoothing: (value: number) => void;

  // CHROMA KEY RGB MODE
  getChromaRGBKeyPrimaryColor: () => Promise<ChromaPrimaryColors>; // prop:key_chromargbkeyprimary. Key Color
  setChromaRGBKeyPrimaryColor: (value: ChromaPrimaryColors) => void;
  getChromaRGBKeyThreshold: () => Promise<number>; // prop:key_chromargbkeythresh. Threshold
  setChromaRGBKeyThreshold: (value: number) => void;
  getChromaRGBKeyExposure: () => Promise<number>; // prop:key_chromargbkeybalance. Exposure
  setChromaRGBKeyExposure: (value: number) => void;

  // COLOR KEY MODE
  getChromaColorKeyThreshold: () => Promise<number>; // prop:key_colorrang // ONLY FOR COLOR KEY MODE. Threshold
  setChromaColorKeyThreshold: (value: number) => void;
  getChromaColorKeyExposure: () => Promise<number>; // prop:key_colorranga // ONLY FOR COLOR KEY MODE. Exposure
  setChromaColorKeyExposure: (value: number) => void;
  getChromaColorKeyColor: () => Promise<Color>; // prop:key_colorrgb // ONLY FOR COLOR KEY MODE
  setChromaColorKeyColor: (value: Color) => void;

  // special chroma options pinning

  /** Set this to true to share chroma keying settings across all instances of
   *  this camera device on the stage.
   */
  setKeyingOptionsPinned(value: boolean) {
    let slot = iItem.attach(this.id);

    iItem.set('prop:key_pin', value ? '1' : '0', slot);
  }

  /** Checks whether chroma keying settings are shared across all instances of
   *  this camera device on the stage.
   */
  getKeyingOptionsPinned(): Promise<boolean> {
    return new Promise(resolve => {
      let slot = iItem.attach(this.id);

      iItem.get('prop:key_pin', slot).then(val => {
        resolve(val === '1' ? true : false);
      });
    });
  }

  // ItemTransition

  /** Check if item is visible on stage */
  isVisible:         () => Promise<boolean>;

  /** Set item to visible or hidden */
  setVisible:        (value: boolean) => void;

  /** Get item's transition type for when visibility is toggled */
  getTransition:     () => Promise<string>;

  /** Set item's transition type for when visibility is toggled */
  setTransition:     (value: string) => void;

  /** Get item's transition time in milliseconds */
  getTransitionTime: () => Promise<number>;

  /** Set item's transition time in milliseconds */
  setTransitionTime: (value: number) => void;
}

applyMixins(CameraItem, [ItemLayout, ItemColor, ItemChroma, ItemTransition]);
