/// <reference path="../../../defs/es6-promise.d.ts" />
import {applyMixins} from '../../internal/util/mixin';
import {ItemLayout, IItemLayout} from './ilayout';
import {ItemColor, IItemColor} from './icolor';
import {Item as iItem} from '../../internal/item';
import {ItemChroma, IItemChroma, KeyingType, ChromaPrimaryColors,
  ChromaAntiAliasLevel} from './ichroma';
import {ItemTransition, IItemTransition} from './itransition';
import {ItemConfigurable, IItemConfigurable} from './iconfig';
import {Item} from './item';
import {Scene} from '../scene';
import {Transition} from '../transition';
import {Rectangle} from '../../util/rectangle';
import {Color} from '../../util/color';
import {Environment} from '../environment';
import {IO} from '../../util/io';
import {CuePoint} from './cuepoint';
import {ItemPlayback, IItemPlayback, ActionAfterPlayback} from './iplayback';

/**
 * The VideoPlaylistItem class represents the VideoPlaylist item that has been
 * added to the stage.
 *
 * Inherits from: {@link #core/Item Core/Item}
 *
 * Implements: {@link #core/IItemChroma Core/IItemChroma},
 * {@link #core/IItemColor Core/IItemColor},
 * {@link #core/IItemLayout Core/IItemLayout},
 * {@link #core/IItemTransition Core/IItemTransition},
 * {@link #core/IItemConfigurable Core/IItemConfigurable}
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 *
 * XJS.Scene.getActiveScene().then(function(scene) {
 *   scene.getItems().then(function(items) {
 *     for (var i in items) {
 *       if (items[i] instanceof XJS.VideoPlaylistItem) {
 *         // Manipulate your VideoPlaylist Item here
 *       }
 *     }
 *   });
 * });
 * ```
 */


