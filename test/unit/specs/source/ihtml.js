/* globals describe, require, beforeEach, spyOn, it, expect */

describe('HTML Source interface', () => {
  var XJS = require('xjs');
  var Scene = XJS.Scene;
  var mockPresetConfig =
    '<placement name="Scene 1" id="{219DB767-BE5B-4389-90C2-E712F08EA2CC}" defpos="0"><item pos_left="0.500000" pos_top="0.500000" pos_right="1.000000" pos_bottom="1.000000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="0" lockmove="0" keep_ar="1" visible="1" alpha="255" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" pan="0" pan_config="R:1.000000&amp;la:0.000000&amp;fi:0.000000" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" trscenter="0" trscexit="0" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{302484E1-59A2-4244-81E5-F4BB3AC63D0E}" srcid="{9A2689BC-5AD7-48F4-A598-584F74E799CD}" type="8" name="http://xjsframework.github.io/" cname="" item="http://xjsframework.github.io/*" itemaudio="" volume="100" mute="0" keepaudio="0" sounddev="0" fdeinterlace="0" mipmaps="0" autoresdet="1" keeploaded="0" cc_pin="0" key_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:0.970000&amp;str:0.900000&amp;rad:0.070000&amp;color:2155905152&amp;trail:0.000000&amp;filtering:0.000000&amp;fill:0" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" LiveDetectSignal="1" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" StartOnSrcShow="0" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" DllGrant="" custom="" /><item pos_left="0.000000" pos_top="0.000000" pos_right="0.500000" pos_bottom="0.500000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="1" lockmove="0" keep_ar="1" visible="1" alpha="255" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" pan="0" pan_config="R:1.000000&amp;la:0.000000&amp;fi:0.000000" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" trscenter="0" trscexit="0" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{1FECBD8C-5F1F-436C-B0C2-8F5859024CA1}" srcid="{B11FD72F-C20D-4D83-9EE0-9D7E99778C46}" type="8" name="https://www.xsplit.com/" cname="" item="https://www.xsplit.com/*" itemaudio="" volume="100" mute="0" keepaudio="0" sounddev="0" fdeinterlace="0" mipmaps="0" autoresdet="1" keeploaded="0" cc_pin="0" key_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:0.970000&amp;str:0.900000&amp;rad:0.070000&amp;color:2155905152&amp;trail:0.000000&amp;filtering:0.000000&amp;fill:0" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" LiveDetectSignal="1" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" StartOnSrcShow="0" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" DllGrant="" custom="" /></placement>';

  var local = {};
  var attachedId;
  var enumeratedSource = [];
  var shouldBeAvailable = true;
  var appVersion = navigator.appVersion;
  var mix = new window.Mixin([
    () => {
      navigator.__defineGetter__('appVersion', () => 'XSplit Broadcaster 2.7.1702.2231 ');
    },
    () => {
      navigator.__defineGetter__('appVersion', () => 'XSplit Broadcaster 2.8.1603.0401 ');
    },
  ]);
  var exec = mix.exec.bind(mix);

  var env = new window.Environment(XJS);
  var environments = {
    SOURCE: 'plugin',
    SOURCEPROPS: 'props',
    EXTENSION: 'extension',
  };

  var ctr = 0;

  var parseXml = (xmlStr) => new window.DOMParser().parseFromString(xmlStr, 'text/xml');

  var xCallback = (id, result) => {
    setTimeout(() => {
      window.OnAsyncCallback(id, result);
    }, 10);
  };

  var getLocal = (property) => {
    ctr++;
    var asyncId = 'ihtml_' + ctr;
    if (property.substring(0, 5) === 'prop:') {
      property = property.replace(/^prop:/, '');
    }
    if (property.substring(0, 3) === 'src') {
      property = property.substring(3);
    }

    if (property === 'itemavail') {
      xCallback(asyncId, shouldBeAvailable ? '1' : '0');
    } else if (local[attachedId] !== undefined && Object.prototype.hasOwnProperty.call(local[attachedId], property)) {
      xCallback(asyncId, local[attachedId][property]);
    } else {
      var placement = parseXml(mockPresetConfig).getElementsByTagName('placement')[0];
      var selected = '[id="' + attachedId + '"]';
      var itemSelected = placement.querySelector(selected);
      xCallback(asyncId, itemSelected.getAttribute(property));
    }

    return asyncId;
  };

  var setLocal = (property, value) => {
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

  beforeEach((done) => {
    env.set(environments.EXTENSION); // for maximum flexibility/functionality

    navigator.__defineGetter__('appVersion', () => 'XSplit Broadcaster 2.7.1702.2231 ');

    // reset attached IDs
    var source = new XJS.Source({ srcId: '{ID}' });
    var source2 = new XJS.Source({ srcId: '{ID2}' });

    local = {};

    spyOn(window.external, 'AppGetPropertyAsync').and.callFake((funcName) => {
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

    spyOn(window.external, 'SearchVideoItem').and.callFake((id) => {
      attachedId = id;
    });

    spyOn(window.external, 'SearchVideoItem2').and.callFake((id) => {
      attachedId = id;
    });

    spyOn(window.external, 'GetLocalPropertyAsync').and.callFake(getLocal);

    spyOn(window.external, 'GetLocalPropertyAsync2').and.callFake(getLocal);

    spyOn(window.external, 'SetLocalPropertyAsync').and.callFake(setLocal);

    spyOn(window.external, 'SetLocalPropertyAsync2').and.callFake(setLocal);

    if (enumeratedSource.length !== 0) {
      done();
    } else {
      Scene.getActiveScene()
        .then((newScene) => newScene.getSources())
        .then((sources) => {
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

  afterEach(() => {
    navigator.__defineGetter__('appVersion', () => appVersion);
  });

  it('contains all the necessary html methods', () => {
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
      'getBrowserLoadStatus',
    ].join(',');

    expect(enumeratedSource[0]).hasMethods(methods);
  });

  describe('should be able to check if source file is avaiable', () => {
    it('through a promise', (done) => {
      var promise = firstSource.isSourceAvailable();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it('as a boolean', (done) => {
      shouldBeAvailable = true;
      firstSource
        .isSourceAvailable()
        .then((isAvailable) => {
          expect(isAvailable).toBe(shouldBeAvailable);
          shouldBeAvailable = false;
          return firstSource.isSourceAvailable();
        })
        .then((isAvailable) => {
          expect(isAvailable).toBe(shouldBeAvailable);
          done();
        });
    });
  });

  describe('should be able to get and set URL', () => {
    it('through a promise', (done) => {
      var promise = firstSource.getURL();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it('as a string', (done) => {
      var firstURL = 'https://www.splitmedialabs.com/';
      var secondURL = 'https://xjsframework.github.io/index.html';

      firstSource
        .setURL(firstURL)
        .then(() => secondSource.setURL(secondURL))
        .then(() => firstSource.getURL())
        .then((url1) => {
          expect(url1).toBeTypeOf('string');
          expect(url1).toEqual(firstURL);
          return secondSource.getURL();
        })
        .then((url2) => {
          expect(url2).toBeTypeOf('string');
          expect(url2).toEqual(secondURL);
          done();
        });
    });
  });

  describe('should be able to get and set browser transparency', () => {
    var randomBool = randomBoolean();
    it('through a promise', (done) => {
      var promise = firstSource.isBrowserTransparent();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it('as a boolean', (done) => {
      firstSource
        .enableBrowserTransparency(randomBool)
        .then(() => firstSource.isBrowserTransparent())
        .then((isTransparent) => {
          expect(isTransparent).toBe(randomBool);
          return firstSource.enableBrowserTransparency(!randomBool);
        })
        .then(() => firstSource.isBrowserTransparent())
        .then((isTransparent) => {
          expect(isTransparent).toBe(!randomBool);
          done();
        });
    });
  });

  describe('should be able to get and set usage of up to 60 fps', () => {
    var randomBool = randomBoolean();
    // var randomBool = true;
    it('through a promise', (done) => {
      var promise = firstSource.isBrowser60FPS();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it('as a boolean', (done) => {
      firstSource
        .enableBrowser60FPS(randomBool)
        .then(() => {
          // we put delay here to hack on enable also getting first the property
          return new Promise((resolve) => setTimeout(resolve, 0));
        })
        .then(() => firstSource.isBrowser60FPS())
        .then((is60fps) => {
          expect(is60fps).toBe(randomBool);
          return firstSource.enableBrowser60FPS(!randomBool);
        })
        .then(() => firstSource.isBrowser60FPS())
        .then((is60fps) => {
          expect(is60fps).toBe(!randomBool);
          done();
        });
    });
  });

  describe('should be able to get and set custom resolution', () => {
    it('through a promise', (done) => {
      var promise = firstSource.getBrowserCustomSize();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it('as a Rectangle object', (done) => {
      var firstRand = randomInt(0, 1000);
      var secondRand = randomInt(0, 1000);
      var thirdRand = randomInt(0, 1000);
      var fourthRand = randomInt(0, 1000);

      var firstRec = XJS.Rectangle.fromDimensions(firstRand, secondRand);
      var secondRec = XJS.Rectangle.fromDimensions(thirdRand, fourthRand);

      firstSource
        .setBrowserCustomSize(firstRec)
        .then(() => secondSource.setBrowserCustomSize(secondRec))
        .then(() => firstSource.getBrowserCustomSize())
        .then((rec1) => {
          expect(rec1).toBeInstanceOf(XJS.Rectangle);
          expect(rec1.toDimensionString()).toEqual(firstRec.toDimensionString());
          return secondSource.getBrowserCustomSize();
        })
        .then((rec2) => {
          expect(rec2).toBeInstanceOf(XJS.Rectangle);
          expect(rec2.toDimensionString()).toEqual(secondRec.toDimensionString());
          done();
        });
    });
  });

  describe('should be able to get and set if right click is allowed', () => {
    var randomBool = randomBoolean();
    it('through a promise', (done) => {
      var promise = firstSource.getAllowRightClick();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it('as a boolean', (done) => {
      firstSource
        .setAllowRightClick(randomBool)
        .then(() => firstSource.getAllowRightClick())
        .then((isAllowed) => {
          expect(isAllowed).toBe(randomBool);
          return firstSource.setAllowRightClick(!randomBool);
        })
        .then(() => firstSource.getAllowRightClick())
        .then((isAllowed) => {
          expect(isAllowed).toBe(!randomBool);
          done();
        });
    });
  });

  describe('should be able to get and set custom JS and CSS', () => {
    it('through a promise', (done) => {
      var promise = firstSource.getBrowserJS();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it('which does not overwrite each other', (done) => {
      var firstJS = `console.log('READY')`;
      var secondJS = `alert('START')`;
      var randomBool = randomBoolean();
      var firstCSS = 'body{ color: red }';
      var secondCSS = 'body{ background-color: blue }';

      firstSource
        .setBrowserJS(firstJS)
        .then(() => secondSource.setBrowserJS(secondJS))
        .then(() => secondSource.setCustomCSS(secondCSS))
        .then(() => firstSource.setCustomCSS(firstCSS))
        .then(() => firstSource.enableCustomCSS(randomBool))
        .then(() => firstSource.isCustomCSSEnabled())
        .then((isEnabled1) => {
          expect(isEnabled1).toBeTypeOf('boolean');
          expect(isEnabled1).toBe(randomBool);
          return firstSource.enableCustomCSS(!randomBool);
        })
        .then(() => firstSource.isCustomCSSEnabled())
        .then((isEnabled1) => {
          expect(isEnabled1).toBeTypeOf('boolean');
          expect(isEnabled1).toBe(!randomBool);
          return secondSource.enableCustomCSS(!randomBool);
        })
        .then(() => secondSource.isCustomCSSEnabled())
        .then((isEnabled2) => {
          expect(isEnabled2).toBeTypeOf('boolean');
          expect(isEnabled2).toBe(!randomBool);
          return secondSource.enableCustomCSS(randomBool);
        })
        .then(() => secondSource.isCustomCSSEnabled())
        .then((isEnabled2) => {
          expect(isEnabled2).toBeTypeOf('boolean');
          expect(isEnabled2).toBe(randomBool);
          return firstSource.getCustomCSS();
        })
        .then((customCSS1) => {
          expect(customCSS1).toBeTypeOf('string');
          expect(customCSS1).toEqual(firstCSS);
          return secondSource.getCustomCSS();
        })
        .then((customCSS2) => {
          expect(customCSS2).toBeTypeOf('string');
          expect(customCSS2).toEqual(secondCSS);
          return secondSource.getBrowserJS();
        })
        .then((browserJS2) => {
          expect(browserJS2).toBeTypeOf('string');
          expect(browserJS2).toEqual(secondJS);
          return firstSource.getBrowserJS();
        })
        .then((browserJS1) => {
          expect(browserJS1).toBeTypeOf('string');
          expect(browserJS1).toEqual(firstJS);
          return firstSource.enableBrowserJS(randomBool);
        })
        .then(() => firstSource.isBrowserJSEnabled())
        .then((isEnabled1) => {
          expect(isEnabled1).toBeTypeOf('boolean');
          expect(isEnabled1).toBe(randomBool);
          return firstSource.enableBrowserJS(!randomBool);
        })
        .then(() => firstSource.isBrowserJSEnabled())
        .then((isEnabled1) => {
          expect(isEnabled1).toBeTypeOf('boolean');
          expect(isEnabled1).toBe(!randomBool);
          return secondSource.enableBrowserJS(!randomBool);
        })
        .then(() => secondSource.isBrowserJSEnabled())
        .then((isEnabled2) => {
          expect(isEnabled2).toBeTypeOf('boolean');
          expect(isEnabled2).toBe(!randomBool);
          return secondSource.enableBrowserJS(randomBool);
        })
        .then(() => secondSource.isBrowserJSEnabled())
        .then((isEnabled2) => {
          expect(isEnabled2).toBeTypeOf('boolean');
          expect(isEnabled2).toBe(randomBool);
          done();
        });
    });
  });
});
