/// <reference path="../../../defs/es6-promise.d.ts" />

import {applyMixins} from '../../internal/util/mixin';
import {Item as iItem} from '../../internal/item';
import {ItemLayout, IItemLayout} from './ilayout';
import {ItemColor, IItemColor} from './icolor';
import {ItemChroma, IItemChroma, KeyingType, ChromaPrimaryColors,
  ChromaAntiAliasLevel} from './ichroma';
import {ItemTransition, IItemTransition} from './itransition';
import {Transition} from '../transition';
import {Item} from './item';
import {Rectangle} from '../../util/rectangle';
import {Color} from '../../util/color';
import {JSON as JXON} from '../../internal/util/json';
import {XML} from '../../internal/util/xml';
import {ItemTypes} from './item';
import {Environment} from '../environment';

export class GameItem extends Item implements IItemLayout, IItemColor, IItemChroma, IItemTransition {

  /**
   * return: boolean
   *
   * Check if Game Special Optimization is currently enabled or not
   */
  isSpecialOptimization(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('GameCapSurfSharing').then(res => {
        resolve(res === '1');
      });
    });
  }

  /**
   * param: boolean
   *
   * Set Game Special Optimization to on or off
   */
  setSpecialOptimization(value: boolean) {
    let slot = iItem.attach(this._id);

    iItem.set('GameCapSurfSharing', (value ? '1' : '0'), slot);
  }

  /**
   * return: boolean
   *
   * Check if Show Mouse is currently enabled or not
   */
  isShowMouse(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('GameCapShowMouse').then(res => {
        resolve(res === '1');
      });
    });
  }

  /**
   * param: boolean
   *
   * Set Show Mouse in game to on or off
   */
  setShowMouse(value: boolean) {
    let slot = iItem.attach(this._id);

    iItem.set('GameCapShowMouse', (value ? '1' : '0'), slot);
  }

  /**
   * param: string
   *
   * Set the offline image of a game source
   */
  setOfflineImage(path: string) {
    if (this.type !== ItemTypes.GAMESOURCE) {
      throw new Error('Current item should be a game source');
    }

    if (Environment.isSourceHtml()) {
       new Error('Source plugins cannot update offline images of other sources');
    }

    if (!(this.value instanceof XML)) {
      this.getValue().then(() => {
        this.setOfflineImage(path);
      });
      return;
    }

    var regExp = new RegExp('^(([A-Z|a-z]:\\\\[^*|"<>?\n]*)|(\\\\\\\\.*?' +
      '\\\\.*)|([A-Za-z]+\\\\[^*|"<>?\\n]*))\.(png|gif|jpg|jpeg|tif)$');

    if (regExp.test(path)) {
      var valueObj = JXON.parse(this.value.toString());
      valueObj['replace'] = path;
      this.setValue(XML.parseJSON(valueObj));
    }
  }

  /**
   * return: string
   *
   * Get the offline image of a game source
   */
  getOfflineImage(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.type !== ItemTypes.GAMESOURCE) {
        reject(Error('Current item should be a game source'));
      }

      if (!(this.value instanceof XML)) {
        this.getValue().then(() => {
          this.getOfflineImage().then(val => {
            resolve(val);
          });
        });
      } else {
        var valueObj = JXON.parse(this.value.toString());
        resolve(valueObj['replace']);
      }
    });
  }

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

  // ItemTransition

  /** Check if item is visible on stage */
  isVisible:         () => Promise<boolean>;

  /** Set item to visible or hidden */
  setVisible:        (value: boolean) => void;

  /** Get item's transition type for when visibility is toggled */
  getTransition:     () => Promise<Transition>;

  /** Set item's transition type for when visibility is toggled */
  setTransition:     (value: Transition) => void;

  /** Get item's transition time in milliseconds */
  getTransitionTime: () => Promise<number>;

  /** Set item's transition time in milliseconds */
  setTransitionTime: (value: number) => void;
}

applyMixins(GameItem, [ItemLayout, ItemColor, ItemChroma, ItemTransition]);
