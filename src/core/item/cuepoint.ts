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

  setTime(time: number) {
    this._time = time;
  }

  setAction(action: string) {
    this._action = action;
  }

  getTime(): number {
    return this._time / 10000000;
  }

  getAction(): string {
    return this._action;
  }

  static _fromString(value: string): CuePoint {
    const [time, action] = [value.substring(0, value.length - 1),
      value.charAt(value.length)]
    return new CuePoint(Number(time), action);
  }

  static PAUSE: string = 'p';
  static RESUME: string = 'r';
  static CUT: string = 's';
}
