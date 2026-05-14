/* globals describe, it, spyOn, require, beforeEach, expect, jasmine */

describe('SourcePluginWindow ===', () => {
  var XJS = require('xjs');
  var SourcePluginWindow = XJS.SourcePluginWindow;
  var env = new window.Environment(XJS);
  var environments = ['props', 'extension', 'plugin'];
  var appVersion = navigator.appVersion;

  describe('should be able to listen to source-related events', () => {
    beforeEach(() => {
      env.set(environments[2]);
      navigator.__defineGetter__('appVersion', () => 'XSplit Broadcaster 2.8.1606.1701 ');
    });

    it('save config', (done) => {
      var testData = randomWord(20);
      SourcePluginWindow.on('save-config', (data) => {
        expect(data).toEqual(testData);
        done();
      });

      var messageData = {
        request: 'saveConfig',
        data: testData,
      };
      window.MessageSource(JSON.stringify(messageData));
    });

    it('apply config', (done) => {
      var testData = randomWord(20);
      SourcePluginWindow.on('apply-config', (data) => {
        expect(data).toEqual(testData);
        done();
      });

      var messageData = {
        request: 'applyConfig',
        data: testData,
      };
      window.MessageSource(JSON.stringify(messageData));
    });

    it('set background color', (done) => {
      var testColor = randomColor().substr(1);
      SourcePluginWindow.on('set-background-color', (hex) => {
        expect(hex).toEqual(testColor);
        done();
      });
      window.setBackGroundColor(testColor);
    });
  });

  describe('should be able to listen to scene-related events', () => {
    var someOtherEventSpy;
    beforeEach(() => {
      env.set(environments[2]);
      navigator.__defineGetter__('appVersion', () => 'XSplit Broadcaster 2.8.1606.1701 ');

      someOtherEventSpy = spyOn(console, 'warn');
    });

    it('scene delete', (done) => {
      SourcePluginWindow.on('scene-delete', (sceneIndex) => {
        expect(sceneIndex).toBeTypeOf('number');
        done();
      });
      window.SetEvent('event=SceneDeleted&index=9');
    });

    it('scene load', (done) => {
      SourcePluginWindow.on('scene-load', () => {
        expect(true).toBe(true);
        done();
      });
      window.OnSceneLoad();
    });

    it('and warn if event is not supported', () => {
      SourcePluginWindow.on('some-other-event', () => {});
      expect(someOtherEventSpy).toHaveBeenCalled();
    });

    it('but throws an error when called not from source', () => {
      expect(() => {
        navigator.__defineGetter__('appVersion', () => appVersion);
        // for testing purposes, we set SourcePluginWindow instance to undefined
        // in order to instantiate SourcePluginWindow from constructor
        SourcePluginWindow._instance = undefined;
        env.set(environments[1]);
        var newTest = SourcePluginWindow.getInstance();
      }).toThrow();
    });
  });
});
