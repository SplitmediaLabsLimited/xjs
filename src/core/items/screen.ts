/// <reference path="../../../defs/es6-promise.d.ts" />

import {exec} from '../../internal/internal';
import {applyMixins} from '../../internal/util/mixin';
import {Item as iItem} from '../../internal/item';
import {App as iApp} from '../../internal/app';
import {ItemLayout, IItemLayout} from './ilayout';
import {ItemColor, IItemColor} from './icolor';
import {ItemChroma, IItemChroma, KeyingType, ChromaPrimaryColors,
ChromaAntiAliasLevel} from './ichroma';
import {ItemEffect, IItemEffect, MaskEffect} from './ieffects';
import {ItemTransition, IItemTransition} from './itransition';
import {Item} from './item';
import {Scene} from '../scene';
import {Transition} from '../transition';
import {Filter} from '../filter';
import {Rectangle} from '../../util/rectangle';
import {Color} from '../../util/color';
import {Environment} from '../environment';
import {JSON as JXON} from '../../internal/util/json';
import {XML} from '../../internal/util/xml';
import {ISourceScreen, iSourceScreen} from '../source/iscreen';

/**
 * The ScreenItem class represents a screen capture item.
 *
 * Inherits from: {@link #core/Item Core/Item}
 *
 * Implements: {@link #core/IItemChroma Core/IItemChroma},
 * {@link #core/IItemColor Core/IItemColor},
 * {@link #core/IItemLayout Core/IItemLayout},
 * {@link #core/IItemTransition Core/IItemTransition},
 * {@link #core/IItemEffect Core/IItemEffect}
 *
 *  All methods marked as *Chainable* resolve with the original `ScreenItem`
 *  instance.
 */
