/// <reference path="../../../defs/es6-promise.d.ts" />
///
import {applyMixins} from '../../internal/util/mixin';
import {Source} from '../source/source';
import {Item as iItem} from '../../internal/item';
import {IO} from '../../util/io';
import {SourceConfigurable, ISourceConfigurable} from './iconfig';
import {ISourceVideoPlaylist, SourceVideoPlaylist} from './ivideoplaylist';

/**
 * The VideoPlaylistSource class represents the sources of the videoplaylist items that
 * has been added to the stage. A single source could have multiple items linked
 * into it and any changes to the source would affect all items linked to it.
 *
 * Each item is represented by the VideoPlaylistItem class.
 * See: {@link #core/VideoPlaylistItem Core/VideoPlaylistItem}
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
 */
export class VideoPlaylistSource extends Source implements ISourceConfigurable,
ISourceVideoPlaylist {
  //Shared with VideoPlaylistItem
  /**
   * return: Promise<string>
   *
   * Gets the now playing video of this VideoPlaylist item.
   *
   */
  getVideoNowPlaying: () => Promise<string>

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
  setVideoNowPlaying: (value:string|number) => Promise<SourceVideoPlaylist>

  /**
   * return: Promise<string[]>
   *
   * Gets the file paths of the playlist of this VideoPlaylist item.
   *
   */
  getVideoPlaylistSources: () => Promise<string[]>

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
}

applyMixins(VideoPlaylistSource, [SourceConfigurable, SourceVideoPlaylist])