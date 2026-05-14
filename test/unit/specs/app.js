/* globals describe, it, expect, xdescribe, require, beforeAll, beforeEach, spyOn, jasmine, afterEach, afterAll */

describe('App ===', () => {
  var startsWith = (mainString, stringCompared) =>
    mainString.toLowerCase().substring(0, stringCompared.length) === stringCompared.toLowerCase();
  var XJS = require('xjs');
  var App = new XJS.App();
  var Transition = XJS.Transition;
  var env = new window.Environment(XJS);
  var environments = ['props', 'extension', 'plugin'];
  var appVersion = navigator.appVersion;
  var mix = new window.Mixin([
    () => {
      navigator.__defineGetter__('appVersion', () => 'XSplit Broadcaster 2.7.1702.2231 ');
    },
    () => {
      navigator.__defineGetter__('appVersion', () => 'XSplit Broadcaster 2.8.1603.0401 ');
    },
  ]);
  var exec = mix.exec.bind(mix);

  var ctr = 0;

  var xCallback = (id, result) => {
    setTimeout(() => {
      window.OnAsyncCallback(id, result);
    }, 10);
  };

  beforeAll((done) => {
    XJS.ready().then(() => {
      done();
    });
  });

  describe('should get frametime', () => {
    beforeEach(() => {
      spyOn(window.external, 'AppGetPropertyAsync').and.callFake((funcName) => {
        if (funcName == 'frametime') {
          ctr++;
          var asyncId = 'iapp_' + ctr;
          xCallback(asyncId, '12');
          return asyncId;
        }
      });
    });

    it('through a promise', () => {
      var promise = App.getFrameTime();
      expect(promise).toBeInstanceOf(Promise);
    });

    it('that always return as a number', (done) => {
      var promise = App.getFrameTime();
      promise.then((count) => {
        expect(count).toBeTypeOf('number');
        expect(count).not.toBeNaN();
        done();
      });
    });
  });

  describe('should get resolution', () => {
    beforeEach(() => {
      spyOn(window.external, 'AppGetPropertyAsync').and.callFake((funcName) => {
        if (funcName == 'resolution') {
          ctr++;
          var asyncId = 'iapp_' + ctr;
          xCallback(asyncId, '900, 600');
          return asyncId;
        }
      });
    });

    it('through a promise', () => {
      var promise = App.getResolution();
      expect(promise).toBeInstanceOf(Promise);
    });

    it('that always return as an object that has height and width', (done) => {
      var promise = App.getResolution();
      promise.then((resolution) => {
        expect(resolution).toBeInstanceOf(Object);
        expect(resolution._width).toBeTypeOf('number');
        expect(resolution._width).not.toBeNaN();
        expect(resolution._height).toBeTypeOf('number');
        expect(resolution._height).not.toBeNaN();
        done();
      });
    });
  });

  describe('should get viewport', () => {
    beforeEach(() => {
      spyOn(window.external, 'AppGetPropertyAsync').and.callFake((funcName) => {
        if (funcName == 'viewport') {
          ctr++;
          var asyncId = 'iapp_' + ctr;
          xCallback(asyncId, '900, 600');
          return asyncId;
        }
      });
    });

    afterEach(() => {
      navigator.__defineGetter__('appVersion', () => appVersion);
    });

    it('through a promise', (done) => {
      exec((next) => {
        var promise = App.getViewport();
        expect(promise).toBeInstanceOf(Promise);
        next();
      }).then(done);
    });

    it('that always return as an object that has height and width', (done) => {
      exec((next) => {
        var promise = App.getViewport();
        promise.then((viewPort) => {
          expect(viewPort).toBeTypeOf('object');
          expect(viewPort._width).toBeTypeOf('number');
          expect(viewPort._width).not.toBeNaN();
          expect(viewPort._height).toBeTypeOf('number');
          expect(viewPort._height).not.toBeNaN();
          next();
        });
      }).then(done);
    });
  });

  describe('should get version', () => {
    beforeEach(() => {
      spyOn(window.external, 'AppGetPropertyAsync').and.callFake((funcName) => {
        if (funcName == 'version') {
          ctr++;
          var asyncId = 'iapp_' + ctr;
          xCallback(asyncId, '1.3.0.429');
          return asyncId;
        }
      });
    });

    afterEach(() => {
      navigator.__defineGetter__('appVersion', () => appVersion);
    });

    it('through a promise', (done) => {
      exec((next) => {
        var promise = App.getVersion();
        expect(promise).toBeInstanceOf(Promise);
        next();
      }).then(done);
    });

    it('that always return as string', (done) => {
      exec((next) => {
        var promise = App.getVersion();
        promise
          .then((version) => {
            if (/xsplit broadcaster/gi.test(navigator.appVersion)) {
              expect(version).toBeDefined();
              expect(version).toBeTypeOf('string');
              next();
            } else {
              done.fail('Should reject if browser is not XBC');
            }
          })
          .catch((err) => {
            expect(err).toEqual(jasmine.any(Error));
            next();
          });
      }).then(done);
    });
  });

  describe('should get frames rendered', () => {
    beforeEach(() => {
      spyOn(window.external, 'AppGetPropertyAsync').and.callFake((funcName) => {
        if (funcName == 'framesrendered') {
          ctr++;
          var asyncId = 'iapp_' + ctr;
          xCallback(asyncId, '12683');
          return asyncId;
        }
      });
    });

    it('through a promise', () => {
      var promise = App.getFramesRendered();
      expect(promise).toBeInstanceOf(Promise);
    });

    it('that always return as a number', (done) => {
      var promise = App.getFramesRendered();
      promise.then((framesRendered) => {
        expect(framesRendered).toBeTypeOf('number');
        expect(framesRendered).not.toBeNaN();
        done();
      });
    });
  });

  describe('should be able to get audio devices', () => {
    var micDev2Mock = encodeURIComponent(
      '<devices>' +
        '<dev id="default:1:0" level="0.900000" enable="1"' +
        ' hwlevel="-1.000000" hwenable="255" delay="0" mix="0"/>' +
        '<dev id="default:0:0" level="1.500000" enable="1"' +
        ' hwlevel="-1.000000" hwenable="255" delay="0" mix="0"/>' +
        '<dev id="{0.0.0.00000000}.' +
        '{8a37e9cb-90fd-42d9-9d5b-8d8c43bdb929}" level="1.000000"' +
        ' enable="1" hwlevel="-1.000000" hwenable="255"' +
        ' delay="0" mix="0"/>' +
        '</devices>'
    );

    beforeEach(() => {
      spyOn(window.external, 'AppGetPropertyAsync').and.callFake((funcName) => {
        if (funcName == 'microphonedev2') {
          ctr++;
          var asyncId = 'iapp_' + ctr;
          xCallback(asyncId, micDev2Mock);
          return asyncId;
        }
      });
    });

    describe('primary mic', () => {
      var promise;
      beforeEach(() => {
        promise = App.getPrimaryMic();
      });

      it('through a promise', () => {
        expect(promise).toBeInstanceOf(Promise);
      });

      // if this fails, please first check if the expected value corresponds to the supplied micDev2Mock
      it('as an audioDevice', (done) => {
        promise.then((audioDevice) => {
          expect(audioDevice).hasMethods(
            'getId, getName, getDataFlow,' +
              ' isDefaultDevice, getLevel, _setLevel, isEnabled, _setEnabled,' +
              ' getSystemLevel, _setSystemLevel, getSystemEnabled,' +
              ' _setSystemEnabled, getDelay, _setDelay, toString'
          );
          expect(audioDevice.toString()).toEqual(
            '<dev id="default:1:0"' +
              ' level="0.900000" enable="1" hwlevel="-1.000000" hwenable="255"' +
              ' delay="0" mix="0"/>'
          );
          done();
        });
      });
    });

    describe('primary speaker', () => {
      var promise;
      beforeEach(() => {
        promise = App.getPrimarySpeaker();
      });

      it('through a promise', () => {
        expect(promise).toBeInstanceOf(Promise);
      });

      // if this fails, please first check if the expected value corresponds to the supplied micDev2Mock
      it('as an audioDevice', (done) => {
        promise.then((audioDevice) => {
          expect(audioDevice).hasMethods(
            'getId, getName, getDataFlow,' +
              ' isDefaultDevice, getLevel, _setLevel, isEnabled, _setEnabled,' +
              ' getSystemLevel, _setSystemLevel, getSystemEnabled,' +
              ' _setSystemEnabled, getDelay, _setDelay, toString'
          );
          expect(audioDevice.toString()).toEqual(
            '<dev id="default:0:0"' +
              ' level="1.500000" enable="1" hwlevel="-1.000000" hwenable="255"' +
              ' delay="0" mix="0"/>'
          );
          done();
        });
      });
    });
  });

  describe('should be able to set attributes of audio devices', () => {
    window.micDev2 = encodeURIComponent(
      '<devices>' +
        '<dev id="default:1:0" level="1.000000" enable="1"' +
        ' hwlevel="-1.000000" hwenable="255" delay="0" mix="0"/>' +
        '<dev id="default:0:0" level="1.000000" enable="1"' +
        ' hwlevel="-1.000000" hwenable="255" delay="0" mix="0"/>' +
        '<dev id="{0.0.0.00000000}.' +
        '{8a37e9cb-90fd-42d9-9d5b-8d8c43bdb929}" level="1.000000"' +
        ' enable="1" hwlevel="-1.000000" hwenable="255"' +
        ' delay="0" mix="0"/>' +
        '</devices>'
    );

    beforeEach(() => {
      spyOn(window.external, 'AppGetPropertyAsync').and.callFake((funcName) => {
        if (funcName == 'microphonedev2') {
          ctr++;
          var asyncId = 'iapp_' + ctr;
          xCallback(asyncId, micDev2);
          return asyncId;
        }
      });

      spyOn(window.external, 'AppSetPropertyAsync').and.callFake((funcName, value) => {
        if (funcName === 'microphonedev2') {
          micDev2 = encodeURIComponent(value);
          ctr++;
          var asyncId = 'iapp_' + ctr;
          xCallback(asyncId, '1');
          return asyncId;
        }
      });
    });

    describe('primary mic level', () => {
      var promise;

      it('through a promise as a number', (done) => {
        promise = App.setPrimaryMicLevel(45);
        expect(promise).toBeInstanceOf(Promise);
        promise
          .then((isSet) => {
            expect(isSet).toBe(true);
            return App.getPrimaryMic();
          })
          .then((audioDevice) => {
            expect(audioDevice.getLevel()).toEqual(45);
            return App.setPrimaryMicLevel(-25);
          })
          .then((isSet) => {
            done.fail('Invalid value was accepted');
          })
          .catch((err) => {
            expect(err).toEqual(jasmine.any(Error));
            done();
          });
      });
    });

    describe('primary mic enabled', () => {
      var promise;

      it('through a promise as a boolean', (done) => {
        promise = App.setPrimaryMicEnabled(false);
        expect(promise).toBeInstanceOf(Promise);
        promise
          .then((isSet) => {
            expect(isSet).toBe(true);
            return App.getPrimaryMic();
          })
          .then((audioDevice) => {
            expect(audioDevice.isEnabled()).toBe(false);
            return App.setPrimaryMicEnabled(true);
          })
          .then((isSet) => {
            expect(isSet).toBe(true);
            return App.getPrimaryMic();
          })
          .then((audioDevice) => {
            expect(audioDevice.isEnabled()).toBe(true);
            done();
          });
      });
    });

    describe('primary mic system level', () => {
      var promise;

      it('through a promise as a number', (done) => {
        promise = App.setPrimaryMicSystemLevel(25);
        expect(promise).toBeInstanceOf(Promise);
        promise
          .then((isSet) => {
            expect(isSet).toBe(true);
            return App.getPrimaryMic();
          })
          .then((audioDevice) => {
            expect(audioDevice.getSystemLevel()).toEqual(25);
            return App.setPrimaryMicSystemLevel(-25);
          })
          .then((isSet) => {
            done.fail('Invalid value was accepted');
          })
          .catch((err) => {
            expect(err).toEqual(jasmine.any(Error));
            done();
          });
      });
    });

    describe('primary mic system enabled', () => {
      var promise;

      it('through a promise as a number', (done) => {
        promise = App.setPrimaryMicSystemEnabled(255);
        expect(promise).toBeInstanceOf(Promise);
        promise
          .then((isSet) => {
            expect(isSet).toBe(true);
            return App.getPrimaryMic();
          })
          .then((audioDevice) => {
            expect(audioDevice.getSystemEnabled()).toEqual(255);
            return App.setPrimaryMicSystemEnabled(42);
          })
          .then((isSet) => {
            done.fail('Invalid value was accepted');
          })
          .catch((err) => {
            expect(err).toEqual(jasmine.any(Error));
            done();
          });
      });
    });

    describe('primary mic delay', () => {
      var promise;

      it('through a promise as a number', (done) => {
        promise = App.setPrimaryMicDelay(5555);
        expect(promise).toBeInstanceOf(Promise);
        promise
          .then((isSet) => {
            expect(isSet).toBe(true);
            return App.getPrimaryMic();
          })
          .then((audioDevice) => {
            expect(audioDevice.getDelay()).toEqual(5555);
            return App.setPrimaryMicDelay(-20);
          })
          .then((isSet) => {
            done.fail('Invalid value was accepted');
          })
          .catch((err) => {
            expect(err).toEqual(jasmine.any(Error));
            done();
          });
      });
    });

    describe('primary speaker level', () => {
      var promise;

      it('through a promise as a number', (done) => {
        promise = App.setPrimarySpeakerLevel(45);
        expect(promise).toBeInstanceOf(Promise);
        promise
          .then((isSet) => {
            expect(isSet).toBe(true);
            return App.getPrimarySpeaker();
          })
          .then((audioDevice) => {
            expect(audioDevice.getLevel()).toEqual(45);
            return App.setPrimarySpeakerLevel(-20);
          })
          .then((isSet) => {
            done.fail('Invalid value was accepted');
          })
          .catch((err) => {
            expect(err).toEqual(jasmine.any(Error));
            done();
          });
      });
    });

    describe('primary speaker enabled', () => {
      var promise;

      it('through a promise as a boolean', (done) => {
        promise = App.setPrimarySpeakerEnabled(false);
        expect(promise).toBeInstanceOf(Promise);
        promise
          .then((isSet) => {
            expect(isSet).toBe(true);
            return App.getPrimarySpeaker();
          })
          .then((audioDevice) => {
            expect(audioDevice.isEnabled()).toBe(false);
            return App.setPrimarySpeakerEnabled(true);
          })
          .then((isSet) => {
            expect(isSet).toBe(true);
            return App.getPrimarySpeaker();
          })
          .then((audioDevice) => {
            expect(audioDevice.isEnabled()).toBe(true);
            done();
          });
      });
    });

    describe('primary speaker system level', () => {
      var promise;

      it('through a promise as a number', (done) => {
        promise = App.setPrimarySpeakerSystemLevel(25);
        expect(promise).toBeInstanceOf(Promise);
        promise
          .then((isSet) => {
            expect(isSet).toBe(true);
            return App.getPrimarySpeaker();
          })
          .then((audioDevice) => {
            expect(audioDevice.getSystemLevel()).toEqual(25);
            return App.setPrimarySpeakerSystemLevel(-20);
          })
          .then((isSet) => {
            done.fail('Invalid value was accepted');
          })
          .catch((err) => {
            expect(err).toEqual(jasmine.any(Error));
            done();
          });
      });
    });

    describe('primary speaker system enabled', () => {
      var promise;

      it('through a promise as a number', (done) => {
        promise = App.setPrimarySpeakerSystemEnabled(255);
        expect(promise).toBeInstanceOf(Promise);
        promise
          .then((isSet) => {
            expect(isSet).toBe(true);
            return App.getPrimarySpeaker();
          })
          .then((audioDevice) => {
            expect(audioDevice.getSystemEnabled()).toEqual(255);
            return App.setPrimarySpeakerSystemEnabled(20);
          })
          .then((isSet) => {
            done.fail('Invalid value was accepted');
          })
          .catch((err) => {
            expect(err).toEqual(jasmine.any(Error));
            done();
          });
      });
    });

    describe('primary speaker delay', () => {
      var promise;

      it('through a promise as a number', (done) => {
        promise = App.setPrimarySpeakerDelay(5555);
        expect(promise).toBeInstanceOf(Promise);
        promise
          .then((isSet) => {
            expect(isSet).toBe(true);
            return App.getPrimarySpeaker();
          })
          .then((audioDevice) => {
            expect(audioDevice.getDelay()).toEqual(5555);
            return App.setPrimarySpeakerDelay(-20);
          })
          .then((isSet) => {
            done.fail('Invalid value was accepted');
          })
          .catch((err) => {
            expect(err).toEqual(jasmine.any(Error));
            done();
          });
      });
    });
  });

  describe('should be able to get silence detection values', () => {
    var promise;
    beforeEach(() => {
      spyOn(window.external, 'AppGetPropertyAsync').and.callFake((funcName) => {
        if (funcName == 'microphonegain') {
          ctr++;
          var asyncId = 'iapp_' + ctr;
          xCallback(
            asyncId,
            encodeURIComponent('<configuration enable="0" gain="5"' + ' latency="1000"/>')
          );
          return asyncId;
        }
      });
    });

    describe('if silence detection is enabled', () => {
      beforeEach(() => {
        promise = App.isSilenceDetectionEnabled();
      });
      it('through a promise', () => {
        expect(promise).toBeInstanceOf(Promise);
      });

      it('that returns as a boolean', (done) => {
        promise.then((isEnabled) => {
          expect(isEnabled).toBeTypeOf('boolean');
          done();
        });
      });
    });

    describe('silence detection threshold', () => {
      beforeEach(() => {
        promise = App.getSilenceDetectionThreshold();
      });
      it('through a promise', () => {
        expect(promise).toBeInstanceOf(Promise);
      });

      it('that returns as a number', (done) => {
        promise.then((sdThreshold) => {
          expect(sdThreshold).toBeTypeOf('number');
          done();
        });
      });
    });

    describe('silence detection period', () => {
      beforeEach(() => {
        promise = App.getSilenceDetectionPeriod();
      });
      it('through a promise', () => {
        expect(promise).toBeInstanceOf(Promise);
      });

      it('that returns as a number', (done) => {
        promise.then((sdPeriod) => {
          expect(sdPeriod).toBeTypeOf('number');
          done();
        });
      });
    });
  });

  describe('should be able to set silence detection values', () => {
    var audioGainMock = encodeURIComponent(
      '<configuration enable="0"' + ' gain="5" latency="1000"/>'
    );
    beforeEach(() => {
      spyOn(window.external, 'AppGetPropertyAsync').and.callFake((funcName) => {
        if (funcName == 'microphonegain') {
          ctr++;
          var asyncId = 'iapp_' + ctr;
          xCallback(asyncId, audioGainMock);
          return asyncId;
        }
      });
    });

    describe('enable/disable silence detection', () => {
      var audioGainResultEnable = encodeURIComponent(
        '<configuration enable="1"' + ' gain="5" latency="1000"/>'
      );
      var silenceDetectionEnabledSet;
      var promise;
      beforeEach(() => {
        spyOn(window.external, 'AppSetPropertyAsync').and.callFake((funcName, value) => {
          silenceDetectionEnabledSet = false;
          if (funcName === 'microphonegain') {
            if (encodeURIComponent(value) === audioGainResultEnable) {
              silenceDetectionEnabledSet = true;
            }
            ctr++;
            var asyncId = 'iapp_' + ctr;
            xCallback(asyncId, '1');
            return asyncId;
          }
        });
        promise = App.enableSilenceDetection(true);
      });

      it('through a promise', () => {
        expect(promise).toBeInstanceOf(Promise);
      });

      it('as a boolean', (done) => {
        promise.then(() => {
          expect(silenceDetectionEnabledSet).toBe(true);
          done();
        });
      });
    });

    describe('silence detection threshold', () => {
      var audioGainResultThreshold = encodeURIComponent(
        '<configuration enable="0"' + ' gain="10" latency="1000"/>'
      );
      var silenceDetectionThresholdSet;
      var promise;
      beforeEach(() => {
        spyOn(window.external, 'AppSetPropertyAsync').and.callFake((funcName, value) => {
          silenceDetectionThresholdSet = false;
          if (funcName === 'microphonegain') {
            if (encodeURIComponent(value) === audioGainResultThreshold) {
              silenceDetectionThresholdSet = true;
            }
            ctr++;
            var asyncId = 'iapp_' + ctr;
            xCallback(asyncId, '1');
            return asyncId;
          }
        });
        promise = App.setSilenceDetectionThreshold(10);
      });

      it('through a promise', () => {
        expect(promise).toBeInstanceOf(Promise);
      });

      it('as a number', (done) => {
        promise.then(() => {
          expect(silenceDetectionThresholdSet).toBe(true);
          done();
        });
      });

      it('should not be set below 0', (done) => {
        promise = App.setSilenceDetectionThreshold(-1)
          .then(() => {
            done.fail('Invalid value was accepted');
          })
          .catch((err) => {
            expect(err).toEqual(jasmine.any(Error));
            done();
          });
      });

      it('should not be set above 128', (done) => {
        promise = App.setSilenceDetectionThreshold(129)
          .then(() => {
            done.fail('Invalid value was accepted');
          })
          .catch((err) => {
            expect(err).toEqual(jasmine.any(Error));
            done();
          });
      });

      it('should not allow decimals', (done) => {
        promise = App.setSilenceDetectionThreshold(5.5)
          .then(() => {
            done.fail('Invalid value was accepted');
          })
          .catch((err) => {
            expect(err).toEqual(jasmine.any(Error));
            done();
          });
      });

      it('should only accept numbers', (done) => {
        promise = App.setSilenceDetectionThreshold('abcd')
          .then(() => {
            done.fail('Invalid value was accepted');
          })
          .catch((err) => {
            expect(err).toEqual(jasmine.any(Error));
            done();
          });
      });
    });

    describe('silence detection period', () => {
      var audioGainResultPeriod = encodeURIComponent(
        '<configuration enable="0"' + ' gain="5" latency="5000"/>'
      );
      var silenceDetectionPeriodSet;
      var promise;
      beforeEach(() => {
        spyOn(window.external, 'AppSetPropertyAsync').and.callFake((funcName, value) => {
          silenceDetectionPeriodSet = false;
          if (funcName === 'microphonegain') {
            if (encodeURIComponent(value) === audioGainResultPeriod) {
              silenceDetectionPeriodSet = true;
            }
            ctr++;
            var asyncId = 'iapp_' + ctr;
            xCallback(asyncId, '1');
            return asyncId;
          }
        });
        promise = App.setSilenceDetectionPeriod(5000);
      });

      it('through a promise', () => {
        expect(promise).toBeInstanceOf(Promise);
      });

      it('as a number', (done) => {
        promise.then(() => {
          expect(silenceDetectionPeriodSet).toBe(true);
          done();
        });
      });

      it('should not be set below 0', (done) => {
        promise = App.setSilenceDetectionPeriod(-1)
          .then(() => {
            done.fail('Invalid value was accepted');
          })
          .catch((err) => {
            expect(err).toEqual(jasmine.any(Error));
            done();
          });
      });

      it('should not be set above 60000', (done) => {
        promise = App.setSilenceDetectionPeriod(60001)
          .then(() => {
            done.fail('Invalid value was accepted');
          })
          .catch((err) => {
            expect(err).toEqual(jasmine.any(Error));
            done();
          });
      });

      it('should not accept decimals', (done) => {
        promise = App.setSilenceDetectionPeriod(1000.5)
          .then(() => {
            done.fail('Invalid value was accepted');
          })
          .catch((err) => {
            expect(err).toEqual(jasmine.any(Error));
            done();
          });
      });

      it('should only accept numbers', (done) => {
        promise = App.setSilenceDetectionPeriod('abcd')
          .then(() => {
            done.fail('Invalid value was accepted');
          })
          .catch((err) => {
            expect(err).toEqual(jasmine.any(Error));
            done();
          });
      });
    });
  });

  describe('should be able to get and set noise suppression support', () => {
    var arrayToObj = (array, separator) => {
      var obj = {};
      array.map((el) => {
        var separatorIndex = el.indexOf(separator);
        var key = el.substring(0, separatorIndex);
        obj[key] = el.substring(separatorIndex + 1);
      });
      return obj;
    };

    var promise;
    var nsEnabled = false;
    beforeEach(() => {
      spyOn(window.external, 'CallHostFunc').and.callFake((funcName, ...param) => {
        ctr++;
        var asyncId = 'iapp_' + ctr;
        if (funcName == 'getProperty' && param[0] === 'sound_ns') {
          xCallback(asyncId, `Enabled=${Number(nsEnabled)}`);
          return asyncId;
        } else if (funcName == 'setProperty' && param[0] === 'sound_ns') {
          var queryParams = param[1].split('&');
          var queryObj = arrayToObj(queryParams, '=');
          nsEnabled = queryObj['Enabled'] === '1';
          xCallback(asyncId, `Enabled=${Number(nsEnabled)}`);
        }
        return asyncId;
      });
    });

    describe('get if noise suppression is enabled', () => {
      beforeEach(() => {
        promise = App.isNoiseSuppressionEnabled();
      });
      it('through a promise', () => {
        expect(promise).toBeInstanceOf(Promise);
      });

      it('that returns as a boolean', (done) => {
        promise.then((isEnabled) => {
          expect(isEnabled).toBeTypeOf('boolean');
          done();
        });
      });
    });

    describe('enable/disable noise suppression', () => {
      var promise;
      beforeEach(() => {
        promise = App.enableNoiseSuppression(true);
      });

      it('through a promise', () => {
        expect(promise).toBeInstanceOf(Promise);
      });

      it('as a boolean', (done) => {
        promise.then(() => {
          expect(nsEnabled).toBe(true);
          done();
        });
      });

      it('and is correctly set', (done) => {
        promise
          .then(() => {
            expect(nsEnabled).toBe(true);
            return App.enableNoiseSuppression(false);
          })
          .then(() => {
            expect(nsEnabled).toBe(false);
            done();
          });
      });
    });
  });

  describe('should get transition', () => {
    beforeEach(() => {
      spyOn(window.external, 'AppGetPropertyAsync').and.callFake((funcName) => {
        if (funcName == 'transitionid') {
          ctr++;
          var asyncId = 'iapp_' + ctr;
          xCallback(asyncId, 'clock');
          return asyncId;
        }
      });
    });

    it('through a promise', () => {
      var promise = App.getTransition();
      expect(promise).toBeInstanceOf(Promise);
    });
  });

  describe('should be able to set transition', () => {
    var transitionSet;
    var promise;
    beforeEach(() => {
      transitionSet = false;
      spyOn(window.external, 'AppSetPropertyAsync').and.callFake((funcName, value) => {
        if (funcName === 'transitionid' && value == 'clock') {
          transitionSet = true;
          ctr++;
          var asyncId = 'iapp_' + ctr;
          xCallback(asyncId, '1');
          return asyncId;
        }
      });
      promise = App.setTransition(Transition.CLOCK);
    });

    it('through a promise', () => {
      expect(promise).toBeInstanceOf(Promise);
    });

    it('as a Transition object', (done) => {
      promise.then(() => {
        expect(transitionSet).toBe(true);
        done();
      });
    });
  });

  describe('should get transition time', () => {
    beforeEach(() => {
      spyOn(window.external, 'AppGetPropertyAsync').and.callFake((funcName) => {
        if (funcName == 'transitiontime') {
          ctr++;
          var asyncId = 'iapp_' + ctr;
          xCallback(asyncId, '3000');
          return asyncId;
        }
      });
    });

    it('through a promise', () => {
      var promise = App.getTransitionTime();
      expect(promise).toBeInstanceOf(Promise);
    });

    it('that always return as a number', (done) => {
      var promise = App.getTransitionTime();
      promise.then((count) => {
        expect(count).toBeTypeOf('number');
        expect(count).not.toBeNaN();
        done();
      });
    });
  });

  describe('should be able to set transtion time', () => {
    var transitionTimeSet;
    var promise;
    beforeEach(() => {
      transitionTimeSet = false;
      spyOn(window.external, 'AppSetPropertyAsync').and.callFake((funcName, value) => {
        if (funcName === 'transitiontime' && typeof value == 'string' && value === '1000') {
          transitionTimeSet = true;
          ctr++;
          var asyncId = 'iapp_' + ctr;
          xCallback(asyncId, '1');
          return asyncId;
        }
      });
      promise = App.setTransitionTime('1000');
    });

    it('through a promise', () => {
      expect(promise).toBeInstanceOf(Promise);
    });

    it('as a string', (done) => {
      promise.then(() => {
        expect(transitionTimeSet).toBe(true);
        done();
      });
    });
  });

  describe('should be able to clear cookies', () => {
    it('but not for source plugin window', (done) => {
      env.set(environments[2]); // source plugin window
      App.clearBrowserCookies()
        .then(
          () => {
            done.fail('Clear browser cookies should reject on source plugin,');
          },
          () => {
            env.set(environments[0]); // source config window
          }
        )
        .then(App.clearBrowserCookies)
        .then(
          () => {
            env.set(environments[1]); // extension window
          },
          () => {
            done.fail('Clear browser cookies should work in source config window.');
          }
        )
        .then(App.clearBrowserCookies)
        .then(
          () => {
            expect(true).toBe(true);
            done();
          },
          () => {
            done.fail('Clear browser cookies should work in extensions.');
          }
        );
    });
  });

  describe('should be able to get hashed user identity', () => {
    beforeEach(() => {
      spyOn(window.external, 'GetGlobalProperty').and.callFake((prop) => {
        if (prop === 'userid') {
          return '+965Bu+jXY+jUvCCbSAJbQ==';
        }
      });
    });

    it('as a string', (done) => {
      App.getUserIdHash().then((hash) => {
        expect(hash).toBeTypeOf('string');
        done();
      });
    });

    it('encoded using some has function', (done) => {
      // simple checking of character set, not really testing other constraints
      var regex = /^[A-Za-z0-9+=]+$/;

      App.getUserIdHash().then((hash) => {
        expect(regex.test(hash)).toBe(true);
        done();
      });
    });
  });
});
