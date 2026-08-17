/* globals describe, it, expect, require, beforeAll, spyOn */

describe('Camera', function() {
  'use strict';

  var XJS = require('xjs');
  var System = XJS.System;
  var ctr = 0;

  describe('should list camera devices', function() {
    var promise;

    beforeEach(function() {
      if (!/xsplit broadcaster/ig.test(navigator.appVersion)) {
        spyOn(window.external, 'AppGetPropertyAsync')
          .and.callFake(function(funcName) {
            ctr++;
            var asyncId = 'camera_' + ctr;
            if(funcName === 'dshowenum:vsrc') {
              setTimeout(function() {
                window.OnAsyncCallback(asyncId, '<list>' +
                  '<dev disp="@device:sw:{860BB310-5D01-11D0-BD3B-00A0C911CE86}' +
                  '\\{778ABFB2-E87B-48A2-8D33-675150FCF8A2}"' +
                  ' name="TriDef SmartCam"/>' +
                  '<dev disp="@DEVICE:PNP:\\\\?\\USB#VID_8086&PID_0A66&MI_02#"' +
                  ' name="Intel(R) RealSense(TM) 3D Camera Virtual Driver"/>' +
                  '<dev disp="@DEVICE:PNP:\\?\USB#VID_8086&PID_0AA5&MI_02#"' +
                  ' name="Intel(R) RealSense(TM) Camera SR300 Virtual Driver"/>' +
                  '<dev disp="clsid:{39F50F4C-99E1-464A-B6F9-D605B4FB5918}"' +
                  ' name="Elgato Game Capture HD"/>' +
                  '<dev disp="@device:pnp:\\\\?\\usb#vid_046d&amp;pid_082c' +
                  '&amp;mi_02#6&amp;37c59c5d&amp;0&amp;0002#' +
                  '{65e8773d-8f56-11d0-a3b9-00a0c9223196}\\global"' +
                  ' name="HD Webcam C615"/>' +
                  '<dev disp="@device:sw:{860BB310-5D01-11D0-BD3B-00A0C911CE86}' +
                  '\\{VHSplitProc}_XSplitBroadcaster_1_staticsource_VIDEO"' +
                  ' name="XSplitBroadcaster"/></list>');
              }, 10);
            }
            return asyncId;
          });
      }
      promise = System.getCameraDevices();
    });

    it('through a promise', function() {
      promise = System.getCameraDevices();
      expect(promise).toBeInstanceOf(Promise);
    });

    it('as an array', function(done) {
      promise.then(function(devices) {
        expect(devices).toBeInstanceOf(Array);
        done();
      });
    });

    it('with correct properties', function(done) {
      promise.then(function(devices) {
        expect(devices)
          .eachHasMethods(['getName', 'getId'].join(','));
          done();
      });
    });

   it('excludes XSplit camera devices, Intel realsense and Tridef Smart Cam', function(done) {
      promise.then(function(devices) {
        for (var i = devices.length - 1; i >= 0; i--) {
          expect(devices[i].getName().toLowerCase().indexOf(('xsplit').toLowerCase())).toBe(-1);
          expect(devices[i].getName().toLowerCase().indexOf(('Intel(R) RealSense(TM) 3D Camera Virtual Driver').toLowerCase())).toBe(-1);
          expect(devices[i].getName().toLowerCase().indexOf(('Intel(R) RealSense(TM) Camera SR300 Virtual Driver').toLowerCase())).toBe(-1);
          expect(devices[i].getId().toLowerCase().indexOf(('@DEVICE:PNP:\\\\?\\USB#VID_8086&PID_0AA5&MI_02#').toLowerCase())).toBe(-1);
          expect(devices[i].getId().toLowerCase().indexOf(('@DEVICE:PNP:\\\\?\\USB#VID_8086&PID_0A66&MI_02#').toLowerCase())).toBe(-1);
          expect(devices[i].getId().toLowerCase())
            .not.toEqual(("@DEVICE:SW:{860BB310-5D01-11D0-BD3B-00A0C911CE86}\\" + 
            "{778abfb2-e87b-48a2-8d33-675150fcf8a2}").toLowerCase());
          var id = devices[i].getId().toLowerCase();
          var idComp = ("@DEVICE:SW:{860BB310-5D01-11D0-BD3B-00A0C911CE86}\\" +
            "{778abfb2-e87b-48a2-8d33-675150fcf8a2}").toLowerCase();
        }
        done();
      });
    });
  });

  describe('system camera devices', function() {
    var promise;

    beforeEach(function() {
      if (!/xsplit broadcaster/ig.test(navigator.appVersion)) {
        spyOn(window.external, 'AppGetPropertyAsync')
          .and.callFake(function(funcName) {
            ctr++;
            var asyncId = 'camera_' + ctr;
            if(funcName === 'dshowenum:vsrc') {
              setTimeout(function() {
                window.OnAsyncCallback(asyncId, '<list>' +
                  '<dev disp="@device:pnp:\\\\?\\usb#vid_046d&amp;pid_082c' +
                  '&amp;mi_02#6&amp;37c59c5d&amp;0&amp;0002#' +
                  '{65e8773d-8f56-11d0-a3b9-00a0c9223196}\\global"' +
                  ' name="HD Webcam C615"/></list>');
              }, 10);
            }
            return asyncId;
          });
      }
      promise = System.getCameraDevices();
    });

    it('should have a string id', function(done) {
      promise.then(function(devices) {
        expect(devices[0].getId()).toBeTypeOf('string');
        done();
      });
    });

    it('should have a string name', function(done) {
      promise.then(function(devices) {
        expect(devices[0].getName()).toBeTypeOf('string');
        done();
      });
    });
  });
});
