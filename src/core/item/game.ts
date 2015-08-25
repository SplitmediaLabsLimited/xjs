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
 * {@link #core/Scene Scene Class'} getItems would automatically return a
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
  setSpecialOptimizationEnabled(value: boolean) {
    let slot = iItem.attach(this._id);

    iItem.set('GameCapSurfSharing', (value ? '1' : '0'), slot);
  }

  /**
   * return: Promise<boolean>
   *
   * Check if Show Mouse is currently enabled or not
   */
  isShowMouseEnabled(): Promise<boolean> {
    return new Promise(resolve => {
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
  setShowMouseEnabled(value: boolean) {
    let slot = iItem.attach(this._id);

    iItem.set('GameCapShowMouse', (value ? '1' : '0'), slot);
  }

  /**
   * param: path<string>
   *
   * Set the offline image of a game source
   */
  setOfflineImage(path: string): Promise<GameItem> {
    return new Promise((resolve, reject) => {
      if (this.type !== ItemTypes.GAMESOURCE) {
        reject(Error('Current item should be a game source'));
      }

      if (Environment.isSourceHtml()) {
        reject(
          Error('Source plugins cannot update offline images of other sources')
        );
      }

      if (!(this.value instanceof XML)) {
        this.getValue().then(() => {
          this.setOfflineImage(path).then(itemObj => {
            resolve(itemObj);
          })
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

      resolve(this);
    });
  }

  /**
   * return: Promise<string>
   *
   * Get the offline image of a game source
   */
  getOfflineImage(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.type !== ItemTypes.GAMESOURCE) {
        reject(Error('Current item should be a game source'));
      }

      this.getValue().then(() => {
        var valueObj = JXON.parse(this.value.toString());
        resolve(valueObj['replace'] ? valueObj['replace'] : '');
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
  setKeepAspectRatio:       (value: boolean) => void;

  /**
   * param: value<boolean>
   *
   * Set Position Lock to ON or OFF
   */
  setPositionLocked:        (value: boolean) => void;

  /**
   * param: value<boolean>
   *
   * Set Enhance Resize to ON or OFF
   */
  setEnhancedResizeEnabled:  (value: boolean) => void;

  /**
   * param: value<Rectangle>
   *
   * Set Item position
   */
  setPosition:              (value: Rectangle) => void;

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
  setTransparency: (value: number) => void;

  /**
   * param: value<number>
   *
   * Set Item Brightness
   */
  setBrightness:   (value: number) => void;

  /**
   * param: value<number>
   *
   * Set Item Contrast
   */
  setContrast:     (value: number) => void;

  /**
   * param: value<number>
   *
   * Set Item Hue
   */
  setHue:          (value: number) => void;

  /**
   * param: value<number>
   *
   * Set Item Saturation
   */
  setSaturation:   (value: number) => void;

  /**
   * param: value<Color>
   *
   * Set Border Color
   */
  setBorderColor:  (value: Color) => void;

  // ItemChroma
  /**
   * return: Promise<boolean>
   */
  isChromaEnabled: () => Promise<boolean>;
  /**
   * param: value<boolean>
   */
  setChromaEnabled: (value: boolean) => void;
  /**
   * return: Promise<KeyingType>
   */
  getKeyingType: () => Promise<KeyingType>;
  /**
   * param: value<KeyingType>
   */
  setKeyingType: (value: KeyingType) => void;

  // BOTH CHROMA LEGACY AND CHROMA RGB
  /**
   * return: Promise<ChromaAntiAliasLevel>
   */
  getChromaAntiAliasLevel: () => Promise<ChromaAntiAliasLevel>;
  /**
   * param: value<ChromaAntiAliasLevel>
   */
  setChromaAntiAliasLevel: (value: ChromaAntiAliasLevel) => void;

  // CHROMA LEGACY MODE
  /**
   * return: Promise<number>
   */
  getChromaLegacyBrightness: () => Promise<number>;
  /**
   * param: value<number>
   */
  setChromaLegacyBrightness: (value: number) => void;
  /**
   * return: Promise<number>
   */
  getChromaLegacySaturation: () => Promise<number>;
  /**
   * param: value<number>
   */
  setChromaLegacySaturation: (value: number) => void;
  /**
   * return: Promise<number>
   */
  getChromaLegacyHue: () => Promise<number>;
  /**
   * param: value<number>
   */
  setChromaLegacyHue: (value: number) => void;
  /**
   * return: Promise<number>
   */
  getChromaLegacyThreshold: () => Promise<number>;
  /**
   * param: value<number>
   */
  setChromaLegacyThreshold: (value: number) => void;
  /**
   * return: Promise<number>
   */
  getChromaLegacyAlphaSmoothing: () => Promise<number>;
  /**
   * param: value<number>
   */
  setChromaLegacyAlphaSmoothing: (value: number) => void;

  // CHROMA KEY RGB MODE
  /**
   * return: Promise<ChromaPrimaryColors>
   */
  getChromaRGBKeyPrimaryColor: () => Promise<ChromaPrimaryColors>;
  /**
   * param: value<ChromaPrimaryColors>
   */
  setChromaRGBKeyPrimaryColor: (value: ChromaPrimaryColors) => void;
  /**
   * return: Promise<number>
   */
  getChromaRGBKeyThreshold: () => Promise<number>;
  /**
   * param: value<number>
   */
  setChromaRGBKeyThreshold: (value: number) => void;
  /**
   * return: Promise<number>
   */
  getChromaRGBKeyExposure: () => Promise<number>;
  /**
   * param: value<number>
   */
  setChromaRGBKeyExposure: (value: number) => void;

  // COLOR KEY MODE
  /**
   * return: Promise<number>
   */
  getChromaColorKeyThreshold: () => Promise<number>;
  /**
   * param: value<number>
   */
  setChromaColorKeyThreshold: (value: number) => void;
  /**
   * return: Promise<number>
   */
  getChromaColorKeyExposure: () => Promise<number>;
  /**
   * param: value<number>
   */
  setChromaColorKeyExposure: (value: number) => void;
  /**
   * return: Promise<Color>
   */
  getChromaColorKeyColor: () => Promise<Color>;
  /**
   * param: value<Color>
   */
  setChromaColorKeyColor: (value: Color) => void;

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
  setVisible:        (value: boolean) => void;

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
  setTransition:     (value: Transition) => void;

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
  setTransitionTime: (value: number) => void;
}

applyMixins(GameItem, [ItemLayout, ItemColor, ItemChroma, ItemTransition]);
