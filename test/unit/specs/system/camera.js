/* globals describe, it, expect, require */

describe('Camera', function() {
  'use strict';

  var xjs = require('xjs');
  var System = xjs.System;

  describe('should list camera devices', function() {
    var promise;

    it('through a promise', function() {
      promise = System.getCameraDevices();
      expect(promise).toBeInstanceOf(Promise);
    });

    it('as an array', function() {
      promise.then(function(devices) {
        expect(devices).toBeInstanceOf(Array);
      });
    });

    it('with correct properties', function() {
      promise.then(function(devices) {
        expect(devices).eachHasProperties('disp');
        expect(devices).eachHasProperties('name');
      });
    });

   it('excludes XSplit camera devices', function() {
      promise.then(function(devices) {
        for (var i = devices.length - 1; i >= 0; i--) {
          expect(devices[i].name.toLowerCase().indexOf('xsplit')).toBe(-1);
        }
      });
    });
  });
});
