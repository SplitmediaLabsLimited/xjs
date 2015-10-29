/// <reference path="../../../defs/es6-promise.d.ts" />

import {exec} from '../../internal/internal';
import {applyMixins} from '../../internal/util/mixin';
import {Item as iItem} from '../../internal/item';
import {ItemLayout, IItemLayout} from './ilayout';
import {ItemColor, IItemColor} from './icolor';
import {ItemChroma, IItemChroma, KeyingType, ChromaPrimaryColors,
ChromaAntiAliasLevel} from './ichroma';
import {ItemTransition, IItemTransition} from './itransition';
import {ItemPlayback, IItemPlayback, ActionAfterPlayback} from './iplayback';
import {CuePoint} from './cuepoint';
import {Item} from './item';
import {Transition} from '../transition';
import {Rectangle} from '../../util/rectangle';
import {Color} from '../../util/color';
import {Environment} from '../environment';

/**
 * The MediaItem class represents a playable media file.
 *
 * Inherits from: {@link #core/Item Core/Item}
 *
 *  All methods marked as *Chainable* resolve with the original `MediaItem`
 *  instance.
 */
export class MediaItem extends Item implements IItemLayout, IItemColor,
  IItemChroma, IItemTransition, IItemPlayback {

  // ItemLayout

  /**
   * return: Promise<boolean>
   *
   * Check if Aspect Ratio is set to ON or OFF
   */
  isKeepAspectRatio: () => Promise<boolean>;

  /**
   * return: Promise<boolean>
   *
   * Check if Position Locked is set to ON or OFF
   */
  isPositionLocked: () => Promise<boolean>;

  /**
   * return: Promise<boolean>
   *
   * Check if Enhance Resize is Enabled or Disabled
   */
  isEnhancedResizeEnabled: () => Promise<boolean>;

  /**
   * return: Promise<Rectangle>
   *
   * Get the position of the item
   *
   * See also: {@link #util/Rectangle Util/Rectangle}
   */
  getPosition: () => Promise<Rectangle>;

  /**
   * return: Promise<number>
   *
   * Get Rotate Y value of the item
   */
  getRotateY: () => Promise<number>;

  /**
   * return: Promise<number>
   *
   * Get Rotate X value of the item
   */
  getRotateX: () => Promise<number>;

  /**
   * return: Promise<number>
   *
   * Get Rotate Z value of the item
   */
  getRotateZ: () => Promise<number>;

  /**
   * param: value<boolean>
   *
   * Set Aspect Ratio to ON or OFF
   *
   * *Chainable.*
   */
  setKeepAspectRatio: (value: boolean) => Promise<MediaItem>;

  /**
   * param: value<boolean>
   *
   * Set Position Lock to ON or OFF
   *
   * *Chainable.*
   */
  setPositionLocked: (value: boolean) => Promise<MediaItem>;

  /**
   * param: value<boolean>
   *
   * Set Enhance Resize to ON or OFF
   *
   * *Chainable.*
   */
  setEnhancedResizeEnabled: (value: boolean) => Promise<MediaItem>;

  /**
   * param: value<Rectangle>
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
  setPosition: (value: Rectangle) => Promise<MediaItem>;

  /**
   * param: value<number>
   *
   * Set Rotate Y value of the item
   *
   * *Chainable.*
   */
  setRotateY: (value: number) => Promise<MediaItem>;

  /**
   * param: value<number>
   *
   * Set Rotate X value of the item
   *
   * *Chainable.*
   */
  setRotateX: (value: number) => Promise<MediaItem>;

  /**
   * param: value<number>
   *
   * Set Rotate Z value of the item
   *
   * *Chainable.*
   */
  setRotateZ: (value: number) => Promise<MediaItem>;

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
  getBrightness: () => Promise<number>;

  /**
   * return: Promise<number>
   *
   * Get Item Contrast value
   */
  getContrast: () => Promise<number>;

  /**
   * return: Promise<number>
   *
   * Get Item Hue value
   */
  getHue: () => Promise<number>;

  /**
   * return: Promise<number>
   *
   * Get Item Saturation value
   */
  getSaturation: () => Promise<number>;

  /**
   * return: Promise<Color>
   *
   * Get Border Color
   */
  getBorderColor: () => Promise<Color>;

  /**
   * param: value<number>
   *
   * Set Item Transparency
   *
   * *Chainable.*
   */
  setTransparency: (value: number) => Promise<MediaItem>;

  /**
   * param: value<number>
   *
   * Set Item Brightness
   *
   * *Chainable.*
   */
  setBrightness: (value: number) => Promise<MediaItem>;

  /**
   * param: value<number>
   *
   * Set Item Contrast
   *
   * *Chainable.*
   */
  setContrast: (value: number) => Promise<MediaItem>;

  /**
   * param: value<number>
   *
   * Set Item Hue
   *
   * *Chainable.*
   */
  setHue: (value: number) => Promise<MediaItem>;

  /**
   * param: value<number>
   *
   * Set Item Saturation
   *
   * *Chainable.*
   */
  setSaturation: (value: number) => Promise<MediaItem>;

  /**
   * param: value<Color>
   *
   * Set Border Color
   *
   * *Chainable.*
   */
  setBorderColor: (value: Color) => Promise<MediaItem>;

  // ItemChroma
  /**
   * return: Promise<boolean>
   */
  isChromaEnabled: () => Promise<boolean>;
  /**
   * param: value<boolean>
   *
   * *Chainable.*
   */
  setChromaEnabled: (value: boolean) => Promise<MediaItem>;
  /**
   * return: Promise<KeyingType>
   */
  getKeyingType: () => Promise<KeyingType>;
  /**
   * param: value<KeyingType>
   * *Chainable.*
   *
   */
  setKeyingType: (value: KeyingType) => Promise<MediaItem>;

  // BOTH CHROMA LEGACY AND CHROMA RGB
  /**
   * return: Promise<ChromaAntiAliasLevel>
   */
  getChromaAntiAliasLevel: () => Promise<ChromaAntiAliasLevel>;
  /**
   * param: value<ChromaAntiAliasLevel>
   *
   * *Chainable.*
   */
  setChromaAntiAliasLevel: (value: ChromaAntiAliasLevel) => Promise<MediaItem>;

  // CHROMA LEGACY MODE
  /**
   * return: Promise<number>
   */
  getChromaLegacyBrightness: () => Promise<number>;
  /**
   * param: value<number>
   *
   * *Chainable.*
   */
  setChromaLegacyBrightness: (value: number) => Promise<MediaItem>;
  /**
   * return: Promise<number>
   */
  getChromaLegacySaturation: () => Promise<number>;
  /**
   * param: value<number>
   *
   * *Chainable.*
   */
  setChromaLegacySaturation: (value: number) => Promise<MediaItem>;
  /**
   * return: Promise<number>
   */
  getChromaLegacyHue: () => Promise<number>;
  /**
   * param: value<number>
   *
   * *Chainable.*
   */
  setChromaLegacyHue: (value: number) => Promise<MediaItem>;
  /**
   * return: Promise<number>
   */
  getChromaLegacyThreshold: () => Promise<number>;
  /**
   * param: value<number>
   *
   * *Chainable.*
   */
  setChromaLegacyThreshold: (value: number) => Promise<MediaItem>;
  /**
   * return: Promise<number>
   */
  getChromaLegacyAlphaSmoothing: () => Promise<number>;
  /**
   * param: value<number>
   *
   * *Chainable.*
   */
  setChromaLegacyAlphaSmoothing: (value: number) => Promise<MediaItem>;

  // CHROMA KEY RGB MODE
  /**
   * return: Promise<ChromaPrimaryColors>
   */
  getChromaRGBKeyPrimaryColor: () => Promise<ChromaPrimaryColors>;
  /**
   * param: value<ChromaPrimaryColors>
   *
   * *Chainable.*
   */
  setChromaRGBKeyPrimaryColor: (value: ChromaPrimaryColors) => Promise<MediaItem>;
  /**
   * return: Promise<number>
   */
  getChromaRGBKeyThreshold: () => Promise<number>;
  /**
   * param: value<number>
   *
   * *Chainable.*
   */
  setChromaRGBKeyThreshold: (value: number) => Promise<MediaItem>;
  /**
   * return: Promise<number>
   */
  getChromaRGBKeyExposure: () => Promise<number>;
  /**
   * param: value<number>
   *
   * *Chainable.*
   */
  setChromaRGBKeyExposure: (value: number) => Promise<MediaItem>;

  // COLOR KEY MODE
  /**
   * return: Promise<number>
   */
  getChromaColorKeyThreshold: () => Promise<number>;
  /**
   * param: value<number>
   *
   * *Chainable.*
   */
  setChromaColorKeyThreshold: (value: number) => Promise<MediaItem>;
  /**
   * return: Promise<number>
   */
  getChromaColorKeyExposure: () => Promise<number>;
  /**
   * param: value<number>
   *
   * *Chainable.*
   */
  setChromaColorKeyExposure: (value: number) => Promise<MediaItem>;
  /**
   * return: Promise<Color>
   */
  getChromaColorKeyColor: () => Promise<Color>;
  /**
   * param: value<Color>
   *
   * *Chainable.*
   */
  setChromaColorKeyColor: (value: Color) => Promise<MediaItem>;

  // ItemTransition

  /**
   * return: Promise<boolean>
   *
   * Check if item is visible on stage
   */
  isVisible: () => Promise<boolean>;

  /**
   * param: value<boolean>
   *
   * Set item to visible or hidden
   *
   * *Chainable.*
   */
  setVisible: (value: boolean) => Promise<MediaItem>;

  /**
   * return: Promise<boolean>
   *
   * Get item's transition type for when visibility is toggled
   */
  getTransition: () => Promise<Transition>;

  /**
   * param: value<Transition>
   *
   * Set item's transition type for when visibility is toggled
   *
   * *Chainable.*
   */
  setTransition: (value: Transition) => Promise<MediaItem>;

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
   *
   * *Chainable.*
   */
  setTransitionTime: (value: number) => Promise<MediaItem>;

  // ItemPlayback

  /**
   *  return: Promise<boolean>
   *
   *  Determines if it is possible to move the playback position of this media
   *  source. It is possible for some video formats to not allow seeking of the
   *  playback position.
   */
  isSeekable: () => Promise<boolean>;

  getPlaybackPosition: () => Promise<number>;
  setPlaybackPosition: (value: number) => Promise<MediaItem>;
  getPlaybackDuration: () => Promise<number>;
  isPlaying: () => Promise<boolean>;
  setPlaying: (value: boolean) => Promise<MediaItem>;
  getPlaybackStartPosition: () => Promise<number>;
  setPlaybackStartPosition: (value: number) => Promise<MediaItem>;
  getPlaybackEndPosition: () => Promise<number>;
  setPlaybackEndPosition: (value: number) => Promise<MediaItem>;
  getVolume: () => Promise<number>;
  setVolume: (value: number) => Promise<MediaItem>;
  isAudibleOnlyOnStream: () => Promise<boolean>;
  setAudibleOnlyOnStream: (value: boolean) => Promise<MediaItem>;
  getActionAfterPlayback: () => Promise<ActionAfterPlayback>;
  setActionAfterPlayback: (value: ActionAfterPlayback) => Promise<MediaItem>;
  isAutostartOnSceneLoad: () => Promise<boolean>;
  setAutostartOnSceneLoad: (value: boolean) => Promise<MediaItem>;
  isForceDeinterlace: () => Promise<boolean>;
  setForceDeinterlace: (value: boolean) => Promise<MediaItem>;
  isRememberingPlaybackPosition: () => Promise<boolean>;
  setRememberingPlaybackPosition: (value: boolean) => Promise<MediaItem>;
  isShowingPlaybackPosition: () => Promise<boolean>;
  setShowingPlaybackPosition: (value: boolean) => Promise<MediaItem>;
  getCuePoints: () => Promise<CuePoint[]>;
  setCuePoints: (value: CuePoint[]) => Promise<MediaItem>;

  // Inherited from base class, no need to redefine
  // getValue: () => Promise<string>;
  // setValue: (value: string) => Promise<MediaItem>;

  isAudio: () => Promise<boolean>;
  isVideo: () => Promise<boolean>;
}

applyMixins(MediaItem, [ItemLayout, ItemColor, ItemChroma,
  ItemTransition, ItemPlayback]);
