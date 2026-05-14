import { XML } from '../../internal/util/xml';
export interface ISourceGame {
    /**
     * return: Promise<boolean>
     *
     * Check if Game Special Optimization is currently enabled or not
     */
    isSpecialOptimizationEnabled(): Promise<boolean>;
    /**
     * param: Promise<boolean>
     *
     * Set Game Special Optimization to on or off
     *
     * *Chainable.*
     */
    setSpecialOptimizationEnabled(value: boolean): Promise<ISourceGame>;
    /**
     * return: Promise<boolean>
     *
     * Check if Show Mouse is currently enabled or not
     */
    isShowMouseEnabled(): Promise<boolean>;
    /**
     * param: (value: boolean)
     *
     * Set Show Mouse in game to on or off
     *
     * *Chainable.*
     */
    setShowMouseEnabled(value: boolean): Promise<ISourceGame>;
    /**
     * param: path<string>
     *
     * Set the offline image of a game item
     *
     * *Chainable.*
     */
    setOfflineImage(path: string): Promise<ISourceGame>;
    /**
     * return: Promise<string>
     *
     * Get the offline image of a game item
     */
    getOfflineImage(): Promise<string>;
    /**
     * return: Promise<boolean>
     *
     * Get the transparency of a game item.
     * Please note that game source transparency only works if Game Special Optimization is also enabled.
     */
    isTransparent(): Promise<boolean>;
    /**
     * param: value<boolean>
     *
     * Set the transparency of a game source
     * Please note that game transparency only works if Game Special Optimization is also enabled.
     *
     * *Chainable.*
     */
    setTransparent(value: boolean): Promise<ISourceGame>;
    /**
     * return: Promise<number>
     *
     * Get the maximum number of frames per second the game is being limited to by XBC
     */
    getGameFPSCap(): Promise<number>;
    /**
     * param: path<string>
     *
     * Set the maximum number of frames per second the game is being limited to by XBC.
     * Accepter values are either 0 (disable capping) or within the range of 24 to 300 fps
     *
     * *Chainable.*
     */
    setGameFPSCap(fps: number): Promise<ISourceGame>;
}
export declare class iSourceGame implements ISourceGame {
    private _id;
    private _type;
    private _value;
    private _srcId;
    private _isItemCall;
    private _checkPromise;
    private _sceneId;
    private _updateId;
    isSpecialOptimizationEnabled(): Promise<boolean>;
    setSpecialOptimizationEnabled(value: boolean): Promise<iSourceGame>;
    isShowMouseEnabled(): Promise<boolean>;
    setShowMouseEnabled(value: boolean): Promise<iSourceGame>;
    setOfflineImage(path: string): Promise<iSourceGame>;
    getOfflineImage(): Promise<string>;
    isTransparent(): Promise<boolean>;
    setTransparent(value: boolean): Promise<iSourceGame>;
    getGameFPSCap(): Promise<number>;
    setGameFPSCap(value: number): Promise<iSourceGame>;
    getValue: () => Promise<string | XML>;
    setValue: (value: string | XML) => Promise<iSourceGame>;
}
