/// <reference path="../../../defs/es6-promise.d.ts" />

import {Item as iItem} from '../../internal/item';
import {Color} from '../../util/color';

export enum KeyingType {
    LEGACY, // Chroma Key Legacy Mode
    COLORKEY, // Color Key Mode
    RGBKEY // Chroma Key RGB Mode
}

export enum ChromaPrimaryColors {
    RED,
    GREEN,
    BLUE
}

export enum ChromaAntiAliasLevel {
    NONE,
    LOW,
    HIGH
}

export interface IItemChroma {
  isChromaEnabled(): Promise<boolean>; // prop:key_chromakey
  setChromaEnabled(value: boolean): Promise<IItemChroma>;
  getKeyingType(): Promise<KeyingType>; // prop:key_chromakeytype
  setKeyingType(value: KeyingType): Promise<IItemChroma>;

  // BOTH CHROMA LEGACY AND CHROMA RGB
  getChromaAntiAliasLevel(): Promise<ChromaAntiAliasLevel>; // prop:key_antialiasing
  setChromaAntiAliasLevel(value: ChromaAntiAliasLevel);

  // CHROMA LEGACY MODE
  getChromaLegacyBrightness(): Promise<number>; // prop:key_chromabr  // ONLY FOR LEGACY MODE. Brightness
  setChromaLegacyBrightness(value: number): Promise<IItemChroma>;
  getChromaLegacySaturation(): Promise<number>; // prop:key_chromasat // ONLY FOR LEGACY MODE. Saturation
  setChromaLegacySaturation(value: number): Promise<IItemChroma>;
  getChromaLegacyHue(): Promise<number>; // prop:key_chromahue // ONLY FOR LEGACY MODE. Hue
  setChromaLegacyHue(value: number): Promise<IItemChroma>;
  getChromaLegacyThreshold(): Promise<number>; // prop:key_chromarang // ONLY FOR LEGACY MODE. (below hue). Threshold?
  setChromaLegacyThreshold(value: number): Promise<IItemChroma>;
  getChromaLegacyAlphaSmoothing(): Promise<number>; // prop:key_chromaranga // ONLY FOR LEGACY MODE. Alpha Smoothing
  setChromaLegacyAlphaSmoothing(value: number): Promise<IItemChroma>;

  // CHROMA KEY RGB MODE
  getChromaRGBKeyPrimaryColor(): Promise<ChromaPrimaryColors>; // prop:key_chromargbkeyprimary. Key Color
  setChromaRGBKeyPrimaryColor(value: ChromaPrimaryColors): Promise<IItemChroma>;
  getChromaRGBKeyThreshold(): Promise<number>; // prop:key_chromargbkeythresh. Threshold
  setChromaRGBKeyThreshold(value: number): Promise<IItemChroma>;
  getChromaRGBKeyExposure(): Promise<number>; // prop:key_chromargbkeybalance. Exposure
  setChromaRGBKeyExposure(value: number): Promise<IItemChroma>;

  // COLOR KEY MODE
  getChromaColorKeyThreshold(): Promise<number>; // prop:key_colorrang // ONLY FOR COLOR KEY MODE. Threshold
  setChromaColorKeyThreshold(value: number): Promise<IItemChroma>;
  getChromaColorKeyExposure(): Promise<number>; // prop:key_colorranga // ONLY FOR COLOR KEY MODE. Exposure
  setChromaColorKeyExposure(value: number): Promise<IItemChroma>;
  getChromaColorKeyColor(): Promise<Color>; // prop:key_colorrgb // ONLY FOR COLOR KEY MODE
  setChromaColorKeyColor(value: Color): Promise<IItemChroma>;
}

export class ItemChroma implements IItemChroma {
  private _id: string;

