/**
 *  A CuePoint represents a configurable object for items that
 *  support cue points. Check `getCuePoints()` and other related methods of
 *  {@link #core/MediaItem#getCuePoints Core/MediaItem}.
 */
export class CuePoint {
  private _time: number;
  private _action: string;

  constructor(time: number, action: string) {
    this._time = time;
    this._action = action;
  }

  toString(): string {
    return String(this._time * 10000000) + this._action;
  }

  /**
   * param: number
   *
   * Sets this cue point's time in seconds, with precision up to 100ns.
   */
  setTime(time: number) {
    this._time = time;
  }

  /**
   *  param: string
   *
   *  Sets the action to be performed on the cue point. Choose any of the
   *  following values: CuePoint.PAUSE, CuePoint.RESUME, CuePoint.CUT.
   */
  setAction(action: string) {
    if (action === CuePoint.PAUSE || action === CuePoint.RESUME ||
      action === CuePoint.CUT) {
      this._action = action;
    } else {
      throw new Error('Trying to set to an invalid Cue Point action.');
    }
  }

  /**
   * return: number
   *
   * Gets the time in seconds corresponding to this cue point, with precision
   * up to 100ns.
   */
  getTime(): number {
    return this._time / 10000000;
  }

  /**
   *  return: string
   *
   *  Gets the action to be performed on the cue point, which may be any of the
   *  following: CuePoint.PAUSE, CuePoint.RESUME, CuePoint.CUT.
   */
  getAction(): string {
    return this._action;
  }

  static _fromString(value: string): CuePoint {
    const [time, action] = [value.substring(0, value.length - 1),
      value.charAt(value.length - 1)]
    return new CuePoint(Number(time), action);
  }

  static PAUSE: string = 'p';
  static RESUME: string = 'r';
  static CUT: string = 's';
}
