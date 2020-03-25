/// <reference path="../../../defs/es6-promise.d.ts" />

import {applyMixins} from '../../internal/util/mixin';
import {Source} from '../source/source';
import {IAudio, Audio} from '../source/iaudio';
import {ISourceReplay, SourceReplay} from './ireplay';

/**
 * The ReplaySource class represents the sources of the replay items that
 * has been added to the stage. A single source could have multiple items linked
 * into it and any changes to the source would affect all items linked to it.
 *
 * Each item is represented by the ReplayItem class.
 * See: {@link #core/ReplayItem Core/ReplayItem}
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
 *       if (sources[i] instanceof XJS.ReplaySource) {
 *         // Manipulate your game source here
 *         sources[i].setSilenceDetectionEnabled(true);
 *       }
 *     }
 *   })
 * })
 * ```
 *
 * All methods marked as *Chainable* resolve with the original `ReplaySource`
 * instance.
 */
export class ReplaySource extends Source implements IAudio, ISourceReplay {
  //Shared with ReplayItem

  /** See: {@link #core/ISourceReplay#getChannel getChannel} */
  getChannel: () => Promise<string>

  /** See: {@link #core/ISourceReplay#setChannel setChannel} */
  setChannel: (channel: string) => Promise<ReplaySource>

  /** See: {@link #core/ISourceReplay#getHotkey getHotkey} */
  getHotkey: () => Promise<number>

  /** See: {@link #core/ISourceReplay#setHotkey setHotkey} */
  setHotkey: (hotkey: number) => Promise<ReplaySource>

  /** See: {@link #core/ISourceReplay#getReplayTime getReplayTime} */
  getReplayTime: () => Promise<number>

  /** See: {@link #core/ISourceReplay#setReplayTime setReplayTime} */
  setReplayTime: (buffer: number) => Promise<ReplaySource>

  /** See: {@link #core/ISourceReplay#startReplay startReplay} */
  startReplay: () => Promise<ReplaySource>

  /** See: {@link #core/ISourceReplay#stopReplay stopReplay} */
  stopReplay: () => Promise<ReplaySource>

  /** See: {@link #core/ISourceReplay#getReplayState getReplayState} */
  getReplayState: () => Promise<number>

  /** See: {@link #core/ISourceReplay#isAutostartOnSceneLoad isAutostartOnSceneLoad} */
  isAutostartOnSceneLoad: () => Promise<boolean>;

  /** See: {@link #core/ISourceReplay#setAutostartOnSceneLoad setAutostartOnSceneLoad} */
  setAutostartOnSceneLoad: (value: boolean) => Promise<ReplaySource>;

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

