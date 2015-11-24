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
import {IItemAudio, ItemAudio} from './iaudio';
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
  IItemChroma, IItemTransition, IItemPlayback, IItemAudio {

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
   * param: (value: boolean)
   *
   * Set Aspect Ratio to ON or OFF
   *
   * *Chainable.*
   */
  setKeepAspectRatio: (value: boolean) => Promise<MediaItem>;

  /**
   * param: (value: boolean)
   *
   * Set Position Lock to ON or OFF
   *
   * *Chainable.*
   */
  setPositionLocked: (value: boolean) => Promise<MediaItem>;

  /**
   * param: (value: boolean)
   *
   * Set Enhance Resize to ON or OFF
   *
   * *Chainable.*
   */
  setEnhancedResizeEnabled: (value: boolean) => Promise<MediaItem>;

  /**
   * param: (value: Rectangle)
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
   * param: (value: number)
   *
   * Set Rotate Y value of the item
   *
   * *Chainable.*
   */
  setRotateY: (value: number) => Promise<MediaItem>;

  /**
   * param: (value: number)
   *
   * Set Rotate X value of the item
   *
   * *Chainable.*
   */
  setRotateX: (value: number) => Promise<MediaItem>;

  /**
   * param: (value: number)
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
   * param: (value: number)
   *
   * Set Item Transparency
   *
   * *Chainable.*
   */
  setTransparency: (value: number) => Promise<MediaItem>;

  /**
   * param: (value: number)
   *
   * Set Item Brightness
   *
   * *Chainable.*
   */
  setBrightness: (value: number) => Promise<MediaItem>;

  /**
   * param: (value: number)
   *
   * Set Item Contrast
   *
   * *Chainable.*
   */
  setContrast: (value: number) => Promise<MediaItem>;

  /**
   * param: (value: number)
   *
   * Set Item Hue
   *
   * *Chainable.*
   */
  setHue: (value: number) => Promise<MediaItem>;

  /**
   * param: (value: number)
   *
   * Set Item Saturation
   *
   * *Chainable.*
   */
  setSaturation: (value: number) => Promise<MediaItem>;

  /**
   * param: (value: Color)
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
   * param: (value: boolean)
   *
   * *Chainable.*
   */
  setChromaEnabled: (value: boolean) => Promise<MediaItem>;
  /**
   * return: Promise<KeyingType>
   */
  getKeyingType: () => Promise<KeyingType>;
  /**
   * param: (value: KeyingType)
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
   * param: (value: ChromaAntiAliasLevel)
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
   * param: (value: number)
   *
   * *Chainable.*
   */
  setChromaLegacyBrightness: (value: number) => Promise<MediaItem>;
  /**
   * return: Promise<number>
   */
  getChromaLegacySaturation: () => Promise<number>;
  /**
   * param: (value: number)
   *
   * *Chainable.*
   */
  setChromaLegacySaturation: (value: number) => Promise<MediaItem>;
  /**
   * return: Promise<number>
   */
  getChromaLegacyHue: () => Promise<number>;
  /**
   * param: (value: number)
   *
   * *Chainable.*
   */
  setChromaLegacyHue: (value: number) => Promise<MediaItem>;
  /**
   * return: Promise<number>
   */
  getChromaLegacyThreshold: () => Promise<number>;
  /**
   * param: (value: number)
   *
   * *Chainable.*
   */
  setChromaLegacyThreshold: (value: number) => Promise<MediaItem>;
  /**
   * return: Promise<number>
   */
  getChromaLegacyAlphaSmoothing: () => Promise<number>;
  /**
   * param: (value: number)
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
   * param: (value: ChromaPrimaryColors)
   *
   * *Chainable.*
   */
  setChromaRGBKeyPrimaryColor: (value: ChromaPrimaryColors) => Promise<MediaItem>;
  /**
   * return: Promise<number>
   */
  getChromaRGBKeyThreshold: () => Promise<number>;
  /**
   * param: (value: number)
   *
   * *Chainable.*
   */
  setChromaRGBKeyThreshold: (value: number) => Promise<MediaItem>;
  /**
   * return: Promise<number>
   */
  getChromaRGBKeyExposure: () => Promise<number>;
  /**
   * param: (value: number)
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
   * param: (value: number)
   *
   * *Chainable.*
   */
  setChromaColorKeyThreshold: (value: number) => Promise<MediaItem>;
  /**
   * return: Promise<number>
   */
  getChromaColorKeyExposure: () => Promise<number>;
  /**
   * param: (value: number)
   *
   * *Chainable.*
   */
  setChromaColorKeyExposure: (value: number) => Promise<MediaItem>;
  /**
   * return: Promise<Color>
   */
  getChromaColorKeyColor: () => Promise<Color>;
  /**
   * param: (value: Color)
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
   * param: (value: boolean)
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
   * param: (value: Transition)
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
   * param: (value: number)
   *
   * Set item's transition time in milliseconds
   *
   * *Chainable.*
   */
  setTransitionTime: (value: number) => Promise<MediaItem>;

  // ItemPlayback

  /**
   * return: Promise<boolean>
   *
   * Determines if it is possible to move the playback position of this media
   * source. It is possible for some video formats to not allow seeking of the
   * playback position.
   */
  isSeekable: () => Promise<boolean>;

  /**
   * return: Promise<number>
   *
   * Gets the playback position of this item in seconds. The system can
   * store precision up to 100ns.
   */
  getPlaybackPosition: () => Promise<number>;

  /**
   * param: (value: number)
   *
   * Sets the playback position of this item. Parameter is in seconds, up to
   * a precision level of 100ns.
   *
   * *Chainable.*
   */
  setPlaybackPosition: (value: number) => Promise<MediaItem>;

  /**
   * return: Promise<number>
   *
   * Gets the total playback duration of this item in seconds. Precision is up
   * to 100ns units.
   */
  getPlaybackDuration: () => Promise<number>;

  /**
   * return: Promise<boolean>
   *
   * Checks if current item is playing.
   */
  isPlaying: () => Promise<boolean>;

  /**
   * param: (value: boolean)
   *
   * Plays (or pauses playback for) this item.
   *
   * *Chainable.*
   */
  setPlaying: (value: boolean) => Promise<MediaItem>;

  /**
   * return: Promise<number>
   *
   * Gets the specified start position in seconds for this item, with precision
   * up to 100ns. If this item loops or is set to rewind, the playback position
   * will return to the start position.
   */
  getPlaybackStartPosition: () => Promise<number>;

  /**
   * return: Promise<number>
   *
   * Sets the specified start position in seconds for this item, with precision
   * up to 100ns. If this item loops or is set to rewind, the playback position
   * will return to the start position.
   *
   * *Chainable.*
   */
  setPlaybackStartPosition: (value: number) => Promise<MediaItem>;

  /**
   * return: Promise<number>
   *
   * Gets the specified end position in seconds for this item, with precision
   * up to 100ns. If playback reaches the end position, this item will then
   * execute the specified action after playback (rewind, loop, etc.)
   */
  getPlaybackEndPosition: () => Promise<number>;

  /**
   * return: Promise<number>
   *
   * Sets the specified end position in seconds for this item, with precision
   * up to 100ns. If playback reaches the end position, this item will then
   * execute the specified action after playback (rewind, loop, etc.)
   *
   * *Chainable.*
   */
  setPlaybackEndPosition: (value: number) => Promise<MediaItem>;

  /**
   * return: Promise<ActionAfterPlayback>
   *
   * Gets the specified action after playback for this item is done (either
   * playback reaches the end of the video, or the specified playback end
   * position.)
   *
   * See also: {@link #core/ActionAfterPlayback Core/ActionAfterPlayback}
   */
  getActionAfterPlayback: () => Promise<ActionAfterPlayback>;

  /**
   * param: (value: ActionAfterPlayback)
   *
   * Sets the action to be executed on this item once playback is done (either
   * playback reaches the end of the video, or the specified playback end
   * position.)
   *
   * *Chainable.*
   *
   * See also: {@link #core/ActionAfterPlayback Core/ActionAfterPlayback}
   */
  setActionAfterPlayback: (value: ActionAfterPlayback) => Promise<MediaItem>;

  /**
   * return: Promise<boolean>
   *
   * Checks whether this item is set to start playback when the application
   * switches to this item's scene.
   */
  isAutostartOnSceneLoad: () => Promise<boolean>;

  /**
   * param: (value: boolean)
   *
   * Specifies whether this item is set to start playback when the application
   * switches to this item's scene.
   *
   * *Chainable.*
   */
  setAutostartOnSceneLoad: (value: boolean) => Promise<MediaItem>;

  /**
   * return: Promise<boolean>
   *
   * Checks whether Force Deinterlace is active.
   */
  isForceDeinterlace: () => Promise<boolean>;

  /**
   * param: (value: boolean)
   *
   * Sets the Force Deinterlace setting.
   *
   * *Chainable.*
   */
  setForceDeinterlace: (value: boolean) => Promise<MediaItem>;

  /**
   * return: Promise<boolean>
   *
   * Check whether this item should retain its playback position when switching
   * scenes.
   */
  isRememberingPlaybackPosition: () => Promise<boolean>;

  /**
   * param: (value: boolean)
   *
   * Sets whether this item should retain its playback position when switching
   * scenes.
   *
   * *Chainable.*
   */
  setRememberingPlaybackPosition: (value: boolean) => Promise<MediaItem>;

  /**
   * return: Promise<boolean>
   *
   * Checks if this item is set to display its playback position.
   */
  isShowingPlaybackPosition: () => Promise<boolean>;

  /**
   * param: (value: boolean)
   *
   * Sets whether this item should display its playback position.
   *
   * *Chainable.*
   */
  setShowingPlaybackPosition: (value: boolean) => Promise<MediaItem>;

  /**
   * return: Promise<CuePoint[]>
   *
   * Gets the set of Cue Points created for this item.
   *
   * See also: {@link #core/CuePoint Core/CuePoint}
   */
  getCuePoints: () => Promise<CuePoint[]>;

  /**
   * param: (value: CuePoint[])
   *
   * Assign the specified array of Cue Points for this item.
   *
   * *Chainable.*
   *
   * See also: {@link #core/CuePoint Core/CuePoint}
   */
  setCuePoints: (value: CuePoint[]) => Promise<MediaItem>;

  // Inherited from base class, no need to redefine
  // getValue: () => Promise<string>;
  // setValue: (value: string) => Promise<MediaItem>;

  /**
   * return: Promise<boolean>
   *
   * Checks if this item's file type is an audio file type.
   */
  isAudio: () => Promise<boolean>;

  /**
   * return: Promise<boolean>
   *
   * Checks if this item's file type is a video file type.
   */
  isVideo: () => Promise<boolean>;

  // ItemAudio

  /**
   * return: Promise<number>
   *
   * Get item's volume level expressed as an integer from 0 to 100
   */
  getVolume: () => Promise<number>;

  /**
   * return: Promise<boolean>
   *
   * Check if item's mute option is active
   */
  isMute:   () => Promise<boolean>;

  /**
   * param: value<number>
   *
   * Set volume level of item as an integer from 0 (muted) to 100 (maximum)
   *
   * *Chainable.*
   */
  setVolume: (value: number) => Promise<MediaItem>;

  /**
   * param: value<boolean>
   *
   * Set item's Mute property to ON or OFF
   *
   * *Chainable.*
   */
  setMute:  (value: boolean) => Promise<MediaItem>;

  /**
   * return: Promise<boolean>
   *
   * Checks if audio is also output to system sound
   */
  isStreamOnlyEnabled: () => Promise<boolean>;

  /**
   * param: value<boolean>
   *
   * Sets whether audio should also be output to system sound
   *
   * *Chainable.*
   */
  setStreamOnlyEnabled: (value: boolean) => Promise<MediaItem>;

  /**
   * return: Promise<boolean>
   *
   * Checks if audio is available
   */
  isAudioAvailable: () => Promise<boolean>;
}

applyMixins(MediaItem, [ItemLayout, ItemColor, ItemChroma,
  ItemTransition, ItemPlayback, ItemAudio]);
