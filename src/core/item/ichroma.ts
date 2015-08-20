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
  setChromaEnabled(value: boolean);
  getKeyingType(): Promise<KeyingType>; // prop:key_chromakeytype
  setKeyingType(value: KeyingType);

  // BOTH CHROMA LEGACY AND CHROMA RGB
  getChromaAntiAliasLevel(): Promise<ChromaAntiAliasLevel>; // prop:key_antialiasing
  setChromaAntiAliasLevel(value: ChromaAntiAliasLevel);

  // CHROMA LEGACY MODE
  getChromaLegacyBrightness(): Promise<number>; // prop:key_chromabr  // ONLY FOR LEGACY MODE. Brightness
  setChromaLegacyBrightness(value: number);
  getChromaLegacySaturation(): Promise<number>; // prop:key_chromasat // ONLY FOR LEGACY MODE. Saturation
  setChromaLegacySaturation(value: number);
  getChromaLegacyHue(): Promise<number>; // prop:key_chromahue // ONLY FOR LEGACY MODE. Hue
  setChromaLegacyHue(value: number);
  getChromaLegacyThreshold(): Promise<number>; // prop:key_chromarang // ONLY FOR LEGACY MODE. (below hue). Threshold?
  setChromaLegacyThreshold(value: number);
  getChromaLegacyAlphaSmoothing(): Promise<number>; // prop:key_chromaranga // ONLY FOR LEGACY MODE. Alpha Smoothing
  setChromaLegacyAlphaSmoothing(value: number);

  // CHROMA KEY RGB MODE
  getChromaRGBKeyPrimaryColor(): Promise<ChromaPrimaryColors>; // prop:key_chromargbkeyprimary. Key Color
  setChromaRGBKeyPrimaryColor(value: ChromaPrimaryColors);
  getChromaRGBKeyThreshold(): Promise<number>; // prop:key_chromargbkeythresh. Threshold
  setChromaRGBKeyThreshold(value: number);
  getChromaRGBKeyExposure(): Promise<number>; // prop:key_chromargbkeybalance. Exposure
  setChromaRGBKeyExposure(value: number);

  // COLOR KEY MODE
  getChromaColorKeyThreshold(): Promise<number>; // prop:key_colorrang // ONLY FOR COLOR KEY MODE. Threshold
  setChromaColorKeyThreshold(value: number);
  getChromaColorKeyExposure(): Promise<number>; // prop:key_colorranga // ONLY FOR COLOR KEY MODE. Exposure
  setChromaColorKeyExposure(value: number);
  getChromaColorKeyColor(): Promise<Color>; // prop:key_colorrgb // ONLY FOR COLOR KEY MODE
  setChromaColorKeyColor(value: Color);
}

export class ItemChroma implements IItemChroma {
  private id: string;

  isChromaEnabled(): Promise<boolean> {
    return new Promise(resolve => {
      let slot = iItem.attach(this.id);

      iItem.get('prop:key_chromakey', slot).then(val => {
        resolve(val === '1');
      });
    });
  }

  setChromaEnabled(value: boolean) {
    if (typeof value !== 'boolean') {
      throw new TypeError('Parameter should be boolean.');
    }

    let slot = iItem.attach(this.id);

    iItem.set('prop:key_chromakey', (value ? '1' : '0'), slot);
  }

