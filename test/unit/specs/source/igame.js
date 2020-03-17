/* globals describe, require, beforeEach, spyOn, it, expect */

describe('Game Source interface', function() {
  'use strict';

  var XJS = require('xjs');
  var Scene = XJS.Scene;
  var mockPresetConfig = '<placement name="Scene 1" id="{219DB767-BE5B-4389-90C2-E712F08EA2CC}" defpos="0"><item pos_left="0.000000" pos_top="0.500000" pos_right="0.500000" pos_bottom="1.000000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="0" lockmove="0" keep_ar="1" visible="1" alpha="255" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" pan="0" pan_config="R:1.000000&amp;la:0.000000&amp;fi:0.000000" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" trscenter="0" trscexit="0" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{DAB6B4CA-DADF-413F-9C8A-BBA43DE69AA8}" srcid="{6C1E1608-3093-4AD1-BE38-DEE5B3404E32}" type="7" name="Game: Auto Detect" cname="" item="&lt;src pid=&quot;9000&quot; handle=&quot;136098240&quot; hwnd=&quot;264060&quot; GapiType=&quot;DX9&quot; width=&quot;700&quot; height=&quot;400&quot; flags=&quot;0&quot; wndname=&quot;Plantera&quot; lastframets=&quot;7328359&quot; fpsRender=&quot;59.927673&quot; fpsCapture=&quot;0.000000&quot; imagename=&quot;\\Device\\HarddiskVolume4\\Program Files (x86)\\Steam\\steamapps\\common\\Plantera\\Plantera.exe&quot;/&gt; " itemaudio="" volume="100" mute="0" keepaudio="0" sounddev="0" fdeinterlace="0" mipmaps="1" autoresdet="1" keeploaded="0" cc_pin="0" key_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:0.970000&amp;str:0.900000&amp;rad:0.070000&amp;color:2155905152&amp;trail:0.000000&amp;filtering:0.000000&amp;fill:0" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" LiveDetectSignal="1" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" StartOnSrcShow="0" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="1" GameCapSurfSharing="1" GameCapAlpha="0" GameCapPlSmooth="1" GameCapTrackActive="1" GameCapTrackActiveFullscreen="0" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" DllGrant="" custom="" /><item pos_left="6.250000000e-02" pos_top="5.000000000e-01" pos_right="4.375000000e-01" pos_bottom="1.000000000e+00" pos_an="1" crop_left="0.000000000e+00" crop_top="0.000000000e+00" crop_right="0.000000000e+00" crop_bottom="0.000000000e+00" crop_an="1" pixalign="0" zorder="0" lockmove="0" keep_ar="1" visible="1" visible_an="1" alpha="255" alpha_an="1" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" cc_brightness_an="1" cc_contrast_an="1" cc_hue_an="1" cc_saturation_an="1" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" pan="0" pan_config="R:1.000000000e+00&amp;la:0.000000000e+00&amp;fi:0.000000000e+00" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" rotate_x_an="1" rotate_y_an="1" offset_x="0.000000000e+00" offset_y="0.000000000e+00" ShowPosition="0" OverlayURL="" OverlayConfig="" transitionid="" transitiontime="300" trscenter="0" trscexit="0" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{07DDEF4B-C557-4BA9-A6FD-82CF1CC6AE7E}" srcid="{24256175-65DE-4F0F-A401-2D5AD6CC5CDA}" type="7" name="Game: Auto Detect" cname="" item="&lt;src pid=&quot;0&quot; handle=&quot;0&quot; hwnd=&quot;0&quot; GapiType=&quot;&quot; width=&quot;0&quot; height=&quot;0&quot; flags=&quot;0&quot; wndname=&quot;&quot; lastframets=&quot;0&quot; fpsRender=&quot;0.000000000e+00&quot; fpsCapture=&quot;0.000000000e+00&quot; GPU_VendorId=&quot;0&quot; GPU_DeviceId=&quot;0&quot; GPU_Luid=&quot;0&quot; imagename=&quot;&quot; replace=&quot;F:\\Images\\capture4-720p60.gif&quot;/&gt;" itemaudio="" volume="100" mute="0" keepaudio="0" sounddev="0" mipmaps="1" autoresdet="1" keeploaded="1" RefreshOnScnLoad="0" RefreshOnSrcShow="0" zoom="l:0.000000000e+00|t:0.000000000e+00|r:1.000000000e+00|b:1.000000000e+00" or_enable="0" or_mode="0" or_angle="0" cc_pin="0" key_pin="0" edgeeffect_pin="0" effects_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:9.700000286e-01&amp;str:8.999999762e-01&amp;rad:7.000000030e-02&amp;color:2155905152&amp;trail:0.000000000e+00&amp;filtering:0.000000000e+00&amp;fill:0" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" LiveDetectSignal="1" CuePoints="" FilePlaylist="" fdeinterlace="0" InPoint="0" OutPoint="0" OpWhenFinished="0" StartOnLoad="1" StartOnSrcShow="0" RememberPosition="1" LastPosition="0" LastRunState="1" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture1="1" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="1" GameCapSurfSharing="1" GameCapEnc="0" GameCapAlpha="0" GameCapPlSmooth="1" GameCapFrameTimeLimit="0" GameCapTrackActive="1" GameCapTrackActiveFullscreen="0" GameCapHideInactive="0" BrowserJs="" BrowserCookiePath="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookieFlags="0" Browser60fps="0" BrowserZoom="1.000000000e+00" SwfWrapper="1" DllGrant="" custom=""/></placement>';

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
    var asyncId = 'igame_' + ctr;

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
    var asyncId = 'igame_' + ctr;

    if (property.substring(0, 5) === 'prop:') {
      property = property.replace(/^prop:/, '');
    }

    if (property.substring(0, 3) === 'src') {
      property = property.substring(3);
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
      var asyncId = 'igame_' + ctr;
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

    spyOn(window.external, 'AttachVideoItem')
    .and.callFake(function(id) {
      attachedId = id;
    });

    spyOn(window.external, 'AttachVideoItem2')
    .and.callFake(function(id) {
      attachedId = id;
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

  it('contains all the necessary game methods', function() {
    var methods = [
      'isSpecialOptimizationEnabled',
      'setSpecialOptimizationEnabled',
      'isShowMouseEnabled',
      'setShowMouseEnabled',
      'setOfflineImage',
      'getOfflineImage',
      'isTransparent',
      'setTransparent',
      'getGameFPSCap',
      'setGameFPSCap'
      ].join(',');

    expect(enumeratedSource[0]).hasMethods(methods);
  });

  describe('should be able to get and set special optimization', function() {
    var randomBoolean = Math.random() < 0.5;
    it ('through a promise', function(done) {
      var promise = firstSource.isSpecialOptimizationEnabled();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it ('as a boolean', function(done) {
      firstSource.setSpecialOptimizationEnabled(randomBoolean)
      .then(function() {
        return firstSource.isSpecialOptimizationEnabled();
      }).then(function(isOptimized) {
        expect(isOptimized).toBe(randomBoolean);
        return firstSource.setSpecialOptimizationEnabled(!randomBoolean);
      }).then(function() {
        return firstSource.isSpecialOptimizationEnabled();
      }).then(function(isOptimized) {
        expect(isOptimized).toBe(!randomBoolean);
        done();
      });
    });
  })

  describe('should be able to get and set showing of mouse', function() {
    var randomBoolean = Math.random() < 0.5;
    it ('through a promise', function(done) {
      var promise = firstSource.isShowMouseEnabled();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it ('as a boolean', function(done) {
      firstSource.setShowMouseEnabled(randomBoolean)
      .then(function() {
        return firstSource.isShowMouseEnabled();
      }).then(function(isShown) {
        expect(isShown).toBe(randomBoolean);
        return firstSource.setShowMouseEnabled(!randomBoolean);
      }).then(function() {
        return firstSource.isShowMouseEnabled();
      }).then(function(isShown) {
        expect(isShown).toBe(!randomBoolean);
        done();
      });
    });
  })

  describe('should be able to get and set offline image', function() {
    const validPath = 'F:\\Images\\capture4-720p60.gif';
    const validPath2 = 'F:\\Images\\anotherValid.jpg';
    const invalidPath = 'F:\\Images\\anotherValid.mp3';
    const invalidString = 'INVALID';

    it ('through a promise', function(done) {
      var promise = firstSource.getOfflineImage();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it ('as a string', function(done) {
      secondSource.getOfflineImage()
      .then(function(offlineImage) {
        expect(offlineImage).toBeTypeOf('string');
        return secondSource.setOfflineImage(validPath2);
      }).then(function() {
        return secondSource.getOfflineImage();
      }).then(function(offlineImage) {
        expect(offlineImage).toEqual(validPath2)
        done();
      });
    });

    it ('and rejects if not a valid file path or file type', function(done) {
      firstSource.setOfflineImage(invalidPath)
      .then(function(filePath) {
        done.fail('Invalid file type should be rejected');
      }).catch(function(err) {
        expect(err).toEqual(jasmine.any(Error));
        return firstSource.setOfflineImage(invalidString)
      }).then(function(filePath) {
        done.fail('Invalid file path should be rejected');
      }).catch(function(err) {
        expect(err).toEqual(jasmine.any(Error));
        done();
      });
    });
  })

  describe('should be able to get and set game source transparency', function() {
    var randomBoolean = Math.random() < 0.5;
    it ('through a promise', function(done) {
      var promise = firstSource.isTransparent();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it ('as a boolean', function(done) {
      firstSource.setTransparent(randomBoolean)
      .then(function() {
        return firstSource.isTransparent();
      }).then(function(isTransparent) {
        expect(isTransparent).toBe(randomBoolean);
        return firstSource.setTransparent(!randomBoolean);
      }).then(function() {
        return firstSource.isTransparent();
      }).then(function(isTransparent) {
        expect(isTransparent).toBe(!randomBoolean);
        done();
      });
    });
  })

  describe('should be able to get and set game fps cap', function() {
    it ('through a promise', function(done) {
      var promise = firstSource.getGameFPSCap();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it ('as a number', function(done) {
      var firstRand = Math.floor(Math.random() * (76)) + 24;
      var secondRand = Math.floor(Math.random() * (76)) + 24;
      var randomBoolean = Math.random() < 0.5;

      firstSource.setGameFPSCap(firstRand)
      .then(function() {
        return secondSource.setGameFPSCap(secondRand * Number(randomBoolean));
      }).then(function() {
        return firstSource.getGameFPSCap();
      }).then(function(cap1) {
        expect(cap1).toBeTypeOf('number');
        expect(cap1).toEqual(firstRand);
        return secondSource.getGameFPSCap();
      }).then(function(cap2) {
        expect(cap2).toBeTypeOf('number');
        expect(cap2).toEqual(secondRand * Number(randomBoolean));
        done();
      })
    });

    it ('which rejects when setting not within the parameters ', function(done) {
      var randomBelowMin = Math.floor(Math.random() * (22)) + 1;
      var randomAboveMax = Math.floor(Math.random() * (1000)) + 301;

      firstSource.setGameFPSCap('SOME STRING')
      .then(function(filePath) {
        done.fail('Non-number parameters should be not accepted');
      }).catch(function(err) {
        expect(err).toEqual(jasmine.any(Error));
        return firstSource.setGameFPSCap(randomBelowMin);
      }).then(function(filePath) {
        done.fail('Numbers lower than the minimum (and not zero) should not be accepted');
      }).catch(function(err) {
        expect(err).toEqual(jasmine.any(Error));
        return firstSource.setGameFPSCap(randomAboveMax);
      }).then(function(filePath) {
        done.fail('Numbers higher than the maximum should not be accepted');
      }).catch(function(err) {
        expect(err).toEqual(jasmine.any(Error));
        done();
      });
    });
  });
});
