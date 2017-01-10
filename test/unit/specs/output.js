/* globals describe, it, expect, require */

describe('Output ===', function() {
  var xjs = require('xjs');
  var Output = xjs.Output;
  var env = new window.Environment(xjs);
  var environments = ['props', 'extension', 'plugin'];
  var environment = xjs.Environment;
  var broadcastObject = {};
  var appVersion = navigator.appVersion;

  var mockOutputList = '<channels><channel name="Local Recording" /><channel name="Local Streaming" /><channel name="Twitch - TwitchChannel" /></channels>';
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
      } else if (funcName === 'pauseLocalRecording') {
        broadcastObject['Local Recording'] = 'paused';
      } else if (funcName === 'unpauseLocalRecording') {
        broadcastObject['Local Recording'] = 'unpaused';
      }
    });

    spyOn(window.external, 'GetLocalPropertyAsync')
    .and.callFake(function(funcName) {
      if (funcName === 'itemlist') {
        var asyncId = new Date().getTime() + '_' + global_asyncId;
        setTimeout(function() {
          window.OnAsyncCallback(asyncId, '{76D1C7FC-4CF2-4D7C-88F7-AABC6EE40705},{B438A6F2-2035-4F58-B011-131BBA706F31}');
        }, 10);
        return asyncId;
      }
    });
  });

  afterAll(function() {
    navigator.__defineGetter__('appVersion', function() {
      return appVersion;
    });   
  });

  describe('should fetch all available outputs', function(done) {
    it('through a promise', function(done) {
      exec(function(next) {
        var getOutputList = Output.getOutputList();
        expect(getOutputList).toBeInstanceOf(Promise);
        next();
      }).then(done);
    });

    it('that returns an array of Outputs', function(done) {
      exec(function(next) {
        Output.getOutputList().then(function(outputs) {
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

    it('starting and stopping broadcasts', function(done) {
      otherOutput.startBroadcast().then(function() {
        expect(broadcastObject[otherOutput._name]).toEqual('start');
        return otherOutput.stopBroadcast();
      }).then(function() {
        expect(broadcastObject[otherOutput._name]).toEqual('stop');
        done();
      });
    });

    it('pausing and unpausing of local recording', function() {
      otherOutput.pauseLocalRecording().then(function(source) {
        done.fail('pause should reject if called from non-Local Recording');
      }, function() {
        return otherOutput.unpauseLocalRecording();
        done();
      }).then(function(source) {
        done.fail('unpause should reject if called from non-Local Recording');
      }, function() {
        return localRecording.pauseLocalRecording();
      }).then(function() {
        expect(broadcastObject['Local Recording']).toEqual('paused');
        return localRecording.unpauseLocalRecording();
      }).then(function() {
        expect(broadcastObject['Local Recording']).toEqual('unpaused');
        done();
      });
    });
  });


});
