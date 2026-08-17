/* globals describe, it, expect, beforeEach, require */

'use strict';

var XJS    = require('xjs');
var Screen = XJS.Screen;
var System = XJS.System;
var ctr = 0;
describe('Screen', function() {
  var promise;
  var promise2;
  var defpos = 0;

  beforeEach(function() {
    spyOn(window.external, 'CallDll')
      .and.callFake(function(funcName) {
        if(funcName === 'xsplit.EnumParentWindows') {
          return '65706,65886,65868,3408472,524904,131184,198810,66236,197188,132240,67126,1050848'
        } else if(funcName === 'xsplit.GetWindowTitle') {
          return 'Developer Tools - file:///D:/Repositories/samples/SplitTest/Splitview.html - Google Chrome'
        } else if(funcName === 'xsplit.GetWindowClassName') {
          return 'Chrome_WidgetWin_1'
        } else if(funcName === 'xsplit.GetWindowProcessId') {
          return '14528'
        } else if(funcName === 'xsplit.GetProcessDetailsKernel') {
          return '\Device\HarddiskVolume4\Users\viab\AppData\Local\Google\Chrome\Application\chrome.exe'
        }
      })

    spyOn(window.external, 'AppCallFuncAsync')
      .and.callFake(function(funcName, screen) {
        ctr++;
        var asyncId = 'screen_' + ctr;
        if(funcName === 'addscreen') {
          setTimeout(function() {
            window.OnAsyncCallback(asyncId, true);
          }, 10);
        }
      })
    promise = System.getAvailableScreens();
    promise2 = Screen.addToScene();
  });

  describe('should be able to get screens', function() {
    it('through a promise', function() {
      promise = System.getAvailableScreens();
      expect(promise).toBeInstanceOf(Promise);
    });

    it('as an array', function(done) {
      promise.then(function(screens) {
        expect(screens).toBeInstanceOf(Array);
        done();
      });
    });

    it('with correct properties', function(done) {
      promise.then(function(screens) {
        expect(screens)
          .eachHasMethods(['addToScene'].join(','));
          done();
      });
    });

  })

  describe('should be able to static method', function() {
    it('through a promise', function() {
      promise2 = Screen.addToScene();
      expect(promise2).toBeInstanceOf(Promise);
    });

    it('with correct properties', function(done) {
      expect(Screen)
        .hasMethods(['addToScene'].join(','));
        done();
    });
  })

})