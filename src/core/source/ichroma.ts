/// <reference path="../../../defs/es6-promise.d.ts" />

import {Item as iItem} from '../../internal/item';
import {Color} from '../../util/color';

/**
 *  Used by items that implement the Chroma interface.
 *  Check `getKeyingType()`/`setKeyingType()` method of
 *  {@link #core/CameraItem Core/CameraItem},
 *  {@link #core/GameItem Core/GameItem}, and
 *  {@link #core/HTMLItem Core/HTMLItem}.
 */
export enum KeyingType {
    LEGACY, // Chroma Key Legacy Mode
    COLORKEY, // Color Key Mode
    RGBKEY // Chroma Key RGB Mode
}

/**
 *  Used by items that implement the Chroma interface, when using RGB mode
 *  Chroma Key.
 *
 *  Check `getChromaRGBKeyPrimaryColor()`/`setChromaRGBKeyPrimaryColor()` method
 *  of {@link #core/CameraItem Core/CameraItem},
 *  {@link #core/GameItem Core/GameItem}, and
 *  {@link #core/HTMLItem Core/HTMLItem}.
 */
export enum ChromaPrimaryColors {
    RED,
    GREEN,
    BLUE
}

/**
 *  Used by items that implement the Chroma interface.
 *
 *  Check `getChromaAntiAliasLevel()`/`setChromaAntiAliasLevel()` method
 *  of {@link #core/CameraItem Core/CameraItem},
 *  {@link #core/GameItem Core/GameItem}, and
 *  {@link #core/HTMLItem Core/HTMLItem}.
 */
export enum ChromaAntiAliasLevel {
    NONE,
    LOW,
    HIGH
}

export interface IItemChroma {
  isChromaEnabled(): Promise<boolean>;
  setChromaEnabled(value: boolean): Promise<IItemChroma>;
  getKeyingType(): Promise<KeyingType>;
  setKeyingType(value: KeyingType): Promise<IItemChroma>;

  getChromaAntiAliasLevel(): Promise<ChromaAntiAliasLevel>;
  setChromaAntiAliasLevel(value: ChromaAntiAliasLevel);

  // CHROMA LEGACY MODE
  getChromaLegacyBrightness(): Promise<number>;
  setChromaLegacyBrightness(value: number): Promise<IItemChroma>;
  getChromaLegacySaturation(): Promise<number>;
  setChromaLegacySaturation(value: number): Promise<IItemChroma>;
  getChromaLegacyHue(): Promise<number>;
  setChromaLegacyHue(value: number): Promise<IItemChroma>;
  getChromaLegacyThreshold(): Promise<number>;
  setChromaLegacyThreshold(value: number): Promise<IItemChroma>;
  getChromaLegacyAlphaSmoothing(): Promise<number>;
  setChromaLegacyAlphaSmoothing(value: number): Promise<IItemChroma>;

  // CHROMA KEY RGB MODE
  getChromaRGBKeyPrimaryColor(): Promise<ChromaPrimaryColors>;
  setChromaRGBKeyPrimaryColor(value: ChromaPrimaryColors): Promise<IItemChroma>;
  getChromaRGBKeyThreshold(): Promise<number>;
  setChromaRGBKeyThreshold(value: number): Promise<IItemChroma>;
  getChromaRGBKeyExposure(): Promise<number>;
  setChromaRGBKeyExposure(value: number): Promise<IItemChroma>;

  // COLOR KEY MODE
  getChromaColorKeyThreshold(): Promise<number>;
  setChromaColorKeyThreshold(value: number): Promise<IItemChroma>;
  getChromaColorKeyExposure(): Promise<number>;
  setChromaColorKeyExposure(value: number): Promise<IItemChroma>;
  getChromaColorKeyColor(): Promise<Color>;
  setChromaColorKeyColor(value: Color): Promise<IItemChroma>;
}

export class ItemChroma implements IItemChroma {
  private _id: string;

