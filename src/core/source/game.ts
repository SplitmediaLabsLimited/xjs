/// <reference path="../../../defs/es6-promise.d.ts" />

import {applyMixins} from '../../internal/util/mixin';
import {Item as iItem} from '../../internal/item';
import {ItemLayout, IItemLayout} from './ilayout';
import {ItemColor, IItemColor} from './icolor';
import {ItemChroma, IItemChroma, KeyingType, ChromaPrimaryColors,
  ChromaAntiAliasLevel} from './ichroma';
import {ItemEffect, IItemEffect, MaskEffect} from './ieffects';
import {ItemTransition, IItemTransition} from './itransition';
import {Transition} from '../transition';
import {Source} from './source';
import {Rectangle} from '../../util/rectangle';
import {Color} from '../../util/color';
import {JSON as JXON} from '../../internal/util/json';
import {XML} from '../../internal/util/xml';
import {SourceTypes} from './source';
import {Environment} from '../environment';

/**
 * The GameSource Class provides methods specifically used for game sources and
 * also methods that is shared between Source Classes. The
 * {@link #core/Scene Scene} class' getSources method would automatically return a
 * GameSource object if there's a game source on the specified scene.
 *
 * Inherits from: {@link #core/Source Core/Source}
 *
 * Implements: {@link #core/IItemChroma Core/IItemChroma},
 * {@link #core/IItemColor Core/IItemColor},
 * {@link #core/IItemLayout Core/IItemLayout},
 * {@link #core/IItemTransition Core/IItemTransition}
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 *
 * XJS.Scene.getActiveScene().then(function(scene) {
 *   scene.getSources().then(function(sources) {
 *     for (var i in sources) {
 *       if (sources[i] instanceof XJS.GameSource) {
 *         // Manipulate your game source here
 *         sources[i].setOfflineImage(path); // just an example here
 *       }
 *     }
 *   });
 * });
 * ```
 *
 *  All methods marked as *Chainable* resolve with the original `GameSource`
 *  instance.
 */
export class GameSource extends Source implements IItemLayout, IItemColor, IItemChroma, IItemTransition, IItemEffect {

