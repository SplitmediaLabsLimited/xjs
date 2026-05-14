import { Color } from '../../util/color';
export interface IItemColor {
    /**
     * return: Promise<number>
     *
     * Get item transparency value
     */
    getTransparency(): Promise<number>;
    /**
     * param: value<number>
     *
     * Set item transparency
     *
     * *Chainable.*
     */
    setTransparency(value: number): Promise<any>;
    /**
     * return: Promise<number>
     *
     * Get item brightness value
     */
    getBrightness(): Promise<number>;
    /**
     * param: value<number>
     *
     * Set item brightness
     *
     * *Chainable.*
     */
    setBrightness(value: number): Promise<any>;
    /**
     * return: Promise<number>
     *
     * Get item contrast value
     */
    getContrast(): Promise<number>;
    /**
     * param: value<number>
     *
     * Set item contrast
     *
     * *Chainable.*
     */
    setContrast(value: number): Promise<any>;
    /**
     * return: Promise<number>
     *
     * Get item hue value
     */
    getHue(): Promise<number>;
    /**
     * param: value<number>
     *
     * Set item hue
     *
     * *Chainable.*
     */
    setHue(value: number): Promise<any>;
    /**
     * return: Promise<number>
     *
     * Get item saturation value
     */
    getSaturation(): Promise<number>;
    /**
     * param: value<number>
     *
     * Set item saturation
     *
     * *Chainable.*
     */
    setSaturation(value: number): Promise<any>;
    /**
     * return: Promise<Color>
     *
     * Get border color
     */
    getBorderColor(): Promise<Color>;
    /**
     * param: value<Color>
     *
     * Set border color
     *
     * *Chainable.*
     */
    setBorderColor(value: Color): Promise<any>;
    /**
     * return: Promise<boolean>
     *
     * Determines whether item uses the full dynamic color range of 0-255 as opposed to the limited 16-235 range
     */
    isFullDynamicColorRange(): Promise<boolean>;
    /**
     * param: (value: boolean)
     *
     * Enables or disables use of 0-255 full dynamic color range
     *
     * *Chainable.*
     */
    setFullDynamicColorRange(value: boolean): Promise<IItemColor>;
}
export declare class ItemColor implements IItemColor {
    private _id;
    getTransparency(): Promise<number>;
    setTransparency(value: number): Promise<ItemColor>;
    getBrightness(): Promise<number>;
    setBrightness(value: number): Promise<ItemColor>;
    getContrast(): Promise<number>;
    setContrast(value: number): Promise<ItemColor>;
    getHue(): Promise<number>;
    setHue(value: number): Promise<ItemColor>;
    getSaturation(): Promise<number>;
    setSaturation(value: number): Promise<ItemColor>;
    getBorderColor(): Promise<Color>;
    setBorderColor(value: Color): Promise<ItemColor>;
    isFullDynamicColorRange(): Promise<boolean>;
    setFullDynamicColorRange(value: boolean): Promise<ItemColor>;
}
