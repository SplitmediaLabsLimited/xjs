/* globals describe, require, beforeEach, spyOn, it, expect */

describe('HTML Source interface', function() {
  'use strict';

  var XJS = require('xjs');
  var Scene = XJS.Scene;
  var mockPresetConfig = '<placement name="Scene 1" id="{219DB767-BE5B-4389-90C2-E712F08EA2CC}" defpos="0"><item pos_left="0.500000" pos_top="0.500000" pos_right="1.000000" pos_bottom="1.000000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="0" lockmove="0" keep_ar="1" visible="1" alpha="255" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" pan="0" pan_config="R:1.000000&amp;la:0.000000&amp;fi:0.000000" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" trscenter="0" trscexit="0" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{302484E1-59A2-4244-81E5-F4BB3AC63D0E}" srcid="{9A2689BC-5AD7-48F4-A598-584F74E799CD}" type="8" name="http://xjsframework.github.io/" cname="" item="http://xjsframework.github.io/*" itemaudio="" volume="100" mute="0" keepaudio="0" sounddev="0" fdeinterlace="0" mipmaps="0" autoresdet="1" keeploaded="0" cc_pin="0" key_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:0.970000&amp;str:0.900000&amp;rad:0.070000&amp;color:2155905152&amp;trail:0.000000&amp;filtering:0.000000&amp;fill:0" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" LiveDetectSignal="1" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" StartOnSrcShow="0" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" DllGrant="" custom="" /><item pos_left="0.000000" pos_top="0.000000" pos_right="0.500000" pos_bottom="0.500000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="1" lockmove="0" keep_ar="1" visible="1" alpha="255" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" pan="0" pan_config="R:1.000000&amp;la:0.000000&amp;fi:0.000000" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" trscenter="0" trscexit="0" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{1FECBD8C-5F1F-436C-B0C2-8F5859024CA1}" srcid="{B11FD72F-C20D-4D83-9EE0-9D7E99778C46}" type="8" name="https://www.xsplit.com/" cname="" item="https://www.xsplit.com/*" itemaudio="" volume="100" mute="0" keepaudio="0" sounddev="0" fdeinterlace="0" mipmaps="0" autoresdet="1" keeploaded="0" cc_pin="0" key_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:0.970000&amp;str:0.900000&amp;rad:0.070000&amp;color:2155905152&amp;trail:0.000000&amp;filtering:0.000000&amp;fill:0" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" LiveDetectSignal="1" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" StartOnSrcShow="0" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" DllGrant="" custom="" /></placement>';

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
    var asyncId = 'ihtml_' + ctr;

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
    var asyncId = 'ihtml_' + ctr;

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
      var asyncId = 'ihtml_' + ctr;
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

  it('contains all the necessary html methods', function() {
    var methods = [
      'call',
      'getURL',
      'setURL',
      'isBrowserTransparent',
      'enableBrowserTransparency',
      'isBrowser60FPS',
      'enableBrowser60FPS',
      'getBrowserCustomSize',
      'setBrowserCustomSize',
      'getAllowRightClick',
      'setAllowRightClick',
      'getBrowserJS',
      'setBrowserJS',
      'isBrowserJSEnabled',
      'enableBrowserJS',
      'getCustomCSS',
      'setCustomCSS',
      'isCustomCSSEnabled',
      'enableCustomCSS',
      'getBrowserLoadStatus'
      ].join(',');

    expect(enumeratedSource[0]).hasMethods(methods);
  });

  describe('should be able to get and set URL', function() {
    it ('through a promise', function(done) {
      var promise = firstSource.getURL();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it ('as a string', function(done) {
      var firstURL = 'https://www.splitmedialabs.com/';
      var secondURL = 'https://xjsframework.github.io/index.html';

      firstSource.setURL(firstURL)
      .then(function() {
        return secondSource.setURL(secondURL);
      }).then(function() {
        return firstSource.getURL();
      }).then(function(url1) {
        expect(url1).toBeTypeOf('string');
        expect(url1).toEqual(firstURL);
        return secondSource.getURL();
      }).then(function(url2) {
        expect(url2).toBeTypeOf('string');
        expect(url2).toEqual(secondURL)
        done();
      });
    });
  })

  describe('should be able to get and set browser transparency', function() {
    var randomBoolean = Math.random() < 0.5;
    it ('through a promise', function(done) {
      var promise = firstSource.isBrowserTransparent();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it ('as a boolean', function(done) {
      firstSource.enableBrowserTransparency(randomBoolean)
      .then(function() {
        return firstSource.isBrowserTransparent();
      }).then(function(isTransparent) {
        expect(isTransparent).toBe(randomBoolean);
        return firstSource.enableBrowserTransparency(!randomBoolean);
      }).then(function() {
        return firstSource.isBrowserTransparent();
      }).then(function(isTransparent) {
        expect(isTransparent).toBe(!randomBoolean);
        done();
      });
    });
  })

  describe('should be able to get and set usage of up to 60 fps', function() {
    var randomBoolean = false;
    // var randomBoolean = Math.random() < 0.5;
    it ('through a promise', function(done) {
      var promise = firstSource.isBrowser60FPS();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it ('as a boolean', function(done) {
      firstSource.enableBrowser60FPS(randomBoolean)
      .then(function() {
        return firstSource.isBrowser60FPS();
      }).then(function(is60fps) {
        expect(is60fps).toBe(randomBoolean);
        return firstSource.enableBrowser60FPS(!randomBoolean);
      }).then(function() {
        return firstSource.isBrowser60FPS();
      }).then(function(is60fps) {
        expect(is60fps).toBe(!randomBoolean);
        done();
      });
    });
  })

  describe('should be able to get and set custom resolution', function() {
    it ('through a promise', function(done) {
      var promise = firstSource.getBrowserCustomSize();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it ('as a Rectangle object', function(done) {
      var firstRand = Math.floor(Math.random() * (1000));
      var secondRand = Math.floor(Math.random() * (1000));
      var thirdRand = Math.floor(Math.random() * (1000));
      var fourthRand = Math.floor(Math.random() * (1000));

      var firstRec = XJS.Rectangle.fromDimensions(firstRand, secondRand);
      var secondRec = XJS.Rectangle.fromDimensions(thirdRand, fourthRand);

      firstSource.setBrowserCustomSize(firstRec)
      .then(function() {
        return secondSource.setBrowserCustomSize(secondRec);
      }).then(function() {
        return firstSource.getBrowserCustomSize();
      }).then(function(rec1) {
        expect(rec1).toBeInstanceOf(XJS.Rectangle);
        expect(rec1.toDimensionString()).toEqual(firstRec.toDimensionString());
        return secondSource.getBrowserCustomSize();
      }).then(function(rec2) {
        expect(rec2).toBeInstanceOf(XJS.Rectangle);
        expect(rec2.toDimensionString()).toEqual(secondRec.toDimensionString());
        done();
      })
    });
  });

  describe('should be able to get and set if right click is allowed', function(done) {
    var randomBoolean = Math.random() < 0.5;
    it ('through a promise', function(done) {
      var promise = firstSource.getAllowRightClick();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it ('as a boolean', function(done) {
      firstSource.setAllowRightClick(randomBoolean)
      .then(function() {
        return firstSource.getAllowRightClick();
      }).then(function(isAllowed) {
        expect(isAllowed).toBe(randomBoolean);
        return firstSource.setAllowRightClick(!randomBoolean);
      }).then(function() {
        return firstSource.getAllowRightClick();
      }).then(function(isAllowed) {
        expect(isAllowed).toBe(!randomBoolean);
        done();
      });
    });
  });

  describe('should be able to get and set custom JS and CSS', function() {
    it ('through a promise', function(done) {
      var promise = firstSource.getBrowserJS();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it ('which does not overwrite each other', function(done) {
      var firstJS = `console.log('READY')`;
      var secondJS = `alert('START')`;
      var randomBoolean = Math.random() < 0.5;
      var firstCSS = 'body{ color: red }';
      var secondCSS = 'body{ background-color: blue }';

      firstSource.setBrowserJS(firstJS)
      .then(function() {
        return secondSource.setBrowserJS(secondJS);
      }).then(function() {
        return secondSource.setCustomCSS(secondCSS);
      }).then(function() {
        return firstSource.setCustomCSS(firstCSS);
      }).then(function() {
        return firstSource.enableCustomCSS(randomBoolean);
      }).then(function() {
        return firstSource.isCustomCSSEnabled();
      }).then(function(isEnabled1) {
        expect(isEnabled1).toBeTypeOf('boolean');
        expect(isEnabled1).toBe(randomBoolean);
        return firstSource.enableCustomCSS(!randomBoolean);
      }).then(function() {
        return firstSource.isCustomCSSEnabled();
      }).then(function(isEnabled1) {
        expect(isEnabled1).toBeTypeOf('boolean');
        expect(isEnabled1).toBe(!randomBoolean);
        return secondSource.enableCustomCSS(!randomBoolean);
      }).then(function() {
        return secondSource.isCustomCSSEnabled();
      }).then(function(isEnabled2) {
        expect(isEnabled2).toBeTypeOf('boolean');
        expect(isEnabled2).toBe(!randomBoolean);
        return secondSource.enableCustomCSS(randomBoolean);
      }).then(function() {
        return secondSource.isCustomCSSEnabled();
      }).then(function(isEnabled2) {
        expect(isEnabled2).toBeTypeOf('boolean');
        expect(isEnabled2).toBe(randomBoolean);
        return firstSource.getCustomCSS();
      }).then(function(customCSS1) {
        expect(customCSS1).toBeTypeOf('string');
        expect(customCSS1).toEqual(firstCSS);
        return secondSource.getCustomCSS();
      }).then(function(customCSS2) {
        expect(customCSS2).toBeTypeOf('string');
        expect(customCSS2).toEqual(secondCSS);
        return secondSource.getBrowserJS();
      }).then(function(browserJS2) {
        expect(browserJS2).toBeTypeOf('string');
        expect(browserJS2).toEqual(secondJS);
        return firstSource.getBrowserJS();
      }).then(function(browserJS1) {
        expect(browserJS1).toBeTypeOf('string');
        expect(browserJS1).toEqual(firstJS);
        return firstSource.enableBrowserJS(randomBoolean);
      }).then(function() {
        return firstSource.isBrowserJSEnabled();
      }).then(function(isEnabled1) {
        expect(isEnabled1).toBeTypeOf('boolean');
        expect(isEnabled1).toBe(randomBoolean);
        return firstSource.enableBrowserJS(!randomBoolean);
      }).then(function() {
        return firstSource.isBrowserJSEnabled();
      }).then(function(isEnabled1) {
        expect(isEnabled1).toBeTypeOf('boolean');
        expect(isEnabled1).toBe(!randomBoolean);
        return secondSource.enableBrowserJS(!randomBoolean);
      }).then(function() {
        return secondSource.isBrowserJSEnabled();
      }).then(function(isEnabled2) {
        expect(isEnabled2).toBeTypeOf('boolean');
        expect(isEnabled2).toBe(!randomBoolean);
        return secondSource.enableBrowserJS(randomBoolean);
      }).then(function() {
        return secondSource.isBrowserJSEnabled();
      }).then(function(isEnabled2) {
        expect(isEnabled2).toBeTypeOf('boolean');
        expect(isEnabled2).toBe(randomBoolean);
        done();
      });
    });
  })
});
