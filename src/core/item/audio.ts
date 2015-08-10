/// <reference path="../../../defs/es6-promise.d.ts" />

import {applyMixins} from '../../internal/util/mixin';
import {Item as iItem} from '../../internal/item';
import {IItemAudio, ItemAudio} from './iaudio';
import {Scene} from '../scene';
import {Item} from './item';

export class AudioItem extends Item implements IItemAudio {
  // ItemAudio

  /** Get Item Volume level */
  getVolume: () => Promise<number>;

  /** Check if item is muted */
  isMuted:   () => Promise<boolean>;

  /** Set Volume level of item */
  setVolume: (value: number) => void;

  /** Set Item Mute to ON or OFF */
  setMuted:  (value: boolean) => void;
}

applyMixins(Item, [ItemAudio]);
