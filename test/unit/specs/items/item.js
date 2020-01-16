/* globals describe, it, expect, require */

describe('Item ===', function() {
  var Item;
  var local = {};
  var XJS = require('xjs');
  var appVersion = navigator.appVersion;
  var Source = XJS.Source;
  var mix = new window.Mixin([
    function() {
      navigator.__defineGetter__('appVersion', function() {
        return 'XSplit Broadcaster 2.7.1702.2231 ';
      });
    },
    function() {
      navigator.__defineGetter__('appVersion', function() {
        return 'XSplit Broadcaster 2.9.1611.1623 ';
      });
    }
  ]);
  var exec = mix.exec.bind(mix);

  var getLocal = function(prop) {
    global_asyncId++;
    var asyncId = new Date().getTime() + '_' + global_asyncId;

    switch (prop) {
      case 'prop:name':
        setTimeout(function() {
          window.OnAsyncCallback(asyncId, local.name);
        }, 10);
      break;

      case 'prop:cname':
        setTimeout(function() {
          window.OnAsyncCallback(asyncId, local.cname);
        }, 10);
      break;

      case 'prop:srcitem':
        setTimeout(function() {
          window.OnAsyncCallback(asyncId, local.item);
        }, 10);
      break;

      case 'prop:item':
        setTimeout(function() {
          window.OnAsyncCallback(asyncId, local.item);
        }, 10);
      break;

      case 'prop:keeploaded':
        setTimeout(function() {
          window.OnAsyncCallback(asyncId, local.keeploaded);
        }, 10);
      break;

      case 'itemlist':
        setTimeout(function() {
          window.OnAsyncCallback(asyncId, '{1B4B6EDA-1ECC-4C8B-8CCF-A05C15EA3F85}');
        }, 10);
      break;

      case 'prop:srcid':
        setTimeout(function() {
          window.OnAsyncCallback(
            asyncId,
            '{CB4EB352-D86F-4478-8BFD-55FF53216697}'
          );
        }, 10);
      break;

      case 'prop:globalsrc':
        setTimeout(function() {
          window.OnAsyncCallback(
            asyncId,
            '1'
          );
        }, 10);
      break;

      case 'config':
        setTimeout(function() {
          window.OnAsyncCallback(
            asyncId,
            '<item pos_left="0.000000" pos_top="0.000000" pos_right="0.500000" pos_bottom="0.500000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="0" lockmove="0" keep_ar="1" visible="1" alpha="255" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{1B4B6EDA-1ECC-4C8B-8CCF-A05C15EA3F85}" srcid="{60A168F5-A726-4B55-8AD9-BDD4D88258E2}" type="8" name="http://localhost/XJS/test/functional/test.html" cname="" item="http://localhost/XJS/test/functional/test.html*{&quot;configUrl&quot;:&quot;http://localhost/XJS/test/functional/test.html&quot;}" itemaudio="" volume="100" mute="0" sounddev="0" fdeinterlace="0" mipmaps="0" autoresdet="1" keeploaded="1" cc_pin="0" key_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:0.970000&amp;str:0.900000&amp;rad:0.070000&amp;color:2155905152&amp;trail:0.000000&amp;filtering:0.000000&amp;fill:0" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" LiveDetectSignal="1" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="640" BrowserSizeY="360" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" DllGrant="" custom=""><presproperty __map_id="BrowserSize">0,0</presproperty><presproperty __map_id="BrowserSizeOnSet">640,360</presproperty></item>'
          );
        }, 10);
      break;

      case 'stats:frames':
        setTimeout(function() {
          window.OnAsyncCallback(asyncId, parseInt(Date.now()/25));
        }, 10);
      break;
    }

    return asyncId;
  };

  var setLocal = function(prop, val) {
    switch (prop) {
      case 'prop:name':
        local.name = val;
      break;

      case 'prop:cname':
        local.cname = val;
      break;

      case 'prop:srcitem':
        local.item = val;
      break;

      case 'prop:keeploaded':
        local.keeploaded = val;
      break;

      case 'prop:globalsrc':
        local.isGlobal = val;
      break;

      case 'prop:srcid':
        local.srcid = val;
      break;
    }
  }

  if (!/xsplit broadcaster/ig.test(navigator.appVersion)) {
    Item = new XJS.Item({
      id: '{1B4B6EDA-1ECC-4C8B-8CCF-A05C15EA3F85}',
      sceneId : 1
    });
  }

  beforeEach(function(done) {
    if (!/xsplit broadcaster/ig.test(navigator.appVersion)) {
      spyOn(window.external, 'SetLocalPropertyAsync')
        .and.callFake(setLocal);

      spyOn(window.external, 'SetLocalPropertyAsync2')
        .and.callFake(setLocal);

      spyOn(window.external, 'GetLocalPropertyAsync')
        .and.callFake(getLocal);

      spyOn(window.external, 'GetLocalPropertyAsync2')
        .and.callFake(getLocal);

      spyOn(window.external, 'AppGetPropertyAsync')
        .and.callFake(function(prop) {

          global_asyncId++;
          var asyncId = new Date().getTime() + '_' + global_asyncId;
          if (prop === 'sceneconfig') {
            setTimeout(function() {
              window.OnAsyncCallback(asyncId, encodeURIComponent('<placement name="Scene 3" id="{219DB767-BE5B-4389-90C2-E712F08EA2CC}" defpos="1"><item pos_left="0.000000" pos_top="0.000000" pos_right="0.500000" pos_bottom="0.500000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="0" lockmove="0" keep_ar="1" visible="1" alpha="255" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{1B4B6EDA-1ECC-4C8B-8CCF-A05C15EA3F85}" srcid="{60A168F5-A726-4B55-8AD9-BDD4D88258E2}" type="8" name="http://localhost/XJS/test/functional/test.html" cname="" item="http://localhost/XJS/test/functional/test.html*{&quot;configUrl&quot;:&quot;http://localhost/XJS/test/functional/test.html&quot;}" itemaudio="" volume="100" mute="0" sounddev="0" fdeinterlace="0" mipmaps="0" autoresdet="1" keeploaded="1" cc_pin="0" key_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:0.970000&amp;str:0.900000&amp;rad:0.070000&amp;color:2155905152&amp;trail:0.000000&amp;filtering:0.000000&amp;fill:0" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" LiveDetectSignal="1" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="640" BrowserSizeY="360" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" DllGrant="" custom=""><presproperty __map_id="BrowserSize">0,0</presproperty><presproperty __map_id="BrowserSizeOnSet">640,360</presproperty></item></placement>'));
            }, 10);
          } else if (prop.startsWith('sceneconfig:')) {
            var sceneIndex = prop.substring(13);
            if (sceneIndex !== '2') {
              var sceneName;
              if (!isNaN(sceneIndex)) {
                sceneIndex = Number(sceneIndex) + 1;
              }
              sceneName = 'Scene ' + sceneIndex;
              setTimeout(function() {
                window.OnAsyncCallback(asyncId, encodeURIComponent('<placement name="' + sceneName + '" defpos="0" id="{219DB767-BE5B-4389-90C2-E712F08EA2CC}"><item pos_left="0.000000" pos_top="0.000000" pos_right="0.500000" pos_bottom="0.500000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="0" lockmove="0" keep_ar="1" visible="1" alpha="255" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{1B4B6EDA-1ECC-4C8B-8CCF-A05C15EA3F85}" srcid="{60A168F5-A726-4B55-8AD9-BDD4D88258E2}" type="8" name="http://localhost/XJS/test/functional/test.html" cname="" item="http://localhost/XJS/test/functional/test.html*{&quot;configUrl&quot;:&quot;http://localhost/XJS/test/functional/test.html&quot;}" itemaudio="" volume="100" mute="0" sounddev="0" fdeinterlace="0" mipmaps="0" autoresdet="1" keeploaded="1" cc_pin="0" key_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:0.970000&amp;str:0.900000&amp;rad:0.070000&amp;color:2155905152&amp;trail:0.000000&amp;filtering:0.000000&amp;fill:0" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" LiveDetectSignal="1" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="640" BrowserSizeY="360" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" DllGrant="" custom=""><presproperty __map_id="BrowserSize">0,0</presproperty><presproperty __map_id="BrowserSizeOnSet">640,360</presproperty></item></placement>'));
              }, 10);
            } else {
              setTimeout(function() {
                window.OnAsyncCallback(asyncId, encodeURIComponent('<placement name="Scene 3" id="{219DB767-BE5B-4389-90C2-E712F08EA2CC}" defpos="1"><item pos_left="0.000000" pos_top="0.000000" pos_right="0.500000" pos_bottom="0.500000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="0" lockmove="0" keep_ar="1" visible="1" alpha="255" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{1B4B6EDA-1ECC-4C8B-8CCF-A05C15EA3F85}" srcid="{60A168F5-A726-4B55-8AD9-BDD4D88258E2}" type="8" name="http://localhost/XJS/test/functional/test.html" cname="" item="http://localhost/XJS/test/functional/test.html*{&quot;configUrl&quot;:&quot;http://localhost/XJS/test/functional/test.html&quot;}" itemaudio="" volume="100" mute="0" sounddev="0" fdeinterlace="0" mipmaps="0" autoresdet="1" keeploaded="1" cc_pin="0" key_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:0.970000&amp;str:0.900000&amp;rad:0.070000&amp;color:2155905152&amp;trail:0.000000&amp;filtering:0.000000&amp;fill:0" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" LiveDetectSignal="1" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="640" BrowserSizeY="360" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" DllGrant="" custom=""><presproperty __map_id="BrowserSize">0,0</presproperty><presproperty __map_id="BrowserSizeOnSet">640,360</presproperty></item></placement>'));
              }, 10);
            }
          }
          return asyncId;
        });
      done();
    } else {
      XJS.Environment.initialize();
      XJS.Scene.getActiveScene().then(function(scene) {
        scene.getItems().then(function(items) {
          if (items.length === 0) {
            throw new Error('NO ITEMS ON CURRENT SCENE');
          }

          Item = items[0];
          done();
        });
      });
    }
  });

  afterEach(function() {
    navigator.__defineGetter__('appVersion', function() {
      return appVersion;
    });
  });

  it('should be able to set and get the name', function(done) {
    var word = randomWord(5);
    exec(function(next) {
      Item.setName(word);
      Item.getName().then(function(val) {
        expect(val).toEqual(word);
        next();
      });
    }).then(done);
  });

  it('should be able to set and get the custom name', function(done) {
    var word = randomWord(5);
    exec(function(next) {
      Item.setCustomName(word);
      Item.getCustomName().then(function(val) {
        expect(val).toEqual(word);
        next();
      });
    }).then(done);
  });

  it('should be able to set and get the value', function(done) {
    var word = randomWord(5);
    exec(function(next) {
      Item.setValue(word);
      Item.getValue().then(function(val) {
        expect(val).toEqual(word);
        next();
      });
    }).then(done);
  });

  it('should be able to set and get keep loaded property', function(done) {
    exec(function(next) {
      Item.setKeepLoaded(!local.keeploaded);
      Item.getKeepLoaded().then(function(val) {
        expect(val).toBeTypeOf('boolean');
        local.keeploaded = val;
        next();
      });
    }).then(done);
  });

  it('should be able to get the id', function(done) {
    exec(function(next) {
      Item.getId().then(function(val) {
        expect(val).toBeDefined();
        next();
      });
    }).then(done);
  });

  it('should be able to get its source', function(done) {
    exec(function(next) {
      Item.getSource().then(function(source) {
        expect(source).toBeDefined();
        expect(source).toBeInstanceOf(Source);
        next();
      });
    }).then(done);
  });

  it('should be able to get the scene id', function(done) {
    exec(function(next) {
      Item.getSceneId().then(function(val) {
        expect(val).toBeTypeOf('number');
        expect(val).not.toBeNaN();
        next();
      });
    }).then(done);
  });

  it('should have toXML method', function() {
    expect(Item).hasMethods('toXML');
  });

  it('should have getFPS method', function(done) {
    expect(Item).hasMethods('getFPS');
    exec(function(next) {
      Item.getFPS().then(function(val) {
        expect(val).toBeTypeOf('number');
        expect(val).not.toBeNaN();
        next();
      })
    }).then(done);
  });

  it('should have duplicate method', function() {
    expect(Item).hasMethods('duplicate');
  })

  it('should have unlink method', function() {
    expect(Item).hasMethods('unlink');
  })


  it('shoud have static getItemList method', function() {
    expect(Item).hasMethods('getItemList');
  })

  describe('interface method checking', function() {

        it('should implement the layout interface', function() {
          expect(Item).hasMethods([
            'isKeepAspectRatio',
            'setKeepAspectRatio',
            'isPositionLocked',
            'setPositionLocked',
            'isEnhancedResizeEnabled',
            'setEnhancedResizeEnabled',
            'getPosition',
            'setPosition',
            'getRotateY',
            'setRotateY',
            'getRotateX',
            'setRotateX',
            'getRotateZ',
            'setRotateZ',
            'getCropping',
            'setCropping',
            'getCanvasRotate',
            'setCanvasRotate',
            'getEnhancedRotate',
            'setEnhancedRotate',
            'setCroppingEnhanced',
            'bringForward',
            'sendBackward',
            'bringToFront',
            'sendToBack'
            ].join(','));
        });

        it('should implement the iSource interface', function() {
          expect(Item).hasMethods([
            'setName',
            'getName',
            'setCustomName',
            'getCustomName',
            'getValue',
            'setValue',
            'getKeepLoaded',
            'setKeepLoaded',
            'refresh',
            'getType'
          ].join(','));
        })
      });
});
