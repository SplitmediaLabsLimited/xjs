/* globals describe, it, expect, require, beforeEach, spyOn */

describe('Camera', function() {
  'use strict';

  var XJS = require('xjs');
  var System = XJS.System;

  describe('should list camera devices', function() {
    var promise;

    beforeEach(function() {
      promise = System.getAudioDevices();
      if (!/xsplit broadcaster/ig.test(navigator.appVersion)) {
        spyOn(window.external, 'AppGetPropertyAsync')
          .and.callFake(function(funcName) {
            if(funcName === 'wasapienum') {
              var randomNumber=Math.floor(Math.random()*1000);

              setTimeout(function() {
                window.OnAsyncCallback(randomNumber, '<list><dev disp="clsid:{39F50F4C-99E1-464A-B6F9-D605B4FB5918}" name="Elgato Game Capture HD"/><dev disp="@device:pnp:\\\\?\\usb#vid_046d&amp;pid_082c&amp;mi_02#6&amp;37c59c5d&amp;0&amp;0002#{65e8773d-8f56-11d0-a3b9-00a0c9223196}\\global" name="HD Webcam C615"/><dev disp="@device:sw:{860BB310-5D01-11D0-BD3B-00A0C911CE86}\\{VHSplitProc}_XSplitBroadcaster_1_staticsource_VIDEO" name="XSplitBroadcaster"/></list>');
              }, 10);
            }
          });
      }
    });

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
        expect(devices)
          .eachHasMethods(['getName', 'getFriendlyName'].join(','));
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

  describe('system camera devices', function() {
    var promise;

    beforeEach(function() {
      promise = System.getAudioDevices();
      if (!/xsplit broadcaster/ig.test(navigator.appVersion)) {
        spyOn(window.external, 'AppGetPropertyAsync')
          .and.callFake(function(funcName) {
            if(funcName === 'wasapienum') {
              var randomNumber=Math.floor(Math.random()*1000);

              setTimeout(function() {
                window.OnAsyncCallback(randomNumber, '<list><dev disp="@device:pnp:\\\\?\\usb#vid_046d&amp;pid_082c&amp;mi_02#6&amp;37c59c5d&amp;0&amp;0002#{65e8773d-8f56-11d0-a3b9-00a0c9223196}\\global" name="HD Webcam C615"/></list>');
              }, 10);
            }
          });
      }
    });

    it('should have a string name', function() {
      promise.then(function(devices) {
        expect(devices[0].getId()).toBeTypeOf(String);
      });
    });

    it('should have a string friendly name', function() {
      promise.then(function(devices) {
        expect(devices[0].getId()).toBeTypeOf(String);
      });
    });
  });
});