  isChromaEnabled(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:key_chromakey', this._id).then(val => {
        resolve(val === '1');
      });
    });
  }

  setChromaEnabled(value: boolean): Promise<ItemChroma> {
    return new Promise((resolve, reject) => {
      if (typeof value !== 'boolean') {
        reject(TypeError('Parameter should be boolean.'));
      } else {
        iItem.set('prop:key_chromakey', (value ? '1' : '0'),
          this._id).then(() => {
            resolve(this);
        });
      }
    });
  }

  getKeyingType(): Promise<KeyingType> {
    return new Promise(resolve => {
      iItem.get('prop:key_chromakeytype', this._id).then(val => {
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
        iItem.set('prop:key_chromakeytype', String(value),
          this._id).then(() => {
            resolve(this);
        });
      }
    });

  }

  getChromaAntiAliasLevel(): Promise<ChromaAntiAliasLevel> {
    return new Promise(resolve => {
      iItem.get('prop:key_antialiasing', this._id).then(val => {
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
        iItem.set('prop:key_antialiasing', String(value), this._id).then(() => {
          resolve(this);
        });
      }
    });
  }

  // CHROMA LEGACY MODE FUNCTIONS

  getChromaLegacyBrightness(): Promise<number> {
    return new Promise(resolve => {
      iItem.get('prop:key_chromabr', this._id).then(val => {
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
        iItem.set('prop:key_chromabr', String(value), this._id).then(() => {
          resolve(this);
        });
      }
    });
  }

  getChromaLegacySaturation(): Promise<number> {
    return new Promise(resolve => {
      iItem.get('prop:key_chromasat', this._id).then(val => {
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
        iItem.set('prop:key_chromasat', String(value), this._id).then(() => {
          resolve(this);
        });
      }
    });

  }

  getChromaLegacyHue(): Promise<number> {
    return new Promise(resolve => {
      iItem.get('prop:key_chromahue', this._id).then(val => {
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
        iItem.set('prop:key_chromahue', String(value), this._id).then(() => {
          resolve(this);
        });
      }
    });

  }

  getChromaLegacyThreshold(): Promise<number> {
    return new Promise(resolve => {
      iItem.get('prop:key_chromarang', this._id).then(val => {
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
        iItem.set('prop:key_chromarang', String(value), this._id).then(() => {
          resolve(this);
        });
      }
    });
  }

  getChromaLegacyAlphaSmoothing(): Promise<number> {
    return new Promise(resolve => {
      iItem.get('prop:key_chromaranga', this._id).then(val => {
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
        iItem.set('prop:key_chromaranga', String(value), this._id).then(() => {
          resolve(this);
        });
      }
    });
  }

  // CHROMA RGB KEY FUNCTIONS

  getChromaRGBKeyPrimaryColor(): Promise<ChromaPrimaryColors> {
    return new Promise(resolve => {
      iItem.get('prop:key_chromargbkeyprimary', this._id).then(val => {
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
        iItem.set('prop:key_chromargbkeyprimary', String(value), this._id)
          .then(() => {
            resolve(this);
        });
      }
    });
  }

  getChromaRGBKeyThreshold(): Promise<number> {
    return new Promise(resolve => {
      iItem.get('prop:key_chromargbkeythresh', this._id).then(val => {
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
        iItem.set('prop:key_chromargbkeythresh', String(value), this._id)
          .then(() => {
            resolve(this);
        });
      }
    });
  }

  getChromaRGBKeyExposure(): Promise<number> {
    return new Promise(resolve => {
        iItem.get('prop:key_chromargbkeybalance', this._id).then(val => {
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
        iItem.set('prop:key_chromargbkeybalance', String(value), this._id)
          .then(() => {
            resolve(this);
        });
    }
    });
  }

  // CHROMA COLOR KEY FUNCTIONS

  getChromaColorKeyThreshold(): Promise<number> {
    return new Promise(resolve => {
        iItem.get('prop:key_colorrang', this._id).then(val => {
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
          iItem.set('prop:key_colorrang', String(value), this._id).then(() => {
          resolve(this);
        });
      }
    });
  }


  getChromaColorKeyExposure(): Promise<number> {
    return new Promise(resolve => {
        iItem.get('prop:key_colorranga', this._id).then(val => {
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
          iItem.set('prop:key_colorranga', String(value), this._id).then(() => {
          resolve(this);
        });
      }
    });
  }

  getChromaColorKeyColor(): Promise<Color> {
    return new Promise(resolve => {
      iItem.get('prop:key_colorrgb', this._id).then(val => {
        let color: Color = Color.fromBGRString(val);
        resolve(color);
      });
    });
  }

  setChromaColorKeyColor(value: Color): Promise<ItemChroma> {
    return new Promise(resolve => {
        iItem.set('prop:key_colorrgb', String(value.getIbgr()),
          this._id).then(() => {
            resolve(this);
      });
    });
  }
}
