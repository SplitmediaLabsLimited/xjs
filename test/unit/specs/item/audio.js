/* globals describe, it, expect, require, beforeEach, spyOn */

describe('AudioItem', function() {
  'use strict';

  var XJS = require('xjs');
  var ctr = 0;

  beforeEach(function(done) {
    if (!/xsplit broadcaster/ig.test(navigator.appVersion)) {
      env.set('script');
      spyOn(window.external, 'AppGetPropertyAsync')
        .and.callFake(function(funcName) {
        ctr++;
        switch (funcName) {
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

      spyOn(window.external, 'GetLocalPropertyAsync')
        .and.callFake(function(propName) {
        ctr++;
        switch (propName) {
          case 'prop:AudioGainEnable':
            setTimeout(function() {
              window.OnAsyncCallback(ctr, '1');
            }, 10);
          break;

          case 'prop:AudioGain':
            setTimeout(function() {
              window.OnAsyncCallback(ctr, 5);
            }, 10);
          break;

          case 'prop:AudioGainLatency':
            setTimeout(function() {
              window.OnAsyncCallback(ctr, 50);
            }, 10);
          break;
        }

        return ctr;
      });

      spyOn(window.external, 'SetLocalPropertyAsync')
        .and.callFake(function(propName) {
        ctr++;
        switch (propName) {
          case 'prop:AudioGainEnable':
            setTimeout(function() {
              window.OnAsyncCallback(ctr, '1');
            }, 10);
          break;

          case 'prop:AudioGain':
            setTimeout(function() {
              window.OnAsyncCallback(ctr, '1');
            }, 10);
          break;

          case 'prop:AudioGainLatency':
            setTimeout(function() {
              window.OnAsyncCallback(ctr, '1');
            }, 10);
          break;
        }

        return ctr;
      });
    }

    var _this = this;
    XJS.Scene.getActiveScene().then(function(scene) {
      scene.getItems().then(function(items) {
        for (var i in items) {
          if (items[i] instanceof XJS.AudioItem) {
            _this.audioItem = items[i];
            done();
          }
        }
      });
    });
  });

  it('should be able to get silence detection', function(done) {
    this.audioItem.isSilenceDetection().then(function(bool) {
      expect(bool).toBeBoolean();
      done();
    });
  });

  it('should be able to set silence detection', function(done) {
    var promise = this.audioItem.setSilenceDetection(true);
    expect(promise).toBeInstanceOf(Promise);
    promise.then(function(bool) {
      expect(bool).toBeTruthy();
      done();
    });
  });

  it('should be able to get the silence threshold', function(done) {
    this.audioItem.getSilenceThreshold().then(function(val) {
      expect(val).toBeTypeOf('number');
      expect(val).not.toBeNaN();
      done();
    });
  });

  describe('should be able to set the silence threshold', function() {
    it('as a number', function(done) {
      var promise = this.audioItem.setSilenceThreshold(5);
      expect(promise).toBeInstanceOf(Promise);
      promise.then(function(bool) {
        expect(bool).toBeTruthy();
        done();
      });
    });

    it('not lower than 0', function(done) {
      this.audioItem.setSilenceThreshold(-1).then(function() {
        done.fail('Invalid value was accepted');
      }).catch(function(err) {
        expect(err).toEqual(jasmine.any(Error));
        done();
      });
    });

    it('not higher than 128', function(done) {
      this.audioItem.setSilenceThreshold(129).then(function() {
        done.fail('Invalid value was accepted');
      }).catch(function(err) {
        expect(err).toEqual(jasmine.any(Error));
        done();
      });
    });

    it('not a decimal', function(done) {
      this.audioItem.setSilenceThreshold(5.5).then(function() {
        done.fail('Invalid value was accepted');
      }).catch(function(err) {
        expect(err).toEqual(jasmine.any(Error));
        done();
      });
    });

    it('not a alphanumeric string', function(done) {
      this.audioItem.setSilenceThreshold('asdf').then(function() {
        done.fail('Invalid value was accepted');
      }).catch(function(err) {
        expect(err).toEqual(jasmine.any(Error));
        done();
      });
    });
  });

  describe('should be able to set the silence period', function() {
    it('as a number', function(done) {
      var promise = this.audioItem.setSilenceThreshold(50);
      expect(promise).toBeInstanceOf(Promise);
      promise.then(function(bool) {
        expect(bool).toBeTruthy();
        done();
      });
    });

    it('not lower than 0', function(done) {
      this.audioItem.setSilenceThreshold(-1).then(function() {
        done.fail('Invalid value was accepted');
      }).catch(function(err) {
        expect(err).toEqual(jasmine.any(Error));
        done();
      });
    });

    it('not higher than 10000', function(done) {
      this.audioItem.setSilenceThreshold(10001).then(function() {
        done.fail('Invalid value was accepted');
      }).catch(function(err) {
        expect(err).toEqual(jasmine.any(Error));
        done();
      });
    });

    it('not a decimal', function(done) {
      this.audioItem.setSilenceThreshold(50.5).then(function() {
        done.fail('Invalid value was accepted');
      }).catch(function(err) {
        expect(err).toEqual(jasmine.any(Error));
        done();
      });
    });

    it('not a alphanumeric string', function(done) {
      this.audioItem.setSilenceThreshold('asdf').then(function() {
        done.fail('Invalid value was accepted');
      }).catch(function(err) {
        expect(err).toEqual(jasmine.any(Error));
        done();
      });
    });
  });

  describe('interface method checking', function() {

    it('should implement audio interface', function() {
      expect(this.audioItem).hasMethods([
        'isMute',
        'setMute',
        'getVolume',
        'setVolume',
        'getAudioDelay',
        'setAudioDelay',
        'getAudioOutput',
        'setAudioOutput'
      ].join(','));
    });
  });
});
