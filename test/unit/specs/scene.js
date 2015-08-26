/* globals describe, it, expect, require, beforeEach */

describe('Scene', function() {
  'use strict';

  var XJS = require('xjs');
  var Scene = XJS.Scene;
  var Item = XJS.Item;
  var env = new window.Environment(XJS);

  var MAX_SCENES = 12;

  describe('should be able to fetch a specific scene by index', function() {
    it('as a Scene object', function() {
      for (var i = 1; i <= MAX_SCENES; i++) {
        expect(Scene.getById(i)).toBeInstanceOf(Scene);
      }
    });
  });

  describe('should be able to fetch current scene', function() {
    beforeEach(function() {
      if (!/xsplit broadcaster/ig.test(navigator.appVersion)) {
        spyOn(window.external, 'AppGetPropertyAsync')
          .and.callFake(function(funcName) {
          if (funcName === 'preset:0') {
            var rand=Math.floor(Math.random()*1000);

            setTimeout(function() {
              window.OnAsyncCallback(rand, '5');
            },10);

            return rand;
          }
        });
      }
      this.promise = Scene.getActiveScene();
    });

    it('through a promise', function() {
      expect(this.promise).toBeInstanceOf(Promise);
    });

    it('as a Scene object', function(done) {
      this.promise.then(function(scene) {
        expect(scene).toBeInstanceOf(Scene);
        done();
      });
    });
  });

  describe('object instance', function() {
    var scene;
    var sceneItems;

    beforeAll(function(done) {
      if (!/xsplit broadcaster/ig.test(navigator.appVersion)) {
        var ctr = 0;
        spyOn(window.external, 'AppGetPropertyAsync')
          .and.callFake(function(funcName) {
          ctr++;
          if (funcName === 'preset:0') {
            setTimeout(function() {
              window.OnAsyncCallback(this, '5');
            }.bind(ctr),10);
          } else if (/^presetname:/.test(funcName)) {
            setTimeout(function() {
              window.OnAsyncCallback(this, 'DummyText');
            }.bind(ctr),10);
          } else if (/^presetconfig:/.test(funcName)) {
            setTimeout(function() {
              window.OnAsyncCallback(this, encodeURIComponent('<placement name="Work Scene" defpos="0"><item type="8" item="html:plugin:twitchchatplg*{&quot;manuallyConnected&quot;:&quot;Not Connected&quot;,&quot;connected&quot;:&quot;Not Connected&quot;,&quot;channel&quot;:&quot;&quot;,&quot;opacity&quot;:100,&quot;viewerColor&quot;:&quot;#627FFF&quot;,&quot;messageColor&quot;:&quot;#FFFFFF&quot;,&quot;viewerFont&quot;:&quot;Calibri&quot;,&quot;messageFont&quot;:&quot;Calibri&quot;,&quot;textSize&quot;:&quot;24&quot;}" itemaudio="" name="Twitch IRC Chat Viewer" cname="" pos_left="0.500000" pos_top="0.000000" pos_right="1.000000" pos_bottom="0.500000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="0" volume="100" mute="0" sounddev="0" lockmove="0" keep_ar="0" fdeinterlace="0" mipmaps="0" autoresdet="1" visible="1" keeploaded="1" alpha="255" border="-2147483648" cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_pin="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" key_smartcamenable="0" key_smartcamconfig="" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" syncid0="1146995751" syncid1="1216762279" syncid2="2586188951" syncid3="410786723" id="{0B3B74C1-64A5-4E4A-9AB2-FEBB6E0B3F5E}" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="1" GameCapPlSmoothness="1.000000" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" custom="{ &quot;connected&quot; : &quot;Not Connected&quot; }"/><item type="2" item="@DEVICE:PNP:\\?\USB#VID_046D&amp;PID_082C&amp;MI_02#6&amp;16FD2F8D&amp;0&amp;0002#{65E8773D-8F56-11D0-A3B9-00A0C9223196}\GLOBAL" itemaudio="" name="HD Webcam C615" cname="" pos_left="0.010981" pos_top="0.000000" pos_right="0.385798" pos_bottom="0.500000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="1" volume="100" mute="0" sounddev="0" lockmove="0" keep_ar="1" fdeinterlace="0" mipmaps="0" autoresdet="1" visible="1" keeploaded="1" alpha="255" border="0" cc_pin="1" cc_brightness="0" cc_contrast="-8" cc_hue="0" cc_saturation="0" cc_dynamicrange="1" key_pin="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" key_smartcamenable="0" key_smartcamconfig="" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" syncid0="3214440775" syncid1="1214254420" syncid2="2912452758" syncid3="3415282779" id="{75EF04AB-6915-4A88-8177-950B12186359}" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="1" GameCapPlSmoothness="1.000000" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" custom=""/></placement>\n'));
            }.bind(ctr),10);
          } else if (/^presetisempty:/.test(funcName)) {
            setTimeout(function() {
              window.OnAsyncCallback(this, '0');
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
          }

          return ctr;
        });

        var lastItemName, lastItemProp;
        spyOn(window.external, 'GetLocalPropertyAsync')
          .and.callFake(function(prop) {
          ctr++;
          switch (prop) {
            case 'prop:name':
              setTimeout(function() {
                window.OnAsyncCallback(this, 'Twitch IRC Chat Viewer');
              }.bind(ctr), 10);
            break;

            case 'prop:item':
              setTimeout(function() {
                window.OnAsyncCallback(this, 'html:plugin:twitchchatplg*{&quot;manuallyConnected&quot;:&quot;Not Connected&quot;,&quot;connected&quot;:&quot;Not Connected&quot;,&quot;channel&quot;:&quot;&quot;,&quot;opacity&quot;:100,&quot;viewerColor&quot;:&quot;#627FFF&quot;,&quot;messageColor&quot;:&quot;#FFFFFF&quot;,&quot;viewerFont&quot;:&quot;Calibri&quot;,&quot;messageFont&quot;:&quot;Calibri&quot;,&quot;textSize&quot;:&quot;24&quot;}');
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

            case 'prop:item':
              setTimeout(function() {
                window.OnAsyncCallback(this, '@DEVICE:PNP:\\\\?\\USB#VID_046D&amp;PID_082C&amp;MI_02#6&amp;16FD2F8D&amp;0&amp;0002#{65E8773D-8F56-11D0-A3B9-00A0C9223196}\\GLOBAL');
              }.bind(ctr), 10);
            break;
          }

          return ctr;
        });
      }

      Scene.getActiveScene().then(function(result) {
        scene = result;
        done();
      });
    });

    it('should be able to get the scene ID', function(done) {
      scene.getSceneNumber().then(function(id) {
        expect(id).toBeTypeOf('number');
        expect(id).not.toBeNaN();
        done();
      });
    });

    it('should be able to get the scene name', function(done) {
      scene.getName().then(function(name) {
        expect(name).toBeTypeOf('string');
        done();
      });
    });

    it('should be able to get the items', function(done) {
      scene.getItems().then(function(items) {
        expect(items).toBeInstanceOf(Array);
        expect(items).eachToBeInstanceOf(Item);
        sceneItems = items[0];
        done();
      });
    });

    it('should be able to search for an item by ID', function(done) {

      Scene.searchAllForItemId(sceneItems._id)
        .then(function(item) {
          expect(item).toBeInstanceOf(Item);
          done();
        });
    });

    it('should be able to get null when searching for nonexistent ID', function(done) {
      Scene.searchAllForItemId('{AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA}')
        .then(function(item) {
          expect(item).toBe(null);
          done();
        });
    });

    it('should be able to search for an item by Name', function(done) {
      Scene.searchAllForItemName(sceneItems.name)
        .then(function(items) {
          expect(items).toBeInstanceOf(Array);
          expect(items).eachToBeInstanceOf(Item);
          done();
        });
    });

    it('should be able to get empty array when searching for nonexistent name', function(done) {
      Scene.searchAllForItemName('{AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
        .then(function(items) {
          expect(items).toBeEmptyArray();
          done();
        });
    });

    it('should be able to check if scene is empty or not', function(done) {
      scene.isEmpty().then(function(flag) {
        expect(flag).toBeTypeOf('boolean');
        done();
      });
    });

    it('should be able to set the scene name', function(done) {
      var rand;
      var string = "";
      var environments = ['config', 'script', 'html'];

      for (var i = 0; i < 5; i++) {
        rand = Math.floor(Math.random() * 25) + 65;
        string += String.fromCharCode(rand);
      }

      env.set(environments[0]);
      scene.setName(string).then(function(res) {
        expect(res).toBeTypeOf('boolean');
        env.set(environments[1]);
        return scene.setName(string);
      }).then(function(res) {
        expect(res).toBeTypeOf('boolean');
        env.set(environments[2]);
        return scene.setName(string);
      }).catch(function(err) {
        expect(err).toEqual(jasmine.any(Error));
        done();
      });
    });
  });
});
