/* globals describe, it, spyOn, require, beforeEach, expect, jasmine */

describe('Extension Class', function() {
  'use strict';

  var xjs = require('xjs');
  var env = new window.Environment(xjs);
  var extension;
  var local = {};
  var testObj = {
    test : 'data'
  };

  var ctr = 0;

  beforeEach(function(done) {
    env.set('extension');
    spyOn(window.external, 'SetPresProperty')
      .and.callFake(function(presName, val) {
        local[presName] = val;
    });

    spyOn(window.external, 'GetPresProperty')
      .and.callFake(function(presName) {
      ctr++;
      var asyncId = 'iextension_' + ctr;

      setTimeout(function() {
        window.OnAsyncCallback(asyncId, local[presName]);
      }, 10);

      return asyncId;
    });

    done();
  });

  it('should be able to fetch its own instance', function() {
    if (xjs.Environment.isExtension()) {
      extension = xjs.Extension.getInstance();
      expect(extension).toBeInstanceOf(xjs.Extension);
    } else {
      expect(xjs.Extension.getInstance).toThrow();
    }
  });

  it('should be able to save configuration', function(done) {
    if (xjs.Environment.isExtension()) {
      extension.saveConfig(testObj).then(function(ret) {
        expect(ret).toBeInstanceOf(xjs.Extension);
        done();
      });
    } else {
      expect(extension).toBeUndefined();
      done();
    }
  });

  it('should be able to fetch the configuration', function(done) {
    if (xjs.Environment.isExtension()) {
      extension.loadConfig().then(function(config) {
        var keys = Object.keys(testObj);

        for (var i = 0; i < keys.length; i++) {
          expect(config[keys[i]]).toBeDefined();
        }

        done();
      });
    } else {
      expect(extension).toBeUndefined();
      done();
    }
  });
});
