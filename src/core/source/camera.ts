/// <reference path="../../../defs/es6-promise.d.ts" />

import {applyMixins} from '../../internal/util/mixin';
import {Source} from '../source/source';
import {ISourceAudio, SourceAudio} from '../source/iaudio';

/**
 * An CameraSource represents an object of an item on the stage.
 */

export class CameraSource extends Source implements ISourceAudio {
  // SourceAudio

  /** See: {@link #core/ISourceAudio#getVolume getVolume} */
  getVolume: () => Promise<number>;

  /** See: {@link #core/ISourceAudio#isMute isMute} */
  isMute: () => Promise<boolean>;

  /** See: {@link #core/ISourceAudio#setVolume setVolume} */
  setVolume: (value: number) => Promise<CameraSource>;

  /** See: {@link #core/ISourceAudio#setMute setMute} */
  setMute: (value: boolean) => Promise<CameraSource>;

  /** See: {@link #core/ISourceAudio#isStreamOnlyAudio isStreamOnlyAudio} */
  isStreamOnlyAudio: () => Promise<boolean>;

  /** See: {@link #core/ISourceAudio#setStreamOnlyAudio setStreamOnlyAudio} */
  setStreamOnlyAudio: (value: boolean) => Promise<CameraSource>;

  /** See: {@link #core/ISourceAudio#isAudioAvailable isAudioAvailable} */
  isAudioAvailable: () => Promise<boolean>;
}

applyMixins(CameraSource, [SourceAudio])