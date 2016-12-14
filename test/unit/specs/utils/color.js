/* globals describe, it, spyOn, require, beforeEach, expect, jasmine */

describe('Color ===', function() {
  'use strict';

  var XJS = require('xjs');
  var Color = XJS.Color;
  
  var randomColor = function() {
    return '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1,6).toUpperCase();
  };

  describe('should be able to get different color formats', function() {
    var testColor;

    beforeEach(function() {
      testColor = Color.fromRGBString(randomColor());
    });

    it('such as RGB', function() {
      expect(testColor.getRgb()).toBeTypeOf('string');
    });

    it('such as BGR', function() {
      expect(testColor.getBgr()).toBeTypeOf('string');
    });

    it('such as Irgb', function() {
      expect(testColor.getIrgb()).toBeTypeOf('number');
    });

    it('such as Ibgr', function() {
      expect(testColor.getIbgr()).toBeTypeOf('number');
    });
  });

  describe('can be instantiated', function() {
    var newColor, bgrColor, rgbColor, ibgrColor, irgbColor;

    beforeAll(function() {
      newColor = Color.fromRGBString(randomColor());
      rgbColor = Color.fromRGBString(newColor.getRgb());
      bgrColor = Color.fromBGRString(newColor.getBgr());
      irgbColor = Color.fromRGBInt(newColor.getIrgb());
      ibgrColor = Color.fromBGRInt(newColor.getIbgr());
    });

    it('from an RGB string', function() {
      expect(rgbColor).toBeInstanceOf(Color);
      expect(rgbColor).toEqual(newColor);
    });

    it('from a BGR string', function() {
      expect(bgrColor).toBeInstanceOf(Color);
      expect(bgrColor).toEqual(newColor);
    });

    it('from an IRGB number', function() {
      expect(irgbColor).toBeInstanceOf(Color);
      expect(irgbColor).toEqual(newColor);
    });

    it('from an IBGR number', function() {
      expect(ibgrColor).toBeInstanceOf(Color);
      expect(ibgrColor).toEqual(newColor);
    });

  });
});