/// <reference path="../../../defs/es6-promise.d.ts" />

import {Item as iItem} from '../../internal/item';
import {Color} from '../../util/color';

export interface IItemColor {
  getTransparency(): Promise<number>;
  setTransparency(value: number): Promise<any>;
  getBrightness(): Promise<number>;
  setBrightness(value: number): Promise<any>;
  getContrast(): Promise<number>;
  setContrast(value: number): Promise<any>;
  getHue(): Promise<number>;
  setHue(value: number): Promise<any>;
  getSaturation(): Promise<number>;
  setSaturation(value: number): Promise<any>;
  getBorderColor(): Promise<Color>;
  setBorderColor(value: Color): Promise<any>;
}

export class ItemColor implements IItemColor {
  private _id: string;

  getTransparency(): Promise<number> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:alpha', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setTransparency(value: number): Promise<ItemColor> {
    return new Promise((resolve, reject) => {
      if (value < 0 || value > 255) {
        reject(RangeError('Transparency may only be in the range 0 to 255.'));
      } else {
        let slot = iItem.attach(this._id);
        iItem.set('prop:alpha', String(value), slot).then(() => {
          resolve(this);
        });
      }
    });
  }

  getBrightness(): Promise<number> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:cc_brightness', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setBrightness(value: number): Promise<ItemColor> {
    return new Promise((resolve, reject) => {
      if (value < -100 || value > 100) {
        reject(RangeError('Brightness may only be in the range -100 to 100.'));
      } else {
        let slot = iItem.attach(this._id);
        iItem.set('prop:cc_brightness', String(value), slot).then(() => {
          resolve(this);
        });
      }
    });

  }

  getContrast(): Promise<number> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:cc_contrast', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setContrast(value: number): Promise<ItemColor> {
    return new Promise((resolve, reject) => {
      if (value < -100 || value > 100) {
        reject(RangeError('Contrast may only be in the range -100 to 100.'));
      } else {
        let slot = iItem.attach(this._id);
        iItem.set('prop:cc_contrast', String(value), slot).then(() => {
          resolve(this);
        });
      }
    });
  }

  getHue(): Promise<number> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:cc_hue', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setHue(value: number): Promise<ItemColor> {
    return new Promise((resolve, reject) => {
      if (value < -180 || value > 180) {
        reject(RangeError('Contrast may only be in the range -180 to 180.'));
      } else {
        let slot = iItem.attach(this._id);
        iItem.set('prop:cc_hue', String(value), slot).then(() => {
          resolve(this);
        });
      }
    });
  }

  getSaturation(): Promise<number> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:cc_saturation', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setSaturation(value: number): Promise<ItemColor> {
    return new Promise((resolve, reject) => {
      if (value < -100 || value > 100) {
        reject(RangeError('Saturation may only be in the range -100 to 100'));
      } else {
        let slot = iItem.attach(this._id);
        iItem.set('prop:cc_saturation', String(value), slot).then(() => {
          resolve(this);
        });
      }
    });

  }

  getBorderColor(): Promise<Color> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:border', slot).then(val => {
        var bgr: number = Number(val) - 0x80000000;
        var color: Color = Color.fromBGRInt(bgr);
        resolve(color);
      });
    });
  }

  setBorderColor(value: Color): Promise<ItemColor> {
    return new Promise((resolve, reject) => {
      let slot = iItem.attach(this._id);
      iItem.set('prop:border',
        String(value.getIbgr() - 0x80000000), slot).then(() => {
          resolve(this);
        });
    });
  }
}
