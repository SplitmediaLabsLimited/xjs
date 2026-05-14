/* globals describe, it, spyOn, require, beforeEach, expect, jasmine */

describe('Color ===', () => {
  var XJS = require('xjs');
  var Color = XJS.Color;

  describe('should be able to get different color formats', () => {
    var testColor;

    beforeEach(() => {
      testColor = Color.fromRGBString(randomColor());
    });

    it('such as RGB', () => {
      expect(testColor.getRgb()).toBeTypeOf('string');
    });

    it('such as BGR', () => {
      expect(testColor.getBgr()).toBeTypeOf('string');
    });

    it('such as Irgb', () => {
      expect(testColor.getIrgb()).toBeTypeOf('number');
    });

    it('such as Ibgr', () => {
      expect(testColor.getIbgr()).toBeTypeOf('number');
    });
  });

  describe('can be instantiated', () => {
    var newColor, bgrColor, rgbColor, ibgrColor, irgbColor;

    beforeAll(() => {
      newColor = Color.fromRGBString(randomColor());
      rgbColor = Color.fromRGBString(newColor.getRgb());
      bgrColor = Color.fromBGRString(newColor.getBgr());
      irgbColor = Color.fromRGBInt(newColor.getIrgb());
      ibgrColor = Color.fromBGRInt(newColor.getIbgr());
    });

    it('from an RGB string', () => {
      expect(rgbColor).toBeInstanceOf(Color);
      expect(rgbColor).toEqual(newColor);
    });

    it('from a BGR string', () => {
      expect(bgrColor).toBeInstanceOf(Color);
      expect(bgrColor).toEqual(newColor);
    });

    it('from an IRGB number', () => {
      expect(irgbColor).toBeInstanceOf(Color);
      expect(irgbColor).toEqual(newColor);
    });

    it('from an IBGR number', () => {
      expect(ibgrColor).toBeInstanceOf(Color);
      expect(ibgrColor).toEqual(newColor);
    });
  });
});
