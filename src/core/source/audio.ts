/// <reference path="../../../defs/es6-promise.d.ts" />

import {applyMixins} from '../../internal/util/mixin';
import {Source} from '../source/source';
import {ISourceAudio, SourceAudio} from '../source/iaudio';

export class AudioSource extends Source implements ISourceAudio  {
  // ItemAudio

  /** See: {@link #core/ISourceAudio#getVolume getVolume} */
  getVolume: () => Promise<number>;

  /** See: {@link #core/ISourceAudio#isMute isMute} */
  isMute:   () => Promise<boolean>;

  /** See: {@link #core/ISourceAudio#setVolume setVolume} */
  setVolume: (value: number) => Promise<AudioSource>;

  /** See: {@link #core/ISourceAudio#setMute setMute} */
  setMute:  (value: boolean) => Promise<AudioSource>;

  /** See: {@link #core/ISourceAudio#isStreamOnlyAudio isStreamOnlyAudio} */
  isStreamOnlyAudio: () => Promise<boolean>;

  /** See: {@link #core/ISourceAudio#setStreamOnlyAudio setStreamOnlyAudio} */
  setStreamOnlyAudio: (value: boolean) => Promise<AudioSource>;

  /** See: {@link #core/ISourceAudio#isAudioAvailable isAudioAvailable} */
  isAudioAvailable: () => Promise<boolean>;
}
applyMixins(AudioSource, [SourceAudio])

