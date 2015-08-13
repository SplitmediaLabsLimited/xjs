/// <reference path="../../../defs/es6-promise.d.ts" />

import {applyMixins} from '../../internal/util/mixin';
import {Item as iItem} from '../../internal/item';
import {ItemLayout, IItemLayout} from './ilayout';
import {Item} from './item';
import {Rectangle} from '../../internal/util/rectangle';

export class CameraItem extends Item implements IItemLayout {
  // ItemLayout

  /** Check if Aspect Ratio is set to ON or OFF */
  isKeepAspectRatio:        () => Promise<boolean>;
  /** Check if Position Locked is set to ON or OFF */
  isPositionLocked:         () => Promise<boolean>;
  /** Check if Enhance Resize is Enabled or Disabled */
  isEnhanceResizeEnabled:   () => Promise<boolean>;
  /** Get the position of the item */
  getPosition:              () => Promise<Rectangle>;
  /** Set Aspect Ratio to ON or OFF */
  setKeepAspectRatio:       (value: boolean) => void;
  /** Set Position Lock to ON or OFF */
  setPositionLocked:        (value: boolean) => void;
  /** Set Enhance Resize to ON or OFF */
  setEnhanceResizeEnabled:  (value: boolean) => void;
  /** Set Item position */
  setPosition:              (value: Rectangle) => void;
}

applyMixins(CameraItem, [ItemLayout]);
