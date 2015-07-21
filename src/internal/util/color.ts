export class Color {
  private rgb: string;
  private irgb: number;
  private bgr: string;
  private ibgr: number;

  constructor( props: { rgb: string } |
              { irgb: number } |
              { bgr: string } |
              { ibgr: number }) {
    if (props['rgb'] !== undefined) {
      this.setRgb(props['rgb']);
    } else if (props['irgb'] !== undefined) {
      this.setIrgb(props['irgb']);
    } else if (props['bgr'] !== undefined) {
      this.setBgr(props['bgr']);
    } else if (props['ibgr'] !== undefined) {
      this.setIbgr(props['ibgr']);
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

  getRgb() {
    return this.rgb;
  }

  private setRgb(rgb: string) {
    this.rgb = rgb.replace(/^#/, '');
    this.irgb = parseInt(this.rgb, 16);

    this.bgr = [this.rgb.substring(4, 6), this.rgb.substring(2, 4), 
    this.rgb.substring(0, 2)].join('');
    this.ibgr = parseInt(this.bgr, 16);
  }

  getBgr() {
    return this.bgr;
  }

  private setBgr(bgr: string) {
    this.setRgb([bgr.substring(4, 6), bgr.substring(2, 4), 
      bgr.substring(0, 2)
      ].join(''));
  }

  getIrgb() {
    return this.irgb;
  }

  private setIrgb(irgb: number) {
    let rgb = irgb.toString(16);

    while (rgb.length < 6) {
      rgb = '0' + rgb;
    }

    this.setRgb(rgb);
  }

  getIbgr() {
    return this.ibgr;
  }

  private setIbgr(ibgr:number) {
    var bgr = ibgr.toString(16);

    while (bgr.length < 6) {
      bgr = '0' + bgr;
    }

    this.setBgr(bgr);
  }
}

