import { XML } from '../../internal/util/xml';
import { Rectangle } from '../../util/rectangle';
export interface ISourceScreen {
    /**
     * return: Promise<boolean>
     *
     * Checks if the Screen Capture Item captures a window based on
     * the window's title.
     */
    isStickToTitle(): Promise<boolean>;
    /**
     * param: Promise<boolean>
     * ```
     * return: Promise<ISourceScreen>
     * ```
     *
     * Set the Screen Capture to capture the window based on the window title.
     * Useful when capturing programs with multiple tabs, for you to only
     * capture a particular tab.
     */
    setStickToTitle(value: boolean): Promise<ISourceScreen>;
    /**
     * return Promise<boolean>
     *
     * Checks if the Screen Capture layered window is selected.
     */
    getCaptureLayered(): Promise<boolean>;
    /**
     * param: (value: boolean)
     * ```
     * return Promise<ISourceScreen>
     * ```
     *
     * Sets the Screen Capture Layered window
     */
    setCaptureLayered(value: boolean): Promise<ISourceScreen>;
    /**
     * return Promise<boolean>
     *
     * Checks if the Exclusive Window capture is selected.
     */
    getOptimizedCapture(): Promise<boolean>;
    /**
     * param: (value: boolean)
     * ```
     * return Promise<ISourceScreen>
     * ```
     *
     * Sets the Exclusive Window capture.
     */
    setOptimizedCapture(value: boolean): Promise<ISourceScreen>;
    /**
     * return: Promise<boolean>
     *
     * Checks if the Show mouse clicks is selected.
     *
     * ShowMouseClicks determine if you would want to display the clicks
     * you're doing inside your screen captured area.
     */
    getShowMouseClicks(): Promise<boolean>;
    /**
     * param: (value: boolean)
     * ```
     * return: Promise<ISourceScreen>
     * ```
     *
     * Sets the Show mouse clicks.
     *
     * ShowMouseClicks determine if you would want to display the clicks
     * you're doing inside your screen captured area.
     */
    setShowMouseClicks(value: boolean): Promise<ISourceScreen>;
    /**
     * return: Promise<boolean>
     *
     * Checks if the Show mouse is selected.
     *
     * ShowMouse determine if you would want to display the mouse on your
     * screen captured area.
     */
    getShowMouse(): Promise<boolean>;
    /**
     * param: (value: boolean)
     * ```
     * return: Promise<ISourceScreen>
     * ```
     *
     * Sets the Show Mouse.
     *
     * ShowMouse determine if you would want to display the mouse on your
     * screen captured area.
     */
    setShowMouse(value: boolean): Promise<ISourceScreen>;
    /**
     * return: Promise<Rectangle>
     *
     * Gets the Capture Area of the Screen Capture Item. Returns a Rectangle
     * object.
     *
     * See also: {@link #util/Rectangle Util/Rectangle}
     */
    getCaptureArea(): Promise<Rectangle>;
    /**
     * param: Promise<Rectangle>
     * ```
     * return: Promise<ISourceScreen>
     * ```
     *
     * Sets the Window Capture Area of the Screen Capture Item.
     *
     * *Chainable.*
     *
     * See also: {@link #util/Rectangle Util/Rectangle}
     */
    setCaptureArea(dimension: Rectangle): Promise<ISourceScreen>;
    /**
     * return: Promise<boolean>
     *
     * Checks if the Screen Capture Item only captures the
     * Client area (does not capture the title bar, menu bar, window border, etc.)
     */
    isClientArea(): Promise<boolean>;
    /**
     * param: Promise<boolean>
     * ```
     * return: Promise<ISourceScreen>
     * ```
     *
     * Set the Screen Capture to capture the Client area only or include
     * the titlebar, menu bar, window border, etc.
     */
    setClientArea(value: boolean): Promise<ISourceScreen>;
}
export declare class iSourceScreen implements ISourceScreen {
    private _id;
    private _value;
    private _isItemCall;
    private _srcId;
    private _checkPromise;
    private _sceneId;
    private _updateId;
    isStickToTitle(): Promise<boolean>;
    setStickToTitle(value: boolean): Promise<iSourceScreen>;
    getCaptureLayered(): Promise<boolean>;
    setCaptureLayered(value: boolean): Promise<iSourceScreen>;
    getOptimizedCapture(): Promise<boolean>;
    setOptimizedCapture(value: boolean): Promise<iSourceScreen>;
    getShowMouseClicks(): Promise<boolean>;
    setShowMouseClicks(value: boolean): Promise<iSourceScreen>;
    getShowMouse(): Promise<boolean>;
    setShowMouse(value: boolean): Promise<iSourceScreen>;
    getCaptureArea(): Promise<Rectangle>;
    setCaptureArea(dimension: Rectangle): Promise<iSourceScreen>;
    isClientArea(): Promise<boolean>;
    setClientArea(value: boolean): Promise<iSourceScreen>;
    getValue: () => Promise<string | XML>;
    setValue: (value: string | XML) => Promise<iSourceScreen>;
}
