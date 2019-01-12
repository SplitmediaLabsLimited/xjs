/* globals describe, it, expect, require, beforeEach, spyOn, done */

describe('VideoPlaylistItem', function() {
  'use strict'

  var XJS = require('xjs')
  var VideoPlaylistItem = XJS.VideoPlaylistItem
  var Scene = XJS.Scene
  var env = new window.Environment(XJS)
  var enumerated
  var isXSplit = /xsplit broadcaster/ig.test(navigator.appVersion);
  var mockPresetConfig = '<placement name="Scene 1" id="{219DB767-BE5B-4389-90C2-E712F08EA2CC}" defpos="0"><item pos_left="0.250000" pos_top="0.250000" pos_right="0.750000" pos_bottom="0.750000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="0" lockmove="0" keep_ar="1" visible="1" alpha="255" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="1" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" pan="0" pan_config="R:1.000000&amp;la:0.000000&amp;fi:0.000000" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" trscenter="0" trscexit="0" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{95A854A1-2548-4E47-8E33-57A4513DFCA0}" srcid="{2BDC7C38-CE78-4C3A-BC94-0F05C8341720}" type="1" name="Video Playlist" cname="" item="D:\\Files\\Recordings\\2017-08-14_17-19-13.mp4*1" itemaudio="" volume="100" mute="0" keepaudio="0" sounddev="0" fdeinterlace="0" mipmaps="0" autoresdet="1" keeploaded="0" cc_pin="0" key_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:0.970000&amp;str:0.900000&amp;rad:0.070000&amp;color:2155905152&amp;trail:0.000000&amp;filtering:0.000000&amp;fill:0" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" LiveDetectSignal="1" InPoint="0" OutPoint="0" CuePoints="0" FilePlaylist="D:\\Files\\Recordings\\2017-08-11_22-09-51.mp4*0*1*90330000*100*0*0*0*0*0|D:\\Files\\Recordings\\2017-08-14_17-19-13.mp4*1*1*79000000*100*0*0*0*0*0|D:\\Files\\Recordings\\2017-08-14_17-20-23.mp4*2*1*37330000*100*0*0*0*0*0|D:\\Files\\Recordings\\2017-08-14_20-06-53.mp4*3*1*26330000*100*0*0*0*0*0" OpWhenFinished="2" StartOnLoad="1" StartOnSrcShow="0" RememberPosition="1" LastPosition="70298128" LastRunState="1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" DllGrant="" custom="" /></placement>';
  var attachedID;
  var rand = 0;
  var local = {};
  var TYPE_HTML = 1;

  var appVersion = navigator.appVersion
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
  ])

  var exec = mix.exec.bind(mix)

  var currentVideoPlaylistItem
  var parseXml = function(xmlStr) {
    return ( new window.DOMParser() ).parseFromString(xmlStr, "text/xml")
  }

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

      case 'prop:BrowserSize':
        if (local.hasOwnProperty('browserSize')) {
          var irand = rand;
          setTimeout(function() {
            window.OnAsyncCallback(irand, local.browserSize);
          }, 10);
        } else {
          //search for id
          var placement = parseXml(mockPresetConfig)
            .getElementsByTagName("placement")[0];
          var selected = '[id="' + attachedID + '"]';
          var itemSelected = placement.querySelector(selected);
          //return browserJS attribute
          var irand = rand;
          setTimeout(function() {
            window.OnAsyncCallback(irand,
              itemSelected.getAttribute("BrowserSizeX") + ',' +
              itemSelected.getAttribute("BrowserSizeY"));
          },10);
        }
      break;

      case 'prop:BrowserTransparent':
        if (local.hasOwnProperty('browserTransparent')) {
          var irand = rand;
          setTimeout(function() {
            window.OnAsyncCallback(irand, local.browserTransparent);
          }, 10);
        } else {
          //search for id
          var placement = parseXml(mockPresetConfig)
            .getElementsByTagName("placement")[0];
          var selected = '[id="' + attachedID + '"]';
          var itemSelected = placement.querySelector(selected);
          //return browserJS attribute
          var irand = rand;
          setTimeout(function() {
            window.OnAsyncCallback(irand, itemSelected.getAttribute("BrowserTransparent"));
          },10);
        }
      break;

      case 'prop:BrowserJs':
        if (local.hasOwnProperty('browserJS')) {
          var irand = rand;
          setTimeout(function() {
            window.OnAsyncCallback(irand, local.browserJS);
          }, 10);
        } else {
          //search for id
          var placement = parseXml(mockPresetConfig)
            .getElementsByTagName("placement")[0];
          var selected = '[id="' + attachedID + '"]';
          var itemSelected = placement.querySelector(selected);
          //return browserJS attribute
          var irand = rand;
          setTimeout(function() {
            window.OnAsyncCallback(irand, itemSelected.getAttribute("BrowserJs"));
          },10);
        }
      break;

      case 'prop:custom':
        if (local.hasOwnProperty('custom')) {
          var irand = rand;
          setTimeout(function() {
            window.OnAsyncCallback(irand, local.custom);
          }, 10);
        } else {
          //search for id
          var placement = parseXml(mockPresetConfig)
            .getElementsByTagName("placement")[0];
          var selected = '[id="' + attachedID + '"]';
          var itemSelected = placement.querySelector(selected);
          //return custom attribute
          var irand = rand;
          setTimeout(function() {
            window.OnAsyncCallback(irand, itemSelected.getAttribute("custom"));
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
  }

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

      case 'prop:BrowserJs':
        var isValid;
        if (typeof val === 'string') {
          local.browserJS = val;
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

      case 'prop:BrowserTransparent':
        var isValid;
        if (val === '1' || val === '0') {
          local.browserTransparent = val;
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

      case 'prop:custom':
        var isValid;
        if (typeof val === 'string') {
          try {
            var customObject = JSON.parse(val);
            if (customObject.hasOwnProperty('customCSS') &&
              customObject.hasOwnProperty('customJS') &&
              customObject.hasOwnProperty('scriptEnabled') &&
              customObject.hasOwnProperty('cssEnabled')) {
                local.custom = val;
                urlSet = true;
                isValid = '0';
            } else {
              urlSet = false;
              isValid = '-1';
            }
          }
          catch(e) {
            urlSet = false;
            isValid = '-1';
          }
        } else {
          urlSet = false;
          isValid = '-1';
        }
        var irand = rand;
        setTimeout(function() {
          window.OnAsyncCallback(irand, isValid);
        }, 10);
      break;

      case 'refresh':
        var isValid;

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
    var item1 = new XJS.Item({id : '{VIDEOPLAYLISTID}' });
    var item2 = new XJS.Item({id : '{VIDEOPLAYLISTID2}'});

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

        case 'sceneconfig':
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
      newScene.getItems().then(function(items) {
        var itemArray = items;
        var itemArrayLength = itemArray.length;

        if (itemArrayLength > 0) {
          for (var i = 0; i < itemArrayLength; i++) {
            if (itemArray[i] instanceof VideoPlaylistItem) {
              enumerated.push(itemArray[i]);
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

  it('should be detected by getItems() correctly', function(done) {
    var placement = parseXml(mockPresetConfig)
      .getElementsByTagName("placement")[0];
    var selected = '[type="' + TYPE_HTML + '"]';
    var videoPlaylistItems = placement.querySelectorAll(selected);
    expect(videoPlaylistItems.length).toBe(enumerated.length);
    done();
  });

  describe('interface method checking', function() {
    beforeEach(function(done) {
      if (enumerated.length > 0) {
        currentVideoPlaylistItem = enumerated[0];
      }
      done();
    });

    it('should implement the layout interface', function() {
    	if (currentVideoPlaylistItem !== null) {
	      expect(currentVideoPlaylistItem).hasMethods([
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
    	}
    });

    it('should implement the color interface', function() {
    	if (currentVideoPlaylistItem !== null) {
	      expect(currentVideoPlaylistItem).hasMethods([
	        'getTransparency',
	        'setTransparency',
	        'getBrightness',
	        'setBrightness',
	        'getContrast',
	        'setContrast',
	        'getHue',
	        'setHue',
	        'getSaturation',
	        'setSaturation',
	        'getBorderColor',
	        'setBorderColor',
          'isFullDynamicColorRange',
          'setFullDynamicColorRange'
	        ].join(','));
    	}
    });

    it('should implement the chroma interface', function() {
			if (currentVideoPlaylistItem !== null) {
	      expect(currentVideoPlaylistItem).hasMethods([
	        'isChromaEnabled',
	        'setChromaEnabled',
	        'getKeyingType',
	        'setKeyingType',
	        'getChromaAntiAliasLevel',
	        'setChromaAntiAliasLevel',
	        'getChromaLegacyBrightness',
	        'setChromaLegacyBrightness',
	        'getChromaLegacySaturation',
	        'setChromaLegacySaturation',
	        'getChromaLegacyHue',
	        'setChromaLegacyHue',
	        'getChromaLegacyThreshold',
	        'setChromaLegacyThreshold',
	        'getChromaLegacyAlphaSmoothing',
	        'setChromaLegacyAlphaSmoothing',
	        'getChromaRGBKeyPrimaryColor',
	        'setChromaRGBKeyPrimaryColor',
	        'getChromaRGBKeyThreshold',
	        'setChromaRGBKeyThreshold',
	        'getChromaRGBKeyExposure',
	        'setChromaRGBKeyExposure',
	        'getChromaColorKeyThreshold',
	        'setChromaColorKeyThreshold',
	        'getChromaColorKeyExposure',
	        'setChromaColorKeyExposure',
	        'getChromaColorKeyColor',
	        'setChromaColorKeyColor'
	        ].join(','));
			}
    });

    it('should implement the transition interface', function() {
    	if (currentVideoPlaylistItem !== null) {
	      expect(currentVideoPlaylistItem).hasMethods([
		        'isVisible',
		        'setVisible',
		        'getTransition',
		        'setTransition',
		        'getTransitionTime',
		        'setTransitionTime'
		        ].join(','));
    	}
    });

    it('should implement the configurable interface', function() {
    	if (currentVideoPlaylistItem !== null) {
	      expect(currentVideoPlaylistItem).hasMethods([
	        'loadConfig',
	        'saveConfig',
	        'requestSaveConfig',
	        'applyConfig'
	        ].join(','));
    	}
    });

    it('should implement the playback interface', function() {
      if (currentVideoPlaylistItem !== null) {
        expect(currentVideoPlaylistItem).hasMethods([
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

    it('should implement the video playlist interface', function() {
      if (currentVideoPlaylistItem !== null) {
        expect(currentVideoPlaylistItem).hasMethods([
          'getVideoNowPlaying',
          'setVideoNowPlaying',
          'getVideoPlaylistSources',
          'setVideoPlaylistSources'
        ].join(','));
      }
    });
  });

})//end of code