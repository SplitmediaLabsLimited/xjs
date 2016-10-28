
import {applyMixins} from '../../internal/util/mixin';
import {Source} from '../source/source';
import {Item as iItem} from '../../internal/item';
import {Rectangle} from '../../util/rectangle';
import {ItemPlayback, IItemPlayback, ActionAfterPlayback} from '../items/iplayback';
import {IItemAudio, ItemAudio} from '../items/iaudio';
import {CuePoint} from '../items/cuepoint';

export class MediaSource extends Source implements IItemAudio, IItemPlayback{
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
  setPlaybackPosition: (value: number) => Promise<MediaSource>;

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
  setPlaying: (value: boolean) => Promise<MediaSource>;

  /**
   * See: {@link #core/IItemPlayback#getPlaybackStartPosition getPlaybackStartPosition}
   */
  getPlaybackStartPosition: () => Promise<number>;

  /**
   * See: {@link #core/IItemPlayback#setPlaybackStartPosition setPlaybackStartPosition}
   */
  setPlaybackStartPosition: (value: number) => Promise<MediaSource>;

  /**
   * See: {@link #core/IItemPlayback#getPlaybackEndPosition getPlaybackEndPosition}
   */
  getPlaybackEndPosition: () => Promise<number>;

  /**
   * See: {@link #core/IItemPlayback#setPlaybackEndPosition setPlaybackEndPosition}
   */
  setPlaybackEndPosition: (value: number) => Promise<MediaSource>;

  /**
   * See: {@link #core/IItemPlayback#getActionAfterPlayback getActionAfterPlayback}
   */
  getActionAfterPlayback: () => Promise<ActionAfterPlayback>;

  /**
   * See: {@link #core/IItemPlayback#setActionAfterPlayback setActionAfterPlayback}
   */
  setActionAfterPlayback: (value: ActionAfterPlayback) => Promise<MediaSource>;

  /**
   * See: {@link #core/IItemPlayback#isAutostartOnSceneLoad isAutostartOnSceneLoad}
   */
  isAutostartOnSceneLoad: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemPlayback#setAutostartOnSceneLoad setAutostartOnSceneLoad}
   */
  setAutostartOnSceneLoad: (value: boolean) => Promise<MediaSource>;

  /**
   * See: {@link #core/IItemPlayback#isForceDeinterlace isForceDeinterlace}
   */
  isForceDeinterlace: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemPlayback#setForceDeinterlace setForceDeinterlace}
   */
  setForceDeinterlace: (value: boolean) => Promise<MediaSource>;

  /**
   * See: {@link #core/IItemPlayback#isRememberingPlaybackPosition isRememberingPlaybackPosition}
   */
  isRememberingPlaybackPosition: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemPlayback#setRememberingPlaybackPosition setRememberingPlaybackPosition}
   */
  setRememberingPlaybackPosition: (value: boolean) => Promise<MediaSource>;

  /**
   * See: {@link #core/IItemPlayback#isShowingPlaybackPosition isShowingPlaybackPosition}
   */
  isShowingPlaybackPosition: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemPlayback#setShowingPlaybackPosition setShowingPlaybackPosition}
   */
  setShowingPlaybackPosition: (value: boolean) => Promise<MediaSource>;

  /**
   * See: {@link #core/IItemPlayback#getCuePoints getCuePoints}
   */
  getCuePoints: () => Promise<CuePoint[]>;

  /**
   * See: {@link #core/IItemPlayback#setCuePoints setCuePoints}
   */
  setCuePoints: (value: CuePoint[]) => Promise<MediaSource>;

  // Inherited from base class, no need to redefine
  // getValue: () => Promise<string>;
  // setValue: (value: string) => Promise<MediaSource>;

  /**
   * See: {@link #core/IItemPlayback#isAudio isAudio}
   */
  isAudio: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemPlayback#isVideo isVideo}
   */
  isVideo: () => Promise<boolean>;

  // ItemAudio

  /** See: {@link #core/IItemAudio#getVolume getVolume} */
  getVolume: () => Promise<number>;

  /** See: {@link #core/IItemAudio#isMute isMute} */
  isMute: () => Promise<boolean>;

  /** See: {@link #core/IItemAudio#setVolume setVolume} */
  setVolume: (value: number) => Promise<MediaSource>;

  /** See: {@link #core/IItemAudio#setMute setMute} */
  setMute: (value: boolean) => Promise<MediaSource>;

  /** See: {@link #core/IItemAudio#isStreamOnlyAudio isStreamOnlyAudio} */
  isStreamOnlyAudio: () => Promise<boolean>;

  /** See: {@link #core/IItemAudio#setStreamOnlyAudio setStreamOnlyAudio} */
  setStreamOnlyAudio: (value: boolean) => Promise<MediaSource>;

  /** See: {@link #core/IItemAudio#isAudioAvailable isAudioAvailable} */
  isAudioAvailable: () => Promise<boolean>;

}
