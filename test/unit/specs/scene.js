/* globals describe, it, expect, require, beforeEach, jasmine, spyOn, beforeAll, afterEach, afterAll */

describe('Scene ===', function() {
  'use strict';

  var startsWith = function(mainString, stringCompared) {
    return mainString.toLowerCase().substring(0, stringCompared.length) ===
      stringCompared.toLowerCase();
  };

  var lut = []; for (var i=0; i<256; i++) { lut[i] = (i<16?'0':'')+(i).toString(16); }
  var getNewUID = function()
  {
    var d0 = Math.random()*0xffffffff|0;
    var d1 = Math.random()*0xffffffff|0;
    var d2 = Math.random()*0xffffffff|0;
    var d3 = Math.random()*0xffffffff|0;
    return lut[d0&0xff]+lut[d0>>8&0xff]+lut[d0>>16&0xff]+lut[d0>>24&0xff]+'-'+
    lut[d1&0xff]+lut[d1>>8&0xff]+'-'+lut[d1>>16&0x0f|0x40]+lut[d1>>24&0xff]+'-'+
    lut[d2&0x3f|0x80]+lut[d2>>8&0xff]+'-'+lut[d2>>16&0xff]+lut[d2>>24&0xff]+
    lut[d3&0xff]+lut[d3>>8&0xff]+lut[d3>>16&0xff]+lut[d3>>24&0xff];
  }

  var ctr = 0;

  var XJS = require('xjs');
  var Scene = XJS.Scene;
  var Item = XJS.Item;
  var Source = XJS.Source;
  var env = new window.Environment(XJS);
  var mockPresetConfig = '<configuration cur="0"><placement name="Scene 1" id="{239DB767-BE5B-4389-90C2-E712F08EA2CC}" defpos="1"></placement><placement name="Scene 2" id="{219DB767-BE5B-4389-90C2-E712F08EA2CC}" defpos="4"><item pos_left="0.000000" pos_top="0.000000" pos_right="0.500000" pos_bottom="0.500000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="0" lockmove="0" keep_ar="1" visible="1" alpha="255" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" pan="0" pan_config="R:1.000000&amp;la:0.000000&amp;fi:0.000000" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" trscenter="0" trscexit="0" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{A62E88ED-0A68-4243-BF5B-06CCD6D531C9}" srcid="{C14A3FCE-975F-43A5-88E7-A857FFB3E836}" type="8" name="https://www.google.com.ph/" cname="" item="https://www.googgle.com.ph/" custom=""/></placement><global/></configuration>'
  var environment = XJS.Environment;
  var environments = ['props', 'extension', 'plugin'];
  var appVersion = navigator.appVersion;
  var global = {};

  var mix = new window.Mixin([
    function() {
      navigator.__defineGetter__('appVersion', function() {
        return 'XSplit Broadcaster 2.7.1702.2231 ';
      });
    },
    function() {
      navigator.__defineGetter__('appVersion', function() {
        return 'XSplit Broadcaster 3.0.1704.2101 ';
      });
    }
  ]);
  var exec = mix.exec.bind(mix);

  afterEach(function() {
    navigator.__defineGetter__('appVersion', function() {
      return appVersion;
    });
  });

  describe('should be able to get current number of scenes', function() {
    beforeEach(function() {
      spyOn(window.external, 'AppGetPropertyAsync')
        .and.callFake(function(funcName) {
        ctr++;
        var asyncId = ctr;
        if (funcName === 'scenecount') {
          setTimeout(function() {
            window.OnAsyncCallback(asyncId, '5');
          },10);
        } else if (funcName === 'sceneconfig') {
          setTimeout(function() {
            window.OnAsyncCallback(asyncId,
              encodeURIComponent(mockPresetConfig));
          },10);
        }
        return asyncId;
      });
    });

    it('as a number', function(done) {
      exec(function(next) {
        Scene.getSceneCount().then(function(sceneCount) {
          expect(sceneCount).toBeTypeOf('number');
          next();
        });
      }).then(done);
    });
  });

  describe('should be able to fetch a specific scene by id', function() {
    beforeEach(function() {
      spyOn(window.external, 'AppGetPropertyAsync')
        .and.callFake(function(funcName) {
        ctr++;
        var asyncId = ctr;
        if (funcName === 'scenecount') {
          setTimeout(function() {
            window.OnAsyncCallback(asyncId, '5');
          },10);
        } else if (funcName === 'sceneconfig') {
          setTimeout(function() {
            window.OnAsyncCallback(asyncId,
              encodeURIComponent(mockPresetConfig));
          },10);

        }
        return asyncId;
      });
    });

    it('asynchronously', function(done) {
      exec(function(next) {
        Scene.getById(2).then(function(scene) {
          expect(scene).toBeInstanceOf(Scene);
          return Scene.getById('i12');
        }).then(function(scene) {
          expect(scene).toBeInstanceOf(Scene);
          return Scene.getById(100);
        }).then(function() {
          done.fail('getById should reject if scene id is higher than scene count');
        }, function(scene) {
          return Scene.getById('Test string');
        }).then(function() {
          done.fail('getById should reject if scene id is string other than i12');
        }, function() {
          next();
        });
      }).then(done);
    });
  });

  describe('should be able to fetch a specific scene by index', function() {
    beforeEach(function() {
      spyOn(window.external, 'AppGetPropertyAsync')
        .and.callFake(function(funcName) {
        ctr++;
        var asyncId = ctr;
        if (funcName === 'scenecount') {
          setTimeout(function() {
            window.OnAsyncCallback(asyncId, '5');
          },10);
        }  else if (funcName === 'sceneconfig') {
          setTimeout(function() {
            window.OnAsyncCallback(asyncId,
              encodeURIComponent(mockPresetConfig));
          },10);
        }
        return asyncId;
      });
    });

    it('asynchronously', function(done) {
      exec(function(next) {
        Scene.getBySceneIndex(2).then(function(scene) {
          expect(scene).toBeInstanceOf(Scene);
          return Scene.getBySceneIndex('i12');
        }).then(function(scene) {
          expect(scene).toBeInstanceOf(Scene);
          return Scene.getBySceneIndex(100);
        }).then(function() {
          done.fail('getBySceneIndex should reject if scene id is higher than scene count');
        }, function(scene) {
          return Scene.getBySceneIndex('Test string');
        }).then(function() {
          done.fail('getBySceneIndex should reject if scene id is string other than i12');
        }, function() {
          next();
        });
      }).then(done);
    });
  });

  describe('should be able to fetch a specific scene by UID', function() {
    beforeEach(function() {
      spyOn(window.external, 'AppGetPropertyAsync')
        .and.callFake(function(funcName) {
        ctr++;
        var asyncId = ctr;
        if (funcName === 'scenecount') {
          setTimeout(function() {
            window.OnAsyncCallback(asyncId, '5');
          },10);
        }  else if (funcName === 'sceneconfig') {
          setTimeout(function() {
            window.OnAsyncCallback(asyncId,
              encodeURIComponent(mockPresetConfig));
          },10);
        }
        return asyncId;
      });
    });

    it('asynchronously', function(done) {
      navigator.__defineGetter__('appVersion', function() {
        return 'XSplit Broadcaster 3.0.1704.2101 ';
      });
      Scene.getBySceneUid('{239DB767-BE5B-4389-90C2-E712F08EA2CC}')
      .then(function(scene) {
        expect(scene).toBeInstanceOf(Scene);
        return Scene.getBySceneUid('NOT A  VALID UNIQUE ID');
      }).then(function() {
        done.fail('getBySceneUid should reject if param supplied is not a valid UID string');
      }, function(scene) {
        return Scene.getBySceneUid('{00000000-0000-0000-0000-000000000000}');
      }).then(function() {
        done.fail('getBySceneUid should reject if no scene is matching with the supplied UID');
      }, function() {
        done();
      });
    });
  });

  describe('should be able to fetch a specific scene by name', function() {
    beforeEach(function() {
      spyOn(window.external, 'AppGetPropertyAsync')
        .and.callFake(function(funcName) {
          ctr++;
          var asyncId = ctr;
          if (funcName === 'scenecount') {
            setTimeout(function() {
              window.OnAsyncCallback(asyncId, '5');
            },10);

          } else if (startsWith(funcName, 'scenename:')) {
            var sceneIndex = funcName.substring(10);
            var name;
            if (sceneIndex === '{239DB767-BE5B-4389-90C2-E712F08EA2CC}' || sceneIndex === '{219DB767-BE5B-4389-90C2-E712F08EA2CC}') {
              name = 'Scene 1';
            } else if (sceneIndex === '0' || sceneIndex === '4') {
              name = 'Scene 1';
            } else {
              if (!isNaN(sceneIndex)) {
                sceneIndex = Number(sceneIndex) + 1;
              }
              name = 'Scene ' + sceneIndex;
            }
            setTimeout(function() {
              window.OnAsyncCallback(asyncId, name);
            },10);
          } else if (funcName === 'sceneconfig') {
            setTimeout(function() {
              window.OnAsyncCallback(asyncId,
                encodeURIComponent(mockPresetConfig));
            },10);
          }

          return asyncId;
        });
    });

    it('and return as an array of Scene objects', function(done) {
      exec(function(next) {
        Scene.getByName('Scene 1')
        .then(function(scene) {
          expect(scene.length).toEqual(2);
          expect(scene).eachToBeInstanceOf(Scene);
          return Scene.getByName('Random scene name');
        }).then(function(scene) {
          expect(scene.length).toEqual(0);
          return Scene.getByName(true);
        }).then(function(scene) {
          expect(scene.length).toEqual(0);
          next();
        });
      }).then(done);
    });
  });

  describe('should be able to fetch current scene', function() {
    beforeEach(function() {
      spyOn(window.external, 'AppGetPropertyAsync')
        .and.callFake(function(funcName) {
        ctr++;
        var asyncId = ctr;
        if (funcName === 'scene:0') {
          setTimeout(function() {
            window.OnAsyncCallback(asyncId, '0');
          },10);
        } else if (funcName === 'scenecount') {
          setTimeout(function() {
            window.OnAsyncCallback(asyncId, '12');
          },10);
        } else if (funcName === 'sceneconfig') {
          setTimeout(function() {
            window.OnAsyncCallback(asyncId,
              encodeURIComponent(mockPresetConfig));
          },10);
        }
        return asyncId;
      });
    });

    afterAll(function() {
      env.set(environments[1]);
    });

    it('through a promise', function(done) {
      exec(function(next) {
        var promise = Scene.getActiveScene();
        expect(promise).toBeInstanceOf(Promise);
        next();
      }).then(done);
    });

    it('as a Scene object', function(done) {
      exec(function(next) {
        Scene.getActiveScene()
        .then(function(scene) {
          expect(scene).toBeInstanceOf(Scene);
          next();
        });
      }).then(done);
    });

    it('but is rejected when called from source plugin', function(done) {
      env.set(environments[2]);
      exec(function(next) {
        Scene.getActiveScene()
        .then(function() {
          done.fail('getActiveScene should reject when used in source plugins');
        }, function() {
          next();
        });
      }).then(function() {
        expect(true).toBe(true);
        done();
      });
    });
  });

  describe('should be able to set current scene', function() {
    beforeEach(function() {
      spyOn(window.external, 'AppGetPropertyAsync')
        .and.callFake(function(funcName) {

        ctr++;
        var asyncId = ctr;
        if (funcName === 'scene:0') {
          setTimeout(function() {
            window.OnAsyncCallback(asyncId, global['scene:0']);
          },10);
        } else if (funcName === 'scenecount') {
          setTimeout(function() {
            window.OnAsyncCallback(asyncId, '12');
          },10);
        } else if (startsWith(funcName, 'scenename:')) {
          var sceneIndex = funcName.substring(10);
          if (!isNaN(sceneIndex)) {
            sceneIndex = Number(funcName.substring(10)) + 1;
          }
          if(sceneIndex === '{239DB767-BE5B-4389-90C2-E712F08EA2CC}'){
            sceneIndex = 1
          }
          if(sceneIndex === '{219DB767-BE5B-4389-90C2-E712F08EA2CC}'){
            sceneIndex = 2
          }

          var name = 'Scene ' + sceneIndex;
          setTimeout(function() {
            window.OnAsyncCallback(asyncId, name);
          },10);
        } else if (funcName === 'sceneconfig') {
          setTimeout(function() {
            window.OnAsyncCallback(asyncId,
              encodeURIComponent(mockPresetConfig));
          },10);
        }
        return asyncId;
      });

      spyOn(window.external, 'AppSetPropertyAsync')
        .and.callFake(function(funcName, value) {
        global[funcName] = value;
        // if (funcName === 'preset' && typeof value == 'string') {
          ctr++;
          var asyncId = ctr;
          setTimeout(function() {
            window.OnAsyncCallback(asyncId, '1');
          }, 10);

          return asyncId;
        // }
      });

      spyOn(window.external, 'GetGlobalProperty')
      .and.callFake(function(val) {
        if (val === 'splitmode') {
          return '0';
        }
      })
    });

    afterAll(function() {
      env.set(environments[1]);
    });

    it('through a promise', function(done) {
      exec(function(next) {
        var promise = Scene.setActiveScene(1);
        expect(promise).toBeInstanceOf(Promise);
        next();
      }).then(done);
    });

    it('from an integer', function(done) {
      exec(function(next) {
        var index = Math.floor((Math.random() * 2) + 1);

        Scene.setActiveScene(index)
        .then(function() {
          return Scene.getActiveScene();
        })
        .then(function(currentScene) {
          expect(currentScene._id).toEqual(index - 1);
          return Scene.setActiveScene(-1);
        }).then(function() {
          done.fail('setActiveScene should reject when index is lower than 1')
        }, function() {
          return Scene.setActiveScene(2.5);
        }).then(function() {
          done.fail('setActiveScene should reject when a non-integer number is used')
        }, function() {
          next();
        });
      }).then(done);
    });

    it('from a Scene object', function(done) {
      exec(function(next) {
        var index = Math.floor((Math.random() * 2) + 1);
        Scene.getByName('Scene ' + index)
        .then(function(scene) {
          return Scene.setActiveScene(scene[0]);
        })
        .then(function(scene) {
          return Scene.getActiveScene();
        })
        .then(function(currentScene) {
          expect(currentScene._id).toEqual(index - 1);
          next();
        });
      }).then(done);
    });

    describe('but not', function() {
      it('for any other parameter', function(done) {
        exec(function(next) {
          Scene.setActiveScene(true)
          .then(function() {
            done.fail('setActiveScene should reject when other parameter types are used');
          }, function() {
            return Scene.setActiveScene("1");
          })
          .then(function() {
            done.fail('setActiveScene should reject when other parameter types are used');
          }, function() {
            expect(true).toBe(true);
            next();
          });
        }).then(done);
      });

      it('when called from source', function(done) {
        env.set(environments[2]);
        exec(function(next) {
          Scene.setActiveScene(1)
          .then(function() {
            done.fail('setActiveScene should reject when used in source plugins');
          }, function() {
            expect(true).toBe(true);
            next();
          });
        }).then(done);
      });
    });
  });

  describe('object instance', function() {
    var toggleGroupGet = false;
    beforeAll(function(done) {
      var ctr = 0;
      global['scenepresetlist'] = [];
      global['activepreset'] = '{00000000-0000-0000-0000-000000000000}';
      global['presettransitiontime'] = '0';
      global['scenetransitiontime'] = '0';
      global['scenename'] = 'DummyText';
      global['scenetransitionid'] = 'DummyTransition';

      spyOn(window.external, 'AppGetPropertyAsync')
        .and.callFake(function(funcName) {
        ctr++;
        if (funcName === 'scene:0') {
          setTimeout(function() {
            window.OnAsyncCallback(this, '0');
          }.bind(ctr),10);
        } else if (/^scenename:/.test(funcName)) {
          setTimeout(function() {
            window.OnAsyncCallback(this, global['scenename']);
          }.bind(ctr),10);
        } else if (/^sceneconfig:i12/.test(funcName)) {
          setTimeout(function() {
            window.OnAsyncCallback(this, 'null');
          }.bind(ctr),10);
        } else if (/^sceneconfig:/.test(funcName)) {
          if (toggleGroupGet) {
            setTimeout(function() {
              window.OnAsyncCallback(this, encodeURIComponent('<placement name="Scene 2" id="{9E7EB704-D845-4575-9C33-68F59D662329}" preset_id="{00000000-0000-0000-0000-000000000000}" preset_trtime="500" preset_trfunc="" defpos="0" trid="" trtime="500"><item pos_left="0.000000000e+00" pos_top="0.000000000e+00" pos_right="1.000000000e+00" pos_bottom="1.000000000e+00" pos_an="1" crop_left="0.000000000e+00" crop_top="0.000000000e+00" crop_right="0.000000000e+00" crop_bottom="0.000000000e+00" crop_an="1" pixalign="0" zorder="0" lockmove="0" keep_ar="0" visible="1" visible_an="1" alpha="255" alpha_an="1" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" cc_brightness_an="1" cc_contrast_an="1" cc_hue_an="1" cc_saturation_an="1" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" pan="0" pan_config="R:1.000000000e+00&amp;la:0.000000000e+00&amp;fi:0.000000000e+00" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" rotate_x_an="1" rotate_y_an="1" offset_x="0.000000000e+00" offset_y="0.000000000e+00" ShowPosition="0" OverlayURL="" OverlayConfig="" transitionid="" transitiontime="300" trscenter="0" trscexit="0" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{1E10BCFE-DF07-4FF0-BCEA-E8596742BBDD}" srcid="{446646B8-ECA8-4C68-B01A-2E7CB3504CF7}" type="12" name="Group" cname="" item="" itemaudio="" volume="100" mute="0" keepaudio="0" sounddev="0" mipmaps="0" autoresdet="1" keeploaded="1" RefreshOnScnLoad="0" RefreshOnSrcShow="0" zoom="l:0.000000000e+00|t:0.000000000e+00|r:1.000000000e+00|b:1.000000000e+00" or_enable="0" or_mode="0" or_angle="0" cc_pin="0" key_pin="0" edgeeffect_pin="0" effects_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:9.700000286e-01&amp;str:8.999999762e-01&amp;rad:7.000000030e-02&amp;color:2155905152&amp;trail:0.000000000e+00&amp;filtering:0.000000000e+00&amp;fill:0" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" LiveDetectSignal="1" CuePoints="" FilePlaylist="" fdeinterlace="0" InPoint="0" OutPoint="0" OpWhenFinished="0" StartOnLoad="1" StartOnSrcShow="0" RememberPosition="1" LastPosition="0" LastRunState="-1" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture1="1" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapEnc="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapFrameTimeLimit="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserCookiePath="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookieFlags="0" Browser60fps="0" BrowserZoom="1.000000000e+00" SwfWrapper="1" DllGrant="" custom=""><placement name="" id="{B115AD78-B6E2-4A40-A8C4-6ED5CB0BAA90}" preset_id="{00000000-0000-0000-0000-000000000000}" preset_trtime="0" preset_trfunc="" defpos="0" trid="" trtime="0"><item pos_left="0.000000000e+00" pos_top="0.000000000e+00" pos_right="1.000000000e+00" pos_bottom="1.000000000e+00" pos_an="1" crop_left="0.000000000e+00" crop_top="0.000000000e+00" crop_right="0.000000000e+00" crop_bottom="0.000000000e+00" crop_an="1" pixalign="0" zorder="0" lockmove="0" keep_ar="0" visible="1" visible_an="1" alpha="255" alpha_an="1" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="1" cc_brightness_an="1" cc_contrast_an="1" cc_hue_an="1" cc_saturation_an="1" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" pan="0" pan_config="R:1.000000000e+00&amp;la:0.000000000e+00&amp;fi:0.000000000e+00" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" rotate_x_an="1" rotate_y_an="1" offset_x="0.000000000e+00" offset_y="0.000000000e+00" ShowPosition="0" OverlayURL="" OverlayConfig="" transitionid="" transitiontime="300" trscenter="0" trscexit="0" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{53843D69-3128-44F6-8760-4B4718BC0461}" srcid="{22A2124F-C0B2-4EF4-81EE-F6B5C2C06332}" type="2" name="HD Pro Webcam C920" cname="" item="@DEVICE:PNP:\\?\USB#VID_046D&amp;PID_0892&amp;MI_00#7&amp;5BF7D2F&amp;1&amp;0000#{65E8773D-8F56-11D0-A3B9-00A0C9223196}\GLOBAL" itemaudio="" volume="100" mute="0" keepaudio="0" sounddev="0" mipmaps="0" autoresdet="1" keeploaded="1" RefreshOnScnLoad="0" RefreshOnSrcShow="0" zoom="l:0.000000000e+00|t:0.000000000e+00|r:1.000000000e+00|b:1.000000000e+00" or_enable="0" or_mode="0" or_angle="0" cc_pin="0" key_pin="0" edgeeffect_pin="0" effects_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:9.700000286e-01&amp;str:8.999999762e-01&amp;rad:7.000000030e-02&amp;color:2155905152&amp;trail:0.000000000e+00&amp;filtering:0.000000000e+00&amp;fill:0" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" LiveDetectSignal="1" CuePoints="" FilePlaylist="" fdeinterlace="0" InPoint="0" OutPoint="0" OpWhenFinished="0" StartOnLoad="1" StartOnSrcShow="0" RememberPosition="1" LastPosition="0" LastRunState="1" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture1="1" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapEnc="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapFrameTimeLimit="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserCookiePath="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookieFlags="0" Browser60fps="0" BrowserZoom="1.000000000e+00" SwfWrapper="1" DllGrant="" custom=""><presproperty __map_id="logitechcanrecommend">0</presproperty><presproperty __map_id="resetcamitemaudio">1</presproperty><presproperty __map_id="xsplitautoset">1</presproperty></item><item pos_left="5.000000000e-01" pos_top="0.000000000e+00" pos_right="1.000000000e+00" pos_bottom="5.000000000e-01" pos_an="1" crop_left="0.000000000e+00" crop_top="0.000000000e+00" crop_right="0.000000000e+00" crop_bottom="0.000000000e+00" crop_an="1" pixalign="0" zorder="1" lockmove="0" keep_ar="0" visible="1" visible_an="1" alpha="255" alpha_an="1" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" cc_brightness_an="1" cc_contrast_an="1" cc_hue_an="1" cc_saturation_an="1" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" pan="0" pan_config="R:1.000000000e+00&amp;la:0.000000000e+00&amp;fi:0.000000000e+00" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" rotate_x_an="1" rotate_y_an="1" offset_x="0.000000000e+00" offset_y="0.000000000e+00" ShowPosition="0" OverlayURL="" OverlayConfig="" transitionid="" transitiontime="300" trscenter="0" trscexit="0" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{B74FFBB1-2780-4C55-A74C-A9859087A72E}" srcid="{B3C8DC13-AB6A-4224-88FB-E1499DE41AD0}" type="8" name="http://xsplit.com" cname="" item="http://xsplit.com*" itemaudio="" volume="100" mute="0" keepaudio="0" sounddev="0" mipmaps="0" autoresdet="1" keeploaded="1" RefreshOnScnLoad="0" RefreshOnSrcShow="0" zoom="l:0.000000000e+00|t:0.000000000e+00|r:1.000000000e+00|b:1.000000000e+00" or_enable="0" or_mode="0" or_angle="0" cc_pin="0" key_pin="0" edgeeffect_pin="0" effects_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:9.700000286e-01&amp;str:8.999999762e-01&amp;rad:7.000000030e-02&amp;color:2155905152&amp;trail:0.000000000e+00&amp;filtering:0.000000000e+00&amp;fill:0" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" LiveDetectSignal="1" CuePoints="" FilePlaylist="" fdeinterlace="0" InPoint="0" OutPoint="0" OpWhenFinished="0" StartOnLoad="1" StartOnSrcShow="0" RememberPosition="1" LastPosition="0" LastRunState="-1" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture1="1" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapEnc="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapFrameTimeLimit="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserCookiePath="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookieFlags="0" Browser60fps="0" BrowserZoom="1.000000000e+00" SwfWrapper="1" DllGrant="" custom=""/></placement></item><item pos_left="2.653059959e-01" pos_top="5.000000000e-01" pos_right="7.653059959e-01" pos_bottom="1.000000000e+00" pos_an="1" crop_left="0.000000000e+00" crop_top="0.000000000e+00" crop_right="0.000000000e+00" crop_bottom="0.000000000e+00" crop_an="1" pixalign="0" zorder="1" lockmove="0" keep_ar="1" visible="1" visible_an="1" alpha="255" alpha_an="1" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" cc_brightness_an="1" cc_contrast_an="1" cc_hue_an="1" cc_saturation_an="1" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="50" key_chromasat="50" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" pan="0" pan_config="R:1.000000000e+00&amp;la:0.000000000e+00&amp;fi:0.000000000e+00" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" rotate_x_an="1" rotate_y_an="1" offset_x="0.000000000e+00" offset_y="0.000000000e+00" ShowPosition="0" OverlayURL="" OverlayConfig="" transitionid="" transitiontime="300" trscenter="0" trscexit="0" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{4742DD93-BECD-4EF2-83CE-B40728DEAC13}" srcid="{9A29D1EB-7BD8-4934-A82C-9BC72787AF64}" type="11" name="Scene: Scene 1" cname="" item="{7B13A7C7-3B1D-4EC1-AB02-BE08792EBA06}" itemaudio="" volume="100" mute="0" keepaudio="0" sounddev="0" mipmaps="0" autoresdet="1" keeploaded="1" RefreshOnScnLoad="0" RefreshOnSrcShow="0" zoom="l:0.000000000e+00|t:0.000000000e+00|r:1.000000000e+00|b:1.000000000e+00" or_enable="0" or_mode="0" or_angle="0" cc_pin="0" key_pin="0" edgeeffect_pin="0" effects_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:9.700000286e-01&amp;str:8.999999762e-01&amp;rad:7.000000030e-02&amp;color:2155905152&amp;trail:0.000000000e+00&amp;filtering:0.000000000e+00&amp;fill:0" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" LiveDetectSignal="1" CuePoints="" FilePlaylist="" fdeinterlace="0" InPoint="0" OutPoint="0" OpWhenFinished="0" StartOnLoad="1" StartOnSrcShow="0" RememberPosition="1" LastPosition="0" LastRunState="-1" ScrCapMethod="3" ScrCapLayered="1" ScrCapOptCapture1="1" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapEnc="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapFrameTimeLimit="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserCookiePath="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookieFlags="0" Browser60fps="0" BrowserZoom="1.000000000e+00" SwfWrapper="1" DllGrant="" custom=""/><item pos_left="0.000000000e+00" pos_top="0.000000000e+00" pos_right="5.000000000e-01" pos_bottom="5.000000000e-01" pos_an="1" crop_left="0.000000000e+00" crop_top="0.000000000e+00" crop_right="0.000000000e+00" crop_bottom="0.000000000e+00" crop_an="1" pixalign="0" zorder="2" lockmove="0" keep_ar="1" visible="1" visible_an="1" alpha="255" alpha_an="1" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" cc_brightness_an="1" cc_contrast_an="1" cc_hue_an="1" cc_saturation_an="1" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" pan="0" pan_config="R:1.000000000e+00&amp;la:0.000000000e+00&amp;fi:0.000000000e+00" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" rotate_x_an="1" rotate_y_an="1" offset_x="0.000000000e+00" offset_y="0.000000000e+00" ShowPosition="0" OverlayURL="" OverlayConfig="" transitionid="" transitiontime="300" trscenter="0" trscexit="0" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{816E09B1-8870-41A2-BCD3-CAE756FAE891}" srcid="{04BEC5B9-67B2-4645-936E-4B0D007799DA}" type="8" name="http://xsplit.com" cname="" item="http://xsplit.com*" itemaudio="" volume="100" mute="0" keepaudio="0" sounddev="0" mipmaps="0" autoresdet="1" keeploaded="1" RefreshOnScnLoad="0" RefreshOnSrcShow="0" zoom="l:0.000000000e+00|t:0.000000000e+00|r:1.000000000e+00|b:1.000000000e+00" or_enable="0" or_mode="0" or_angle="0" cc_pin="0" key_pin="0" edgeeffect_pin="0" effects_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:9.700000286e-01&amp;str:8.999999762e-01&amp;rad:7.000000030e-02&amp;color:2155905152&amp;trail:0.000000000e+00&amp;filtering:0.000000000e+00&amp;fill:0" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" LiveDetectSignal="1" CuePoints="" FilePlaylist="" fdeinterlace="0" InPoint="0" OutPoint="0" OpWhenFinished="0" StartOnLoad="1" StartOnSrcShow="0" RememberPosition="1" LastPosition="0" LastRunState="-1" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture1="1" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapEnc="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapFrameTimeLimit="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserCookiePath="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookieFlags="0" Browser60fps="0" BrowserZoom="1.000000000e+00" SwfWrapper="1" DllGrant="" custom=""/></placement>\n'));
            }.bind(ctr),10);
          } else {
            setTimeout(function() {
              window.OnAsyncCallback(this, encodeURIComponent('<placement name="Work Scene" id="{219DB767-BE5B-4389-90C2-E712F08EA2CC}" defpos="0"><item type="8" item="html:plugin:twitchchatplg*{&quot;manuallyConnected&quot;:&quot;Not Connected&quot;,&quot;connected&quot;:&quot;Not Connected&quot;,&quot;channel&quot;:&quot;&quot;,&quot;opacity&quot;:100,&quot;viewerColor&quot;:&quot;#627FFF&quot;,&quot;messageColor&quot;:&quot;#FFFFFF&quot;,&quot;viewerFont&quot;:&quot;Calibri&quot;,&quot;messageFont&quot;:&quot;Calibri&quot;,&quot;textSize&quot;:&quot;24&quot;}" itemaudio="" name="Twitch IRC Chat Viewer" cname="" pos_left="0.500000" pos_top="0.000000" pos_right="1.000000" pos_bottom="0.500000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="0" volume="100" mute="0" sounddev="0" lockmove="0" keep_ar="0" fdeinterlace="0" mipmaps="0" autoresdet="1" visible="1" keeploaded="1" alpha="255" border="-2147483648" cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_pin="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" key_smartcamenable="0" key_smartcamconfig="" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" syncid0="1146995751" syncid1="1216762279" syncid2="2586188951" syncid3="410786723" id="{0B3B74C1-64A5-4E4A-9AB2-FEBB6E0B3F5E}" srcid="{C14A3FCE-975F-43A5-88E7-A857FFB3E836}" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="1" GameCapPlSmoothness="1.000000" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" custom="{ &quot;connected&quot; : &quot;Not Connected&quot; }"/><item type="2" item="@DEVICE:PNP:\\\\?\\USB#VID_046D&amp;PID_082C&amp;MI_02#6&amp;16FD2F8D&amp;0&amp;0002#{65E8773D-8F56-11D0-A3B9-00A0C9223196}\\GLOBAL" itemaudio="" name="HD Webcam C615" cname="" pos_left="0.010981" pos_top="0.000000" pos_right="0.385798" pos_bottom="0.500000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="1" volume="100" mute="0" sounddev="0" lockmove="0" keep_ar="1" fdeinterlace="0" mipmaps="0" autoresdet="1" visible="1" keeploaded="1" alpha="255" border="0" cc_pin="1" cc_brightness="0" cc_contrast="-8" cc_hue="0" cc_saturation="0" cc_dynamicrange="1" key_pin="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" key_smartcamenable="0" key_smartcamconfig="" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" syncid0="3214440775" syncid1="1214254420" syncid2="2912452758" syncid3="3415282779" id="{75EF04AB-6915-4A88-8177-950B12186359}" srcid="{5ABD6ACD-A6BF-4A0B-A475-4ABB018A6787}" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="1" GameCapPlSmoothness="1.000000" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" custom=""/></placement>\n'));
            }.bind(ctr),10);
          }
        } else if (/^sceneconfig/.test(funcName)) {
          setTimeout(function() {
            window.OnAsyncCallback(this, encodeURIComponent(mockPresetConfig));
          }.bind(ctr),10);
        } else if (/^sceneisempty:/.test(funcName)) {
          setTimeout(function() {
            window.OnAsyncCallback(this, '0');
          }.bind(ctr),10);
        } else if (/^scenecount/.test(funcName)) {
          setTimeout(function() {
            window.OnAsyncCallback(this, '12');
          }.bind(ctr),10);
        } else if (/^scenepresetlist:/.test(funcName)) {
          setTimeout(function() {
            window.OnAsyncCallback(this, global['scenepresetlist'].join(','));
          }.bind(ctr),10);
        } else if (/^scenenewpreset:/.test(funcName)) {
          // get new uid
          var newUID = '{' + getNewUID() + '}';
          // add to array
          global['scenepresetlist'].push(newUID);
          // return
          setTimeout(function() {
            window.OnAsyncCallback(this, global['scenepresetlist'].join(','));
          }.bind(ctr),10);
        } else if (/^scenepreset:/.test(funcName)) {
          setTimeout(function() {
            window.OnAsyncCallback(this, global['activepreset']);
          }.bind(ctr),10);
        } else if (/^scenepresettransitionfunc:/.test(funcName)) {
          setTimeout(function() {
            window.OnAsyncCallback(this, global['scenepreseteasing']);
          }.bind(ctr),10);
        } else if (/^scenepresettransitiontime:/.test(funcName)) {
          setTimeout(function() {
            window.OnAsyncCallback(this, global['presettransitiontime']);
          }.bind(ctr),10);
        } else if (/^scenetransitiontime:/.test(funcName)) {
          setTimeout(function() {
            window.OnAsyncCallback(this, global['scenetransitiontime']);
          }.bind(ctr),10);
        } else if (/^scenetransitionid:/.test(funcName)) {
          setTimeout(function() {
            window.OnAsyncCallback(this, global['scenetransitionid']);
          }.bind(ctr),10);
        }
        return ctr;
      });

      spyOn(window.external, 'AppSetPropertyAsync')
        .and.callFake(function(funcName, ...args) {
        ctr++;
        if (/^scenename:/.test(funcName)) {
          setTimeout(function() {
            global['scenename'] = args[0];
            window.OnAsyncCallback(this, '1');
          }.bind(ctr),10);
        } else if (/^sceneconfig:/.test(funcName)) {
          setTimeout(function() {
            window.OnAsyncCallback(this, '0');
          }.bind(ctr),10);
        } else if (/^sceneremovepreset:/.test(funcName)) {
          var presetIndex = global['scenepresetlist'].indexOf(args[0]);
          global['scenepresetlist'].splice(presetIndex, 1);
          setTimeout(function() {
            window.OnAsyncCallback(this, "0");
          }.bind(ctr),10);
        } else if (/^scenepreset:/.test(funcName)) {
          global['activepreset'] = args[0];
          setTimeout(function() {
            window.OnAsyncCallback(this, "0");
          }.bind(ctr),10);
        } else if (/^scenepresettransitionfunc:/.test(funcName)) {
          global['scenepreseteasing'] = args[0];
          setTimeout(function() {
            window.OnAsyncCallback(this, "0");
          }.bind(ctr),10);
        } else if (/^scenepresettransitiontime:/.test(funcName)) {
          global['presettransitiontime'] = args[0];
          setTimeout(function() {
            window.OnAsyncCallback(this, "0");
          }.bind(ctr),10);
        } else if (/^scenetransitiontime:/.test(funcName)) {
          global['scenetransitiontime'] = args[0];
          setTimeout(function() {
            window.OnAsyncCallback(this, "0");
          }.bind(ctr),10);
        }  else if (/^scenetransitionid:/.test(funcName)) {
          global['scenetransitionid'] = args[0];
          setTimeout(function() {
            window.OnAsyncCallback(this, "0");
          }.bind(ctr),10);
        }
 
        return ctr;
      });

      spyOn(window.external, 'GetLocalPropertyAsync')
        .and.callFake(function(prop) {
        ctr++;
        switch (prop) {
          case 'prop:name':
            setTimeout(function() {
              window.OnAsyncCallback(this, 'Twitch IRC Chat Viewer');
            }.bind(ctr), 10);
          break;

          case 'prop:cname':
            setTimeout(function() {
              window.OnAsyncCallback(this, 'ChattyBoxxy');
            }.bind(ctr), 10);
          break;

          case 'prop:srcitem':
          case 'prop:item':
            setTimeout(function() {
              window.OnAsyncCallback(this, 'html:plugin:twitchchatplg*{&quot;manuallyConnected&quot;:&quot;Not Connected&quot;,&quot;connected&quot;:&quot;Not Connected&quot;,&quot;channel&quot;:&quot;&quot;,&quot;opacity&quot;:100,&quot;viewerColor&quot;:&quot;#627FFF&quot;,&quot;messageColor&quot;:&quot;#FFFFFF&quot;,&quot;viewerFont&quot;:&quot;Calibri&quot;,&quot;messageFont&quot;:&quot;Calibri&quot;,&quot;textSize&quot;:&quot;24&quot;}');
            }.bind(ctr), 10);
          break;

          case 'prop:type':
            setTimeout(function() {
              window.OnAsyncCallback(this, '8');
            }.bind(ctr), 10);
          break;

          case 'prop:srcid':
            setTimeout(function() {
              window.OnAsyncCallback(this, '{C14A3FCE-975F-43A5-88E7-A857FFB3E836}');
            }.bind(ctr), 10);
          break;

          case 'itemlist':
            setTimeout(function() {
              window.OnAsyncCallback(this, '{0B3B74C1-64A5-4E4A-9AB2-FEBB6E0B3F5E}');
            }.bind(ctr), 10);
          break;

        }

        return ctr;
      });

      spyOn(window.external, 'GetLocalPropertyAsync2')
        .and.callFake(function(prop) {
        ctr++;
        switch (prop) {
          case 'prop:name':
            setTimeout(function() {
              window.OnAsyncCallback(this, 'HD Webcam C615');
            }.bind(ctr), 10);
          break;
          case 'prop:cname':
            setTimeout(function() {
              window.OnAsyncCallback(this, 'MyCamera');
            }.bind(ctr), 10);
          break;

          case 'prop:srcitem':
          case 'prop:item':
            setTimeout(function() {
              window.OnAsyncCallback(this, '@DEVICE:PNP:\\\\?\\USB#VID_046D&amp;PID_082C&amp;MI_02#6&amp;16FD2F8D&amp;0&amp;0002#{65E8773D-8F56-11D0-A3B9-00A0C9223196}\\GLOBAL');
            }.bind(ctr), 10);
          break;

          case 'prop:type':
            setTimeout(function() {
              window.OnAsyncCallback(this, '8');
            }.bind(ctr), 10);
          break;

          case 'prop:srcid':
            setTimeout(function() {
              window.OnAsyncCallback(this, '{5ABD6ACD-A6BF-4A0B-A475-4ABB018A6787}');
            }.bind(ctr), 10);
          break;

          case 'itemlist':
            setTimeout(function() {
              window.OnAsyncCallback(this, '{75EF04AB-6915-4A88-8177-950B12186359}');
            }.bind(ctr), 10);
          break;
        }

        return ctr;
      });

      env.set(environments[0]);

      done();
    });

    afterEach(function() {
      navigator.__defineGetter__('appVersion', function() {
        return appVersion;
      });
    });

    it('should be able to get the scene number', function(done) {
      exec(function(next) {
        var scene;
        Scene.getActiveScene().then(function(result) {
          scene = result;
          return scene.getSceneNumber();
        }).then(function(id){
          expect(id).toBeTypeOf('number');
          expect(id).not.toBeNaN();
          next();
        });
      }).then(done);
    });

    it('should be able to get the scene index', function(done) {
      exec(function(next) {
        var scene;
        Scene.getActiveScene().then(function(result) {
          scene = result;
          return scene.getSceneIndex();
        }).then(function(id){
          expect(id).toBeTypeOf('number');
          expect(id).not.toBeNaN();
          next();
        });
      }).then(done);
    });

    it('should be able to get the scene unique id', function(done) {
      exec(function(next) {
        Scene.getActiveScene().then(function(scene) {
          return scene.getSceneUid();
        }).then(function(id) {
          expect(id).toBeTypeOf('string');

          if (navigator.appVersion.indexOf('XSplit Broadcaster 2.7.1702.2231  ') > -1) {
            done.fail('getSceneUid should reject if called on XBC lower than 3.0.1704.2101')
          }
          next();
        }, function() {
          if (navigator.appVersion.indexOf('XSplit Broadcaster 3.0.1704.2101 ') > -1) {
            done.fail('getSceneUid should not reject if called on XBC equal or higher than 3.0.1704.2101')
          }
          next();
        });
      }).then(done);
    });

    it('should be able to get and set the scene name', function(done) {
      exec(function(next) {
        var scene;
        var randomString = randomWord(10);
        Scene.getActiveScene()
        .then(function(result) {
          scene = result;
          return scene.setName(randomString);
        }).then(function(name){
          return scene.getName();
        }).then(function(name){
          expect(name).toEqual(randomString);
          next();
        });
      }).then(done);
    });

    it('should be able to get the items', function(done) {
      exec(function(next) {
        var scene;
        var sceneItems;
        Scene.getActiveScene().then(function(result) {
          scene = result;
          return scene.getItems();
        }).then(function(items){
          expect(items).toBeArray();
          expect(items).eachToBeInstanceOf(Item);
          sceneItems = items[0];
          next();
        });
      }).then(done);
    });

    // if this fails, please first check if the expected value corresponds to the supplied mock configuration
    it('should be able to get only the top-level items', function(done) {
      exec(function(next) {
        var scene;
        var sceneItems;
        Scene.getActiveScene().then(function(result) {
          scene = result;
          toggleGroupGet = true;
          return scene.getTopLevelItems();
        }).then(function(items){
          expect(items).toBeArray();
          expect(items).eachToBeInstanceOf(Item);
          sceneItems = items;
          return scene.getItems();
        }).then(function(items) {
          expect(items.length).not.toEqual(sceneItems.length);
          toggleGroupGet = false;
          next();
        });
      }).then(done);
    });

    it('should be able to search for an item by ID', function(done) {
      exec(function(next) {
        var scene;
        var sceneItems;
        Scene.getActiveScene().then(function(result) {
          scene = result;
          return scene.getItems();
        }).then(function(items){
          sceneItems = items[0];
          return Scene.searchItemsById(sceneItems._id);
        }).then(function(item) {
          expect(item).toBeInstanceOf(Item);
          next();
        });
      }).then(done);
    });

    it('should be able to search by ID in a case-insensitive way', function(done) {
      exec(function(next) {
        var scene;
        var sceneItems;
        Scene.getActiveScene().then(function(result) {
          scene = result;
          return scene.getItems();
        }).then(function(items){
          sceneItems = items[0];
          return Scene.searchItemsById(sceneItems._id.toLowerCase());
        }).then(function(item) {
          expect(item).toBeInstanceOf(Item);
          next();
        });
      }).then(done);
    });

    it('should be able to get null when searching for nonexistent ID', function(done) {
      exec(function(next) {
        Scene.searchItemsById('{AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA}')
        .then(function(item) {
          expect(item).toBe(null);
          next();
        });
      }).then(done);
    });

    it('should be able to search for a scene with an item based on item id', function(done) {
      exec(function(next) {
        Scene.getActiveScene().then(function(result) {
          return result.getItems();
        }).then(function(items){
          return items[0].getId();
        }).then(function(id) {
          return Scene.searchScenesByItemId(id);
        }).then(function(searchScene) {
          expect(searchScene).toBeInstanceOf(Scene);
          return Scene.searchScenesByItemId('{AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA}');
        }).then(function(nullScene) {
          expect(nullScene).toEqual(null);
          next();
        });
      }).then(done);
    });

    it('should be able to search for an item by Name', function(done) {
      exec(function(next) {
        var scene;
        var sceneItems;
        Scene.getActiveScene().then(function(result) {
          scene = result;
          return scene.getItems();
        }).then(function(items){
          sceneItems = items[0];
          return Scene.searchItemsByName(sceneItems._name);
        }).then(function(item) {
          expect(item).toBeArray();
          expect(item).eachToBeInstanceOf(Item);
          next();
        });
      }).then(done);
    });

    it('should be able to get empty array when searching for nonexistent name', function(done) {
      exec(function(next) {
        Scene.searchItemsByName('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
        .then(function(items) {
          expect(items).toBeEmptyArray();
          next();
        });
      }).then(done);
    });

    it('should be able to search for an item by a custom function', function(done) {
      exec(function(next) {
        Scene.filterItems(function(item, resolve) {
          item.getType().then(function(type) {
            resolve(type === XJS.ItemTypes.HTML);
          });
        }).then(function(items) {
          expect(items).toBeArray();
          expect(items).eachToBeInstanceOf(Item);
          next();
        });
      }).then(done);
    });

    it('should be able to search for a scene with an item based on a custom function', function(done) {
      exec(function(next) {
        Scene.filterScenesByItems(function(item, resolve) {
          item.getType().then(function(type) {
            resolve(type === XJS.ItemTypes.HTML);
          });
        }).then(function(scene) {
          expect(scene).toBeArray();
          expect(scene).eachToBeInstanceOf(Scene);
          next();
        });
      }).then(done);
    });

    it('should be able to get the sources', function(done) {
      exec(function(next) {
        var scene;
        var sceneSources;
        Scene.getActiveScene().then(function(result) {
          scene = result;
          return scene.getSources();
        }).then(function(sources){
          expect(sources).toBeArray();
          expect(sources).eachToBeInstanceOf(Source);
          sceneSources = sources[0];
          next();
        });
      }).then(done);
    });

    it('should be able to search for a source by ID', function(done) {
      exec(function(next) {
        var scene;
        var sceneSource;
        Scene.getActiveScene().then(function(result) {
          scene = result;
          return scene.getSources();
        }).then(function(sources){
          sceneSource = sources[0];
          return Scene.searchSourcesById(sceneSource._srcId);
        }).then(function(source) {
          expect(source).toBeArray();
          expect(source[0]).toBeInstanceOf(Source);
          next();
        });
      }).then(done);
    });

    it('should be able to search by source ID in a case-insensitive way', function(done) {
      exec(function(next) {
        var scene;
        var sceneSources;
        Scene.getActiveScene().then(function(result) {
          scene = result;
          return scene.getSources();
        }).then(function(sources){
          sceneSources = sources[0];
          return Scene.searchSourcesById(sceneSources._srcId.toLowerCase());
        }).then(function(source) {
          expect(source).toBeArray();
          expect(source[0]).toBeInstanceOf(Source);
          next();
        });
      }).then(done);
    });

    it('should be able to get a blank array when searching for nonexistent source ID', function(done) {
      exec(function(next) {
        Scene.searchSourcesById('{AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA}')
        .then(function(source) {
          expect(source).toBeArray();
          expect(source).toBeEmptyArray();
          next();
        });
      }).then(done);
    });

    it('should be able to search for a scene with an source based on source id', function(done) {
      navigator.__defineGetter__('appVersion', function() {
        return 'XSplit Broadcaster 3.0.1704.2101 ';
      });
      Scene.getActiveScene().then(function(result) {
        return result.getSources();
      }).then(function(sources){
        return sources[0].getId();
      }).then(function(id) {
        return Scene.searchScenesBySourceId(id);
      }).then(function(searchScene) {
        expect(searchScene).toBeArray();
        expect(searchScene).eachToBeInstanceOf(Scene);
        return Scene.searchScenesBySourceId('{AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA}');
      }).then(function(nullScene) {
        expect(nullScene).toBeEmptyArray();
        done();
      });
    });

    it('should be able to search for a source by Name', function(done) {
      exec(function(next) {
        var scene;
        var sceneSources;
        Scene.getActiveScene().then(function(result) {
          scene = result;
          return scene.getSources();
        }).then(function(sources){
          sceneSources = sources[0];
          return Scene.searchSourcesByName(sceneSources._name);
        }).then(function(source) {
          expect(source).toBeArray();
          expect(source).eachToBeInstanceOf(Source);
          next();
        });
      }).then(done);
    });

    it('should be able to get empty array when searching for nonexistent name', function(done) {
      exec(function(next) {
        Scene.searchItemsByName('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
        .then(function(items) {
          expect(items).toBeEmptyArray();
          next();
        });
      }).then(done);
    });

    it('should be able to search for a source by a custom function', function(done) {
      exec(function(next) {
        Scene.filterSources(function(source, resolve) {
          source.getType().then(function(type) {
            resolve(type === XJS.ItemTypes.HTML);
          });
        }).then(function(sources) {
          expect(sources).toBeArray();
          expect(sources).eachToBeInstanceOf(Source);
          next();
        });
      }).then(done);
    });

    it('should be able to search for a scene with a source based on a custom function', function(done) {
      exec(function(next) {
        Scene.filterScenesBySources(function(source, resolve) {
          source.getType().then(function(type) {
            resolve(type === XJS.ItemTypes.HTML);
          })
        }).then(function(scene) {
          expect(scene).toBeArray();
          expect(scene).eachToBeInstanceOf(Scene);
          next();
        });
      }).then(done);
    });

    it('should be able to initialize all scenes', function(done) {
      env.set(environments[0]);
      navigator.__defineGetter__('appVersion', function() {
        return 'XSplit Broadcaster 2.7.1702.2231 ';
      });
      Scene.initializeScenes().then(function(success) {
        expect(success).toBeBoolean();
        navigator.__defineGetter__('appVersion', function() {
          return appVersion;
        });
        env.set(environments[1]);
        navigator.__defineGetter__('appVersion', function() {
          return 'XSplit Broadcaster 2.7.1702.2231 ';
        });
        return Scene.initializeScenes();
      }).then(function(success) {
        expect(success).toBeBoolean();
        navigator.__defineGetter__('appVersion', function() {
          return appVersion;
        });
        env.set(environments[2]);
        navigator.__defineGetter__('appVersion', function() {
          return 'XSplit Broadcaster 2.7.1702.2231 ';
        });
        return Scene.initializeScenes();
      }).then(function() {
        navigator.__defineGetter__('appVersion', function() {
          return appVersion;
        });
        done.fail('initializeScenes should throw an error on source plugin');
      })
      .catch(function(err) {
        if (XJS.Environment.isSourcePlugin()) {
          expect(err).toEqual(jasmine.any(Error));
          navigator.__defineGetter__('appVersion', function() {
            return appVersion;
          });
          done();
        } else {
          navigator.__defineGetter__('appVersion', function() {
            return appVersion;
          });
          done.fail(err);
        }
      });
    });

    it('should be able to check if scene is empty or not', function(done) {
      env.set(environments[1]);
      exec(function(next) {
        var scene;
        var sceneItems;
        Scene.getActiveScene().then(function(result) {
          scene = result;
          return scene.isEmpty();
        }).then(function(flag) {
          expect(flag).toBeBoolean();
          next();
        });
      }).then(done);
    });

    describe('should be able to get available presets', function() {
      var scene;
      beforeEach(function(done) {
        env.set(environments[1]);
        navigator.__defineGetter__('appVersion', function() {
          return '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 XSplitBroadcaster/3.9.1923.0602 Safari/537.36';
        });
        Scene.getActiveScene().then(function(result) {
          scene = result;
          done();
        });
      });

      it('and return as an array', function(done) {
        scene.getPresets().then(function(presets) {
          expect(presets).toBeArray();
          done();
        });
      });

      it('that has a default value', function(done) {
        scene.getPresets().then(function(presets) {
          expect(presets[0]).toEqual('{00000000-0000-0000-0000-000000000000}');
          done();
        })
      });

      it('that fails in source plugins', function(done) {
        env.set(environments[2]);
        scene.getPresets().then(function(presets) {
          done.fail('getPresets should throw an error on source plugin');
        }).catch(function(err) {
          if (XJS.Environment.isSourcePlugin()) {
            expect(err).toEqual(jasmine.any(Error));
            done();
          } else {
            done.fail(err);
          }
        });
      });

      it('that fails for lower versions', function(done) {
        navigator.__defineGetter__('appVersion', function() {
          return 'XSplit Broadcaster 2.7.1702.2231 ';
        });
        scene.getPresets().then(function(presets) {
          done.fail('getPresets should throw an error for lower XBC versions');
        }).catch(function(err) {
          expect(err).toEqual(jasmine.any(Error));
          done();
        });
      });
    });

    describe('should be able to add and remove a preset', function() {
      var scene;
      beforeEach(function(done) {
        env.set(environments[1]);
        navigator.__defineGetter__('appVersion', function() {
          return '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 XSplitBroadcaster/3.9.1923.0602 Safari/537.36';
        });
        Scene.getActiveScene().then(function(result) {
          scene = result;
          done();
        });
      });

      it('by returning/needing a preset UID string', function(done) {
        var newPresetUID;
        var originalPresetList;
        scene.getPresets()
        .then(function(presetArray) {
          originalPresetList = JSON.stringify(presetArray);
          return scene.addPreset();
        })        
        .then(function(preset) {
          newPresetUID = preset;
          return scene.getPresets();
        }).then(function(presetArray) {
          expect(presetArray[presetArray.length - 1] === newPresetUID);
          return scene.removePreset(newPresetUID);
        }).then(function(removeRet) {
          expect(removeRet).toBeBoolean;
          return scene.getPresets();
        }).then(function(presetArray) {
          expect(originalPresetList).toEqual(JSON.stringify(presetArray));
          return scene.removePreset('{00000000-0000-0000-0000-000000000000}');
        }).then(function() {
          done.fail('removePrest cannot remove default preset');
        }).catch(function(err) {
          expect(err).toEqual(jasmine.any(Error));
          done();
        })
      });

      it('via methods that fail in source plugins', function(done) {
        env.set(environments[2]);
        scene.addPreset()
        .then(function(preset) {
          done.fail('addPreset should throw an error on source plugin');
        }).catch(function(err) {
          if (XJS.Environment.isSourcePlugin()) {
            expect(err).toEqual(jasmine.any(Error));
            env.set(environments[1]);
            return scene.addPreset()
          } else {
            done.fail(err);
          }
        }).then(function(newPreset) {
          env.set(environments[2]);
          return scene.removePreset(newPreset);
        }).then(function(preset) {
          done.fail('removePreset should throw an error on source plugin');
        }).catch(function(err) {
          if (XJS.Environment.isSourcePlugin()) {
            expect(err).toEqual(jasmine.any(Error));
            done();
          } else {
            done.fail(err);
          }
        });
      });

      it('via methods that fail for lower versions', function(done) {
        navigator.__defineGetter__('appVersion', function() {
          return 'XSplit Broadcaster 2.7.1702.2231 ';
        });
        scene.addPreset()
        .then(function(preset) {
          done.fail('addPreset should throw an error on lower XBC versions');
        }).catch(function(err) {
          expect(err).toEqual(jasmine.any(Error));
          navigator.__defineGetter__('appVersion', function() {
            return '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 XSplitBroadcaster/3.9.1923.0602 Safari/537.36';
          });
          return scene.addPreset();
        }).then(function(newPreset) {
          navigator.__defineGetter__('appVersion', function() {
            return 'XSplit Broadcaster 2.7.1702.2231 ';
          });
          return scene.removePreset(newPreset);
        }).then(function(preset) {
          done.fail('removePreset should throw an error on source plugin');
        }).catch(function(err) {
          done();
        });
      });
    });

    describe('should be able to get and set the active preset', function() {
      var scene;
      beforeEach(function(done) {
        env.set(environments[1]);
        navigator.__defineGetter__('appVersion', function() {
          return '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 XSplitBroadcaster/3.9.1923.0602 Safari/537.36';
        });
        Scene.getActiveScene().then(function(result) {
          scene = result;
          global['scenepresetlist'] = [];
          done();
        });
      });

      it('by returning/needing a preset UID string', function(done) {
        var secondPreset;
        scene.getActivePreset().then(function(activePreset) {
          expect(activePreset).toEqual('{00000000-0000-0000-0000-000000000000}');
          return scene.addPreset();
        }).then(function(newPreset) {
          secondPreset = newPreset;
          return scene.switchToPreset(secondPreset);
        }).then(function(activePreset) {
          return scene.getActivePreset();
        }).then(function(activePreset) {
          expect(activePreset).toEqual(secondPreset);
          done();
        });
      });

      it('via methods that fail in source plugins', function(done) {
        env.set(environments[2]);
        scene.getActivePreset()
        .then(function(preset) {
          done.fail('getActivePreset should throw an error on source plugin');
        }).catch(function(err) {
          if (XJS.Environment.isSourcePlugin()) {
            expect(err).toEqual(jasmine.any(Error));
            return scene.switchToPreset('{00000000-0000-0000-0000-000000000000}');
          } else {
            done.fail(err);
          }
        }).then(function(currentPreset) {
          done.fail('switchToPreset should throw an error on source plugin');
        }).catch(function(err) {
          if (XJS.Environment.isSourcePlugin()) {
            expect(err).toEqual(jasmine.any(Error));
            done();
          } else {
            done.fail(err);
          }
        });
      });

      it('via methods that fail for lower versions', function(done) {
        navigator.__defineGetter__('appVersion', function() {
          return 'XSplit Broadcaster 2.7.1702.2231 ';
        });
        scene.getActivePreset()
        .then(function(preset) {
          done.fail('getActivePreset should throw an error on lower XBC versions');
        }).catch(function(err) {
          expect(err).toEqual(jasmine.any(Error));
          return scene.switchToPreset('{00000000-0000-0000-0000-000000000000}');
        }).then(function(currentPreset) {
          done.fail('switchToPreset should throw an error on lower XBC versions');
        }).catch(function(err) {
          expect(err).toEqual(jasmine.any(Error));
          done();
        });
      });
    });

    describe('should be able to get and set the preset transition easing function', function() {
      var suppEasing = [
        'easeInCubic',
        'easeOutCubic',
        'easeInOutCubic'
      ];

      var scene;
      beforeEach(function(done) {
        env.set(environments[1]);
        navigator.__defineGetter__('appVersion', function() {
          return '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 XSplitBroadcaster/3.9.1923.0602 Safari/537.36';
        });
        Scene.getActiveScene().then(function(result) {
          scene = result;
          global['scenepreseteasing'] = 'easeInCubic';
          done();
        });
      });

      it('by returning/needing a preset transition string', function(done) {
        var randomEasing;
        scene.getPresetTransitionEasing()
        .then(function(easing) {
          expect(easing).toBeTypeOf('string');
          randomEasing = suppEasing[Math.floor(Math.random()*suppEasing.length)];
          return scene.setPresetTransitionEasing(randomEasing);
        }).then(function(setResult) {
          expect(setResult).toBeBoolean();
          return scene.getPresetTransitionEasing();
        }).then(function(easing) {
          expect(easing).toEqual(randomEasing);
          done();
        })
      });

      it('which accepts interprets blank as `none` and validates other values', function(done) {
        scene.setPresetTransitionEasing('')
        .then(function(isSet) {
          return scene.getPresetTransitionEasing();
        }).then(function(easing) {
          expect(easing).toEqual('none');
          return scene.setPresetTransitionEasing('someRandomWord');
        }).then(function() {
          done.fail('setPresetTransitionEasing should throw an error when easing transition string supplied is not supported');
        }).catch(function(err) {
          expect(err).toEqual(jasmine.any(Error));
          done();
        });
      });      

      it('via methods that fail in source plugins', function(done) {
        env.set(environments[2]);
        scene.getPresetTransitionEasing()
        .then(function(preset) {
          done.fail('getPresetTransitionEasing should throw an error on source plugin');
        }).catch(function(err) {
          if (XJS.Environment.isSourcePlugin()) {
            expect(err).toEqual(jasmine.any(Error));
            return scene.setPresetTransitionEasing('');
          } else {
            done.fail(err);
          }
        }).then(function(currentPreset) {
          done.fail('setPresetTransitionEasing should throw an error on source plugin');
        }).catch(function(err) {
          if (XJS.Environment.isSourcePlugin()) {
            expect(err).toEqual(jasmine.any(Error));
            done();
          } else {
            done.fail(err);
          }
        });
      });

      it('via methods that fail for lower versions', function(done) {
        navigator.__defineGetter__('appVersion', function() {
          return 'XSplit Broadcaster 2.7.1702.2231 ';
        });
        scene.getPresetTransitionEasing()
        .then(function(preset) {
          done.fail('getPresetTransitionEasing should throw an error on lower XBC versions');
        }).catch(function(err) {
          expect(err).toEqual(jasmine.any(Error));
          return scene.setPresetTransitionEasing('');
        }).then(function(currentPreset) {
          done.fail('setPresetTransitionEasing should throw an error on lower XBC versions');
        }).catch(function(err) {
          expect(err).toEqual(jasmine.any(Error));
          done();
        });
      });
    });

    describe('should be able to get and set the preset transition time', function() {
      var scene;
      beforeEach(function(done) {
        env.set(environments[1]);
        navigator.__defineGetter__('appVersion', function() {
          return '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 XSplitBroadcaster/3.9.1923.0602 Safari/537.36';
        });
        Scene.getActiveScene().then(function(result) {
          scene = result;
          global['scenepreseteasing'] = 'easeInCubic';
          done();
        });
      });

      it('as a number', function(done) {
        // get number from 0 to 1000
        var randomNumber = randomInt(0,1000);
        scene.getPresetTransitionTime()
        .then(function(transitionTime) {
          expect(transitionTime).toBeTypeOf('number');
          return scene.setPresetTransitionTime(randomNumber);
        }).then(function(setResult) {
          expect(setResult).toBeBoolean();
          return scene.getPresetTransitionTime();
        }).then(function(transitionTime) {
          expect(transitionTime).toEqual(randomNumber);
          return scene.setPresetTransitionTime('someRandomWord');
        }).then(function() {
          done.fail('setPresetTransitionTime should throw an error when parameter supplied is not a number');
        }).catch(function(err) {
          expect(err).toEqual(jasmine.any(Error));
          done();
        })
      });

      it('via methods that fail in source plugins', function(done) {
        env.set(environments[2]);
        scene.getPresetTransitionTime()
        .then(function(preset) {
          done.fail('getPresetTransitionTime should throw an error on source plugin');
        }).catch(function(err) {
          if (XJS.Environment.isSourcePlugin()) {
            expect(err).toEqual(jasmine.any(Error));
            return scene.setPresetTransitionTime(100);
          } else {
            done.fail(err);
          }
        }).then(function(currentPreset) {
          done.fail('setPresetTransitionTime should throw an error on source plugin');
        }).catch(function(err) {
          if (XJS.Environment.isSourcePlugin()) {
            expect(err).toEqual(jasmine.any(Error));
            done();
          } else {
            done.fail(err);
          }
        });
      });

      it('via methods that fail for lower versions', function(done) {
        navigator.__defineGetter__('appVersion', function() {
          return 'XSplit Broadcaster 2.7.1702.2231 ';
        });
        scene.getPresetTransitionTime()
        .then(function(preset) {
          done.fail('getPresetTransitionTime should throw an error on lower XBC versions');
        }).catch(function(err) {
          expect(err).toEqual(jasmine.any(Error));
          return scene.setPresetTransitionTime(100);
        }).then(function(currentPreset) {
          done.fail('setPresetTransitionTime should throw an error on lower XBC versions');
        }).catch(function(err) {
          expect(err).toEqual(jasmine.any(Error));
          done();
        });
      });
    });

    describe('could be added', function() {
      var scene;
      beforeEach(function() {
        env.set(environments[1]);
        navigator.__defineGetter__('appVersion', function() {
          return '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 XSplitBroadcaster/3.9.1923.0602 Safari/537.36';
        });

        spyOn(window.external, 'GetGlobalProperty').and.returnValue('0');

        spyOn(window.external, 'AppCallFuncAsync')
        .and.callFake(function(funcName) {
          ctr++;
          var asyncId = ctr;
          if(funcName.indexOf('additem') > -1 && funcName.indexOf('EVENT-XJS-CREATE') > -1) {
            setTimeout(function() {
              window.OnAsyncCallback(asyncId, '1');
            }, 10);
          }
          return asyncId;
        })
      });

      it('as a source', function(done) {
        Scene.getActiveScene().then(function(result) {
          scene = result;
          return scene.addAsSource();
        }).then(function(flag) {
          expect(flag).toBe(true);
          done();
        });
      });
    }); 

    describe('should be able to get and set overrides to scene transitions', function() {
      var scene;
      var transitionKeys = Object.keys(XJS.Transition._transitionMap);
      var randomTransition = transitionKeys[Math.floor(Math.random()*transitionKeys.length)];
      var randomTransitionObj = XJS.Transition[randomTransition];
      beforeEach(function(done) {
        env.set(environments[1]);
        navigator.__defineGetter__('appVersion', function() {
          return '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 XSplitBroadcaster/3.9.1923.0602 Safari/537.36';
        });
        Scene.getActiveScene().then(function(result) {
          scene = result;
          done();
        });
      });

      it('by returning/needing a transition object', function(done) {
        scene.setTransitionOverride(randomTransitionObj)
        .then(function() {
          return scene.getTransitionOverride();
        }).then(function(transition) {
          expect(transition).toBeInstanceOf(XJS.Transition);
          expect(transition.toTransitionKey()).toEqual(randomTransition)
          done();
        })
      });

      it('via methods that fail in source plugins', function(done) {
        env.set(environments[2]);

        scene.setTransitionOverride(randomTransitionObj)
        .then(function(preset) {
          done.fail('setTransitionOverride should throw an error on source plugin');
        }).catch(function(err) {
          if (XJS.Environment.isSourcePlugin()) {
            expect(err).toEqual(jasmine.any(Error));
            env.set(environments[2]);
            return scene.setTransitionOverride(12345)
          } else {
            done.fail(err);
          }
        }).then(function(currentPreset) {
          done.fail('setTransitionOverride should throw an error on invalid parameter');
        }).catch(function(err) {
          expect(err).toEqual(jasmine.any(Error));
          done();
        });
      });
    });

    describe('should be able to get and set overrides to scene transition time', function() {
      var scene;
      var transitionKeys = Object.keys(XJS.Transition._transitionMap);
      var randomTransition = transitionKeys[Math.floor(Math.random()*transitionKeys.length)];
      var randomTransitionObj = XJS.Transition[randomTransition];
      beforeEach(function(done) {
        env.set(environments[1]);
        navigator.__defineGetter__('appVersion', function() {
          return '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 XSplitBroadcaster/3.9.1923.0602 Safari/537.36';
        });
        Scene.getActiveScene().then(function(result) {
          scene = result;
          done();
        });
      });

      it('as a number', function(done) {
        // get number from 0 to 1000
        var randomNumber = randomInt(0,1000);
        scene.getTransitionTime()
        .then(function(transitionTime) {
          expect(transitionTime).toBeTypeOf('number');
          return scene.setTransitionTime(randomNumber);
        }).then(function(setResult) {
          expect(setResult).toBeBoolean();
          return scene.getTransitionTime();
        }).then(function(transitionTime) {
          expect(transitionTime).toEqual(randomNumber);
          return scene.setPresetTransitionTime('someRandomWord');
        }).then(function() {
          done.fail('setPresetTransitionTime should throw an error when parameter supplied is not a number');
        }).catch(function(err) {
          expect(err).toEqual(jasmine.any(Error));
          done();
        })
      });

      it('via methods that fail in source plugins', function(done) {
        env.set(environments[2]);
        scene.setTransitionTime(100)
        .then(function(preset) {
          done.fail('setTransitionTime should throw an error on source plugin');
        }).catch(function(err) {
          if (XJS.Environment.isSourcePlugin()) {
            expect(err).toEqual(jasmine.any(Error));
            done();
          } else {
            done.fail(err);
          }
        });
      });
    });

    xdescribe('should be able to reorder items within it', function(done) {
      beforeEach(function() {
        spyOn(window.external, 'SourcesListOrder')
          .and.callFake(function(view, ids) {
          ctr++;


          return ctr;
        });
      });

      xit('from an array of sources or items', function(done) {

      });

      xit('from an array of item IDs', function(done) {

      });

      xit('even for scenes not loaded in the main view', function(done) {

      });

      xit('but rejects when called from the source', function(done) {

      });
    });
  });
});
