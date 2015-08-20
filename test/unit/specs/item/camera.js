/* globals describe, it, expect, require, beforeEach, spyOn */

describe('CameraItem', function() {
  'use strict';

  var XJS = require('xjs');
  var CameraItem = XJS.CameraItem;
  var System = XJS.System;

  beforeEach(function() {
    if (!/xsplit broadcaster/ig.test(navigator.appVersion)) {
      spyOn(window.external, 'AppGetPropertyAsync')
        .and.callFake(function(funcName) {
        if (funcName === 'dshowenum:vsrc') {
          var rand=Math.floor(Math.random()*1000);

          setTimeout(function() {
            window.OnAsyncCallback(rand, '<list><dev disp="clsid:{39F50F4C-99E1-464A-B6F9-D605B4FB5918}" name="Elgato Game Capture HD"/><dev disp="@device:pnp:\\\\?\\usb#vid_046d&amp;pid_082c&amp;mi_02#6&amp;37c59c5d&amp;0&amp;0002#{65e8773d-8f56-11d0-a3b9-00a0c9223196}\\global" name="HD Webcam C615"/></list>');
          },10);

          return rand;
        }
      });
    }
  });

  it('should be created from a camera device', function(done) {
    System.getCameraDevices().then(function(devices) {
      expect( function() {new CameraItem(devices[devices.length-1]);} )
        .not.toThrow();
      done();
    });
  });

  describe('interface method checking', function() {

    beforeEach(function(done) {
      System.getCameraDevices().then(function(devices) {
        this.cameraItem = new CameraItem(devices[devices.length-1]);
        done();
      }.bind(this));
    });

    it('should implement the layout interface', function() {
      expect(this.cameraItem).hasMethods([
        'isKeepAspectRatio',
        'setKeepAspectRatio',
        'isPositionLocked',
        'setPositionLocked',
        'isEnhancedResizeEnabled',
        'setEnhancedResizeEnabled',
        'getPosition',
        'setPosition'
        ].join(','));
    });

    it('should implement the color interface', function() {
      expect(this.cameraItem).hasMethods([
        'getTransparency',
        'setTransparency',
        'getBrightness',
        'setBrightness',
        'getContrast',
        'setContrast',
        'getHue',
        'setHue',
        'getSaturation',
        'setSaturation',
        'getBorderColor',
        'setBorderColor'
        ].join(','));
    });

    it('should implement the chroma interface', function() {
      expect(this.cameraItem).hasMethods([
        'isChromaEnabled',
        'setChromaEnabled',
        'getChromaBrightness',
        'setChromaBrightness',
        'getChromaSaturation',
        'setChromaSaturation',
        'getChromaHue',
        'setChromaHue',
        'getChromaType',
        'setChromaType',
        'getChromaColor',
        'setChromaColor',
        'getChromaPrimaryColor',
        'setChromaPrimaryColor',
        'getChromaBalance',
        'setChromaBalance',
        'getChromaAntiAlias',
        'setChromaAntiAlias',
        'getChromaThreshold',
        'setChromaThreshold',
        'getChromaThresholdAA',
        'setChromaThresholdAA'
        ].join(','));
    });
  });


});
