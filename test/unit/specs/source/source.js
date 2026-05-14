/* globals describe, it, expect, xdescribe, require, beforeEach, spyOn, jasmine, afterEach, afterAll */

describe('Source ===', () => {
  var xjs = require('xjs');
  var Source = xjs.Source;
  var Item = xjs.Item;
  var Scene = xjs.Scene;
  var env = new window.Environment(xjs);
  var environments = ['props', 'extension', 'plugin'];
  var environment = xjs.Environment;
  var appVersion = navigator.appVersion;
  var initialMockPresetConfig =
    '<configuration cur="4"><placement name="Scene 1" id="{219DB767-BE5B-4389-90C2-E712F08EA2CC}" defpos="2"><item pos_left="0.000000" pos_top="0.000000" pos_right="0.500000" pos_bottom="0.500000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="0" lockmove="0" keep_ar="1" visible="1" alpha="255" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{C878A0BF-F03A-4274-9398-EBD638D07680}" srcid="{60A168F5-A726-4B55-8AD9-BDD4D88258E2}" type="8" name="http://localhost/XJS/test/functional/test.html" cname="" item="http://localhost/XJS/test/functional/test.html*{&quot;configUrl&quot;:&quot;http://localhost/XJS/test/functional/test.html&quot;}" itemaudio="" volume="100" mute="0" sounddev="0" fdeinterlace="0" mipmaps="0" autoresdet="1" keeploaded="1" cc_pin="0" key_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:0.970000&amp;str:0.900000&amp;rad:0.070000&amp;color:2155905152&amp;trail:0.000000&amp;filtering:0.000000&amp;fill:0" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" LiveDetectSignal="1" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="640" BrowserSizeY="360" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" DllGrant="" custom=""><presproperty __map_id="BrowserSize">0,0</presproperty><presproperty __map_id="BrowserSizeOnSet">640,360</presproperty></item><item pos_left="0.562500" pos_top="0.000000" pos_right="0.937500" pos_bottom="0.500000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="1" lockmove="0" keep_ar="1" visible="1" alpha="255" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="1" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{5BCC247D-6E56-41AF-95CE-74FF14CBA5E8}" srcid="{4FB8159F-2846-42FB-B2E7-4294E973FFEE}" type="2" name="Elgato Game Capture HD" cname="" item="clsid:{39F50F4C-99E1-464A-B6F9-D605B4FB5918}" itemaudio="" volume="100" mute="0" sounddev="0" fdeinterlace="0" mipmaps="0" autoresdet="1" keeploaded="0" cc_pin="0" key_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:0.970000&amp;str:0.900000&amp;rad:0.070000&amp;color:2155905152&amp;trail:0.000000&amp;filtering:0.000000&amp;fill:0" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" LiveDetectSignal="1" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" DllGrant="" custom=""><presproperty __map_id="logitechcanrecommend">0</presproperty></item></placement><placement name="Scene 2" defpos="0"/><placement name="Scene 3" defpos="0"/><placement name="Scene 4" defpos="0"/><placement name="Scene 5" defpos="1"><item pos_left="0.000000" pos_top="0.000000" pos_right="0.500000" pos_bottom="0.500000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="0" lockmove="0" keep_ar="1" visible="1" alpha="255" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{5E4279F7-BF64-448B-B953-A54F1315AFE1}" srcid="{60A168F5-A726-4B55-8AD9-BDD4D88258E2}" type="8" name="http://localhost/XJS/test/functional/test.html" cname="" item="http://localhost/XJS/test/functional/test.html*{&quot;configUrl&quot;:&quot;http://localhost/XJS/test/functional/test.html&quot;}" itemaudio="" volume="100" mute="0" sounddev="0" fdeinterlace="0" mipmaps="0" autoresdet="1" keeploaded="1" cc_pin="0" key_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:0.970000&amp;str:0.900000&amp;rad:0.070000&amp;color:2155905152&amp;trail:0.000000&amp;filtering:0.000000&amp;fill:0" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" LiveDetectSignal="1" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="640" BrowserSizeY="360" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" DllGrant="" custom=""><presproperty __map_id="BrowserSize">0,0</presproperty><presproperty __map_id="BrowserSizeOnSet">640,360</presproperty></item></placement><global><camera id="obj-moniker-clsid:{39f50f4c-99e1-464a-b6f9-d605b4fb5918}" width="0" height="0" frametime="0" videosubtype="{00000000-0000-0000-0000-000000000000}" xbarroute1="" xbarroute2="" vpersist="" apersist=""/></global><scriptproperty __map_id="http%3A%2F%2Flocalhost%2FScript_Plugin%2Fwebm-encoder%2Froot%2Fbase.html%3Ftakte"><presproperty __map_id="webm_encoder_HKhTV2LMuWwefbNr0GkJQw==">{"destinationPath":"F:\\Videos\\","showAdvancedSettings":true,"frameRatePNG":"30","frameRateMOV":"Auto","videoBitrate":"10000","audioBitrate":"128","keyFrameInterval":"Auto","customFPSValues":[]}</presproperty></scriptproperty></configuration>';
  var mockPresetConfig =
    '<configuration cur="4"><placement name="Scene 1" id="{219DB767-BE5B-4389-90C2-E712F08EA2CC}" defpos="2"><item pos_left="0.000000" pos_top="0.000000" pos_right="0.500000" pos_bottom="0.500000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="0" lockmove="0" keep_ar="1" visible="1" alpha="255" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{C878A0BF-F03A-4274-9398-EBD638D07680}" srcid="{60A168F5-A726-4B55-8AD9-BDD4D88258E2}" type="8" name="http://localhost/XJS/test/functional/test.html" cname="" item="http://localhost/XJS/test/functional/test.html*{&quot;configUrl&quot;:&quot;http://localhost/XJS/test/functional/test.html&quot;}" itemaudio="" volume="100" mute="0" sounddev="0" fdeinterlace="0" mipmaps="0" autoresdet="1" keeploaded="1" cc_pin="0" key_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:0.970000&amp;str:0.900000&amp;rad:0.070000&amp;color:2155905152&amp;trail:0.000000&amp;filtering:0.000000&amp;fill:0" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" LiveDetectSignal="1" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="640" BrowserSizeY="360" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" DllGrant="" custom=""><presproperty __map_id="BrowserSize">0,0</presproperty><presproperty __map_id="BrowserSizeOnSet">640,360</presproperty></item><item pos_left="0.562500" pos_top="0.000000" pos_right="0.937500" pos_bottom="0.500000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="1" lockmove="0" keep_ar="1" visible="1" alpha="255" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="1" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{5BCC247D-6E56-41AF-95CE-74FF14CBA5E8}" srcid="{4FB8159F-2846-42FB-B2E7-4294E973FFEE}" type="2" name="Elgato Game Capture HD" cname="" item="clsid:{39F50F4C-99E1-464A-B6F9-D605B4FB5918}" itemaudio="" volume="100" mute="0" sounddev="0" fdeinterlace="0" mipmaps="0" autoresdet="1" keeploaded="0" cc_pin="0" key_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:0.970000&amp;str:0.900000&amp;rad:0.070000&amp;color:2155905152&amp;trail:0.000000&amp;filtering:0.000000&amp;fill:0" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" LiveDetectSignal="1" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" DllGrant="" custom=""><presproperty __map_id="logitechcanrecommend">0</presproperty></item></placement><placement name="Scene 2" defpos="0"/><placement name="Scene 3" defpos="0"/><placement name="Scene 4" defpos="0"/><placement name="Scene 5" defpos="1"><item pos_left="0.000000" pos_top="0.000000" pos_right="0.500000" pos_bottom="0.500000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="0" lockmove="0" keep_ar="1" visible="1" alpha="255" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{5E4279F7-BF64-448B-B953-A54F1315AFE1}" srcid="{60A168F5-A726-4B55-8AD9-BDD4D88258E2}" type="8" name="http://localhost/XJS/test/functional/test.html" cname="" item="http://localhost/XJS/test/functional/test.html*{&quot;configUrl&quot;:&quot;http://localhost/XJS/test/functional/test.html&quot;}" itemaudio="" volume="100" mute="0" sounddev="0" fdeinterlace="0" mipmaps="0" autoresdet="1" keeploaded="1" cc_pin="0" key_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:0.970000&amp;str:0.900000&amp;rad:0.070000&amp;color:2155905152&amp;trail:0.000000&amp;filtering:0.000000&amp;fill:0" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" LiveDetectSignal="1" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="640" BrowserSizeY="360" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" DllGrant="" custom=""><presproperty __map_id="BrowserSize">0,0</presproperty><presproperty __map_id="BrowserSizeOnSet">640,360</presproperty></item></placement><global><camera id="obj-moniker-clsid:{39f50f4c-99e1-464a-b6f9-d605b4fb5918}" width="0" height="0" frametime="0" videosubtype="{00000000-0000-0000-0000-000000000000}" xbarroute1="" xbarroute2="" vpersist="" apersist=""/></global><scriptproperty __map_id="http%3A%2F%2Flocalhost%2FScript_Plugin%2Fwebm-encoder%2Froot%2Fbase.html%3Ftakte"><presproperty __map_id="webm_encoder_HKhTV2LMuWwefbNr0GkJQw==">{"destinationPath":"F:\\Videos\\","showAdvancedSettings":true,"frameRatePNG":"30","frameRateMOV":"Auto","videoBitrate":"10000","audioBitrate":"128","keyFrameInterval":"Auto","customFPSValues":[]}</presproperty></scriptproperty></configuration>';
  var presetObj = {};
  var local = {};
  var attachedId = '';
  var itemDeleted = false;
  var deletedId;
  var isOtherSource = false;

  var hasDuplicates = (array) => new Set(array).size !== array.length;

  var mix = new window.Mixin([
    () => {
      navigator.__defineGetter__('appVersion', () => 'XSplit Broadcaster 2.7.1702.2231 ');
    },
    () => {
      navigator.__defineGetter__('appVersion', () => 'XSplit Broadcaster 2.9.1611.1623 ');
    },
  ]);

  var mixEnvironments = new window.Mixin([
    () => {
      navigator.__defineGetter__('appVersion', () => appVersion);
      env.set(environments[0]);
    },
    () => {
      navigator.__defineGetter__('appVersion', () => appVersion);
      env.set(environments[1]);
    },
    () => {
      navigator.__defineGetter__('appVersion', () => appVersion);
      env.set(environments[2]);
    },
  ]);

  var exec = mix.exec.bind(mix);
  var execEnvironments = mixEnvironments.exec.bind(mixEnvironments);

  var parseXml = (xmlStr) => new window.DOMParser().parseFromString(xmlStr, 'text/xml');

  var serializeXml = (xml) => new window.XMLSerializer().serializeToString(xml);

  var convertPresetStringToPresetObject = (presetString) => {
    var tempPresetObj = {};
    var presetXML = parseXml(mockPresetConfig);
    var scenesArray = presetXML.querySelectorAll('placement');
    tempPresetObj['count'] = scenesArray.length;
    for (var i = 0; i < scenesArray.length; i++) {
      tempPresetObj[i.toString()] = scenesArray[i].outerHTML;
    }
    return tempPresetObj;
  };

  var replacePlacementWithID = (preset, id) => {
    var tempPresetObj = {};
    var presetXML = parseXml(mockPresetConfig);
    var itemForDeletion = presetXML.querySelector('item[id="' + id + '"]');
    var sceneDeleted = itemForDeletion.parentNode;
    var sceneDeletedName = sceneDeleted.getAttribute('name');
    var sceneDeletedDefPos = sceneDeleted.getAttribute('defpos');
    sceneDeleted.outerHTML =
      '<placement name="' + sceneDeletedName + '" defpos="' + sceneDeletedDefPos + '"/>';
    return serializeXml(presetXML);
  };

  var getRandomItemId = (presetConfig) => {
    var items = parseXml(presetConfig).getElementsByTagName('item');
    var item = items[Math.floor(Math.random() * items.length)];
    return item.getAttribute('id');
  };

  presetObj = convertPresetStringToPresetObject(mockPresetConfig);

  var xCallback = (id, result) => {
    setTimeout(() => {
      window.OnAsyncCallback(id, result);
    }, 10);
  };

  var getLocalSource = (property) => {
    global_asyncId++;
    var asyncId = new Date().getTime() + '_' + global_asyncId;

    if (property.substring(0, 5) === 'prop:') {
      property = property.replace(/^prop:/, '');
    }
    if (property === 'item') {
      property = 'srcitem';
    }
    if (property === 'itemlist') {
      if (deletedId !== '{C878A0BF-F03A-4274-9398-EBD638D07680}') {
        xCallback(asyncId, '{C878A0BF-F03A-4274-9398-EBD638D07680}');
      } else {
        xCallback(asyncId, '{5E4279F7-BF64-448B-B953-A54F1315AFE1}');
      }
    } else if (
      typeof local['{C878A0BF-F03A-4274-9398-EBD638D07680}'] !== 'undefined' &&
      Object.hasOwn(local['{C878A0BF-F03A-4274-9398-EBD638D07680}'], property)
    ) {
      xCallback(asyncId, local['{C878A0BF-F03A-4274-9398-EBD638D07680}'][property]);
    } else {
      if (property === 'StreamPause') {
      } else {
        var placements = parseXml(mockPresetConfig).getElementsByTagName('configuration')[0];
        var selected = '[id="{C878A0BF-F03A-4274-9398-EBD638D07680}"]';
        var secondary = '[id="{5E4279F7-BF64-448B-B953-A54F1315AFE1}"]';
        var itemSelected = placements.querySelector(selected);

        if (itemSelected === null) {
          itemSelected = placements.querySelector(secondary);
        }

        if (property === 'config') {
          xCallback(asyncId, serializeXml(itemSelected));
        } else {
          xCallback(asyncId, itemSelected.getAttribute(property));
        }
      }
    }
    return asyncId;
  };

  var getLocal = (property) => {
    global_asyncId++;
    var asyncId = new Date().getTime() + '_' + global_asyncId;

    if (property.substring(0, 5) === 'prop:') {
      property = property.replace(/^prop:/, '');
    }
    if (property === 'item') {
      property = 'srcitem';
    }
    if (attachedId === '') {
      if (property === 'itemlist') {
        xCallback(asyncId, '{C878A0BF-F03A-4274-9398-EBD638D07680}');
      } else if (property === 'config') {
        var placements = parseXml(mockPresetConfig).getElementsByTagName('configuration')[0];
        var selected = '[id="{C878A0BF-F03A-4274-9398-EBD638D07680}"]';
        var itemSelected = placements.querySelector(selected);
        xCallback(asyncId, serializeXml(itemSelected));
      }
    } else if (
      typeof local[attachedId] !== 'undefined' &&
      Object.hasOwn(local[attachedId], property)
    ) {
      xCallback(asyncId, local[attachedId][property]);
    } else {
      if (property === 'StreamPause') {
      } else if (property === 'itemlist') {
        var placements = parseXml(mockPresetConfig).getElementsByTagName('configuration')[0];
        var selected = '[id="' + attachedId + '"]';
        var itemSelected = placements.querySelector(selected);
        if (itemSelected !== null) {
          var srcid = itemSelected.getAttribute('srcid');
          var sourcesLinkedSelector = '[srcid="' + srcid + '"]';
          var sourcesLinked = placements.querySelectorAll(sourcesLinkedSelector);
          var sourcesLinkedArray = [];
          for (var i = 0; i < sourcesLinked.length; i++) {
            sourcesLinkedArray.push(sourcesLinked[i].getAttribute('id'));
          }
          xCallback(asyncId, sourcesLinkedArray.toString());
        } else {
          xCallback(asyncId, 'null');
        }
      } else {
        var placements = parseXml(mockPresetConfig).getElementsByTagName('configuration')[0];
        var selected = '[id="' + attachedId + '"]';
        var itemSelected = placements.querySelector(selected);

        if (property === 'config') {
          xCallback(asyncId, serializeXml(itemSelected));
        } else {
          xCallback(asyncId, itemSelected.getAttribute(property));
        }
      }
    }
    return asyncId;
  };

  var setLocalSource = (property, value) => {
    global_asyncId++;
    var asyncId = new Date().getTime() + '_' + global_asyncId;

    if (property.substring(0, 5) === 'prop:') {
      property = property.replace(/^prop:/, '');
    }

    if (typeof local['{C878A0BF-F03A-4274-9398-EBD638D07680}'] === 'undefined') {
      local['{C878A0BF-F03A-4274-9398-EBD638D07680}'] = {};
    }

    local['{C878A0BF-F03A-4274-9398-EBD638D07680}'][property] = value;

    xCallback(asyncId, '0');
    return asyncId;
  };

  var setLocal = (property, value) => {
    global_asyncId++;
    var asyncId = new Date().getTime() + '_' + global_asyncId;

    if (property.substring(0, 5) === 'prop:') {
      property = property.replace(/^prop:/, '');
    }

    if (typeof local[attachedId] === 'undefined') {
      local[attachedId] = {};
    }

    local[attachedId][property] = value;

    xCallback(asyncId, '0');
    return asyncId;
  };

  beforeEach(() => {
    deletedId = '';
    spyOn(window.external, 'GetLocalPropertyAsync').and.callFake((funcName) => {
      if (environment.isSourcePlugin() && !isOtherSource) {
        return getLocalSource(funcName);
      } else {
        return getLocal(funcName);
      }
    });

    spyOn(window.external, 'SetLocalPropertyAsync').and.callFake((funcName, value) => {
      if (environment.isSourcePlugin() && !isOtherSource) {
        return setLocalSource(funcName, value);
      } else {
        return setLocal(funcName, value);
      }
    });

    spyOn(window.external, 'GetLocalPropertyAsync1').and.callFake(getLocal);

    spyOn(window.external, 'SetLocalPropertyAsync1').and.callFake(setLocal);

    spyOn(window.external, 'GetLocalPropertyAsync2').and.callFake(getLocal);

    spyOn(window.external, 'SetLocalPropertyAsync2').and.callFake(setLocal);

    spyOn(window.external, 'SearchVideoItem').and.callFake((id) => {
      attachedId = id;
    });

    spyOn(window.external, 'SearchVideoItem2').and.callFake((id) => {
      attachedId = id;
    });

    spyOn(window.external, 'AttachVideoItem').and.callFake((id) => {
      attachedId = id;
    });

    spyOn(window.external, 'AttachVideoItem1').and.callFake((id) => {
      attachedId = id;
    });

    spyOn(window.external, 'AttachVideoItem2').and.callFake((id) => {
      attachedId = id;
    });

    spyOn(window.external, 'AppGetPropertyAsync').and.callFake((funcName) => {
      global_asyncId++;
      var asyncId = new Date().getTime() + '_' + global_asyncId;
      switch (funcName) {
        case 'scenecount':
          xCallback(asyncId, presetObj['count']);
          break;

        case 'sceneconfig':
          xCallback(asyncId, encodeURIComponent(mockPresetConfig));
          break;

        default:
          if (funcName.startsWith('sceneconfig:')) {
            var sceneIndex = funcName.substring(12);
            if (typeof presetObj[sceneIndex] !== 'undefined') {
              xCallback(asyncId, encodeURIComponent(presetObj[sceneIndex]));
            } else {
              xCallback(asyncId, 'null');
            }
          }
          break;
      }
      return asyncId;
    });
  });

  afterEach(() => {
    navigator.__defineGetter__('appVersion', () => appVersion);
    env.set(environments[1]);
  });

  describe('should be able to get currently bound source', () => {
    it('from source', (done) => {
      env.set(environments[2]);
      navigator.__defineGetter__('appVersion', () => 'XSplit Broadcaster 2.9.1611.1623 ');
      var promise = Source.getCurrentSource();
      expect(promise).toBeInstanceOf(Promise);
      promise.then((source) => {
        expect(source).toBeInstanceOf(Source);
        done();
      });
    });

    it('from source props', (done) => {
      env.set(environments[0]);
      navigator.__defineGetter__('appVersion', () => 'XSplit Broadcaster 2.9.1611.1623 ');
      // simulate when no ID is being attached
      attachedId = '';
      var promise = Source.getCurrentSource();
      expect(promise).toBeInstanceOf(Promise);
      promise.then((source) => {
        expect(source).toBeInstanceOf(Source);
        done();
      });
    });

    it('but rejected when from extension', (done) => {
      env.set(environments[1]);
      exec((next) => {
        var promise = Source.getCurrentSource();
        expect(promise).toBeInstanceOf(Promise);
        promise.then(
          (source) => {
            done.fail('getCurrentSource should reject if called in Extension');
          },
          () => {
            next();
          }
        );
      }).then(done);
    });
  });

  describe('should be able to statically get default items rendering it', () => {
    it('that resolves to an array of Items', (done) => {
      execEnvironments((nextEnvironment) => {
        navigator.__defineGetter__('appVersion', () => 'XSplit Broadcaster 2.9.1611.1623 ');
        Source.getItemList().then(
          (items) => {
            if (!environment.isExtension()) {
              expect(items).toBeInstanceOf(Array);
              expect(items).eachToBeInstanceOf(Item);
              nextEnvironment();
            } else {
              done.failed(
                'Source getItemList static method should reject when called from extension'
              );
            }
          },
          (err) => {
            if (environment.isExtension()) {
              expect(err).toEqual(jasmine.any(Error));
              nextEnvironment();
            } else {
              done.failed(
                'Source getItemList static method should reject when called from extension'
              );
            }
          }
        );
      }).then(done);
    });
  });

  describe('should be able to get all available sources', () => {
    it('that resolves to an array of Sources', (done) => {
      execEnvironments((nextEnvironment) => {
        exec((next) => {
          var promise = Source.getAllSources();
          promise.then((sources) => {
            expect(promise).toBeInstanceOf(Promise);
            expect(sources).toBeInstanceOf(Array);
            expect(sources).eachToBeInstanceOf(Source);
            next();
          });
        }).then(nextEnvironment);
      }).then(done);
    });

    it('with no duplicates', (done) => {
      execEnvironments((nextEnvironment) => {
        exec((next) => {
          Source.getAllSources().then((sources) => {
            expect(sources).toBeInstanceOf(Array);
            expect(sources).eachToBeInstanceOf(Source);
            var srcIdArray = [];
            for (var i = sources.length - 1; i >= 0; i--) {
              srcIdArray.push(sources[i]._srcId);
            }
            expect(hasDuplicates(srcIdArray)).toBe(false);
            next();
          });
        }).then(nextEnvironment);
      }).then(done);
    });
  });

  describe('should be able to get and set source-specific properties', () => {
    it('name', (done) => {
      execEnvironments((nextEnvironment) => {
        exec((next) => {
          var promise, testSource, otherSource, testName, otherName;
          var randomTest = '1_' + randomWord(15);
          var randomOther = '2_' + randomWord(15);
          // remove attachedId to properly mirror behavior of calling without attaching
          var shouldAttach = false;
          attachedId = '';
          if (
            !environment.isExtension() &&
            navigator.appVersion !== 'XSplit Broadcaster 2.7.1702.2231 '
          ) {
            promise = new Promise((resolve) => {
              Source.getCurrentSource().then((source) => {
                resolve(source);
              });
            });
          } else {
            if (
              environment.isSourcePlugin() &&
              navigator.appVersion === 'XSplit Broadcaster 2.7.1702.2231 '
            ) {
              shouldAttach = true;
            }
            promise = new Promise((resolve) => {
              Scene.searchItemsById('{C878A0BF-F03A-4274-9398-EBD638D07680}')
                .then((item) => item.getSource())
                .then((source) => {
                  resolve(source);
                });
            });
          }
          promise
            .then((source) => {
              testSource = source;
              return Scene.searchItemsById('{5BCC247D-6E56-41AF-95CE-74FF14CBA5E8}');
            })
            .then((item) => item.getSource())
            .then((newSource) => {
              otherSource = newSource;
              return testSource.getName();
            })
            .then((name) => {
              testName = name;
              if (shouldAttach) {
                isOtherSource = true;
                attachedId = '{5BCC247D-6E56-41AF-95CE-74FF14CBA5E8}';
              }
              return otherSource.getName();
            })
            .then((otherName1) => {
              isOtherSource = false;
              otherName = otherName1;
              expect(testName).toBeDefined();
              expect(testName).toBeTypeOf('string');
              expect(otherName).toBeDefined();
              expect(otherName).toBeTypeOf('string');
              expect(testName).not.toEqual(otherName);
              return testSource.setName(randomTest);
            })
            .then(() => {
              if (shouldAttach) {
                isOtherSource = true;
                attachedId = '{5BCC247D-6E56-41AF-95CE-74FF14CBA5E8}';
              }
              return otherSource.setName(randomOther);
            })
            .then(() => {
              isOtherSource = false;
              return testSource.getName();
            })
            .then((name2) => {
              testName = name2;
              if (shouldAttach) {
                isOtherSource = true;
                attachedId = '{5BCC247D-6E56-41AF-95CE-74FF14CBA5E8}';
              }
              return otherSource.getName();
            })
            .then((otherName2) => {
              isOtherSource = false;
              otherName = otherName2;
              expect(testName).not.toEqual(otherName);
              expect(testName).toEqual(randomTest);
              expect(otherName).toEqual(randomOther);
              next();
            });
        }).then(nextEnvironment);
      }).then(done);
    });

    it('custom name', (done) => {
      navigator.__defineGetter__('appVersion', () => 'XSplit Broadcaster 2.9.1611.1623 ');
      var testSource, testCustomName, newCustomName;
      var randomId = getRandomItemId(mockPresetConfig);
      Scene.searchItemsById(randomId)
        .then((item) => item.getSource())
        .then((source) => {
          testSource = source;
          return source.getCustomName();
        })
        .then((customName) => {
          newCustomName = randomWord(15);
          expect(customName).toBeDefined();
          expect(customName).toBeTypeOf('string');
          expect(customName).not.toEqual(newCustomName);
          return testSource.setCustomName(newCustomName);
        })
        .then((source) => source.getCustomName())
        .then((customName) => {
          expect(customName).toEqual(newCustomName);
          done();
        });
    });

    it('value', (done) => {
      navigator.__defineGetter__('appVersion', () => 'XSplit Broadcaster 2.9.1611.1623 ');
      var testSource, testValue, newValue;
      var randomId = getRandomItemId(mockPresetConfig);
      Scene.searchItemsById(randomId)
        .then((item) => item.getSource())
        .then((source) => {
          testSource = source;
          return source.getValue();
        })
        .then((value) => {
          newValue = randomWord(20);
          expect(value).toBeDefined();
          expect(value).toBeTypeOf('string');
          expect(value).not.toEqual(newValue);
          return testSource.setValue(newValue);
        })
        .then((source) => source.getValue())
        .then((value) => {
          expect(value).toEqual(newValue);
          done();
        });
    });

    it('kept loaded in memory', (done) => {
      navigator.__defineGetter__('appVersion', () => 'XSplit Broadcaster 2.9.1611.1623 ');
      var testSource, testBoolean;
      var randomId = getRandomItemId(mockPresetConfig);
      Scene.searchItemsById(randomId)
        .then((item) => item.getSource())
        .then((source) => {
          testSource = source;
          return source.getKeepLoaded();
        })
        .then((keeploaded) => {
          testBoolean = keeploaded;
          expect(testBoolean).toBeDefined();
          expect(testBoolean).toBeTypeOf('boolean');
          return testSource.setKeepLoaded(!testBoolean);
        })
        .then((source) => source.getKeepLoaded())
        .then((keeploaded) => {
          expect(keeploaded).toEqual(!testBoolean);
          done();
        });
    });

    it('source ID', (done) => {
      navigator.__defineGetter__('appVersion', () => 'XSplit Broadcaster 2.9.1611.1623 ');
      var randomId = getRandomItemId(mockPresetConfig);
      Scene.searchItemsById(randomId)
        .then((item) => item.getSource())
        .then((source) => source.getId())
        .then((id) => {
          var placements = parseXml(mockPresetConfig).getElementsByTagName('configuration')[0];
          var selected = '[id="' + randomId + '"]';
          var itemSelected = placements.querySelector(selected);
          expect(id).toBeDefined();
          expect(id).toBeTypeOf('string');
          expect(id).toEqual(itemSelected.getAttribute('srcid'));
          done();
        });
    });

    it('item list', (done) => {
      navigator.__defineGetter__('appVersion', () => 'XSplit Broadcaster 2.9.1611.1623 ');
      var randomId = getRandomItemId(mockPresetConfig);
      Scene.searchItemsById(randomId)
        .then((item) => item.getSource())
        .then((source) => source.getItemList())
        .then((items) => {
          expect(items).toBeInstanceOf(Array);
          expect(items).eachToBeInstanceOf(Item);
          done();
        });
    });

    it('refresh', (done) => {
      navigator.__defineGetter__('appVersion', () => 'XSplit Broadcaster 2.9.1611.1623 ');
      var testSource;
      var randomId = getRandomItemId(mockPresetConfig);
      Scene.searchItemsById(randomId)
        .then((item) => item.getSource())
        .then((source) => {
          testSource = source;
          return source.refresh();
        })
        .then((source) => {
          expect(source).toBeInstanceOf(Source);
          expect(source).toEqual(testSource);
          done();
        });
    });

    it('type', (done) => {
      navigator.__defineGetter__('appVersion', () => 'XSplit Broadcaster 2.9.1611.1623 ');
      var testSource;
      var randomId = getRandomItemId(mockPresetConfig);
      Scene.searchItemsById(randomId)
        .then((item) => item.getSource())
        .then((source) => {
          testSource = source;
          return source.getType();
        })
        .then((type) => {
          expect(type).toBeDefined();
          expect(type).toBeTypeOf('number');
          expect(type).toBeLessThan(9);
          expect(type).not.toBeLessThan(1);
          done();
        });
    });

    it('which still proceeds even if original item is deleted', (done) => {
      execEnvironments((nextEnvironment) => {
        navigator.__defineGetter__('appVersion', () => 'XSplit Broadcaster 2.9.1611.1623 ');
        itemDeleted = false;
        mockPresetConfig = initialMockPresetConfig;
        presetObj = convertPresetStringToPresetObject(mockPresetConfig);
        var promise;
        // remove attachedId to properly mirror behavior of calling without attaching
        attachedId = '';
        local = {};
        if (!environment.isExtension()) {
          promise = new Promise((resolve) => {
            Source.getCurrentSource().then((source) => {
              resolve(source);
            });
          });
        } else {
          promise = new Promise((resolve) => {
            Scene.searchItemsById('{C878A0BF-F03A-4274-9398-EBD638D07680}')
              .then((item) => item.getSource())
              .then((source) => {
                resolve(source);
              });
          });
        }

        var sourceForItemDeletion;
        var initialID;
        var initialName;
        var finalID;
        var finalName;
        promise
          .then((source) => {
            sourceForItemDeletion = source;
            initialID = sourceForItemDeletion._id;
            deletedId = sourceForItemDeletion._id;
            return sourceForItemDeletion.getName();
          })
          .then((name) => {
            initialName = name;
            // simulate deletion of item (this time by deleting whole scene)
            itemDeleted = true;
            mockPresetConfig = replacePlacementWithID(mockPresetConfig, deletedId);
            return sourceForItemDeletion.getName();
          })
          .then((name) => {
            finalName = name;
            finalID = sourceForItemDeletion._id;
            expect(initialName).toEqual(finalName);
            expect(initialID).not.toEqual(finalID);
            nextEnvironment();
          });
      }).then(done);
    });
  });
});
