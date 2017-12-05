/// <reference path="../../../defs/es6-promise.d.ts" />
///
import {applyMixins} from '../../internal/util/mixin';
import {Source} from './source';
import {Item as iItem} from '../../internal/item';
import {IO} from '../../util/io';
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
   * param?: (value: string|number)
   * ```
   * return: Promise<string|number|VideoPlaylistSource>
   * ```
   *
   * Get/Set the now playing video of this VideoPlaylist source.
   *
   * ## Possible Values
   * - STRING - file path
   * - NUMBER - number|within the range of fileplaylist array length
   *
   */
  nowPlaying: (value?: string|number) => Promise<string|number|VideoPlaylistSource>

  /**
   * param?: (file: string[])
   * ```
   * return: Promise<string[]|VideoPlaylistSource>
   * ```
   *
   * Get/Set the playlist of this VideoPlaylist source according to the specified
   * file paths.
   *
   * This call would replace all the items on the playlist.
   * The now playing item is also set to the first item of the new FilePlaylist.
   *
   */
  playlist: (fileItems?: string[]) => Promise<string[]|VideoPlaylistSource>

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
   * See: {@link #core/ISourcePlayback#playbackPosition playbackPosition}
   */
  playbackPosition: (value?: number) => Promise<number|ISourcePlayback>

  /**
   * See: {@link #core/ISourcePlayback#playbackDuration playbackDuration}
   */
  playbackDuration: () => Promise<number>

  /**
   * See: {@link #core/ISourcePlayback#playing playing}
   */
  playing: (value?: boolean) => Promise<boolean|ISourcePlayback>

  /**
   * See: {@link #core/ISourcePlayback#playbackStartPostion playbackStartPostion}
   */
  playbackStartPostion: (value?: number) => Promise<number|ISourcePlayback>

  /**
   * See: {@link #core/ISourcePlayback#playbackEndPosition playbackEndPosition}
   */
  playbackEndPosition: (value?: number) => Promise<number|ISourcePlayback>

  /**
   * See: {@link #core/ISourcePlayback#actionAfterPlayback actionAfterPlayback}
   */
  actionAfterPlayback: (value?: number) => Promise<number|ISourcePlayback>

  /**
   * See: {@link #core/ISourcePlayback#autoStartOnSceneLoad autoStartOnSceneLoad}
   */
  autoStartOnSceneLoad: (value?: boolean) => Promise<boolean|ISourcePlayback>

  /**
   * See: {@link #core/ISourcePlayback#forceDeinterlace forceDeinterlace}
   */
  forceDeinterlace: (value?: boolean) => Promise<boolean|ISourcePlayback>

  /**
   * See: {@link #core/ISourcePlayback#rememberPlaybackPosition rememberPlaybackPosition}
   */
  rememberPlaybackPosition: (value?: boolean) => Promise<boolean|ISourcePlayback>

  /**
   * See: {@link #core/ISourcePlayback#showPlaybackPosition showPlaybackPosition}
   */
  showPlaybackPosition: (value?: boolean) => Promise<boolean|ISourcePlayback>

  /**
   * See: {@link #core/ISourcePlayback#cuePoints cuePoints}
   */
  cuePoints: (cuePoints?: CuePoint[]) => Promise<CuePoint[]|ISourcePlayback>

  // Inherited from base class, no need to redefine
  getValue: () => Promise<string>;
  setValue: (value: string) => Promise<VideoPlaylistSource>;

  /**
   * See: {@link #core/ISourcePlayback#isAudio isAudio}
   */
  isAudio: () => Promise<boolean>;

  /**
   * See: {@link #core/ISourcePlayback#isVideo isVideo}
   */
  isVideo: () => Promise<boolean>;

  // General Audio
  volume:(value?: number)=> Promise<number|VideoPlaylistSource>
  mute:(value?: boolean)=> Promise<boolean|VideoPlaylistSource>
  autoMute:(value?: boolean)=> Promise<boolean|VideoPlaylistSource>
  streamOnlyAudio:(value?: boolean)=> Promise<boolean|VideoPlaylistSource>

  // /** See: {@link #core/IAudio#getVolume getVolume} */
  // getVolume: () => Promise<number>;

  // /** See: {@link #core/IAudio#isMute isMute} */
  // isMute: () => Promise<boolean>;

  // /** See: {@link #core/IAudio#isAutoMute isAutoMute} */
  // isAutoMute: () => Promise<boolean>;

  // /** See: {@link #core/IAudio#setVolume setVolume} */
  // setVolume: (value: number) => Promise<VideoPlaylistSource>;

  // /** See: {@link #core/IAudio#setMute setMute} */
  // setMute: (value: boolean) => Promise<VideoPlaylistSource>;

  // /** See: {@link #core/IAudio#setAutoMute setAutoMute} */
  // setAutoMute: (value: boolean) => Promise<VideoPlaylistSource>;

  // /** See: {@link #core/IAudio#isStreamOnlyAudio isStreamOnlyAudio} */
  // isStreamOnlyAudio: () => Promise<boolean>;

  // /** See: {@link #core/IAudio#setStreamOnlyAudio setStreamOnlyAudio} */
  // setStreamOnlyAudio: (value: boolean) => Promise<VideoPlaylistSource>;

  /** See: {@link #core/IAudio#isAudioAvailable isAudioAvailable} */
  isAudioAvailable: () => Promise<boolean>;
}

applyMixins(VideoPlaylistSource, [SourceConfigurable, SourceVideoPlaylist, SourcePlayback, Audio])