export class VideoPlaylistItem extends Item implements IItemLayout,
  IItemColor, IItemChroma, IItemTransition, IItemConfigurable, IItemPlayback {

    /**
   * return: Promise<string>
   *
   * Gets the now playing video of this VideoPlaylist item.
   *
   */

  getVideoNowPlaying(): Promise<string> {
    return new Promise(resolve => {
      iItem.get('prop:item', this._id).then(playlist => {
        let _playlist = String(playlist).slice(0,playlist.indexOf('*'))
        resolve(_playlist)
      });
    });
  }

  /**
   * param: (value: string|number)
   *
   * return: Promise<VideoPlaylistSource>
   *
   * Sets the now playing video of this VideoPlaylist item.
   *
   * ## Possible Values
   * - STRING - file path
   * - NUMBER - number|within the range of fileplaylist array length
   *
   */

  setVideoNowPlaying(value:string|number): Promise<VideoPlaylistItem> {
    let file: string;
    let _playlist: string[];

    return new Promise((resolve, reject) => {
      iItem.get('prop:FilePlaylist', this._id).then(playlist => {
        _playlist = String(playlist).split('|');
        for (var i = 0; i < _playlist.length; i++){
          _playlist[i] = _playlist[i].slice(0, _playlist[i].indexOf('*'));
        };
        return _playlist;
      }).then(list => {
        if (typeof value === 'string') {
          if(_playlist.indexOf(value) === -1){
            reject(Error('File not found on Playlist.'))
          } else {
            let index = _playlist.indexOf(value);
            file = _playlist[index] + '*' + index;
            iItem.set('prop:item', file, this._id)
            .then(fileplaylist => {
              resolve(this);
            });
          }
        } else if (typeof value === 'number' && value <= _playlist.length) {
          file = (_playlist[value] + '*' + value);
            iItem.set('prop:item', file, this._id)
              .then(function (fileplaylist) {
                resolve(this);
              });
        } else {
          reject(Error('Invalid value.'));
        };
      })
    });

  };

  /**
   * return: Promise<string[]>
   *
   * Gets the file paths of the playlist of this VideoPlaylist item.
   *
   */

  getVideoPlaylistSources(): Promise<string[]> {
    return new Promise(resolve => {
      iItem.get('prop:FilePlaylist', this._id).then(playlist => {
        let _playlist = String(playlist).split('|');
        for (var i = 0; i < _playlist.length; i++){
          _playlist[i] = _playlist[i].slice(0, _playlist[i].indexOf('*'));
        };
        resolve(_playlist);
      });
    });
  };

  /**
   * param: (file: string[])
   *
   * return: Promise<string>
   *
   * Sets the playlist of this VideoPlaylist item according to the specified
   * file paths.
   *
   * This call would replace all the items on the playlist.
   * The now playing item is also set to the first item of the new FilePlaylist.
   *
   */

  setVideoPlaylistSources(fileItems:string[]): Promise<VideoPlaylistItem> {
    let fileString: string;

    let filePromises = fileItems.map((filename) => {
      return IO.getVideoDuration(filename);
    });

    return new Promise((resolve, reject) => {
      Promise.all(filePromises).then(duration => {
        for (var i = 0; i < fileItems.length; i++) {
          if(fileString === undefined){
            fileString = fileItems[i] + '*' + i + '*1*'
            + duration[i] + '*100*0*0*0*0*0|';
          } else {
            fileString += fileItems[i] + '*' + i + '*1*'
            + duration[i] + '*100*0*0*0*0*0';
            if (i+1 < fileItems.length) {
              fileString += '|';
            };
          };
        };
        iItem.set('prop:item', fileItems[0] + '*0', this._id);
        return fileString;
      }).then(fileString => {
        iItem.set('prop:FilePlaylist', fileString, this._id)
        .then(fileplaylist => {
          resolve(this);
        });
      });
    });
  };

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
  setCanvasRotate: (value: number) => Promise<VideoPlaylistItem>;

  /**
   * See: {@link #core/IItemLayout#setCropping setCropping}
   */
  setCropping: (value: Object) => Promise<VideoPlaylistItem>;

  /**
   * See: {@link #core/IItemLayout#setCroppingEnhanced setCroppingEnhanced}
   */
  setCroppingEnhanced: (value: Object) => Promise<VideoPlaylistItem>;

  /**
   * See: {@link #core/IItemLayout#setEnhancedRotate setEnhancedRotate}
   */
  setEnhancedRotate:        (value: number) => Promise<VideoPlaylistItem>;

  /**
   * See: {@link #core/IItemLayout#setKeepAspectRatio setKeepAspectRatio}
   */
  setKeepAspectRatio: (value: boolean) => Promise<VideoPlaylistItem>;

  /**
   * See: {@link #core/IItemLayout#setPositionLocked setPositionLocked}
   */
  setPositionLocked:        (value: boolean) => Promise<VideoPlaylistItem>;

  /**
   * See: {@link #core/IItemLayout#setEnhancedResizeEnabled setEnhancedResizeEnabled}
   */
  setEnhancedResizeEnabled:  (value: boolean) => Promise<VideoPlaylistItem>;

  /**
   * See: {@link #core/IItemLayout#setPosition setPosition}
   */
  setPosition:              (value: Rectangle) => Promise<VideoPlaylistItem>;

  /**
   * See: {@link #core/IItemLayout#setRotateY setRotateY}
   */
  setRotateY:              (value: number) => Promise<VideoPlaylistItem>;

  /**
   * See: {@link #core/IItemLayout#setRotateX setRotateX}
   */
  setRotateX:              (value: number) => Promise<VideoPlaylistItem>;

  /**
   * See: {@link #core/IItemLayout#setRotateZ setRotateZ}
   */
  setRotateZ:              (value: number) => Promise<VideoPlaylistItem>;

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
  setTransparency: (value: number) => Promise<VideoPlaylistItem>;

  /**
   * See: {@link #core/IItemColor#setBrightness setBrightness}
   */
  setBrightness:   (value: number) => Promise<VideoPlaylistItem>;

  /**
   * See: {@link #core/IItemColor#setContrast setContrast}
   */
  setContrast:     (value: number) => Promise<VideoPlaylistItem>;

  /**
   * See: {@link #core/IItemColor#setHue setHue}
   */
  setHue:          (value: number) => Promise<VideoPlaylistItem>;

  /**
   * See: {@link #core/IItemColor#setSaturation setSaturation}
   */
  setSaturation:   (value: number) => Promise<VideoPlaylistItem>;

  /**
   * See: {@link #core/IItemColor#setBorderColor setBorderColor}
   */
  setBorderColor:  (value: Color) => Promise<VideoPlaylistItem>;

  /**
   * See: {@link #core/IItemColor#setFullDynamicColorRange setFullDynamicColorRange}
   */
  setFullDynamicColorRange: (value: boolean) => Promise<VideoPlaylistItem>;


  // ItemChroma

  /**
   * See: {@link #core/IItemChroma#isChromaEnabled isChromaEnabled}
   */
  isChromaEnabled: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemChroma#setChromaEnabled setChromaEnabled}
   */
  setChromaEnabled: (value: boolean) => Promise<VideoPlaylistItem>;

  /**
   * See: {@link #core/IItemChroma#getKeyingType getKeyingType}
   */
  getKeyingType: () => Promise<KeyingType>;

  /**
   * See: {@link #core/IItemChroma#setKeyingType setKeyingType}
   */
  setKeyingType: (value: KeyingType) => Promise<VideoPlaylistItem>;

  // BOTH CHROMA LEGACY AND CHROMA RGB

  /**
   * See: {@link #core/IItemChroma#getChromaAntiAliasLevel getChromaAntiAliasLevel}
   */
  getChromaAntiAliasLevel: () => Promise<ChromaAntiAliasLevel>;

  /**
   * See: {@link #core/IItemChroma#setChromaAntiAliasLevel setChromaAntiAliasLevel}
   */
  setChromaAntiAliasLevel: (value: ChromaAntiAliasLevel) => Promise<VideoPlaylistItem>;

  // CHROMA LEGACY MODE

  /**
   * See: {@link #core/IItemChroma#getChromaLegacyBrightness getChromaLegacyBrightness}
   */
  getChromaLegacyBrightness: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaLegacyBrightness setChromaLegacyBrightness}
   */
  setChromaLegacyBrightness: (value: number) => Promise<VideoPlaylistItem>;

  /**
   * See: {@link #core/IItemChroma#getChromaLegacySaturation getChromaLegacySaturation}
   */
  getChromaLegacySaturation: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaLegacySaturation setChromaLegacySaturation}
   */
  setChromaLegacySaturation: (value: number) => Promise<VideoPlaylistItem>;

  /**
   * See: {@link #core/IItemChroma#getChromaLegacyHue getChromaLegacyHue}
   */
  getChromaLegacyHue: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaLegacyHue setChromaLegacyHue}
   */
  setChromaLegacyHue: (value: number) => Promise<VideoPlaylistItem>;

  /**
   * See: {@link #core/IItemChroma#getChromaLegacyThreshold getChromaLegacyThreshold}
   */
  getChromaLegacyThreshold: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaLegacyThreshold setChromaLegacyThreshold}
   */
  setChromaLegacyThreshold: (value: number) => Promise<VideoPlaylistItem>;

  /**
   * See: {@link #core/IItemChroma#getChromaLegacyAlphaSmoothing getChromaLegacyAlphaSmoothing}
   */
  getChromaLegacyAlphaSmoothing: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaLegacyAlphaSmoothing setChromaLegacyAlphaSmoothing}
   */
  setChromaLegacyAlphaSmoothing: (value: number) => Promise<VideoPlaylistItem>;

  // CHROMA KEY RGB MODE

  /**
   * See: {@link #core/IItemChroma#getChromaRGBKeyPrimaryColor getChromaRGBKeyPrimaryColor}
   */
  getChromaRGBKeyPrimaryColor: () => Promise<ChromaPrimaryColors>;

  /**
   * See: {@link #core/IItemChroma#setChromaRGBKeyPrimaryColor setChromaRGBKeyPrimaryColor}
   */
  setChromaRGBKeyPrimaryColor: (value: ChromaPrimaryColors) => Promise<VideoPlaylistItem>;

  /**
   * See: {@link #core/IItemChroma#getChromaRGBKeyThreshold getChromaRGBKeyThreshold}
   */
  getChromaRGBKeyThreshold: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaRGBKeyThreshold setChromaRGBKeyThreshold}
   */
  setChromaRGBKeyThreshold: (value: number) => Promise<VideoPlaylistItem>;

  /**
   * See: {@link #core/IItemChroma#getChromaRGBKeyExposure getChromaRGBKeyExposure}
   */
  getChromaRGBKeyExposure: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaRGBKeyExposure setChromaRGBKeyExposure}
   */
  setChromaRGBKeyExposure: (value: number) => Promise<VideoPlaylistItem>;

  // COLOR KEY MODE

  /**
   * See: {@link #core/IItemChroma#getChromaColorKeyThreshold getChromaColorKeyThreshold}
   */
  getChromaColorKeyThreshold: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaColorKeyThreshold setChromaColorKeyThreshold}
   */
  setChromaColorKeyThreshold: (value: number) => Promise<VideoPlaylistItem>;

  /**
   * See: {@link #core/IItemChroma#getChromaColorKeyExposure getChromaColorKeyExposure}
   */
  getChromaColorKeyExposure: () => Promise<number>;

  /**
   * See: {@link #core/IItemChroma#setChromaColorKeyExposure setChromaColorKeyExposure}
   */
  setChromaColorKeyExposure: (value: number) => Promise<VideoPlaylistItem>;

  /**
   * See: {@link #core/IItemChroma#getChromaColorKeyColor getChromaColorKeyColor}
   */
  getChromaColorKeyColor: () => Promise<Color>;

  /**
   * See: {@link #core/IItemChroma#setChromaColorKeyColor setChromaColorKeyColor}
   */
  setChromaColorKeyColor: (value: Color) => Promise<VideoPlaylistItem>;

  // ItemTransition

  /**
   * See: {@link #core/IItemTransition#isVisible isVisible}
   */
  isVisible: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemTransition#setVisible setVisible}
   */
  setVisible:        (value: boolean) => Promise<VideoPlaylistItem>;

  /**
   * See: {@link #core/IItemTransition#getTransition getTransition}
   */
  getTransition: () => Promise<Transition>;

  /**
   * See: {@link #core/IItemTransition#setTransition setTransition}
   */
  setTransition:     (value: Transition) => Promise<VideoPlaylistItem>;

  /**
   * See: {@link #core/IItemTransition#getTransitionTime getTransitionTime}
   */
  getTransitionTime: () => Promise<number>;

  /**
   * See: {@link #core/IItemTransition#setTransitionTime setTransitionTime}
   */
  setTransitionTime: (value: number) => Promise<VideoPlaylistItem>;

  // ItemConfigurable

  /**
   * See: {@link #core/IItemConfigurable#loadConfig loadConfig}
   */
  loadConfig: () => Promise<any>;

  /**
   * See: {@link #core/IItemConfigurable#saveConfig saveConfig}
   */
  saveConfig: (configObj: any) => Promise<VideoPlaylistItem>;

  /**
   * See: {@link #core/IItemConfigurable#requestSaveConfig requestSaveConfig}
   */
  requestSaveConfig: (configObj: any) => Promise<VideoPlaylistItem>;

  /**
   * See: {@link #core/IItemConfigurable#applyConfig applyConfig}
   */
  applyConfig: (configObj: any) => Promise<VideoPlaylistItem>;

  // ItemPlayback

  /**
   * See: {@link #core/IItemPlayback#isSeekable isSeekable}
   */
  isSeekable: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemPlayback#getPlaybackPosition getPlaybackPosition}
   */
  getPlaybackPosition: () => Promise<number>;

  /**
   * See: {@link #core/IItemPlayback#setPlaybackPosition setPlaybackPosition}
   */
  setPlaybackPosition: (value: number) => Promise<VideoPlaylistItem>;

  /**
   * See: {@link #core/IItemPlayback#getPlaybackDuration getPlaybackDuration}
   */
  getPlaybackDuration: () => Promise<number>;

  /**
   * See: {@link #core/IItemPlayback#isPlaying isPlaying}
   */
  isPlaying: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemPlayback#setPlaying setPlaying}
   */
  setPlaying: (value: boolean) => Promise<VideoPlaylistItem>;

  /**
   * See: {@link #core/IItemPlayback#getPlaybackStartPosition getPlaybackStartPosition}
   */
  getPlaybackStartPosition: () => Promise<number>;

  /**
   * See: {@link #core/IItemPlayback#setPlaybackStartPosition setPlaybackStartPosition}
   */
  setPlaybackStartPosition: (value: number) => Promise<VideoPlaylistItem>;

  /**
   * See: {@link #core/IItemPlayback#getPlaybackEndPosition getPlaybackEndPosition}
   */
  getPlaybackEndPosition: () => Promise<number>;

  /**
   * See: {@link #core/IItemPlayback#setPlaybackEndPosition setPlaybackEndPosition}
   */
  setPlaybackEndPosition: (value: number) => Promise<VideoPlaylistItem>;

  /**
   * See: {@link #core/IItemPlayback#getActionAfterPlayback getActionAfterPlayback}
   */
  getActionAfterPlayback: () => Promise<ActionAfterPlayback>;

  /**
   * See: {@link #core/IItemPlayback#setActionAfterPlayback setActionAfterPlayback}
   */
  setActionAfterPlayback: (value: ActionAfterPlayback) => Promise<VideoPlaylistItem>;

  /**
   * See: {@link #core/IItemPlayback#isAutostartOnSceneLoad isAutostartOnSceneLoad}
   */
  isAutostartOnSceneLoad: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemPlayback#setAutostartOnSceneLoad setAutostartOnSceneLoad}
   */
  setAutostartOnSceneLoad: (value: boolean) => Promise<VideoPlaylistItem>;

  /**
   * See: {@link #core/IItemPlayback#isForceDeinterlace isForceDeinterlace}
   */
  isForceDeinterlace: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemPlayback#setForceDeinterlace setForceDeinterlace}
   */
  setForceDeinterlace: (value: boolean) => Promise<VideoPlaylistItem>;

  /**
   * See: {@link #core/IItemPlayback#isRememberingPlaybackPosition isRememberingPlaybackPosition}
   */
  isRememberingPlaybackPosition: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemPlayback#setRememberingPlaybackPosition setRememberingPlaybackPosition}
   */
  setRememberingPlaybackPosition: (value: boolean) => Promise<VideoPlaylistItem>;

  /**
   * See: {@link #core/IItemPlayback#isShowingPlaybackPosition isShowingPlaybackPosition}
   */
  isShowingPlaybackPosition: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemPlayback#setShowingPlaybackPosition setShowingPlaybackPosition}
   */
  setShowingPlaybackPosition: (value: boolean) => Promise<VideoPlaylistItem>;

  /**
   * See: {@link #core/IItemPlayback#getCuePoints getCuePoints}
   */
  getCuePoints: () => Promise<CuePoint[]>;

  /**
   * See: {@link #core/IItemPlayback#setCuePoints setCuePoints}
   */
  setCuePoints: (value: CuePoint[]) => Promise<VideoPlaylistItem>;

  // Inherited from base class, no need to redefine
  // getValue: () => Promise<string>;
  // setValue: (value: string) => Promise<VideoPlaylistItem>;

  /**
   * See: {@link #core/IItemPlayback#isAudio isAudio}
   */
  isAudio: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemPlayback#isVideo isVideo}
   */
  isVideo: () => Promise<boolean>;
}

applyMixins(VideoPlaylistItem,[ItemLayout, ItemColor, ItemChroma, ItemTransition,
  ItemConfigurable, ItemPlayback])
