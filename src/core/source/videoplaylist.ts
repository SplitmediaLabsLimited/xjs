/// <reference path="../../../defs/es6-promise.d.ts" />
///
import {applyMixins} from '../../internal/util/mixin';
import {Source} from './source';
import {SourceConfigurable, ISourceConfigurable} from './iconfig';
import {ISourceVideoPlaylist, SourceVideoPlaylist} from './ivideoplaylist';
import {ISourcePlayback, SourcePlayback, ActionAfterPlayback} from './iplayback';
import {CuePoint} from './cuepoint';
import {IAudio, Audio} from './iaudio';

/**
 * The VideoPlaylistSource class represents the sources of the videoplaylist items that
 * has been added to the stage. A single source could have multiple items linked
 * into it and any changes to the source would affect all items linked to it.
 *
 * Each item is represented by the VideoPlaylistItem class.
 * See: {@link #core/VideoPlaylistItem Core/VideoPlaylistItem}
 *
 * Inherits from: {@link #core/Source Core/Source}
 *
 * ### Basic Usage
 *
 * ```javascript
 * var xjs = require('xjs');
 *
 * xjs.Scene.getActiveScene().then(function(scene) {
 *   scene.getSources().then(function(sources) {
 *   for (var i in sources) {
 *       if (sources[i] instanceof XJS.VideoPlaylistSource) {
 *         // Manipulate your videoplaylist source here
 *         sources[i].setSilenceDetectionEnabled(true);
 *       }
 *     }
 *   })
 * })
 * ```
 *
 *  All methods marked as *Chainable* resolve with the original
 *  `VideoPlaylistSource` instance.
 */
