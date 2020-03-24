/* globals describe, require, beforeEach, spyOn, it, expect */

describe('Replay interface', function() {
  'use strict';

  var XJS = require('xjs');
  var Scene = XJS.Scene;
  var mockPresetConfig = '<placement name="Scene 1" id="{E5AFB667-63C7-433D-B06E-84F8E1A99F34}" preset_id="{00000000-0000-0000-0000-000000000000}" preset_trtime="500" preset_trfunc="" defpos="2" trid="" trtime="500"><item pos_left="0.000000000e+00" pos_top="0.000000000e+00" pos_right="1.000000000e+00" pos_bottom="1.000000000e+00" pos_an="1" crop_left="0.000000000e+00" crop_top="0.000000000e+00" crop_right="0.000000000e+00" crop_bottom="0.000000000e+00" crop_an="1" pixalign="0" zorder="0" lockmove="0" keep_ar="1" visible="1" visible_an="1" alpha="255" alpha_an="1" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" cc_brightness_an="1" cc_contrast_an="1" cc_hue_an="1" cc_saturation_an="1" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="50" key_chromasat="50" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" pan="0" pan_config="R:1.000000000e+00&amp;la:0.000000000e+00&amp;fi:0.000000000e+00" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" rotate_x_an="1" rotate_y_an="1" offset_x="0.000000000e+00" offset_y="0.000000000e+00" ShowPosition="0" OverlayURL="" OverlayConfig="" transitionid="" transitiontime="300" trscenter="0" trscexit="0" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{68D39BFA-1F29-4DE8-8F98-EFB4656F8ED0}" srcid="{F31F566B-1FB9-42B4-BC27-D74136F36AE2}" type="13" name="Replay" cname="" item="20200317110302_replay#1" itemaudio="" volume="100" mute="0" keepaudio="0" sounddev="0" mipmaps="0" autoresdet="1" keeploaded="1" RefreshOnScnLoad="0" RefreshOnSrcShow="0" zoom="l:0.000000000e+00|t:0.000000000e+00|r:1.000000000e+00|b:1.000000000e+00" or_enable="0" or_mode="0" or_angle="0" cc_pin="0" key_pin="0" edgeeffect_pin="0" effects_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:9.700000286e-01&amp;str:8.999999762e-01&amp;rad:7.000000030e-02&amp;color:2155905152&amp;trail:0.000000000e+00&amp;filtering:0.000000000e+00&amp;fill:0" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" LiveDetectSignal="1" CuePoints="" FilePlaylist="" fdeinterlace="0" InPoint="0" OutPoint="0" OpWhenFinished="0" StartOnLoad="1" StartOnSrcShow="0" RememberPosition="1" LastPosition="0" LastRunState="1" ScrCapMethod="3" ScrCapLayered="1" ScrCapOptCapture1="1" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapEnc="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapFrameTimeLimit="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserCookiePath="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookieFlags="0" Browser60fps="0" BrowserZoom="1.000000000e+00" SwfWrapper="1" DllGrant="" custom=""><presproperty __map_id="buffer">10</presproperty><presproperty __map_id="channelName">auto</presproperty></item><item pos_left="5.000000000e-01" pos_top="5.000000000e-01" pos_right="1.000000000e+00" pos_bottom="1.000000000e+00" pos_an="1" crop_left="0.000000000e+00" crop_top="0.000000000e+00" crop_right="0.000000000e+00" crop_bottom="0.000000000e+00" crop_an="1" pixalign="0" zorder="1" lockmove="0" keep_ar="1" visible="1" visible_an="1" alpha="255" alpha_an="1" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" cc_brightness_an="1" cc_contrast_an="1" cc_hue_an="1" cc_saturation_an="1" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="50" key_chromasat="50" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" pan="0" pan_config="R:1.000000000e+00&amp;la:0.000000000e+00&amp;fi:0.000000000e+00" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" rotate_x_an="1" rotate_y_an="1" offset_x="0.000000000e+00" offset_y="0.000000000e+00" ShowPosition="0" OverlayURL="" OverlayConfig="" transitionid="" transitiontime="300" trscenter="0" trscexit="0" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{B1E6F0C6-4891-4842-96E7-2AE2FFC7E946}" srcid="{A0E0E74A-8CA4-48CF-ADAB-75B75098D37B}" type="13" name="Replay" cname="" item="20200317110311_replay#2" itemaudio="" volume="100" mute="0" keepaudio="0" sounddev="0" mipmaps="0" autoresdet="1" keeploaded="1" RefreshOnScnLoad="0" RefreshOnSrcShow="0" zoom="l:0.000000000e+00|t:0.000000000e+00|r:1.000000000e+00|b:1.000000000e+00" or_enable="0" or_mode="0" or_angle="0" cc_pin="0" key_pin="0" edgeeffect_pin="0" effects_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:9.700000286e-01&amp;str:8.999999762e-01&amp;rad:7.000000030e-02&amp;color:2155905152&amp;trail:0.000000000e+00&amp;filtering:0.000000000e+00&amp;fill:0" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" LiveDetectSignal="1" CuePoints="" FilePlaylist="" fdeinterlace="0" InPoint="0" OutPoint="0" OpWhenFinished="0" StartOnLoad="1" StartOnSrcShow="0" RememberPosition="1" LastPosition="0" LastRunState="1" ScrCapMethod="3" ScrCapLayered="1" ScrCapOptCapture1="1" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapEnc="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapFrameTimeLimit="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserCookiePath="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookieFlags="0" Browser60fps="0" BrowserZoom="1.000000000e+00" SwfWrapper="1" DllGrant="" custom=""><presproperty __map_id="buffer">10</presproperty><presproperty __map_id="channelName">Twitch - SML_MeSo</presproperty><presproperty __map_id="hotkey">0</presproperty></item></placement>';
  var mockOutputList = '<channels><channel name="Local Recording" /><channel name="Local Streaming" displayName="Local Streaming"/><channel name="Twitch - TwitchChannel" displayName="Twitch - TwitchChannel" /></channels>';

  var env = new window.Environment(XJS);
  var environments = {
    SOURCE : 'plugin',
    SOURCEPROPS : 'props',
    EXTENSION : 'extension'
  };

  var local = {};
  var attachedId;
  var enumeratedSource = [];
  var appVersion = navigator.appVersion;

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
    var asyncId = 'ireplay_' + ctr;

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
    var asyncId = 'ireplay_' + ctr;

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
      return 'XSplit Broadcaster 2.7.1702.2231 ';
    });

    // reset attached IDs
    var item1 = new XJS.Item({id : '{ID}'});

    local = {};

    spyOn(external, 'CallHostFunc')
    .and.callFake(function() {
      var funcName = arguments[0];

      ctr++;
      var asyncId = 'ireplay_' + ctr;

      if (funcName.startsWith('getBroadcastChannelList')) {
        setTimeout(function() {
          window.OnAsyncCallback(asyncId, mockOutputList);
        }, 10);
        return asyncId;
      } else if (funcName.startsWith('getBroadcastChannelXml')) {
        var xmlDocument = (new DOMParser()).parseFromString(mockOutputList, 'application/xml');
        var selector = "channel[name='" + arguments[1] + "']";
        var channel = xmlDocument.querySelector(selector);
        var channelDetails = channel.outerHTML
        setTimeout(function() {
          window.OnAsyncCallback(asyncId, channelDetails ? channelDetails : '');
        }, 10);
        return asyncId;
      }
    });

    spyOn(window.external, 'AppGetPropertyAsync')
    .and.callFake(function(funcName) {
      ctr++;
      var asyncId = 'ireplay_' + ctr;
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

    spyOn(window.external, 'SearchVideoItem')
    .and.callFake(function(id) {
      attachedId = id;
    });

    spyOn(window.external, 'SearchVideoItem2')
    .and.callFake(function(id) {
      attachedId = id;
    });

    spyOn(window.external, 'AttachVideoItem')
    .and.callFake(function(id) {
      attachedId = id;
    });

    spyOn(window.external, 'AttachVideoItem2')
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

  it('contains all the necessary audio methods', function() {
    var methods = [
      'getChannel',
      'setChannel',
      'getHotkey',
      'setHotkey',
      'getReplayTime',
      'setReplayTime',
      'startReplay',
      'stopReplay',
      'getReplayState',
      'isAutostartOnSceneLoad',
      'setAutostartOnSceneLoad'
      ].join(',');

    expect(enumeratedSource[0]).hasMethods(methods);
  });

  describe('should be able to get and set channel', function() {
    it ('through a promise', function(done) {
      var promise = firstSource.getChannel();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it ('as a string', function(done) {
      var myOutputs;
      var firstOutput, secondOutput;
      XJS.Output.getOutputList()
      .then(function(outputs) {
        myOutputs = outputs;
        return myOutputs[0].getName();
      }).then(function(output1) {
        firstOutput = output1;
        return myOutputs[1].getName();
      }).then(function(output2) {
        secondOutput = output2;
        return firstSource.setChannel(firstOutput);
      }).then(function() {
        return secondSource.setChannel(secondOutput);
      }).then(function() {
        return firstSource.getChannel();
      }).then(function(channel1) {
        expect(channel1).toBeTypeOf('string');
        expect(channel1).toEqual(firstOutput);
        return secondSource.getChannel();
      }).then(function(channel2) {
        expect(channel2).toBeTypeOf('string');
        expect(channel2).toEqual(secondOutput);
        done();
      });
    });
  })

  describe('should be able to get and set hotkey', function() {
    it ('through a promise', function(done) {
      var promise = firstSource.getHotkey();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it ('as a number', function(done) {
      var isShift = randomBoolean();
      var isCtrl = randomBoolean();
      var isAlt = randomBoolean();

      // we randomize only a-z, arrow, numpad, and function keys
      var randomKey = randomInt(65, 123);
      var keyCombination = randomKey | (isShift ? 65536 : 0) | (isCtrl ? 131072 : 0) | (isAlt ? 262144 : 0);
      var keyCombination2 = randomKey | (!isShift ? 65536 : 0) | (!isCtrl ? 131072 : 0) | (!isAlt ? 262144 : 0);

      firstSource.setHotkey(keyCombination)
      .then(function() {
        return secondSource.setHotkey(keyCombination2);
      }).then(function() {
        return firstSource.getHotkey();
      }).then(function(hotkey1) {
        expect(hotkey1).toBeTypeOf('number');
        expect(hotkey1).toEqual(keyCombination);
        return secondSource.getHotkey();
      }).then(function(hotkey2) {
        expect(hotkey2).toBeTypeOf('number');
        expect(hotkey2).toEqual(keyCombination2);
        done();
      })
    });
  });

  describe('should be able to get and set replay time', function() {
    it ('through a promise', function(done) {
      var promise = firstSource.getReplayTime();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it ('as a number', function(done) {
      var firstRand = randomInt(0, 120);
      var secondRand = randomInt(0, 120);
      firstSource.setReplayTime(firstRand)
      .then(function() {
        return secondSource.setReplayTime(secondRand);
      }).then(function() {
        return firstSource.getReplayTime();
      }).then(function(audioOffset1) {
        expect(audioOffset1).toBeTypeOf('number');
        expect(audioOffset1).toEqual(firstRand);
        return secondSource.getReplayTime();
      }).then(function(audioOffset2) {
        expect(audioOffset2).toBeTypeOf('number');
        expect(audioOffset2).toEqual(secondRand);
        done();
      })
    });

    it ('which rejects when parameters are invalid', function(done) {
      firstSource.setReplayTime(121)
      .then(function(isSet) {
        done.fail('Value accepted is higher than 120');
      }).catch(function(err) {
        expect(err).toEqual(jasmine.any(Error));
        return firstSource.setReplayTime(-1)
      }).then(function(isSet) {
        done.fail('Value accepted is lower than 0');
      }).catch(function(err) {
        expect(err).toEqual(jasmine.any(Error));
        return firstSource.setReplayTime('SOME STRING')
      }).then(function(isSet) {
        done.fail('Value accepted is not a number');
      }).catch(function(err) {
        expect(err).toEqual(jasmine.any(Error));
        done();
      });
    });
  });

  describe('should be able to start, stop and get replay state', function() {
    it ('through a promise', function(done) {
      var promise = firstSource.isMute();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it ('as a number', function(done) {
      firstSource.startReplay()
      .then(function() {
        return firstSource.getReplayState()
      }).then(function(replayState) {
        expect(replayState).toBeTypeOf('number');
        expect(replayState).toEqual(1);
        return firstSource.stopReplay();
      }).then(function() {
        return firstSource.getReplayState()
      }).then(function(replayState) {
        expect(replayState).toBeTypeOf('number');
        expect(replayState).toEqual(0);
        done();
      });
    });
  });

  describe('should be able to get and set auto start on scene load', function(done) {
    var randomBool = randomBoolean();
    it ('through a promise', function(done) {
      var promise = firstSource.isAutostartOnSceneLoad();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it ('as a boolean', function(done) {
      firstSource.setAutostartOnSceneLoad(randomBool)
      .then(function() {
        return firstSource.isAutostartOnSceneLoad();
      }).then(function(isAutostart) {
        expect(isAutostart).toBe(randomBool);
        return firstSource.setAutostartOnSceneLoad(!randomBool);
      }).then(function() {
        return firstSource.isAutostartOnSceneLoad();
      }).then(function(isAutostart) {
        expect(isAutostart).toBe(!randomBool);
        done();
      });
    });
  });
});
