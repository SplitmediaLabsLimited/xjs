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

  /**
   * return: Promise<string>
   * 
   * Gets the name of the stream/channel tied to the replay.
   */ 
  getChannel: () => Promise<string>

  /**
   * param: (channel: string)
   * ```
   * return: Promise<ISourceReplay>
   * ```
   *
   * Sets the stream/channel tied to the replay via its name.
   */
  setChannel: (channel: string) => Promise<ISourceReplay>

  /**
   * return: Promise<number>
   *
   * Gets the hotkey, in numerical value, used to toggle start/stop of the replay.
   *
   * See conversion from keycode: {@link #system/Replay Replay Class}
   */
  getHotkey: () => Promise<number>

  /**
   * param: (hotkey: number)
   * ```
   * return: Promise<ISourceReplay>
   * ```
   *
   * Sets the hotkey, in numerical value, used to toggle start/stop of the replay.
   *
   * See conversion from keycode: {@link #system/Replay Replay Class}
   */
  setHotkey: (hotkey: number) => Promise<ISourceReplay>

  /**
   * return: Promise<number>
   *
   * Gets the duration, or buffer time for the replay
   */
  getReplayTime: () => Promise<number>

  /**
   * param: (time: number)
   * ```
   * return: Promise<ISourceReplay>
   * ```
   *
   * Sets the duration, or buffer time for the replay
   */
  setReplayTime: (buffer: number) => Promise<ISourceReplay>

  /**
   * return: Promise<ISourceReplay>
   *
   * Start playing of the buffered replay
   */
  startReplay: () => Promise<ISourceReplay>

  /**
   * return: Promise<ISourceReplay>
   *
   * Stop playing of the buffered replay
   */
  stopReplay: () => Promise<ISourceReplay>

  /**
   * return: Promise<number>
   *
   * Gets the replay state, may return any of the following:
   * 0 - playing
   * 1 - not playing
   * -1 - no stream exists
   * -2 - stream exists but cannot be tied to a replay
   */
  getReplayState: () => Promise<number>

  /**
   * return: Promise<boolean>
   *
   * Checks whether this source is set to start playback when the application
   * switches to this source's scene.
   */
  isAutostartOnSceneLoad: () => Promise<boolean>;

  /**
   * param: (value: boolean)
   *
   * Specifies whether this source is set to start playback when the application
   * switches to this source's scene.
   *
   * *Chainable.*
   */
  setAutostartOnSceneLoad: (value: boolean) => Promise<ISourceReplay>;

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

