/// <reference path="../../../defs/es6-promise.d.ts" />

import {applyMixins} from '../../internal/util/mixin';
import {Source} from '../source/source';
import {IItemAudio, ItemAudio} from '../items/iaudio';

export class AudioSource extends Source implements IItemAudio  {
  // ItemAudio

  /** See: {@link #core/IItemAudio#getVolume getVolume} */
  getVolume: () => Promise<number>;

  /** See: {@link #core/IItemAudio#isMute isMute} */
  isMute:   () => Promise<boolean>;

  /** See: {@link #core/IItemAudio#setVolume setVolume} */
  setVolume: (value: number) => Promise<AudioSource>;

  /** See: {@link #core/IItemAudio#setMute setMute} */
  setMute:  (value: boolean) => Promise<AudioSource>;

  /** See: {@link #core/IItemAudio#isStreamOnlyAudio isStreamOnlyAudio} */
  isStreamOnlyAudio: () => Promise<boolean>;

  /** See: {@link #core/IItemAudio#setStreamOnlyAudio setStreamOnlyAudio} */
  setStreamOnlyAudio: (value: boolean) => Promise<AudioSource>;

  /** See: {@link #core/IItemAudio#isAudioAvailable isAudioAvailable} */
  isAudioAvailable: () => Promise<boolean>;
}
applyMixins(AudioSource, [ItemAudio])

