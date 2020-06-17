/// <reference path="../../../defs/es6-promise.d.ts" />

import {exec} from '../../internal/internal';
import {applyMixins} from '../../internal/util/mixin';
import {Environment} from '../environment';
import {Item as iItem} from '../../internal/item';
import {App as iApp} from '../../internal/app';
import {ItemLayout, IItemLayout} from './ilayout';
import {ItemColor, IItemColor} from './icolor';
import {ItemChroma, IItemChroma, KeyingType, ChromaPrimaryColors,
  ChromaAntiAliasLevel} from './ichroma';
import {ItemEffect, IItemEffect, MaskEffect} from './ieffects';
import {ItemTransition, IItemTransition} from './itransition';
import {SourceConfigurable, ISourceConfigurable} from '../source/iconfig';
import {IAudio, Audio} from '../source/iaudio';
import {Item} from './item';
import {Source} from '../source/source'
import {Scene} from '../scene';
import {Transition} from '../transition';
import {Filter} from '../filter';
import {Rectangle} from '../../util/rectangle';
import {Color} from '../../util/color';
import {iSourceHtml, ISourceHtml} from '../source/ihtml'

/**
 * The HtmlItem class represents a web page item. This covers both item
 * plugins and non-plugin URLs.
 *
 * Inherits from: {@link #core/Item Core/Item}
 *
 * Implements: {@link #core/IItemChroma Core/IItemChroma},
 * {@link #core/IItemColor Core/IItemColor},
 * {@link #core/IItemLayout Core/IItemLayout},
 * {@link #core/IItemTransition Core/IItemTransition},
 * {@link #core/IAudio Core/IAudio},
 * {@link #core/ISourceConfigurable Core/ISourceConfigurable}
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 *
 * XJS.Scene.getActiveScene().then(function(scene) {
 *   scene.getItems().then(function(items) {
 *     for (var i in items) {
 *       if (items[i] instanceof XJS.HtmlItem) {
 *         // Manipulate your HTML item here
 *         items[i].enableBrowserTransparency(true);
 *       }
 *     }
 *   });
 * });
 * ```
 *
 *  All methods marked as *Chainable* resolve with the original `HtmlItem`
 * instance. Also, any audio setting, i.e. volume, mute, stream only
 * may not be properly reflected in the item unless native browser audio support
 * is enabled. (Tools menu > General Settings > Advanced tab)
 */