  /**
   * return: Promise<boolean>
   *
   * Check if Game Special Optimization is currently enabled or not
   */
  isSpecialOptimizationEnabled(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('GameCapSurfSharing', this._id).then(res => {
        resolve(res === '1');
      });
    });
  }

  /**
   * param: Promise<boolean>
   *
   * Set Game Special Optimization to on or off
   *
   * *Chainable.*
   */
  setSpecialOptimizationEnabled(value: boolean): Promise<GameSource> {
    return new Promise(resolve => {
      iItem.set('GameCapSurfSharing', (value ? '1' : '0'),
        this._id).then(() => {
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
      iItem.get('GameCapShowMouse', this._id).then(res => {
        resolve(res === '1');
      });
    });
  }

  /**
   * param: (value: boolean)
   *
   * Set Show Mouse in game to on or off
   *
   * *Chainable.*
   */
  setShowMouseEnabled(value: boolean): Promise<GameSource> {
    return new Promise(resolve => {
      iItem.set('GameCapShowMouse', (value ? '1' : '0'), this._id).then(() => {
        resolve(this);
      });
    });
  }

  /**
   * param: path<string>
   *
   * Set the offline image of a game source
   *
   * *Chainable.*
   */
  setOfflineImage(path: string): Promise<GameSource> {
    return new Promise((resolve, reject) => {
      if (this._type !== SourceTypes.GAMESOURCE) {
        reject(Error('Current source should be a game source'));
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
      if (this._type !== SourceTypes.GAMESOURCE) {
        reject(Error('Current source should be a game source'));
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
  setCanvasRotate: (value: number) => Promise<GameSource>;

  /**
   * See: {@link #core/IItemLayout#setCropping setCropping}
   */
  setCropping: (value: Object) => Promise<GameSource>;

  /**
   * See: {@link #core/IItemLayout#setCroppingEnhanced setCroppingEnhanced}
   */
  setCroppingEnhanced: (value: Object) => Promise<GameSource>;

  /**
   * See: {@link #core/IItemLayout#setEnhancedRotate setEnhancedRotate}
   */
  setEnhancedRotate:        (value: number) => Promise<GameSource>;

  /**
   * See: {@link #core/IItemLayout#setKeepAspectRatio setKeepAspectRatio}
   */
  setKeepAspectRatio:       (value: boolean) => Promise<GameSource>;

  /**
   * See: {@link #core/IItemLayout#setPositionLocked setPositionLocked}
   */
  setPositionLocked:        (value: boolean) => Promise<GameSource>;

  /**
   * See: {@link #core/IItemLayout#setEnhancedResizeEnabled setEnhancedResizeEnabled}
   */
  setEnhancedResizeEnabled:  (value: boolean) => Promise<GameSource>;

  /**
   * See: {@link #core/IItemLayout#setPosition setPosition}
   */
  setPosition:              (value: Rectangle) => Promise<GameSource>;

  /**
   * See: {@link #core/IItemLayout#setRotateY setRotateY}
   */
  setRotateY:              (value: number) => Promise<GameSource>;

  /**
   * See: {@link #core/IItemLayout#setRotateX setRotateX}
   */
  setRotateX:              (value: number) => Promise<GameSource>;

  /**
   * See: {@link #core/IItemLayout#setRotateZ setRotateZ}
   */
  setRotateZ:              (value: number) => Promise<GameSource>;
  
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
  setTransparency: (value: number) => Promise<GameSource>;

  /**
   * See: {@link #core/IItemColor#setBrightness setBrightness}
   */
  setBrightness:   (value: number) => Promise<GameSource>;

  /**
   * See: {@link #core/IItemColor#setContrast setContrast}
   */
  setContrast:     (value: number) => Promise<GameSource>;

  /**
   * See: {@link #core/IItemColor#setHue setHue}
   */
  setHue:          (value: number) => Promise<GameSource>;

  /**
   * See: {@link #core/IItemColor#setSaturation setSaturation}
   */
  setSaturation:   (value: number) => Promise<GameSource>;

  /**
   * See: {@link #core/IItemColor#setBorderColor setBorderColor}
   */
  setBorderColor:  (value: Color) => Promise<GameSource>;

  /**
   * See: {@link #core/IItemColor#setFullDynamicColorRange setFullDynamicColorRange}
   */
  setFullDynamicColorRange: (value: boolean) => Promise<GameSource>;
  
// ItemChroma

  /**
   * See: {@link #core/IItemChroma#isChromaEnabled isChromaEnabled}
   */
  isChromaEnabled: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemChroma#setChromaEnabled setChromaEnabled}
   */
  setChromaEnabled: (value: boolean) => Promise<GameSource>;
  
  /**
   * See: {@link #core/IItemChroma#getKeyingType getKeyingType}
   */
  getKeyingType: () => Promise<KeyingType>;
  
  /**
   * See: {@link #core/IItemChroma#setKeyingType setKeyingType}
   */
  setKeyingType: (value: KeyingType) => Promise<GameSource>;

  // BOTH CHROMA LEGACY AND CHROMA RGB
  
  /**
   * See: {@link #core/IItemChroma#getChromaAntiAliasLevel getChromaAntiAliasLevel}
   */
  getChromaAntiAliasLevel: () => Promise<ChromaAntiAliasLevel>;
  
  /**
   * See: {@link #core/IItemChroma#setChromaAntiAliasLevel setChromaAntiAliasLevel}
   */
  setChromaAntiAliasLevel: (value: ChromaAntiAliasLevel) => Promise<GameSource>;

  // CHROMA LEGACY MODE
   
  /**
   * See: {@link #core/IItemChroma#getChromaLegacyBrightness getChromaLegacyBrightness}
   */
  getChromaLegacyBrightness: () => Promise<number>;
  
  /**
   * See: {@link #core/IItemChroma#setChromaLegacyBrightness setChromaLegacyBrightness}
   */
  setChromaLegacyBrightness: (value: number) => Promise<GameSource>;
  
  /**
   * See: {@link #core/IItemChroma#getChromaLegacySaturation getChromaLegacySaturation}
   */
  getChromaLegacySaturation: () => Promise<number>;
  
  /**
   * See: {@link #core/IItemChroma#setChromaLegacySaturation setChromaLegacySaturation}
   */
  setChromaLegacySaturation: (value: number) => Promise<GameSource>;
  
  /**
   * See: {@link #core/IItemChroma#getChromaLegacyHue getChromaLegacyHue}
   */
  getChromaLegacyHue: () => Promise<number>;
  
  /**
   * See: {@link #core/IItemChroma#setChromaLegacyHue setChromaLegacyHue}
   */
  setChromaLegacyHue: (value: number) => Promise<GameSource>;
  
  /**
   * See: {@link #core/IItemChroma#getChromaLegacyThreshold getChromaLegacyThreshold}
   */
  getChromaLegacyThreshold: () => Promise<number>;
  
  /**
   * See: {@link #core/IItemChroma#setChromaLegacyThreshold setChromaLegacyThreshold}
   */
  setChromaLegacyThreshold: (value: number) => Promise<GameSource>;
  
  /**
   * See: {@link #core/IItemChroma#getChromaLegacyAlphaSmoothing getChromaLegacyAlphaSmoothing}
   */
  getChromaLegacyAlphaSmoothing: () => Promise<number>;
  
  /**
   * See: {@link #core/IItemChroma#setChromaLegacyAlphaSmoothing setChromaLegacyAlphaSmoothing}
   */
  setChromaLegacyAlphaSmoothing: (value: number) => Promise<GameSource>;

  // CHROMA KEY RGB MODE
  
  /**
   * See: {@link #core/IItemChroma#getChromaRGBKeyPrimaryColor getChromaRGBKeyPrimaryColor}
   */
  getChromaRGBKeyPrimaryColor: () => Promise<ChromaPrimaryColors>;
  
  /**
   * See: {@link #core/IItemChroma#setChromaRGBKeyPrimaryColor setChromaRGBKeyPrimaryColor}
   */
  setChromaRGBKeyPrimaryColor: (value: ChromaPrimaryColors) => Promise<GameSource>;
  
  /**
   * See: {@link #core/IItemChroma#getChromaRGBKeyThreshold getChromaRGBKeyThreshold}
   */
  getChromaRGBKeyThreshold: () => Promise<number>;
  
  /**
   * See: {@link #core/IItemChroma#setChromaRGBKeyThreshold setChromaRGBKeyThreshold}
   */
  setChromaRGBKeyThreshold: (value: number) => Promise<GameSource>;
  
  /**
   * See: {@link #core/IItemChroma#getChromaRGBKeyExposure getChromaRGBKeyExposure}
   */
  getChromaRGBKeyExposure: () => Promise<number>;
  
  /**
   * See: {@link #core/IItemChroma#setChromaRGBKeyExposure setChromaRGBKeyExposure}
   */
  setChromaRGBKeyExposure: (value: number) => Promise<GameSource>;

  // COLOR KEY MODE
  
  /**
   * See: {@link #core/IItemChroma#getChromaColorKeyThreshold getChromaColorKeyThreshold}
   */
  getChromaColorKeyThreshold: () => Promise<number>;
  
  /**
   * See: {@link #core/IItemChroma#setChromaColorKeyThreshold setChromaColorKeyThreshold}
   */
  setChromaColorKeyThreshold: (value: number) => Promise<GameSource>;
  
  /**
   * See: {@link #core/IItemChroma#getChromaColorKeyExposure getChromaColorKeyExposure}
   */
  getChromaColorKeyExposure: () => Promise<number>;
  
  /**
   * See: {@link #core/IItemChroma#setChromaColorKeyExposure setChromaColorKeyExposure}
   */
  setChromaColorKeyExposure: (value: number) => Promise<GameSource>;
  
  /**
   * See: {@link #core/IItemChroma#getChromaColorKeyColor getChromaColorKeyColor}
   */
  getChromaColorKeyColor: () => Promise<Color>;
  
  /**
   * See: {@link #core/IItemChroma#setChromaColorKeyColor setChromaColorKeyColor}
   */
  setChromaColorKeyColor: (value: Color) => Promise<GameSource>;

  // ItemTransition

  /**
   * See: {@link #core/IItemTransition#isVisible isVisible}
   */
  isVisible: () => Promise<boolean>;
  
  /**
   * See: {@link #core/IItemTransition#setVisible setVisible}
   */
  setVisible:        (value: boolean) => Promise<GameSource>;
  
  /**
   * See: {@link #core/IItemTransition#getTransition getTransition}
   */
  getTransition: () => Promise<Transition>;
  
  /**
   * See: {@link #core/IItemTransition#setTransition setTransition}
   */
  setTransition:     (value: Transition) => Promise<GameSource>;
  
  /**
   * See: {@link #core/IItemTransition#getTransitionTime getTransitionTime}
   */
  getTransitionTime: () => Promise<number>;
  
  /**
   * See: {@link #core/IItemTransition#setTransitionTime setTransitionTime}
   */
  setTransitionTime: (value: number) => Promise<GameSource>;

  // ItemEffect

  /** See: {@link #core/IItemEffect#getMaskEffect getMaskEffect} */
  getMaskEffect: () => Promise<MaskEffect>;

  /** See: {@link #core/IItemEffect#setMaskEffect setMaskEffect} */
  setMaskEffect: (value: MaskEffect) => Promise<GameSource>;

  /** See: {@link #core/IItemEffect#getBorderEffectRadius getBorderEffectRadius} */
  getBorderEffectRadius: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setBorderEffectRadius setBorderEffectRadius} */
  setBorderEffectRadius: (value: number) => Promise<GameSource>;

  /** See: {@link #core/IItemEffect#getBorderEffectThickness getBorderEffectThickness} */
  getBorderEffectThickness: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setBorderEffectThickness setBorderEffectThickness} */
  setBorderEffectThickness: (value: number) => Promise<GameSource>;

  /** See: {@link #core/IItemEffect#getBorderEffectOpacity getBorderEffectOpacity} */
  getBorderEffectOpacity: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setBorderEffectOpacity setBorderEffectOpacity} */
  setBorderEffectOpacity: (value: number) => Promise<GameSource>;

  /** See: {@link #core/IItemEffect#getBorderEffectColor getBorderEffectColor} */
  getBorderEffectColor: () => Promise<Color>;

  /** See: {@link #core/IItemEffect#setBorderEffectColor setBorderEffectColor} */
  setBorderEffectColor: (value: Color) => Promise<GameSource>;

   /** See: {@link #core/IItemEffect#getShadowEffectColor getShadowEffectColor} */
  getShadowEffectColor: () => Promise<Color>;

  /** See: {@link #core/IItemEffect#setShadowEffectColor setShadowEffectColor} */
  setShadowEffectColor: (value: Color) => Promise<GameSource>;

  /** See: {@link #core/IItemEffect#getShadowEffectThickness getShadowEffectThickness} */
  getShadowEffectThickness: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setShadowEffectThickness setShadowEffectThickness} */
  setShadowEffectThickness: (value: number) => Promise<GameSource>;

  /** See: {@link #core/IItemEffect#getShadowEffectBlur getShadowEffectBlur} */
  getShadowEffectBlur: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setShadowEffectBlur setShadowEffectBlur} */
  setShadowEffectBlur: (value: number) => Promise<GameSource>;

  /** See: {@link #core/IItemEffect#getShadowEffectOpacity getShadowEffectOpacity} */
  getShadowEffectOpacity: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setShadowEffectOpacity setShadowEffectOpacity} */
  setShadowEffectOpacity: (value: number) => Promise<GameSource>;

  /** See: {@link #core/IItemEffect#getShadowEffectOffsetX getShadowEffectOffsetX} */
  getShadowEffectOffsetX: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setShadowEffectOffsetX setShadowEffectOffsetX} */
  setShadowEffectOffsetX: (value: number) => Promise<GameSource>;

  /** See: {@link #core/IItemEffect#getShadowEffectOffsetY getShadowEffectOffsetY} */
  getShadowEffectOffsetY: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setShadowEffectOffsetY setShadowEffectOffsetY} */
  setShadowEffectOffsetY: (value: number) => Promise<GameSource>;

  /** See: {@link #core/IItemEffect#getFileMask getFileMask} */
  getFileMask: () => Promise<string>;

  /** See: {@link #core/IItemEffect#setFileMask setFileMask} */
  setFileMask: (value: string) => Promise<GameSource>;

  /** See: {@link #core/IItemEffect#isFileMaskingGuideVisible isFileMaskingGuideVisible} */
  isFileMaskingGuideVisible: () => Promise<boolean>;

  /** See: {@link #core/IItemEffect#showFileMaskingGuide showFileMaskingGuide} */
  showFileMaskingGuide: (value: boolean) => Promise<GameSource>; 
}

applyMixins(GameSource, [ItemLayout, ItemColor, ItemChroma, ItemTransition]);
