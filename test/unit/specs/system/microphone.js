/* globals describe, it, expect, require, beforeAll, spyOn */

describe('Microphone', function() {
  'use strict';

  var XJS = require('xjs');
  var System = XJS.System;
  var ctr = 0;
  var mockAsrc = '<list><dev disp="@device:cm:{33D9A762-90C8-11D0-BD43-00A0C911CE86}\\wave:{AB89B0D7-5FD4-41A5-9E8D-2E2EC721713B}" name="Microphone (3- Logitech USB Headset H340)" WaveInId="0" EndpointGuid="{AB89B0D7-5FD4-41A5-9E8D-2E2EC721713B}" EndpointId="{0.0.1.00000000}.{ab89b0d7-5fd4-41a5-9e8d-2e2ec721713b}" DecklinkDev="USB Composite Device"/><dev disp="@device:cm:{33D9A762-90C8-11D0-BD43-00A0C911CE86}\\wave:{76CB6396-4A11-4D89-9478-6DC381BA64EF}" name="Microphone (DroidCam Virtual Audio)" WaveInId="3" EndpointGuid="{76CB6396-4A11-4D89-9478-6DC381BA64EF}" EndpointId="{0.0.1.00000000}.{76cb6396-4a11-4d89-9478-6dc381ba64ef}"/><dev disp="@device:cm:{33D9A762-90C8-11D0-BD43-00A0C911CE86}\\wave:{311BB428-C203-49B3-B1D6-E888603D03EA}" name="Microphone (HD Pro Webcam C920)" WaveInId="1" EndpointGuid="{311BB428-C203-49B3-B1D6-E888603D03EA}" EndpointId="{0.0.1.00000000}.{311bb428-c203-49b3-b1d6-e888603d03ea}" DecklinkDev="Logitech USB Camera (HD Pro Webcam C920)"/><dev disp="@device:cm:{33D9A762-90C8-11D0-BD43-00A0C911CE86}\\wave:{357DA48D-B9BB-4A54-A3DE-DE6D3F9AD19D}" name="MIDI (Elgato Sound Capture)" WaveInId="2" EndpointGuid="{357DA48D-B9BB-4A54-A3DE-DE6D3F9AD19D}" EndpointId="{0.0.1.00000000}.{357da48d-b9bb-4a54-a3de-de6d3f9ad19d}"/><dev disp="@device:sw:{33D9A762-90C8-11D0-BD43-00A0C911CE86}\\{VHSplitProc}_XSplitBroadcaster_1_staticsource_AUDIO" name="XSplitBroadcaster"/></list>'

  describe('should list microphone devices', function() {
    var promise;

    beforeEach(function() {
      if (!/xsplit broadcaster/ig.test(navigator.appVersion)) {
        spyOn(window.external, 'AppGetPropertyAsync')
          .and.callFake(function(funcName) {
            ctr++;
            var asyncId = 'microphone_' + ctr;
            if(funcName === 'dshowenum:asrc') {
              setTimeout(function() {
                window.OnAsyncCallback(asyncId, mockAsrc);
              }, 10);
            }
            return asyncId;
          });
      }
      promise = System.getMicrophones();
    });

    it('through a promise', function() {
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
          .eachHasMethods(['getName', 'getDisplayId'].join(','));
          done();
      });
    });
  });

  describe('system microphone devices', function() {
    var promise;

    beforeEach(function() {
      if (!/xsplit broadcaster/ig.test(navigator.appVersion)) {
        spyOn(window.external, 'AppGetPropertyAsync')
          .and.callFake(function(funcName) {
            ctr++;
            var asyncId = 'microphone_' + ctr;
            if(funcName === 'dshowenum:asrc') {
              setTimeout(function() {
                window.OnAsyncCallback(asyncId, mockAsrc);
              }, 10);
            }
            return asyncId;
          });
      }
      promise = System.getMicrophones();
    });

    it('should have a string id', function(done) {
      promise.then(function(devices) {
        expect(devices[0].getDisplayId()).toBeTypeOf('string');
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
