/* globals describe, it, expect, xdescribe, require, beforeAll, beforeEach, spyOn, jasmine, afterEach, afterAll */

describe('App ===', function() {
  'use strict';

  var startsWith = function(mainString, stringCompared) {
    return mainString.toLowerCase().substring(0, stringCompared.length) ===
      stringCompared.toLowerCase();
  };
  var XJS = require('xjs');
  var App = new XJS.App();
  var Transition = XJS.Transition;
  var env = new window.Environment(XJS);
  var environments = ['props', 'extension', 'plugin'];
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

  beforeAll(function(done) {
    XJS.ready().then(function() {
      done();
    });
  })

  describe('should get frametime', function() {
    beforeEach(function() {
      spyOn(window.external, 'AppGetPropertyAsync')
        .and.callFake(function(funcName) {
        if (funcName == 'frametime') {
          var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);

          setTimeout(function() {
            window.OnAsyncCallback(asyncId, '12');
          },10);

          return asyncId;
        }
      });
    });

    it('through a promise', function() {
      var promise = App.getFrameTime();
      expect(promise).toBeInstanceOf(Promise);
    });

    it('that always return as a number', function(done) {
      var promise = App.getFrameTime();
      promise.then(function(count) {
        expect(count).toBeTypeOf('number');
        expect(count).not.toBeNaN();
        done();
      });
    });
  });

  describe('should get resolution', function() {
    beforeEach(function() {
      spyOn(window.external, 'AppGetPropertyAsync')
        .and.callFake(function(funcName) {
        if (funcName == 'resolution') {
          var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);

          setTimeout(function() {
            window.OnAsyncCallback(asyncId, '900, 600');
          },10);

          return asyncId;
        }
      });
    });

    it('through a promise', function() {
      var promise = App.getResolution();
      expect(promise).toBeInstanceOf(Promise);
    });

    it('that always return as an object that has height and width',
      function(done) {
      var promise = App.getResolution();
      promise.then(function(resolution) {
        expect(resolution).toBeInstanceOf(Object);
        expect(resolution._width).toBeTypeOf('number');
        expect(resolution._width).not.toBeNaN();
        expect(resolution._height).toBeTypeOf('number');
        expect(resolution._height).not.toBeNaN();
        done();
      });
    });
  });

  describe('should get viewport', function() {
    beforeEach(function() {
      spyOn(window.external, 'AppGetPropertyAsync')
        .and.callFake(function(funcName) {
        if (funcName == 'viewport') {
          var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);

          setTimeout(function() {
            window.OnAsyncCallback(asyncId, '900, 600');
          },10);

          return asyncId;
        }
      });
    });

    afterEach(function() {
      navigator.__defineGetter__('appVersion', function() {
        return appVersion;
      });
    });

    it('through a promise', function(done) {
      exec(function(next) {
        var promise = App.getViewport();
        expect(promise).toBeInstanceOf(Promise);
        next();
      }).then(done);
    });

    it('that always return as an object that has height and width',
      function(done) {
        exec(function(next) {
          var promise = App.getViewport();
          promise.then(function(viewPort) {
            expect(viewPort).toBeTypeOf('object');
            expect(viewPort._width).toBeTypeOf('number');
            expect(viewPort._width).not.toBeNaN();
            expect(viewPort._height).toBeTypeOf('number');
            expect(viewPort._height).not.toBeNaN();
            next();
          });
        }).then(done);
      }
    );
  });

  describe('should get version', function() {
    beforeEach(function() {
      spyOn(window.external, 'AppGetPropertyAsync')
        .and.callFake(function(funcName) {
        if (funcName == 'version') {
          var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);

          setTimeout(function() {
            window.OnAsyncCallback(asyncId, '1.3.0.429');
          },10);

          return asyncId;
        }
      });
    });

    afterEach(function() {
      navigator.__defineGetter__('appVersion', function() {
        return appVersion;
      });
    });

    it('through a promise', function(done) {
      exec(function(next) {
        var promise = App.getVersion();
        expect(promise).toBeInstanceOf(Promise);
        next();
      }).then(done);
    });

    it('that always return as string', function(done) {
      exec(function(next) {
        var promise = App.getVersion();
        promise.then(function(version) {
          if (/xsplit broadcaster/ig.test(navigator.appVersion)) {
            expect(version).toBeDefined();
            expect(version).toBeTypeOf('string');
            next();
          } else {
            done.fail('Should reject if browser is not XBC');
          }
        }).catch(function(err) {
          expect(err).toEqual(jasmine.any(Error));
          next();
        });
      }).then(done);
    });
  });

  describe('should get frames rendered', function() {
    beforeEach(function() {
      spyOn(window.external, 'AppGetPropertyAsync')
        .and.callFake(function(funcName) {
        if (funcName == 'framesrendered') {
          var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);

          setTimeout(function() {
            window.OnAsyncCallback(asyncId, '12683');
          },10);

          return asyncId;
        }
      });
    });

    it('through a promise', function() {
      var promise = App.getFramesRendered();
      expect(promise).toBeInstanceOf(Promise);
    });

    it('that always return as a number', function(done) {
      var promise = App.getFramesRendered();
      promise.then(function(framesRendered) {
        expect(framesRendered).toBeTypeOf('number');
        expect(framesRendered).not.toBeNaN();
        done();
      });
    });
  });

  describe ('should be able to get audio devices', function() {
    var micDev2Mock =
    encodeURIComponent('<devices>' +
      '<dev id="default:1:0" level="0.900000" enable="1"' +
        ' hwlevel="-1.000000" hwenable="255" delay="0" mix="0"/>' +
      '<dev id="default:0:0" level="1.500000" enable="1"' +
        ' hwlevel="-1.000000" hwenable="255" delay="0" mix="0"/>' +
      '<dev id="{0.0.0.00000000}.' +
        '{8a37e9cb-90fd-42d9-9d5b-8d8c43bdb929}" level="1.000000"' +
        ' enable="1" hwlevel="-1.000000" hwenable="255"' +
        ' delay="0" mix="0"/>' +
      '</devices>');

    beforeEach(function() {
      spyOn(window.external, 'AppGetPropertyAsync')
        .and.callFake(function(funcName) {
        if (funcName == 'microphonedev2') {
          var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);

          setTimeout(function() {
            window.OnAsyncCallback(asyncId, micDev2Mock);
          },10);

          return asyncId;
        }
      });
    });

    describe ('primary mic', function() {
      var promise;
      beforeEach(function() {
        promise = App.getPrimaryMic();
      });

      it('through a promise', function() {
        expect(promise).toBeInstanceOf(Promise);
      });

      it('as an audioDevice', function(done) {
        promise.then(function(audioDevice) {
          expect(audioDevice).hasMethods('getId, getName, getDataFlow,' +
            ' isDefaultDevice, getLevel, _setLevel, isEnabled, _setEnabled,' +
            ' getSystemLevel, _setSystemLevel, getSystemEnabled,' +
            ' _setSystemEnabled, getDelay, _setDelay, toString');
          expect(audioDevice.toString()).toEqual('<dev id="default:1:0"' +
            ' level="0.900000" enable="1" hwlevel="-1.000000" hwenable="255"' +
            ' delay="0" mix="0"/>');
          done();
        });
      });
    });

    describe ('primary speaker', function() {
      var promise;
      beforeEach(function() {
        promise = App.getPrimarySpeaker();
      });

      it('through a promise', function() {
        expect(promise).toBeInstanceOf(Promise);
      });

      it('as an audioDevice', function(done) {
        promise.then(function(audioDevice) {
          expect(audioDevice).hasMethods('getId, getName, getDataFlow,' +
            ' isDefaultDevice, getLevel, _setLevel, isEnabled, _setEnabled,' +
            ' getSystemLevel, _setSystemLevel, getSystemEnabled,' +
            ' _setSystemEnabled, getDelay, _setDelay, toString');
          expect(audioDevice.toString()).toEqual('<dev id="default:0:0"' +
            ' level="1.500000" enable="1" hwlevel="-1.000000" hwenable="255"' +
            ' delay="0" mix="0"/>');
          done();
        });
      });
    });
  });

  describe ('should be able to set attributes of audio devices', function() {
    window.micDev2 = encodeURIComponent('<devices>' +
        '<dev id="default:1:0" level="1.000000" enable="1"' +
          ' hwlevel="-1.000000" hwenable="255" delay="0" mix="0"/>' +
        '<dev id="default:0:0" level="1.000000" enable="1"' +
          ' hwlevel="-1.000000" hwenable="255" delay="0" mix="0"/>' +
        '<dev id="{0.0.0.00000000}.' +
          '{8a37e9cb-90fd-42d9-9d5b-8d8c43bdb929}" level="1.000000"' +
          ' enable="1" hwlevel="-1.000000" hwenable="255"' +
          ' delay="0" mix="0"/>' +
        '</devices>');

    beforeEach(function() {
      spyOn(window.external, 'AppGetPropertyAsync')
        .and.callFake(function(funcName) {
        if (funcName == 'microphonedev2') {
          var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);

          setTimeout(function() {
            window.OnAsyncCallback(asyncId, micDev2);
          },10);

          return asyncId;
        }
      });

      spyOn(window.external, 'AppSetPropertyAsync')
        .and.callFake(function(funcName, value) {

        if (funcName === 'microphonedev2') {
          micDev2 = encodeURIComponent(value);

          var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);
          setTimeout(function() {
            window.OnAsyncCallback(asyncId, '1');
          }, 10);

          return asyncId;
        }
      });
    });

    describe ('primary mic level', function() {
      var promise;

      it ('through a promise as a number', function(done) {
        promise = App.setPrimaryMicLevel(45);
        expect(promise).toBeInstanceOf(Promise);
        promise.then(function(isSet) {
          expect(isSet).toBe(true);
          return App.getPrimaryMic();
        }).then(function(audioDevice) {
          expect(audioDevice.getLevel()).toEqual(45);
          return App.setPrimaryMicLevel(-25)
        }).then(function(isSet) {
          done.fail('Invalid value was accepted');
        }).catch(function(err) {
          expect(err).toEqual(jasmine.any(Error));
          done();
        });
      });
    });

    describe ('primary mic enabled', function() {
      var promise;

      it ('through a promise as a boolean', function(done) {
        promise = App.setPrimaryMicEnabled(false);
        expect(promise).toBeInstanceOf(Promise);
        promise.then(function(isSet) {
          expect(isSet).toBe(true);
          return App.getPrimaryMic();
        }).then(function(audioDevice) {
          expect(audioDevice.isEnabled()).toBe(false);
          return App.setPrimaryMicEnabled(true);
        }).then(function(isSet) {
          expect(isSet).toBe(true);
          return App.getPrimaryMic();
        }).then(function(audioDevice) {
          expect(audioDevice.isEnabled()).toBe(true);
          done();
        });
      });
    });

    describe ('primary mic system level', function() {
      var promise;

      it ('through a promise as a number', function(done) {
        promise = App.setPrimaryMicSystemLevel(25);
        expect(promise).toBeInstanceOf(Promise);
        promise.then(function(isSet) {
          expect(isSet).toBe(true);
          return App.getPrimaryMic();
        }).then(function(audioDevice) {
          expect(audioDevice.getSystemLevel()).toEqual(25);
          return App.setPrimaryMicSystemLevel(-25)
        }).then(function(isSet) {
          done.fail('Invalid value was accepted');
        }).catch(function(err) {
          expect(err).toEqual(jasmine.any(Error));
          done();
        });
      });
    });

    describe ('primary mic system enabled', function() {
      var promise;

      it ('through a promise as a number', function(done) {
        promise = App.setPrimaryMicSystemEnabled(255);
        expect(promise).toBeInstanceOf(Promise);
        promise.then(function(isSet) {
          expect(isSet).toBe(true);
          return App.getPrimaryMic();
        }).then(function(audioDevice) {
          expect(audioDevice.getSystemEnabled()).toEqual(255);
          return App.setPrimaryMicSystemEnabled(42)
        }).then(function(isSet) {
          done.fail('Invalid value was accepted');
        }).catch(function(err) {
          expect(err).toEqual(jasmine.any(Error));
          done();
        });
      });
    });

    describe ('primary mic delay', function() {
      var promise;

      it ('through a promise as a number', function(done) {
        promise = App.setPrimaryMicDelay(5555);
        expect(promise).toBeInstanceOf(Promise);
        promise.then(function(isSet) {
          expect(isSet).toBe(true);
          return App.getPrimaryMic();
        }).then(function(audioDevice) {
          expect(audioDevice.getDelay()).toEqual(5555);
          return App.setPrimaryMicDelay(-20);
        }).then(function(isSet) {
          done.fail('Invalid value was accepted');
        }).catch(function(err) {
          expect(err).toEqual(jasmine.any(Error));
          done();
        });
      });
    });

    describe ('primary speaker level', function() {
      var promise;

      it ('through a promise as a number', function(done) {
        promise = App.setPrimarySpeakerLevel(45);
        expect(promise).toBeInstanceOf(Promise);
        promise.then(function(isSet) {
          expect(isSet).toBe(true);
          return App.getPrimarySpeaker();
        }).then(function(audioDevice) {
          expect(audioDevice.getLevel()).toEqual(45);
          return App.setPrimarySpeakerLevel(-20);
        }).then(function(isSet) {
          done.fail('Invalid value was accepted');
        }).catch(function(err) {
          expect(err).toEqual(jasmine.any(Error));
          done();
        });
      });
    });

    describe ('primary speaker enabled', function() {
      var promise;

      it ('through a promise as a boolean', function(done) {
        promise = App.setPrimarySpeakerEnabled(false);
        expect(promise).toBeInstanceOf(Promise);
        promise.then(function(isSet) {
          expect(isSet).toBe(true);
          return App.getPrimarySpeaker();
        }).then(function(audioDevice) {
          expect(audioDevice.isEnabled()).toBe(false);
          return App.setPrimarySpeakerEnabled(true);
        }).then(function(isSet) {
          expect(isSet).toBe(true);
          return App.getPrimarySpeaker();
        }).then(function(audioDevice) {
          expect(audioDevice.isEnabled()).toBe(true);
          done();
        });
      });
    });

    describe ('primary speaker system level', function() {
      var promise;

      it ('through a promise as a number', function(done) {
        promise = App.setPrimarySpeakerSystemLevel(25);
        expect(promise).toBeInstanceOf(Promise);
        promise.then(function(isSet) {
          expect(isSet).toBe(true);
          return App.getPrimarySpeaker();
        }).then(function(audioDevice) {
          expect(audioDevice.getSystemLevel()).toEqual(25);
          return App.setPrimarySpeakerSystemLevel(-20);
        }).then(function(isSet) {
          done.fail('Invalid value was accepted');
        }).catch(function(err) {
          expect(err).toEqual(jasmine.any(Error));
          done();
        });
      });
    });

    describe ('primary speaker system enabled', function() {
      var promise;

      it ('through a promise as a number', function(done) {
        promise = App.setPrimarySpeakerSystemEnabled(255);
        expect(promise).toBeInstanceOf(Promise);
        promise.then(function(isSet) {
          expect(isSet).toBe(true);
          return App.getPrimarySpeaker();
        }).then(function(audioDevice) {
          expect(audioDevice.getSystemEnabled()).toEqual(255);
          return App.setPrimarySpeakerSystemEnabled(20);
        }).then(function(isSet) {
          done.fail('Invalid value was accepted');
        }).catch(function(err) {
          expect(err).toEqual(jasmine.any(Error));
          done();
        });
      });
    });

    describe ('primary speaker delay', function() {
      var promise;

      it ('through a promise as a number', function(done) {
        promise = App.setPrimarySpeakerDelay(5555);
        expect(promise).toBeInstanceOf(Promise);
        promise.then(function(isSet) {
          expect(isSet).toBe(true);
          return App.getPrimarySpeaker();
        }).then(function(audioDevice) {
          expect(audioDevice.getDelay()).toEqual(5555);
          return App.setPrimarySpeakerDelay(-20);
        }).then(function(isSet) {
          done.fail('Invalid value was accepted');
        }).catch(function(err) {
          expect(err).toEqual(jasmine.any(Error));
          done();
        });
      });
    });
  });

  describe ('should be able to get silence detection values', function() {
    var promise;
    beforeEach(function() {
      spyOn(window.external, 'AppGetPropertyAsync')
        .and.callFake(function(funcName) {
        if (funcName == 'microphonegain') {
          var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);

          setTimeout(function() {
            window.OnAsyncCallback(asyncId,
              encodeURIComponent('<configuration enable="0" gain="5"' +
                ' latency="1000"/>'));
          },10);

          return asyncId;
        }
      });
    });

    describe ('if silence detection is enabled', function() {
      beforeEach(function() {
        promise = App.isSilenceDetectionEnabled();
      });
      it('through a promise', function() {
        expect(promise).toBeInstanceOf(Promise);
      });

      it('that returns as a boolean', function(done) {
        promise.then(function(isEnabled) {
          expect(isEnabled).toBeTypeOf('boolean');
          done();
        });
      });
    });

    describe ('silence detection threshold', function() {
      beforeEach(function() {
        promise = App.getSilenceDetectionThreshold();
      });
      it('through a promise', function() {
        expect(promise).toBeInstanceOf(Promise);
      });

      it('that returns as a number', function(done) {
        promise.then(function(sdThreshold) {
          expect(sdThreshold).toBeTypeOf('number');
          done();
        });
      });
    });

    describe ('silence detection period', function() {
      beforeEach(function() {
        promise = App.getSilenceDetectionPeriod();
      });
      it('through a promise', function() {
        expect(promise).toBeInstanceOf(Promise);
      });

      it('that returns as a number', function(done) {
        promise.then(function(sdPeriod) {
          expect(sdPeriod).toBeTypeOf('number');
          done();
        });
      });
    });
  });

  describe ('should be able to set silence detection values', function() {
    var audioGainMock =
      encodeURIComponent('<configuration enable="0"' +
        ' gain="5" latency="1000"/>');
    beforeEach(function() {
      spyOn(window.external, 'AppGetPropertyAsync')
        .and.callFake(function(funcName) {
        if (funcName == 'microphonegain') {
          var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);

          setTimeout(function() {
            window.OnAsyncCallback(asyncId, audioGainMock);
          },10);

          return asyncId;
        }
      });
    });

    describe ('enable/disable silence detection', function() {
      var audioGainResultEnable =
        encodeURIComponent('<configuration enable="1"' +
          ' gain="5" latency="1000"/>');
      var silenceDetectionEnabledSet;
      var promise;
      beforeEach(function() {
        spyOn(window.external, 'AppSetPropertyAsync')
          .and.callFake(function(funcName, value) {
          silenceDetectionEnabledSet = false;
          if (funcName === 'microphonegain') {
            if (encodeURIComponent(value) === audioGainResultEnable) {
              silenceDetectionEnabledSet = true;
            }
            var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);
            setTimeout(function() {
              window.OnAsyncCallback(asyncId, '1');
            }, 10);

            return asyncId;
          }
        });
        promise = App.enableSilenceDetection(true);
      });

      it('through a promise', function() {
        expect(promise).toBeInstanceOf(Promise);
      });

      it('as a boolean', function(done) {
        promise.then(function() {
          expect(silenceDetectionEnabledSet).toBe(true);
          done();
        });
      });
    });

    describe ('silence detection threshold', function() {
      var audioGainResultThreshold =
        encodeURIComponent('<configuration enable="0"' +
          ' gain="10" latency="1000"/>');
      var silenceDetectionThresholdSet;
      var promise;
      beforeEach(function() {
        spyOn(window.external, 'AppSetPropertyAsync')
          .and.callFake(function(funcName, value) {
          silenceDetectionThresholdSet = false;
          if (funcName === 'microphonegain') {
            if (encodeURIComponent(value) === audioGainResultThreshold) {
              silenceDetectionThresholdSet = true;
            }
            var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);
            setTimeout(function() {
              window.OnAsyncCallback(asyncId, '1');
            }, 10);

            return asyncId;
          }
        });
        promise = App.setSilenceDetectionThreshold(10);
      });

      it('through a promise', function() {
        expect(promise).toBeInstanceOf(Promise);
      });

      it('as a number', function(done) {
        promise.then(function() {
          expect(silenceDetectionThresholdSet).toBe(true);
          done();
        });
      });

      it('should not be set below 0', function(done) {
        promise = App.setSilenceDetectionThreshold(-1).then(function() {
          done.fail('Invalid value was accepted');
        }).catch(function(err) {
          expect(err).toEqual(jasmine.any(Error));
          done();
        });
      });

      it('should not be set above 128', function(done) {
        promise = App.setSilenceDetectionThreshold(129).then(function() {
          done.fail('Invalid value was accepted');
        }).catch(function(err) {
          expect(err).toEqual(jasmine.any(Error));
          done();
        });
      });

      it('should not allow decimals', function(done) {
        promise = App.setSilenceDetectionThreshold(5.5).then(function() {
          done.fail('Invalid value was accepted');
        }).catch(function(err) {
          expect(err).toEqual(jasmine.any(Error));
          done();
        });
      });

      it('should only accept numbers', function(done) {
        promise = App.setSilenceDetectionThreshold('abcd').then(function() {
          done.fail('Invalid value was accepted');
        }).catch(function(err) {
          expect(err).toEqual(jasmine.any(Error));
          done();
        });
      });
    });

    describe ('silence detection period', function() {
      var audioGainResultPeriod =
        encodeURIComponent('<configuration enable="0"' +
          ' gain="5" latency="5000"/>');
      var silenceDetectionPeriodSet;
      var promise;
      beforeEach(function() {
        spyOn(window.external, 'AppSetPropertyAsync')
          .and.callFake(function(funcName, value) {
          silenceDetectionPeriodSet = false;
          if (funcName === 'microphonegain') {
            if (encodeURIComponent(value) === audioGainResultPeriod) {
              silenceDetectionPeriodSet = true;
            }
            var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);
            setTimeout(function() {
              window.OnAsyncCallback(asyncId, '1');
            }, 10);

            return asyncId;
          }
        });
        promise = App.setSilenceDetectionPeriod(5000);
      });

      it('through a promise', function() {
        expect(promise).toBeInstanceOf(Promise);
      });

      it('as a number', function(done) {
        promise.then(function() {
          expect(silenceDetectionPeriodSet).toBe(true);
          done();
        });
      });

      it('should not be set below 0', function(done) {
        promise = App.setSilenceDetectionPeriod(-1).then(function() {
          done.fail('Invalid value was accepted');
        }).catch(function(err) {
          expect(err).toEqual(jasmine.any(Error));
          done();
        });
      });

      it('should not be set above 60000', function(done) {
        promise = App.setSilenceDetectionPeriod(60001).then(function() {
          done.fail('Invalid value was accepted');
        }).catch(function(err) {
          expect(err).toEqual(jasmine.any(Error));
          done();
        });
      });

      it('should not accept decimals', function(done) {
        promise = App.setSilenceDetectionPeriod(1000.5).then(function() {
          done.fail('Invalid value was accepted');
        }).catch(function(err) {
          expect(err).toEqual(jasmine.any(Error));
          done();
        });
      });

      it('should only accept numbers', function(done) {
        promise = App.setSilenceDetectionPeriod('abcd').then(function() {
          done.fail('Invalid value was accepted');
        }).catch(function(err) {
          expect(err).toEqual(jasmine.any(Error));
          done();
        });
      });
    });
  });

  describe('should get transition', function() {
    beforeEach(function() {
      spyOn(window.external, 'AppGetPropertyAsync')
        .and.callFake(function(funcName) {
        if (funcName == 'transitionid') {
          var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);

          setTimeout(function() {
            window.OnAsyncCallback(asyncId, 'clock');
          },10);

          return asyncId;
        }
      });
    });

    it('through a promise', function() {
      var promise = App.getTransition();
      expect(promise).toBeInstanceOf(Promise);
    });
  });

  describe ('should be able to set transition', function() {
    var transitionSet;
    var promise;
    beforeEach(function() {
      transitionSet = false;
      spyOn(window.external, 'AppSetPropertyAsync')
        .and.callFake(function(funcName, value) {

        if (funcName === 'transitionid' && value == 'clock') {
          transitionSet = true;
          var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);
          setTimeout(function() {
            window.OnAsyncCallback(asyncId, '1');
          }, 10);

          return asyncId;
        }
      });
      promise = App.setTransition(Transition.CLOCK);
    });

    it('through a promise', function() {
      expect(promise).toBeInstanceOf(Promise);
    });

    it('as a Transition object', function(done) {
      promise.then(function() {
        expect(transitionSet).toBe(true);
        done();
      });
    });
  });

  describe('should get transition time', function() {
    beforeEach(function() {
      spyOn(window.external, 'AppGetPropertyAsync')
        .and.callFake(function(funcName) {
        if (funcName == 'transitiontime') {
          var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);

          setTimeout(function() {
            window.OnAsyncCallback(asyncId, '3000');
          },10);

          return asyncId;
        }
      });
    });

    it('through a promise', function() {
      var promise = App.getTransitionTime();
      expect(promise).toBeInstanceOf(Promise);
    });

    it('that always return as a number', function(done) {
      var promise = App.getTransitionTime();
      promise.then(function(count) {
        expect(count).toBeTypeOf('number');
        expect(count).not.toBeNaN();
        done();
      });
    });
  });

  describe ('should be able to set transtion time', function() {
    var transitionTimeSet;
    var promise;
    beforeEach(function() {
      transitionTimeSet = false;
      spyOn(window.external, 'AppSetPropertyAsync')
        .and.callFake(function(funcName, value) {
        if (funcName === 'transitiontime' && typeof value == 'string' && value === '1000') {
          transitionTimeSet = true;
          var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);
          setTimeout(function() {
            window.OnAsyncCallback(asyncId, '1');
          }, 10);

          return asyncId;
        }
      });
      promise = App.setTransitionTime('1000');
    });

    it('through a promise', function() {
      expect(promise).toBeInstanceOf(Promise);
    });

    it('as a string', function(done) {
      promise.then(function() {
        expect(transitionTimeSet).toBe(true);
        done();
      });
    });
  });

  xdescribe('should get presentation', function() {
    beforeEach(function() {
      spyOn(window.external, 'AppGetPropertyAsync')
        .and.callFake(function(funcName) {
        if (funcName == 'version') {
          var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);

          setTimeout(function() {
            window.OnAsyncCallback(asyncId, '1.3.0.429');
          },10);
          return asyncId;

        } else if (funcName == 'preset:0') {
          var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);

          setTimeout(function() {
            window.OnAsyncCallback(asyncId, '0');
          },10);
          return asyncId;

        } else if (funcName == 'sceneconfig') {
          var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);

          setTimeout(function() {
            window.OnAsyncCallback(asyncId,
              encodeURIComponent('<configuration cur="0"' +
                  ' Version="2.4.1506.2436">' +
                '<placement name="Scene 1" defpos="0">' +
                '<item type="8"' +
                  ' item="C:\\Users\\someUser\\Desktop\\someHTML.html"' +
                  ' itemaudio=""' +
                  ' name="C:\\Users\\someUser\\Desktop\\someHTML.html"' +
                  ' cname="" pos_left="0.500000" pos_top="0.000000"' +
                  ' pos_right="1.000000" pos_bottom="0.500000"' +
                  ' crop_left="0.000000" crop_top="0.000000"' +
                  ' crop_right="0.000000" crop_bottom="0.000000" pixalign="0"' +
                  ' zorder="0" volume="100" mute="0" sounddev="0"' +
                  ' lockmove="0" keep_ar="1" fdeinterlace="0" mipmaps="0"' +
                  ' autoresdet="1" visible="1" keeploaded="0" alpha="255"' +
                  ' border="0" cc_pin="0" cc_brightness="0" cc_contrast="0"' +
                  ' cc_hue="0" cc_saturation="0" cc_dynamicrange="0"' +
                  ' key_pin="0" key_antialiasing="2" key_chromakey="0"' +
                  ' key_chromakeytype="0" key_chromahue="0"' +
                  ' key_chromarang="25" key_chromaranga="0" key_chromabr="25"' +
                  ' key_chromasat="25" key_colorrgb="0" key_colorrang="25"' +
                  ' key_colorranga="0" key_chromargbkeyprimary="1"' +
                  ' key_chromargbkeythresh="50" key_chromargbkeybalance="0"' +
                  ' key_smartcamenable="0" key_smartcamconfig="" rotate_x="0"' +
                  ' rotate_y="0" rotate_z="0" rotate_canvas="0"' +
                  ' offset_x="0.000000" offset_y="0.000000" transitionid=""' +
                  ' transitiontime="300" edgeeffectid="" edgeeffectcfg=""' +
                  ' syncid0="1647176425" syncid1="1076850204"' +
                  ' syncid2="3965601720" syncid3="3264523974"' +
                  ' id="{184F6DD0-FA6C-4D63-A8DB-2918DA96342F}"' +
                  ' StreamDelay="0" AudioDelay="0" AudioGainEnable="0"' +
                  ' AudioGain="5" AudioGainLatency="1000" LiveClockSync="0"' +
                  ' InPoint="0" OutPoint="0" CuePoints="" FilePlaylist=""' +
                  ' OpWhenFinished="0" StartOnLoad="1" RememberPosition="1"' +
                  ' LastPosition="0" ShowPosition="0" ScrCapMethod="3"' +
                  ' ScrCapLayered="0" ScrCapOptCapture="1"' +
                  ' ScrCapOptCapture1="1" ScrCapIntResize="1"' +
                  ' ScrCapShowMouse="1" ScrCapShowClicks="1"' +
                  ' ScrCapTrackWindowTitle="0" GameCapShowMouse="0"' +
                  ' GameCapSurfSharing="0" GameCapAlpha="0"' +
                  ' GameCapPlSmooth="1" GameCapPlSmoothness="1.000000"' +
                  ' GameCapTrackActive="0" GameCapTrackActiveFullscreen="1"' +
                  ' GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0"' +
                  ' BrowserSizeY="0" BrowserTransparent="1"' +
                  ' BrowserRightClick="0" BrowserCookiePath=""' +
                  ' BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1"' +
                  ' custom="">' +
                '<presproperty __map_id="customFrameRate">45</presproperty>' +
                '</item>' +
                '<item type="2"' +
                  ' item="@device:pnp:\\\\?\\usb#vid_2040' +
                  '&amp;pid_e524#e524-00-00ac46b7#' +
                  '{65e8773d-8f56-11d0-a3b9-00a0c9223196}' +
                  '\\{9b365890-165f-11d0-a195-0020afd156e4}" itemaudio=""' +
                  ' name="Hauppauge Siena Video Capture" cname=""' +
                  ' pos_left="0.041667" pos_top="0.500000"' +
                  ' pos_right="0.458333" pos_bottom="1.000000"' +
                  ' crop_left="0.000000" crop_top="0.000000"' +
                  ' crop_right="0.000000" crop_bottom="0.000000" pixalign="0"' +
                  ' zorder="1" volume="100" mute="0" sounddev="0"' +
                  ' lockmove="0" keep_ar="1" fdeinterlace="0" mipmaps="0"' +
                  ' autoresdet="1" visible="1" keeploaded="1" alpha="255"' +
                  ' border="0" cc_pin="0" cc_brightness="0" cc_contrast="0"' +
                  ' cc_hue="0" cc_saturation="0" cc_dynamicrange="0"' +
                  ' key_pin="0" key_antialiasing="2" key_chromakey="0"' +
                  ' key_chromakeytype="0" key_chromahue="0"' +
                  ' key_chromarang="25" key_chromaranga="0"' +
                  ' key_chromabr="25" key_chromasat="25" key_colorrgb="0"' +
                  ' key_colorrang="25" key_colorranga="0"' +
                  ' key_chromargbkeyprimary="1" key_chromargbkeythresh="50"' +
                  ' key_chromargbkeybalance="0" key_smartcamenable="0"' +
                  ' key_smartcamconfig="" rotate_x="0" rotate_y="0"' +
                  ' rotate_z="0" rotate_canvas="0" offset_x="0.000000"' +
                  ' offset_y="0.000000" transitionid="" transitiontime="300"' +
                  ' edgeeffectid="" edgeeffectcfg="" syncid0="488956032"' +
                  ' syncid1="1169765002" syncid2="467211910"' +
                  ' syncid3="833395392"' +
                  ' id="{6EB30E5E-83D6-4ADD-9E12-6B718D40DAAE}"' +
                  ' StreamDelay="0" AudioDelay="0" AudioGainEnable="0"' +
                  ' AudioGain="5" AudioGainLatency="1000" LiveClockSync="0"' +
                  ' InPoint="0" OutPoint="0" CuePoints="" FilePlaylist=""' +
                  ' OpWhenFinished="0" StartOnLoad="1" RememberPosition="1"' +
                  ' LastPosition="0" ShowPosition="0" ScrCapMethod="3"' +
                  ' ScrCapLayered="0" ScrCapOptCapture="1"' +
                  ' ScrCapOptCapture1="1" ScrCapIntResize="1"' +
                  ' ScrCapShowMouse="1" ScrCapShowClicks="1"' +
                  ' ScrCapTrackWindowTitle="0" GameCapShowMouse="0"' +
                  ' GameCapSurfSharing="0" GameCapAlpha="0"' +
                  ' GameCapPlSmooth="1" GameCapPlSmoothness="1.000000"' +
                  ' GameCapTrackActive="0" GameCapTrackActiveFullscreen="1"' +
                  ' GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0"' +
                  ' BrowserSizeY="0" BrowserTransparent="1"' +
                  ' BrowserRightClick="0" BrowserCookiePath=""' +
                  ' BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1"' +
                  ' custom="" />' +
                '</placement>' +
                '<placement name="Scene 2" defpos="2">' +
                '<item type="5"' +
                  ' item="&lt;screen module=&quot;\\device\\harddiskvolume2' +
                  '\\program files (x86)\\google\\chrome\\application' +
                  '\\chrome.exe&quot;' +
                  ' window=&quot;someUser - Google Chrome&quot;' +
                  ' hwnd=&quot;0&quot; wclient=&quot;1&quot;' +
                  ' left=&quot;1595&quot; top=&quot;557&quot;' +
                  ' width=&quot;199&quot; height=&quot;200&quot;/&gt;"' +
                  ' itemaudio=""' +
                  ' name="Window region &quot;' +
                  'someWebsite - Google Chrome&quot; in &quot;chrome.exe&quot;' +
                  ' process (1595, 557) - 199 x 200" cname=""' +
                  ' pos_left="0.000000" pos_top="0.000000"' +
                  ' pos_right="1.000000" pos_bottom="1.000000"' +
                  ' crop_left="0.000000" crop_top="0.000000"' +
                  ' crop_right="0.000000" crop_bottom="0.000000"' +
                  ' pixalign="0" zorder="1" volume="100" mute="0"' +
                  ' sounddev="0" lockmove="0" keep_ar="1" fdeinterlace="0"' +
                  ' mipmaps="0" autoresdet="1" visible="1" keeploaded="0"' +
                  ' alpha="255" border="0" cc_pin="0" cc_brightness="0"' +
                  ' cc_contrast="0" cc_hue="0" cc_saturation="0"' +
                  ' cc_dynamicrange="0" key_pin="0" key_antialiasing="2"' +
                  ' key_chromakey="0" key_chromakeytype="0" key_chromahue="0"' +
                  ' key_chromarang="25" key_chromaranga="0" key_chromabr="25"' +
                  ' key_chromasat="25" key_colorrgb="0" key_colorrang="25"' +
                  ' key_colorranga="0" key_chromargbkeyprimary="1"' +
                  ' key_chromargbkeythresh="50" key_chromargbkeybalance="0"' +
                  ' key_smartcamenable="0" key_smartcamconfig="" rotate_x="0"' +
                  ' rotate_y="0" rotate_z="0" rotate_canvas="0"' +
                  ' offset_x="0.000000" offset_y="0.000000" transitionid=""' +
                  ' transitiontime="300" edgeeffectid="" edgeeffectcfg=""' +
                  ' syncid0="131555942" syncid1="1339295260"' +
                  ' syncid2="288356024" syncid3="2798519834"' +
                  ' id="{884D30B1-0BE9-4B06-868D-F68C70EB7292}"' +
                  ' StreamDelay="0" AudioDelay="0" AudioGainEnable="0"' +
                  ' AudioGain="5" AudioGainLatency="1000" LiveClockSync="0"' +
                  ' InPoint="0" OutPoint="0" CuePoints="" FilePlaylist=""' +
                  ' OpWhenFinished="0" StartOnLoad="1" RememberPosition="1"' +
                  ' LastPosition="0" ShowPosition="0" ScrCapMethod="3"' +
                  ' ScrCapLayered="1" ScrCapOptCapture="1"' +
                  ' ScrCapOptCapture1="1" ScrCapIntResize="1"' +
                  ' ScrCapShowMouse="1" ScrCapShowClicks="1"' +
                  ' ScrCapTrackWindowTitle="0" GameCapShowMouse="0"' +
                  ' GameCapSurfSharing="0" GameCapAlpha="0"' +
                  ' GameCapPlSmooth="1" GameCapPlSmoothness="1.000000"' +
                  ' GameCapTrackActive="0" GameCapTrackActiveFullscreen="1"' +
                  ' GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0"' +
                  ' BrowserSizeY="0" BrowserTransparent="1"' +
                  ' BrowserRightClick="0" BrowserCookiePath=""' +
                  ' BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1"' +
                  ' custom="" />' +
                '<item type="8"' +
                  ' item="C:\\Users\\someUser\\Desktop\\anotherHTML.html"' +
                  ' itemaudio=""' +
                  ' name="C:\\Users\\someUser\\Desktop\\anotherHTML.html"' +
                  ' cname="" pos_left="0.244792" pos_top="0.230000"' +
                  ' pos_right="0.744792" pos_bottom="0.730000"' +
                  ' crop_left="0.000000" crop_top="0.000000"' +
                  ' crop_right="0.000000" crop_bottom="0.000000" pixalign="0"' +
                  ' zorder="2" volume="100" mute="0" sounddev="0" lockmove="0"' +
                  ' keep_ar="1" fdeinterlace="0" mipmaps="0" autoresdet="1"' +
                  ' visible="1" keeploaded="0" alpha="255" border="0"' +
                  ' cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0"' +
                  ' cc_saturation="0" cc_dynamicrange="0" key_pin="0"' +
                  ' key_antialiasing="2" key_chromakey="0"' +
                  ' key_chromakeytype="0" key_chromahue="0"' +
                  ' key_chromarang="25" key_chromaranga="0" key_chromabr="25"' +
                  ' key_chromasat="25" key_colorrgb="0" key_colorrang="25"' +
                  ' key_colorranga="0" key_chromargbkeyprimary="1"' +
                  ' key_chromargbkeythresh="50" key_chromargbkeybalance="0"' +
                  ' key_smartcamenable="0" key_smartcamconfig="" rotate_x="0"' +
                  ' rotate_y="0" rotate_z="0" rotate_canvas="0"' +
                  ' offset_x="0.000000" offset_y="0.000000" transitionid=""' +
                  ' transitiontime="300" edgeeffectid="" edgeeffectcfg=""' +
                  ' syncid0="4128815318" syncid1="1271341976"' +
                  ' syncid2="757777802" syncid3="1518631024"' +
                  ' id="{7B42E361-9211-46D5-BEDD-1FE6010193EF}"' +
                  ' StreamDelay="0" AudioDelay="0" AudioGainEnable="0"' +
                  ' AudioGain="5" AudioGainLatency="1000" LiveClockSync="0"' +
                  ' InPoint="0" OutPoint="0" CuePoints="" FilePlaylist=""' +
                  ' OpWhenFinished="0" StartOnLoad="1" RememberPosition="1"' +
                  ' LastPosition="0" ShowPosition="0" ScrCapMethod="3"' +
                  ' ScrCapLayered="0" ScrCapOptCapture="1"' +
                  ' ScrCapOptCapture1="1" ScrCapIntResize="1"' +
                  ' ScrCapShowMouse="1" ScrCapShowClicks="1"' +
                  ' ScrCapTrackWindowTitle="0" GameCapShowMouse="0"' +
                  ' GameCapSurfSharing="0" GameCapAlpha="0"' +
                  ' GameCapPlSmooth="1" GameCapPlSmoothness="1.000000"' +
                  ' GameCapTrackActive="0" GameCapTrackActiveFullscreen="1"' +
                  ' GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0"' +
                  ' BrowserSizeY="0" BrowserTransparent="1"' +
                  ' BrowserRightClick="0" BrowserCookiePath=""' +
                  ' BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1"' +
                  ' custom="" />' +
                '<item type="4"' +
                  ' item="C:\\Users\\someUser\\Downloads\\someImage.jpg"' +
                  ' itemaudio="" name="C:\\Users\\someUser\\Downloads' +
                  '\\someImage.jpg" cname="" pos_left="0.291667"' +
                  ' pos_top="0.250000" pos_right="0.708333"' +
                  ' pos_bottom="0.750000" crop_left="0.000000"' +
                  ' crop_top="0.000000" crop_right="0.000000"' +
                  ' crop_bottom="0.000000" pixalign="0" zorder="3"' +
                  ' volume="100" mute="0" sounddev="0" lockmove="0"' +
                  ' keep_ar="1" fdeinterlace="0" mipmaps="0" autoresdet="1"' +
                  ' visible="1" keeploaded="0" alpha="255" border="0"' +
                  ' cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0"' +
                  ' cc_saturation="0" cc_dynamicrange="0" key_pin="0"' +
                  ' key_antialiasing="2" key_chromakey="0"' +
                  ' key_chromakeytype="0" key_chromahue="0"' +
                  ' key_chromarang="25" key_chromaranga="0" key_chromabr="25"' +
                  ' key_chromasat="25" key_colorrgb="0" key_colorrang="25"' +
                  ' key_colorranga="0" key_chromargbkeyprimary="1"' +
                  ' key_chromargbkeythresh="50" key_chromargbkeybalance="0"' +
                  ' key_smartcamenable="0" key_smartcamconfig="" rotate_x="0"' +
                  ' rotate_y="0" rotate_z="0" rotate_canvas="0"' +
                  ' offset_x="0.000000" offset_y="0.000000" transitionid=""' +
                  ' transitiontime="300" edgeeffectid="" edgeeffectcfg=""' +
                  ' syncid0="3419618605" syncid1="1077747655"' +
                  ' syncid2="661021372" syncid3="830915735"' +
                  ' id="{956F3AA6-2A1A-43FA-8117-333800B98E73}"' +
                  ' StreamDelay="0" AudioDelay="0" AudioGainEnable="0"' +
                  ' AudioGain="5" AudioGainLatency="1000" LiveClockSync="0"' +
                  ' InPoint="0" OutPoint="0" CuePoints="" FilePlaylist=""' +
                  ' OpWhenFinished="0" StartOnLoad="1" RememberPosition="1"' +
                  ' LastPosition="0" ShowPosition="0" ScrCapMethod="3"' +
                  ' ScrCapLayered="0" ScrCapOptCapture="1"' +
                  ' ScrCapOptCapture1="1" ScrCapIntResize="1"' +
                  ' ScrCapShowMouse="1" ScrCapShowClicks="1"' +
                  ' ScrCapTrackWindowTitle="0" GameCapShowMouse="0"' +
                  ' GameCapSurfSharing="0" GameCapAlpha="0"' +
                  ' GameCapPlSmooth="1" GameCapPlSmoothness="1.000000"' +
                  ' GameCapTrackActive="0" GameCapTrackActiveFullscreen="1"' +
                  ' GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0"' +
                  ' BrowserSizeY="0" BrowserTransparent="1"' +
                  ' BrowserRightClick="0" BrowserCookiePath=""' +
                  ' BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1"' +
                  ' custom="" />' +
                '<item type="2"' +
                  ' item="@device:sw:{860BB310-5D01-11D0-BD3B-00A0C911CE86}' +
                  '\\{44A8B5C7-13B6-4211-BD40-35B629D9E6DF}" itemaudio=""' +
                  ' name="Decklink Video Capture" cname="" pos_left="0.000000"' +
                  ' pos_top="0.000000" pos_right="0.500000"' +
                  ' pos_bottom="0.500000" crop_left="0.000000"' +
                  ' crop_top="0.000000" crop_right="0.000000"' +
                  ' crop_bottom="0.000000" pixalign="0" zorder="4"' +
                  ' volume="100" mute="0" sounddev="0" lockmove="0"' +
                  ' keep_ar="1" fdeinterlace="0" mipmaps="0" autoresdet="1"' +
                  ' visible="1" keeploaded="1" alpha="255" border="0"' +
                  ' cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0"' +
                  ' cc_saturation="0" cc_dynamicrange="0" key_pin="0"' +
                  ' key_antialiasing="2" key_chromakey="0"' +
                  ' key_chromakeytype="0" key_chromahue="0"' +
                  ' key_chromarang="25" key_chromaranga="0"' +
                  ' key_chromabr="25" key_chromasat="25" key_colorrgb="0"' +
                  ' key_colorrang="25" key_colorranga="0"' +
                  ' key_chromargbkeyprimary="1" key_chromargbkeythresh="50"' +
                  ' key_chromargbkeybalance="0" key_smartcamenable="0"' +
                  ' key_smartcamconfig="" rotate_x="0" rotate_y="0"' +
                  ' rotate_z="0" rotate_canvas="0" offset_x="0.000000"' +
                  ' offset_y="0.000000" transitionid="" transitiontime="300"' +
                  ' edgeeffectid="" edgeeffectcfg="" syncid0="4209941579"' +
                  ' syncid1="1168964882" syncid2="2406534042"' +
                  ' syncid3="2327558341"' +
                  ' id="{2F5AC444-3494-4568-8D96-5DABD17D5168}"' +
                  ' StreamDelay="0" AudioDelay="0" AudioGainEnable="0"' +
                  ' AudioGain="5" AudioGainLatency="1000" LiveClockSync="0"' +
                  ' InPoint="0" OutPoint="0" CuePoints="" FilePlaylist=""' +
                  ' OpWhenFinished="0" StartOnLoad="1" RememberPosition="1"' +
                  ' LastPosition="0" ShowPosition="0" ScrCapMethod="3"' +
                  ' ScrCapLayered="0" ScrCapOptCapture="1"' +
                  ' ScrCapOptCapture1="1" ScrCapIntResize="1"' +
                  ' ScrCapShowMouse="1" ScrCapShowClicks="1"' +
                  ' ScrCapTrackWindowTitle="0" GameCapShowMouse="0"' +
                  ' GameCapSurfSharing="0" GameCapAlpha="0"' +
                  ' GameCapPlSmooth="1" GameCapPlSmoothness="1.000000"' +
                  ' GameCapTrackActive="0" GameCapTrackActiveFullscreen="1"' +
                  ' GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0"' +
                  ' BrowserSizeY="0" BrowserTransparent="1"' +
                  ' BrowserRightClick="0" BrowserCookiePath=""' +
                  ' BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1"' +
                  ' custom="" />' +
                '<item type="7"' +
                  ' item="&lt;src pid=&quot;0&quot; handle=&quot;0&quot;' +
                  ' GapiType=&quot;&quot; width=&quot;0&quot;' +
                  ' height=&quot;0&quot; imagename=&quot;skype.exe&quot;' +
                  ' replace=&quot;skype_logo.png&quot; /&gt;" itemaudio=""' +
                  ' name="Skype" cname="" pos_left="0.500000"' +
                  ' pos_top="0.000000" pos_right="1.000000"' +
                  ' pos_bottom="0.500000" crop_left="0.000000"' +
                  ' crop_top="0.000000" crop_right="0.000000"' +
                  ' crop_bottom="0.000000" pixalign="0" zorder="5"' +
                  ' volume="100" mute="0" sounddev="0" lockmove="0"' +
                  ' keep_ar="1" fdeinterlace="0" mipmaps="1" autoresdet="1"' +
                  ' visible="1" keeploaded="0" alpha="255" border="0"' +
                  ' cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0"' +
                  ' cc_saturation="0" cc_dynamicrange="0" key_pin="0"' +
                  ' key_antialiasing="2" key_chromakey="0"' +
                  ' key_chromakeytype="0" key_chromahue="0"' +
                  ' key_chromarang="25" key_chromaranga="0"' +
                  ' key_chromabr="25" key_chromasat="25" key_colorrgb="0"' +
                  ' key_colorrang="25" key_colorranga="0"' +
                  ' key_chromargbkeyprimary="1" key_chromargbkeythresh="50"' +
                  ' key_chromargbkeybalance="0" key_smartcamenable="0"' +
                  ' key_smartcamconfig="" rotate_x="0" rotate_y="0"' +
                  ' rotate_z="0" rotate_canvas="0" offset_x="0.000000"' +
                  ' offset_y="0.000000" transitionid="" transitiontime="300"' +
                  ' edgeeffectid="" edgeeffectcfg="" syncid0="1457156359"' +
                  ' syncid1="1117101308" syncid2="3357030320"' +
                  ' syncid3="3903824253"' +
                  ' id="{83BA3C7F-7A79-4E67-B84B-D538E4CA5E2A}"' +
                  ' StreamDelay="0" AudioDelay="0" AudioGainEnable="0"' +
                  ' AudioGain="5" AudioGainLatency="1000" LiveClockSync="0"' +
                  ' InPoint="0" OutPoint="0" CuePoints="" FilePlaylist=""' +
                  ' OpWhenFinished="0" StartOnLoad="1" RememberPosition="1"' +
                  ' LastPosition="0" ShowPosition="0" ScrCapMethod="3"' +
                  ' ScrCapLayered="0" ScrCapOptCapture="1"' +
                  ' ScrCapOptCapture1="1" ScrCapIntResize="1"' +
                  ' ScrCapShowMouse="1" ScrCapShowClicks="1"' +
                  ' ScrCapTrackWindowTitle="0" GameCapShowMouse="0"' +
                  ' GameCapSurfSharing="1" GameCapAlpha="0"' +
                  ' GameCapPlSmooth="1" GameCapPlSmoothness="1.000000"' +
                  ' GameCapTrackActive="0" GameCapTrackActiveFullscreen="1"' +
                  ' GameCapHideInactive="1" BrowserJs="" BrowserSizeX="0"' +
                  ' BrowserSizeY="0" BrowserTransparent="1"' +
                  ' BrowserRightClick="0" BrowserCookiePath=""' +
                  ' BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1"' +
                  ' custom="" />' +
                '</placement>' +
                '<placement name="Scene 3" defpos="0" />' +
                '<placement name="Scene 4" defpos="0" />' +
                '<placement name="Scene 5" defpos="0" />' +
                '<global>' +
                '<camera' +
                  ' id="obj-moniker-@device:pnp:\\\\?\\usb#vid_2040' +
                  '&amp;pid_e524#e524-00-00ac46b7' +
                  '#{65e8773d-8f56-11d0-a3b9-00a0c9223196}' +
                  '\\{9b365890-165f-11d0-a195-0020afd156e4}" width="0"' +
                  ' height="0" frametime="0"' +
                  ' videosubtype="{00000000-0000-0000-0000-000000000000}"' +
                  ' xbarroute1="" xbarroute2="" vpersist="" apersist="" />' +
                '<camera' +
                  ' id="obj-moniker-@device:sw:' +
                  '{860bb310-5d01-11d0-bd3b-00a0c911ce86}' +
                  '\\{44a8b5c7-13b6-4211-bd40-35b629d9e6df}" width="0"' +
                  ' height="0" frametime="0"' +
                  ' videosubtype="{00000000-0000-0000-0000-000000000000}"' +
                  ' xbarroute1="" xbarroute2="" vpersist="" apersist="" />' +
                '</global>' +
                '</configuration>'));
          },10);
          return asyncId;

        // add these below only because each scene has separate getting of sources
        // this should be addressed to reuse the initial call for presetconfig
        } else if (funcName == 'sceneconfig:0') {
          var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);

          setTimeout(function() {
            window.OnAsyncCallback(asyncId,
              encodeURIComponent('<placement name="Scene 1" defpos="0">' +
                '<item type="8" item="C:\\Users\\meso\\Desktop\\' +
                  'sample_get.html" itemaudio=""' +
                  ' name="C:\\Users\\meso\\Desktop\\sample_get.html"' +
                  ' cname="" pos_left="0.500000" pos_top="0.000000"' +
                  ' pos_right="1.000000" pos_bottom="0.500000"' +
                  ' crop_left="0.000000" crop_top="0.000000"' +
                  ' crop_right="0.000000" crop_bottom="0.000000"' +
                  ' pixalign="0" zorder="0" volume="100" mute="0"' +
                  ' sounddev="0" lockmove="0" keep_ar="1" fdeinterlace="0"' +
                  ' mipmaps="0" autoresdet="1" visible="1" keeploaded="0"' +
                  ' alpha="255" border="0" cc_pin="0" cc_brightness="0"' +
                  ' cc_contrast="0" cc_hue="0" cc_saturation="0"' +
                  ' cc_dynamicrange="0" key_pin="0" key_antialiasing="2"' +
                  ' key_chromakey="0" key_chromakeytype="0"' +
                  ' key_chromahue="0" key_chromarang="25"' +
                  ' key_chromaranga="0" key_chromabr="25"' +
                  ' key_chromasat="25" key_colorrgb="0" key_colorrang="25"' +
                  ' key_colorranga="0" key_chromargbkeyprimary="1"' +
                  ' key_chromargbkeythresh="50" key_chromargbkeybalance="0"' +
                  ' key_smartcamenable="0" key_smartcamconfig="" rotate_x="0"' +
                  ' rotate_y="0" rotate_z="0" rotate_canvas="0"' +
                  ' offset_x="0.000000" offset_y="0.000000" transitionid=""' +
                  ' transitiontime="300" edgeeffectid="" edgeeffectcfg=""' +
                  ' syncid0="1647176425" syncid1="1076850204"' +
                  ' syncid2="3965601720" syncid3="3264523974"' +
                  ' id="{184F6DD0-FA6C-4D63-A8DB-2918DA96342F}"' +
                  ' StreamDelay="0" AudioDelay="0" AudioGainEnable="0"' +
                  ' AudioGain="5" AudioGainLatency="1000" LiveClockSync="0"' +
                  ' InPoint="0" OutPoint="0" CuePoints="" FilePlaylist=""' +
                  ' OpWhenFinished="0" StartOnLoad="1" RememberPosition="1"' +
                  ' LastPosition="0" ShowPosition="0" ScrCapMethod="3"' +
                  ' ScrCapLayered="0" ScrCapOptCapture="1"' +
                  ' ScrCapOptCapture1="1" ScrCapIntResize="1"' +
                  ' ScrCapShowMouse="1" ScrCapShowClicks="1"' +
                  ' ScrCapTrackWindowTitle="0" GameCapShowMouse="0"' +
                  ' GameCapSurfSharing="0" GameCapAlpha="0"' +
                  ' GameCapPlSmooth="1" GameCapPlSmoothness="1.000000"' +
                  ' GameCapTrackActive="0" GameCapTrackActiveFullscreen="1"' +
                  ' GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0"' +
                  ' BrowserSizeY="0" BrowserTransparent="1"' +
                  ' BrowserRightClick="0" BrowserCookiePath=""' +
                  ' BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1"' +
                  ' custom="">' +
                  '<presproperty __map_id="customFrameRate">45</presproperty>' +
                  '</item>' +
                '<item type="2"' +
                  ' item="@device:pnp:\\\\?\\usb#vid_2040' +
                  '&amp;pid_e524#e524-00-00ac46b7' +
                  '#{65e8773d-8f56-11d0-a3b9-00a0c9223196}' +
                  '\\{9b365890-165f-11d0-a195-0020afd156e4}" itemaudio=""' +
                  ' name="Hauppauge Siena Video Capture" cname=""' +
                  ' pos_left="0.041667" pos_top="0.500000"' +
                  ' pos_right="0.458333" pos_bottom="1.000000"' +
                  ' crop_left="0.000000" crop_top="0.000000"' +
                  ' crop_right="0.000000" crop_bottom="0.000000" pixalign="0"' +
                  ' zorder="1" volume="100" mute="0" sounddev="0"' +
                  ' lockmove="0" keep_ar="1" fdeinterlace="0" mipmaps="0"' +
                  ' autoresdet="1" visible="1" keeploaded="1" alpha="255"' +
                  ' border="0" cc_pin="0" cc_brightness="0" cc_contrast="0"' +
                  ' cc_hue="0" cc_saturation="0" cc_dynamicrange="0"' +
                  ' key_pin="0" key_antialiasing="2" key_chromakey="0"' +
                  ' key_chromakeytype="0" key_chromahue="0"' +
                  ' key_chromarang="25" key_chromaranga="0" key_chromabr="25"' +
                  ' key_chromasat="25" key_colorrgb="0" key_colorrang="25"' +
                  ' key_colorranga="0" key_chromargbkeyprimary="1"' +
                  ' key_chromargbkeythresh="50" key_chromargbkeybalance="0"' +
                  ' key_smartcamenable="0" key_smartcamconfig="" rotate_x="0"' +
                  ' rotate_y="0" rotate_z="0" rotate_canvas="0"' +
                  ' offset_x="0.000000" offset_y="0.000000" transitionid=""' +
                  ' transitiontime="300" edgeeffectid="" edgeeffectcfg=""' +
                  ' syncid0="488956032" syncid1="1169765002"' +
                  ' syncid2="467211910" syncid3="833395392"' +
                  ' id="{6EB30E5E-83D6-4ADD-9E12-6B718D40DAAE}"' +
                  ' StreamDelay="0" AudioDelay="0" AudioGainEnable="0"' +
                  ' AudioGain="5" AudioGainLatency="1000" LiveClockSync="0"' +
                  ' InPoint="0" OutPoint="0" CuePoints="" FilePlaylist=""' +
                  ' OpWhenFinished="0" StartOnLoad="1" RememberPosition="1"' +
                  ' LastPosition="0" ShowPosition="0" ScrCapMethod="3"' +
                  ' ScrCapLayered="0" ScrCapOptCapture="1"' +
                  ' ScrCapOptCapture1="1" ScrCapIntResize="1"' +
                  ' ScrCapShowMouse="1" ScrCapShowClicks="1"' +
                  ' ScrCapTrackWindowTitle="0" GameCapShowMouse="0"' +
                  ' GameCapSurfSharing="0" GameCapAlpha="0"' +
                  ' GameCapPlSmooth="1" GameCapPlSmoothness="1.000000"' +
                  ' GameCapTrackActive="0" GameCapTrackActiveFullscreen="1"' +
                  ' GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0"' +
                  ' BrowserSizeY="0" BrowserTransparent="1"' +
                  ' BrowserRightClick="0" BrowserCookiePath=""' +
                  ' BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1"' +
                  ' custom="" />' +
                '</placement>'));
          },10);
          return asyncId;

        } else if (funcName == 'sceneconfig:1') {
          var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);

          setTimeout(function() {
            window.OnAsyncCallback(asyncId,
              encodeURIComponent('<item type="1"' +
                ' item="C:\\wamp\\www\\someFolder\\anotherFolder' +
                  '\\images\\someImage.png" itemaudio=""' +
                  ' name="C:\\wamp\\www\\someFolder\\anotherFolder' +
                  '\\images\\someImage.png" cname="" pos_left="-0.001041"' +
                  ' pos_top="0.633500" pos_right="0.498959"' +
                  ' pos_bottom="0.996499" crop_left="0.000000"' +
                  ' crop_top="0.000000" crop_right="0.000000"' +
                  ' crop_bottom="0.000000" pixalign="0" zorder="0"' +
                  ' volume="100" mute="0" sounddev="0" lockmove="0"' +
                  ' keep_ar="1" fdeinterlace="0" mipmaps="0" autoresdet="1"' +
                  ' visible="1" keeploaded="0" alpha="255" border="0"' +
                  ' cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0"' +
                  ' cc_saturation="0" cc_dynamicrange="0" key_pin="0"' +
                  ' key_antialiasing="2" key_chromakey="0"' +
                  ' key_chromakeytype="0" key_chromahue="0"' +
                  ' key_chromarang="25" key_chromaranga="0"' +
                  ' key_chromabr="25" key_chromasat="25" key_colorrgb="0"' +
                  ' key_colorrang="25" key_colorranga="0"' +
                  ' key_chromargbkeyprimary="1" key_chromargbkeythresh="50"' +
                  ' key_chromargbkeybalance="0" key_smartcamenable="0"' +
                  ' key_smartcamconfig="" rotate_x="0" rotate_y="0"' +
                  ' rotate_z="0" rotate_canvas="0" offset_x="0.000000"' +
                  ' offset_y="0.000000" transitionid="" transitiontime="300"' +
                  ' edgeeffectid="" edgeeffectcfg="" syncid0="2279109013"' +
                  ' syncid1="1179069397" syncid2="3329546388"' +
                  ' syncid3="1772619937"' +
                  ' id="{83F21AE6-B6A2-431E-B7A1-95A6DA94C7E7}"' +
                  ' StreamDelay="0" AudioDelay="0" AudioGainEnable="0"' +
                  ' AudioGain="5" AudioGainLatency="1000" LiveClockSync="0"' +
                  ' InPoint="0" OutPoint="0" CuePoints="" FilePlaylist=""' +
                  ' OpWhenFinished="0" StartOnLoad="1" RememberPosition="1"' +
                  ' LastPosition="0" ShowPosition="0" ScrCapMethod="3"' +
                  ' ScrCapLayered="0" ScrCapOptCapture="1"' +
                  ' ScrCapOptCapture1="1" ScrCapIntResize="1"' +
                  ' ScrCapShowMouse="1" ScrCapShowClicks="1"' +
                  ' ScrCapTrackWindowTitle="0" GameCapShowMouse="0"' +
                  ' GameCapSurfSharing="0" GameCapAlpha="0"' +
                  ' GameCapPlSmooth="1" GameCapPlSmoothness="1.000000"' +
                  ' GameCapTrackActive="0" GameCapTrackActiveFullscreen="1"' +
                  ' GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0"' +
                  ' BrowserSizeY="0" BrowserTransparent="1"' +
                  ' BrowserRightClick="0" BrowserCookiePath=""' +
                  ' BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1"' +
                  ' custom="" />' +
                '<item type="5"' +
                  ' item="&lt;screen module=&quot;\\device\\harddiskvolume2' +
                  '\\program files (x86)\\google\\chrome\\application' +
                  '\\chrome.exe&quot;' +
                  ' window=&quot;someUser - Google Chrome&quot;' +
                  ' hwnd=&quot;0&quot; wclient=&quot;1&quot;' +
                  ' left=&quot;1595&quot; top=&quot;557&quot;' +
                  ' width=&quot;199&quot; height=&quot;200&quot;/&gt;"' +
                  ' itemaudio=""' +
                  ' name="Window region &quot;someUser - Google Chrome&quot;' +
                  ' in &quot;chrome.exe&quot; process (1595, 557) - 199 x 200"' +
                  ' cname="" pos_left="0.000000" pos_top="0.000000"' +
                  ' pos_right="1.000000" pos_bottom="1.000000"' +
                  ' crop_left="0.000000" crop_top="0.000000"' +
                  ' crop_right="0.000000" crop_bottom="0.000000"' +
                  ' pixalign="0" zorder="1" volume="100" mute="0"' +
                  ' sounddev="0" lockmove="0" keep_ar="1" fdeinterlace="0"' +
                  ' mipmaps="0" autoresdet="1" visible="1" keeploaded="0"' +
                  ' alpha="255" border="0" cc_pin="0" cc_brightness="0"' +
                  ' cc_contrast="0" cc_hue="0" cc_saturation="0"' +
                  ' cc_dynamicrange="0" key_pin="0" key_antialiasing="2"' +
                  ' key_chromakey="0" key_chromakeytype="0" key_chromahue="0"' +
                  ' key_chromarang="25" key_chromaranga="0" key_chromabr="25"' +
                  ' key_chromasat="25" key_colorrgb="0" key_colorrang="25"' +
                  ' key_colorranga="0" key_chromargbkeyprimary="1"' +
                  ' key_chromargbkeythresh="50" key_chromargbkeybalance="0"' +
                  ' key_smartcamenable="0" key_smartcamconfig="" rotate_x="0"' +
                  ' rotate_y="0" rotate_z="0" rotate_canvas="0"' +
                  ' offset_x="0.000000" offset_y="0.000000" transitionid=""' +
                  ' transitiontime="300" edgeeffectid="" edgeeffectcfg=""' +
                  ' syncid0="131555942" syncid1="1339295260"' +
                  ' syncid2="288356024" syncid3="2798519834"' +
                  ' id="{884D30B1-0BE9-4B06-868D-F68C70EB7292}"' +
                  ' StreamDelay="0" AudioDelay="0" AudioGainEnable="0"' +
                  ' AudioGain="5" AudioGainLatency="1000" LiveClockSync="0"' +
                  ' InPoint="0" OutPoint="0" CuePoints="" FilePlaylist=""' +
                  ' OpWhenFinished="0" StartOnLoad="1" RememberPosition="1"' +
                  ' LastPosition="0" ShowPosition="0" ScrCapMethod="3"' +
                  ' ScrCapLayered="1" ScrCapOptCapture="1"' +
                  ' ScrCapOptCapture1="1" ScrCapIntResize="1"' +
                  ' ScrCapShowMouse="1" ScrCapShowClicks="1"' +
                  ' ScrCapTrackWindowTitle="0" GameCapShowMouse="0"' +
                  ' GameCapSurfSharing="0" GameCapAlpha="0"' +
                  ' GameCapPlSmooth="1" GameCapPlSmoothness="1.000000"' +
                  ' GameCapTrackActive="0" GameCapTrackActiveFullscreen="1"' +
                  ' GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0"' +
                  ' BrowserSizeY="0" BrowserTransparent="1"' +
                  ' BrowserRightClick="0" BrowserCookiePath=""' +
                  ' BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1"' +
                  ' custom="" />' +
                '<item type="8"' +
                  ' item="C:\\Users\\user\\Desktop\\someHTML.html"' +
                  ' itemaudio=""' +
                  ' name="C:\\Users\\user\\Desktop\\someHTML.html" cname=""' +
                  ' pos_left="0.244792" pos_top="0.230000"' +
                  ' pos_right="0.744792" pos_bottom="0.730000"' +
                  ' crop_left="0.000000" crop_top="0.000000"' +
                  ' crop_right="0.000000" crop_bottom="0.000000" pixalign="0"' +
                  ' zorder="2" volume="100" mute="0" sounddev="0"' +
                  ' lockmove="0" keep_ar="1" fdeinterlace="0" mipmaps="0"' +
                  ' autoresdet="1" visible="1" keeploaded="0" alpha="255"' +
                  ' border="0" cc_pin="0" cc_brightness="0" cc_contrast="0"' +
                  ' cc_hue="0" cc_saturation="0" cc_dynamicrange="0"' +
                  ' key_pin="0" key_antialiasing="2" key_chromakey="0"' +
                  ' key_chromakeytype="0" key_chromahue="0"' +
                  ' key_chromarang="25" key_chromaranga="0" key_chromabr="25"' +
                  ' key_chromasat="25" key_colorrgb="0" key_colorrang="25"' +
                  ' key_colorranga="0" key_chromargbkeyprimary="1"' +
                  ' key_chromargbkeythresh="50" key_chromargbkeybalance="0"' +
                  ' key_smartcamenable="0" key_smartcamconfig="" rotate_x="0"' +
                  ' rotate_y="0" rotate_z="0" rotate_canvas="0"' +
                  ' offset_x="0.000000" offset_y="0.000000" transitionid=""' +
                  ' transitiontime="300" edgeeffectid="" edgeeffectcfg=""' +
                  ' syncid0="4128815318" syncid1="1271341976"' +
                  ' syncid2="757777802" syncid3="1518631024"' +
                  ' id="{7B42E361-9211-46D5-BEDD-1FE6010193EF}"' +
                  ' StreamDelay="0" AudioDelay="0" AudioGainEnable="0"' +
                  ' AudioGain="5" AudioGainLatency="1000" LiveClockSync="0"' +
                  ' InPoint="0" OutPoint="0" CuePoints="" FilePlaylist=""' +
                  ' OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="1" ScrCapOptCapture1="1" ScrCapIntResize="1" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="1" GameCapPlSmoothness="1.000000" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" custom="" />' +
                '<item type="4"' +
                  ' item="C:\\Users\\meso\\Downloads\\dafak.jpg"' +
                  ' itemaudio="" name="C:\\Users\\meso\\Downloads\\dafak.jpg"' +
                  ' cname="" pos_left="0.291667" pos_top="0.250000"' +
                  ' pos_right="0.708333" pos_bottom="0.750000"' +
                  ' crop_left="0.000000" crop_top="0.000000"' +
                  ' crop_right="0.000000" crop_bottom="0.000000"' +
                  ' pixalign="0" zorder="3" volume="100" mute="0"' +
                  ' sounddev="0" lockmove="0" keep_ar="1" fdeinterlace="0"' +
                  ' mipmaps="0" autoresdet="1" visible="1" keeploaded="0"' +
                  ' alpha="255" border="0" cc_pin="0" cc_brightness="0"' +
                  ' cc_contrast="0" cc_hue="0" cc_saturation="0"' +
                  ' cc_dynamicrange="0" key_pin="0" key_antialiasing="2"' +
                  ' key_chromakey="0" key_chromakeytype="0" key_chromahue="0"' +
                  ' key_chromarang="25" key_chromaranga="0" key_chromabr="25"' +
                  ' key_chromasat="25" key_colorrgb="0" key_colorrang="25"' +
                  ' key_colorranga="0" key_chromargbkeyprimary="1"' +
                  ' key_chromargbkeythresh="50" key_chromargbkeybalance="0"' +
                  ' key_smartcamenable="0" key_smartcamconfig="" rotate_x="0"' +
                  ' rotate_y="0" rotate_z="0" rotate_canvas="0"' +
                  ' offset_x="0.000000" offset_y="0.000000" transitionid=""' +
                  ' transitiontime="300" edgeeffectid="" edgeeffectcfg=""' +
                  ' syncid0="3419618605" syncid1="1077747655"' +
                  ' syncid2="661021372" syncid3="830915735"' +
                  ' id="{956F3AA6-2A1A-43FA-8117-333800B98E73}"' +
                  ' StreamDelay="0" AudioDelay="0" AudioGainEnable="0"' +
                  ' AudioGain="5" AudioGainLatency="1000" LiveClockSync="0"' +
                  ' InPoint="0" OutPoint="0" CuePoints="" FilePlaylist=""' +
                  ' OpWhenFinished="0" StartOnLoad="1" RememberPosition="1"' +
                  ' LastPosition="0" ShowPosition="0" ScrCapMethod="3"' +
                  ' ScrCapLayered="0" ScrCapOptCapture="1"' +
                  ' ScrCapOptCapture1="1" ScrCapIntResize="1"' +
                  ' ScrCapShowMouse="1" ScrCapShowClicks="1"' +
                  ' ScrCapTrackWindowTitle="0" GameCapShowMouse="0"' +
                  ' GameCapSurfSharing="0" GameCapAlpha="0"' +
                  ' GameCapPlSmooth="1" GameCapPlSmoothness="1.000000"' +
                  ' GameCapTrackActive="0" GameCapTrackActiveFullscreen="1"' +
                  ' GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0"' +
                  ' BrowserSizeY="0" BrowserTransparent="1"' +
                  ' BrowserRightClick="0" BrowserCookiePath=""' +
                  ' BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1"' +
                  ' custom="" />' +
                '<item type="2"' +
                  ' item="@device:sw:{860BB310-5D01-11D0-BD3B-00A0C911CE86}' +
                  '\\{44A8B5C7-13B6-4211-BD40-35B629D9E6DF}" itemaudio=""' +
                  ' name="Decklink Video Capture" cname="" pos_left="0.000000"' +
                  ' pos_top="0.000000" pos_right="0.500000"' +
                  ' pos_bottom="0.500000" crop_left="0.000000"' +
                  ' crop_top="0.000000" crop_right="0.000000"' +
                  ' crop_bottom="0.000000" pixalign="0" zorder="4"' +
                  ' volume="100" mute="0" sounddev="0" lockmove="0"' +
                  ' keep_ar="1" fdeinterlace="0" mipmaps="0" autoresdet="1"' +
                  ' visible="1" keeploaded="1" alpha="255" border="0"' +
                  ' cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0"' +
                  ' cc_saturation="0" cc_dynamicrange="0" key_pin="0"' +
                  ' key_antialiasing="2" key_chromakey="0"' +
                  ' key_chromakeytype="0" key_chromahue="0"' +
                  ' key_chromarang="25" key_chromaranga="0" key_chromabr="25"' +
                  ' key_chromasat="25" key_colorrgb="0" key_colorrang="25"' +
                  ' key_colorranga="0" key_chromargbkeyprimary="1"' +
                  ' key_chromargbkeythresh="50" key_chromargbkeybalance="0"' +
                  ' key_smartcamenable="0" key_smartcamconfig="" rotate_x="0"' +
                  ' rotate_y="0" rotate_z="0" rotate_canvas="0"' +
                  ' offset_x="0.000000" offset_y="0.000000" transitionid=""' +
                  ' transitiontime="300" edgeeffectid="" edgeeffectcfg=""' +
                  ' syncid0="4209941579" syncid1="1168964882"' +
                  ' syncid2="2406534042" syncid3="2327558341"' +
                  ' id="{2F5AC444-3494-4568-8D96-5DABD17D5168}"' +
                  ' StreamDelay="0" AudioDelay="0" AudioGainEnable="0"' +
                  ' AudioGain="5" AudioGainLatency="1000" LiveClockSync="0"' +
                  ' InPoint="0" OutPoint="0" CuePoints="" FilePlaylist=""' +
                  ' OpWhenFinished="0" StartOnLoad="1" RememberPosition="1"' +
                  ' LastPosition="0" ShowPosition="0" ScrCapMethod="3"' +
                  ' ScrCapLayered="0" ScrCapOptCapture="1"' +
                  ' ScrCapOptCapture1="1" ScrCapIntResize="1"' +
                  ' ScrCapShowMouse="1" ScrCapShowClicks="1"' +
                  ' ScrCapTrackWindowTitle="0" GameCapShowMouse="0"' +
                  ' GameCapSurfSharing="0" GameCapAlpha="0"' +
                  ' GameCapPlSmooth="1" GameCapPlSmoothness="1.000000"' +
                  ' GameCapTrackActive="0" GameCapTrackActiveFullscreen="1"' +
                  ' GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0"' +
                  ' BrowserSizeY="0" BrowserTransparent="1"' +
                  ' BrowserRightClick="0" BrowserCookiePath=""' +
                  ' BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1"' +
                  ' custom="" />' +
                '<item type="7"' +
                  ' item="&lt;src pid=&quot;0&quot; handle=&quot;0&quot;' +
                  ' GapiType=&quot;&quot; width=&quot;0&quot;' +
                  ' height=&quot;0&quot; imagename=&quot;skype.exe&quot;' +
                  ' replace=&quot;skype_logo.png&quot; /&gt;" itemaudio=""' +
                  ' name="Skype" cname="" pos_left="0.500000"' +
                  ' pos_top="0.000000" pos_right="1.000000"' +
                  ' pos_bottom="0.500000" crop_left="0.000000"' +
                  ' crop_top="0.000000" crop_right="0.000000"' +
                  ' crop_bottom="0.000000" pixalign="0" zorder="5"' +
                  ' volume="100" mute="0" sounddev="0" lockmove="0"' +
                  ' keep_ar="1" fdeinterlace="0" mipmaps="1" autoresdet="1"' +
                  ' visible="1" keeploaded="0" alpha="255" border="0"' +
                  ' cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0"' +
                  ' cc_saturation="0" cc_dynamicrange="0" key_pin="0"' +
                  ' key_antialiasing="2" key_chromakey="0"' +
                  ' key_chromakeytype="0" key_chromahue="0"' +
                  ' key_chromarang="25" key_chromaranga="0"' +
                  ' key_chromabr="25" key_chromasat="25" key_colorrgb="0"' +
                  ' key_colorrang="25" key_colorranga="0"' +
                  ' key_chromargbkeyprimary="1" key_chromargbkeythresh="50"' +
                  ' key_chromargbkeybalance="0" key_smartcamenable="0"' +
                  ' key_smartcamconfig="" rotate_x="0" rotate_y="0"' +
                  ' rotate_z="0" rotate_canvas="0" offset_x="0.000000"' +
                  ' offset_y="0.000000" transitionid="" transitiontime="300"' +
                  ' edgeeffectid="" edgeeffectcfg="" syncid0="1457156359"' +
                  ' syncid1="1117101308" syncid2="3357030320"' +
                  ' syncid3="3903824253"' +
                  ' id="{83BA3C7F-7A79-4E67-B84B-D538E4CA5E2A}"' +
                  ' StreamDelay="0" AudioDelay="0" AudioGainEnable="0"' +
                  ' AudioGain="5" AudioGainLatency="1000" LiveClockSync="0"' +
                  ' InPoint="0" OutPoint="0" CuePoints="" FilePlaylist=""' +
                  ' OpWhenFinished="0" StartOnLoad="1" RememberPosition="1"' +
                  ' LastPosition="0" ShowPosition="0" ScrCapMethod="3"' +
                  ' ScrCapLayered="0" ScrCapOptCapture="1"' +
                  ' ScrCapOptCapture1="1" ScrCapIntResize="1"' +
                  ' ScrCapShowMouse="1" ScrCapShowClicks="1"' +
                  ' ScrCapTrackWindowTitle="0" GameCapShowMouse="0"' +
                  ' GameCapSurfSharing="1" GameCapAlpha="0"' +
                  ' GameCapPlSmooth="1" GameCapPlSmoothness="1.000000"' +
                  ' GameCapTrackActive="0" GameCapTrackActiveFullscreen="1"' +
                  ' GameCapHideInactive="1" BrowserJs="" BrowserSizeX="0"' +
                  ' BrowserSizeY="0" BrowserTransparent="1"' +
                  ' BrowserRightClick="0" BrowserCookiePath=""' +
                  ' BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1"' +
                  ' custom="" />' +
                '</placement>'));
          },10);
          return asyncId;

        } else if (startsWith(funcName, 'sceneconfig:')) {
          var sceneNumber = parseInt(funcName.substring(13)) + 1;
          var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);

          setTimeout(function() {
            window.OnAsyncCallback(asyncId,
              encodeURIComponent('<placement name="Scene ' + sceneNumber +
                '" defpos="0"/>'));
          },10);
          return asyncId;

        } else if (startsWith(funcName, 'scenename:')) {
          var sceneNumber = parseInt(funcName.substring(13)) + 1;
          var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);

          setTimeout(function() {
            window.OnAsyncCallback(asyncId,
              encodeURIComponent('Scene ' + sceneNumber));
          },10);
          return asyncId;

        } else {

        }
      });
    });

    it('through a promise', function() {
      var promise = App.getCurrentPresentation();
      expect(promise).toBeInstanceOf(Promise);
    });

    it('that returns as an object', function(done) {
      var promise = App.getCurrentPresentation();
      promise.then(function(presentation) {
        expect(presentation)
          .hasProperties('currentScene, version, sceneDetails, global');
        expect(presentation).hasMethods('toXML');
        done();
      });
    });
  });

  xdescribe('should get presentation', function() {
    beforeEach(function() {
      spyOn(window.external, 'AppGetPropertyAsync')
        .and.callFake(function(funcName) {
        if (funcName == 'version') {
          var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);

          setTimeout(function() {
            window.OnAsyncCallback(asyncId, '1.3.0.429');
          },10);
          return asyncId;

        } else if (funcName == 'preset:0') {
          var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);

          setTimeout(function() {
            window.OnAsyncCallback(asyncId, '0');
          },10);
          return asyncId;

        } else if (funcName == 'sceneconfig') {
          var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);

          setTimeout(function() {
            window.OnAsyncCallback(asyncId,
              encodeURIComponent('<?xml version="1.0" encoding="utf-8"?>' +
                '<configuration cur="0" Version="2.4.1506.2436">' +
                '<placement name="Scene 1" defpos="0"/>' +
                '<global/>' +
                '</configuration>'));
          },10);
          return asyncId;

        // add these below only because each scene has separate getting of sources,
        // this should be addressed to reuse the initial call for presetconfig
        } else if (startsWith(funcName, 'sceneconfig:')) {
          var sceneNumber = parseInt(funcName.substring(13)) + 1;
          var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);

          setTimeout(function() {
            window.OnAsyncCallback(asyncId,
              encodeURIComponent('<placement name="Scene ' + sceneNumber +
                '" defpos="0"/>'));
          },10);
          return asyncId;

        } else if (startsWith(funcName, 'scenename:')) {
          var sceneNumber = parseInt(funcName.substring(13)) + 1;
          var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);

          setTimeout(function() {
            window.OnAsyncCallback(asyncId, encodeURIComponent('Scene ' +
              sceneNumber));
          },10);
          return asyncId;

        } else {

        }
      });
    });

    it('that returns as an object even when empty', function(done) {
      var promise = App.getCurrentPresentation();
      promise.then(function(presentation) {
        expect(presentation)
          .hasProperties('currentScene, version, sceneDetails, global');
        expect(presentation).hasMethods('toXML');
        done();
      });
    });
  });

  xdescribe ('should be able to load a presentation', function() {
    var loadPresentation;
    beforeEach(function() {
      loadPresentation = false;
      spyOn(window.external, 'AppCallFuncAsync')
        .and.callFake(function(presentationString) {
        if (typeof presentationString == 'string')
          loadPresentation = true;
      });
    });

    it('from a Presentation object', function(done) {
      // replace this with a custom presentation object, to support independence
      App.load(App.getCurrentPresentation());
      expect(loadPresentation).toBe(true);
      done();
    });
  });

  xdescribe ('should be able to load a presentation', function() {
    var loadPresentation;
    beforeEach(function() {
      loadPresentation = false;
      spyOn(window.external, 'AppCallFuncAsync')
        .and.callFake(function(presentationString) {
        if (typeof presentationString == 'string')
          loadPresentation = true;
      });
    });

    it('from a url', function(done) {
      // replace this with a custom presentation object, to support independence
      App.load('C:\\someFolder\\somePresentation.BPres');
      expect(loadPresentation).toBe(true);
      done();
    });

    it('from an xml string', function(done) {
      // replace this with a custom presentation object, to support independence
      App.load('<?xml version="1.0" encoding="utf-8"?>' +
        '<configuration cur="2" Version="2.4.1506.2436">' +
        '<placement name="Scene 1" defpos="2">' +
        '<item type="5"' +
          ' item="&lt;screen module=&quot;\\device\\harddiskvolume2' +
          '\\program files (x86)\\google\\chrome\\application\\chrome.exe&quot;' +
          ' window=&quot;XSplit - Free Easy Live Streaming' +
          ' and Recording Software - Google Chrome&quot;' +
          ' hwnd=&quot;527526&quot; wclient=&quot;1&quot; left=&quot;0&quot;' +
          ' top=&quot;0&quot; width=&quot;0&quot; height=&quot;0&quot;/&gt; "' +
          ' itemaudio="" name="Window &quot;XSplit - Free Easy Live Streaming' +
          ' and Recording Software - Google Chrome&quot;' +
          ' in &quot;chrome.exe&quot; process" cname="" pos_left="0.026701"' +
          ' pos_top="0.000000" pos_right="0.473299" pos_bottom="0.500000"' +
          ' crop_left="0.000000" crop_top="0.000000" crop_right="0.000000"' +
          ' crop_bottom="0.000000" pixalign="0" zorder="0" volume="100"' +
          ' mute="0" sounddev="0" lockmove="0" keep_ar="1" fdeinterlace="0"' +
          ' mipmaps="0" autoresdet="1" visible="1" keeploaded="0" alpha="255"' +
          ' border="0" cc_pin="0" cc_brightness="0" cc_contrast="0"' +
          ' cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_pin="0"' +
          ' key_antialiasing="2" key_chromakey="0" key_chromakeytype="0"' +
          ' key_chromahue="0" key_chromarang="25" key_chromaranga="0"' +
          ' key_chromabr="25" key_chromasat="25" key_colorrgb="0"' +
          ' key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1"' +
          ' key_chromargbkeythresh="50" key_chromargbkeybalance="0"' +
          ' key_smartcamenable="0" key_smartcamconfig="" rotate_x="0"' +
          ' rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000"' +
          ' offset_y="0.000000" transitionid="" transitiontime="300"' +
          ' edgeeffectid="" edgeeffectcfg="" syncid0="1880743123"' +
          ' syncid1="1142348718" syncid2="3500279181" syncid3="2952175092"' +
          ' id="{B1801FF8-F3DC-4804-9035-2AB8755F64A8}" StreamDelay="0"' +
          ' AudioDelay="0" AudioGainEnable="0" AudioGain="5"' +
          ' AudioGainLatency="1000" LiveClockSync="0" InPoint="0"' +
          ' OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0"' +
          ' StartOnLoad="1" RememberPosition="1" LastPosition="0"' +
          ' ShowPosition="0" ScrCapMethod="3" ScrCapLayered="1"' +
          ' ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0"' +
          ' ScrCapShowMouse="1" ScrCapShowClicks="1"' +
          ' ScrCapTrackWindowTitle="1" GameCapShowMouse="0"' +
          ' GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="1"' +
          ' GameCapPlSmoothness="1.000000" GameCapTrackActive="0"' +
          ' GameCapTrackActiveFullscreen="1" GameCapHideInactive="0"' +
          ' BrowserJs="" BrowserSizeX="0" BrowserSizeY="0"' +
          ' BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath=""' +
          ' BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1"' +
          ' custom="" />' +
        '<item type="8"' +
          ' item="html:plugin:titleplg*{&quot;customScript&quot;:' +
          '&quot;/* Javascript knowledge is required' +
          ' when using the blank template of the custom script.' +
          '\\nYou will need to call SetText(string) in order' +
          ' to change the text in XSplit Broadcaster Mixer. */&quot;,' +
          '&quot;text&quot;:&quot;Title Text&quot;,' +
          '&quot;fontStyle&quot;:&quot;Calibri&quot;' +
          ',&quot;color&quot;:&quot;#FFFFFF&quot;' +
          ',&quot;outlineColor&quot;:&quot;#FFFFFF&quot;,' +
          '&quot;outline&quot;:&quot;none&quot;,&quot;alpha&quot;:100,' +
          '&quot;textDeco&quot;:&quot;none&quot;,' +
          '&quot;textAlign&quot;:&quot;center&quot;,' +
          '&quot;vertAlign&quot;:&quot;middle&quot;,&quot;scrollSpeed&quot;:0,' +
          '&quot;scrollingOrientation&quot;:&quot;horizontal&quot;,' +
          '&quot;lineLimit&quot;:1,' +
          '&quot;customScriptName&quot;:&quot;Custom Script&quot;}"' +
          ' itemaudio="" name="Text (Title Text)" cname="" pos_left="0.500781"' +
          ' pos_top="0.498611" pos_right="1.000781" pos_bottom="0.998611"' +
          ' crop_left="0.000000" crop_top="0.000000" crop_right="0.000000"' +
          ' crop_bottom="0.000000" pixalign="0" zorder="1" volume="100"' +
          ' mute="0" sounddev="0" lockmove="0" keep_ar="0" fdeinterlace="0"' +
          ' mipmaps="0" autoresdet="1" visible="1" keeploaded="0" alpha="255"' +
          ' border="0" cc_pin="0" cc_brightness="0" cc_contrast="0" cc_hue="0"' +
          ' cc_saturation="0" cc_dynamicrange="0" key_pin="0"' +
          ' key_antialiasing="2" key_chromakey="0" key_chromakeytype="0"' +
          ' key_chromahue="0" key_chromarang="25" key_chromaranga="0"' +
          ' key_chromabr="25" key_chromasat="25" key_colorrgb="0"' +
          ' key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1"' +
          ' key_chromargbkeythresh="50" key_chromargbkeybalance="0"' +
          ' key_smartcamenable="0" key_smartcamconfig="" rotate_x="0"' +
          ' rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000"' +
          ' offset_y="0.000000" transitionid="" transitiontime="300"' +
          ' edgeeffectid="" edgeeffectcfg="" syncid0="2263574941"' +
          ' syncid1="1174364359" syncid2="3451306657" syncid3="4107863841"' +
          ' id="{3FC97E0D-D238-4858-A978-9D7418D1584B}" StreamDelay="0"' +
          ' AudioDelay="0" AudioGainEnable="0" AudioGain="5"' +
          ' AudioGainLatency="1000" LiveClockSync="0" InPoint="0"' +
          ' OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0"' +
          ' StartOnLoad="1" RememberPosition="1" LastPosition="0"' +
          ' ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0"' +
          ' ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0"' +
          ' ScrCapShowMouse="1" ScrCapShowClicks="1"' +
          ' ScrCapTrackWindowTitle="0" GameCapShowMouse="0"' +
          ' GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="1"' +
          ' GameCapPlSmoothness="1.000000" GameCapTrackActive="0"' +
          ' GameCapTrackActiveFullscreen="1" GameCapHideInactive="0"' +
          ' BrowserJs="" BrowserSizeX="0" BrowserSizeY="0"' +
          ' BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath=""' +
          ' BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1"' +
          ' custom="" />' +
        '</placement><placement name="Scene 2" defpos="0" />' +
        '<placement name="Scene 3" defpos="2">' +
        '<item type="7" item="&lt;src pid=&quot;0&quot; handle=&quot;0&quot;' +
          ' hwnd=&quot;0&quot; GapiType=&quot;&quot; width=&quot;0&quot;' +
          ' height=&quot;0&quot; flags=&quot;0&quot; wndname=&quot;&quot;' +
          ' lastframets=&quot;0&quot; fpsRender=&quot;0.000000&quot;' +
          ' fpsCapture=&quot;0.000000&quot; imagename=&quot;&quot;/&gt; "' +
          ' itemaudio="" name="Game: Auto Detect" cname="" pos_left="0.000000"' +
          ' pos_top="0.000000" pos_right="0.500000" pos_bottom="0.500000"' +
          ' crop_left="0.000000" crop_top="0.000000" crop_right="0.000000"' +
          ' crop_bottom="0.000000" pixalign="0" zorder="0" volume="100"' +
          ' mute="0" sounddev="0" lockmove="0" keep_ar="1" fdeinterlace="0"' +
          ' mipmaps="1" autoresdet="1" visible="1" keeploaded="0" alpha="255"' +
          ' border="0" cc_pin="0" cc_brightness="0" cc_contrast="0"' +
          ' cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_pin="0"' +
          ' key_antialiasing="2" key_chromakey="0" key_chromakeytype="0"' +
          ' key_chromahue="0" key_chromarang="25" key_chromaranga="0"' +
          ' key_chromabr="25" key_chromasat="25" key_colorrgb="0"' +
          ' key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1"' +
          ' key_chromargbkeythresh="50" key_chromargbkeybalance="0"' +
          ' key_smartcamenable="0" key_smartcamconfig="" rotate_x="0"' +
          ' rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000"' +
          ' offset_y="0.000000" transitionid="" transitiontime="300"' +
          ' edgeeffectid="" edgeeffectcfg="" syncid0="3645132798"' +
          ' syncid1="1217436513" syncid2="457435322" syncid3="2900301210"' +
          ' id="{53910A3E-40BA-4B19-B433-1F4B122EDE14}" StreamDelay="0"' +
          ' AudioDelay="0" AudioGainEnable="0" AudioGain="5"' +
          ' AudioGainLatency="1000" LiveClockSync="0" InPoint="0"' +
          ' OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0"' +
          ' StartOnLoad="1" RememberPosition="1" LastPosition="0"' +
          ' ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0"' +
          ' ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0"' +
          ' ScrCapShowMouse="1" ScrCapShowClicks="1"' +
          ' ScrCapTrackWindowTitle="0" GameCapShowMouse="1"' +
          ' GameCapSurfSharing="1" GameCapAlpha="0" GameCapPlSmooth="1"' +
          ' GameCapPlSmoothness="1.000000" GameCapTrackActive="1"' +
          ' GameCapTrackActiveFullscreen="0" GameCapHideInactive="0"' +
          ' BrowserJs="" BrowserSizeX="0" BrowserSizeY="0"' +
          ' BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath=""' +
          ' BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1"' +
          ' custom="" />' +
        '<item type="2"' +
          ' item="@device:cm:{33D9A762-90C8-11D0-BD43-00A0C911CE86}' +
          '\\Line 1 (Virtual Audio Cable)" itemaudio=""' +
          ' name="Line 1 (Virtual Audio Cable)" cname="" pos_left="0.500000"' +
          ' pos_top="0.000000" pos_right="1.000000" pos_bottom="0.500000"' +
          ' crop_left="0.000000" crop_top="0.000000" crop_right="0.000000"' +
          ' crop_bottom="0.000000" pixalign="0" zorder="1" volume="100"' +
          ' mute="0" sounddev="1" lockmove="0" keep_ar="1" fdeinterlace="0"' +
          ' mipmaps="0" autoresdet="1" visible="1" keeploaded="0" alpha="255"' +
          ' border="0" cc_pin="0" cc_brightness="0" cc_contrast="0"' +
          ' cc_hue="0" cc_saturation="0" cc_dynamicrange="1" key_pin="0"' +
          ' key_antialiasing="2" key_chromakey="0" key_chromakeytype="0"' +
          ' key_chromahue="0" key_chromarang="25" key_chromaranga="0"' +
          ' key_chromabr="25" key_chromasat="25" key_colorrgb="0"' +
          ' key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1"' +
          ' key_chromargbkeythresh="50" key_chromargbkeybalance="0"' +
          ' key_smartcamenable="0" key_smartcamconfig="" rotate_x="0"' +
          ' rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000"' +
          ' offset_y="0.000000" transitionid="" transitiontime="300"' +
          ' edgeeffectid="" edgeeffectcfg="" syncid0="2030921038"' +
          ' syncid1="1296873976" syncid2="224585659" syncid3="4103227414"' +
          ' id="{28726998-06A9-42A4-ABAE-3E29ED8EC4BF}" StreamDelay="0"' +
          ' AudioDelay="0" AudioGainEnable="0" AudioGain="5"' +
          ' AudioGainLatency="1000" LiveClockSync="0" InPoint="0"' +
          ' OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0"' +
          ' StartOnLoad="1" RememberPosition="1" LastPosition="0"' +
          ' ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0"' +
          ' ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0"' +
          ' ScrCapShowMouse="1" ScrCapShowClicks="1"' +
          ' ScrCapTrackWindowTitle="0" GameCapShowMouse="0"' +
          ' GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="1"' +
          ' GameCapPlSmoothness="1.000000" GameCapTrackActive="0"' +
          ' GameCapTrackActiveFullscreen="1" GameCapHideInactive="0"' +
          ' BrowserJs="" BrowserSizeX="0" BrowserSizeY="0"' +
          ' BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath=""' +
          ' BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1"' +
          ' custom="" />' +
        '</placement><global>' +
        '<camera' +
          ' id="obj-moniker-@device:cm:{33d9a762-90c8-11d0-bd43-00a0c911ce86}' +
          '\\line 1 (virtual audio cable)" width="0" height="0" frametime="0"' +
          ' videosubtype="{00000000-0000-0000-0000-000000000000}"' +
          ' xbarroute1="" xbarroute2="" vpersist="" apersist="" />' +
        '</global>' +
        '</configuration>');
      expect(loadPresentation).toBe(true);
      done();
    });
  });

  xdescribe ('should be able to save the current presentation', function() {
    var saveSet;
    beforeEach(function() {
      saveSet = false;
      spyOn(window.external, 'AppCallFuncAsync')
        .and.callFake(function(funcName, value) {
        if (funcName === 'savepresets' && typeof value == 'string')
          saveSet = true;
      });
    });

    it('as a string', function(done) {
      App.save('C:\\someFolder\\somePresentation.BPres');
      expect(saveSet).toBe(true);
      done();
    });
  });

  xdescribe ('should be able to clear', function() {
    var clearSet;
    beforeEach(function() {
      clearSet = false;
      spyOn(window.external, 'AppCallFuncAsync')
        .and.callFake(function(funcName) {
        if (funcName === 'newpresets')
          clearSet = true;
      });
    });

    it(' the current presentation', function(done) {
      App.clearPresentation();
      expect(clearSet).toBe(true);
      done();
    });
  });

  describe('should be able to clear cookies', function() {
    it('but not for source plugin window', function(done) {
      env.set(environments[2]); // source plugin window
      App.clearBrowserCookies().then(function() {
        done.fail('Clear browser cookies should reject on source plugin,');
      }, function() {
        env.set(environments[0]); // source config window
      }).then(App.clearBrowserCookies)
      .then(function() {
        env.set(environments[1]); // extension window
      }, function() {
        done.fail('Clear browser cookies should work in source config window.');
      }).then(App.clearBrowserCookies)
      .then(function() {
        expect(true).toBe(true);
        done();
      }, function() {
        done.fail('Clear browser cookies should work in extensions.');
      });
    });
  });

  describe('should be able to get hashed user identity', function() {
    beforeEach(function() {
      spyOn(window.external, 'GetGlobalProperty')
        .and.callFake(function(prop) {
          if (prop === 'userid') {
            return '+965Bu+jXY+jUvCCbSAJbQ==';
          }
        });
    });

    it('as a string', function(done) {
      App.getUserIdHash().then(function(hash) {
        expect(hash).toBeTypeOf('string');
        done();
      });
    });

    it('encoded using some has function', function(done) {
      // simple checking of character set, not really testing other constraints
      var regex = /^[A-Za-z0-9+=]+$/;

      App.getUserIdHash().then(function(hash) {
        expect(regex.test(hash)).toBe(true);
        done();
      });
    });
  });
});
