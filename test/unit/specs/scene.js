/* globals describe, it, expect, require, beforeEach */

describe('Scene', function() {
  'use strict';

  var XJS = require('xjs');
  var Scene = XJS.Scene;
  var env = new window.Environment(XJS);

  var MAX_SCENES = 12;

  describe('should be able to fetch a specific scene by index', function() {
    it('as a Scene object', function() {
      for (var i = 1; i <= MAX_SCENES; i++) {
        expect(Scene.get(i)).toBeInstanceOf(Scene);
      }
    });
  });

  describe('should be able to fetch current scene', function() {
    beforeEach(function() {
      if (!/xsplit broadcaster/ig.test(navigator.appVersion)) {
        spyOn(window.external, 'AppGetPropertyAsync')
          .and.callFake(function(funcName) {
          if (funcName === 'preset:0') {
            var rand=Math.floor(Math.random()*1000);

            setTimeout(function() {
              window.OnAsyncCallback(rand, '5');
            },10);

            return rand;
          }
        });
      }
      this.promise = Scene.getActiveScene();
    });

    it('through a promise', function() {
      expect(this.promise).toBeInstanceOf(Promise);
    });

    it('as a Scene object', function(done) {
      this.promise.then(function(scene) {
        expect(scene).toBeInstanceOf(Scene);
        done();
      });
    });
  });

  describe('object instance', function() {
    var scene;

    beforeAll(function(done) {
      if (!/xsplit broadcaster/ig.test(navigator.appVersion)) {
        spyOn(window.external, 'AppGetPropertyAsync')
          .and.callFake(function(funcName) {
          var rand=Math.floor(Math.random()*1000);
          if (funcName === 'preset:0') {
            setTimeout(function() {
              window.OnAsyncCallback(rand, '5');
            },10);
          } else if (/^presetname:/.test(funcName)) {
            setTimeout(function() {
              window.OnAsyncCallback(rand, 'DummyText');
            },10);
          }

          return rand;
        });

        spyOn(window.external, 'AppSetPropertyAsync')
          .and.callFake(function(funcName) {
          var rand=Math.floor(Math.random()*1000);
          if (/^presetname:/.test(funcName)) {
            setTimeout(function() {
              window.OnAsyncCallback(rand, '2');
            },10);
          }

          return rand;
        });
      }

      Scene.getActiveScene().then(function(result) {
        scene = result;
        done();
      });
    });

    it('should be able to get the scene ID', function(done) {
      scene.getSceneNumber().then(function(id) {
        expect(id).toBeTypeOf('number');
        expect(id).not.toBeNaN();
        done();
      });
    });

    it('should be able to get the scene name', function(done) {
      scene.getName().then(function(name) {
        expect(name).toBeTypeOf('string');
        done();
      });
    });

    it('should be able to set the scene name', function(done) {
      var rand;
      var string = "";
      var environments = ['config', 'script', 'html'];

      for (var i = 0; i < 5; i++) {
        rand = Math.floor(Math.random() * 25) + 65;
        string += String.fromCharCode(rand);
      }

      env.set(environments[0]);
      scene.setName(string).then(function(res) {
        expect(res).toBeTypeOf('boolean');
        env.set(environments[1]);
        return scene.setName(string);
      }).then(function(res) {
        expect(res).toBeTypeOf('boolean');
        env.set(environments[2]);
        return scene.setName(string);
      }).catch(function(err) {
        expect(err).toEqual(jasmine.any(Error));
        done();
      });
    });
  });
});