  getKeyingType(): Promise<KeyingType> {
    return new Promise(resolve => {
      let slot = iItem.attach(this.id);

      iItem.get('prop:key_chromakeytype', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setKeyingType(value: KeyingType) {
    if (typeof value !== 'number') {
      throw new TypeError('Use a KeyingType value as the parameter.');
    } else if (value < 0 || value > 2) {
      throw new RangeError('Use a KeyingType value as the parameter.');
    }

    let slot = iItem.attach(this.id);

    iItem.set('prop:key_chromakeytype', String(value), slot);
  }

  // COMMON TO CHROMA LEGACY AND CHROMA RGB KEY

  getChromaAntiAliasLevel(): Promise<ChromaAntiAliasLevel> {
    return new Promise(resolve => {
      let slot = iItem.attach(this.id);

      iItem.get('prop:key_antialiasing', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setChromaAntiAliasLevel(value: ChromaAntiAliasLevel) {
    if (typeof value !== 'number') {
      throw new TypeError('Use a ChromaAntiAliasLevel value as the parameter.');
    } else if (value < 0 || value > 2) {
      throw new RangeError('Use a ChromaAntiAliasLevel value as the parameter.');
    }

    let slot = iItem.attach(this.id);

    iItem.set('prop:key_antialiasing', String(value), slot);
  }

  // CHROMA LEGACY MODE FUNCTIONS

  getChromaLegacyBrightness(): Promise<number> {
    return new Promise(resolve => {
      let slot = iItem.attach(this.id);

      iItem.get('prop:key_chromabr', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setChromaLegacyBrightness(value: number) {
    if (typeof value !== 'number') {
      throw new TypeError('Use an integer as the parameter.');
    } else if (value < 0 || value > 255) {
      throw new RangeError('Valid value is an integer from 0-255.');
    }
    let slot = iItem.attach(this.id);

    iItem.set('prop:key_chromabr', String(value), slot);
  }


  getChromaLegacySaturation(): Promise<number> {
    return new Promise(resolve => {
      let slot = iItem.attach(this.id);

      iItem.get('prop:key_chromasat', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setChromaLegacySaturation(value: number) {
    if (typeof value !== 'number') {
      throw new TypeError('Use an integer as the parameter.');
    } else if (value < 0 || value > 255) {
      throw new RangeError('Valid value is an integer from 0-255.');
    }

    let slot = iItem.attach(this.id);

    iItem.set('prop:key_chromasat', String(value), slot);
  }

  getChromaLegacyHue(): Promise<number> {
    return new Promise(resolve => {
      let slot = iItem.attach(this.id);

      iItem.get('prop:key_chromahue', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setChromaLegacyHue(value: number) {
    if (typeof value !== 'number') {
      throw new TypeError('Use an integer as the parameter.');
    } else if (value < 0 || value > 180) {
      throw new RangeError('Valid value is an integer from 0-180.');
    }

    let slot = iItem.attach(this.id);

    iItem.set('prop:key_chromahue', String(value), slot);
  }

  getChromaLegacyThreshold(): Promise<number> {
    return new Promise(resolve => {
      let slot = iItem.attach(this.id);

      iItem.get('prop:key_chromarang', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setChromaLegacyThreshold(value: number) {
    if (typeof value !== 'number') {
      throw new TypeError('Use an integer as the parameter.');
    } else if (value < 0 || value > 255) {
      throw new RangeError('Valid value is an integer from 0-255.');
    }

    let slot = iItem.attach(this.id);

    iItem.set('prop:key_chromarang', String(value), slot);
  }

  getChromaLegacyAlphaSmoothing(): Promise<number> {
    return new Promise(resolve => {
      let slot = iItem.attach(this.id);

      iItem.get('prop:key_chromaranga', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setChromaLegacyAlphaSmoothing(value: number) {
    if (typeof value !== 'number') {
      throw new TypeError('Use an integer as the parameter.');
    } else if (value < 0 || value > 255) {
      throw new RangeError('Valid value is an integer from 0-255.');
    }

    let slot = iItem.attach(this.id);

    iItem.set('prop:key_chromaranga', String(value), slot);
  }

  // CHROMA RGB KEY FUNCTIONS

  getChromaRGBKeyPrimaryColor(): Promise<ChromaPrimaryColors> {
    return new Promise(resolve => {
      let slot = iItem.attach(this.id);

      iItem.get('prop:key_chromargbkeyprimary', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setChromaRGBKeyPrimaryColor(value: ChromaPrimaryColors) {
    if (typeof value !== 'number') {
      throw new TypeError('Use a ChromaPrimaryColors value as the parameter.');
    } else if (value < 0 || value > 2) {
      throw new RangeError('Use a ChromaPrimaryColors value as the parameter.');
    }

    let slot = iItem.attach(this.id);

    iItem.set('prop:key_chromargbkeyprimary', String(value), slot);
  }

  getChromaRGBKeyThreshold(): Promise<number> {
    return new Promise(resolve => {
      let slot = iItem.attach(this.id);

      iItem.get('prop:key_chromargbkeythresh', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setChromaRGBKeyThreshold(value: number) {
    if (typeof value !== 'number') {
      throw new TypeError('Use an integer as the parameter.');
    } else if (value < 0 || value > 255) {
      throw new RangeError('Valid value is an integer from 0-255.');
    }

    let slot = iItem.attach(this.id);

    iItem.set('prop:key_chromargbkeythresh', String(value), slot);
  }

  getChromaRGBKeyExposure(): Promise<number> {
    return new Promise(resolve => {
      let slot = iItem.attach(this.id);

      iItem.get('prop:key_chromargbkeybalance', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setChromaRGBKeyExposure(value: number) {
    if (typeof value !== 'number') {
      throw new TypeError('Use an integer as the parameter.');
    } else if (value < 0 || value > 255) {
      throw new RangeError('Valid value is an integer from 0-255.');
    }

    let slot = iItem.attach(this.id);

    iItem.set('prop:key_chromargbkeybalance', String(value), slot);
  }

  // CHROMA COLOR KEY FUNCTIONS

  getChromaColorKeyThreshold(): Promise<number> {
    return new Promise(resolve => {
      let slot = iItem.attach(this.id);

      iItem.get('prop:key_colorrang', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setChromaColorKeyThreshold(value: number) {
    if (typeof value !== 'number') {
      throw new TypeError('Use an integer as the parameter.');
    } else if (value < 0 || value > 255) {
      throw new RangeError('Valid value is an integer from 0-255.');
    }

    let slot = iItem.attach(this.id);

    iItem.set('prop:key_colorrang', String(value), slot);
  }


  getChromaColorKeyExposure(): Promise<number> {
    return new Promise(resolve => {
      let slot = iItem.attach(this.id);

      iItem.get('prop:key_colorranga', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setChromaColorKeyExposure(value: number) {
    if (typeof value !== 'number') {
      throw new TypeError('Use an integer as the parameter.');
    } else if (value < 0 || value > 255) {
      throw new RangeError('Valid value is an integer from 0-255.');
    }

    let slot = iItem.attach(this.id);

    iItem.set('prop:key_colorranga', String(value), slot);
  }

  getChromaColorKeyColor(): Promise<Color> {
    return new Promise(resolve => {
      let slot = iItem.attach(this.id);

      iItem.get('prop:key_colorrgb', slot).then(val => {
        let color: Color = Color.fromBGRString(val);

        resolve(color);
      });
    });
  }

  setChromaColorKeyColor(value: Color) {
    let slot = iItem.attach(this.id);

    iItem.set('prop:key_colorrgb', value.getBgr(), slot);
  }
}
