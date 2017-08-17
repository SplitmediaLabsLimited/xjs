export class Color {
  private _rgb: string;
  private _irgb: number;
  private _bgr: string;
  private _ibgr: number;
  private _transparent: boolean;

  constructor( props: { rgb: string } |
              { irgb: number } |
              { bgr: string } |
              { ibgr: number }|
              { isTransparent: boolean }) {
    if (props['rgb'] !== undefined) {
      this.setRgb(props['rgb']);
    } else if (props['irgb'] !== undefined) {
      this.setIrgb(props['irgb']);
    } else if (props['bgr'] !== undefined) {
      this.setBgr(props['bgr']);
    } else if (props['ibgr'] !== undefined) {
      this.setIbgr(props['ibgr']);
    } else if (props['isTransparent'] !== undefined && props['isTransparent'] === true) {
      this.setTransparent();
    } else {
      throw new Error('Do not call Color constructor without parameters.');
    }
  }

  static fromRGBString(rgb: string): Color {
    return new Color({ rgb: rgb });
  }

  static fromRGBInt(irgb: number): Color {
    return new Color({ irgb: irgb });
  }

  static fromBGRString(bgr: string): Color {
    return new Color({ bgr: bgr });
  }

  static fromBGRInt(ibgr: number): Color {
    return new Color({ ibgr: ibgr });
  }

  static fromTransparent(): Color {
    return new Color({ isTransparent: true });
  } 

  getRgb() {
    return this._rgb;
  }

  private setRgb(rgb: string): Color {
    this._rgb = rgb.replace(/^#/, '').toUpperCase();
    this._irgb = parseInt(this._rgb, 16);

    this._bgr = [this._rgb.substring(4, 6), this._rgb.substring(2, 4),
    this._rgb.substring(0, 2)].join('').toUpperCase();
    this._ibgr = parseInt(this._bgr, 16);
    this._transparent = false;
    return this;
  }

  getBgr() {
    return this._bgr;
  }

  private setBgr(bgr: string): Color {
    this.setRgb([bgr.substring(4, 6), bgr.substring(2, 4),
      bgr.substring(0, 2)
      ].join(''));

    return this;
  }

  getIrgb() {
    return this._irgb;
  }

  private setIrgb(irgb: number): Color {
    let rgb = irgb.toString(16);

    while (rgb.length < 6) {
      rgb = '0' + rgb;
    }

    this.setRgb(rgb);

    return this;
  }

  getIbgr() {
    return this._ibgr;
  }

  private setIbgr(ibgr:number): Color {
    var bgr = ibgr.toString(16);

    while (bgr.length < 6) {
      bgr = '0' + bgr;
    }

    this.setBgr(bgr);

    return this;
  }

  private setTransparent(): Color {
    this._rgb = '0';
    this._irgb = 0;
    this._bgr = '0';
    this._ibgr = 0;
    this._transparent = true;

    return this;
  }

  isTransparent() {
    return this._transparent;
  }
}

