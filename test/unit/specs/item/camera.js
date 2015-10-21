/* globals describe, it, expect, require, beforeEach, spyOn */

describe('CameraItem', function() {
  'use strict';

  var XJS = require('xjs');
  var env = new window.Environment(XJS);
  var ctr;

  beforeEach(function(done) {
    if (!/xsplit broadcaster/ig.test(navigator.appVersion)) {
      env.set('script');
      // Reset the attached IDS
      var item1 = new XJS.Item({id : '{CAMERAID}' });
      var item2 = new XJS.Item({id : '{CAMERAID2}'});
      item1.getType();
      item2.getType();

      spyOn(window.external, 'AppGetPropertyAsync')
        .and.callFake(function(funcName) {
        ctr++;
        switch (funcName) {
          case 'dshowenum:vsrc':
            setTimeout(function() {
              window.OnAsyncCallback(ctr, '<list><dev disp="clsid:{39F50F4C-99E1-464A-B6F9-D605B4FB5918}" name="Elgato Game Capture HD"/><dev disp="@device:pnp:\\\\?\\usb#vid_046d&amp;pid_082c&amp;mi_02#6&amp;37c59c5d&amp;0&amp;0002#{65e8773d-8f56-11d0-a3b9-00a0c9223196}\\global" name="HD Webcam C615"/></list>');
            }, 10);
          break;

          case 'preset:0':
            setTimeout(function() {
              window.OnAsyncCallback(ctr, '0');
            }, 10);
          break;

          default:
            if (funcName.indexOf('presetconfig:') !== -1) {
              setTimeout(function() {
                window.OnAsyncCallback(ctr, encodeURIComponent('<placement name="Work Scene" defpos="0"><item type="2" item="@device:cm:{33D9A762-90C8-11D0-BD43-00A0C911CE86}\Microphone (5- Logitech USB Hea" itemaudio="" name="Microphone (5- Logitech USB Hea" cname="" pos_left="0.000000" pos_top="0.500000" pos_right="0.500000" pos_bottom="1.000000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="0" volume="100" mute="0" sounddev="1" lockmove="0" keep_ar="1" fdeinterlace="0" mipmaps="0" autoresdet="1" visible="1" keeploaded="1" alpha="255" border="0" cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="1" key_pin="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" key_smartcamenable="0" key_smartcamconfig="" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" syncid0="136616549" syncid1="1280476358" syncid2="3579510198" syncid3="2848617205" id="{CB4EB352-D86F-4478-8BFD-55FF53216697}" StreamDelay="0" AudioDelay="0" AudioGainEnable="1" AudioGain="5" AudioGainLatency="0" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="1" GameCapPlSmoothness="1.000000" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" custom=""/><item type="8" item="http://repo.dev" itemaudio="" name="http://repo.dev" cname="" pos_left="0.500000" pos_top="0.500000" pos_right="1.000000" pos_bottom="1.000000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="1" volume="100" mute="0" sounddev="0" lockmove="0" keep_ar="1" fdeinterlace="0" mipmaps="0" autoresdet="1" visible="1" keeploaded="0" alpha="255" border="0" cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_pin="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" key_smartcamenable="0" key_smartcamconfig="" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" syncid0="2991991585" syncid1="1266732367" syncid2="2115964573" syncid3="2487861362" id="{8CE59BE8-6D70-4A79-9FFE-0FBA22EC4A4B}" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="1" GameCapPlSmoothness="1.000000" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" custom=""/><item type="2" item="@DEVICE:PNP:\\?\USB#VID_046D&amp;PID_082C&amp;MI_02#6&amp;16FD2F8D&amp;0&amp;0002#{65E8773D-8F56-11D0-A3B9-00A0C9223196}\GLOBAL" itemaudio="" name="HD Webcam C615" cname="" pos_left="0.786237" pos_top="0.000000" pos_right="1.000000" pos_bottom="0.285156" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="2" volume="100" mute="0" sounddev="0" lockmove="0" keep_ar="1" fdeinterlace="0" mipmaps="0" autoresdet="1" visible="1" keeploaded="0" alpha="255" border="0" cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="1" key_pin="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" key_smartcamenable="0" key_smartcamconfig="" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" syncid0="3358421231" syncid1="1080907201" syncid2="134476455" syncid3="2508986164" id="{24E610F4-30AC-4AAC-B8B1-F8B57AF77759}" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="1" GameCapPlSmoothness="1.000000" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" custom=""/></placement>'));
              }, 10);
            }
        }

        return ctr;
      });
    }

    var _this = this;
    XJS.Scene.getActiveScene().then(function(scene) {
      scene.getItems().then(function(items) {
        for (var i in items) {
          if (items[i] instanceof XJS.CameraItem) {
            _this.cameraItem = items[i];
            done();
          }
        }
      });
    });
  });

  describe('interface method checking', function() {

    it('should implement the layout interface', function() {
      expect(this.cameraItem).hasMethods([
        'isKeepAspectRatio',
        'setKeepAspectRatio',
        'isPositionLocked',
        'setPositionLocked',
        'isEnhancedResizeEnabled',
        'setEnhancedResizeEnabled',
        'getPosition',
        'setPosition'
        ].join(','));
    });

    it('should implement the color interface', function() {
      expect(this.cameraItem).hasMethods([
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
        'setBorderColor'
        ].join(','));
    });

    it('should implement the chroma interface', function() {
      expect(this.cameraItem).hasMethods([
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
      expect(this.cameraItem).hasMethods([
        'isVisible',
        'setVisible',
        'getTransition',
        'setTransition',
        'getTransitionTime',
        'setTransitionTime'
        ].join(','));
    });

    it('should have color and chroma key options pinning', function() {
      expect(this.cameraItem).hasMethods([
        'setColorOptionsPinned',
        'getColorOptionsPinned',
        'setKeyingOptionsPinned',
        'getKeyingOptionsPinned'
        ].join(','));
    });

    it('should implement the transition interface', function() {
      expect(this.cameraItem).hasMethods([
        'isVisible',
        'setVisible',
        'getTransition',
        'setTransition',
        'getTransitionTime',
        'setTransitionTime'
        ].join(','));
    });
  });
});
