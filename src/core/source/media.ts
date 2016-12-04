
import {applyMixins} from '../../internal/util/mixin';
import {Source} from '../source/source';
import {Item as iItem} from '../../internal/item';
import {Rectangle} from '../../util/rectangle';
import {SourcePlayback, ISourcePlayback, ActionAfterPlayback} from './iplayback';
import {ISourceAudio, SourceAudio} from './iaudio';
import {CuePoint} from './cuepoint';

export class MediaSource extends Source implements ISourcePlayback, ISourceAudio{
  // ItemPlayback
  // Inherited from base class, no need to redefine
  // getValue: () => Promise<string>;
  // setValue: (value: string) => Promise<MediaItem>;

  /**
   * See: {@link #core/ISourcePlayback#isAudio isAudio}
   */
  isAudio: () => Promise<boolean>;

  /**
   * See: {@link #core/ISourcePlayback#isVideo isVideo}
   */
  isVideo: () => Promise<boolean>;

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
  setPlaybackPosition: (value: number) => Promise<MediaSource>;

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
  setPlaying: (value: boolean) => Promise<MediaSource>;

  /**
   * See: {@link #core/ISourcePlayback#getPlaybackStartPosition getPlaybackStartPosition}
   */
  getPlaybackStartPosition: () => Promise<number>;

  /**
   * See: {@link #core/ISourcePlayback#setPlaybackStartPosition setPlaybackStartPosition}
   */
  setPlaybackStartPosition: (value: number) => Promise<MediaSource>;

  /**
   * See: {@link #core/ISourcePlayback#getPlaybackEndPosition getPlaybackEndPosition}
   */
  getPlaybackEndPosition: () => Promise<number>;

  /**
   * See: {@link #core/ISourcePlayback#setPlaybackEndPosition setPlaybackEndPosition}
   */
  setPlaybackEndPosition: (value: number) => Promise<MediaSource>;

  /**
   * See: {@link #core/ISourcePlayback#getActionAfterPlayback getActionAfterPlayback}
   */
  getActionAfterPlayback: () => Promise<ActionAfterPlayback>;

  /**
   * See: {@link #core/ISourcePlayback#setActionAfterPlayback setActionAfterPlayback}
   */
  setActionAfterPlayback: (value: ActionAfterPlayback) => Promise<MediaSource>;

  /**
   * See: {@link #core/ISourcePlayback#isAutostartOnSceneLoad isAutostartOnSceneLoad}
   */
  isAutostartOnSceneLoad: () => Promise<boolean>;

  /**
   * See: {@link #core/ISourcePlayback#setAutostartOnSceneLoad setAutostartOnSceneLoad}
   */
  setAutostartOnSceneLoad: (value: boolean) => Promise<MediaSource>;

  /**
   * See: {@link #core/ISourcePlayback#isForceDeinterlace isForceDeinterlace}
   */
  isForceDeinterlace: () => Promise<boolean>;

  /**
   * See: {@link #core/ISourcePlayback#setForceDeinterlace setForceDeinterlace}
   */
  setForceDeinterlace: (value: boolean) => Promise<MediaSource>;

  /**
   * See: {@link #core/ISourcePlayback#isRememberingPlaybackPosition isRememberingPlaybackPosition}
   */
  isRememberingPlaybackPosition: () => Promise<boolean>;

  /**
   * See: {@link #core/ISourcePlayback#setRememberingPlaybackPosition setRememberingPlaybackPosition}
   */
  setRememberingPlaybackPosition: (value: boolean) => Promise<MediaSource>;

  /**
   * See: {@link #core/ISourcePlayback#isShowingPlaybackPosition isShowingPlaybackPosition}
   */
  isShowingPlaybackPosition: () => Promise<boolean>;

  /**
   * See: {@link #core/ISourcePlayback#setShowingPlaybackPosition setShowingPlaybackPosition}
   */
  setShowingPlaybackPosition: (value: boolean) => Promise<MediaSource>;

  /**
   * See: {@link #core/ISourcePlayback#getCuePoints getCuePoints}
   */
  getCuePoints: () => Promise<CuePoint[]>;

  /**
   * See: {@link #core/ISourcePlayback#setCuePoints setCuePoints}
   */
  setCuePoints: (value: CuePoint[]) => Promise<MediaSource>;

  // ItemAudio

  /** See: {@link #core/ISourceAudio#getVolume getVolume} */
  getVolume: () => Promise<number>;

  /** See: {@link #core/ISourceAudio#isMute isMute} */
  isMute: () => Promise<boolean>;

  /** See: {@link #core/ISourceAudio#setVolume setVolume} */
  setVolume: (value: number) => Promise<MediaSource>;

  /** See: {@link #core/ISourceAudio#setMute setMute} */
  setMute: (value: boolean) => Promise<MediaSource>;

  /** See: {@link #core/ISourceAudio#isStreamOnlyAudio isStreamOnlyAudio} */
  isStreamOnlyAudio: () => Promise<boolean>;

  /** See: {@link #core/ISourceAudio#setStreamOnlyAudio setStreamOnlyAudio} */
  setStreamOnlyAudio: (value: boolean) => Promise<MediaSource>;

  /** See: {@link #core/ISourceAudio#isAudioAvailable isAudioAvailable} */
  isAudioAvailable: () => Promise<boolean>;

}

applyMixins(MediaSource, [SourcePlayback, SourceAudio])
