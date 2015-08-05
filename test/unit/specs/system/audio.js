/* globals describe, it, expect, require */

describe('Audio', function() {
  'use strict';

  var XJS = require('xjs');
  var System = XJS.System;

  describe('should list audio devices', function() {
    var promise;

    it('through a promise', function() {
      promise = System.getAudioDevices();
      expect(promise).toBeInstanceOf(Promise);
    });

    it('as an array', function() {
      promise.then(function(devices) {
        expect(devices).toBeInstanceOf(Array);
      });
    });

    it('with correct properties', function() {
      promise.then(function(devices) {
        expect(devices).eachHasProperties('id');
        expect(devices).eachHasProperties('name');
        expect(devices).eachHasProperties('DataFlow');
      });
    });

   it('excludes XSplit sound devices', function() {
      promise.then(function(devices) {
        for (var i = devices.length - 1; i >= 0; i--) {
          expect(devices[i].name.toLowerCase().indexOf('xsplit')).toBe(-1);
        }
      });
    });
  });
});
