/* globals describe, it, expect, require, beforeEach, spyOn */

describe('Audio ===', function() {
  'use strict';

  var XJS = require('xjs');
  var System = XJS.System;
  var AudioDeviceDataflow = XJS.AudioDeviceDataflow;
  var AudioDeviceState = XJS.AudioDeviceState;
  var AudioDeviceSystemDisabled = XJS.AudioDevice.SYSTEM_LEVEL_MUTE;
  var AudioDeviceSystemEnabled = XJS.AudioDevice.SYSTEM_LEVEL_ENABLE;
  var AudioDeviceSystemMuteDisallowed = XJS.AudioDevice.SYSTEM_MUTE_CHANGE_NOT_ALLOWED;

  var mockWasapi = '<list>' +
    '<dev name="Speakers (XSplit  Stream  Audio  Renderer)"' +
    ' adapter="XSplit  Stream  Audio  Renderer"' +
    ' adapterdev="Speakers" id="{0.0.0.00000000}.' +
    '{95611a5d-84a5-4838-b5bd-4344bef36632}" DataFlow="Render"' +
    ' State="Active"' +
    ' DSoundGuid="{95611A5D-84A5-4838-B5BD-4344BEF36632}"' +
    ' WaveId="1"/><dev name="Microphone (HD Webcam C615)"' +
    ' adapter="HD Webcam C615" adapterdev="Microphone"' +
    ' id="{0.0.1.00000000}.' +
    '{b7709bea-527e-4f60-afb0-cd36431972ad}"' +
    ' DataFlow="Capture" State="Active"' +
    ' DSoundGuid="{B7709BEA-527E-4F60-AFB0-CD36431972AD}"' +
    ' WaveId="1"/>' +
    '<dev name="Internal AUX Jack (NVIDIA High Definition Audio)"' +
    ' adapter="NVIDIA High Definition Audio"' +
    ' adapterdev="Internal AUX Jack" id="{0.0.1.00000000}' +
    '.{edb3bf9a-bd62-43c2-8c3f-1b57d3cc602a}" DataFlow="Capture"' +
    ' State="Not present"' +
    ' DSoundGuid="{EDB3BF9A-BD62-43C2-8C3F-1B57D3CC602A}"' +
    ' WaveId=""/>' +
    '<dev name="Stereo Mix (Realtek High Definition Audio)"' +
    ' adapter="Realtek High Definition Audio"' +
    ' adapterdev="Stereo Mix" id="{0.0.1.00000000}.' +
    '{fd0f34df-d9e8-4de9-a212-dfdc9cb75178}"' +
    ' DataFlow="Capture" State="Active"' +
    ' DSoundGuid="{FD0F34DF-D9E8-4DE9-A212-DFDC9CB75178}"' +
    ' WaveId="" DefaultConsole="1" DefaultMultimedia="1" /></list>';

  describe('should list audio devices', function() {
    var promise;

    beforeEach(function() {

      if (!/xsplit broadcaster/ig.test(navigator.appVersion)) {
        spyOn(window.external, 'AppGetPropertyAsync')
          .and.callFake(function(funcName) {
            if(funcName === 'wasapienum') {
              var randomNumber = Math.floor(Math.random()*1000);

              setTimeout(function() {
                window.OnAsyncCallback(randomNumber, decodeURIComponent(mockWasapi));
              }, 10);
              return randomNumber;
            }
          });
      }
      promise = System.getAudioDevices();
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
          .eachHasMethods(['getId', 'getName', 'getDataFlow'].join(','));
        done();
      });
    });

    it('excludes XSplit sound devices', function(done) {
      promise.then(function(devices) {
        for (var i = devices.length - 1; i >= 0; i--) {
          expect(devices[i].getName().toLowerCase().indexOf('xsplit')).toBe(-1);
        }
        done();
      });
    });
  });

  describe('should allow audio device filters', function() {
    var promise;

    beforeEach(function() {

      if (!/xsplit broadcaster/ig.test(navigator.appVersion)) {
        spyOn(window.external, 'AppGetPropertyAsync')
          .and.callFake(function(funcName) {
            if(funcName === 'wasapienum') {
              var randomNumber = Math.floor(Math.random()*1000);

              setTimeout(function() {
                window.OnAsyncCallback(randomNumber,
                  decodeURIComponent(mockWasapi));
              }, 10);
              return randomNumber;
            }
          });
      }
    });

    it('allow dataflow filter', function(done) {
      promise = System.getAudioDevices(AudioDeviceDataflow.CAPTURE);
      promise.then(function(devices) {
        for (var i = devices.length - 1; i >= 0; i--) {
          expect(devices[i].getDataFlow()).toBe('Capture');
        }
        done();
      });
    });

    it('allow state filter', function(done) {
      promise = System.getAudioDevices(AudioDeviceDataflow.ALL,
        AudioDeviceState.ACTIVE);
      promise.then(function(devices) {
        for (var i = devices.length - 1; i >= 0; i--) {
          expect(devices[i]._state).toBe('Active');
        }
        done();
      });
    });
  });

  describe('system Audio', function() {
    var promise;

    beforeEach(function() {

      if (!/xsplit broadcaster/ig.test(navigator.appVersion)) {
        spyOn(window.external, 'AppGetPropertyAsync')
          .and.callFake(function(funcName) {
            if(funcName === 'wasapienum') {
              var randomNumber = Math.floor(Math.random()*1000);

              setTimeout(function() {
                window.OnAsyncCallback(randomNumber,
                  decodeURIComponent(mockWasapi));
              }, 10);
              return randomNumber;
            }
          });
      }
      promise = System.getAudioDevices();
    });

    it('should have a string ID', function(done) {
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

    it('should have a string dataflow', function(done) {
      promise.then(function(devices) {
        expect(devices[0].getDataFlow()).toBeTypeOf('string');
        done();
      });
    });

    it('can be determined if system default device or not', function(done) {
      promise.then(function(devices) {
        expect(devices[0].isDefaultDevice()).toBeTypeOf('boolean');
        done();
      });
    });

    it('should have a volume level returned as a number', function(done) {
      promise.then(function(devices) {
        expect(devices[0].getLevel()).toBeTypeOf('number');
        done();
      });
    });

    it('can be set with a volume level', function(done) {
      promise.then(function(devices) {
        var device = devices[0];
        device.setLevel(1.5);
        expect(device.getLevel()).toBe(1.5);
        done();
      });
    });

    it('can be determined if enabled in the application', function(done) {
      promise.then(function(devices) {
        expect(devices[0].isEnabled()).toBeTypeOf('boolean');
        done();
      });
    });

    it('can be configured to be enabled and disabled in the application',
      function(done) {
      promise.then(function(devices) {
        var device = devices[0];
        device.setEnabled(false);
        expect(device.isEnabled()).toBe(false);
        device.setEnabled(true);
        expect(device.isEnabled()).toBe(true);
        done();
      });
    });

    it('should have a system volume level returned as a number', function(done) {
      promise.then(function(devices) {
        expect(devices[0].getSystemLevel()).toBeTypeOf('number');
        done();
      });
    });

    it('can be set with a system volume level', function(done) {
      promise.then(function(devices) {
        var device = devices[0];
        device.setSystemLevel(1.5);
        expect(device.getSystemLevel()).toBe(1.5);
        done();
      });
    });

    it('can be determined if enabled in the system', function(done) {
      promise.then(function(devices) {
        expect(devices[0].getSystemEnabled()).toBeTypeOf('number');
        done();
      });
    });

    it('can be configured to be enabled and disabled in the system',
      function(done) {
      promise.then(function(devices) {
        var device = devices[0];

        device.setSystemEnabled(AudioDeviceSystemDisabled);
        expect(device.getSystemEnabled()).toEqual(AudioDeviceSystemDisabled);
        device.setSystemEnabled(AudioDeviceSystemEnabled);
        expect(device.getSystemEnabled()).toEqual(AudioDeviceSystemEnabled);
        device.setSystemEnabled(AudioDeviceSystemMuteDisallowed);
        expect(device.getSystemEnabled()).toEqual(AudioDeviceSystemMuteDisallowed);
        done();
      });
    });

    it('should have a delay returned as a number', function(done) {
      promise.then(function(devices) {
        expect(devices[0].getDelay()).toBeTypeOf('number');
        done();
      });
    });

    it('can be configured to be set with a delay', function(done) {
      promise.then(function(devices) {
        var device = devices[0];
        device.setDelay(1.5);
        expect(device.getDelay()).toBe(1.5);
        done();
      });
    });

    it('can be converted to a self-closed xml string', function(done) {
      promise.then(function(devices) {
        var device = devices[0];
        var deviceString = device.toString();
        if (!/xsplit broadcaster/ig.test(navigator.appVersion))
        {
          expect(deviceString).toBe('<dev' +
            ' id="{0.0.1.00000000}.{b7709bea-527e-4f60-afb0-cd36431972ad}"' +
            ' level="1.000000" enable="1" hwlevel="-1.000000" hwenable="255" delay="0" mix="0"/>');
        }
        var parseXml = function(xmlStr)
        {
          return ( new window.DOMParser() ).parseFromString(xmlStr, 'text/xml');
        };
        var audioDevice = parseXml(deviceString).getElementsByTagName('dev')[0];
        expect(audioDevice.getAttribute("id") == device.getId() &&
          audioDevice.getAttribute("level") == parseFloat(device.getLevel()) &&
          (audioDevice.getAttribute("enable") == '1') == device.isEnabled() &&
          audioDevice.getAttribute("hwlevel") ==
            parseFloat(device.getSystemLevel()) &&
          audioDevice.getAttribute("hwenable") == device.getSystemEnabled() &&
          audioDevice.getAttribute("delay") == parseFloat(device.getDelay())
        ).toBe(true);
        done();
      });
    });


  });
});
