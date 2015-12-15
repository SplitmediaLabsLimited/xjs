/// <reference path="../../../defs/es6-promise.d.ts" />

import {Item as iItem} from '../../internal/item';
import {Color} from '../../util/color';

export interface IItemColor {

  /**
   * return: Promise<number>
   *
   * Get Item Transparency value
   */
  getTransparency(): Promise<number>;

  /**
   * param: value<number>
   *
   * Set Item Transparency
   *
   * *Chainable.*
   */
  setTransparency(value: number): Promise<any>;

  /**
   * return: Promise<number>
   *
   * Get Item Brightness value
   */
  getBrightness(): Promise<number>;

  /**
   * param: value<number>
   *
   * Set Item Brightness
   *
   * *Chainable.*
   */
  setBrightness(value: number): Promise<any>;

  /**
   * return: Promise<number>
   *
   * Get Item Contrast value
   */
  getContrast(): Promise<number>;

  /**
   * param: value<number>
   *
   * Set Item Contrast
   *
   * *Chainable.*
   */
  setContrast(value: number): Promise<any>;

  /**
   * return: Promise<number>
   *
   * Get Item Hue value
   */
  getHue(): Promise<number>;

  /**
   * param: value<number>
   *
   * Set Item Hue
   *
   * *Chainable.*
   */
  setHue(value: number): Promise<any>;

  /**
   * return: Promise<number>
   *
   * Get Item Saturation value
   */
  getSaturation(): Promise<number>;

  /**
   * param: value<number>
   *
   * Set Item Saturation
   *
   * *Chainable.*
   */
  setSaturation(value: number): Promise<any>;

  /**
   * return: Promise<Color>
   *
   * Get Border Color
   */
  getBorderColor(): Promise<Color>;
  
  /**
   * param: value<Color>
   *
   * Set Border Color
   *
   * *Chainable.*
   */
  setBorderColor(value: Color): Promise<any>;
}

export class ItemColor implements IItemColor {
  private _id: string;

  getTransparency(): Promise<number> {
    return new Promise(resolve => {
      iItem.get('prop:alpha', this._id).then(val => {
        resolve(Number(val));
      });
    });
  }

  setTransparency(value: number): Promise<ItemColor> {
    return new Promise((resolve, reject) => {
      if (value < 0 || value > 255) {
        reject(RangeError('Transparency may only be in the range 0 to 255.'));
      } else {
        iItem.set('prop:alpha', String(value), this._id).then(() => {
          resolve(this);
        });
      }
    });
  }

  getBrightness(): Promise<number> {
    return new Promise(resolve => {
      iItem.get('prop:cc_brightness', this._id).then(val => {
        resolve(Number(val));
      });
    });
  }

  setBrightness(value: number): Promise<ItemColor> {
    return new Promise((resolve, reject) => {
      if (value < -100 || value > 100) {
        reject(RangeError('Brightness may only be in the range -100 to 100.'));
      } else {
        iItem.set('prop:cc_brightness', String(value), this._id).then(() => {
          resolve(this);
        });
      }
    });

  }

  getContrast(): Promise<number> {
    return new Promise(resolve => {
      iItem.get('prop:cc_contrast', this._id).then(val => {
        resolve(Number(val));
      });
    });
  }

  setContrast(value: number): Promise<ItemColor> {
    return new Promise((resolve, reject) => {
      if (value < -100 || value > 100) {
        reject(RangeError('Contrast may only be in the range -100 to 100.'));
      } else {
        iItem.set('prop:cc_contrast', String(value), this._id).then(() => {
          resolve(this);
        });
      }
    });
  }

  getHue(): Promise<number> {
    return new Promise(resolve => {
      iItem.get('prop:cc_hue', this._id).then(val => {
        resolve(Number(val));
      });
    });
  }

  setHue(value: number): Promise<ItemColor> {
    return new Promise((resolve, reject) => {
      if (value < -180 || value > 180) {
        reject(RangeError('Contrast may only be in the range -180 to 180.'));
      } else {
        iItem.set('prop:cc_hue', String(value), this._id).then(() => {
          resolve(this);
        });
      }
    });
  }

  getSaturation(): Promise<number> {
    return new Promise(resolve => {
      iItem.get('prop:cc_saturation', this._id).then(val => {
        resolve(Number(val));
      });
    });
  }

  setSaturation(value: number): Promise<ItemColor> {
    return new Promise((resolve, reject) => {
      if (value < -100 || value > 100) {
        reject(RangeError('Saturation may only be in the range -100 to 100'));
      } else {
        iItem.set('prop:cc_saturation', String(value), this._id).then(() => {
          resolve(this);
        });
      }
    });

  }

  getBorderColor(): Promise<Color> {
    return new Promise(resolve => {
      iItem.get('prop:border', this._id).then(val => {
        var bgr: number = Number(val) - 0x80000000;
        var color: Color = Color.fromBGRInt(bgr);
        resolve(color);
      });
    });
  }

  setBorderColor(value: Color): Promise<ItemColor> {
    return new Promise((resolve, reject) => {
      iItem.set('prop:border',
        String(value.getIbgr() - 0x80000000), this._id).then(() => {
          resolve(this);
        });
    });
  }
}
