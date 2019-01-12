/* globals describe, it, expect, require, beforeEach, spyOn, done */

describe('MediaSource', function() {
  'use strict';

  var XJS = require('xjs');
  var MediaSource = XJS.MediaSource;
  var System = XJS.System;
  var Scene = XJS.Scene;
  var env = new window.Environment(XJS);
  var enumerated;
  var isXSplit = /xsplit broadcaster/ig.test(navigator.appVersion);
  var propTypeCount;
  var mockPresetConfig = '<placement name="Scene 2" id="{219DB767-BE5B-4389-90C2-E712F08EA2CC}" defpos="4"><item type="1" item="C:\\Users\\MiYb\\Pictures\\gifs\\tumblr_mt2lqbVl0z1qa7ubto1_500.gif" itemaudio="" name="C:\\Users\\MiYb\\Pictures\\gifs\\tumblr_mt2lqbVl0z1qa7ubto1_500.gif" cname="" pos_left="0.000000" pos_top="0.072222" pos_right="0.500000" pos_bottom="0.427778" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="0" volume="100" mute="0" sounddev="0" lockmove="0" keep_ar="1" fdeinterlace="0" mipmaps="0" autoresdet="1" visible="1" keeploaded="0" alpha="255" border="0" cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="1" key_pin="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" key_smartcamenable="0" key_smartcamconfig="" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" syncid0="910468980" syncid1="1282817389" syncid2="552117414" syncid3="1931311647" id="{6265F896-9706-4462-B13B-289433E0FFE1}" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="1" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="1" GameCapPlSmoothness="1.000000" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" DllGrant="" custom=""/><item type="4" item="C:\\Users\\MiYb\\Pictures\\best\\facefull_void.png" itemaudio="" name="C:\\Users\\MiYb\\Pictures\\best\\facefull_void.png" cname="" pos_left="0.590380" pos_top="0.000000" pos_right="0.909620" pos_bottom="0.500000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="1" volume="100" mute="0" sounddev="0" lockmove="0" keep_ar="1" fdeinterlace="0" mipmaps="0" autoresdet="1" visible="1" keeploaded="0" alpha="255" border="0" cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_pin="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" key_smartcamenable="0" key_smartcamconfig="" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" syncid0="3749034972" syncid1="1276212150" syncid2="3461040319" syncid3="133566161" id="{37B1631F-1E8B-48AD-8C59-C334D162BB18}" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="1" GameCapPlSmoothness="1.000000" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" DllGrant="" custom=""/><item type="1" item="C:\\Users\\MiYb\\Videos\\RazerDemo\\2015-04-15_214854244.mp4" itemaudio="" name="C:\\Users\\MiYb\\Videos\\RazerDemo\\2015-04-15_214854244.mp4" cname="" pos_left="0.062500" pos_top="0.500000" pos_right="0.437500" pos_bottom="1.000000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="2" volume="100" mute="0" sounddev="0" lockmove="0" keep_ar="1" fdeinterlace="0" mipmaps="0" autoresdet="1" visible="1" keeploaded="0" alpha="255" border="0" cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="1" key_pin="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" key_smartcamenable="0" key_smartcamconfig="" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" syncid0="1886197588" syncid1="1108031298" syncid2="2512137617" syncid3="600774216" id="{2A536C3C-3340-4AEF-9108-2A48382DAC67}" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="1" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="0" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="1" GameCapPlSmoothness="1.000000" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" DllGrant="" custom=""/><item type="1" item="C:\\Users\\MiYb\\Music\\Voice 1.wav" itemaudio="" name="C:\\Users\\MiYb\\Music\\Voice 1.wav" cname="" pos_left="0.500000" pos_top="0.569059" pos_right="0.861882" pos_bottom="0.930941" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="3" volume="100" mute="0" sounddev="0" lockmove="0" keep_ar="1" fdeinterlace="0" mipmaps="0" autoresdet="1" visible="1" keeploaded="0" alpha="255" border="0" cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="1" key_pin="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" key_smartcamenable="0" key_smartcamconfig="" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" syncid0="1691232400" syncid1="1189060555" syncid2="124275105" syncid3="1775674334" id="{04D1132B-379F-481F-9C72-CED9AD15E715}" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="1" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="0" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="1" GameCapPlSmoothness="1.000000" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" DllGrant="" custom="" /></placement>'
  var attachedID;
  var rand = 0;
  var local = {};
  var specialOptimizationSet = false;
  var showMouseSet = false;
  var offlineImageSet = false;
  var currentMediaSource;
  var environments = ['props', 'extension', 'plugin'];
  var parseXml = function(xmlStr) {
      return ( new window.DOMParser() ).parseFromString(xmlStr, "text/xml");
  };
  var TYPE_GAME = 7;

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

  var getLocal = function(funcName) {
    rand += 1;

    switch (funcName) {
      case 'prop:type':
        //search for id
        var placement = parseXml(mockPresetConfig)
          .getElementsByTagName("placement")[0];
        var selected = '[id="' + attachedID + '"]';
        var itemSelected = placement.querySelector(selected);
        //return type attribute
        var irand = rand;
        setTimeout(function() {
          window.OnAsyncCallback(irand, itemSelected.getAttribute("type"));
        },10);
      break;

      case 'prop:srcitem':
        if (local.hasOwnProperty('item')) {
          var irand = rand;
          setTimeout(function() {
            window.OnAsyncCallback(irand, local.item);
          }, 10);
        } else {
          //search for id
          var placement = parseXml(mockPresetConfig)
            .getElementsByTagName("placement")[0];
          var selected = '[id="' + attachedID + '"]';
          var itemSelected = placement.querySelector(selected);
          //return item attribute
          var irand = rand;
          setTimeout(function() {
            window.OnAsyncCallback(irand, itemSelected.getAttribute("item"));
          },10);
        }
      break;
    }
    return rand;
  };

  var setLocal = function(funcName, val) {
    rand += 1;

    switch (funcName) {

      case 'prop:srcitem':
      	var isValid;
        if (typeof val === 'string') {
          local.item = val;
          urlSet = true;
          isValid = '0';
        } else {
        	urlSet = false;
          isValid = '-1';
        }
				var irand = rand;
        setTimeout(function() {
          window.OnAsyncCallback(irand, isValid);
        }, 10);
      break;
    }

    return rand;
  };

  beforeEach(function(done) {
    enumerated = [];
    env.set(environments[1]);

    navigator.__defineGetter__('appVersion', function() {
      return 'XSplit Broadcaster 2.7.1702.2231 ';
    });

    propTypeCount = 0;
    if (!isXSplit) {
      // Reset the attached IDS
      var Source1 = new XJS.Source({srcid : '{MEDIA}' });
      var Source2 = new XJS.Source({srcid : '{MEDIA2}'});

      spyOn(window.external, 'AppGetPropertyAsync')
        .and.callFake(function(funcName) {
        rand += 1;
        switch (funcName) {
          case 'sceneconfig:0':
            var irand = rand;
            setTimeout(function() {
              window.OnAsyncCallback(irand,
                encodeURIComponent(mockPresetConfig));
            },10);
          break;

          case 'scene:0':
            var irand = rand;
            setTimeout(function() {
              window.OnAsyncCallback(irand, '0');
            },10);
          break;

          case 'sceneconfig':
            var irand = rand;
            setTimeout(function() {
              window.OnAsyncCallback(irand,
                encodeURIComponent(mockPresetConfig));
            },10);
          break;
        }
        return rand;
      });

      spyOn(window.external, 'SearchVideoItem')
      .and.callFake(function(ID) {
        attachedID = ID;
      });

      spyOn(window.external, 'SearchVideoItem2')
      .and.callFake(function(ID) {
        attachedID = ID;
      });

      spyOn(window.external, 'GetLocalPropertyAsync')
      .and.callFake(getLocal);

      spyOn(window.external, 'GetLocalPropertyAsync2')
      .and.callFake(getLocal);

      spyOn(window.external, 'SetLocalPropertyAsync')
      .and.callFake(setLocal);

      spyOn(window.external, 'SetLocalPropertyAsync2')
      .and.callFake(setLocal);
    }
    Scene.getActiveScene().then(function(newScene) {
      newScene.getSources().then(function(sources) {
        var sourceArray = sources;
        var sourceArrayLength = sourceArray.length;
        if (sourceArrayLength > 0) {
          for (var i = 0; i < sourceArrayLength; i++) {
            if (sourceArray[i] instanceof MediaSource) {
              enumerated.push(sourceArray[i]);
            }
          }
        }

        done();
      });
    });
  });

  afterAll(function() {
    navigator.__defineGetter__('appVersion', function() {
      return appVersion;
    });
  });

  describe('interface method checking', function() {
    beforeEach(function(done) {
      if (enumerated.length > 0) {
        currentMediaSource = enumerated[0];
      }
      done();
    });

    it('should implement the media interface', function() {
      expect(currentMediaSource).hasMethods([
        'getFileInfo',
        ].join(','));
    });

    it('should implement the playback interface', function() {
      if (currentMediaSource !== null) {
        expect(currentMediaSource).hasMethods([
          'isSeekable',
          'getPlaybackPosition',
          'setPlaybackPosition',
          'getPlaybackDuration',
          'isPlaying',
          'setPlaying',
          'getPlaybackStartPosition',
          'setPlaybackStartPosition',
          'getPlaybackEndPosition',
          'setPlaybackEndPosition',
          'getActionAfterPlayback',
          'setActionAfterPlayback',
          'isAutostartOnSceneLoad',
          'setAutostartOnSceneLoad',
          'isForceDeinterlace',
          'setForceDeinterlace',
          'isRememberingPlaybackPosition',
          'setRememberingPlaybackPosition',
          'isShowingPlaybackPosition',
          'setShowingPlaybackPosition',
          'getCuePoints',
          'setCuePoints',
          'getValue',
          'setValue',
          'isAudio',
          'isVideo'
        ].join(','));
      }
    });

    it('should implement the audio interface', function() {
      expect(currentMediaSource).hasMethods([
        'getVolume',
        'isMute',
        'isAutoMute',
        'setVolume',
        'setMute',
        'setAutoMute',
        'isStreamOnlyAudio',
        'setStreamOnlyAudio',
        'isAudioAvailable'
        ].join(','));
    });

  });
});
