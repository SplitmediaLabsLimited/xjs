/* globals describe, require, beforeEach, spyOn, it, expect */

describe('Playback interface', function() {
  'use strict';

  var XJS = require('xjs');
  var Scene = XJS.Scene;
  var mockPresetConfig = '<placement name="Scene 1" id="{219DB767-BE5B-4389-90C2-E712F08EA2CC}" defpos="2"><item type="1" item="C:\\Users\\Public\\Videos\\Sample Videos\\SampleVideo_1080x720_20mb.mp4" itemaudio="" name="C:\\Users\\Public\\Videos\\Sample Videos\\SampleVideo_1080x720_20mb.mp4" cname="" pos_left="0.000000" pos_top="0.000000" pos_right="0.500000" pos_bottom="0.500000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="0" volume="100" mute="0" sounddev="0" lockmove="0" keep_ar="1" fdeinterlace="0" mipmaps="0" autoresdet="1" visible="1" keeploaded="0" alpha="255" border="0" cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="1" key_pin="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" key_smartcamenable="0" key_smartcamconfig="" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" syncid0="17196712" syncid1="1297377540" syncid2="1247818682" syncid3="1810166442" id="{EBB02A63-EE13-41CB-93F0-8DA99B55ADF7}" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="396388725s,776583147r,974947251p" FilePlaylist="" OpWhenFinished="1" StartOnLoad="1" RememberPosition="1" LastPosition="974947251" LastRunState="0" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" DllGrant="" custom=""/><item type="1" item="C:\\Users\\Public\\Music\\Sample Music\\Kalimba.mp3" itemaudio="" name="C:\\Users\\Public\\Music\\Sample Music\\Kalimba.mp3" cname="" pos_left="0.609375" pos_top="0.000000" pos_right="0.890625" pos_bottom="0.500000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="1" volume="100" mute="0" sounddev="0" lockmove="0" keep_ar="1" fdeinterlace="0" mipmaps="0" autoresdet="1" visible="1" keeploaded="0" alpha="255" border="0" cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="1" key_pin="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" key_smartcamenable="0" key_smartcamconfig="" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" syncid0="2219327935" syncid1="1156186735" syncid2="3650348943" syncid3="3238716332" id="{EAC2BFE9-D749-4A61-9794-DAA4F288EE9E}" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="620950005" OutPoint="945876220" CuePoints="" FilePlaylist="" OpWhenFinished="2" StartOnLoad="1" RememberPosition="1" LastPosition="880751189" LastRunState="1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" DllGrant="" custom=""/></placement>';

  var local = {};
  var attachedId;
  var enumeratedItems;

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

  var parseXml = function(xmlStr) {
      return ( new window.DOMParser() ).parseFromString(xmlStr, 'text/xml');
  };

  var xCallback = function(id, result) {
    setTimeout(function() {
      window.OnAsyncCallback(id, result);
    }, 10);
  };

  var getLocal = function(property) {
    var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);

    if (property.substring(0, 5) === 'prop:') {
      property = property.replace(/^prop:/, '');
    }
    if (property.substring(0, 3) === 'src') {
      property = property.substring(3);
    }

    if (local[attachedId] !== undefined && local.attachedId.hasOwnProperty(
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
    var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);

    if (property.substring(0, 5) === 'prop:') {
      property = property.replace(/^prop:/, '');
    }

    if (local[attachedId] === undefined) {
      local[attachedId] = {};
    }

    local.attachedId[property] = value;
    xCallback(asyncId, '0');
    return asyncId;
  };

  beforeEach(function(done) {
    env.set(environments.EXTENSION); // for maximum flexibility/functionality

    navigator.__defineGetter__('appVersion', function() {
      return 'XSplit Broadcaster 2.7.1702.2231 ';
    });

    // reset attached IDs
    var item1 = new XJS.Item({id : '{ID}'});
    var item2 = new XJS.Item({id : '{ID2}'});

    local = {};

    spyOn(window.external, 'AppGetPropertyAsync')
    .and.callFake(function(funcName) {
      var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);
      switch (funcName) {
        case 'presetconfig:0':
          xCallback(asyncId, encodeURIComponent(mockPresetConfig));
          break;

        case 'presetconfig':
          xCallback(asyncId, encodeURIComponent(mockPresetConfig));
          break;

        case 'preset:0':
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

    Scene.getActiveScene().then(function(newScene) {
      return newScene.getItems();
    }).then(function(items) {
      enumeratedItems = items;
      done();
    });
  });

  afterEach(function() {
    navigator.__defineGetter__('appVersion', function() {
      return appVersion;
    });
  });

  it('can correctly identify video and audio', function(done) {
    exec(function(next) {
      var videoItem = enumeratedItems[0];
      var audioItem = enumeratedItems[1];
      attachedId = videoItem._id;
      videoItem.isVideo().then(function(result) {
        expect(result).toBe(true);
        return videoItem.isAudio();
      }).then(function(result) {
        expect(result).toBe(false);
        attachedId = audioItem._id;
        return audioItem.isVideo();
      }).then(function(result) {
        expect(result).toBe(false);
        return audioItem.isAudio();
      }).then(function(result) {
        expect(result).toBe(true);
        next();
      }).catch(function(error) {
        done.fail(error);
      });
    }).then(function() {
      done();
    });
  });

  it('contains all the necessary playback methods', function() {
    var methods = [
      'isSeekable',
      'getPlaybackPosition',
      'setPlaybackPosition',
      'getPlaybackDuration',
      'isPlaying',
      'setPlaying',
      'getPlaybackStartPosition',
      'setPlaybackStartPosition',
      'getPlaybackEndPosition',
      'setPlaybackEndPosition',
      'getActionAfterPlayback',
      'setActionAfterPlayback',
      'isAutostartOnSceneLoad',
      'setAutostartOnSceneLoad',
      'isForceDeinterlace',
      'setForceDeinterlace',
      'isRememberingPlaybackPosition',
      'setRememberingPlaybackPosition',
      'isShowingPlaybackPosition',
      'setShowingPlaybackPosition',
      'getCuePoints',
      'setCuePoints',
      'getValue',
      'setValue',
      'isAudio',
      'isVideo'
      ].join(',');

    expect(enumeratedItems[0]).hasMethods(methods);
    expect(enumeratedItems[1]).hasMethods(methods);
  });

  it('detects playback start and end positions properly', function(done) {
    // the audio Item in test case has these positions set already
    var audioItem = enumeratedItems[1];

    exec(function(next) {
      audioItem.getPlaybackStartPosition().then(function(pos) {
        expect(pos > 0).toBe(true);
        return audioItem.getPlaybackEndPosition();
      }).then(function(pos) {
        expect(pos > 0).toBe(true);
        next();
      }).catch(function(err) {
        done.fail(err);
      });
    }).then(done);
  });

  it('detects cue points properly', function(done) {
    // the video Item in test case has cue points declared already
    exec(function(next) {
      var videoItem = enumeratedItems[0];
      attachedId = videoItem._id;
      videoItem.getCuePoints().then(function(points) {
        expect(points).not.toBeEmptyArray();
        expect(points[0].getTime()).toBeTypeOf('number');
        expect(points[0].getTime() > 0).toBe(true);
        expect(points[0].getAction()).toBeTypeOf('string');
        expect(points[0].getAction()).not.toBe('');

        next();
      }).catch(function(err) {
        done.fail(err);
      });
    }).then(done);
  });
});
