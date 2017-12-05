
import {applyMixins} from '../../internal/util/mixin';
import {Source} from './source';
import {Item as iItem} from '../../internal/item';
import {Rectangle} from '../../util/rectangle';
import {SourcePlayback, ISourcePlayback, ActionAfterPlayback} from './iplayback';
import {IAudio, Audio} from './iaudio';
import {CuePoint} from './cuepoint';
import {ISourceMedia, SourceMedia} from './imedia';

/**
 * The MediaSource class represents the sources of the media items that
 * has been added to the stage. A single source could have multiple items linked
 * into it and any changes to the source would affect all items linked to it.
 *
 * Each item is represented by the MediaItem class.
 * See: {@link #core/MediaItem Core/MediaItem}
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
 *       if (sources[i] instanceof XJS.MediaSource) {
 *         // Manipulate your media source here
 *         sources[i].setSilenceDetectionEnabled(true);
 *       }
 *     }
 *   })
 * })
 * ```
 *
 * All methods marked as *Chainable* resolve with the original `MediaSource`
 * instance.
 */
export class MediaSource extends Source implements ISourcePlayback, IAudio,
  ISourceMedia {
  // ISourcePlayback
  // Inherited from base class, no need to redefine
  getValue: () => Promise<string>;
  setValue: (value: string) => Promise<MediaSource>;

  /**
   * return: Promise<object>
   *
   * Gets file information such as codecs, bitrate, resolution, etc.
   *
   * sample file info object format:
   *
   * {
   *  "audio": {
   *    "duration":"1436734690",
   *    "samplerate":"44100",
   *    "bitrate":"128000",
   *    "codec":"mp3"},
   *  "video":{
   *    "frameduration":"333670",
   *    "bitrate":"1132227",
   *    "duration":"1436436440",
   *    "height":"240",
   *    "width":"320",
   *    "codec":"mpeg4"}
   * }
   *
   * #### Usage
   *
   * ```javascript
   * mediaItem.getFileInfo().then(function(value) {
   *   // Do something with the value
   *   var audioCodec;
   *   if (typeof value['audio'] !== 'undefined' && typeof value['audio']['codec']) {
   *     audioCodec = value['audio']['codec'];
   *   }
   * });
   * ```
   */
  getFileInfo: () => Promise<Object>

  /**
   * See: {@link #core/ISourcePlayback#isAudio isAudio}
   */
  isAudio: () => Promise<boolean>;

  /**
   * See: {@link #core/ISourcePlayback#isVideo isVideo}
   */
  isVideo: () => Promise<boolean>;

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

  // General Audio

  /** See: {@link #core/IAudio#volume volume} */
  volume:(value?: number) => Promise<number|MediaSource>

  /** See: {@link #core/IAudio#mute mute} */
  mute:(value?: boolean) => Promise<boolean|MediaSource>

  /** See: {@link #core/IAudio#autoMute autoMute} */
  autoMute:(value?: boolean) => Promise<boolean|MediaSource>

  /** See: {@link #core/IAudio#streamOnlyAudio streamOnlyAudio} */
  streamOnlyAudio:(value?: boolean) => Promise<boolean|MediaSource>

  /** See: {@link #core/IAudio#isAudioAvailable isAudioAvailable} */
  isAudioAvailable: () => Promise<boolean>;

}

applyMixins(MediaSource, [SourcePlayback, Audio, SourceMedia])
