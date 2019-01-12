
/* globals describe, it, expect, require, beforeEach, spyOn, done */

describe('Flash Source', function() {
  'use strict';

  var XJS = require('xjs');
  var Scene = XJS.Scene;
  var env = new window.Environment(XJS);
  var enumerated = [];
  var isXSplit = /xsplit broadcaster/ig.test(navigator.appVersion);
  var mockPresetConfig = '<placement name="Scene 1"  id="{219DB767-BE5B-4389-90C2-E712F08EA2CC}" defpos="0"><item type="6" item="C:\\Users\\dara\\Documents\\SplitmediaLabs\\CCGSourcePlugin\\cl3rd.swf" itemaudio="" name="C:\\Users\\dara\\Documents\\SplitmediaLabs\\CCGSourcePlugin\\cl3rd.swf" cname="" pos_left="0.000000" pos_top="0.000000" pos_right="1.000000" pos_bottom="1.000000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="0" volume="100" mute="0" sounddev="0" lockmove="0" keep_ar="1" fdeinterlace="0" mipmaps="0" autoresdet="1" visible="1" keeploaded="0" alpha="255" border="0" cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_pin="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" key_smartcamenable="0" key_smartcamconfig="" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" syncid0="1063414728" syncid1="1284980335" syncid2="2746624435" syncid3="1116473649" id="{110D3927-E08B-4020-AE84-B587D962EA9F}" srcid="{FE7E5E06-0655-477D-AC2B-B2642218A31E}" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="1" GameCapPlSmoothness="1.000000" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="0" DllGrant="" custom="" /></placement>';
  var attachedID;
  var rand = 0;
  var local = {};
  var urlSet = false;
  var TYPE_FLASH = 6;

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

  var currentFlashSource;
  var parseXml = function(xmlStr) {
      return ( new window.DOMParser() ).parseFromString(xmlStr, 'text/xml');
  };

  var getLocal = function(funcName) {
    rand += 1;

    switch (funcName) {
      case 'prop:type':
        //search for id
        var placement = parseXml(mockPresetConfig)
          .getElementsByTagName('placement')[0];
        var selected = '[id="' + attachedID + '"]';
        var itemSelected = placement.querySelector(selected);
        //return type attribute
        var irand = rand;
        setTimeout(function() {
          window.OnAsyncCallback(irand, itemSelected.getAttribute('type'));
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
            .getElementsByTagName('placement')[0];
          var selected = '[id="' + attachedID + '"]';
          var itemSelected = placement.querySelector(selected);
          //return item attribute
          var irand = rand;
          setTimeout(function() {
            window.OnAsyncCallback(irand, itemSelected.getAttribute('item'));
          },10);
        }
      break;

      case 'prop:BrowserSize':
        if (local.hasOwnProperty('browserSize')) {
          var irand = rand;
          setTimeout(function() {
            window.OnAsyncCallback(irand, local.browserSize);
          }, 10);
        } else {
          //search for id
          var placement = parseXml(mockPresetConfig)
            .getElementsByTagName('placement')[0];
          var selected = '[id="' + attachedID + '"]';
          var itemSelected = placement.querySelector(selected);
          //return browserJS attribute
          var irand = rand;
          setTimeout(function() {
            window.OnAsyncCallback(irand,
              itemSelected.getAttribute('BrowserSizeX') + ',' +
              itemSelected.getAttribute('BrowserSizeY'));
          },10);
        }
      break;

      case 'prop:BrowserRightClick':
        setTimeout(function() {
          window.OnAsyncCallback(rand, local.rightclick);
        }, 10);
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

      case 'prop:BrowserSize':
        var isValid;
        var isResolution = false;

        if (typeof val === 'string' || val.indexOf(',') > 0 ) {
          isResolution = true;
        }

        if (isResolution) {
          local.browserSize = val;
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

      case 'prop:BrowserRightClick':
        local.rightclick = val;
      break;

    }

    return rand;
  };

  beforeEach(function(done) {
    enumerated = [];
    env.set('extension');

    navigator.__defineGetter__('appVersion', function() {
      return 'XSplit Broadcaster 2.7.1702.2231 ';
    });

    // Reset the attached IDS
    var source1 = new XJS.Source({srcid : '{FLASHID}' });
    var source2 = new XJS.Source({srcid : '{FLASHID2}'});

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

        case 'preset:0':
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

    Scene.getActiveScene().then(function(newScene) {
      newScene.getSources().then(function(sources) {
        var sourceArray = sources;
        var sourceArrayLength = sourceArray.length;

        if (sourceArrayLength > 0) {
          for (var i = 0; i < sourceArrayLength; i++) {
            if (sourceArray[i] instanceof XJS.FlashSource) {
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
        currentFlashSource = enumerated[0];
      }
      done();
    });

    it('should implement flash interface', function() {
    	if (currentFlashSource !== null) {
	      expect(currentFlashSource).hasMethods([
		        'getCustomResolution',
		        'setCustomResolution',
		        'getAllowRightClick',
		        'setAllowRightClick'
		        ].join(','));
    	}
    });

    it('should implement audio interface', function() {
      expect(currentFlashSource).hasMethods([
        'isMute',
        'setMute',
        'getVolume',
        'setVolume',
        'isStreamOnlyAudio',
        'setStreamOnlyAudio',
        'isAudioAvailable'
      ].join(','));
    });
  });

});