  isChromaEnabled(): Promise<boolean> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:key_chromakey', slot).then(val => {
        resolve(val === '1');
      });
    });
  }

  setChromaEnabled(value: boolean): Promise<ItemChroma> {
    return new Promise((resolve, reject) => {
      if (typeof value !== 'boolean') {
        reject(TypeError('Parameter should be boolean.'));
      } else {
        let slot = iItem.attach(this._id);
        iItem.set('prop:key_chromakey', (value ? '1' : '0'), slot).then(() => {
          resolve(this);
        });
      }
    });
  }

  getKeyingType(): Promise<KeyingType> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:key_chromakeytype', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setKeyingType(value: KeyingType): Promise<ItemChroma> {
    return new Promise((resolve, reject) => {
      if (typeof value !== 'number') {
        reject(TypeError('Use a KeyingType value as the parameter.'));
      } else if (value < 0 || value > 2) {
        reject(RangeError('Use a KeyingType value as the parameter.'));
      } else {
        let slot = iItem.attach(this._id);
        iItem.set('prop:key_chromakeytype', String(value), slot).then(() => {
          resolve(this);
        });
      }
    });

  }

  // COMMON TO CHROMA LEGACY AND CHROMA RGB KEY

  getChromaAntiAliasLevel(): Promise<ChromaAntiAliasLevel> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:key_antialiasing', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setChromaAntiAliasLevel(value: ChromaAntiAliasLevel): Promise<ItemChroma> {
    return new Promise((resolve, reject) => {
      if (typeof value !== 'number') {
        reject(TypeError('Use a ChromaAntiAliasLevel value as the parameter.'));
      } else if (value < 0 || value > 2) {
        reject(RangeError('Use a ChromaAntiAliasLevel value as the parameter.'));
      } else {
        let slot = iItem.attach(this._id);
        iItem.set('prop:key_antialiasing', String(value), slot).then(() => {
          resolve(this);
        });
      }
    });
  }

  // CHROMA LEGACY MODE FUNCTIONS

  getChromaLegacyBrightness(): Promise<number> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:key_chromabr', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setChromaLegacyBrightness(value: number): Promise<ItemChroma> {
    return new Promise((resolve, reject) => {
      if (typeof value !== 'number') {
        reject(TypeError('Use an integer as the parameter.'));
      } else if (value < 0 || value > 255) {
        reject(RangeError('Valid value is an integer from 0-255.'));
      } else {
        let slot = iItem.attach(this._id);
        iItem.set('prop:key_chromabr', String(value), slot).then(() => {
          resolve(this);
        });
      }
    });
  }

  getChromaLegacySaturation(): Promise<number> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:key_chromasat', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setChromaLegacySaturation(value: number): Promise<ItemChroma> {
    return new Promise((resolve, reject) => {
      if (typeof value !== 'number') {
        reject(TypeError('Use an integer as the parameter.'));
      } else if (value < 0 || value > 255) {
        reject(RangeError('Valid value is an integer from 0-255.'));
      } else {
        let slot = iItem.attach(this._id);
        iItem.set('prop:key_chromasat', String(value), slot).then(() => {
          resolve(this);
        });
      }
    });

  }

  getChromaLegacyHue(): Promise<number> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:key_chromahue', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setChromaLegacyHue(value: number): Promise<ItemChroma> {
    return new Promise((resolve, reject) => {
      if (typeof value !== 'number') {
        reject(TypeError('Use an integer as the parameter.'));
      } else if (value < 0 || value > 180) {
        reject(RangeError('Valid value is an integer from 0-180.'));
      } else {
        let slot = iItem.attach(this._id);
        iItem.set('prop:key_chromahue', String(value), slot).then(() => {
          resolve(this);
        });
      }
    });

  }

  getChromaLegacyThreshold(): Promise<number> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:key_chromarang', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setChromaLegacyThreshold(value: number): Promise<ItemChroma> {
    return new Promise((resolve, reject) => {
      if (typeof value !== 'number') {
        reject(TypeError('Use an integer as the parameter.'));
      } else if (value < 0 || value > 255) {
        reject(RangeError('Valid value is an integer from 0-255.'));
      } else {
        let slot = iItem.attach(this._id);
        iItem.set('prop:key_chromarang', String(value), slot).then(() => {
          resolve(this);
        });
      }
    });
  }

  getChromaLegacyAlphaSmoothing(): Promise<number> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:key_chromaranga', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setChromaLegacyAlphaSmoothing(value: number): Promise<ItemChroma> {
    return new Promise((resolve, reject) => {
      if (typeof value !== 'number') {
        reject(TypeError('Use an integer as the parameter.'));
      } else if (value < 0 || value > 255) {
        reject(RangeError('Valid value is an integer from 0-255.'));
      } else {
        let slot = iItem.attach(this._id);
        iItem.set('prop:key_chromaranga', String(value), slot).then(() => {
          resolve(this);
        });
      }
    });
  }

  // CHROMA RGB KEY FUNCTIONS

  getChromaRGBKeyPrimaryColor(): Promise<ChromaPrimaryColors> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:key_chromargbkeyprimary', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setChromaRGBKeyPrimaryColor(value: ChromaPrimaryColors): Promise<ItemChroma> {
    return new Promise((resolve, reject) => {
      if (typeof value !== 'number') {
        reject(TypeError('Use a ChromaPrimaryColors value as the parameter.'));
      } else if (value < 0 || value > 2) {
        reject(RangeError('Use a ChromaPrimaryColors value as the parameter.'));
      } else {
        let slot = iItem.attach(this._id);
        iItem.set('prop:key_chromargbkeyprimary', String(value), slot)
          .then(() => {
            resolve(this);
        });
      }
    });
  }

  getChromaRGBKeyThreshold(): Promise<number> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:key_chromargbkeythresh', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setChromaRGBKeyThreshold(value: number): Promise<ItemChroma> {
    return new Promise((resolve, reject) => {
      if (typeof value !== 'number') {
        reject(TypeError('Use an integer as the parameter.'));
      } else if (value < 0 || value > 255) {
        reject(RangeError('Valid value is an integer from 0-255.'));
      } else {
        let slot = iItem.attach(this._id);
        iItem.set('prop:key_chromargbkeythresh', String(value), slot)
          .then(() => {
            resolve(this);
        });
      }
    });
  }

  getChromaRGBKeyExposure(): Promise<number> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:key_chromargbkeybalance', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setChromaRGBKeyExposure(value: number): Promise<ItemChroma> {
    return new Promise((resolve, reject) => {
      if (typeof value !== 'number') {
        reject(TypeError('Use an integer as the parameter.'));
      } else if (value < 0 || value > 255) {
        reject(RangeError('Valid value is an integer from 0-255.'));
      } else {
        let slot = iItem.attach(this._id);
        iItem.set('prop:key_chromargbkeybalance', String(value), slot)
          .then(() => {
            resolve(this);
        });
      }
    });
  }

  // CHROMA COLOR KEY FUNCTIONS

  getChromaColorKeyThreshold(): Promise<number> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:key_colorrang', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setChromaColorKeyThreshold(value: number): Promise<ItemChroma> {
    return new Promise((resolve, reject) => {
      if (typeof value !== 'number') {
        reject(TypeError('Use an integer as the parameter.'));
      } else if (value < 0 || value > 255) {
        reject(RangeError('Valid value is an integer from 0-255.'));
      } else {
        let slot = iItem.attach(this._id);
        iItem.set('prop:key_colorrang', String(value), slot).then(() => {
          resolve(this);
        });
      }
    });
  }


  getChromaColorKeyExposure(): Promise<number> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:key_colorranga', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setChromaColorKeyExposure(value: number): Promise<ItemChroma> {
    return new Promise((resolve, reject) => {
      if (typeof value !== 'number') {
        reject(TypeError('Use an integer as the parameter.'));
      } else if (value < 0 || value > 255) {
        reject(RangeError('Valid value is an integer from 0-255.'));
      } else {
        let slot = iItem.attach(this._id);
        iItem.set('prop:key_colorranga', String(value), slot).then(() => {
          resolve(this);
        });
      }
    });
  }

  getChromaColorKeyColor(): Promise<Color> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:key_colorrgb', slot).then(val => {
        let color: Color = Color.fromBGRString(val);
        resolve(color);
      });
    });
  }

  setChromaColorKeyColor(value: Color): Promise<ItemChroma> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.set('prop:key_colorrgb', String(value.getIbgr()), slot).then(() => {
        resolve(this);
      });
    });
  }
}
