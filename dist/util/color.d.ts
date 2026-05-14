export declare class Color {
    private _rgb;
    private _irgb;
    private _bgr;
    private _ibgr;
    private _transparent;
    constructor(props: {
        rgb: string;
    } | {
        irgb: number;
    } | {
        bgr: string;
    } | {
        ibgr: number;
    } | {
        isTransparent: boolean;
    });
    static fromRGBString(rgb: string): Color;
    static fromRGBInt(irgb: number): Color;
    static fromBGRString(bgr: string): Color;
    static fromBGRInt(ibgr: number): Color;
    static fromTransparent(): Color;
    getRgb(): string;
    private setRgb;
    getBgr(): string;
    private setBgr;
    getIrgb(): number;
    private setIrgb;
    getIbgr(): number;
    private setIbgr;
    private setTransparent;
    isTransparent(): boolean;
}
