/* globals describe, it, expect, require, beforeEach, spyOn, done */

describe('GameItem', function() {
  'use strict';

  var XJS = require('xjs');
  var GameItem = XJS.GameItem;
  var System = XJS.System;
  var Scene = XJS.Scene;
  var env = new window.Environment(XJS);
  var enumerated;
  var isXSplit = /xsplit broadcaster/ig.test(navigator.appVersion);
  var propTypeCount;
  var mockPresetConfig = '<placement name="Scene 1" id="{219DB767-BE5B-4389-90C2-E712F08EA2CC}" defpos="2"><item type="5" item="&lt;screen module=&quot;\\device\\harddiskvolume2\\program files\\sublime text 2\\sublime_text.exe&quot; window=&quot;C:\\wamp\\www\\XJS\\test\\unit\\specs\\item\\game.js (XJS) - Sublime Text 2&quot; hwnd=&quot;660156&quot; wclient=&quot;1&quot; left=&quot;0&quot; top=&quot;0&quot; width=&quot;0&quot; height=&quot;0&quot;/&gt;" itemaudio="" name="Window &quot;C:\\wamp\\www\\XJS\\test\\unit\\specs\\item\\game.js (XJS) - Sublime Text 2&quot; in &quot;sublime_text.exe&quot; process" cname="" pos_left="0.000000" pos_top="0.500000" pos_right="0.468750" pos_bottom="1.000000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="0" volume="100" mute="0" sounddev="0" lockmove="0" keep_ar="1" fdeinterlace="0" mipmaps="0" autoresdet="1" visible="1" keeploaded="0" alpha="255" border="0" cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_pin="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" key_smartcamenable="0" key_smartcamconfig="" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" syncid0="19747858" syncid1="1341412098" syncid2="1958172301" syncid3="1226457053" id="{9C968E9C-7F0D-4815-96CC-1CB341E444A9}" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="1" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="1" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="1" GameCapPlSmoothness="1.000000" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" custom=""/><item type="4" item="C:\\Users\\meso\\Downloads\\wallpaper.bmp" itemaudio="" name="C:\\Users\\meso\\Downloads\\wallpaper.bmp" cname="" pos_left="0.250000" pos_top="0.366667" pos_right="0.750000" pos_bottom="0.633333" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="1" volume="100" mute="0" sounddev="0" lockmove="0" keep_ar="1" fdeinterlace="0" mipmaps="0" autoresdet="1" visible="1" keeploaded="0" alpha="255" border="0" cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_pin="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" key_smartcamenable="0" key_smartcamconfig="" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" syncid0="508728702" syncid1="1206051472" syncid2="3722558381" syncid3="3005167868" id="{2EC42E87-F345-4300-BF2A-CCB0FB3B0930}" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="1" GameCapPlSmoothness="1.000000" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" custom=""/><item type="7" item="&lt;src pid=&quot;7008&quot; handle=&quot;589991448&quot; hwnd=&quot;1118358&quot; GapiType=&quot;DX9Ex_SwapChain&quot; width=&quot;1482&quot; height=&quot;937&quot; flags=&quot;0&quot; wndname=&quot;SourceTree&quot; lastframets=&quot;11149609&quot; fpsRender=&quot;29.991505&quot; fpsCapture=&quot;0.000000&quot; mods=&quot;wpf&quot; imagename=&quot;SourceTree.exe&quot;/&gt;" itemaudio="" name="SourceTree (DX9Ex)" cname="" pos_left="0.251116" pos_top="0.230159" pos_right="0.751116" pos_bottom="0.730159" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="2" volume="100" mute="0" sounddev="0" lockmove="0" keep_ar="1" fdeinterlace="0" mipmaps="1" autoresdet="1" visible="1" keeploaded="0" alpha="255" border="0" cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_pin="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" key_smartcamenable="0" key_smartcamconfig="" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" syncid0="1670502644" syncid1="1282014442" syncid2="2772499079" syncid3="2937332914" id="{12204DAB-12CA-4416-A2ED-8842988FD487}" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="1" GameCapSurfSharing="1" GameCapAlpha="0" GameCapPlSmooth="1" GameCapPlSmoothness="1.000000" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" custom=""/><item type="8" item="html:plugin:titleplg*{&quot;scriptEnabled&quot;:&quot;script enabled&quot;,&quot;customScript&quot;:&quot;/*\\n    This shows title of RSS feed entries from [RSS_FEED_URL]\\n    each item sepated by \\&quot;||\\&quot;, number of entries shown can be specified using the [NUMBER_OF_ENTRIES] variable.\\n    This only checks for feed once (on scene load)\\n*/\\n\\n/**\\n * @name RSS_FEED_URL\\n * @label RSS Feed Url\\n * @type text\\n */\\nvar RSS_FEED_URL = \\&quot;http://www.tomshardware.com/feeds/rss2/tom-s-hardware-us,18-2.xml\\&quot;;\\n\\n/**\\n * @name NUMBER_OF_ENTRIES\\n * @label Number of Entries\\n * @type spinner\\n * @min 1\\n * @max 100\\n * @step 1\\n * @description Values, 1-100\\n */\\nvar NUMBER_OF_ENTRIES = 8;\\n\\n/**\\n * @name SEPARATE_WITH\\n * @label Separate Entries With\\n * @type text\\n * @description The text to separate different entries with. Use &lt;br&gt; to insert line breaks.\\n */\\nvar SEPARATE_WITH = \\&quot; || \\&quot;;\\n\\n/**\\n * @name VISIBILITY_DURATION\\n * @label Visibility Duration\\n * @type spinner\\n * @min 1\\n * @max 86400\\n * @step 5\\n * @description Refers to how long the text will be visible (in seconds), values: 1-86400\\n */\\nvar VISIBILITY_DURATION = 20;\\n\\n/**\\n * @name HIDE_DURATION\\n * @label Hide Duration\\n * @type spinner\\n * @min 1\\n * @max 86400\\n * @step 5\\n * @description Refers to how long the text will be hidden (in seconds), values: 1-86400\\n */\\nvar HIDE_DURATION = 2;\\n\\n/*Do not modify anything below*/\\n\\nvar CombinedEntries=\\&quot;\\&quot;;\\n\\nvar hideSource = function()\\n{\\n    console.log(\\&quot;hide\\&quot;);\\n    window.external.SetLocalPropertyAsync(\\&quot;prop:visible\\&quot;, \\&quot;0\\&quot;);\\n    clearTimeout(smlTitleTimeouts);\\n    smlTitleTimeouts = setTimeout(function()\\n    {\\n        console.log(\\&quot;visible again\\&quot;);\\n        window.external.SetLocalPropertyAsync(\\&quot;prop:visible\\&quot;, \\&quot;1\\&quot;);\\n        window.external.SetLocalPropertyAsync(\\&quot;refresh\\&quot;, \\&quot;\\&quot;);\\n    }, HIDE_DURATION*1000);\\n};\\n\\nvar initialize = function()\\n{\\n    var feed = new google.feeds.Feed(RSS_FEED_URL);\\n    feed.setNumEntries(NUMBER_OF_ENTRIES);\\n    feed.load(function (result)\\n    {\\n        if (!result.error)\\n        {\\n            var entries = [], i = 0;\\n            for (i = 0; i &lt; result.feed.entries.length; i++) {\\n                \\n                var entry = result.feed.entries[i];\\n                \\n                entries[i] = entry;\\n                \\n                CombinedEntries = CombinedEntries + SEPARATE_WITH + entry.title;\\n                \\n            }\\n            window.external.SetLocalPropertyAsync(\\&quot;prop:visible\\&quot;, \\&quot;1\\&quot;);\\n            SetText(CombinedEntries, \\&quot;RSS Feed Reader: \\&quot; + RSS_FEED_URL);\\n            clearTimeout(smlTitleTimeouts);\\n            console.log(\\&quot;visible\\&quot;);\\n            smlTitleTimeouts = setTimeout(hideSource, VISIBILITY_DURATION*1000);\\n        }\\n    });\\n};\\n\\nfunction initial()\\n{\\n    google.load(\\&quot;feeds\\&quot;, \\&quot;1\\&quot;, {\\&quot;callback\\&quot; : initialize});\\n}\\n\\nfunction scriptLoading()\\n{\\n    var headID = document.getElementsByTagName(\\&quot;head\\&quot;)[0],\\n        newScript = document.createElement(\'script\');\\n    newScript.type = \'text/javascript\';\\n    newScript.src = \\&quot;http://www.google.com/jsapi\\&quot;;\\n    newScript.onload = initial;\\n\\n    headID.appendChild(newScript);\\n}\\n\\nscriptLoading();\\n\\nif (smlTitleTimeouts &amp;&amp; smlTitleTimeouts != null)\\n    clearTimeout(smlTitleTimeouts);&quot;,&quot;text&quot;:&quot;Title Text&quot;,&quot;fontStyle&quot;:&quot;Calibri&quot;,&quot;color&quot;:&quot;#FFFFFF&quot;,&quot;outlineColor&quot;:&quot;#FFFFFF&quot;,&quot;outline&quot;:&quot;none&quot;,&quot;alpha&quot;:100,&quot;textDeco&quot;:&quot;none&quot;,&quot;textAlign&quot;:&quot;center&quot;,&quot;vertAlign&quot;:&quot;middle&quot;,&quot;scrollSpeed&quot;:0,&quot;fading&quot;:&quot;fading&quot;,&quot;scrollingOrientation&quot;:&quot;horizontal&quot;,&quot;lineLimit&quot;:1,&quot;customScriptName&quot;:&quot;Custom Script&quot;,&quot;fadeDelimeter&quot;:&quot; ||&quot;,&quot;fadeInterval&quot;:1000,&quot;fadeSpeed&quot;:1000}" itemaudio="" name="Text (RSS Feed Reader: http://www.tomshardware.com/feeds/rss2/tom-s-hardware-us,18-2.xml)" cname="" pos_left="0.000000" pos_top="0.000000" pos_right="1.000000" pos_bottom="0.128968" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="3" volume="100" mute="0" sounddev="0" lockmove="0" keep_ar="0" fdeinterlace="0" mipmaps="0" autoresdet="1" visible="1" keeploaded="0" alpha="255" border="0" cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_pin="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" key_smartcamenable="0" key_smartcamconfig="" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" syncid0="4120910070" syncid1="1325082653" syncid2="3987732362" syncid3="2879274846" id="{5FDED2F8-5869-489D-80A1-E810E7BAC95F}" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="1" GameCapPlSmoothness="1.000000" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" custom=""/><item type="7" item="&lt;src pid=&quot;0&quot; handle=&quot;0&quot; hwnd=&quot;0&quot; GapiType=&quot;&quot; width=&quot;0&quot; height=&quot;0&quot; flags=&quot;0&quot; wndname=&quot;&quot; lastframets=&quot;0&quot; fpsRender=&quot;0.000000&quot; fpsCapture=&quot;0.000000&quot; imagename=&quot;&quot;/&gt;" itemaudio="" name="Game: Auto Detect" cname="" pos_left="0.500000" pos_top="0.000000" pos_right="1.000000" pos_bottom="0.500000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="4" volume="100" mute="0" sounddev="0" lockmove="0" keep_ar="1" fdeinterlace="0" mipmaps="1" autoresdet="1" visible="1" keeploaded="0" alpha="255" border="0" cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_pin="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" key_smartcamenable="0" key_smartcamconfig="" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" syncid0="1043031265" syncid1="1273135403" syncid2="597416882" syncid3="1953320136" id="{532B688B-5187-4857-A271-D43CD9A82CDC}" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="1" GameCapSurfSharing="1" GameCapAlpha="0" GameCapPlSmooth="1" GameCapPlSmoothness="1.000000" GameCapTrackActive="1" GameCapTrackActiveFullscreen="0" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" custom=""/></placement>';
  var attachedID;
  var rand = 0;
  var local = {};
  var specialOptimizationSet = false;
  var showMouseSet = false;
  var offlineImageSet = false;
  var currentGameItem;
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

      case 'GameCapSurfSharing':
        if (local.hasOwnProperty('GameCapSurfSharing')) {
          var irand = rand;
          setTimeout(function() {
            window.OnAsyncCallback(irand, local.GameCapSurfSharing);
          }, 10);
        } else {
          //search for id
          var placement = parseXml(mockPresetConfig)
            .getElementsByTagName("placement")[0];
          var selected = '[id="' + attachedID + '"]';
          var itemSelected = placement.querySelector(selected);
          //return GameCapSurfSharing attribute
          setTimeout(function() {
            var irand = rand;
            window.OnAsyncCallback(irand,
              itemSelected.getAttribute("GameCapSurfSharing"));
          },10);
        }
      break;

      case 'GameCapShowMouse':
        if (local.hasOwnProperty('GameCapShowMouse')) {
          var irand = rand;
          setTimeout(function() {
            window.OnAsyncCallback(irand, local.GameCapShowMouse);
          }, 10);
        } else {
          //search for id
          var placement = parseXml(mockPresetConfig)
            .getElementsByTagName("placement")[0];
          var selected = '[id="' + attachedID + '"]';
          var itemSelected = placement.querySelector(selected);
          //return GameCapShowMouse attribute
          var irand = rand;
          setTimeout(function() {
            window.OnAsyncCallback(irand,
              itemSelected.getAttribute("GameCapShowMouse"));
          },10);
        }
      break;

      case 'prop:srcitem':
      case 'prop:item':
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
          //return type attribute
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
    var irand = rand;

    switch (funcName) {
      case 'GameCapSurfSharing':
        if (val === '1' || val === '0') {
          local.GameCapSurfSharing = val;
          specialOptimizationSet = true;
        } else {
          specialOptimizationSet = false;
        }

      break;

      case 'GameCapShowMouse':
        if (val === '1' || val === '0') {
          local.GameCapShowMouse = val;
          showMouseSet = true;
        } else {
          showMouseSet = false;
        }
      break;

      case 'prop:srcitem':
        if (typeof val === 'string') {
          local.item = val;
          offlineImageSet = true;
        } else {
          offlineImageSet = false;
        }
      break;
    }

    setTimeout(function() {
      window.OnAsyncCallback(irand, '0');
    },10);

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
      var item1 = new XJS.Item({id : '{GAMEID}' });
      var item2 = new XJS.Item({id : '{GAMEID2}'});

      spyOn(window.external, 'AppGetPropertyAsync')
        .and.callFake(function(funcName) {
        rand += 1;
        switch (funcName) {
          case 'gsenum':
            var irand = rand;
            setTimeout(function() {
              window.OnAsyncCallback(irand, encodeURIComponent('<configuration><src pid="23348" handle="386396224" hwnd="199840" GapiType="DX9" width="1280" height="800" flags="0" wndname="Terraria: Cthulhu is mad... and is missing an eye!" lastframets="9045125" fpsRender="44.885239" fpsCapture="0.000000"/><src pid="24448" handle="129832800" hwnd="265242" GapiType="DX9" width="1280" height="768" flags="0" wndname="AdVenture Capitalist!" lastframets="9045125" fpsRender="231.106949" fpsCapture="0.000000"/><src pid="25592" handle="172451040" hwnd="460446" GapiType="DX9Ex" width="1920" height="1080" flags="1" wndname="DOTA 2" lastframets="9043736" fpsRender="60.599564" fpsCapture="0.000000"/></configuration>'));
            },10);
          break;

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
    }
    Scene.getActiveScene().then(function(newScene) {
      newScene.getItems().then(function(items) {
        var itemArray = items;
        var itemArrayLength = itemArray.length;

        if (itemArrayLength > 0) {
          for (var i = 0; i < itemArrayLength; i++) {
            if (itemArray[i] instanceof GameItem) {
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
    var selected = '[type="' + TYPE_GAME + '"]';
    var gameItems = placement.querySelectorAll(selected);
    expect(gameItems.length).toBe(enumerated.length);
    done();
  });

  describe('interface method checking', function() {
    beforeEach(function(done) {
      if (enumerated.length > 0) {
        currentGameItem = enumerated[0];
        done();
      } else {
        System.getGames().then(function(games) {
          currentGameItem = new GameItem(games[games.length-1]);
          done();
        }.bind(this));
      }
    });

    it('should implement the layout interface', function() {
      expect(currentGameItem).hasMethods([
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

    it('should implement the color interface', function() {
      expect(currentGameItem).hasMethods([
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
    });

    it('should implement the chroma interface', function() {
      expect(currentGameItem).hasMethods([
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
    });

    it('should implement the transition interface', function() {
      expect(currentGameItem).hasMethods([
        'isVisible',
        'setVisible',
        'getTransition',
        'setTransition',
        'getTransitionTime',
        'setTransitionTime'
        ].join(','));
    });
  });

  describe('gameItem-specific methods checking', function() {
    beforeEach(function(done) {
      if (enumerated.length > 0) {
        currentGameItem = enumerated[0];
        done();
      } else {
        System.getGames().then(function(games) {
          currentGameItem = new GameItem(games[games.length-1]);
          done();
        }.bind(this));
      }
    });

    afterEach(function() {
      navigator.__defineGetter__('appVersion', function() {
        return appVersion;
      });
    });

    it('should be able to check whether special optimization is enabled or not',
      function(done) {
        exec(function(next) {
          var promise = currentGameItem.isSpecialOptimizationEnabled();
          expect(promise).toBeInstanceOf(Promise);
          promise.then(function(isEnabled) {
            expect(isEnabled).toBeBoolean();
            next();
          });
        }).then(done);
    });

    it('should be able to enable or disable special optimization',
      function(done) {
        var testBoolean = randomBoolean();
        exec(function(next) {
          currentGameItem.setSpecialOptimizationEnabled(testBoolean).then(function() {
            if (!isXSplit) {
              expect(specialOptimizationSet).toBe(true);
            }
            return currentGameItem.isSpecialOptimizationEnabled();
          }).then(function(firstEnabled) {
            expect(firstEnabled).toBe(testBoolean);
            currentGameItem.setSpecialOptimizationEnabled(!testBoolean);
            return currentGameItem.isSpecialOptimizationEnabled();
          }).then(function(secondEnabled) {
            expect(secondEnabled).toBe(!testBoolean);
            next();
          });
        }).then(done);
    });

    it('should be able to check whether mouse is shown or not in game capture',
      function(done) {
        exec(function(next) {
          var promise = currentGameItem.isShowMouseEnabled();
          expect(promise).toBeInstanceOf(Promise);
          promise.then(function(isEnabled) {
            expect(isEnabled).toBeBoolean();
            next();
          });
        }).then(done);
    });

    it('should be able to show or hide mouse in game capture', function(done) {
      var testBoolean = randomBoolean();
      exec(function(next) {
        currentGameItem.setShowMouseEnabled(testBoolean).then(function() {
          if (!isXSplit) {
            expect(showMouseSet).toBe(true);
          }
          return currentGameItem.isShowMouseEnabled();
        }).then(function(firstEnabled) {
          expect(firstEnabled).toBe(testBoolean);
          currentGameItem.setShowMouseEnabled(!testBoolean);
          return currentGameItem.isShowMouseEnabled();
        })
        .then(function(secondEnabled) {
          expect(secondEnabled).toBe(!testBoolean);
          next();
        });
      }).then(done);
    });

    it('should be able to get offline image',
      function(done) {
        exec(function(next) {
          var promise = currentGameItem.getOfflineImage();
          expect(promise).toBeInstanceOf(Promise);
          promise.then(function(offlineImage) {
            expect(offlineImage).toBeTypeOf('string');
            next();
          });
        }).then(done);
    });

    it('should be able to set offline image', function(done) {
      var firstPath = 'C:\\someFolder\\someFile.jpg';
      var secondPath = 'C:\\anotherFolder\\anotherFile.jpg';

      exec(function(next) {
        currentGameItem.setOfflineImage(firstPath).then(function(item) {
          item.getOfflineImage().then(function(offlineImage) {
            expect(offlineImage).toEqual(firstPath);
            currentGameItem.setOfflineImage(secondPath);
            return currentGameItem.getOfflineImage();
          })
          .then(function(offlineImage2) {
            expect(offlineImage2).toEqual(secondPath);
            next();
          });
        });
      }).then(done);
    });

  });
});
