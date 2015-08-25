/// <reference path="../../../defs/es6-promise.d.ts" />

import {applyMixins} from '../../internal/util/mixin';
import {Item as iItem} from '../../internal/item';
import {IItemAudio, ItemAudio} from './iaudio';
import {Scene} from '../scene';
import {Item} from './item';

/**
 * The AudioItem class represents an audio device that has been added
 * to the stage.
 */
export class AudioItem extends Item implements IItemAudio {
  // ItemAudio

  /** Get item's volume level expressed as an integer from 0 to 100 */
  getVolume: () => Promise<number>;

  /** Check if item's mute option is active */
  isMute:   () => Promise<boolean>;

  /** Set volume level of item as an integer from 0 (muted) to 100 (maximum) */
  setVolume: (value: number) => void;

  /** Set item's Mute property to ON or OFF */
  setMute:  (value: boolean) => void;

  /** Gets delay in milliseconds */
  getAudioOffset: () => Promise<number>;

  /** Sets delay in milliseconds */
  setAudioOffset: (value: number) => void;

  /** Checks if audio is also output to system sound */
  getAudioOutput: () => Promise<boolean>;

  /** Sets whether audio should also be output to system sound */
  setAudioOutput: (value: boolean) => void;
}

applyMixins(Item, [ItemAudio]);
