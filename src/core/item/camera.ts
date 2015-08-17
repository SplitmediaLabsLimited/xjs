/// <reference path="../../../defs/es6-promise.d.ts" />

import {applyMixins} from '../../internal/util/mixin';
import {Item as iItem} from '../../internal/item';
import {App as iApp} from '../../internal/app';
import {ItemLayout, IItemLayout} from './ilayout';
import {ItemColor, IItemColor} from './icolor';
import {Item} from './item';
import {Scene} from '../scene';
import {Rectangle} from '../../util/rectangle';
import {Color} from '../../util/color';

export class CameraItem extends Item implements IItemLayout, IItemColor {

  /** Tells the item to add itself to a scene.
   *  Currently limited to adding to the active scene.
   *  Should be implemented by Item subclasses.
   */
  addToScene(scene: Scene): Promise<boolean> {
    return new Promise(resolve => {
      iApp.callFunc('additem', this.toXML().toString()).then(() => {
        resolve();
      });
    });
  }

  // ItemLayout

  /** Check if Aspect Ratio is set to ON or OFF */
  isKeepAspectRatio:        () => Promise<boolean>;

  /** Check if Position Locked is set to ON or OFF */
  isPositionLocked:         () => Promise<boolean>;

  /** Check if Enhance Resize is Enabled or Disabled */
  isEnhancedResizeEnabled:   () => Promise<boolean>;

  /** Get the position of the item */
  getPosition:              () => Promise<Rectangle>;

  /** Set Aspect Ratio to ON or OFF */
  setKeepAspectRatio:       (value: boolean) => void;

  /** Set Position Lock to ON or OFF */
  setPositionLocked:        (value: boolean) => void;

  /** Set Enhance Resize to ON or OFF */
  setEnhancedResizeEnabled:  (value: boolean) => void;

  /** Set Item position */
  setPosition:              (value: Rectangle) => void;

  // ItemColor

  /** Get Item Transparency value */
  getTransparency: () => Promise<number>;

  /** Get Item Brightness value */
  getBrightness:   () => Promise<number>;

  /** Get Item Contrast value */
  getContrast:     () => Promise<number>;

  /** Get Item Hue value */
  getHue:          () => Promise<number>;

  /** Get Item Saturation value */
  getSaturation:   () => Promise<number>;

  /** Get Border Color */
  getBorderColor:  () => Promise<Color>;

  /** Set Item Transparency */
  setTransparency: (value: number) => void;

  /** Set Item Brightness */
  setBrightness:   (value: number) => void;

  /** Set Item Contrast */
  setContrast:     (value: number) => void;

  /** Set Item Hue */
  setHue:          (value: number) => void;

  /** Set Item Saturation */
  setSaturation:   (value: number) => void;

  /** Set Border Color */
  setBorderColor:  (value: Color) => void;

}

applyMixins(CameraItem, [ItemLayout, ItemColor]);
