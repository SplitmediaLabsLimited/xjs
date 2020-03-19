
/* globals describe, it, expect, require, beforeEach, beforeAll, spyOn, done */

describe('ScreenSource Interface', function() {
  'use strict';

  var XJS = require('xjs');
  var Scene = XJS.Scene;
  var ScreenSource = XJS.ScreenSource;
  var env = new window.Environment(XJS);
  var enumerated = [];
  var isXSplit = /xsplit broadcaster/ig.test(navigator.appVersion);
  var mockPresetConfig = '<placement name="Scene 1" id="{219DB767-BE5B-4389-90C2-E712F08EA2CC}" defpos="0"><item type="8" item="html:plugin:whiteboardoverlayplg*{&quot;toolSelect&quot;:&quot;smooth&quot;,&quot;sizeSelect&quot;:2,&quot;color&quot;:&quot;#0099FF&quot;,&quot;dontShowDefaultImage&quot;:&quot;true&quot;}" itemaudio="" name="Whiteboard" cname="" pos_left="0.000000" pos_top="0.000000" pos_right="1.000000" pos_bottom="1.000000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="0" volume="100" mute="0" sounddev="0" lockmove="1" keep_ar="1" fdeinterlace="0" mipmaps="0" autoresdet="1" visible="1" keeploaded="0" alpha="255" border="0" cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_pin="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" key_smartcamenable="0" key_smartcamconfig="" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" syncid0="4094905864" syncid1="1080227405" syncid2="2759655327" syncid3="593648675" id="{0F2DB823-E438-4E67-BEB6-75045CB5B78C}" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="1" GameCapPlSmoothness="1.000000" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" custom=""/><item type="5" item="&lt;screen module=&quot;\\device\\harddiskvolume2\\program files\\sublime text 3\\sublime_text.exe&quot; window=&quot;D:\\Repository\\xjs\\src\\core\\item\\screen.ts • (xjs) - Sublime Text&quot; hwnd=&quot;198426&quot; wclient=&quot;1&quot; left=&quot;0&quot; top=&quot;0&quot; width=&quot;1477&quot; height=&quot;831&quot;/&gt; " itemaudio="" name="Window region &quot;D:\\Repository\\xjs\\src\\core\\item\\screen.ts • (xjs) - Sublime Text&quot; in &quot;sublime_text.exe&quot; process (0, 0) - 1477 x 831" cname="" pos_left="0.000000" pos_top="0.000000" pos_right="1.000000" pos_bottom="1.000000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="0" volume="100" mute="0" sounddev="0" lockmove="0" keep_ar="1" fdeinterlace="0" mipmaps="0" autoresdet="1" visible="1" keeploaded="0" alpha="255" border="0" cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_pin="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" key_smartcamenable="0" key_smartcamconfig="" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" syncid0="1895176703" syncid1="1217168372" syncid2="2167297444" syncid3="2363974056" id="{899ACD07-6761-4F8B-BA15-0B54FFE738CE}" srcid="{FE7E5E06-0655-477D-AC2B-B2642218A31E}" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="1" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="1" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="1" GameCapPlSmoothness="1.000000" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" DllGrant="" custom="" /><item type="8" item="html:plugin:imageslideshowplg*{&quot;effects&quot;:&quot;none&quot;,&quot;delay&quot;:2,&quot;synced&quot;:true,&quot;random&quot;:false,&quot;nowrap&quot;:false,&quot;hide&quot;:false,&quot;remember&quot;:false}" itemaudio="" name="Image Slideshow" cname="" pos_left="0.000000" pos_top="0.500000" pos_right="0.500000" pos_bottom="1.000000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="2" volume="100" mute="0" sounddev="0" lockmove="0" keep_ar="1" fdeinterlace="0" mipmaps="0" autoresdet="1" visible="1" keeploaded="0" alpha="255" border="0" cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_pin="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" key_smartcamenable="0" key_smartcamconfig="" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" syncid0="2637880986" syncid1="1079305104" syncid2="451007678" syncid3="2363272072" id="{81C6D4D5-801F-48F2-9DA6-87E8FC003B79}" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="1" GameCapPlSmoothness="1.000000" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" custom=""/><item type="6" item="C:\\Users\\dara\\Documents\\SplitmediaLabs\\CCGSourcePlugin\\cl3rd.swf" itemaudio="" name="C:\\Users\\dara\\Documents\\SplitmediaLabs\\CCGSourcePlugin\\cl3rd.swf" cname="" pos_left="0.000000" pos_top="0.000000" pos_right="1.000000" pos_bottom="1.000000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="0" volume="100" mute="0" sounddev="0" lockmove="0" keep_ar="1" fdeinterlace="0" mipmaps="0" autoresdet="1" visible="1" keeploaded="0" alpha="255" border="0" cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_pin="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" key_smartcamenable="0" key_smartcamconfig="" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" syncid0="1063414728" syncid1="1284980335" syncid2="2746624435" syncid3="1116473649" id="{110D3927-E08B-4020-AE84-B587D962EA9F}" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="1" GameCapPlSmoothness="1.000000" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="0" DllGrant="" custom="" /><item type="7" item="&lt;src pid=&quot;0&quot; handle=&quot;0&quot; hwnd=&quot;0&quot; GapiType=&quot;&quot; width=&quot;0&quot; height=&quot;0&quot; flags=&quot;0&quot; wndname=&quot;&quot; lastframets=&quot;0&quot; fpsRender=&quot;0.000000&quot; fpsCapture=&quot;0.000000&quot; imagename=&quot;&quot;/&gt;" itemaudio="" name="Game: Auto Detect" cname="" pos_left="0.500000" pos_top="0.500000" pos_right="1.000000" pos_bottom="1.000000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="3" volume="100" mute="0" sounddev="0" lockmove="0" keep_ar="1" fdeinterlace="0" mipmaps="1" autoresdet="1" visible="1" keeploaded="0" alpha="255" border="0" cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_pin="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" key_smartcamenable="0" key_smartcamconfig="" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" syncid0="3414902889" syncid1="1315307938" syncid2="1827907751" syncid3="4241258036" id="{323C9CFE-7CFC-44EF-BD89-090D2C6FBE3A}" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="1" GameCapSurfSharing="1" GameCapAlpha="0" GameCapPlSmooth="1" GameCapPlSmoothness="1.000000" GameCapTrackActive="1" GameCapTrackActiveFullscreen="0" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" custom=""/><item type="8" item="http://youtube.com" itemaudio="" name="http://youtube.com" cname="" pos_left="0.250000" pos_top="0.250000" pos_right="0.750000" pos_bottom="0.750000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="4" volume="100" mute="0" sounddev="0" lockmove="0" keep_ar="1" fdeinterlace="0" mipmaps="0" autoresdet="1" visible="1" keeploaded="0" alpha="255" border="0" cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_pin="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" key_smartcamenable="0" key_smartcamconfig="" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" syncid0="2488945113" syncid1="1194872864" syncid2="523629230" syncid3="1804434656" id="{BD292BDC-57CC-491F-BC0E-D616C66308C0}" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="1" GameCapPlSmoothness="1.000000" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" custom=""/><item pos_left="0.000000000e+00" pos_top="1.921294630e-02" pos_right="5.000000000e-01" pos_bottom="4.807870388e-01" pos_an="1" crop_left="0.000000000e+00" crop_top="0.000000000e+00" crop_right="0.000000000e+00" crop_bottom="0.000000000e+00" crop_an="1" pixalign="0" zorder="0" lockmove="0" keep_ar="1" visible="1" visible_an="1" alpha="255" alpha_an="1" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" cc_brightness_an="1" cc_contrast_an="1" cc_hue_an="1" cc_saturation_an="1" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" pan="0" pan_config="R:1.000000000e+00&amp;la:0.000000000e+00&amp;fi:0.000000000e+00" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" rotate_x_an="1" rotate_y_an="1" offset_x="0.000000000e+00" offset_y="0.000000000e+00" ShowPosition="0" OverlayURL="" OverlayConfig="" transitionid="" transitiontime="300" trscenter="0" trscexit="0" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{96CE7D6B-A029-4004-B956-D25CFF9DAE49}" srcid="{333A727F-3186-4165-B13E-FD2888CDD78F}" type="5" name="Window &quot;C:\\wamp64\\www\\XJS\\test\\unit\\specs\\source\\iscreen.js (XJS) - Sublime Text&quot; in &quot;sublime_text.exe&quot; process" cname="" item="&lt;screen module=&quot;\\device\\harddiskvolume4\\program files\\sublime text 3\\sublime_text.exe&quot; window=&quot;C:\\wamp64\\www\\XJS\\test\\unit\\specs\\source\\iscreen.js (XJS) - Sublime Text&quot; class=&quot;PX_WINDOW_CLASS&quot; desktop=&quot;&quot; hwnd=&quot;329016&quot; wclient=&quot;1&quot; left=&quot;0&quot; top=&quot;0&quot; width=&quot;0&quot; height=&quot;0&quot;/&gt;" itemaudio="" volume="100" mute="0" keepaudio="0" sounddev="0" mipmaps="0" autoresdet="1" keeploaded="1" RefreshOnScnLoad="0" RefreshOnSrcShow="0" zoom="l:0.000000000e+00|t:0.000000000e+00|r:1.000000000e+00|b:1.000000000e+00" or_enable="0" or_mode="0" or_angle="0" cc_pin="0" key_pin="0" edgeeffect_pin="0" effects_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:9.700000286e-01&amp;str:8.999999762e-01&amp;rad:7.000000030e-02&amp;color:2155905152&amp;trail:0.000000000e+00&amp;filtering:0.000000000e+00&amp;fill:0" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" LiveDetectSignal="1" CuePoints="" FilePlaylist="" fdeinterlace="0" InPoint="0" OutPoint="0" OpWhenFinished="0" StartOnLoad="1" StartOnSrcShow="0" RememberPosition="1" LastPosition="0" LastRunState="-1" ScrCapMethod="4" ScrCapLayered="1" ScrCapOptCapture1="1" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="1" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapEnc="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapFrameTimeLimit="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserCookiePath="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookieFlags="0" Browser60fps="0" BrowserZoom="1.000000000e+00" SwfWrapper="1" DllGrant="" custom=""/></placement>';
  var attachedID;
  var ctr = 0;
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

  var firstSource, secondSource;

  var parseXml = function(xmlStr) {
      return ( new window.DOMParser() ).parseFromString(xmlStr, 'text/xml');
  };

  var xCallback = function(id, result) {
    setTimeout(function() {
      window.OnAsyncCallback(id, result);
    }, 10);
  };

  var getLocal = function(property) {
    ctr++;
    var asyncId = 'iscreen_' + ctr;

    if (property.substring(0, 5) === 'prop:') {
      property = property.replace(/^prop:/, '');
    }
    if (property.substring(0, 3) === 'src') {
      property = property.substring(3);
    }

    if (property === 'screenresolution') {
      xCallback(asyncId, '0,0,1920,1080');
    } else if (local[attachedID] !== undefined && local[attachedID].hasOwnProperty(
      property)) {
      xCallback(asyncId, local[attachedID][property]);
    } else {
      var placement = parseXml(mockPresetConfig)
        .getElementsByTagName('placement')[0];
      var selected = '[id="' + attachedID + '"]';
      var itemSelected = placement.querySelector(selected);
      xCallback(asyncId, itemSelected.getAttribute(property));
    }

    return asyncId;
  };

  var setLocal = function(property, val) {
    ctr++;
    var asyncId = 'iscreen_' + ctr;

    if (property.substring(0, 5) === 'prop:') {
      property = property.replace(/^prop:/, '');
    }

    if (property.substring(0, 3) === 'src') {
      property = property.substring(3);
    }

    if (local[attachedID] === undefined) {
      local[attachedID] = {};
    }

    local[attachedID][property] = val;
    xCallback(asyncId, '0');
    return asyncId;
  };

  beforeEach(function(done) {
    env.set('extension');
    navigator.__defineGetter__('appVersion', function() {
      return 'XSplit Broadcaster 2.7.1702.2231 ';
    });

    // Reset the attached IDS
    var item1 = new XJS.Item({id : '{SCREENID}' });
    var item2 = new XJS.Item({id : '{SCREENID2}'});

    local = {};

    spyOn(window.external, 'AppGetPropertyAsync')
      .and.callFake(function(funcName) {
      ctr++;
      var asyncId = 'iscreen_' + ctr;
      switch (funcName) {
        case 'sceneconfig:0':
          xCallback(asyncId, encodeURIComponent(mockPresetConfig));
        break;

        case 'scene:0':
          xCallback(asyncId, '0');
        break;

        case 'sceneconfig':
          xCallback(asyncId, encodeURIComponent(mockPresetConfig));
        break;
      }
      return asyncId;
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
          firstSource = enumerated[0];
          secondSource = enumerated[1];
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

  it('should be detected by getItems() correctly', function(done) {
    var placement = parseXml(mockPresetConfig)
      .getElementsByTagName('placement')[0];
    var selected = '[type="' + TYPE_SCREEN + '"]';
    var ScreenSources = placement.querySelectorAll(selected);
    expect(ScreenSources.length).toBe(enumerated.length);
    done();
  });

  it('contains all the necessary screen source interface methods', function() {
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

    expect(firstSource).hasMethods(methods);
    expect(secondSource).hasMethods(methods);
  });

  describe('should be able to get and set sticking to title', function(done) {
    var randomBoolean = Math.random() < 0.5;
    it ('through a promise', function(done) {
      var promise = firstSource.isStickToTitle();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it ('as a boolean', function(done) {
      firstSource.setStickToTitle(randomBoolean)
      .then(function() {
        return firstSource.isStickToTitle();
      }).then(function(shouldStick) {
        expect(shouldStick).toBe(randomBoolean);
        return firstSource.setStickToTitle(!randomBoolean);
      }).then(function() {
        return firstSource.isStickToTitle();
      }).then(function(shouldStick) {
        expect(shouldStick).toBe(!randomBoolean);
        done();
      });
    });
  });

  describe('should be able to get and set capturing of layered windows', function(done) {
    var randomBoolean = Math.random() < 0.5;
    it ('through a promise', function(done) {
      var promise = firstSource.getCaptureLayered();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it ('as a boolean', function(done) {
      firstSource.setCaptureLayered(randomBoolean)
      .then(function() {
        return firstSource.getCaptureLayered();
      }).then(function(shouldCapture) {
        expect(shouldCapture).toBe(randomBoolean);
        return firstSource.setCaptureLayered(!randomBoolean);
      }).then(function() {
        return firstSource.getCaptureLayered();
      }).then(function(shouldCapture) {
        expect(shouldCapture).toBe(!randomBoolean);
        done();
      });
    });
  });

  describe('should be able to get and set capture optimization', function(done) {
    var randomBoolean = Math.random() < 0.5;
    it ('through a promise', function(done) {
      var promise = firstSource.getOptimizedCapture();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it ('as a boolean', function(done) {
      firstSource.setOptimizedCapture(randomBoolean)
      .then(function() {
        return firstSource.getOptimizedCapture();
      }).then(function(shouldOptimize) {
        expect(shouldOptimize).toBe(randomBoolean);
        return firstSource.setOptimizedCapture(!randomBoolean);
      }).then(function() {
        return firstSource.getOptimizedCapture();
      }).then(function(shouldOptimize) {
        expect(shouldOptimize).toBe(!randomBoolean);
        done();
      });
    });
  });

  describe('should be able to get and set to show mouse clicks', function(done) {
    var randomBoolean = Math.random() < 0.5;
    it ('through a promise', function(done) {
      var promise = firstSource.getShowMouseClicks();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it ('as a boolean', function(done) {
      firstSource.setShowMouseClicks(randomBoolean)
      .then(function() {
        return firstSource.getShowMouseClicks();
      }).then(function(shouldOptimize) {
        expect(shouldOptimize).toBe(randomBoolean);
        return firstSource.setShowMouseClicks(!randomBoolean);
      }).then(function() {
        return firstSource.getShowMouseClicks();
      }).then(function(shouldOptimize) {
        expect(shouldOptimize).toBe(!randomBoolean);
        done();
      });
    });
  });

  describe('should be able to get and set to show mouse', function(done) {
    var randomBoolean = Math.random() < 0.5;
    it ('through a promise', function(done) {
      var promise = firstSource.getShowMouse();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it ('as a boolean', function(done) {
      firstSource.setShowMouse(randomBoolean)
      .then(function() {
        return firstSource.getShowMouse();
      }).then(function(shouldOptimize) {
        expect(shouldOptimize).toBe(randomBoolean);
        return firstSource.setShowMouse(!randomBoolean);
      }).then(function() {
        return firstSource.getShowMouse();
      }).then(function(shouldOptimize) {
        expect(shouldOptimize).toBe(!randomBoolean);
        done();
      });
    });
  });

  describe('should be able to get and set capture area', function() {
    it ('through a promise', function(done) {
      var promise = firstSource.getCaptureArea();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it ('as a Rectangle object', function(done) {
      var leftRand = Math.floor(Math.random() * (1000));
      var topRand = Math.floor(Math.random() * (1000));
      var rightRand = Math.floor(Math.random() * (1920) + leftRand);
      var bottomRand = Math.floor(Math.random() * (1080) + topRand);

      var firstRec = XJS.Rectangle.fromCoordinates(leftRand, topRand, rightRand, bottomRand);
      firstSource.getCaptureArea()
      .then(function(capRectangle) {
        expect(capRectangle).toBeInstanceOf(XJS.Rectangle);
        return firstSource.setCaptureArea(firstRec);
      }).then(function() {
        return firstSource.getCaptureArea();
      }).then(function(rec1) {
        expect(rec1).toBeInstanceOf(XJS.Rectangle);
        console.log('REC 1');
        console.log(rec1);
        console.log(firstRec);
        expect(rec1.toCoordinateString()).toEqual(firstRec.toCoordinateString());
        done();
      })
    });
  });

  describe('should be able to get and set to just include client area', function(done) {
    var randomBoolean = Math.random() < 0.5;
    it ('through a promise', function(done) {
      var promise = firstSource.isClientArea();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it ('as a boolean', function(done) {
      firstSource.setClientArea(randomBoolean)
      .then(function() {
        return firstSource.isClientArea();
      }).then(function(shouldOptimize) {
        expect(shouldOptimize).toBe(randomBoolean);
        return firstSource.setClientArea(!randomBoolean);
      }).then(function() {
        return firstSource.isClientArea();
      }).then(function(shouldOptimize) {
        expect(shouldOptimize).toBe(!randomBoolean);
        done();
      });
    });
  });
});
