/* globals describe, require, beforeEach, spyOn, it, expect */

describe('Audio Source interface', function() {
  'use strict';

  var XJS = require('xjs');
  var Scene = XJS.Scene;
  var mockPresetConfig = '<placement name="Scene 1" id="{219DB767-BE5B-4389-90C2-E712F08EA2CC}" defpos="0"><item pos_left="0.500000" pos_top="0.500000" pos_right="1.000000" pos_bottom="1.000000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="0" lockmove="0" keep_ar="1" visible="1" alpha="255" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" pan="0" pan_config="R:1.000000&amp;la:0.000000&amp;fi:0.000000" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" trscenter="0" trscexit="0" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{764B4F30-4637-4BE1-BF66-80E9FE86B257}" srcid="{B3B49F67-0802-404A-AD6D-C850C5107971}" type="2" name="Microphone (Realtek High Definition Audio)" cname="" item="@device:cm:{33D9A762-90C8-11D0-BD43-00A0C911CE86}\wave:{62AB2C6F-5CEF-4931-8131-BD12CE0C95DB}" itemaudio="" volume="100" mute="0" keepaudio="0" sounddev="1" fdeinterlace="0" mipmaps="0" autoresdet="1" keeploaded="0" cc_pin="0" key_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:0.970000&amp;str:0.900000&amp;rad:0.070000&amp;color:2155905152&amp;trail:0.000000&amp;filtering:0.000000&amp;fill:0" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" LiveDetectSignal="1" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" StartOnSrcShow="0" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" DllGrant="" custom="" /></placement>';

  var local = {};
  var attachedId;
  var enumeratedSource = [];

  var appVersion = navigator.appVersion;
  var mix = new window.Mixin([
    function() {
      navigator.__defineGetter__('appVersion', function() {
        return 'XSplit Broadcaster 2.7.1702.2231 ';
      });
    },
    function() {
      navigator.__defineGetter__('appVersion', function() {
        return 'XSplit Broadcaster 2.8.1603.0401 ';
      });
    }
  ]);
  var exec = mix.exec.bind(mix);

  var env = new window.Environment(XJS);
  var environments = {
    SOURCE : 'plugin',
    SOURCEPROPS : 'props',
    EXTENSION : 'extension'
  };

  var parseXml = function(xmlStr) {
      return ( new window.DOMParser() ).parseFromString(xmlStr, 'text/xml');
  };

  var xCallback = function(id, result) {
    setTimeout(function() {
      window.OnAsyncCallback(id, result);
    }, 10);
  };

  var getLocal = function(property) {
    var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);

    if (property.substring(0, 5) === 'prop:') {
      property = property.replace(/^prop:/, '');
    }
    if (property.substring(0, 3) === 'src') {
      property = property.substring(3);
    }

    if (local[attachedId] !== undefined && local.attachedId.hasOwnProperty(
      property)) {
      xCallback(asyncId, local[attachedId][property]);
    } else {
      var placement = parseXml(mockPresetConfig)
        .getElementsByTagName('placement')[0];
      var selected = '[id="' + attachedId + '"]';
      var itemSelected = placement.querySelector(selected);
      xCallback(asyncId, itemSelected.getAttribute(property));
    }

    return asyncId;
  };

  var setLocal = function(property, value) {
    var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);

    if (property.substring(0, 5) === 'prop:') {
      property = property.replace(/^prop:/, '');
    }

    if (local[attachedId] === undefined) {
      local[attachedId] = {};
    }

    local.attachedId[property] = value;
    xCallback(asyncId, '0');
    return asyncId;
  };

  beforeEach(function(done) {
    env.set(environments.EXTENSION); // for maximum flexibility/functionality

    navigator.__defineGetter__('appVersion', function() {
      return 'XSplit Broadcaster 2.7.1702.2231 ';
    });

    // reset attached IDs
    var source = new XJS.Source({srcId : '{ID}'});
    var source2 = new XJS.Source({srcId : '{ID2}'});

    local = {};

    spyOn(window.external, 'AppGetPropertyAsync')
    .and.callFake(function(funcName) {
      var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);
      switch (funcName) {
        case 'sceneconfig:0':
          xCallback(asyncId, encodeURIComponent(mockPresetConfig));
          break;

        case 'sceneconfig':
          xCallback(asyncId, encodeURIComponent(mockPresetConfig));
          break;

        case 'preset:0':
          xCallback(asyncId, '0');
          break;
      }

      return asyncId;
    });

    spyOn(window.external, 'SearchVideoItem')
    .and.callFake(function(id) {
      attachedId = id;
    });

    spyOn(window.external, 'SearchVideoItem2')
    .and.callFake(function(id) {
      attachedId = id;
    });

    spyOn(window.external, 'GetLocalPropertyAsync')
    .and.callFake(getLocal);

    spyOn(window.external, 'GetLocalPropertyAsync2')
    .and.callFake(getLocal);

    spyOn(window.external, 'SetLocalPropertyAsync')
    .and.callFake(setLocal);

    spyOn(window.external, 'SetLocalPropertyAsync2')
    .and.callFake(setLocal);

    if (enumeratedSource.length !== 0) {
      done();
    } else {
      Scene.getActiveScene().then(function(newScene) {
        return newScene.getSources();
      }).then(function(sources) {
        var sourceArray = sources;
        window.s = sources
        var sourceArrayLength = sourceArray.length;
        if (sourceArrayLength > 0) {
          for (var i = 0; i < sourceArrayLength; i++) {
            if (sourceArray[i] instanceof XJS.AudioSource) {
              enumeratedSource.push(sourceArray[i]);
            }
          }
        }
        done();
      });
    }
  });

  afterEach(function() {
    navigator.__defineGetter__('appVersion', function() {
      return appVersion;
    });
  });

  it('contains all the necessary audio interface methods', function() {
    var methods = [
      'isSilenceDetectionEnabled',
      'setSilenceDetectionEnabled',
      'getSilenceThreshold',
      'setSilenceThreshold',
      'getSilencePeriod',
      'setSilencePeriod',
      'getAudioOffset',
      'setAudioOffset'
      ].join(',');

    expect(enumeratedSource[0]).hasMethods(methods);
  });

});
