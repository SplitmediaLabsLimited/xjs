/* globals describe, it, expect, require, beforeAll, spyOn */

describe('System', function() {
  'use strict';

  var XJS = require('xjs');
  var System = XJS.System;
  var Environment = XJS.Environment;
  var env = new window.Environment(XJS);
  var environments = ['config', 'extension', 'plugin'];
  var local = {};

  beforeAll(function() {
    if (!/xsplit broadcaster/ig.test(navigator.appVersion)) {
      spyOn(window.external, 'GetCursorPos')
        .and.callFake(function() {
          return local.x !== undefined && local.y !== undefined ?
            String(local.x) + ',' + String(local.y) :
            String(Math.floor(Math.random() * 100)) + ',' +
               String(Math.floor(Math.random() * 100));
        });
      spyOn(window.external, 'SetCursorPos')
        .and.callFake(function(x, y) {
          if (!isNaN(x) && !isNaN(y)) {
            local.x = String(x);
            local.y = String(y);
          }
        });
    }
  });

  it('should be able to fetch the cursor position', function(done) {
    env.set(environments[0]);
    System.getCursorPosition().then(function(pos) {
      if (!Environment.isSourcePlugin()) {
        expect(pos['x']).toBeTypeOf('number');
        expect(pos['y']).toBeTypeOf('number');
        expect(pos['x']).not.toBeNaN();
        expect(pos['y']).not.toBeNaN();
        if (!/xsplit broadcaster/ig.test(navigator.appVersion)) {
          env.set(environments[1]);
          return System.getCursorPosition();
        } else {
          done();
        }
      } else {
        done.fail('Should throw an error when executed in a source plugin');
      }
    }).then(function(pos) {
      if (!Environment.isSourcePlugin()) {
        expect(pos['x']).toBeTypeOf('number');
        expect(pos['y']).toBeTypeOf('number');
        expect(pos['x']).not.toBeNaN();
        expect(pos['y']).not.toBeNaN();
        env.set(environments[2]);
        return System.getCursorPosition();
      } else {
        done.fail('Should throw an error when executed in a source plugin');
      }
    }).catch(function(err) {
      expect(err).toEqual(jasmine.any(Error));
      done();
    });
  });

  it('should be able to set the cursor position', function(done) {
    var x = Math.floor(Math.random() * 100);
    var y = Math.floor(Math.random() * 100);
    env.set(environments[0]);
    System.setCursorPosition({x : x, y : y}).then(function(res) {
      if (!Environment.isSourcePlugin()) {
        System.getCursorPosition().then(function(pos) {
          expect(pos['x']).toEqual(x);
          expect(pos['y']).toEqual(y);
          if (!/xsplit broadcaster/ig.test(navigator.appVersion)) {
            env.set(environments[1]);
            return System.setCursorPosition({x : x, y : y});
          } else {
            done();
          }
        });
      } else {
        done.fail('Should throw an error when executed in a source plugin');
      }
    }).then(function(res) {
      if (!Environment.isSourcePlugin()) {
        System.getCursorPosition().then(function(pos) {
          expect(pos['x']).toEqual(x);
          expect(pos['y']).toEqual(y);
          env.set(environments[2]);
          return System.setCursorPosition({x : x, y : y});
        }).catch(function(err) {
          expect(err).toEqual(jasmine.any(Error));
          done();
        });
      } else {
        done.fail('Should throw an error when executed in a source plugin');
      }
    }).catch(function(err) {
      expect(err).toEqual(jasmine.any(Error));
      done();
    });
  });
});
