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

/**
 * The GameItem Class provides methods specifically used for game items and
 * also methods that is shared between Item Classes. The
 * {@link #core/Scene Scene} class' getItems method would automatically return a
 * GameItem object if there's a game item on the specified scene.
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 *
 * XJS.Scene.getActiveScene().then(function(scene) {
 *   scene.getItems().then(function(items) {
 *     for (var i in items) {
 *       if (items[i] instanceof XJS.GameItem) {
 *         // Manipulate your game item here
 *         items[i].setOfflineImage(path); // just an example here
 *       }
 *     }
 *   });
 * });
 * ```
 */
export class GameItem extends Item implements IItemLayout, IItemColor, IItemChroma, IItemTransition {

  /**
   * return: Promise<boolean>
   *
   * Check if Game Special Optimization is currently enabled or not
   */
  isSpecialOptimizationEnabled(): Promise<boolean> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('GameCapSurfSharing').then(res => {
        resolve(res === '1');
      });
    });
  }

  /**
   * param: Promise<boolean>
   *
   * Set Game Special Optimization to on or off
   */
  setSpecialOptimizationEnabled(value: boolean): Promise<GameItem> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.set('GameCapSurfSharing', (value ? '1' : '0'), slot).then(() => {
        resolve(this);
      });
    });
  }

  /**
   * return: Promise<boolean>
   *
   * Check if Show Mouse is currently enabled or not
   */
  isShowMouseEnabled(): Promise<boolean> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('GameCapShowMouse').then(res => {
        resolve(res === '1');
      });
    });
  }

  /**
   * param: value<boolean>
   *
   * Set Show Mouse in game to on or off
   */
  setShowMouseEnabled(value: boolean): Promise<GameItem> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.set('GameCapShowMouse', (value ? '1' : '0'), slot).then(() => {
        resolve(this);
      });
    });
  }

  /**
   * param: path<string>
   *
   * Set the offline image of a game source
   */
  setOfflineImage(path: string): Promise<GameItem> {
    return new Promise((resolve, reject) => {
      if (this._type !== ItemTypes.GAMESOURCE) {
        reject(Error('Current item should be a game source'));
      } else if (Environment.isSourcePlugin()) {
        reject(
          Error('Source plugins cannot update offline images of other sources')
        );
      } else if (!(this._value instanceof XML)) {
        this.getValue().then(() => {
          this.setOfflineImage(path).then(itemObj => {
            resolve(itemObj);
          });
        });
      } else {
        var regExp = new RegExp('^(([A-Z|a-z]:\\\\[^*|"<>?\n]*)|(\\\\\\\\.*?' +
          '\\\\.*)|([A-Za-z]+\\\\[^*|"<>?\\n]*))\.(png|gif|jpg|jpeg|tif)$');
        if (regExp.test(path) || path === '') {
          var valueObj = JXON.parse(this._value.toString());
          valueObj['replace'] = path;
          this.setValue(XML.parseJSON(valueObj)).then(() => {
            resolve(this);
          });
        }
      }
    });
  }

  /**
   * return: Promise<string>
   *
   * Get the offline image of a game source
   */
  getOfflineImage(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this._type !== ItemTypes.GAMESOURCE) {
        reject(Error('Current item should be a game source'));
      } else {
        this.getValue().then(() => {
          var valueObj = JXON.parse(this._value.toString());
          resolve(valueObj['replace'] ? valueObj['replace'] : '');
        });
      }
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
  setKeepAspectRatio:       (value: boolean) => Promise<GameItem>;

  /**
   * param: value<boolean>
   *
   * Set Position Lock to ON or OFF
   */
  setPositionLocked:        (value: boolean) => Promise<GameItem>;

  /**
   * param: value<boolean>
   *
   * Set Enhance Resize to ON or OFF
   */
  setEnhancedResizeEnabled:  (value: boolean) => Promise<GameItem>;

  /**
   * param: value<Rectangle>
   *
   * Set Item position
   */
  setPosition:              (value: Rectangle) => Promise<GameItem>;

  /**
   * param: value<number>
   *
   * Set Rotate Y value of the item
   */
  setRotateY:              (value: number) => Promise<GameItem>;

  /**
   * param: value<number>
   *
   * Set Rotate X value of the item
   */
  setRotateX:              (value: number) => Promise<GameItem>;

  /**
   * param: value<number>
   *
   * Set Rotate Z value of the item
   */
  setRotateZ:              (value: number) => Promise<GameItem>;

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
  setTransparency: (value: number) => Promise<GameItem>;

  /**
   * param: value<number>
   *
   * Set Item Brightness
   */
  setBrightness:   (value: number) => Promise<GameItem>;

  /**
   * param: value<number>
   *
   * Set Item Contrast
   */
  setContrast:     (value: number) => Promise<GameItem>;

  /**
   * param: value<number>
   *
   * Set Item Hue
   */
  setHue:          (value: number) => Promise<GameItem>;

  /**
   * param: value<number>
   *
   * Set Item Saturation
   */
  setSaturation:   (value: number) => Promise<GameItem>;

  /**
   * param: value<Color>
   *
   * Set Border Color
   */
  setBorderColor:  (value: Color) => Promise<GameItem>;

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
  setChromaEnabled: (value: boolean) => Promise<GameItem>;

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
  setKeyingType: (value: KeyingType) => Promise<GameItem>;

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
  setChromaAntiAliasLevel: (value: ChromaAntiAliasLevel) => Promise<GameItem>;

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
  setChromaLegacyBrightness: (value: number) => Promise<GameItem>;

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
  setChromaLegacySaturation: (value: number) => Promise<GameItem>;

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
  setChromaLegacyHue: (value: number) => Promise<GameItem>;

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
  setChromaLegacyThreshold: (value: number) => Promise<GameItem>;

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
  setChromaLegacyAlphaSmoothing: (value: number) => Promise<GameItem>;

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
  setChromaRGBKeyPrimaryColor: (value: ChromaPrimaryColors) => Promise<GameItem>;

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
  setChromaRGBKeyThreshold: (value: number) => Promise<GameItem>;

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
  setChromaRGBKeyExposure: (value: number) => Promise<GameItem>;

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
  setChromaColorKeyThreshold: (value: number) => Promise<GameItem>;

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
  setChromaColorKeyExposure: (value: number) => Promise<GameItem>;

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
  setChromaColorKeyColor: (value: Color) => Promise<GameItem>;

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
  setVisible:        (value: boolean) => Promise<GameItem>;

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
  setTransition:     (value: Transition) => Promise<GameItem>;

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
  setTransitionTime: (value: number) => Promise<GameItem>;
}

applyMixins(GameItem, [ItemLayout, ItemColor, ItemChroma, ItemTransition]);
