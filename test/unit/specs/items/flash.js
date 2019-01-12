
/* globals describe, it, expect, require, beforeEach, spyOn, done */

describe('FlashItem', function() {
  'use strict';

  var XJS = require('xjs');
  var Scene = XJS.Scene;
  var FlashItem = XJS.FlashItem;
  var env = new window.Environment(XJS);
  var enumerated;
  var isXSplit = /xsplit broadcaster/ig.test(navigator.appVersion);
  var mockPresetConfig = '<placement name="Scene 1" id="{219DB767-BE5B-4389-90C2-E712F08EA2CC}" defpos="0"><item type="8" item="html:plugin:whiteboardoverlayplg*{&quot;toolSelect&quot;:&quot;smooth&quot;,&quot;sizeSelect&quot;:2,&quot;color&quot;:&quot;#0099FF&quot;,&quot;dontShowDefaultImage&quot;:&quot;true&quot;}" itemaudio="" name="Whiteboard" cname="" pos_left="0.000000" pos_top="0.000000" pos_right="1.000000" pos_bottom="1.000000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="0" volume="100" mute="0" sounddev="0" lockmove="1" keep_ar="1" fdeinterlace="0" mipmaps="0" autoresdet="1" visible="1" keeploaded="0" alpha="255" border="0" cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_pin="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" key_smartcamenable="0" key_smartcamconfig="" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" syncid0="4094905864" syncid1="1080227405" syncid2="2759655327" syncid3="593648675" id="{0F2DB823-E438-4E67-BEB6-75045CB5B78C}" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="1" GameCapPlSmoothness="1.000000" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" custom=""/><item type="8" item="http://localhost/Script_Plugin/simple-text/root/base.html*{&quot;configUrl&quot;:&quot;http://localhost/Script_Plugin/simple-text/root/base.html*%7B&quot;configUrl&quot;:&quot;http://localhost/Script_Plugin/simple-text/root/base_config.html&quot;,&quot;text&quot;:&quot;hello there&quot;}" itemaudio="" name="http://localhost/Script_Plugin/simple-text/root/base.html" cname="" pos_left="0.500000" pos_top="0.000000" pos_right="1.000000" pos_bottom="0.500000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="1" volume="100" mute="0" sounddev="0" lockmove="0" keep_ar="1" fdeinterlace="0" mipmaps="0" autoresdet="1" visible="1" keeploaded="0" alpha="255" border="0" cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_pin="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" key_smartcamenable="0" key_smartcamconfig="" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" syncid0="1350571159" syncid1="1127065915" syncid2="3515209658" syncid3="1473757629" id="{0A43E267-CD57-44B3-94F8-0A88029F006E}" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="1" GameCapPlSmoothness="1.000000" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" custom=""/><item type="8" item="html:plugin:imageslideshowplg*{&quot;effects&quot;:&quot;none&quot;,&quot;delay&quot;:2,&quot;synced&quot;:true,&quot;random&quot;:false,&quot;nowrap&quot;:false,&quot;hide&quot;:false,&quot;remember&quot;:false}" itemaudio="" name="Image Slideshow" cname="" pos_left="0.000000" pos_top="0.500000" pos_right="0.500000" pos_bottom="1.000000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="2" volume="100" mute="0" sounddev="0" lockmove="0" keep_ar="1" fdeinterlace="0" mipmaps="0" autoresdet="1" visible="1" keeploaded="0" alpha="255" border="0" cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_pin="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" key_smartcamenable="0" key_smartcamconfig="" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" syncid0="2637880986" syncid1="1079305104" syncid2="451007678" syncid3="2363272072" id="{81C6D4D5-801F-48F2-9DA6-87E8FC003B79}" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="1" GameCapPlSmoothness="1.000000" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" custom=""/><item type="6" item="C:\\Users\\dara\\Documents\\SplitmediaLabs\\CCGSourcePlugin\\cl3rd.swf" itemaudio="" name="C:\\Users\\dara\\Documents\\SplitmediaLabs\\CCGSourcePlugin\\cl3rd.swf" cname="" pos_left="0.000000" pos_top="0.000000" pos_right="1.000000" pos_bottom="1.000000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="0" volume="100" mute="0" sounddev="0" lockmove="0" keep_ar="1" fdeinterlace="0" mipmaps="0" autoresdet="1" visible="1" keeploaded="0" alpha="255" border="0" cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_pin="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" key_smartcamenable="0" key_smartcamconfig="" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" syncid0="1063414728" syncid1="1284980335" syncid2="2746624435" syncid3="1116473649" id="{110D3927-E08B-4020-AE84-B587D962EA9F}" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="1" GameCapPlSmoothness="1.000000" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="0" DllGrant="" custom="" /><item type="7" item="&lt;src pid=&quot;0&quot; handle=&quot;0&quot; hwnd=&quot;0&quot; GapiType=&quot;&quot; width=&quot;0&quot; height=&quot;0&quot; flags=&quot;0&quot; wndname=&quot;&quot; lastframets=&quot;0&quot; fpsRender=&quot;0.000000&quot; fpsCapture=&quot;0.000000&quot; imagename=&quot;&quot;/&gt;" itemaudio="" name="Game: Auto Detect" cname="" pos_left="0.500000" pos_top="0.500000" pos_right="1.000000" pos_bottom="1.000000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="3" volume="100" mute="0" sounddev="0" lockmove="0" keep_ar="1" fdeinterlace="0" mipmaps="1" autoresdet="1" visible="1" keeploaded="0" alpha="255" border="0" cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_pin="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" key_smartcamenable="0" key_smartcamconfig="" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" syncid0="3414902889" syncid1="1315307938" syncid2="1827907751" syncid3="4241258036" id="{323C9CFE-7CFC-44EF-BD89-090D2C6FBE3A}" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="1" GameCapSurfSharing="1" GameCapAlpha="0" GameCapPlSmooth="1" GameCapPlSmoothness="1.000000" GameCapTrackActive="1" GameCapTrackActiveFullscreen="0" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" custom=""/><item type="8" item="http://youtube.com" itemaudio="" name="http://youtube.com" cname="" pos_left="0.250000" pos_top="0.250000" pos_right="0.750000" pos_bottom="0.750000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="4" volume="100" mute="0" sounddev="0" lockmove="0" keep_ar="1" fdeinterlace="0" mipmaps="0" autoresdet="1" visible="1" keeploaded="0" alpha="255" border="0" cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_pin="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" key_smartcamenable="0" key_smartcamconfig="" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" syncid0="2488945113" syncid1="1194872864" syncid2="523629230" syncid3="1804434656" id="{BD292BDC-57CC-491F-BC0E-D616C66308C0}" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="1" GameCapPlSmoothness="1.000000" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" custom=""/></placement>';
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

  var currentFlashItem;
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
        var isValid;
        if (val === '1' || val === '0') {
          local.rightclick = val;
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
    env.set('extension');

    navigator.__defineGetter__('appVersion', function() {
      return 'XSplit Broadcaster 2.7.1702.2231 ';
    });

    // Reset the attached IDS
    var item1 = new XJS.Item({id : '{FLASHID}' });
    var item2 = new XJS.Item({id : '{FLASHID2}'});

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
      newScene.getItems().then(function(items) {
        var itemArray = items;
        var itemArrayLength = itemArray.length;

        if (itemArrayLength > 0) {
          for (var i = 0; i < itemArrayLength; i++) {
            if (itemArray[i] instanceof FlashItem) {
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
      .getElementsByTagName('placement')[0];
    var selected = '[type="' + TYPE_FLASH + '"]';
    var flashItems = placement.querySelectorAll(selected);
    expect(flashItems.length).toBe(enumerated.length);
    done();
  });

  describe('interface method checking', function() {
    beforeEach(function(done) {
      if (enumerated.length > 0) {
        currentFlashItem = enumerated[0];
      }
      done();
    });

    it('should implement the layout interface', function() {
    	if (currentFlashItem !== null) {
	      expect(currentFlashItem).hasMethods([
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
    	if (currentFlashItem !== null) {
	      expect(currentFlashItem).hasMethods([
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
			if (currentFlashItem !== null) {
	      expect(currentFlashItem).hasMethods([
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
    	if (currentFlashItem !== null) {
	      expect(currentFlashItem).hasMethods([
		        'isVisible',
		        'setVisible',
		        'getTransition',
		        'setTransition',
		        'getTransitionTime',
		        'setTransitionTime'
		        ].join(','));
    	}
    });

    it('should implement audio interface', function() {
      expect(currentFlashItem).hasMethods([
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

  describe('FlashItem-specific methods checking', function() {
    beforeEach(function(done) {
      if (enumerated.length > 0) {
        currentFlashItem = enumerated[0];
        done();
      }
    });

    afterEach(function() {
      navigator.__defineGetter__('appVersion', function() {
        return appVersion;
      });
    });

    it('should be able to get its custom browser window size',
      function(done) {
        exec(function(next) {
          var promise = currentFlashItem.getCustomResolution();
          expect(promise).toBeInstanceOf(Promise);
          promise.then(function(browserSize) {
            expect(browserSize).hasMethods([
              'getTop',
              'setTop',
              'getLeft',
              'setLeft',
              'getRight',
              'setRight',
              'getBottom',
              'setBottom',
              'getWidth',
              'setWidth',
              'getHeight',
              'setHeight',
              'toDimensionString',
              'toCoordinateString',
              'toString'
            ].join(','));
            next();
          });
        }).then(done);
    });

    it('should be able to set its custom browser window size',
      function(done) {
        exec(function(next) {
          urlSet = false;

          var MockRectangle = function(width, height) {
            this.width = width;
            this.height = height;

            this.toDimensionString = function() {
              return this.width + ',' + this.height ;
            };
          };

          var promise = currentFlashItem.setCustomResolution(new MockRectangle(1280, 600));
          promise.then(function() {
            if (!isXSplit) {
              expect(urlSet).toBe(true);
            }
            next();
          });
        }).then(done);
    });

    it('should be able to set and get allow right click', function(done) {
      exec(function(next) {
        currentFlashItem.setAllowRightClick(!local.rightclick)
        .then(function(ret) {
          currentFlashItem.getAllowRightClick().then(function(val) {
            expect(val).toBeTypeOf('boolean');
            local.keeploaded = val;
            next();
          });
        })
      }).then(done);
    });
  });
});
