/* globals describe, it, spyOn, require, beforeEach, expect, jasmine */

describe('SourcePluginWindow ===', function() {
  'use strict';

  var XJS = require('xjs');
  var SourcePluginWindow = XJS.SourcePluginWindow;
  var env = new window.Environment(XJS);
  var environments = ['props', 'extension', 'plugin'];
  var appVersion = navigator.appVersion;

  var randomWord = function(length) {
    var rand;
    var str = '';

    for (var i = 0; i < length; i++) {
      rand = Math.floor(Math.random() * 25) + 65; // A ~ Z
      str += String.fromCharCode(rand);
    }

    return str;
  };

  var randomColor = function() {
    return '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1,6).toUpperCase();
  };

  describe('should be able to listen to source-related events', function() {
    beforeEach(function() {
      env.set(environments[2]);
      navigator.__defineGetter__('appVersion', function() {
        return 'XSplit Broadcaster 2.8.1606.1701 ';
      });
    });

    it('save config', function(done) {
      var testData = randomWord(20);
      SourcePluginWindow.on('save-config', function(data) {
        expect(data).toEqual(testData);
        done();
      });
      
      var messageData = {
        request : 'saveConfig',
        data : testData
      };
      window.MessageSource(JSON.stringify(messageData));
    });

    it('apply config', function(done) {
      var testData = randomWord(20);
      SourcePluginWindow.on('apply-config', function(data) {
        expect(data).toEqual(testData);
        done();
      });
      
      var messageData = {
        request : 'applyConfig',
        data : testData
      };
      window.MessageSource(JSON.stringify(messageData));
    });

    it('set background color', function(done) {
      var testColor = randomColor().substr(1);
      SourcePluginWindow.on('set-background-color', function(hex) {
        expect(hex).toEqual(testColor);
        done();
      });
      window.setBackGroundColor(testColor);
    });
  });

  describe('should be able to listen to scene-related events', function() {
    var someOtherEventSpy;
    beforeEach(function() {
      env.set(environments[2]);
      navigator.__defineGetter__('appVersion', function() {
        return 'XSplit Broadcaster 2.8.1606.1701 ';
      });

      someOtherEventSpy = spyOn(console, 'warn');
    });

    it('scene delete', function(done) {
      SourcePluginWindow.on('scene-delete', function(sceneIndex) {
        expect(sceneIndex).toBeTypeOf('number');
        done();
      });
      window.SetEvent('event=SceneDeleted&index=9');
    });

    it('scene load', function(done) {
      SourcePluginWindow.on('scene-load', function() {
        expect(true).toBe(true);
        done()
      });
      window.OnSceneLoad();
    });

    it('and warn if event is not supported', function() {
      SourcePluginWindow.on('some-other-event', function() {
      });
      expect(someOtherEventSpy).toHaveBeenCalled();
    });

    it('but throws an error when called not from source', function() {
      expect(function() {
        navigator.__defineGetter__('appVersion', function() {
          return appVersion;
        });
        // for testing purposes, we set SourcePluginWindow instance to undefined
        // in order to instantiate SourcePluginWindow from constructor
        SourcePluginWindow._instance = undefined;
        env.set(environments[1]);
        var newTest = SourcePluginWindow.getInstance();
      }).toThrow();
    });
  });  
});