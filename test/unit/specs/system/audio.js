/* globals describe, it, expect, require, beforeEach, spyOn */

describe('Audio', function() {
  'use strict';

  var XJS = require('xjs');
  var System = XJS.System;

  describe('should list audio devices', function() {
    var promise;

    beforeEach(function() {
      promise = System.getAudioDevices();
      if (!/xsplit broadcaster/ig.test(navigator.appVersion)) {
        spyOn(window.external, 'AppGetPropertyAsync')
          .and.callFake(function(funcName) {
            if(funcName === 'wasapienum') {
              var randomNumber=Math.floor(Math.random()*1000);

              setTimeout(function() {
                window.OnAsyncCallback(randomNumber, '<list><dev name="Speakers (XSplit  Stream  Audio  Renderer)" adapter="XSplit  Stream  Audio  Renderer" adapterdev="Speakers" id="{0.0.0.00000000}.{95611a5d-84a5-4838-b5bd-4344bef36632}" DataFlow="Render" State="Active" DSoundGuid="{95611A5D-84A5-4838-B5BD-4344BEF36632}" WaveId="1"/><dev name="Microphone (HD Webcam C615)" adapter="HD Webcam C615" adapterdev="Microphone" id="{0.0.1.00000000}.{b7709bea-527e-4f60-afb0-cd36431972ad}" DataFlow="Capture" State="Active" DSoundGuid="{B7709BEA-527E-4F60-AFB0-CD36431972AD}" WaveId="1"/><dev name="Internal AUX Jack (NVIDIA High Definition Audio)" adapter="NVIDIA High Definition Audio" adapterdev="Internal AUX Jack" id="{0.0.1.00000000}.{edb3bf9a-bd62-43c2-8c3f-1b57d3cc602a}" DataFlow="Capture" State="Not present" DSoundGuid="{EDB3BF9A-BD62-43C2-8C3F-1B57D3CC602A}" WaveId=""/><dev name="Stereo Mix (Realtek High Definition Audio)" adapter="Realtek High Definition Audio" adapterdev="Stereo Mix" id="{0.0.1.00000000}.{fd0f34df-d9e8-4de9-a212-dfdc9cb75178}" DataFlow="Capture" State="Disabled" DSoundGuid="{FD0F34DF-D9E8-4DE9-A212-DFDC9CB75178}" WaveId=""/></list>');
              },10);
            }
          });
      }
    });

    it('through a promise', function() {
      expect(promise).toBeInstanceOf(Promise);
    });

    it('as an array', function() {
      promise.then(function(devices) {
        expect(devices).toBeInstanceOf(Array);
      });
    });

    it('with correct properties', function() {
      promise.then(function(devices) {
        expect(devices).eachHasMethods('getId');
        expect(devices).eachHasMethods('getName');
        expect(devices).eachHasMethods('getDataFlow');
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
