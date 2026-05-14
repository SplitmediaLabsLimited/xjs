import { Color } from '../../util/color';
/**
 *  Used by items that implement the Chroma interface.
 *  Check `getKeyingType()`/`setKeyingType()` method of
 *  {@link #core/CameraItem#getKeyingType Core/CameraItem},
 *  {@link #core/GameItem#getKeyingType Core/GameItem}, and
 *  {@link #core/HtmlItem#getKeyingType Core/HtmlItem}.
 */
export declare enum KeyingType {
    LEGACY = 0,// Chroma Key Legacy Mode
    COLORKEY = 1,// Color Key Mode
    RGBKEY = 2
}
/**
 *  Used by items that implement the Chroma interface, when using RGB mode
 *  Chroma Key.
 *
 *  Check `getChromaRGBKeyPrimaryColor()`/`setChromaRGBKeyPrimaryColor()` method
 *  of {@link #core/CameraItem#getChromaRGBKeyPrimaryColor Core/CameraItem},
 *  {@link #core/GameItem#getChromaRGBKeyPrimaryColor Core/GameItem}, and
 *  {@link #core/HtmlItem#getChromaRGBKeyPrimaryColor Core/HtmlItem}.
 */
export declare enum ChromaPrimaryColors {
    RED = 0,
    GREEN = 1,
    BLUE = 2
}
/**
 *  Used by items that implement the Chroma interface.
 *
 *  Check `getChromaAntiAliasLevel()`/`setChromaAntiAliasLevel()` method
 *  of {@link #core/CameraItem#getChromaAntiAliasLevel Core/CameraItem},
 *  {@link #core/GameItem#getChromaAntiAliasLevel Core/GameItem}, and
 *  {@link #core/HtmlItem#getChromaAntiAliasLevel Core/HtmlItem}.
 */
export declare enum ChromaAntiAliasLevel {
    NONE = 0,
    LOW = 1,
    HIGH = 2
}
export interface IItemChroma {
    /**
     * return: Promise<boolean>
     *
     * Determines whether any type of chroma keying is enabled.
     */
    isChromaEnabled(): Promise<boolean>;
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
    getKeyingType(): Promise<KeyingType>;
    /**
     * param: (value: KeyingType)
     *
     * Sets the chroma keying scheme to any one of three possible choices: Chroma RGB Key, Color Key, or Legacy Mode.
     *
     * *Chainable.*
     *
     * After setting the keying type, you may tweak settings specific to that type.
     * - RGB Key: methods prefixed with `getChromaRGBKey-*` or `setChromaRGBKey-*`
     * - Color Key: methods prefixed with `getChromaColorKey-*` or `setChromaColorKey-*`
     * - Chroma Legacy Mode: methods prefixed with `getChromaLegacy-*` or `setChromaLegacy-*`
     */
    setKeyingType(value: KeyingType): Promise<IItemChroma>;
    /**
     * return: Promise<ChromaAntiAliasLevel>
     *
     * Gets the antialiasing level for chroma keying.
     */
    getChromaAntiAliasLevel(): Promise<ChromaAntiAliasLevel>;
    /**
     * param: (value: ChromaAntiAliasLevel)
     *
     * Sets the antialiasing level for chroma keying.
     *
     * *Chainable.*
     */
    setChromaAntiAliasLevel(value: ChromaAntiAliasLevel): any;
    /**
     * return: Promise<number>
     *
     * Gets the brightness setting (0-255). Only relevant when chroma keying is in Legacy mode.
     */
    getChromaLegacyBrightness(): Promise<number>;
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
    getChromaLegacySaturation(): Promise<number>;
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
    getChromaLegacyHue(): Promise<number>;
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
    getChromaLegacyThreshold(): Promise<number>;
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
    getChromaLegacyAlphaSmoothing(): Promise<number>;
    /**
     * param: (value: number)
     *
     * Sets the alpha smoothing setting (0-255). Only relevant when chroma keying is in Legacy mode.
     *
     * *Chainable.*
     */
    setChromaLegacyAlphaSmoothing(value: number): Promise<IItemChroma>;
    /**
     * return: Promise<ChromaPrimaryColors>
     *
     * Gets the primary color setting for chroma key. Only relevant when chroma keying is in RGB mode.
     */
    getChromaRGBKeyPrimaryColor(): Promise<ChromaPrimaryColors>;
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
    getChromaRGBKeyThreshold(): Promise<number>;
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
    getChromaRGBKeyExposure(): Promise<number>;
    /**
     * param: (value: number)
     *
     * Sets the exposure setting (0-255). Only relevant when chroma keying is in RGB mode.
     *
     * *Chainable.*
     */
    setChromaRGBKeyExposure(value: number): Promise<IItemChroma>;
    /**
     * return: Promise<number>
     *
     * Gets the threshold setting (0-255). Only relevant when chroma keying is in color key mode.
     */
    getChromaColorKeyThreshold(): Promise<number>;
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
    getChromaColorKeyExposure(): Promise<number>;
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
    getChromaColorKeyColor(): Promise<Color>;
    /**
     * param: (value: Color)
     *
     * Sets the color setting for keying in color key mode.
     *
     * *Chainable.*
     */
    setChromaColorKeyColor(value: Color): Promise<IItemChroma>;
}
export declare class ItemChroma implements IItemChroma {
    private _id;
    isChromaEnabled(): Promise<boolean>;
    setChromaEnabled(value: boolean): Promise<ItemChroma>;
    getKeyingType(): Promise<KeyingType>;
    setKeyingType(value: KeyingType): Promise<ItemChroma>;
    getChromaAntiAliasLevel(): Promise<ChromaAntiAliasLevel>;
    setChromaAntiAliasLevel(value: ChromaAntiAliasLevel): Promise<ItemChroma>;
    getChromaLegacyBrightness(): Promise<number>;
    setChromaLegacyBrightness(value: number): Promise<ItemChroma>;
    getChromaLegacySaturation(): Promise<number>;
    setChromaLegacySaturation(value: number): Promise<ItemChroma>;
    getChromaLegacyHue(): Promise<number>;
    setChromaLegacyHue(value: number): Promise<ItemChroma>;
    getChromaLegacyThreshold(): Promise<number>;
    setChromaLegacyThreshold(value: number): Promise<ItemChroma>;
    getChromaLegacyAlphaSmoothing(): Promise<number>;
    setChromaLegacyAlphaSmoothing(value: number): Promise<ItemChroma>;
    getChromaRGBKeyPrimaryColor(): Promise<ChromaPrimaryColors>;
    setChromaRGBKeyPrimaryColor(value: ChromaPrimaryColors): Promise<ItemChroma>;
    getChromaRGBKeyThreshold(): Promise<number>;
    setChromaRGBKeyThreshold(value: number): Promise<ItemChroma>;
    getChromaRGBKeyExposure(): Promise<number>;
    setChromaRGBKeyExposure(value: number): Promise<ItemChroma>;
    getChromaColorKeyThreshold(): Promise<number>;
    setChromaColorKeyThreshold(value: number): Promise<ItemChroma>;
    getChromaColorKeyExposure(): Promise<number>;
    setChromaColorKeyExposure(value: number): Promise<ItemChroma>;
    getChromaColorKeyColor(): Promise<Color>;
    setChromaColorKeyColor(value: Color): Promise<ItemChroma>;
}