export class VideoPlaylistSource extends Source implements ISourceConfigurable,
ISourceVideoPlaylist, ISourcePlayback, IAudio {
  //Shared with VideoPlaylistItem
  /**
   * return: Promise<string>
   *
   * Gets the now playing video of this VideoPlaylist source.
   *
   */
  getVideoNowPlaying: () => Promise<string>

  /**
   * param: (value: string|number)
   * ```
   * return: Promise<VideoPlaylistSource>
   * ```
   * Sets the now playing video of this VideoPlaylist source.
   *
   * ## Possible Values
   * - STRING - file path
   * - NUMBER - number|within the range of fileplaylist array length
   *
   */
  setVideoNowPlaying: (value:string|number) => Promise<SourceVideoPlaylist>

  /**
   * return: Promise<string[]>
   *
   * Gets the file paths of the playlist of this VideoPlaylist source.
   *
   */
  getVideoPlaylistSources: () => Promise<string[]>

  /**
   * param: (file: string[])
   * ```
   * return: Promise<string>
   * ```
   * Sets the playlist of this VideoPlaylist source according to the specified
   * file paths.
   *
   * This call would replace all the items on the playlist.
   * The now playing item is also set to the first item of the new FilePlaylist.
   *
   */
  setVideoPlaylistSources: (fileItems:string[]) => Promise<SourceVideoPlaylist>

  // SourceConfigurable

  /**
   * See: {@link #core/ISourceConfigurable#loadConfig loadConfig}
   */
  loadConfig: () => Promise<any>;

  /**
   * See: {@link #core/ISourceConfigurable#saveConfig saveConfig}
   */
  saveConfig: (configObj: any) => Promise<VideoPlaylistSource>;

  /**
   * See: {@link #core/ISourceConfigurable#requestSaveConfig requestSaveConfig}
   */
  requestSaveConfig: (configObj: any) => Promise<VideoPlaylistSource>;

  /**
   * See: {@link #core/ISourceConfigurable#applyConfig applyConfig}
   */
  applyConfig: (configObj: any) => Promise<VideoPlaylistSource>;

// SourcePlayback

  /**
   * See: {@link #core/ISourcePlayback#isSeekable isSeekable}
   */
  isSeekable: () => Promise<boolean>;

  /**
   * See: {@link #core/ISourcePlayback#getPlaybackPosition getPlaybackPosition}
   */
  getPlaybackPosition: () => Promise<number>;

  /**
   * See: {@link #core/ISourcePlayback#setPlaybackPosition setPlaybackPosition}
   */
  setPlaybackPosition: (value: number) => Promise<VideoPlaylistSource>;

  /**
   * See: {@link #core/ISourcePlayback#getPlaybackDuration getPlaybackDuration}
   */
  getPlaybackDuration: () => Promise<number>;

  /**
   * See: {@link #core/ISourcePlayback#isPlaying isPlaying}
   */
  isPlaying: () => Promise<boolean>;

  /**
   * See: {@link #core/ISourcePlayback#setPlaying setPlaying}
   */
  setPlaying: (value: boolean) => Promise<VideoPlaylistSource>;

  /**
   * See: {@link #core/ISourcePlayback#getPlaybackStartPosition getPlaybackStartPosition}
   */
  getPlaybackStartPosition: () => Promise<number>;

  /**
   * See: {@link #core/ISourcePlayback#setPlaybackStartPosition setPlaybackStartPosition}
   */
  setPlaybackStartPosition: (value: number) => Promise<VideoPlaylistSource>;

  /**
   * See: {@link #core/ISourcePlayback#getPlaybackEndPosition getPlaybackEndPosition}
   */
  getPlaybackEndPosition: () => Promise<number>;

  /**
   * See: {@link #core/ISourcePlayback#setPlaybackEndPosition setPlaybackEndPosition}
   */
  setPlaybackEndPosition: (value: number) => Promise<VideoPlaylistSource>;

  /**
   * See: {@link #core/ISourcePlayback#getActionAfterPlayback getActionAfterPlayback}
   */
  getActionAfterPlayback: () => Promise<ActionAfterPlayback>;

  /**
   * See: {@link #core/ISourcePlayback#setActionAfterPlayback setActionAfterPlayback}
   */
  setActionAfterPlayback: (value: ActionAfterPlayback) => Promise<VideoPlaylistSource>;

  /**
   * See: {@link #core/ISourcePlayback#isAutostartOnSceneLoad isAutostartOnSceneLoad}
   */
  isAutostartOnSceneLoad: () => Promise<boolean>;

  /**
   * See: {@link #core/ISourcePlayback#setAutostartOnSceneLoad setAutostartOnSceneLoad}
   */
  setAutostartOnSceneLoad: (value: boolean) => Promise<VideoPlaylistSource>;

  /**
   * See: {@link #core/ISourcePlayback#isForceDeinterlace isForceDeinterlace}
   */
  isForceDeinterlace: () => Promise<boolean>;

  /**
   * See: {@link #core/ISourcePlayback#setForceDeinterlace setForceDeinterlace}
   */
  setForceDeinterlace: (value: boolean) => Promise<VideoPlaylistSource>;

  /**
   * See: {@link #core/ISourcePlayback#isRememberingPlaybackPosition isRememberingPlaybackPosition}
   */
  isRememberingPlaybackPosition: () => Promise<boolean>;

  /**
   * See: {@link #core/ISourcePlayback#setRememberingPlaybackPosition setRememberingPlaybackPosition}
   */
  setRememberingPlaybackPosition: (value: boolean) => Promise<VideoPlaylistSource>;

  /**
   * See: {@link #core/ISourcePlayback#isShowingPlaybackPosition isShowingPlaybackPosition}
   */
  isShowingPlaybackPosition: () => Promise<boolean>;

  /**
   * See: {@link #core/ISourcePlayback#setShowingPlaybackPosition setShowingPlaybackPosition}
   */
  setShowingPlaybackPosition: (value: boolean) => Promise<VideoPlaylistSource>;

  /**
   * See: {@link #core/ISourcePlayback#getCuePoints getCuePoints}
   */
  getCuePoints: () => Promise<CuePoint[]>;

  /**
   * See: {@link #core/ISourcePlayback#setCuePoints setCuePoints}
   */
  setCuePoints: (value: CuePoint[]) => Promise<VideoPlaylistSource>;

  // Inherited from base class, no need to redefine
  // getValue: () => Promise<string>;
  // setValue: (value: string) => Promise<VideoPlaylistSource>;

  /**
   * See: {@link #core/ISourcePlayback#isAudio isAudio}
   */
  isAudio: () => Promise<boolean>;

  /**
   * See: {@link #core/ISourcePlayback#isVideo isVideo}
   */
  isVideo: () => Promise<boolean>;

  // General Audio

  /** See: {@link #core/IAudio#getVolume getVolume} */
  getVolume: () => Promise<number>;

  /** See: {@link #core/IAudio#isMute isMute} */
  isMute: () => Promise<boolean>;

  /** See: {@link #core/IAudio#isAutoMute isAutoMute} */
  isAutoMute: () => Promise<boolean>;

  /** See: {@link #core/IAudio#setVolume setVolume} */
  setVolume: (value: number) => Promise<VideoPlaylistSource>;

  /** See: {@link #core/IAudio#setMute setMute} */
  setMute: (value: boolean) => Promise<VideoPlaylistSource>;

  /** See: {@link #core/IAudio#setAutoMute setAutoMute} */
  setAutoMute: (value: boolean) => Promise<VideoPlaylistSource>;

  /** See: {@link #core/IAudio#isStreamOnlyAudio isStreamOnlyAudio} */
  isStreamOnlyAudio: () => Promise<boolean>;

  /** See: {@link #core/IAudio#setStreamOnlyAudio setStreamOnlyAudio} */
  setStreamOnlyAudio: (value: boolean) => Promise<VideoPlaylistSource>;

  /** See: {@link #core/IAudio#isAudioAvailable isAudioAvailable} */
  isAudioAvailable: () => Promise<boolean>;
}

applyMixins(VideoPlaylistSource, [SourceConfigurable, SourceVideoPlaylist, SourcePlayback, Audio])