/// <reference path="../../../defs/es6-promise.d.ts" />

import {applyMixins} from '../../internal/util/mixin';
import {Source} from '../source/source';
import {IAudio, Audio} from '../source/iaudio';
import {ISourceReplay, SourceReplay} from './ireplay';

export class ReplaySource extends Source implements IAudio, ISourceReplay {
  //Shared with ReplayItem
  getChannelName: () => Promise<string>

  setChannelName: (channel: string) => Promise<ISourceReplay>

  getHotkey: () => Promise<number>

  setHotkey: (hotkey: number) => Promise<ISourceReplay>

  getReplaytime: () => Promise<number>

  setReplaytime: (buffer: number) => Promise<ISourceReplay>

  startReplay: () => Promise<ISourceReplay>

  stopReplay: () => Promise<ISourceReplay>

  getReplayState: () => Promise<string>

  // ItemAudio

  /** See: {@link #core/IAudio#getVolume getVolume} */
  getVolume: () => Promise<number>;

  /** See: {@link #core/IAudio#isMute isMute} */
  isMute: () => Promise<boolean>;

  /** See: {@link #core/IAudio#isAutoMute isAutoMute} */
  isAutoMute: () => Promise<boolean>;

  /** See: {@link #core/IAudio#setVolume setVolume} */
  setVolume: (value: number) => Promise<ReplaySource>;

  /** See: {@link #core/IAudio#setMute setMute} */
  setMute: (value: boolean) => Promise<ReplaySource>;

  /** See: {@link #core/IAudio#setAutoMute setAutoMute} */
  setAutoMute: (value: boolean) => Promise<ReplaySource>;

  /** See: {@link #core/IAudio#isStreamOnlyAudio isStreamOnlyAudio} */
  isStreamOnlyAudio: () => Promise<boolean>;

  /** See: {@link #core/IAudio#setStreamOnlyAudio setStreamOnlyAudio} */
  setStreamOnlyAudio: (value: boolean) => Promise<ReplaySource>;

  /** See: {@link #core/IAudio#isAudioAvailable isAudioAvailable} */
  isAudioAvailable: () => Promise<boolean>;
}
applyMixins(ReplaySource, [Audio, SourceReplay])

