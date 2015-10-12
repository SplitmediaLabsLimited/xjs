/* globals describe, it, spyOn, require, beforeEach, expect */

describe('Extension Class', function() {
  'use strict';

  var xjs = require('xjs');
  var env = new window.Environment(xjs);
  var extension;
  var local = {};
  var testObj = {
    test : 'data'
  };

  beforeEach(function(done) {
    if (!/xsplit broadcaster/ig.test(navigator.appVersion)) {
    env.set('extension');
      spyOn(window.external, 'SetPresProperty')
        .and.callFake(function(presName, val) {
          local[presName] = val;
      });

      spyOn(window.external, 'GetPresProperty')
        .and.callFake(function(presName) {
        var rand = Math.floor(Math.random()*1000);

        setTimeout(function() {
          window.OnAsyncCallback(rand, local[presName]);
        }, 10);

        return rand;
      });

      done();
    }
  });

  it('should be able to fetch its own instance', function() {
    extension = xjs.Extension.getInstance();
  });

  it('should be able to save configuration', function(done) {
    extension.saveConfig(testObj).then(function() {
      done();
    });
  });

  it('should be able to fetch the configuration', function(done) {
    extension.loadConfig().then(function(config) {
      var keys = Object.keys(testObj);

      for (var i = 0; i < keys.length; i++) {
        expect(config[keys[i]]).toBeDefined();
      }

      done();
    });
  });
});
