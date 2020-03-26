/* globals describe, require, beforeEach, spyOn, it, expect */

describe('Audio Source interface', function() {
  'use strict';

  var XJS = require('xjs');
  var Scene = XJS.Scene;
  var mockPresetConfig = '<placement name="Scene 1" id="{57801D3E-0EF3-44A3-8EDD-5B227F3A5A24}" preset_id="{00000000-0000-0000-0000-000000000000}" preset_trtime="500" preset_trfunc="" defpos="3" trid="" trtime="500"><item pos_left="0.000000000e+00" pos_top="0.000000000e+00" pos_right="5.000000000e-01" pos_bottom="5.000000000e-01" pos_an="1" crop_left="0.000000000e+00" crop_top="0.000000000e+00" crop_right="0.000000000e+00" crop_bottom="0.000000000e+00" crop_an="1" pixalign="0" zorder="0" lockmove="0" keep_ar="1" visible="1" visible_an="1" alpha="255" alpha_an="1" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" cc_brightness_an="1" cc_contrast_an="1" cc_hue_an="1" cc_saturation_an="1" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" pan="0" pan_config="R:1.000000000e+00&amp;la:0.000000000e+00&amp;fi:0.000000000e+00" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" rotate_x_an="1" rotate_y_an="1" offset_x="0.000000000e+00" offset_y="0.000000000e+00" ShowPosition="0" OverlayURL="" OverlayConfig="" transitionid="" transitiontime="300" trscenter="0" trscexit="0" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{A37CBBA2-1CC0-4901-9B70-3058B7BB06BC}" srcid="{DF1AF01C-95A1-4304-855E-0720FA8C072E}" type="2" name="Microphone (2- Logitech USB Headset H340)" cname="" item="@device:cm:{33D9A762-90C8-11D0-BD43-00A0C911CE86}\wave:{701829C0-D1F3-4E70-8DE9-E9CE5853BA16}" itemaudio="@device:cm:{33D9A762-90C8-11D0-BD43-00A0C911CE86}\wave:{701829C0-D1F3-4E70-8DE9-E9CE5853BA16}" volume="100" mute="0" keepaudio="0" sounddev="1" mipmaps="0" autoresdet="1" keeploaded="1" RefreshOnScnLoad="0" RefreshOnSrcShow="0" zoom="l:0.000000000e+00|t:0.000000000e+00|r:1.000000000e+00|b:1.000000000e+00" or_enable="0" or_mode="0" or_angle="0" cc_pin="0" key_pin="0" edgeeffect_pin="0" effects_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:9.700000286e-01&amp;str:8.999999762e-01&amp;rad:7.000000030e-02&amp;color:2155905152&amp;trail:0.000000000e+00&amp;filtering:0.000000000e+00&amp;fill:0" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" LiveDetectSignal="1" CuePoints="" FilePlaylist="" fdeinterlace="0" InPoint="0" OutPoint="0" OpWhenFinished="0" StartOnLoad="1" StartOnSrcShow="0" RememberPosition="1" LastPosition="0" LastRunState="-1" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture1="1" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapEnc="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapFrameTimeLimit="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserCookiePath="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookieFlags="0" Browser60fps="0" BrowserZoom="1.000000000e+00" SwfWrapper="1" DllGrant="" custom=""><presproperty __map_id="logitechcanrecommend">0</presproperty><presproperty __map_id="xsplitautoset">1</presproperty></item><item pos_left="0.000000000e+00" pos_top="5.000000000e-01" pos_right="5.000000000e-01" pos_bottom="1.000000000e+00" pos_an="1" crop_left="0.000000000e+00" crop_top="0.000000000e+00" crop_right="0.000000000e+00" crop_bottom="0.000000000e+00" crop_an="1" pixalign="0" zorder="1" lockmove="0" keep_ar="1" visible="1" visible_an="1" alpha="255" alpha_an="1" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" cc_brightness_an="1" cc_contrast_an="1" cc_hue_an="1" cc_saturation_an="1" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" pan="0" pan_config="R:1.000000000e+00&amp;la:0.000000000e+00&amp;fi:0.000000000e+00" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" rotate_x_an="1" rotate_y_an="1" offset_x="0.000000000e+00" offset_y="0.000000000e+00" ShowPosition="0" OverlayURL="" OverlayConfig="" transitionid="" transitiontime="300" trscenter="0" trscexit="0" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{E387A517-F596-4DDA-8997-76E635F35B25}" srcid="{4D235EBF-8F56-4019-AA89-C829A4BE522B}" type="2" name="Microphone (HD Pro Webcam C920)" cname="" item="@device:cm:{33D9A762-90C8-11D0-BD43-00A0C911CE86}\wave:{311BB428-C203-49B3-B1D6-E888603D03EA}" itemaudio="@device:cm:{33D9A762-90C8-11D0-BD43-00A0C911CE86}\wave:{311BB428-C203-49B3-B1D6-E888603D03EA}" volume="100" mute="0" keepaudio="0" sounddev="1" mipmaps="0" autoresdet="1" keeploaded="1" RefreshOnScnLoad="0" RefreshOnSrcShow="0" zoom="l:0.000000000e+00|t:0.000000000e+00|r:1.000000000e+00|b:1.000000000e+00" or_enable="0" or_mode="0" or_angle="0" cc_pin="0" key_pin="0" edgeeffect_pin="0" effects_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:9.700000286e-01&amp;str:8.999999762e-01&amp;rad:7.000000030e-02&amp;color:2155905152&amp;trail:0.000000000e+00&amp;filtering:0.000000000e+00&amp;fill:0" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" LiveDetectSignal="1" CuePoints="" FilePlaylist="" fdeinterlace="0" InPoint="0" OutPoint="0" OpWhenFinished="0" StartOnLoad="1" StartOnSrcShow="0" RememberPosition="1" LastPosition="0" LastRunState="-1" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture1="1" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapEnc="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapFrameTimeLimit="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserCookiePath="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookieFlags="0" Browser60fps="0" BrowserZoom="1.000000000e+00" SwfWrapper="1" DllGrant="" custom=""><presproperty __map_id="logitechcanrecommend">0</presproperty><presproperty __map_id="xsplitautoset">1</presproperty></item></placement>';

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

  var ctr = 0;

  var parseXml = function(xmlStr) {
      return ( new window.DOMParser() ).parseFromString(xmlStr, 'text/xml');
  };

  var xCallback = function(id, result) {
    setTimeout(function() {
      window.OnAsyncCallback(id, result);
    }, 10);
  };

  var getLocal = function(property) {
    ctr++;
    var asyncId = 'iaudiosource_' + ctr;

    if (property.substring(0, 5) === 'prop:') {
      property = property.replace(/^prop:/, '');
    }
    if (property.substring(0, 3) === 'src') {
      property = property.substring(3);
    }

    if (local[attachedId] !== undefined && local[attachedId].hasOwnProperty(
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
    ctr++;
    var asyncId = 'iaudiosource_' + ctr;

    if (property.substring(0, 5) === 'prop:') {
      property = property.replace(/^prop:/, '');
    }

    if (local[attachedId] === undefined) {
      local[attachedId] = {};
    }

    local[attachedId][property] = value;
    xCallback(asyncId, '0');
    return asyncId;
  };

  var firstSource;
  var secondSource;

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
      ctr++;
      var asyncId = 'iaudiosource_' + ctr;
      switch (funcName) {
        case 'sceneconfig:0':
          xCallback(asyncId, encodeURIComponent(mockPresetConfig));
          break;

        case 'sceneconfig':
          xCallback(asyncId, encodeURIComponent(mockPresetConfig));
          break;

        case 'scene:0':
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
        var sourceArrayLength = sourceArray.length;

        if (sourceArrayLength > 0) {
          for (var i = 0; i < sourceArrayLength; i++) {
            if (sourceArray[i] instanceof XJS.Source) {
              enumeratedSource.push(sourceArray[i]);
            }
          }
        }
        firstSource = enumeratedSource[0];
        secondSource = enumeratedSource[1];
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

  describe('should be able to get and set silence detection state', function() {
    it ('through a promise', function(done) {
      var promise = firstSource.isSilenceDetectionEnabled();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it ('as a boolean', function(done) {
      var firstBoolean = true;
      var secondBoolean = false;

      firstSource.setSilenceDetectionEnabled(firstBoolean)
      .then(function() {
        return secondSource.setSilenceDetectionEnabled(secondBoolean);
      }).then(function() {
        return firstSource.isSilenceDetectionEnabled();
      }).then(function(mute1) {
        expect(mute1).toBeTypeOf('boolean');
        expect(mute1).toEqual(firstBoolean);
        return secondSource.isSilenceDetectionEnabled();
      }).then(function(mute2) {
        expect(mute2).toBeTypeOf('boolean');
        expect(mute2).toEqual(secondBoolean);
        return firstSource.setSilenceDetectionEnabled(!firstBoolean);
      }).then(function() {
        return firstSource.isSilenceDetectionEnabled();
      }).then(function(mute3) {
        expect(mute3).toEqual(!firstBoolean);
        done();
      })
    });
  });

  describe('should be able to get and set silence threshold', function() {
    it ('through a promise', function(done) {
      var promise = firstSource.getSilenceThreshold();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it ('as a number', function(done) {
      var firstRand = randomInt(0, 128);
      var secondRand = randomInt(0, 128);
      firstSource.setSilenceThreshold(firstRand)
      .then(function() {
        return secondSource.setSilenceThreshold(secondRand);
      }).then(function() {
        return firstSource.getSilenceThreshold();
      }).then(function(threshold1) {
        expect(threshold1).toBeTypeOf('number');
        expect(threshold1).toEqual(firstRand);
        return secondSource.getSilenceThreshold();
      }).then(function(threshold2) {
        expect(threshold2).toBeTypeOf('number');
        expect(threshold2).toEqual(secondRand);
        done();
      })
    });

    it ('which rejects when invalid parameters are supplied', function(done) {
      firstSource.setSilenceThreshold('SOME TEXT')
      .then(function() {
        done.fail('Invalid type was accepted (string)');
      }).catch(function(err) {
        return firstSource.setSilenceThreshold(130)
      }).then(function() {
        done.fail('Value accepted is not within range');
      }).catch(function(err) {
        return firstSource.setSilenceThreshold(2.5)
      }).then(function() {
        done.fail('Only integers should be accepted');
      }).catch(function(err) {
        expect(err).toEqual(jasmine.any(Error));
        done();
      })
    });
  });

  describe('should be able to get and set silence period', function() {
    it ('through a promise', function(done) {
      var promise = firstSource.getSilencePeriod();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it ('as a number', function(done) {
      var firstRand = randomInt(0, 10000);
      var secondRand = randomInt(0, 10000);
      firstSource.setSilencePeriod(firstRand)
      .then(function() {
        return secondSource.setSilencePeriod(secondRand);
      }).then(function() {
        return firstSource.getSilencePeriod();
      }).then(function(threshold1) {
        expect(threshold1).toBeTypeOf('number');
        expect(threshold1).toEqual(firstRand);
        return secondSource.getSilencePeriod();
      }).then(function(threshold2) {
        expect(threshold2).toBeTypeOf('number');
        expect(threshold2).toEqual(secondRand);
        done();
      })
    });

    it ('which rejects when invalid parameters are supplied', function(done) {
      firstSource.setSilencePeriod('SOME TEXT')
      .then(function() {
        done.fail('Invalid type was accepted (string)');
      }).catch(function(err) {
        return firstSource.setSilencePeriod(20000)
      }).then(function() {
        done.fail('Value accepted is not within range');
      }).catch(function(err) {
        return firstSource.setSilencePeriod(2.5)
      }).then(function() {
        done.fail('Only integers should be accepted');
      }).catch(function(err) {
        expect(err).toEqual(jasmine.any(Error));
        done();
      })
    });
  });

  describe('should be able to get and set audio offset', function() {
    it ('through a promise', function(done) {
      var promise = firstSource.getAudioOffset();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it ('as a number', function(done) {
      var firstRand = randomInt();
      var secondRand = randomInt();
      firstSource.setAudioOffset(firstRand)
      .then(function() {
        return secondSource.setAudioOffset(secondRand);
      }).then(function() {
        return firstSource.getAudioOffset();
      }).then(function(audioOffset1) {
        expect(audioOffset1).toBeTypeOf('number');
        expect(audioOffset1).toEqual(firstRand);
        return secondSource.getAudioOffset();
      }).then(function(audioOffset2) {
        expect(audioOffset2).toBeTypeOf('number');
        expect(audioOffset2).toEqual(secondRand);
        done();
      })
    });
  });
});
