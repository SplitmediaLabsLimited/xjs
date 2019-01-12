
/* globals describe, it, expect, require, beforeEach, beforeAll, spyOn, done */

describe('ScreenSource', function() {
  'use strict';

  var XJS = require('xjs');
  var Scene = XJS.Scene;
  var ScreenSource = XJS.ScreenSource;
  var env = new window.Environment(XJS);
  var enumerated = [];
  var isXSplit = /xsplit broadcaster/ig.test(navigator.appVersion);
  var mockPresetConfig = '<placement name="Scene 1" id="{219DB767-BE5B-4389-90C2-E712F08EA2CC}" defpos="0"><item type="8" item="html:plugin:whiteboardoverlayplg*{&quot;toolSelect&quot;:&quot;smooth&quot;,&quot;sizeSelect&quot;:2,&quot;color&quot;:&quot;#0099FF&quot;,&quot;dontShowDefaultImage&quot;:&quot;true&quot;}" itemaudio="" name="Whiteboard" cname="" pos_left="0.000000" pos_top="0.000000" pos_right="1.000000" pos_bottom="1.000000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="0" volume="100" mute="0" sounddev="0" lockmove="1" keep_ar="1" fdeinterlace="0" mipmaps="0" autoresdet="1" visible="1" keeploaded="0" alpha="255" border="0" cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_pin="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" key_smartcamenable="0" key_smartcamconfig="" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" syncid0="4094905864" syncid1="1080227405" syncid2="2759655327" syncid3="593648675" id="{0F2DB823-E438-4E67-BEB6-75045CB5B78C}" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="1" GameCapPlSmoothness="1.000000" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" custom=""/><item type="5" item="&lt;screen module=&quot;\\device\\harddiskvolume2\\program files\\sublime text 3\\sublime_text.exe&quot; window=&quot;D:\\Repository\\xjs\\src\\core\\item\\screen.ts • (xjs) - Sublime Text&quot; hwnd=&quot;198426&quot; wclient=&quot;1&quot; left=&quot;0&quot; top=&quot;0&quot; width=&quot;1477&quot; height=&quot;831&quot;/&gt; " itemaudio="" name="Window region &quot;D:\\Repository\\xjs\\src\\core\\item\\screen.ts • (xjs) - Sublime Text&quot; in &quot;sublime_text.exe&quot; process (0, 0) - 1477 x 831" cname="" pos_left="0.000000" pos_top="0.000000" pos_right="1.000000" pos_bottom="1.000000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="0" volume="100" mute="0" sounddev="0" lockmove="0" keep_ar="1" fdeinterlace="0" mipmaps="0" autoresdet="1" visible="1" keeploaded="0" alpha="255" border="0" cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_pin="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" key_smartcamenable="0" key_smartcamconfig="" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" syncid0="1895176703" syncid1="1217168372" syncid2="2167297444" syncid3="2363974056" id="{899ACD07-6761-4F8B-BA15-0B54FFE738CE}" srcid="{FE7E5E06-0655-477D-AC2B-B2642218A31E}" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="1" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="1" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="1" GameCapPlSmoothness="1.000000" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" DllGrant="" custom="" /><item type="8" item="html:plugin:imageslideshowplg*{&quot;effects&quot;:&quot;none&quot;,&quot;delay&quot;:2,&quot;synced&quot;:true,&quot;random&quot;:false,&quot;nowrap&quot;:false,&quot;hide&quot;:false,&quot;remember&quot;:false}" itemaudio="" name="Image Slideshow" cname="" pos_left="0.000000" pos_top="0.500000" pos_right="0.500000" pos_bottom="1.000000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="2" volume="100" mute="0" sounddev="0" lockmove="0" keep_ar="1" fdeinterlace="0" mipmaps="0" autoresdet="1" visible="1" keeploaded="0" alpha="255" border="0" cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_pin="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" key_smartcamenable="0" key_smartcamconfig="" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" syncid0="2637880986" syncid1="1079305104" syncid2="451007678" syncid3="2363272072" id="{81C6D4D5-801F-48F2-9DA6-87E8FC003B79}" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="1" GameCapPlSmoothness="1.000000" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" custom=""/><item type="6" item="C:\\Users\\dara\\Documents\\SplitmediaLabs\\CCGSourcePlugin\\cl3rd.swf" itemaudio="" name="C:\\Users\\dara\\Documents\\SplitmediaLabs\\CCGSourcePlugin\\cl3rd.swf" cname="" pos_left="0.000000" pos_top="0.000000" pos_right="1.000000" pos_bottom="1.000000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="0" volume="100" mute="0" sounddev="0" lockmove="0" keep_ar="1" fdeinterlace="0" mipmaps="0" autoresdet="1" visible="1" keeploaded="0" alpha="255" border="0" cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_pin="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" key_smartcamenable="0" key_smartcamconfig="" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" syncid0="1063414728" syncid1="1284980335" syncid2="2746624435" syncid3="1116473649" id="{110D3927-E08B-4020-AE84-B587D962EA9F}" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="1" GameCapPlSmoothness="1.000000" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="0" DllGrant="" custom="" /><item type="7" item="&lt;src pid=&quot;0&quot; handle=&quot;0&quot; hwnd=&quot;0&quot; GapiType=&quot;&quot; width=&quot;0&quot; height=&quot;0&quot; flags=&quot;0&quot; wndname=&quot;&quot; lastframets=&quot;0&quot; fpsRender=&quot;0.000000&quot; fpsCapture=&quot;0.000000&quot; imagename=&quot;&quot;/&gt;" itemaudio="" name="Game: Auto Detect" cname="" pos_left="0.500000" pos_top="0.500000" pos_right="1.000000" pos_bottom="1.000000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="3" volume="100" mute="0" sounddev="0" lockmove="0" keep_ar="1" fdeinterlace="0" mipmaps="1" autoresdet="1" visible="1" keeploaded="0" alpha="255" border="0" cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_pin="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" key_smartcamenable="0" key_smartcamconfig="" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" syncid0="3414902889" syncid1="1315307938" syncid2="1827907751" syncid3="4241258036" id="{323C9CFE-7CFC-44EF-BD89-090D2C6FBE3A}" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="1" GameCapSurfSharing="1" GameCapAlpha="0" GameCapPlSmooth="1" GameCapPlSmoothness="1.000000" GameCapTrackActive="1" GameCapTrackActiveFullscreen="0" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" custom=""/><item type="8" item="http://youtube.com" itemaudio="" name="http://youtube.com" cname="" pos_left="0.250000" pos_top="0.250000" pos_right="0.750000" pos_bottom="0.750000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="4" volume="100" mute="0" sounddev="0" lockmove="0" keep_ar="1" fdeinterlace="0" mipmaps="0" autoresdet="1" visible="1" keeploaded="0" alpha="255" border="0" cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_pin="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" key_smartcamenable="0" key_smartcamconfig="" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" syncid0="2488945113" syncid1="1194872864" syncid2="523629230" syncid3="1804434656" id="{BD292BDC-57CC-491F-BC0E-D616C66308C0}" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="1" GameCapPlSmoothness="1.000000" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" custom=""/></placement>';
  var attachedID;
  var rand = 0;
  var local = {};
  var TYPE_SCREEN = 5;

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

  var currentScreenSource;
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

      case 'prop:item':
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

      case 'screenresolution':
        var irand = rand;
        setTimeout(function() {
          window.OnAsyncCallback(irand, '0,0,1920,1080');
        },10);
      break;

      case 'prop:ScrCapTrackWindowTitle':
        var irand = rand;
        if (local.hasOwnProperty('stickTitle')) {
          setTimeout(function() {
            window.OnAsyncCallback(irand, local.stickTitle);
          }, 10);
        } else {
          setTimeout(function() {
            window.OnAsyncCallback(irand, '0');
          }, 10);
        }
      break;
    }
    return rand;
  };

  var setLocal = function(funcName, val) {
    rand += 1;

    switch (funcName) {

      case 'prop:srcitem':
        var irand = rand;
        local.item = val;
        setTimeout(function() {
          window.OnAsyncCallback(irand, '0');
        }, 10);
      break;

      case 'prop:ScrCapTrackWindowTitle':
        var irand = rand;
        local.stickTitle = val;
        setTimeout(function() {
          window.OnAsyncCallback(irand, val);
        }, 10);
      break;

    }

    return rand;
  };

  beforeEach(function(done) {
    env.set('extension');
    navigator.__defineGetter__('appVersion', function() {
      return 'XSplit Broadcaster 2.7.1702.2231 ';
    });

    // Reset the attached IDS
    var item1 = new XJS.Item({id : '{SCREENID}' });
    var item2 = new XJS.Item({id : '{SCREENID2}'});

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

    if (enumerated.length !== 0) {
      done();
    } else {
      Scene.getActiveScene().then(function(newScene) {
        newScene.getSources().then(function(sources) {
          var itemArray = sources;
          var itemArrayLength = itemArray.length;

          if (itemArrayLength > 0) {
            for (var i = 0; i < itemArrayLength; i++) {
              if (itemArray[i] instanceof ScreenSource) {
                enumerated.push(itemArray[i]);
              }
            }
          }

          done();
        });
      });
    }
  });

  afterAll(function() {
    navigator.__defineGetter__('appVersion', function() {
      return appVersion;
    });
  });

  it('should be detected by getSources() correctly', function(done) {
    var placement = parseXml(mockPresetConfig)
      .getElementsByTagName('placement')[0];
    var selected = '[type="' + TYPE_SCREEN + '"]';
    var ScreenSources = placement.querySelectorAll(selected);
    expect(ScreenSources.length).toBe(enumerated.length);
    done();
  });

  describe('interface method checking', function() {
    beforeAll(function(done) {
      if (enumerated.length > 0) {
        currentScreenSource = enumerated[0];
        done();
      }
    });

    afterEach(function() {
      navigator.__defineGetter__('appVersion', function() {
        return appVersion;
      });
    });

    it('should implement the screen source interface methods', function() {
      var methods = [
        'isStickToTitle',
        'setStickToTitle',
        'getCaptureLayered',
        'setCaptureLayered',
        'getOptimizedCapture',
        'setOptimizedCapture',
        'getShowMouseClicks',
        'setShowMouseClicks',
        'getShowMouse',
        'setShowMouse',
        'getCaptureArea',
        'setCaptureArea',
        'isClientArea',
        'setClientArea'
        ].join(',');

      expect(currentScreenSource).hasMethods(methods);
    });
  });
});
