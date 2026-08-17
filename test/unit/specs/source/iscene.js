/* globals describe, require, beforeEach, spyOn, it, expect */

describe('Scene Source interface', function() {
  'use strict';

  var XJS = require('xjs');
  var Scene = XJS.Scene;
  var mockPresetConfig = '<?xml version="1.0" encoding="utf-8"?><configuration cur="1" Version="4.0.2014.0602"><placement name="Scene 1" id="{E5AFB667-63C7-433D-B06E-84F8E1A99F34}" preset_id="{00000000-0000-0000-0000-000000000000}" preset_trtime="500" preset_trfunc="" defpos="0" trid="" trtime="500"><item pos_left="0.000000000e+00" pos_top="0.000000000e+00" pos_right="5.000000000e-01" pos_bottom="5.000000000e-01" pos_an="1" crop_left="0.000000000e+00" crop_top="0.000000000e+00" crop_right="0.000000000e+00" crop_bottom="0.000000000e+00" crop_an="1" pixalign="0" zorder="0" lockmove="0" keep_ar="1" visible="1" visible_an="1" alpha="255" alpha_an="1" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" cc_brightness_an="1" cc_contrast_an="1" cc_hue_an="1" cc_saturation_an="1" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="50" key_chromasat="50" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" pan="0" pan_config="R:1.000000000e+00&amp;la:0.000000000e+00&amp;fi:0.000000000e+00" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" rotate_x_an="1" rotate_y_an="1" offset_x="0.000000000e+00" offset_y="0.000000000e+00" ShowPosition="0" OverlayURL="" OverlayConfig="" transitionid="" transitiontime="300" trscenter="0" trscexit="0" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{7D713E17-F1D4-4106-B0CC-B280EB763D10}" srcid="{649E6615-A70B-4BF9-ACEB-5B5C2868BF34}" type="11" name="Scene: Scene 2" cname="" item="{D66D1279-727C-4C46-98EA-0A2AC9460E63}" itemaudio="" volume="100" mute="0" keepaudio="0" sounddev="0" mipmaps="0" autoresdet="1" keeploaded="1" RefreshOnScnLoad="0" RefreshOnSrcShow="0" zoom="l:0.000000000e+00|t:0.000000000e+00|r:1.000000000e+00|b:1.000000000e+00" or_enable="0" or_mode="0" or_angle="0" cc_pin="0" key_pin="0" edgeeffect_pin="0" effects_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:9.700000286e-01&amp;str:8.999999762e-01&amp;rad:7.000000030e-02&amp;color:2155905152&amp;trail:0.000000000e+00&amp;filtering:0.000000000e+00&amp;fill:0" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" LiveDetectSignal="1" CuePoints="" FilePlaylist="" fdeinterlace="0" InPoint="0" OutPoint="0" OpWhenFinished="0" StartOnLoad="1" StartOnSrcShow="0" RememberPosition="1" LastPosition="0" LastRunState="-1" ScrCapMethod="3" ScrCapLayered="1" ScrCapOptCapture1="1" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapEnc="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapFrameTimeLimit="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserCookiePath="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookieFlags="0" Browser60fps="0" BrowserZoom="1.000000000e+00" SwfWrapper="1" DllGrant="" custom="" /><item pos_left="5.000000000e-01" pos_top="5.000000000e-01" pos_right="1.000000000e+00" pos_bottom="1.000000000e+00" pos_an="1" crop_left="0.000000000e+00" crop_top="0.000000000e+00" crop_right="0.000000000e+00" crop_bottom="0.000000000e+00" crop_an="1" pixalign="0" zorder="1" lockmove="0" keep_ar="1" visible="1" visible_an="1" alpha="255" alpha_an="1" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" cc_brightness_an="1" cc_contrast_an="1" cc_hue_an="1" cc_saturation_an="1" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="50" key_chromasat="50" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" pan="0" pan_config="R:1.000000000e+00&amp;la:0.000000000e+00&amp;fi:0.000000000e+00" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" rotate_x_an="1" rotate_y_an="1" offset_x="0.000000000e+00" offset_y="0.000000000e+00" ShowPosition="0" OverlayURL="" OverlayConfig="" transitionid="" transitiontime="300" trscenter="0" trscexit="0" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{1BBB07AB-A12A-4D00-80BD-6E48705EE6F2}" srcid="{2F0F8BAE-BDFF-400B-8A99-F77146C8D7AC}" type="14" name="Scene: Live Scene" cname="" item="0" itemaudio="" volume="100" mute="0" keepaudio="0" sounddev="0" mipmaps="0" autoresdet="1" keeploaded="1" RefreshOnScnLoad="0" RefreshOnSrcShow="0" zoom="l:0.000000000e+00|t:0.000000000e+00|r:1.000000000e+00|b:1.000000000e+00" or_enable="0" or_mode="0" or_angle="0" cc_pin="0" key_pin="0" edgeeffect_pin="0" effects_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:9.700000286e-01&amp;str:8.999999762e-01&amp;rad:7.000000030e-02&amp;color:2155905152&amp;trail:0.000000000e+00&amp;filtering:0.000000000e+00&amp;fill:0" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" LiveDetectSignal="1" CuePoints="" FilePlaylist="" fdeinterlace="0" InPoint="0" OutPoint="0" OpWhenFinished="0" StartOnLoad="1" StartOnSrcShow="0" RememberPosition="1" LastPosition="0" LastRunState="-1" ScrCapMethod="3" ScrCapLayered="1" ScrCapOptCapture1="1" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapEnc="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapFrameTimeLimit="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserCookiePath="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookieFlags="0" Browser60fps="0" BrowserZoom="1.000000000e+00" SwfWrapper="1" DllGrant="" custom="" /></placement><placement name="Scene 2" id="{D66D1279-727C-4C46-98EA-0A2AC9460E63}" preset_id="{00000000-0000-0000-0000-000000000000}" preset_trtime="500" preset_trfunc="" defpos="0" trid="" trtime="500" /><placement name="Scene 3" id="{3A6D3015-AF67-4A44-8AE6-25DCB2FF3ABE}" preset_id="{00000000-0000-0000-0000-000000000000}" preset_trtime="500" preset_trfunc="" defpos="0" trid="" trtime="500" /><placement name="Scene 4" id="{69D60691-50EB-4ADD-907B-4820BBF3EF21}" preset_id="{00000000-0000-0000-0000-000000000000}" preset_trtime="500" preset_trfunc="" defpos="0" trid="" trtime="500" /><global /><scriptproperty __map_id="global"><presproperty __map_id="runstate_C%3A%5Cwamp64%5Cwww%5Cxjs%5Ctest%5Cfunctional%5Ctest.html">0</presproperty><presproperty __map_id="wndplacement2_C%3A%5Cwamp64%5Cwww%5CScript_Plugin%5Cwebm-encoder%5Croot-internal-extension%5Cbase.html">584,360,1312,748,0</presproperty><presproperty __map_id="wndplacement2_C%3A%5Cwamp64%5Cwww%5Cxjs%5Ctest%5Cfunctional%5Ctest.html">372,324,1016,784,0</presproperty><presproperty __map_id="wndplacement2_html%3Ascript%3Aplugin%3ApresentationPackagerplg">726,420,1193,644,0</presproperty><presproperty __map_id="wndplacement2_html%3Ascript%3Aplugin%3AwebMEncoderplg">396,184,1124,572,0</presproperty><presproperty __map_id="wndplacement2_http%3A%2F%2Fxsplit.com">664,258,1308,718,0</presproperty></scriptproperty><scriptproperty __map_id="html%3Ascript%3Aplugin%3AwebMEncoderplg"><presproperty __map_id="webm_encoder_HKhTV2LMuWwefbNr0GkJQw==">{"destinationPath":"C:\\Program Files (x86)\\SplitmediaLabs\\XSplit Broadcaster\\x64\\XsplitBroadcaster\\","showAdvancedSettings":true,"disableAudio":false,"frameRatePNG":"30","frameRateMOV":"60","videoBitrate":"10000","audioBitrate":"128","keyFrameInterval":"Auto","customFPSValues":[]}</presproperty></scriptproperty></configuration>';
  var mockPresetConfigScene1 = '<placement name="Scene 1" id="{E5AFB667-63C7-433D-B06E-84F8E1A99F34}" preset_id="{00000000-0000-0000-0000-000000000000}" preset_trtime="500" preset_trfunc="" defpos="0" trid="" trtime="500"><item pos_left="0.000000000e+00" pos_top="0.000000000e+00" pos_right="5.000000000e-01" pos_bottom="5.000000000e-01" pos_an="1" crop_left="0.000000000e+00" crop_top="0.000000000e+00" crop_right="0.000000000e+00" crop_bottom="0.000000000e+00" crop_an="1" pixalign="0" zorder="0" lockmove="0" keep_ar="1" visible="1" visible_an="1" alpha="255" alpha_an="1" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" cc_brightness_an="1" cc_contrast_an="1" cc_hue_an="1" cc_saturation_an="1" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="50" key_chromasat="50" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" pan="0" pan_config="R:1.000000000e+00&amp;la:0.000000000e+00&amp;fi:0.000000000e+00" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" rotate_x_an="1" rotate_y_an="1" offset_x="0.000000000e+00" offset_y="0.000000000e+00" ShowPosition="0" OverlayURL="" OverlayConfig="" transitionid="" transitiontime="300" trscenter="0" trscexit="0" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{7D713E17-F1D4-4106-B0CC-B280EB763D10}" srcid="{649E6615-A70B-4BF9-ACEB-5B5C2868BF34}" type="11" name="Scene: Scene 2" cname="" item="{D66D1279-727C-4C46-98EA-0A2AC9460E63}" itemaudio="" volume="100" mute="0" keepaudio="0" sounddev="0" mipmaps="0" autoresdet="1" keeploaded="1" RefreshOnScnLoad="0" RefreshOnSrcShow="0" zoom="l:0.000000000e+00|t:0.000000000e+00|r:1.000000000e+00|b:1.000000000e+00" or_enable="0" or_mode="0" or_angle="0" cc_pin="0" key_pin="0" edgeeffect_pin="0" effects_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:9.700000286e-01&amp;str:8.999999762e-01&amp;rad:7.000000030e-02&amp;color:2155905152&amp;trail:0.000000000e+00&amp;filtering:0.000000000e+00&amp;fill:0" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" LiveDetectSignal="1" CuePoints="" FilePlaylist="" fdeinterlace="0" InPoint="0" OutPoint="0" OpWhenFinished="0" StartOnLoad="1" StartOnSrcShow="0" RememberPosition="1" LastPosition="0" LastRunState="-1" ScrCapMethod="3" ScrCapLayered="1" ScrCapOptCapture1="1" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapEnc="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapFrameTimeLimit="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserCookiePath="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookieFlags="0" Browser60fps="0" BrowserZoom="1.000000000e+00" SwfWrapper="1" DllGrant="" custom=""/><item pos_left="5.000000000e-01" pos_top="5.000000000e-01" pos_right="1.000000000e+00" pos_bottom="1.000000000e+00" pos_an="1" crop_left="0.000000000e+00" crop_top="0.000000000e+00" crop_right="0.000000000e+00" crop_bottom="0.000000000e+00" crop_an="1" pixalign="0" zorder="1" lockmove="0" keep_ar="1" visible="1" visible_an="1" alpha="255" alpha_an="1" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" cc_brightness_an="1" cc_contrast_an="1" cc_hue_an="1" cc_saturation_an="1" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="50" key_chromasat="50" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" pan="0" pan_config="R:1.000000000e+00&amp;la:0.000000000e+00&amp;fi:0.000000000e+00" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" rotate_x_an="1" rotate_y_an="1" offset_x="0.000000000e+00" offset_y="0.000000000e+00" ShowPosition="0" OverlayURL="" OverlayConfig="" transitionid="" transitiontime="300" trscenter="0" trscexit="0" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{1BBB07AB-A12A-4D00-80BD-6E48705EE6F2}" srcid="{2F0F8BAE-BDFF-400B-8A99-F77146C8D7AC}" type="14" name="Scene: Live Scene" cname="" item="0" itemaudio="" volume="100" mute="0" keepaudio="0" sounddev="0" mipmaps="0" autoresdet="1" keeploaded="1" RefreshOnScnLoad="0" RefreshOnSrcShow="0" zoom="l:0.000000000e+00|t:0.000000000e+00|r:1.000000000e+00|b:1.000000000e+00" or_enable="0" or_mode="0" or_angle="0" cc_pin="0" key_pin="0" edgeeffect_pin="0" effects_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:9.700000286e-01&amp;str:8.999999762e-01&amp;rad:7.000000030e-02&amp;color:2155905152&amp;trail:0.000000000e+00&amp;filtering:0.000000000e+00&amp;fill:0" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" LiveDetectSignal="1" CuePoints="" FilePlaylist="" fdeinterlace="0" InPoint="0" OutPoint="0" OpWhenFinished="0" StartOnLoad="1" StartOnSrcShow="0" RememberPosition="1" LastPosition="0" LastRunState="-1" ScrCapMethod="3" ScrCapLayered="1" ScrCapOptCapture1="1" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapEnc="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapFrameTimeLimit="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserCookiePath="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookieFlags="0" Browser60fps="0" BrowserZoom="1.000000000e+00" SwfWrapper="1" DllGrant="" custom=""/></placement>';

  var local = {};
  var attachedId;
  var enumeratedSource = [];

  var appVersion = navigator.appVersion;

  var env = new window.Environment(XJS);
  var environments = {
    SOURCE : 'plugin',
    SOURCEPROPS : 'props',
    EXTENSION : 'extension'
  };

  var ctr = 0;

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
    var asyncId = 'scene_' + ctr;

    if (property.substring(0, 5) === 'prop:') {
      property = property.replace(/^prop:/, '');
    }
    if (property.substring(0, 3) === 'src') {
      property = property.substring(3);
    }

    if (local[attachedId] !== undefined && local[attachedId].hasOwnProperty(
      property)) {
      xCallback(asyncId, local[attachedId][property]);
    } else {
      var placement = parseXml(mockPresetConfig)
        .getElementsByTagName('placement')[0];
      var selected = '[id="' + attachedId + '"]';
      var itemSelected = placement.querySelector(selected);
      xCallback(asyncId, itemSelected.getAttribute(property));
    }

    return asyncId;
  };

  var setLocal = function(property, value) {
    ctr++;
    var asyncId = 'scene_' + ctr;

    if (property.substring(0, 5) === 'prop:') {
      property = property.replace(/^prop:/, '');
    }

    if (local[attachedId] === undefined) {
      local[attachedId] = {};
    }

    local[attachedId][property] = value;
    xCallback(asyncId, '0');
    return asyncId;
  };

  var firstSource;
  var secondSource;

  beforeEach(function(done) {
    env.set(environments.EXTENSION); // for maximum flexibility/functionality

    navigator.__defineGetter__('appVersion', function() {
      return 'XSplit Broadcaster 3.0.1704.2101 ';
    });

    // reset attached IDs
    var source = new XJS.Source({srcId : '{ID}'});
    var source2 = new XJS.Source({srcId : '{ID2}'});

    local = {};

    spyOn(window.external, 'AppGetPropertyAsync')
    .and.callFake(function(funcName) {
      ctr++;
      var asyncId = 'scene_' + ctr;
      if (funcName.startsWith('sceneconfig:{')) {
        xCallback(asyncId, encodeURIComponent(mockPresetConfigScene1));
        return asyncId;
      }

      switch (funcName) {
        case 'sceneconfig:0':
          xCallback(asyncId, encodeURIComponent(mockPresetConfigScene1));
          break;

        case 'sceneconfig':
          xCallback(asyncId, encodeURIComponent(mockPresetConfig));
          break;

        case 'scene:0':
          xCallback(asyncId, '0');
          break;
      }

      return asyncId;
    });

    spyOn(window.external, 'SearchVideoItem')
    .and.callFake(function(id) {
      attachedId = id;
    });

    spyOn(window.external, 'SearchVideoItem2')
    .and.callFake(function(id) {
      attachedId = id;
    });

    spyOn(window.external, 'GetLocalPropertyAsync')
    .and.callFake(getLocal);

    spyOn(window.external, 'GetLocalPropertyAsync2')
    .and.callFake(getLocal);

    spyOn(window.external, 'SetLocalPropertyAsync')
    .and.callFake(setLocal);

    spyOn(window.external, 'SetLocalPropertyAsync2')
    .and.callFake(setLocal);

    if (enumeratedSource.length !== 0) {
      done();
    } else {
      Scene.getActiveScene().then(function(newScene) {
        return newScene.getSources();
      }).then(function(sources) {
        var sourceArray = sources;
        var sourceArrayLength = sourceArray.length;

        if (sourceArrayLength > 0) {
          for (var i = 0; i < sourceArrayLength; i++) {
            if (sourceArray[i] instanceof XJS.Source) {
              enumeratedSource.push(sourceArray[i]);
            }
          }
        }
        firstSource = enumeratedSource[0];
        secondSource = enumeratedSource[1];
        done();
      });
    }
  });

  afterEach(function() {
    navigator.__defineGetter__('appVersion', function() {
      return appVersion;
    });
  });

  it('contains all the necessary scene source methods', function() {
    var methods = [
      'getScene',
      'setScene'
      ].join(',');

    expect(enumeratedSource[0]).hasMethods(methods);
  });

  describe('should be able to get and set scene it references', function() {
    it ('through a promise', function(done) {
      var promise = firstSource.getScene();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it ('as a Scene object', function(done) {
      var sceneString;
      var sceneUsed;

      firstSource.getScene()
      .then(function(scene) {
        expect(scene).toBeInstanceOf(XJS.Scene);
        return XJS.Scene.getBySceneIndex(1);
      }).then(function(scene1) {
        sceneUsed = scene1;
        return sceneUsed.getSceneUid();
      }).then(function(sceneUid) {
        sceneString = sceneUid;
        return firstSource.setScene(sceneUsed);
      }).then(function(sceneUid) {
        return secondSource.setScene(XJS.Scene.liveScene());
      }).then(function() {
        return firstSource.getScene();
      }).then(function(scene2) {
        expect(scene2).toBeInstanceOf(XJS.Scene);
        return scene2.getSceneUid();
      }).then(function(sceneUid1) {
        expect(sceneUid1).toEqual(sceneString);
        return secondSource.getScene()
      }).then(function(scene3) {
        expect(scene3._uid).toEqual('0');
        done();
      })
    });
  });
});
