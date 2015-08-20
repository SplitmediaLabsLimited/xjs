/// <reference path="../../../defs/es6-promise.d.ts" />

import {Item as iItem} from '../../internal/item';
import {Color} from '../../util/color';

export enum ChromaKeyingType {
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
  isChromaEnabled(): Promise<boolean>; // prop:key_chromakey //
  setChromaEnabled(value: boolean);
  getChromaKeyingType(): Promise<ChromaKeyingType>; // prop:key_chromakeytype
  setChromaKeyingType(value: ChromaKeyingType);

  // BOTH CHROMA LEGACY AND CHROMA RGB
  getChromaAntiAlias(): Promise<ChromaAntiAliasLevel>; // prop:key_antialiasing
  setChromaAntiAlias(value: ChromaAntiAliasLevel);

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
  getChromaRGBKeyBalance(): Promise<number>; // prop:key_chromargbkeybalance. Exposure
  setChromaRGBKeyBalance(value: number);

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
}
