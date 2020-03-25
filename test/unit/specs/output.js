/* globals describe, it, expect, require */

describe('Output ===', function() {
  var xjs = require('xjs');
  var Output = xjs.Output;
  var env = new window.Environment(xjs);
  var environments = ['props', 'extension', 'plugin'];
  var environment = xjs.Environment;
  var broadcastObject = {};
  var appVersion = navigator.appVersion;
  var emptyRecstat = false;

  var mockOutputList = '<channels><channel name="Local Recording" /><channel name="Local Streaming" displayName="Local Streaming"/><channel name="Twitch - TwitchChannel" displayName="Twitch - TwitchChannel" /></channels>';
  var mixEnvironments = new window.Mixin([
    function() {
      navigator.__defineGetter__('appVersion', function() {
        return appVersion;
      });
      env.set(environments[1]);
      navigator.__defineGetter__('appVersion', function() {
        return 'XSplit Broadcaster 2.8.1603.0401 ';
      });
    },
    function() {
      navigator.__defineGetter__('appVersion', function() {
        return appVersion;
      });
      env.set(environments[2]);
      navigator.__defineGetter__('appVersion', function() {
        return 'XSplit Broadcaster 2.8.1603.0401 ';
      });
    }
  ]);
  var exec = mixEnvironments.exec.bind(mixEnvironments);

  var mix = new window.Mixin([
    function() {
      navigator.__defineGetter__('appVersion', function() {
        return 'XSplit Broadcaster 2.8.1603.0401 ';
      });
    },
    function() {
      navigator.__defineGetter__('appVersion', function() {
        return 'XSplit Broadcaster 3.1.1707.3101 ';
      });
    }
  ]);
  var exec2 = mix.exec.bind(mix);

  beforeEach(function() {
    spyOn(external, 'PostMessageToParent')
    .and.callFake(function() {
      var postMessageId = arguments[0];
      if (postMessageId === '8') {
        randomId = randomWord(15);
        window.Setid(randomId);
      }
    });

    spyOn(external, 'CallHost')
    .and.callFake(function() {
      var funcName = arguments[0];
      if (funcName.startsWith('getBroadcastChannelList:')) {
        window.SetBroadcastChannelList(mockOutputList);
      } else if (funcName === 'startBroadcast') {
        var outputName = arguments[1];
        broadcastObject[outputName] = 'start';
      } else if (funcName === 'stopBroadcast') {
        var outputName = arguments[1];
        broadcastObject[outputName] = 'stop';
      } else if (funcName === 'pauseRecording') {
        broadcastObject['Local Recording'] = 'paused';
      } else if (funcName === 'unpauseRecording') {
        broadcastObject['Local Recording'] = 'unpaused';
      }
    });

    spyOn(external, 'CallHostFunc')
    .and.callFake(function() {
      var funcName = arguments[0];
      global_asyncId++;
      if (funcName.startsWith('getBroadcastChannelList')) {
        var asyncId = new Date().getTime() + '_' + global_asyncId;
        setTimeout(function() {
          window.OnAsyncCallback(asyncId, mockOutputList);
        }, 10);
        return asyncId;
      } else if (funcName.startsWith('getBroadcastChannelXml')) {
        var asyncId = new Date().getTime() + '_' + global_asyncId;
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

    spyOn(window.external, 'GetLocalPropertyAsync')
    .and.callFake(function(funcName) {
      if (funcName === 'itemlist') {
        global_asyncId++;
        var asyncId = new Date().getTime() + '_' + global_asyncId;
        setTimeout(function() {
          window.OnAsyncCallback(asyncId, '{76D1C7FC-4CF2-4D7C-88F7-AABC6EE40705},{B438A6F2-2035-4F58-B011-131BBA706F31}');
        }, 10);
        return asyncId;
      }
    });

    spyOn(window.external, 'AppGetPropertyAsync')
    .and.callFake(function(funcName) {
      if (funcName === 'recstat' && !emptyRecstat) {
        global_asyncId++;
        var asyncId = new Date().getTime() + '_' + global_asyncId;
          setTimeout(function() {
            window.OnAsyncCallback(asyncId,
              encodeURIComponent('<stat>' +
                '<channel name="Local Recording">' +
                '<stat video="21800992" audio="1383326" output="29635585"' +
                  ' frmdropped="0" frmcoded="145267"/>' +
                '<channel serviceName="LocalStreaming" name="Local Recording"' +
                  ' displayName="Local Recording" description=""' +
                  ' rtmpUrl="rtmp://nomaster" streamName=""' +
                  ' link="http://demo.splitmedialabs.com/VHJavaMediaSDK3/' +
                  'view.html?id=stream&amp;url=rtmp://192.168.254.99:1935/app' +
                  '&amp;buffer=1&amp;forceObjectEncoding=0" username=""' +
                  ' password="" channel=""' +
                  ' extraConfig="\\rtmp_2ch:1\\rtmp_buf:65536' +
                  '\\rtmp_timeout_media:0\\rtmp_timeout_close:500' +
                  '\\lowLatency:0\\hasSupportedResolutionsOnly:0' +
                  '\\hasSupportedFpsOnly:0\\rtmp_flashver:XSplit/2.4' +
                  '\\origabitrate:96000\\rtmp_timeout_connect:0' +
                  '\\opt_faststart:1\\opt_remuxto:mp4&amp;' +
                  'movflags:frag_keyframe+empty_moov&amp;frag_size:16777216"' +
                  ' recordBroadcast="1" filetype="flv"' +
                  ' file="mp4:C:\\Users\\someUser\\Videos\\' +
                  'XSplit Videos - user\\Local Recording\\someFolder.mp4"' +
                  ' enableoutwatermark="0">' +
                '<configuration>' +
                '<video codec="libx264ext64&amp;ex:preset:veryfast' +
                  '&amp;ex:crf:27&amp;ex:vbv-bufsize:1000' +
                  '&amp;ex:vbv-maxrate:1000&amp;ex:keyint:60' +
                  '&amp;ex:fps:10000000/333333" framerate="333333"' +
                  ' x264Presets="&amp;veryfast" quality="27"' +
                  ' codecCommands="ex:fps:10000000/333333" cbr="0"' +
                  ' adaptivebr="0" keyint="2" bufferSize="1000k"' +
                  ' maxBitrate="1000k" resizeex="0"' +
                  ' dontUseDefaultMixerResolution="0"' +
                  ' dontUseDefaultMixerFPS="0"/>' +
                '<audio bitrate="96000" codec="libw7aac&amp;b:96000"' +
                ' format="44100/2" format2="44100/2"/>' +
                '</configuration>' +
                '<extra>' +
                '<params/>' +
                '<speex vbr="0" q="10" vmrq="10" vbrmax="42200" abr="42200"' +
                ' complexity="4" vad="0" dtx="0" hp="1"/>' +
                '</extra>' +
                '<meta>' +
                '<value type="2" name="bufferSize" value="1000k"/>' +
                '<value type="2" name="maxBitrate" value="1000k"/>' +
                '<value type="2" name="videodevice"' +
                ' value="XSplitBroadcaster"/>' +
                '<value type="2" name="xsplitBroadcasterVersion"' +
                  ' value="1.3.0.444"/>' +
                '<value type="2" name="xsplitCoreVersion"' +
                  ' value="2.4.1506.2436 Version 2.4"/>' +
                '<value type="2" name="xsplitGameSourceVersion"' +
                  ' value="1.1.1.148"/>' +
                '<value type="2" name="xsplitMediaLibVersion"' +
                  ' value="2.0.0.532"/>' +
                '<value type="0" name="framerate" value="30"/>' +
                '<value type="2" name="pluginName" value="LocalStreaming"/>' +
                '<value type="2" name="pluginVersion" value="2.4.1506.2201"/>' +
                '</meta>' +
                '</channel>' +
                '</channel>' +
                '</stat>'
              ));
          },10);
        return asyncId;
      } else if (funcName === 'recstat') {
        global_asyncId++;
        var asyncId = new Date().getTime() + '_' + global_asyncId;
          setTimeout(function() {
            window.OnAsyncCallback(asyncId, encodeURIComponent('<stat></stat>'));
          },10);
        return asyncId;
      }
    });
  });

  afterAll(function() {
    navigator.__defineGetter__('appVersion', function() {
      return appVersion;
    });
  });

  describe('should fetch all available outputs', function() {
    it('through a promise', function(done) {
      exec(function(next) {
        var getOutputList = Output.getOutputList();
        expect(getOutputList).toBeInstanceOf(Promise);
        next();
      }).then(done);
    });

    it('that returns an array of Outputs', function(done) {
      exec(function(next) {
        Output.getOutputList()
        .then(function(outputs) {
          expect(outputs).toBeInstanceOf(Array);
          expect(outputs).eachToBeInstanceOf(Output);
          next();
        });
      }).then(done);
    });

    it('should reject when called in source properties', function(done) {
      navigator.__defineGetter__('appVersion', function() {
        return appVersion;
      });
      env.set(environments[0]);
      navigator.__defineGetter__('appVersion', function() {
        return 'XSplit Broadcaster 2.8.1603.0401 ';
      });
      Output.getOutputList().then(function(source) {
        done.fail('getOutputList should reject if called in source properties');
      }, function() {
        expect(true).toBe(true);
        done();
      });
    });
  });

  describe('should have different broadcast-related methods', function() {
    var testOutputs, localRecording, otherOutput;
    beforeEach(function(done) {
      navigator.__defineGetter__('appVersion', function() {
        return appVersion;
      });
      env.set(environments[1]);
      Output.getOutputList().then(function(outputs) {
        testOutputs = outputs;
        for (var i = 0; i < outputs.length; i++) {
          if (outputs[i]._name === 'Local Recording') {
            localRecording = outputs[i];
          } else {
            otherOutput = outputs[i];
          }
        };
        done();
      });
    });

    // if this fails, please first check if the expected value corresponds to the supplied channel list
    // Local Recording should always be first
    it('such as getting output name', function(done) {
      localRecording.getName().then(function(name) {
        expect(name).toEqual('Local Recording');
        return otherOutput.getName();
      }).then(function(otherName) {
        expect(otherName).toBeTypeOf('string');
        expect(otherName).not.toEqual('Local Recording');
        done();
      });
    });

    // if this fails, please first check if the expected value corresponds to the supplied channel list
    // Local Recording should always be first
    it('such as getting output display name', function(done) {
      localRecording.getDisplayName().then(function(name) {
        expect(name).toEqual('Local Recording');
        return otherOutput.getDisplayName();
      }).then(function(otherName) {
        expect(otherName).toBeTypeOf('string');
        expect(otherName).not.toEqual('Local Recording');
        done();
      });
    });

    it('starting and stopping broadcasts', function(done) {
      exec2(function(next) {
        otherOutput.startBroadcast().then(function() {
          expect(broadcastObject[otherOutput._name]).toEqual('start');
          return otherOutput.stopBroadcast();
        }).then(function() {
          expect(broadcastObject[otherOutput._name]).toEqual('stop');
          next();
        });
      }).then(done);
    });

    // @TODO: Remove this once we delete the deprecated instance methods
    it('pausing and unpausing of local recording', function(done) {
      otherOutput.pauseLocalRecording().then(function(source) {
        done.fail('pause should reject if called when  non-Local Recording');
      }, function() {
        return otherOutput.unpauseLocalRecording();
      }).then(function(source) {
        done.fail('unpause should reject if called from non-Local Recording');
      }, function() {
        return localRecording.pauseLocalRecording();
      }).then(function() {
        expect(broadcastObject['Local Recording']).toEqual('paused');
        return localRecording.unpauseLocalRecording();
      }).then(function() {
        expect(broadcastObject['Local Recording']).toEqual('unpaused');
        emptyRecstat = true;
        return localRecording.pauseLocalRecording();
      }).then(function(source) {
        done.fail('pause should reject if called local recording is not active');
      }, function() {
        done();
      });
    });

    it('pausing and unpausing of local recording should just work', function(done) {
      Output.pauseLocalRecording()
        .then(Output.unpauseLocalRecording)
        .then(function() {
          done();
        }, function() {
          done.fail('pause and unpause local recording should always work');
        });
    })
  });


});