export class HtmlItem extends Item implements IItemLayout, IItemColor,
  IItemChroma, IItemTransition, ISourceConfigurable, IAudio, IItemEffect,
  ISourceHtml {

  //iSourceHtml
  /**
   * See: {@link #core/ISourceHtml#call call}
   */
  call: () => Promise<HtmlItem>

  /**
   * See: {@link #core/ISourceHtml#getURL getURL}
   */
  getURL: () => Promise<string>

  /**
   * See: {@link #core/ISourceHtml#setURL setURL}
   */
  setURL: () => Promise<HtmlItem>

  /**
   * See: {@link #core/ISourceHtml#isBrowserTransparent isBrowserTransparent}
   */
  isBrowserTransparent: () => Promise<boolean>

  /**
   * See: {@link #core/ISourceHtml#enableBrowserTransparency enableBrowserTransparency}
   */
  enableBrowserTransparency: (value: boolean) => Promise<HtmlItem>

  /**
   * See: {@link #core/ISourceHtml#isBrowser60FPS isBrowser60FPS}
   */
  isBrowser60FPS: () => Promise<boolean>

  /**
   * See: {@link #core/ISourceHtml#enableBrowser60FPS enableBrowser60FPS}
   */
  enableBrowser60FPS: (value: boolean) => Promise<HtmlItem>

  /**
   * See: {@link #core/ISourceHtml#getBrowserCustomSize getBrowserCustomSize}
   */
  getBrowserCustomSize: () => Promise<Rectangle>

  /**
   * See: {@link #core/ISourceHtml#setBrowserCustomSize setBrowserCustomSize}
   */
  setBrowserCustomSize: (value: Rectangle) => Promise<HtmlItem>

  /**
   * See: {@link #core/ISourceHtml#getAllowRightClick getAllowRightClick}
   */
  getAllowRightClick: () => Promise<boolean>

  /**
   * See: {@link #core/ISourceHtml#setAllowRightClick setAllowRightClick}
   */
  setAllowRightClick: (value: boolean) => Promise<HtmlItem>

  /**
   * See: {@link #core/ISourceHtml#getBrowserJS getBrowserJS}
   */
  getBrowserJS: () => Promise<string>

  /**
   * See: {@link #core/ISourceHtml#setBrowserJS setBrowserJS}
   */
  setBrowserJS: () => Promise<HtmlItem>

  /**
   * See: {@link #core/ISourceHtml#isBrowserJSEnabled isBrowserJSEnabled}
   */
  isBrowserJSEnabled: () => Promise<boolean>

  /**
   * See: {@link #core/ISourceHtml#enableBrowserJS enableBrowserJS}
   */
  enableBrowserJS: (value: boolean) => Promise<HtmlItem>

  /**
   * See: {@link #core/ISourceHtml#getCustomCSS getCustomCSS}
   */
  getCustomCSS: () => Promise<string>

  /**
   * See: {@link #core/ISourceHtml#setCustomCSS setCustomCSS}
   */
  setCustomCSS: (value: string) => Promise<HtmlItem>

  /**
   * See: {@link #core/ISourceHtml#isCustomCSSEnabled isCustomCSSEnabled}
   */
  isCustomCSSEnabled: () => Promise<boolean>

  /**
   * See: {@link #core/ISourceHtml#enableCustomCSS enableCustomCSS}
   */
  enableCustomCSS: (value: boolean) => Promise<HtmlItem>

  /**
   * See: {@link #core/ISourceHtml#isBrowserOptimized isBrowserOptimized}
   */
  isBrowserOptimized: () => Promise<boolean>
  
  /**
   * See: {@link #core/ISourceHtml#getBrowserLoadStatus getBrowserLoadStatus}
   */
  getBrowserLoadStatus: () => Promise<string>

  /**
   * See: {@link #core/ISourceHtml#isReloadOnShowEnabled isReloadOnShowEnabled}
   */
  isReloadOnShowEnabled: () => Promise<boolean>

  /**
   * See: {@link #core/ISourceHtml#enableReloadOnShow enableReloadOnShow}
   */
  enableReloadOnShow: (value: boolean) => Promise<HtmlItem>

  /**
   * See: {@link #core/ISourceHtml#isReloadOnSceneEnter isReloadOnSceneEnter}
   */
  isReloadOnSceneEnter: () => Promise<boolean>

  /**
   * See: {@link #core/ISourceHtml#enableReloadOnSceneEnter enableReloadOnSceneEnter}
   */
  enableReloadOnSceneEnter: (value: boolean) => Promise<HtmlItem>

  // ItemLayout

  /**
   * See: {@link #core/IItemLayout#bringForward bringForward}
   */
  bringForward: () => Promise<HtmlItem>;

  /**
   * See: {@link #core/IItemLayout#bringToFront bringToFront}
   */
  bringToFront: () => Promise<HtmlItem>;

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
  sendBackward: () => Promise<HtmlItem>;  

  /**
   * See: {@link #core/IItemLayout#sendToBack sendToBack}
   */
  sendToBack: () => Promise<HtmlItem>; 

  /**
   * See: {@link #core/IItemLayout#setCanvasRotate setCanvasRotate}
   */
  setCanvasRotate: (value: number) => Promise<HtmlItem>;

  /**
   * See: {@link #core/IItemLayout#setCropping setCropping}
   */
  setCropping: (value: Object) => Promise<HtmlItem>;

  /**
   * See: {@link #core/IItemLayout#setCroppingEnhanced setCroppingEnhanced}
   */
  setCroppingEnhanced: (value: Object) => Promise<HtmlItem>;

  /**
   * See: {@link #core/IItemLayout#setEnhancedRotate setEnhancedRotate}
   */
  setEnhancedRotate: (value: number) => Promise<HtmlItem>;

  /**
   * See: {@link #core/IItemLayout#setKeepAspectRatio setKeepAspectRatio}
   */
  setKeepAspectRatio: (value: boolean) => Promise<HtmlItem>;

  /**
   * See: {@link #core/IItemLayout#setPositionLocked setPositionLocked}
   */
  setPositionLocked: (value: boolean) => Promise<HtmlItem>;

  /**
   * See: {@link #core/IItemLayout#setEnhancedResizeEnabled setEnhancedResizeEnabled}
   */
  setEnhancedResizeEnabled: (value: boolean) => Promise<HtmlItem>;

  /**
   * See: {@link #core/IItemLayout#setPosition setPosition}
   */
  setPosition: (value: Rectangle) => Promise<HtmlItem>;

  /**
   * See: {@link #core/IItemLayout#setRotateY setRotateY}
   */
  setRotateY: (value: number) => Promise<HtmlItem>;

  /**
   * See: {@link #core/IItemLayout#setRotateX setRotateX}
   */
  setRotateX: (value: number) => Promise<HtmlItem>;

  /**
   * See: {@link #core/IItemLayout#setRotateZ setRotateZ}
   */
  setRotateZ: (value: number) => Promise<HtmlItem>;

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
  setTransparency: (value: number) => Promise<HtmlItem>;

  /**
   * See: {@link #core/IItemColor#setBrightness setBrightness}
   */
  setBrightness: (value: number) => Promise<HtmlItem>;

  /**
   * See: {@link #core/IItemColor#setContrast setContrast}
   */
  setContrast: (value: number) => Promise<HtmlItem>;

  /**
   * See: {@link #core/IItemColor#setHue setHue}
   */
  setHue: (value: number) => Promise<HtmlItem>;

  /**
   * See: {@link #core/IItemColor#setSaturation setSaturation}
   */
  setSaturation: (value: number) => Promise<HtmlItem>;

  /**
   * See: {@link #core/IItemColor#setBorderColor setBorderColor}
   */
  setBorderColor: (value: Color) => Promise<HtmlItem>;

  /**
   * See: {@link #core/IItemColor#setFullDynamicColorRange setFullDynamicColorRange}
   */
  setFullDynamicColorRange: (value: boolean) => Promise<HtmlItem>;

  // ItemChroma

  /**
   * See: {@link #core/IItemChroma#isChromaEnabled isChromaEnabled}
   */
  isChromaEnabled: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemChroma#setChromaEnabled setChromaEnabled}
   */
  setChromaEnabled: (value: boolean) => Promise<HtmlItem>;

  /**
   * See: {@link #core/IItemChroma#getKeyingType getKeyingType}
   */
  getKeyingType: () => Promise<KeyingType>;

  /**
   * See: {@link #core/IItemChroma#setKeyingType setKeyingType}
   */
  setKeyingType: (value: KeyingType) => Promise<HtmlItem>;

  // BOTH CHROMA LEGACY AND CHROMA RGB

  /**
   * See: {@link #core/IItemChroma#getChromaAntiAliasLevel getChromaAntiAliasLevel}
   */
  getChromaAntiAliasLevel: () => Promise<ChromaAntiAliasLevel>;

  /**
   * See: {@link #core/IItemChroma#setChromaAntiAliasLevel setChromaAntiAliasLevel}
   */
  setChromaAntiAliasLevel: (value: ChromaAntiAliasLevel) => Promise<HtmlItem>;

  // CHROMA LEGACY MODE

  /**
   * See: {@link #core/IItemChroma#getChromaLegacyBrightness getChromaLegacyBrightness}
   */
  getChromaLegacyBrightness: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaLegacyBrightness setChromaLegacyBrightness}
   */
  setChromaLegacyBrightness: (value: number) => Promise<HtmlItem>;

  /**
   * See: {@link #core/IItemChroma#getChromaLegacySaturation getChromaLegacySaturation}
   */
  getChromaLegacySaturation: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaLegacySaturation setChromaLegacySaturation}
   */
  setChromaLegacySaturation: (value: number) => Promise<HtmlItem>;

  /**
   * See: {@link #core/IItemChroma#getChromaLegacyHue getChromaLegacyHue}
   */
  getChromaLegacyHue: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaLegacyHue setChromaLegacyHue}
   */
  setChromaLegacyHue: (value: number) => Promise<HtmlItem>;

  /**
   * See: {@link #core/IItemChroma#getChromaLegacyThreshold getChromaLegacyThreshold}
   */
  getChromaLegacyThreshold: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaLegacyThreshold setChromaLegacyThreshold}
   */
  setChromaLegacyThreshold: (value: number) => Promise<HtmlItem>;

  /**
   * See: {@link #core/IItemChroma#getChromaLegacyAlphaSmoothing getChromaLegacyAlphaSmoothing}
   */
  getChromaLegacyAlphaSmoothing: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaLegacyAlphaSmoothing setChromaLegacyAlphaSmoothing}
   */
  setChromaLegacyAlphaSmoothing: (value: number) => Promise<HtmlItem>;

  // CHROMA KEY RGB MODE

  /**
   * See: {@link #core/IItemChroma#getChromaRGBKeyPrimaryColor getChromaRGBKeyPrimaryColor}
   */
  getChromaRGBKeyPrimaryColor: () => Promise<ChromaPrimaryColors>;

  /**
   * See: {@link #core/IItemChroma#setChromaRGBKeyPrimaryColor setChromaRGBKeyPrimaryColor}
   */
  setChromaRGBKeyPrimaryColor: (value: ChromaPrimaryColors) => Promise<HtmlItem>;

  /**
   * See: {@link #core/IItemChroma#getChromaRGBKeyThreshold getChromaRGBKeyThreshold}
   */
  getChromaRGBKeyThreshold: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaRGBKeyThreshold setChromaRGBKeyThreshold}
   */
  setChromaRGBKeyThreshold: (value: number) => Promise<HtmlItem>;

  /**
   * See: {@link #core/IItemChroma#getChromaRGBKeyExposure getChromaRGBKeyExposure}
   */
  getChromaRGBKeyExposure: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaRGBKeyExposure setChromaRGBKeyExposure}
   */
  setChromaRGBKeyExposure: (value: number) => Promise<HtmlItem>;

  // COLOR KEY MODE

  /**
   * See: {@link #core/IItemChroma#getChromaColorKeyThreshold getChromaColorKeyThreshold}
   */
  getChromaColorKeyThreshold: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaColorKeyThreshold setChromaColorKeyThreshold}
   */
  setChromaColorKeyThreshold: (value: number) => Promise<HtmlItem>;

  /**
   * See: {@link #core/IItemChroma#getChromaColorKeyExposure getChromaColorKeyExposure}
   */
  getChromaColorKeyExposure: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaColorKeyExposure setChromaColorKeyExposure}
   */
  setChromaColorKeyExposure: (value: number) => Promise<HtmlItem>;

  /**
   * See: {@link #core/IItemChroma#getChromaColorKeyColor getChromaColorKeyColor}
   */
  getChromaColorKeyColor: () => Promise<Color>;

  /**
   * See: {@link #core/IItemChroma#setChromaColorKeyColor setChromaColorKeyColor}
   */
  setChromaColorKeyColor: (value: Color) => Promise<HtmlItem>;

  // ItemTransition

  /**
   * See: {@link #core/IItemTransition#isVisible isVisible}
   */
  isVisible: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemTransition#setVisible setVisible}
   */
  setVisible: (value: boolean) => Promise<HtmlItem>;

  /**
   * See: {@link #core/IItemTransition#getTransition getTransition}
   */
  getTransition: () => Promise<Transition>;

  /**
   * See: {@link #core/IItemTransition#setTransition setTransition}
   */
  setTransition: (value: Transition) => Promise<HtmlItem>;

  /**
   * See: {@link #core/IItemTransition#getTransitionTime getTransitionTime}
   */
  getTransitionTime: () => Promise<number>;

  /**
   * See: {@link #core/IItemTransition#setTransitionTime setTransitionTime}
   */
  setTransitionTime: (value: number) => Promise<HtmlItem>;

  // SourceConfigurable

  /**
   * See: {@link #core/ISourceConfigurable#loadConfig loadConfig}
   */
  loadConfig: () => Promise<any>;

  /**
   * See: {@link #core/ISourceConfigurable#saveConfig saveConfig}
   */
  saveConfig: (configObj: any) => Promise<HtmlItem>;

  /**
   * See: {@link #core/ISourceConfigurable#requestSaveConfig requestSaveConfig}
   */
  requestSaveConfig: (configObj: any) => Promise<HtmlItem>;

  /**
   * See: {@link #core/ISourceConfigurable#applyConfig applyConfig}
   */
  applyConfig: (configObj: any) => Promise<HtmlItem>;

  // ItemAudio

  /** See: {@link #core/IAudio#getVolume getVolume} */
  getVolume: () => Promise<number>;

  /** See: {@link #core/IAudio#isMute isMute} */
  isMute: () => Promise<boolean>;

  /** See: {@link #core/IAudio#isAutoMute isAutoMute} */
  isAutoMute: () => Promise<boolean>;

  /** See: {@link #core/IAudio#setVolume setVolume} */
  setVolume: (value: number) => Promise<HtmlItem>;

  /** See: {@link #core/IAudio#setMute setMute} */
  setMute: (value: boolean) => Promise<HtmlItem>;

  /** See: {@link #core/IAudio#setAutoMute setAutoMute} */
  setAutoMute: (value: boolean) => Promise<HtmlItem>;

  /** See: {@link #core/IAudio#isStreamOnlyAudio isStreamOnlyAudio} */
  isStreamOnlyAudio: () => Promise<boolean>;

  /** See: {@link #core/IAudio#setStreamOnlyAudio setStreamOnlyAudio} */
  setStreamOnlyAudio: (value: boolean) => Promise<HtmlItem>;

  /** See: {@link #core/IAudio#isAudioAvailable isAudioAvailable} */
  isAudioAvailable: () => Promise<boolean>;

  // ItemEffect

  /** See: {@link #core/IItemEffect#getMaskEffect getMaskEffect} */
  getMaskEffect: () => Promise<MaskEffect>;

  /** See: {@link #core/IItemEffect#setMaskEffect setMaskEffect} */
  setMaskEffect: (value: MaskEffect) => Promise<HtmlItem>;

  /** See: {@link #core/IItemEffect#getBorderEffectRadius getBorderEffectRadius} */
  getBorderEffectRadius: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setBorderEffectRadius setBorderEffectRadius} */
  setBorderEffectRadius: (value: number) => Promise<HtmlItem>;

  /** See: {@link #core/IItemEffect#getBorderEffectThickness getBorderEffectThickness} */
  getBorderEffectThickness: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setBorderEffectThickness setBorderEffectThickness} */
  setBorderEffectThickness: (value: number) => Promise<HtmlItem>;

  /** See: {@link #core/IItemEffect#getBorderEffectOpacity getBorderEffectOpacity} */
  getBorderEffectOpacity: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setBorderEffectOpacity setBorderEffectOpacity} */
  setBorderEffectOpacity: (value: number) => Promise<HtmlItem>;

  /** See: {@link #core/IItemEffect#getBorderEffectColor getBorderEffectColor} */
  getBorderEffectColor: () => Promise<Color>;

  /** See: {@link #core/IItemEffect#setBorderEffectColor setBorderEffectColor} */
  setBorderEffectColor: (value: Color) => Promise<HtmlItem>;

  /** See: {@link #core/IItemEffect#getShadowEffectColor getShadowEffectColor} */
  getShadowEffectColor: () => Promise<Color>;

  /** See: {@link #core/IItemEffect#setShadowEffectColor setShadowEffectColor} */
  setShadowEffectColor: (value: Color) => Promise<HtmlItem>;

  /** See: {@link #core/IItemEffect#getShadowEffectThickness getShadowEffectThickness} */
  getShadowEffectThickness: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setShadowEffectThickness setShadowEffectThickness} */
  setShadowEffectThickness: (value: number) => Promise<HtmlItem>;

  /** See: {@link #core/IItemEffect#getShadowEffectBlur getShadowEffectBlur} */
  getShadowEffectBlur: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setShadowEffectBlur setShadowEffectBlur} */
  setShadowEffectBlur: (value: number) => Promise<HtmlItem>;

  /** See: {@link #core/IItemEffect#getShadowEffectOpacity getShadowEffectOpacity} */
  getShadowEffectOpacity: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setShadowEffectOpacity setShadowEffectOpacity} */
  setShadowEffectOpacity: (value: number) => Promise<HtmlItem>;

  /** See: {@link #core/IItemEffect#getShadowEffectOffsetX getShadowEffectOffsetX} */
  getShadowEffectOffsetX: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setShadowEffectOffsetX setShadowEffectOffsetX} */
  setShadowEffectOffsetX: (value: number) => Promise<HtmlItem>;

  /** See: {@link #core/IItemEffect#getShadowEffectOffsetY getShadowEffectOffsetY} */
  getShadowEffectOffsetY: () => Promise<number>;

  /** See: {@link #core/IItemEffect#setShadowEffectOffsetY setShadowEffectOffsetY} */
  setShadowEffectOffsetY: (value: number) => Promise<HtmlItem>;

  /** See: {@link #core/IItemEffect#getFileMask getFileMask} */
  getFileMask: () => Promise<string>;

  /** See: {@link #core/IItemEffect#setFileMask setFileMask} */
  setFileMask: (value: string) => Promise<HtmlItem>;

  /** See: {@link #core/IItemEffect#isFileMaskingGuideVisible isFileMaskingGuideVisible} */
  isFileMaskingGuideVisible: () => Promise<boolean>;

  /** See: {@link #core/IItemEffect#showFileMaskingGuide showFileMaskingGuide} */
  showFileMaskingGuide: (value: boolean) => Promise<HtmlItem>;

  /** See: {@link #core/IItemEffect#getFilter getFilter} */
  getFilter: () => Promise<Filter>;

  /** See: {@link #core/IItemEffect#setFilter setFilter} */
  setFilter: (value: any, config?: {
    intensity ?: number,
    resourceFile ?: string
  }) => Promise<HtmlItem>;

  /** See: {@link #core/IItemEffect#removeFilter removeFilter} */
  removeFilter: () => Promise<HtmlItem>;

  /** See: {@link #core/IItemEffect#getFilterConfig getFilterConfig} */
  getFilterConfig: () => Promise<Object>;
}

applyMixins(HtmlItem, [iSourceHtml ,ItemLayout, ItemColor, ItemChroma, ItemTransition,
  SourceConfigurable, Audio, ItemEffect]);
