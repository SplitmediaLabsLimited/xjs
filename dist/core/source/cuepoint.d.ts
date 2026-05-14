/**
 *  A CuePoint represents a configurable object for sources that
 *  support cue points. Check `getCuePoints()` and other related methods of
 *  {@link #core/ISourcePlayback#getCuePoints getCuePoints}.
 */
export declare class CuePoint {
    private _time;
    private _action;
    constructor(time: number, action: string);
    toString(): string;
    /**
     * param: number
     *
     * Sets this cue point's time in seconds, with precision up to 100ns.
     */
    setTime(time: number): void;
    /**
     *  param: string
     *
     *  Sets the action to be performed on the cue point. Choose any of the
     *  following values: CuePoint.PAUSE, CuePoint.RESUME, CuePoint.CUT.
     */
    setAction(action: string): void;
    /**
     * return: number
     *
     * Gets the time in seconds corresponding to this cue point, with precision
     * up to 100ns.
     */
    getTime(): number;
    /**
     *  return: string
     *
     *  Gets the action to be performed on the cue point, which may be any of the
     *  following: CuePoint.PAUSE, CuePoint.RESUME, CuePoint.CUT.
     */
    getAction(): string;
    static _fromString(value: string): CuePoint;
    static PAUSE: string;
    static RESUME: string;
    static CUT: string;
}
