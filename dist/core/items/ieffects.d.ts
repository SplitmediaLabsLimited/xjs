import { Color } from '../../util/color';
import { Filter } from '../filter';
/**
 *  Used by sources that implement the Effect interface.
 *  Check `getMaskEffect()`/`setMaskEffect()` method of
 *  {@link #core/CameraItem#getMaskEffect Core/CameraItem},
 *  {@link #core/FlashItem#getMaskEffect Core/FlashItem},
 *  {@link #core/GameItem#getMaskEffect Core/GameItem},
 *  {@link #core/HtmlItem#getMaskEffect Core/HtmlItem},
 *  {@link #core/ImageItem#getMaskEffect Core/ImageItem},
 *  {@link #core/MediaItem#getMaskEffect Core/MediaItem}, and
 *  {@link #core/ScreenItem#getMaskEffect Core/ScreenItem}.
 */
export declare enum MaskEffect {
    NONE = 0,
    SHAPE = 1,
    FILE_BIND_TO_SOURCE = 2,
    FILE_BIND_TO_STAGE = 3
}
export interface IItemEffect {
    /**
     * return: Promise<MaskEffect>
     *
     * Determines the mask effect being used
     */
    getMaskEffect(): Promise<MaskEffect>;
    /**
     * param: (value: MaskEffect)
     *
     * Sets the mask effect to any one of three possible choices: Shape/Edge effects, File masking (both bind to stage and bind to source), or None(mask effect disabled).
     *
     * *Chainable.*
     *
     * After setting the mask effect, you may tweak settings specific to that effect.
     * - None
     * - Shape: methods prefixed with `getBorderEffect-*`, `getShadowEffect-*`, `setBorderEffect-*`, or `setShadowEffect-*`
     * - File: methods `getFileMask`, `setFileMask`, `showFileMaskingGuide` and `isFileMaskingGuideVisible`
     */
    setMaskEffect(value: MaskEffect): Promise<IItemEffect>;
    /**
     * return: Promise<number>
     *
     * Gets the border effect radius (0 - 100), relative to the size of the source.
     * Only relevant when mask effect is set to shape
     */
    getBorderEffectRadius(): Promise<number>;
    /**
     * param: (value: number)
     *
     * Sets the border effect radius (0 - 100), relative to the size of the source.
     * Only relevant when mask effect is set to shape
     *
     * *Chainable.*
     */
    setBorderEffectRadius(value: number): Promise<IItemEffect>;
    /**
     * return: Promise<number>
     *
     * Gets the border effect thickness (0 - 100), relative to the size of the source.
     * Only relevant when mask effect is set to shape
     */
    getBorderEffectThickness(): Promise<number>;
    /**
     * param: (value: number)
     *
     * Sets the border effect thickness (0 - 100), relative to the size of the source.
     * Only relevant when mask effect is set to shape
     *
     * *Chainable.*
     *
     * Note that since a source occupies its own 'window' in the XBC stage,
     * it is specifically made that the edge effects are still within the boundaries of the source,
     * such that increasing border thickness adds the layer inwards instead of outwards.
     */
    setBorderEffectThickness(value: number): Promise<IItemEffect>;
    /**
     * return: Promise<number>
     *
     * Gets the border effect opacity (0 - 100). Only relevant when mask effect is set to shape
     */
    getBorderEffectOpacity(): Promise<number>;
    /**
     * param: (value: number)
     *
     * Sets the border effect opacity (0 - 100). Only relevant when mask effect is set to shape
     *
     * *Chainable.*
     */
    setBorderEffectOpacity(value: number): Promise<IItemEffect>;
    /**
     * return: Promise<Color>
     *
     * Gets the border effect color. Only relevant when mask effect is set to shape
     */
    getBorderEffectColor(): Promise<Color>;
    /**
     * param: (value: Color)
     *
     * Sets the border effect color. Only relevant when mask effect is set to shape
     *
     * *Chainable.*
     */
    setBorderEffectColor(value: Color): Promise<IItemEffect>;
    /**
     * return: Promise<number>
     *
     * Gets the shadow effect thickness (0 - 100), relative to the size of the source.
     * Only relevant when mask effect is set to shape
     */
    getShadowEffectThickness(): Promise<number>;
    /**
     * param: (value: number)
     *
     * Sets the shadow effect thickness (0 - 100), relative to the size of the source.
     * Only relevant when mask effect is set to shape
     *
     * *Chainable.*
     *
     * Note that since a source occupies its own 'window' in the XBC stage,
     * it is specifically made that the edge effects are still within the boundaries of the source,
     * such that increasing thickness adds the layer inwards instead of outwards.
     */
    setShadowEffectThickness(value: number): Promise<IItemEffect>;
    /**
     * return: Promise<number>
     *
     * Gets the shadow effect blur (0 - 100). Only relevant when mask effect is set to shape
     */
    getShadowEffectBlur(): Promise<number>;
    /**
     * param: (value: number)
     *
     * Sets the shadow effect blur (0 - 100). Only relevant when mask effect is set to shape
     *
     * *Chainable.*
     */
    setShadowEffectBlur(value: number): Promise<IItemEffect>;
    /**
     * return: Promise<number>
     *
     * Gets the shadow effect opacity (0 - 100). Only relevant when mask effect is set to shape
     */
    getShadowEffectOpacity(): Promise<number>;
    /**
     * param: (value: number)
     *
     * Sets the shadow effect opacity (0 - 100). Only relevant when mask effect is set to shape
     *
     * *Chainable.*
     */
    setShadowEffectOpacity(value: number): Promise<IItemEffect>;
    /**
     * return: Promise<number>
     *
     * Gets the horizontal shadow effect offset (-100 to -100), relative to the size of the source.
     * Only relevant when mask effect is set to shape
     */
    getShadowEffectOffsetX(): Promise<number>;
    /**
     * param: (value: number)
     *
     * Sets the horizontal shadow effect offset (-100 to 100), relative to the size of the source.
     * Only relevant when mask effect is set to shape
     *
     * *Chainable.*
     *
     * A positive horizontal offset shifts the shadow to the right of the horizontal center at the background,
     * which visually seems to decrease the left portion of the shadow.
     * A negative horizontal offset in turn shifts the shadow to the left,
     * visually decreasing the right portion of the shadow.
     */
    setShadowEffectOffsetX(value: number): Promise<IItemEffect>;
    /**
     * return: Promise<number>
     *
     * Gets the vertical shadow effect offset (-100 to 100), relative to the size of the source.
     * Only relevant when mask effect is set to shape
     */
    getShadowEffectOffsetY(): Promise<number>;
    /**
     * param: (value: number)
     *
     * Sets the vertical shadow effect offset (-100 to 100), relative to the size of the source.
     * Only relevant when mask effect is set to shape
     *
     * *Chainable.*
     *
     * A positive vertical offset shifts the shadow below the vertical center at the background,
     * which visually seems to decrease the top portion of the shadow.
     * A negative vertical offset in turn shifts the shadow above,
     * visually decreasing the bottom portion of the shadow.
     */
    setShadowEffectOffsetY(value: number): Promise<IItemEffect>;
    /**
     * return: Promise<string>
     *
     * Determines the image used to mask the source. Only relevant when mask effect is set to file
     */
    getFileMask(): Promise<string>;
    /**
     * param: (value: string)
     *
     * Sets the image to be used used to mask the source. Only relevant when mask effect is set to file
     *
     * *Chainable.*
     *
     */
    setFileMask(value: string): Promise<IItemEffect>;
    /**
     * return: Promise<boolean>
     *
     * Check whether the file masking guide is visible or not. Only relevant when mask effect is set to file
     */
    isFileMaskingGuideVisible(): Promise<boolean>;
    /**
     * param: (value: boolean)
     *
     * shows or hides the file masking guide. Only relevant when mask effect is set to file
     *
     * *Chainable.*
     *
     * The file masking guide highlights the area of the source that is currently being masked.
     * Please note that resetting mask effect also resets this to false
     */
    showFileMaskingGuide(value: boolean): Promise<IItemEffect>;
    /**
     * return: Promise<Filter>
     *
     * Gets the post processing shader used
     */
    getFilter(): Promise<Filter>;
    /**
     * param: (value: Filter or transitionString)
     *
     * Sets the post processing shader to be used for the Item
     *
     * *Chainable.*
     */
    setFilter(value: any, config?: {
        intensity?: number;
        resourceFile?: string;
    }): Promise<IItemEffect>;
    /**
     * Removes the set post-processing shader used.
     * Similar to setting to NONE
     *
     * *Chainable.*
     */
    removeFilter(): Promise<IItemEffect>;
    /**
     * return: Promise<Filter>
     *
     * Gets the post-processing shader configurations
     * as an object possibly having properties such as:
     * - `intensity` : percentage of filter applied
     * - `resourceFile` : PNG image used as a reference for LUTs
     */
    getFilterConfig(): Promise<Object>;
}
export declare class ItemEffect implements IItemEffect {
    private _id;
    private _convertToHex;
    private _getEdgeEffectValue;
    private _setEdgeEffectValue;
    private _getRGBArray;
    getMaskEffect(): Promise<MaskEffect>;
    setMaskEffect(value: MaskEffect): Promise<ItemEffect>;
    getBorderEffectRadius(): Promise<number>;
    setBorderEffectRadius(value: number): Promise<ItemEffect>;
    getBorderEffectThickness(): Promise<number>;
    setBorderEffectThickness(value: number): Promise<ItemEffect>;
    getBorderEffectOpacity(): Promise<number>;
    setBorderEffectOpacity(value: number): Promise<ItemEffect>;
    getBorderEffectColor(): Promise<Color>;
    setBorderEffectColor(value: Color): Promise<ItemEffect>;
    getShadowEffectColor(): Promise<Color>;
    setShadowEffectColor(value: Color): Promise<ItemEffect>;
    getShadowEffectThickness(): Promise<number>;
    setShadowEffectThickness(value: number): Promise<ItemEffect>;
    getShadowEffectBlur(): Promise<number>;
    setShadowEffectBlur(value: number): Promise<ItemEffect>;
    getShadowEffectOpacity(): Promise<number>;
    setShadowEffectOpacity(value: number): Promise<ItemEffect>;
    getShadowEffectOffsetX(): Promise<number>;
    setShadowEffectOffsetX(value: number): Promise<ItemEffect>;
    getShadowEffectOffsetY(): Promise<number>;
    setShadowEffectOffsetY(value: number): Promise<ItemEffect>;
    getFileMask(): Promise<string>;
    setFileMask(value: string): Promise<ItemEffect>;
    isFileMaskingGuideVisible(): Promise<boolean>;
    showFileMaskingGuide(value: boolean): Promise<ItemEffect>;
    getFilter(): Promise<Filter>;
    setFilter(value: any, config?: {
        intensity?: number;
        resourceFile?: string;
    }): Promise<ItemEffect>;
    removeFilter(): Promise<ItemEffect>;
    getFilterConfig(): Promise<Object>;
}
