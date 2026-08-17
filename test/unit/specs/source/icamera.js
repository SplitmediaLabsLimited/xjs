/* globals describe, require, beforeEach, spyOn, it, expect */

describe('CameraSource interface', function() {
  'use strict';

  var XJS = require('xjs');
  var Scene = XJS.Scene;
  var mockPresetConfig = '<placement name="Scene 1" id="{57801D3E-0EF3-44A3-8EDD-5B227F3A5A24}" preset_id="{00000000-0000-0000-0000-000000000000}" preset_trtime="500" preset_trfunc="" defpos="1" trid="" trtime="500"><item pos_left="0.000000000e+00" pos_top="0.000000000e+00" pos_right="1.000000000e+00" pos_bottom="1.000000000e+00" pos_an="1" crop_left="0.000000000e+00" crop_top="0.000000000e+00" crop_right="0.000000000e+00" crop_bottom="0.000000000e+00" crop_an="1" pixalign="0" zorder="0" lockmove="0" keep_ar="1" visible="1" visible_an="1" alpha="255" alpha_an="1" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="1" cc_brightness_an="1" cc_contrast_an="1" cc_hue_an="1" cc_saturation_an="1" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" pan="0" pan_config="R:1.000000000e+00&amp;la:0.000000000e+00&amp;fi:0.000000000e+00" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" rotate_x_an="1" rotate_y_an="1" offset_x="0.000000000e+00" offset_y="0.000000000e+00" ShowPosition="0" OverlayURL="" OverlayConfig="" transitionid="" transitiontime="300" trscenter="0" trscexit="0" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{D3DD19CE-1A9D-4F70-AEEB-B046B09B240C}" srcid="{08B6197B-07F7-42F1-B0F8-572FD2AC136F}" type="2" name="Logi Capture" cname="" item="@DEVICE:SW:{860BB310-5D01-11D0-BD3B-00A0C911CE86}\\{4A2FEA90-B0A0-438E-8BC3-D84157660D0A}" itemaudio="" volume="100" mute="0" keepaudio="0" sounddev="0" mipmaps="0" autoresdet="1" keeploaded="1" RefreshOnScnLoad="0" RefreshOnSrcShow="0" zoom="l:0.000000000e+00|t:0.000000000e+00|r:1.000000000e+00|b:1.000000000e+00" or_enable="0" or_mode="0" or_angle="0" cc_pin="0" key_pin="0" edgeeffect_pin="0" effects_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:9.700000286e-01&amp;str:8.999999762e-01&amp;rad:7.000000030e-02&amp;color:2155905152&amp;trail:0.000000000e+00&amp;filtering:0.000000000e+00&amp;fill:0" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" LiveDetectSignal="1" CuePoints="" FilePlaylist="" fdeinterlace="0" InPoint="0" OutPoint="0" OpWhenFinished="0" StartOnLoad="1" StartOnSrcShow="0" RememberPosition="1" LastPosition="0" LastRunState="1" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture1="1" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapEnc="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapFrameTimeLimit="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserCookiePath="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookieFlags="0" Browser60fps="0" BrowserZoom="1.000000000e+00" SwfWrapper="1" DllGrant="" custom=""><presproperty __map_id="logitechcanrecommend">0</presproperty><presproperty __map_id="resetcamitemaudio">1</presproperty><presproperty __map_id="xsplitautoset">1</presproperty></item><item pos_left="6.250000000e-01" pos_top="5.625000000e-01" pos_right="1.000000000e+00" pos_bottom="1.062500000e+00" pos_an="1" crop_left="0.000000000e+00" crop_top="0.000000000e+00" crop_right="0.000000000e+00" crop_bottom="0.000000000e+00" crop_an="1" pixalign="0" zorder="1" lockmove="0" keep_ar="1" visible="1" visible_an="1" alpha="255" alpha_an="1" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="1" cc_brightness_an="1" cc_contrast_an="1" cc_hue_an="1" cc_saturation_an="1" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" pan="0" pan_config="R:1.000000000e+00&amp;la:0.000000000e+00&amp;fi:0.000000000e+00" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" rotate_x_an="1" rotate_y_an="1" offset_x="0.000000000e+00" offset_y="0.000000000e+00" ShowPosition="0" OverlayURL="" OverlayConfig="" transitionid="" transitiontime="300" trscenter="0" trscexit="0" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{AE124704-9032-4330-BC6F-C47F5C638390}" srcid="{54F04C0E-FD24-4775-8C7C-2FAFA8692A60}" type="2" name="Logitech HD Pro Webcam C920" cname="" item="@device:pnp:\\\\?\\usb#vid_046d&amp;pid_082d&amp;mi_00#7&amp;27db7482&amp;0&amp;0000#{65e8773d-8f56-11d0-a3b9-00a0c9223196}\\{bbefb6c7-2fc4-4139-bb8b-a58bba724083}" itemaudio="@device:cm:{33D9A762-90C8-11D0-BD43-00A0C911CE86}\\wave:{311BB428-C203-49B3-B1D6-E888603D03EA}" volume="100" mute="0" keepaudio="0" sounddev="0" mipmaps="0" autoresdet="1" keeploaded="1" RefreshOnScnLoad="0" RefreshOnSrcShow="0" zoom="l:0.000000000e+00|t:0.000000000e+00|r:1.000000000e+00|b:1.000000000e+00" or_enable="0" or_mode="0" or_angle="0" cc_pin="0" key_pin="0" edgeeffect_pin="0" effects_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:9.700000286e-01&amp;str:8.999999762e-01&amp;rad:7.000000030e-02&amp;color:2155905152&amp;trail:0.000000000e+00&amp;filtering:0.000000000e+00&amp;fill:0" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" LiveDetectSignal="1" CuePoints="" FilePlaylist="" fdeinterlace="0" InPoint="0" OutPoint="0" OpWhenFinished="0" StartOnLoad="1" StartOnSrcShow="0" RememberPosition="1" LastPosition="0" LastRunState="1" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture1="1" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapEnc="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapFrameTimeLimit="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserCookiePath="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookieFlags="0" Browser60fps="0" BrowserZoom="1.000000000e+00" SwfWrapper="1" DllGrant="" custom=""><presproperty __map_id="logautoset">1</presproperty><presproperty __map_id="logautostatus">success_changed</presproperty><presproperty __map_id="logitechcanrecommend">1</presproperty><presproperty __map_id="resetcamitemaudio">1</presproperty></item><item pos_left="0.000000000e+00" pos_top="0.000000000e+00" pos_right="5.000000000e-01" pos_bottom="5.000000000e-01" pos_an="1" crop_left="0.000000000e+00" crop_top="0.000000000e+00" crop_right="0.000000000e+00" crop_bottom="0.000000000e+00" crop_an="1" pixalign="0" zorder="0" lockmove="0" keep_ar="1" visible="1" visible_an="1" alpha="255" alpha_an="1" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="1" cc_brightness_an="1" cc_contrast_an="1" cc_hue_an="1" cc_saturation_an="1" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" pan="0" pan_config="R:1.000000000e+00&amp;la:0.000000000e+00&amp;fi:0.000000000e+00" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" rotate_x_an="1" rotate_y_an="1" offset_x="0.000000000e+00" offset_y="0.000000000e+00" ShowPosition="0" OverlayURL="" OverlayConfig="" transitionid="" transitiontime="300" trscenter="0" trscexit="0" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{BD0DF460-87ED-4F65-8FA5-83467C62C1D4}" srcid="{EEB3A59E-7CA1-4E9F-9C37-28394108EB47}" type="2" name="Hauppauge Siena Video Capture" cname="" item="@DEVICE:PNP:\\\\?\\USB#VID_2040&amp;PID_E504#E524-00-00AC46B7#{65E8773D-8F56-11D0-A3B9-00A0C9223196}\\{9B365890-165F-11D0-A195-0020AFD156E4}" itemaudio="" volume="100" mute="0" keepaudio="0" sounddev="0" mipmaps="0" autoresdet="1" keeploaded="0" RefreshOnScnLoad="0" RefreshOnSrcShow="0" zoom="l:0.000000000e+00|t:0.000000000e+00|r:1.000000000e+00|b:1.000000000e+00" or_enable="0" or_mode="0" or_angle="0" cc_pin="0" key_pin="0" edgeeffect_pin="0" effects_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:9.700000286e-01&amp;str:8.999999762e-01&amp;rad:7.000000030e-02&amp;color:2155905152&amp;trail:0.000000000e+00&amp;filtering:0.000000000e+00&amp;fill:0" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" LiveDetectSignal="1" CuePoints="" FilePlaylist="" fdeinterlace="0" InPoint="0" OutPoint="0" OpWhenFinished="0" StartOnLoad="1" StartOnSrcShow="0" RememberPosition="1" LastPosition="0" LastRunState="-1" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture1="1" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapEnc="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapFrameTimeLimit="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserCookiePath="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookieFlags="0" Browser60fps="0" BrowserZoom="1.000000000e+00" SwfWrapper="1" DllGrant="" custom=""><presproperty __map_id="logitechcanrecommend">0</presproperty><presproperty __map_id="xsplitautoset">1</presproperty></item><item pos_left="0.000000000e+00" pos_top="0.000000000e+00" pos_right="5.000000000e-01" pos_bottom="5.000000000e-01" pos_an="1" crop_left="0.000000000e+00" crop_top="0.000000000e+00" crop_right="0.000000000e+00" crop_bottom="0.000000000e+00" crop_an="1" pixalign="0" zorder="2" lockmove="0" keep_ar="1" visible="1" visible_an="1" alpha="255" alpha_an="1" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="1" cc_brightness_an="1" cc_contrast_an="1" cc_hue_an="1" cc_saturation_an="1" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" pan="0" pan_config="R:1.000000000e+00&amp;la:0.000000000e+00&amp;fi:0.000000000e+00" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" rotate_x_an="1" rotate_y_an="1" offset_x="0.000000000e+00" offset_y="0.000000000e+00" ShowPosition="0" OverlayURL="" OverlayConfig="" transitionid="" transitiontime="300" trscenter="0" trscexit="0" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{40E2F0BE-5E98-41AC-A0E6-61617BEAD216}" srcid="{C98CC42E-7C52-4BB7-8DA4-ECB00DABA5B1}" type="2" name="Elgato Game Capture HD" cname="" item="clsid:{39F50F4C-99E1-464A-B6F9-D605B4FB5918}" itemaudio="" volume="100" mute="0" keepaudio="0" sounddev="0" mipmaps="0" autoresdet="1" keeploaded="1" RefreshOnScnLoad="0" RefreshOnSrcShow="0" zoom="l:0.000000000e+00|t:0.000000000e+00|r:1.000000000e+00|b:1.000000000e+00" or_enable="0" or_mode="0" or_angle="0" cc_pin="0" key_pin="0" edgeeffect_pin="0" effects_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:9.700000286e-01&amp;str:8.999999762e-01&amp;rad:7.000000030e-02&amp;color:2155905152&amp;trail:0.000000000e+00&amp;filtering:0.000000000e+00&amp;fill:0" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" LiveDetectSignal="1" CuePoints="" FilePlaylist="" fdeinterlace="0" InPoint="0" OutPoint="0" OpWhenFinished="0" StartOnLoad="1" StartOnSrcShow="0" RememberPosition="1" LastPosition="0" LastRunState="1" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture1="1" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapEnc="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapFrameTimeLimit="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserCookiePath="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookieFlags="0" Browser60fps="0" BrowserZoom="1.000000000e+00" SwfWrapper="1" DllGrant="" custom=""><presproperty __map_id="logitechcanrecommend">0</presproperty><presproperty __map_id="resetcamitemaudio">1</presproperty><presproperty __map_id="xsplitautoset">1</presproperty></item></placement>';
  var mockDShowEnumASrc = '<list><dev disp="@device:cm:{33D9A762-90C8-11D0-BD43-00A0C911CE86}\\wave:{701829C0-D1F3-4E70-8DE9-E9CE5853BA16}" name="Microphone (2- Logitech USB Headset H340)" WaveInId="0" EndpointGuid="{701829C0-D1F3-4E70-8DE9-E9CE5853BA16}" EndpointId="{0.0.1.00000000}.{701829c0-d1f3-4e70-8de9-e9ce5853ba16}" DecklinkDev="USB Composite Device"/><dev disp="@device:cm:{33D9A762-90C8-11D0-BD43-00A0C911CE86}\\wave:{76CB6396-4A11-4D89-9478-6DC381BA64EF}" name="Microphone (DroidCam Virtual Audio)" WaveInId="3" EndpointGuid="{76CB6396-4A11-4D89-9478-6DC381BA64EF}" EndpointId="{0.0.1.00000000}.{76cb6396-4a11-4d89-9478-6dc381ba64ef}"/><dev disp="@device:cm:{33D9A762-90C8-11D0-BD43-00A0C911CE86}\\wave:{311BB428-C203-49B3-B1D6-E888603D03EA}" name="Microphone (HD Pro Webcam C920)" WaveInId="1" EndpointGuid="{311BB428-C203-49B3-B1D6-E888603D03EA}" EndpointId="{0.0.1.00000000}.{311bb428-c203-49b3-b1d6-e888603d03ea}" DecklinkDev="Logitech USB Camera (HD Pro Webcam C920)"/><dev disp="@device:cm:{33D9A762-90C8-11D0-BD43-00A0C911CE86}\\wave:{357DA48D-B9BB-4A54-A3DE-DE6D3F9AD19D}" name="MIDI (Elgato Sound Capture)" WaveInId="2" EndpointGuid="{357DA48D-B9BB-4A54-A3DE-DE6D3F9AD19D}" EndpointId="{0.0.1.00000000}.{357da48d-b9bb-4a54-a3de-de6d3f9ad19d}"/><dev disp="@device:sw:{33D9A762-90C8-11D0-BD43-00A0C911CE86}\\{VHSplitProc}_XSplitBroadcaster_1_staticsource_AUDIO" name="XSplitBroadcaster"/></list>';
  var mockDShowEnumASrcIncomplete = '<list><dev disp="@device:cm:{33D9A762-90C8-11D0-BD43-00A0C911CE86}\\wave:{701829C0-D1F3-4E70-8DE9-E9CE5853BA16}" name="Microphone (2- Logitech USB Headset H340)" WaveInId="0" EndpointGuid="{701829C0-D1F3-4E70-8DE9-E9CE5853BA16}" EndpointId="{0.0.1.00000000}.{701829c0-d1f3-4e70-8de9-e9ce5853ba16}" DecklinkDev="USB Composite Device"/><dev disp="@device:cm:{33D9A762-90C8-11D0-BD43-00A0C911CE86}\\wave:{76CB6396-4A11-4D89-9478-6DC381BA64EF}" name="Microphone (DroidCam Virtual Audio)" WaveInId="3" EndpointGuid="{76CB6396-4A11-4D89-9478-6DC381BA64EF}" EndpointId="{0.0.1.00000000}.{76cb6396-4a11-4d89-9478-6dc381ba64ef}"/><dev disp="@device:cm:{33D9A762-90C8-11D0-BD43-00A0C911CE86}\\wave:{357DA48D-B9BB-4A54-A3DE-DE6D3F9AD19D}" name="MIDI (Elgato Sound Capture)" WaveInId="2" EndpointGuid="{357DA48D-B9BB-4A54-A3DE-DE6D3F9AD19D}" EndpointId="{0.0.1.00000000}.{357da48d-b9bb-4a54-a3de-de6d3f9ad19d}"/><dev disp="@device:sw:{33D9A762-90C8-11D0-BD43-00A0C911CE86}\\{VHSplitProc}_XSplitBroadcaster_1_staticsource_AUDIO" name="XSplitBroadcaster"/></list>';
  var audioInputNotFound = false;

  var local = {};
  var attachedId;
  var enumeratedSource = [];
  var shouldFailHWCheck = false;
  var isCamActive = true;

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
    var asyncId = 'icamera_' + ctr;

    if (property.substring(0, 5) === 'prop:') {
      property = property.replace(/^prop:/, '');
    }
    if (property.substring(0, 3) === 'src') {
      property = property.substring(3);
    }

    if (property === 'resolution') {
      xCallback(asyncId, '1080,720');
    } else if (property === 'audioavail') {
      xCallback(asyncId, '1');
    } else if (property === 'activestate') {
      xCallback(asyncId, isCamActive ? 'active' : 'not_present');
    } else if (property === 'hwencoder') {
      xCallback(asyncId, String(Number(!shouldFailHWCheck)));
    } else if (local[attachedId] !== undefined && local[attachedId] && local[attachedId].hasOwnProperty(
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
    var asyncId = 'icamera_' + ctr;

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
  var thirdSource;

  beforeEach(function(done) {
    env.set(environments.EXTENSION); // for maximum flexibility/functionality

    navigator.__defineGetter__('appVersion', function() {
      return 'XSplit Broadcaster 2.7.1702.2231 ';
    });

    // reset attached IDs
    var source = new XJS.Source({srcId : '{ID}'});
    var source2 = new XJS.Source({srcId : '{ID2}'});

    local = {};

    spyOn(window.external, 'AppGetPropertyAsync')
    .and.callFake(function(funcName) {
      ctr++;
    var asyncId = 'icamera_' + ctr;
      switch (funcName) {
        case 'sceneconfig:0':
          xCallback(asyncId, encodeURIComponent(mockPresetConfig));
          break;

        case 'sceneconfig':
          xCallback(asyncId, encodeURIComponent(mockPresetConfig));
          break;

        case 'scene:0':
          xCallback(asyncId, '0');
          break;

        case 'dshowenum:asrc':
          if (audioInputNotFound) {
            xCallback(asyncId, encodeURIComponent(mockDShowEnumASrcIncomplete));
          } else {
            xCallback(asyncId, encodeURIComponent(mockDShowEnumASrc));
          }
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
        thirdSource = enumeratedSource[2];
        done();
      });
    }
  });

  afterEach(function() {
    navigator.__defineGetter__('appVersion', function() {
      return appVersion;
    });
  });

  it('contains all the necessary camera methods', function() {
    var methods = [
      'getDeviceId',
      'getAudioOffset',
      'setAudioOffset',
      'getAudioInput',
      'setAudioInput',
      'isStreamPaused',
      'setStreamPaused',
      'isHardwareEncoder',
      'isActive',
      'getDelay',
      'setDelay',
      'isForceDeinterlace',
      'setForceDeinterlace'
      ].join(',');

    expect(enumeratedSource[0]).hasMethods(methods);
  });

  describe('should be able to get device ID', function() {
    it ('through a promise', function(done) {
      var promise = firstSource.getDeviceId();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it ('as a string', function(done) {
      firstSource.getDeviceId()
      .then(function(device1) {
        var encoded = encodeURIComponent(device1);
        var type = typeof device1;
        expect(type).toEqual('string');
        return secondSource.getDeviceId();
      }).then(function(device2) {
        var type = typeof device2;
        expect(type).toEqual('string');
        done();
      });
    });
  });

  describe('should be able to get camera resolution', function() {
    it ('through a promise', function(done) {
      var promise = firstSource.getResolution();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it ('as a rectangle', function(done) {
      firstSource.getResolution()
      .then(function(resolution) {
        expect(resolution).toBeInstanceOf(XJS.Rectangle);
        done();
      });
    });
  });

  describe('should be able to get and set audio offset', function() {
    it ('through a promise', function(done) {
      var promise = firstSource.getAudioOffset();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it ('as a number', function(done) {
      var firstRand = randomInt();
      var secondRand = randomInt();
      firstSource.setAudioOffset(firstRand)
      .then(function() {
        return secondSource.setAudioOffset(secondRand);
      }).then(function() {
        return firstSource.getAudioOffset();
      }).then(function(audioOffset1) {
        expect(audioOffset1).toBeTypeOf('number');
        expect(audioOffset1).toEqual(firstRand);
        return secondSource.getAudioOffset();
      }).then(function(audioOffset2) {
        expect(audioOffset2).toBeTypeOf('number');
        expect(audioOffset2).toEqual(secondRand);
        done();
      })
    });
  });

  describe('should be able to get and set audio input', function() {
    it ('through a promise', function(done) {
      var promise = secondSource.getAudioInput();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it ('as a microphone device', function(done) {
      secondSource.getAudioInput()
      .then(function(audioInput) {
        expect(audioInput).toBeInstanceOf(XJS.MicrophoneDevice);
        done();
      })
    });

    it ('which rejects when no audio input tied', function(done) {
      firstSource.getAudioInput()
      .then(function(audioInput) {
        done.fail('No audio input tied should reject');
      }).catch(function(err) {
        expect(err).toEqual(jasmine.any(Error));
        return XJS.System.getMicrophones();
      }).then(function(mics) {
        return firstSource.setAudioInput(mics[0]);
      }).then(function() {
        return firstSource.getAudioInput();
      }).then(function(newAudioInput) {
        expect(newAudioInput).toBeInstanceOf(XJS.MicrophoneDevice);
        done();
      });
    });

    it ('which rejects when tied audio input is not present', function(done) {
      audioInputNotFound = true;
      secondSource.getAudioInput()
      .then(function(audioInput) {
        done.fail('Tied audio input not found should reject');
      }).catch(function(err) {
        expect(err).toEqual(jasmine.any(Error));
        done();
      });
    });
  });

  describe('should be able to get and set stream pause state', function() {
    var randomBool = randomBoolean();
    it ('through a promise', function(done) {
      var promise = firstSource.setStreamPaused(randomBool);
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it ('as a boolean', function(done) {
      firstSource.setStreamPaused(randomBool)
      .then(function() {
        return firstSource.isStreamPaused();
      }).then(function(isPaused) {
        expect(isPaused).toBe(randomBool);
        return firstSource.setStreamPaused(!randomBool);
      }).then(function() {
        return firstSource.isStreamPaused();
      }).then(function(isPaused) {
        expect(isPaused).toBe(!randomBool);
        done();
      });
    });
  });

  describe('should be able to get hardware encoding capability and active state', function() {
    it ('through a promise', function(done) {
      var promise = firstSource.isHardwareEncoder();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it ('as a boolean', function(done) {
      firstSource.isActive()
      .then(function(isActive) {
        expect(isActive).toBeTypeOf('boolean');
        return firstSource.isHardwareEncoder()
      }).then(function(isHwEncoder) {
        expect(isHwEncoder).toBeTypeOf('boolean');
        done();
      });
    });

    it ('which rejects if device hardware encoding capability cannot be determined due to absence', function(done) {
      firstSource.isHardwareEncoder()
      .then(function(isHwEncoder) {
        expect(isHwEncoder).toBe(true);
        shouldFailHWCheck = true;
        return firstSource.isHardwareEncoder();
      }).then(function(isHwEncoder) {
        expect(isHwEncoder).toBe(false);
        isCamActive = false;
        return firstSource.isHardwareEncoder();
      }).then(function() {
        done.fail('It should reject if hw encoding capability cannot be determined due to absence');
      }).catch(function(err) {
        expect(err).toEqual(jasmine.any(Error));
        done();
      });
    });
  });

  describe('should be able to get and set delay', function() {
    it ('through a promise', function(done) {
      var promise = firstSource.getDelay();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it ('as a number', function(done) {
      shouldFailHWCheck = true;
      isCamActive = true;
      var firstRand = randomInt();
      var secondRand = randomInt();
      firstSource.setDelay(firstRand)
      .then(function() {
        return secondSource.setDelay(secondRand);
      }).then(function() {
        return firstSource.getDelay();
      }).then(function(delay1) {
        expect(delay1).toBeTypeOf('number');
        expect(delay1).toEqual(firstRand);
        return secondSource.getDelay();
      }).then(function(delay2) {
        expect(delay2).toBeTypeOf('number');
        expect(delay2).toEqual(secondRand);
        done();
      })
    });

    // if this fails, please first check if the expected value corresponds to the supplied mock configuration
    it ('which rejects when setting to invalid sources', function(done) {
      shouldFailHWCheck = true;
      isCamActive = true;
      var randomNumber = randomInt();
      thirdSource.setDelay(randomNumber)
      .then(function() {
        done.fail('It should reject if source is explicitly tagged not to support delay');   
      }).catch(function(err) {
        expect(err).toEqual(jasmine.any(Error));
        done();
      })
    });
  });

  describe('should be able to get and set forced deinterlace state', function() {
    var randomBool = randomBoolean();
    it ('through a promise', function(done) {
      var promise = firstSource.setForceDeinterlace(randomBool);
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it ('as a boolean', function(done) {
      firstSource.setForceDeinterlace(randomBool)
      .then(function() {
        return firstSource.isForceDeinterlace();
      }).then(function(isForcedDeinterlace) {
        expect(isForcedDeinterlace).toBe(randomBool);
        return firstSource.setForceDeinterlace(!randomBool);
      }).then(function() {
        return firstSource.isForceDeinterlace();
      }).then(function(isForcedDeinterlace) {
        expect(isForcedDeinterlace).toBe(!randomBool);
        done();
      });
    });
  });
});