export class ScreenItem extends Item implements IItemLayout, IItemColor,
  IItemChroma, IItemTransition, IItemEffect, ISourceScreen {

  //Screen Source
  /**
   * See {@link #core/ScreenSource#isStickToTitle isStickToTitle}
   */
  isStickToTitle: () => Promise<boolean>

  /**
   * See {@link #core/ScreenSource#setStickToTitle setStickToTitle}
   */
  setStickToTitle: (value: boolean) => Promise<ScreenItem>

  /**
   * See {@link #core/ScreenSource#getCaptureLayered getCaptureLayered}
   */
  getCaptureLayered: () => Promise<boolean>

  /**
   * See {@link #core/ScreenSource#setCaptureLayered setCaptureLayered}
   */
  setCaptureLayered: (value: boolean) => Promise<ScreenItem>

  /**
   * See {@link #core/ScreenSource#getOptimizedCapture getOptimizedCapture}
   */
  getOptimizedCapture: () => Promise<boolean>

  /**
   * See {@link #core/ScreenSource#setOptimizedCapture setOptimizedCapture}
   */
  setOptimizedCapture:(value: boolean) => Promise<ScreenItem>

  /**
   * See {@link #core/ScreenSource#getShowMouseClicks getShowMouseClicks}
   */
  getShowMouseClicks: () => Promise<boolean>

  /**
   * See {@link #core/ScreenSource#setShowMouseClicks setShowMouseClicks}
   */
  setShowMouseClicks: (value: boolean) => Promise<ScreenItem>

  /**
   * See {@link #core/ScreenSource#getShowMouse getShowMouse}
   */
  getShowMouse: () => Promise<boolean>

  /**
   * See {@link #core/ScreenSource#setShowMouse setShowMouse}
   */
  setShowMouse: (value: boolean) => Promise<ScreenItem>

  /**
   * See {@link #core/ScreenSource#getCaptureArea getCaptureArea}
   */
  getCaptureArea: () => Promise<Rectangle>

  /**
   * See {@link #core/ScreenSource#setCaptureArea setCaptureArea}
   */
  setCaptureArea: (dimension: Rectangle) => Promise<ScreenItem>

  /**
   * See {@link #core/ScreenSource#isClientArea isClientArea}
   */
  isClientArea: () => Promise<boolean>

  /**
   * See {@link #core/ScreenSource#setClientArea setClientArea}
   */
  setClientArea: (value: boolean) => Promise<ScreenItem>

  // ItemLayout

  /**
   * See: {@link #core/IItemLayout#bringForward bringForward}
   */
  bringForward: () => Promise<ScreenItem>;

  /**
   * See: {@link #core/IItemLayout#bringToFront bringToFront}
   */
  bringToFront: () => Promise<ScreenItem>;

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
   * See: {@link #core/IItemLayout#sendBackward sendBackward}
   */
  sendBackward: () => Promise<ScreenItem>;

  /**
   * See: {@link #core/IItemLayout#sendToBack sendToBack}
   */
  sendToBack: () => Promise<ScreenItem>;

  /**
   * See: {@link #core/IItemLayout#setCanvasRotate setCanvasRotate}
   */
  setCanvasRotate: (value: number) => Promise<ScreenItem>;

  /**
   * See: {@link #core/IItemLayout#setCropping setCropping}
   */
  setCropping: (value: Object) => Promise<ScreenItem>;

  /**
   * See: {@link #core/IItemLayout#setCroppingEnhanced setCroppingEnhanced}
   */
  setCroppingEnhanced: (value: Object) => Promise<ScreenItem>;

  /**
   * See: {@link #core/IItemLayout#setEnhancedRotate setEnhancedRotate}
   */
  setEnhancedRotate:        (value: number) => Promise<ScreenItem>;

  /**
   * See: {@link #core/IItemLayout#setKeepAspectRatio setKeepAspectRatio}
   */
  setKeepAspectRatio: (value: boolean) => Promise<ScreenItem>;

  /**
   * See: {@link #core/IItemLayout#setPositionLocked setPositionLocked}
   */
  setPositionLocked: (value: boolean) => Promise<ScreenItem>;

  /**
   * See: {@link #core/IItemLayout#setEnhancedResizeEnabled setEnhancedResizeEnabled}
   */
  setEnhancedResizeEnabled: (value: boolean) => Promise<ScreenItem>;

  /**
   * See: {@link #core/IItemLayout#setPosition setPosition}
   */
  setPosition: (value: Rectangle) => Promise<ScreenItem>;

  /**
   * See: {@link #core/IItemLayout#setRotateY setRotateY}
   */
  setRotateY: (value: number) => Promise<ScreenItem>;

  /**
   * See: {@link #core/IItemLayout#setRotateX setRotateX}
   */
  setRotateX: (value: number) => Promise<ScreenItem>;

  /**
   * See: {@link #core/IItemLayout#setRotateZ setRotateZ}
   */
  setRotateZ: (value: number) => Promise<ScreenItem>;

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
  setTransparency: (value: number) => Promise<ScreenItem>;

  /**
   * See: {@link #core/IItemColor#setBrightness setBrightness}
   */
  setBrightness: (value: number) => Promise<ScreenItem>;

  /**
   * See: {@link #core/IItemColor#setContrast setContrast}
   */
  setContrast: (value: number) => Promise<ScreenItem>;

  /**
   * See: {@link #core/IItemColor#setHue setHue}
   */
  setHue: (value: number) => Promise<ScreenItem>;

  /**
   * See: {@link #core/IItemColor#setSaturation setSaturation}
   */
  setSaturation: (value: number) => Promise<ScreenItem>;

  /**
   * See: {@link #core/IItemColor#setBorderColor setBorderColor}
   */
  setBorderColor: (value: Color) => Promise<ScreenItem>;

  /**
   * See: {@link #core/IItemColor#setFullDynamicColorRange setFullDynamicColorRange}
   */
  setFullDynamicColorRange: (value: boolean) => Promise<ScreenItem>;

  // ItemChroma

  /**
   * See: {@link #core/IItemChroma#isChromaEnabled isChromaEnabled}
   */
  isChromaEnabled: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemChroma#setChromaEnabled setChromaEnabled}
   */
  setChromaEnabled: (value: boolean) => Promise<ScreenItem>;

  /**
   * See: {@link #core/IItemChroma#getKeyingType getKeyingType}
   */
  getKeyingType: () => Promise<KeyingType>;

  /**
   * See: {@link #core/IItemChroma#setKeyingType setKeyingType}
   */
  setKeyingType: (value: KeyingType) => Promise<ScreenItem>;

  // BOTH CHROMA LEGACY AND CHROMA RGB

  /**
   * See: {@link #core/IItemChroma#getChromaAntiAliasLevel getChromaAntiAliasLevel}
   */
  getChromaAntiAliasLevel: () => Promise<ChromaAntiAliasLevel>;

  /**
   * See: {@link #core/IItemChroma#setChromaAntiAliasLevel setChromaAntiAliasLevel}
   */
  setChromaAntiAliasLevel: (value: ChromaAntiAliasLevel) => Promise<ScreenItem>;

  // CHROMA LEGACY MODE

  /**
   * See: {@link #core/IItemChroma#getChromaLegacyBrightness getChromaLegacyBrightness}
   */
  getChromaLegacyBrightness: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaLegacyBrightness setChromaLegacyBrightness}
   */
  setChromaLegacyBrightness: (value: number) => Promise<ScreenItem>;

  /**
   * See: {@link #core/IItemChroma#getChromaLegacySaturation getChromaLegacySaturation}
   */
  getChromaLegacySaturation: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaLegacySaturation setChromaLegacySaturation}
   */
  setChromaLegacySaturation: (value: number) => Promise<ScreenItem>;

  /**
   * See: {@link #core/IItemChroma#getChromaLegacyHue getChromaLegacyHue}
   */
  getChromaLegacyHue: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaLegacyHue setChromaLegacyHue}
   */
  setChromaLegacyHue: (value: number) => Promise<ScreenItem>;

  /**
   * See: {@link #core/IItemChroma#getChromaLegacyThreshold getChromaLegacyThreshold}
   */
  getChromaLegacyThreshold: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaLegacyThreshold setChromaLegacyThreshold}
   */
  setChromaLegacyThreshold: (value: number) => Promise<ScreenItem>;

  /**
   * See: {@link #core/IItemChroma#getChromaLegacyAlphaSmoothing getChromaLegacyAlphaSmoothing}
   */
  getChromaLegacyAlphaSmoothing: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaLegacyAlphaSmoothing setChromaLegacyAlphaSmoothing}
   */
  setChromaLegacyAlphaSmoothing: (value: number) => Promise<ScreenItem>;

  // CHROMA KEY RGB MODE

  /**
   * See: {@link #core/IItemChroma#getChromaRGBKeyPrimaryColor getChromaRGBKeyPrimaryColor}
   */
  getChromaRGBKeyPrimaryColor: () => Promise<ChromaPrimaryColors>;

  /**
   * See: {@link #core/IItemChroma#setChromaRGBKeyPrimaryColor setChromaRGBKeyPrimaryColor}
   */
  setChromaRGBKeyPrimaryColor: (value: ChromaPrimaryColors) => Promise<ScreenItem>;

  /**
   * See: {@link #core/IItemChroma#getChromaRGBKeyThreshold getChromaRGBKeyThreshold}
   */
  getChromaRGBKeyThreshold: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaRGBKeyThreshold setChromaRGBKeyThreshold}
   */
  setChromaRGBKeyThreshold: (value: number) => Promise<ScreenItem>;

  /**
   * See: {@link #core/IItemChroma#getChromaRGBKeyExposure getChromaRGBKeyExposure}
   */
  getChromaRGBKeyExposure: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaRGBKeyExposure setChromaRGBKeyExposure}
   */
  setChromaRGBKeyExposure: (value: number) => Promise<ScreenItem>;

  // COLOR KEY MODE

  /**
   * See: {@link #core/IItemChroma#getChromaColorKeyThreshold getChromaColorKeyThreshold}
   */
  getChromaColorKeyThreshold: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaColorKeyThreshold setChromaColorKeyThreshold}
   */
  setChromaColorKeyThreshold: (value: number) => Promise<ScreenItem>;

  /**
   * See: {@link #core/IItemChroma#getChromaColorKeyExposure getChromaColorKeyExposure}
   */
  getChromaColorKeyExposure: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaColorKeyExposure setChromaColorKeyExposure}
   */
  setChromaColorKeyExposure: (value: number) => Promise<ScreenItem>;

  /**
   * See: {@link #core/IItemChroma#getChromaColorKeyColor getChromaColorKeyColor}
   */
  getChromaColorKeyColor: () => Promise<Color>;

  /**
   * See: {@link #core/IItemChroma#setChromaColorKeyColor setChromaColorKeyColor}
   */
  setChromaColorKeyColor: (value: Color) => Promise<ScreenItem>;

  // ItemTransition

  /**
   * See: {@link #core/IItemTransition#isVisible isVisible}
   */
  isVisible: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemTransition#setVisible setVisible}
   */
  setVisible: (value: boolean) => Promise<ScreenItem>;

  /**
   * See: {@link #core/IItemTransition#getTransition getTransition}
   */
  getTransition: () => Promise<Transition>;

  /**
   * See: {@link #core/IItemTransition#setTransition setTransition}
   */
  setTransition: (value: Transition) => Promise<ScreenItem>;

  /**
   * See: {@link #core/IItemTransition#getTransitionTime getTransitionTime}
   */
  getTransitionTime: () => Promise<number>;

  /**
   * See: {@link #core/IItemTransition#setTransitionTime setTransitionTime}
   */
  setTransitionTime: (value: number) => Promise<ScreenItem>;

  // ItemEffect

  /** See: {@link #core/IItemEffect#getMaskEffect getMaskEffect} */
  getMaskEffect: () => Promise<MaskEffect>;

  /** See: {@link #core/IItemEffect#setMaskEffect setMaskEffect} */
  setMaskEffect: (value: MaskEffect) => Promise<ScreenItem>;

  /** See: {@link #core/IItemEffect#getBorderEffectRadius getBorderEffectRadius} */
  getBorderEffectRadius: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setBorderEffectRadius setBorderEffectRadius} */
  setBorderEffectRadius: (value: number) => Promise<ScreenItem>;

  /** See: {@link #core/IItemEffect#getBorderEffectThickness getBorderEffectThickness} */
  getBorderEffectThickness: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setBorderEffectThickness setBorderEffectThickness} */
  setBorderEffectThickness: (value: number) => Promise<ScreenItem>;

  /** See: {@link #core/IItemEffect#getBorderEffectOpacity getBorderEffectOpacity} */
  getBorderEffectOpacity: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setBorderEffectOpacity setBorderEffectOpacity} */
  setBorderEffectOpacity: (value: number) => Promise<ScreenItem>;

  /** See: {@link #core/IItemEffect#getBorderEffectColor getBorderEffectColor} */
  getBorderEffectColor: () => Promise<Color>;

  /** See: {@link #core/IItemEffect#setBorderEffectColor setBorderEffectColor} */
  setBorderEffectColor: (value: Color) => Promise<ScreenItem>;

   /** See: {@link #core/IItemEffect#getShadowEffectColor getShadowEffectColor} */
  getShadowEffectColor: () => Promise<Color>;

  /** See: {@link #core/IItemEffect#setShadowEffectColor setShadowEffectColor} */
  setShadowEffectColor: (value: Color) => Promise<ScreenItem>;

  /** See: {@link #core/IItemEffect#getShadowEffectThickness getShadowEffectThickness} */
  getShadowEffectThickness: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setShadowEffectThickness setShadowEffectThickness} */
  setShadowEffectThickness: (value: number) => Promise<ScreenItem>;

  /** See: {@link #core/IItemEffect#getShadowEffectBlur getShadowEffectBlur} */
  getShadowEffectBlur: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setShadowEffectBlur setShadowEffectBlur} */
  setShadowEffectBlur: (value: number) => Promise<ScreenItem>;

  /** See: {@link #core/IItemEffect#getShadowEffectOpacity getShadowEffectOpacity} */
  getShadowEffectOpacity: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setShadowEffectOpacity setShadowEffectOpacity} */
  setShadowEffectOpacity: (value: number) => Promise<ScreenItem>;

  /** See: {@link #core/IItemEffect#getShadowEffectOffsetX getShadowEffectOffsetX} */
  getShadowEffectOffsetX: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setShadowEffectOffsetX setShadowEffectOffsetX} */
  setShadowEffectOffsetX: (value: number) => Promise<ScreenItem>;

  /** See: {@link #core/IItemEffect#getShadowEffectOffsetY getShadowEffectOffsetY} */
  getShadowEffectOffsetY: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setShadowEffectOffsetY setShadowEffectOffsetY} */
  setShadowEffectOffsetY: (value: number) => Promise<ScreenItem>;

  /** See: {@link #core/IItemEffect#getFileMask getFileMask} */
  getFileMask: () => Promise<string>;

  /** See: {@link #core/IItemEffect#setFileMask setFileMask} */
  setFileMask: (value: string) => Promise<ScreenItem>;

  /** See: {@link #core/IItemEffect#isFileMaskingGuideVisible isFileMaskingGuideVisible} */
  isFileMaskingGuideVisible: () => Promise<boolean>;

  /** See: {@link #core/IItemEffect#showFileMaskingGuide showFileMaskingGuide} */
  showFileMaskingGuide: (value: boolean) => Promise<ScreenItem>;

  /** See: {@link #core/IItemEffect#getFilter getFilter} */
  getFilter: () => Promise<Filter>;

  /** See: {@link #core/IItemEffect#setFilter setFilter} */
  setFilter: (value: any, config?: {
    intensity ?: number,
    resourceFile ?: string
  }) => Promise<ScreenItem>;

  /** See: {@link #core/IItemEffect#removeFilter removeFilter} */
  removeFilter: () => Promise<ScreenItem>;

  /** See: {@link #core/IItemEffect#getFilterConfig getFilterConfig} */
  getFilterConfig: () => Promise<Object>;
}

applyMixins(ScreenItem, [ItemLayout, ItemColor, ItemChroma, ItemTransition,
  ItemEffect, iSourceScreen]);
