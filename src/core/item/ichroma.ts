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

  /**
   * return: Promise<boolean>
   *
   * Determines whether any type of chroma keying is enabled.
   */
  isChromaEnabled(): Promise<boolean>; // prop:key_chromakey

  /**
   * param: (value: boolean)
   *
   * Enables or disables chroma keying. Use together with `getKeyingType()`.
   *
   * *Chainable.*
   */
  setChromaEnabled(value: boolean): Promise<IItemChroma>;

  /**
   * return: Promise<KeyingType>
   *
   * Determines the chroma keying type being used.
   */
  getKeyingType(): Promise<KeyingType>; // prop:key_chromakeytype

  /**
   * param: (value: KeyingType)
   *
   * Sets the chroma keying scheme to any one of three possible choices: Chroma RGB Key, Color Key, or Legacy Mode.
   *
   * *Chainable.*
   *
   * After setting the keying type, you may tweak settings specific to that type.
   * - RGB Key: methods prefixed with `getChromaRGBKey-\*` or `setChromaRGBKey-\*`
   * - Color Key: methods prefixed with `getChromaColorKey-\*` or `setChromaColorKey-\*`
   * - Chroma Legacy Mode: methods prefixed with `getChromaLegacy-\*` or `setChromaLegacy-\*`
   */
  setKeyingType(value: KeyingType): Promise<IItemChroma>;

  /**
   * return: Promise<ChromaAntiAliasLevel>
   *
   * Gets the antialiasing level for chroma keying.
   */
  getChromaAntiAliasLevel(): Promise<ChromaAntiAliasLevel>; // prop:key_antialiasing
  
  /**
   * param: (value: ChromaAntiAliasLevel)
   *
   * Sets the antialiasing level for chroma keying.
   *
   * *Chainable.*
   */
  setChromaAntiAliasLevel(value: ChromaAntiAliasLevel);

  // CHROMA LEGACY MODE

  /**
   * return: Promise<number>
   *
   * Gets the brightness setting (0-255). Only relevant when chroma keying is in Legacy mode.
   */
  getChromaLegacyBrightness(): Promise<number>; // prop:key_chromabr  // ONLY FOR LEGACY MODE. Brightness
  
  /**
   * param: (value: number)
   *
   * Sets the brightness setting (0-255). Only relevant when chroma keying is in Legacy mode.
   *
   * *Chainable.*
   */
  setChromaLegacyBrightness(value: number): Promise<IItemChroma>;
  
  /**
   * return: Promise<number>
   *
   * Gets the saturation setting (0-255).  Only relevant when chroma keying is in Legacy mode.
   */
  getChromaLegacySaturation(): Promise<number>; // prop:key_chromasat // ONLY FOR LEGACY MODE. Saturation
  
  /**
   * param: (value: number)
   *
   * Sets the saturation setting (0-255).  Only relevant when chroma keying is in Legacy mode.
   *
   * *Chainable.*
   */
  setChromaLegacySaturation(value: number): Promise<IItemChroma>;
  
  /**
   * return: Promise<number>
   *
   * Gets the hue setting (0-180).  Only relevant when chroma keying is in Legacy mode.
   */
  getChromaLegacyHue(): Promise<number>; // prop:key_chromahue // ONLY FOR LEGACY MODE. Hue
  
  /**
   * param: (value: number)
   *
   * Sets the hue setting (0-180).  Only relevant when chroma keying is in Legacy mode.
   *
   * *Chainable.*
   */
  setChromaLegacyHue(value: number): Promise<IItemChroma>;
  
  /**
   * return: Promise<number>
   *
   * Gets the threshold setting (0-255). Only relevant when chroma keying is in Legacy mode.
   */
  getChromaLegacyThreshold(): Promise<number>; // prop:key_chromarang // ONLY FOR LEGACY MODE. (below hue). Threshold?
  
  /**
   * param: (value: number)
   *
   * Sets the threshold setting (0-255). Only relevant when chroma keying is in Legacy mode.
   *
   * *Chainable.*
   */
  setChromaLegacyThreshold(value: number): Promise<IItemChroma>;
  
  /**
   * return: Promise<number>
   *
   * Gets the alpha smoothing setting (0-255). Only relevant when chroma keying is in Legacy mode.
   */
  getChromaLegacyAlphaSmoothing(): Promise<number>; // prop:key_chromaranga // ONLY FOR LEGACY MODE. Alpha Smoothing
  
  /**
   * param: (value: number)
   *
   * Sets the alpha smoothing setting (0-255). Only relevant when chroma keying is in Legacy mode.
   *
   * *Chainable.*
   */
  setChromaLegacyAlphaSmoothing(value: number): Promise<IItemChroma>;

  // CHROMA KEY RGB MODE

  /**
   * return: Promise<ChromaPrimaryColors>
   *
   * Gets the primary color setting for chroma key. Only relevant when chroma keying is in RGB mode.
   */
  getChromaRGBKeyPrimaryColor(): Promise<ChromaPrimaryColors>; // prop:key_chromargbkeyprimary. Key Color
  
  /**
   * param: (value: ChromaPrimaryColors)
   *
   * Sets the primary color setting for chroma key. Only relevant when chroma keying is in RGB mode.
   *
   * *Chainable.*
   */
  setChromaRGBKeyPrimaryColor(value: ChromaPrimaryColors): Promise<IItemChroma>;
  
  /**
   * return: Promise<number>
   *
   * Gets the threshold setting (0-255). Only relevant when chroma keying is in RGB mode.
   */
  getChromaRGBKeyThreshold(): Promise<number>; // prop:key_chromargbkeythresh. Threshold
  
  /**
   * param: (value: number)
   *
   * Sets the threshold setting (0-255). Only relevant when chroma keying is in RGB mode.
   *
   * *Chainable.*
   */
  setChromaRGBKeyThreshold(value: number): Promise<IItemChroma>;
  
  /**
   * return: Promise<number>
   *
   * Gets the exposure setting (0-255). Only relevant when chroma keying is in RGB mode.
   */
  getChromaRGBKeyExposure(): Promise<number>; // prop:key_chromargbkeybalance. Exposure
  
  /**
   * param: (value: number)
   *
   * Sets the exposure setting (0-255). Only relevant when chroma keying is in RGB mode.
   *
   * *Chainable.*
   */
  setChromaRGBKeyExposure(value: number): Promise<IItemChroma>;

  // COLOR KEY MODE
  
  /**
   * return: Promise<number>
   *
   * Gets the threshold setting (0-255). Only relevant when chroma keying is in color key mode.
   */
  getChromaColorKeyThreshold(): Promise<number>; // prop:key_colorrang // ONLY FOR COLOR KEY MODE. Threshold
  
  /**
   * param: (value: number)
   *
   * Sets the threshold setting (0-255). Only relevant when chroma keying is in color key mode.
   *
   * *Chainable.*
   */
  setChromaColorKeyThreshold(value: number): Promise<IItemChroma>;
  
  /**
   * return: Promise<number>
   *
   * Gets the exposure setting (0-255). Only relevant when chroma keying is in color key mode.
   */
  getChromaColorKeyExposure(): Promise<number>; // prop:key_colorranga // ONLY FOR COLOR KEY MODE. Exposure
  
  /**
   * param: (value: number)
   *
   * Sets the exposure setting (0-255). Only relevant when chroma keying is in color key mode.
   *
   * *Chainable.*
   */
  setChromaColorKeyExposure(value: number): Promise<IItemChroma>;
  
  /**
   * return: Promise<Color>
   *
   * Gets the color setting for keying in color key mode.
   */
  getChromaColorKeyColor(): Promise<Color>; // prop:key_colorrgb // ONLY FOR COLOR KEY MODE
  
  /**
   * param: (value: Color)
   *
   * Sets the color setting for keying in color key mode.
   *
   * *Chainable.*
   */
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
