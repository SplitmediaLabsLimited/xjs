/* globals describe, require, beforeEach, spyOn, it, expect */

describe('VideoPlaylist Source interface', function() {
  'use strict';

  var XJS = require('xjs');
  var Scene = XJS.Scene;
  var mockPresetConfig = '<placement name="Scene 1" id="{219DB767-BE5B-4389-90C2-E712F08EA2CC}" defpos="0"><item pos_left="0.229290" pos_top="0.250000" pos_right="0.729290" pos_bottom="0.750000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="0" lockmove="0" keep_ar="1" visible="1" alpha="255" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="1" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" pan="0" pan_config="R:1.000000&amp;la:0.000000&amp;fi:0.000000" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" trscenter="0" trscexit="0" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{39C903DB-0FA5-401A-A504-E5B66F018429}" srcid="{CBD1F06D-109E-4FCF-897F-91182529C486}" type="1" name="Video Playlist" cname="" item="D:\\Files\\Recordings\\2017-08-14_17-19-13.mp4*0" itemaudio="" volume="100" mute="0" keepaudio="0" sounddev="0" fdeinterlace="0" mipmaps="0" autoresdet="1" keeploaded="0" cc_pin="0" key_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:0.970000&amp;str:0.900000&amp;rad:0.070000&amp;color:2155905152&amp;trail:0.000000&amp;filtering:0.000000&amp;fill:0" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" LiveDetectSignal="1" InPoint="0" OutPoint="0" CuePoints="0" FilePlaylist="D:\\Files\\Recordings\\2017-08-14_17-19-13.mp4*0*1*79000000*100*0*0*0*0*0|D:\\Files\\Recordings\\2017-08-14_17-20-23.mp4*1*1*37330000*100*0*0*0*0*0|D:\\Files\\Recordings\\2017-08-14_20-06-53.mp4*2*1*26330000*100*0*0*0*0*0" OpWhenFinished="0" StartOnLoad="1" StartOnSrcShow="0" RememberPosition="1" LastPosition="13721046" LastRunState="1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" DllGrant="" custom="" /><item pos_left="5.000000000e-01" pos_top="0.000000000e+00" pos_right="1.000000000e+00" pos_bottom="5.000000000e-01" pos_an="1" crop_left="0.000000000e+00" crop_top="0.000000000e+00" crop_right="0.000000000e+00" crop_bottom="0.000000000e+00" crop_an="1" pixalign="0" zorder="0" lockmove="0" keep_ar="1" visible="1" visible_an="1" alpha="255" alpha_an="1" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="1" cc_brightness_an="1" cc_contrast_an="1" cc_hue_an="1" cc_saturation_an="1" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" pan="0" pan_config="R:1.000000000e+00&amp;la:0.000000000e+00&amp;fi:0.000000000e+00" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" rotate_x_an="1" rotate_y_an="1" offset_x="0.000000000e+00" offset_y="0.000000000e+00" ShowPosition="0" OverlayURL="" OverlayConfig="" transitionid="" transitiontime="300" trscenter="0" trscexit="0" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{BE81FB53-908B-4A46-B45E-29537EDEE6B3}" srcid="{3428AAC8-165F-451B-B13F-1F523783CA18}" type="1" name="Video Playlist" cname="" item="F:\\Videos\\rgba_test.mov*" itemaudio="" volume="100" mute="0" keepaudio="0" sounddev="0" mipmaps="0" autoresdet="1" keeploaded="1" RefreshOnScnLoad="0" RefreshOnSrcShow="0" zoom="l:0.000000000e+00|t:0.000000000e+00|r:1.000000000e+00|b:1.000000000e+00" or_enable="0" or_mode="0" or_angle="0" cc_pin="0" key_pin="0" edgeeffect_pin="0" effects_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:9.700000286e-01&amp;str:8.999999762e-01&amp;rad:7.000000030e-02&amp;color:2155905152&amp;trail:0.000000000e+00&amp;filtering:0.000000000e+00&amp;fill:0" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" LiveDetectSignal="1" CuePoints="" FilePlaylist="F:\\Videos\\rgba_test.mov*0*1*149840000*100*0*0*0*0*0|F:\\Videos\\dancing sprite.webm*1*1*80340000*100*0*0*0*0*0" fdeinterlace="0" InPoint="0" OutPoint="0" OpWhenFinished="0" StartOnLoad="1" StartOnSrcShow="0" RememberPosition="1" LastPosition="75610000" LastRunState="1" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture1="1" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapEnc="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapFrameTimeLimit="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserCookiePath="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookieFlags="0" Browser60fps="0" BrowserZoom="1.000000000e+00" SwfWrapper="1" DllGrant="" custom=""/></placement>';

  var local = {};
  var attachedId;
  var enumeratedSource = [];
  var failingVideo = 'F:\\Videos\\failingVideo.webm';

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
    var asyncId = 'ivideo_playlist_' + ctr;

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
    var asyncId = 'ivideo_playlist_' + ctr;

    if (property.substring(0, 5) === 'prop:') {
      property = property.replace(/^prop:/, '');
    }

    if (property.substring(0, 3) === 'src') {
      property = property.substring(3);
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
      return 'XSplit Broadcaster 2.7.1702.2231 ';
    });

    // reset attached IDs
    var source = new XJS.Source({srcId : '{ID}'});
    var source2 = new XJS.Source({srcId : '{ID2}'});

    local = {};

    spyOn(window.external, 'AppGetPropertyAsync')
    .and.callFake(function(funcName) {
      ctr++;
      var asyncId = 'ivideo_playlist_' + ctr;
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
      }

      return asyncId;
    });

    spyOn(window.external, 'GetVideoDuration')
      .and.callFake(function(file) {
      if (file !== failingVideo) {
        setTimeout(function() {
          window.OnGetVideoDuration(file, randomInt(0, 999999999).toString());
        },10);
      } else {
        setTimeout(function() {
          window.OnGetVideoDurationFailed(file);
        },10);
      }
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
            debugger;
            if (sourceArray[i] instanceof XJS.VideoPlaylistSource) {
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

  it('contains all the necessary video methods', function() {
    var methods = [
      'getVideoNowPlaying',
      'setVideoNowPlaying',
      'getVideoPlaylistSources',
      'setVideoPlaylistSources'
      ].join(',');

    expect(firstSource).hasMethods(methods);
  });

  describe('should be able to get and set the playing video ', function() {
    it ('through a promise', function(done) {
      var promise = firstSource.getVideoNowPlaying();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it ('as a string or as a number', function(done) {
      var videosOfFirst;
      var videosOfSecond;
      var firstRandom;
      var secondRandom;
      firstSource.getVideoPlaylistSources()
      .then(function(videos) {
        expect(videos).toBeArray();
        expect(videos).eachToBeTypeOf('string');
        videosOfFirst = videos;
        firstRandom = Math.floor(Math.random() * videosOfFirst.length);
        return secondSource.getVideoPlaylistSources();
      }).then(function(videos) {
        expect(videos).toBeArray();
        videosOfSecond = videos;
        secondRandom = Math.floor(Math.random() * videosOfSecond.length);
        return firstSource.setVideoNowPlaying(firstRandom);
      }).then(function() {
        return secondSource.setVideoNowPlaying(secondRandom);
      }).then(function() {
        return firstSource.getVideoNowPlaying();
      }).then(function(video) {
        var setVideo = videosOfFirst[firstRandom];
        expect(setVideo).toEqual(video);
        return secondSource.getVideoNowPlaying();
      }).then(function(video) {
        var setVideo = videosOfSecond[secondRandom];
        expect(setVideo).toEqual(video);
        done();
      })
    });
  });

  describe('should be able to get and set the video sources ', function() {
    var filePath = 'F:\\Videos\\';
    var filename = randomWord(5);
    var videosOfFirst;

    it ('through a promise', function(done) {
      var promise = firstSource.getVideoPlaylistSources();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it ('as an array of strings', function(done) {
      firstSource.getVideoPlaylistSources()
      .then(function(videos) {
        expect(videos).toBeArray();
        expect(videos).eachToBeTypeOf('string');
        videosOfFirst = videos;
        videosOfFirst.push(`${filePath}${filename}.mp4`);
        return firstSource.setVideoPlaylistSources(videosOfFirst);
      }).then(function() {
        return firstSource.getVideoPlaylistSources();
      }).then(function(videos) {
        expect(videos.join(',')).toEqual(videosOfFirst.join(','));
        videosOfFirst.push(failingVideo);
        return firstSource.setVideoPlaylistSources(videosOfFirst);
      }).then(function() {
        done.fail('Failing to get duration should reject');
      }).catch(function(err) {
        expect(err).toEqual(jasmine.any(Error));
        done();
      });
    });
  });

});
