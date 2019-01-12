/* globals describe, it, expect, require, beforeEach, jasmine, spyOn, beforeAll, afterEach, afterAll */

describe('Scene ===', function() {
  'use strict';

  var startsWith = function(mainString, stringCompared) {
    return mainString.toLowerCase().substring(0, stringCompared.length) ===
      stringCompared.toLowerCase();
  };

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
          return Scene.getById('Test string');
        }).then(function() {
          done.fail('getBySceneIndex should reject if scene id is string other than i12');
        }, function() {
          next();
        });
      }).then(done);
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

        } else if (startsWith(funcName, 'presetname:')) {
          var sceneIndex = funcName.substring(11);
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
        if (funcName === 'preset:0') {
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
        if (funcName === 'preset:0') {
          setTimeout(function() {
            window.OnAsyncCallback(asyncId, global['preset:0']);
          },10);
        } else if (funcName === 'scenecount') {
          setTimeout(function() {
            window.OnAsyncCallback(asyncId, '12');
          },10);
        } else if (startsWith(funcName, 'presetname:')) {
          var sceneIndex = funcName.substring(11);
          if (!isNaN(sceneIndex)) {
            sceneIndex = Number(funcName.substring(11)) + 1;
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
    beforeAll(function(done) {
      var ctr = 0;
      spyOn(window.external, 'AppGetPropertyAsync')
        .and.callFake(function(funcName) {
        ctr++;
        if (funcName === 'preset:0') {
          setTimeout(function() {
            window.OnAsyncCallback(this, '0');
          }.bind(ctr),10);
        } else if (/^presetname:/.test(funcName)) {
          setTimeout(function() {
            window.OnAsyncCallback(this, 'DummyText');
          }.bind(ctr),10);
        } else if (/^sceneconfig:i12/.test(funcName)) {
          setTimeout(function() {
            window.OnAsyncCallback(this, 'null');
          }.bind(ctr),10);
        } else if (/^sceneconfig:/.test(funcName)) {
          setTimeout(function() {
            window.OnAsyncCallback(this, encodeURIComponent('<placement name="Work Scene" id="{219DB767-BE5B-4389-90C2-E712F08EA2CC}" defpos="0"><item type="8" item="html:plugin:twitchchatplg*{&quot;manuallyConnected&quot;:&quot;Not Connected&quot;,&quot;connected&quot;:&quot;Not Connected&quot;,&quot;channel&quot;:&quot;&quot;,&quot;opacity&quot;:100,&quot;viewerColor&quot;:&quot;#627FFF&quot;,&quot;messageColor&quot;:&quot;#FFFFFF&quot;,&quot;viewerFont&quot;:&quot;Calibri&quot;,&quot;messageFont&quot;:&quot;Calibri&quot;,&quot;textSize&quot;:&quot;24&quot;}" itemaudio="" name="Twitch IRC Chat Viewer" cname="" pos_left="0.500000" pos_top="0.000000" pos_right="1.000000" pos_bottom="0.500000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="0" volume="100" mute="0" sounddev="0" lockmove="0" keep_ar="0" fdeinterlace="0" mipmaps="0" autoresdet="1" visible="1" keeploaded="1" alpha="255" border="-2147483648" cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_pin="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" key_smartcamenable="0" key_smartcamconfig="" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" syncid0="1146995751" syncid1="1216762279" syncid2="2586188951" syncid3="410786723" id="{0B3B74C1-64A5-4E4A-9AB2-FEBB6E0B3F5E}" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="1" GameCapPlSmoothness="1.000000" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" custom="{ &quot;connected&quot; : &quot;Not Connected&quot; }"/><item type="2" item="@DEVICE:PNP:\\\\?\\USB#VID_046D&amp;PID_082C&amp;MI_02#6&amp;16FD2F8D&amp;0&amp;0002#{65E8773D-8F56-11D0-A3B9-00A0C9223196}\\GLOBAL" itemaudio="" name="HD Webcam C615" cname="" pos_left="0.010981" pos_top="0.000000" pos_right="0.385798" pos_bottom="0.500000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="1" volume="100" mute="0" sounddev="0" lockmove="0" keep_ar="1" fdeinterlace="0" mipmaps="0" autoresdet="1" visible="1" keeploaded="1" alpha="255" border="0" cc_pin="1" cc_brightness="0" cc_contrast="-8" cc_hue="0" cc_saturation="0" cc_dynamicrange="1" key_pin="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" key_smartcamenable="0" key_smartcamconfig="" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" syncid0="3214440775" syncid1="1214254420" syncid2="2912452758" syncid3="3415282779" id="{75EF04AB-6915-4A88-8177-950B12186359}" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="1" GameCapPlSmoothness="1.000000" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" custom=""/></placement>\n'));
          }.bind(ctr),10);
        } else if (/^sceneconfig/.test(funcName)) {
          setTimeout(function() {
            window.OnAsyncCallback(this, encodeURIComponent(mockPresetConfig));
          }.bind(ctr),10);
        } else if (/^presetisempty:/.test(funcName)) {
          setTimeout(function() {
            window.OnAsyncCallback(this, '0');
          }.bind(ctr),10);
        } else if ('scenecount') {
          setTimeout(function() {
            window.OnAsyncCallback(this, '12');
          }.bind(ctr),10);
        }

        return ctr;
      });

      spyOn(window.external, 'AppSetPropertyAsync')
        .and.callFake(function(funcName) {
        ctr++;
        if (/^presetname:/.test(funcName)) {
          setTimeout(function() {
            window.OnAsyncCallback(this, '2');
          }.bind(ctr),10);
        } else if (/^sceneconfig:/.test(funcName)) {
          setTimeout(function() {
            window.OnAsyncCallback(this, '0');
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
            setTimeout(function() {
              window.OnAsyncCallback(this, 'html:plugin:twitchchatplg*{&quot;manuallyConnected&quot;:&quot;Not Connected&quot;,&quot;connected&quot;:&quot;Not Connected&quot;,&quot;channel&quot;:&quot;&quot;,&quot;opacity&quot;:100,&quot;viewerColor&quot;:&quot;#627FFF&quot;,&quot;messageColor&quot;:&quot;#FFFFFF&quot;,&quot;viewerFont&quot;:&quot;Calibri&quot;,&quot;messageFont&quot;:&quot;Calibri&quot;,&quot;textSize&quot;:&quot;24&quot;}');
            }.bind(ctr), 10);
          break;

          case 'prop:type':
            setTimeout(function() {
              window.OnAsyncCallback(this, '8');
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
            setTimeout(function() {
              window.OnAsyncCallback(this, '@DEVICE:PNP:\\\\?\\USB#VID_046D&amp;PID_082C&amp;MI_02#6&amp;16FD2F8D&amp;0&amp;0002#{65E8773D-8F56-11D0-A3B9-00A0C9223196}\\GLOBAL');
            }.bind(ctr), 10);
          break;

          case 'prop:type':
            setTimeout(function() {
              window.OnAsyncCallback(this, '8');
            }.bind(ctr), 10);
          break;
        }

        return ctr;
      });

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

    it('should be able to get the scene name', function(done) {
      exec(function(next) {
        var scene;
        Scene.getActiveScene().then(function(result) {
          scene = result;
          return scene.getName();
        }).then(function(name){
          expect(name).toBeTypeOf('string');
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
          expect(items).toBeInstanceOf(Array);
          expect(items).eachToBeInstanceOf(Item);
          sceneItems = items[0];
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
          expect(item).toBeInstanceOf(Array);
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
          expect(items).toBeInstanceOf(Array);
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
          expect(scene).toBeInstanceOf(Array);
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

    it('should be able to set the scene name', function(done) {
      var rand;
      var string = '';
      var scene;

      for (var i = 0; i < 5; i++) {
        rand = Math.floor(Math.random() * 25) + 65;
        string += String.fromCharCode(rand);
      }

      navigator.__defineGetter__('appVersion', function() {
        return 'XSplit Broadcaster 2.7.1702.2231 ';
      });

      Scene.getActiveScene().then(function(result) {
        scene = result;
        return scene.setName(string);
      }).then(function(success) {
        navigator.__defineGetter__('appVersion', function() {
          return appVersion;
        });
        if (XJS.Environment.isSourcePlugin()) {
          done.fail('setName should throw an error on source plugin');
        } else {
          expect(success).toBeBoolean();
          done();
        }
      }).catch(function(err) {
        navigator.__defineGetter__('appVersion', function() {
          return appVersion;
        });
        if (XJS.Environment.isSourcePlugin()) {
          expect(err).toEqual(jasmine.any(Error));
          done();
        } else {
          done.fail(err);
        }
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
