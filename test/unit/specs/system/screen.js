/* globals describe, it, expect, beforeEach, require */

var XJS = require('xjs');
var Screen = XJS.Screen;
var System = XJS.System;
var ctr = 0;
describe('Screen', () => {
  var promise;
  var promise2;
  var defpos = 0;

  beforeEach(() => {
    spyOn(window.external, 'CallDll').and.callFake((funcName) => {
      if (funcName === 'xsplit.EnumParentWindows') {
        return '65706,65886,65868,3408472,524904,131184,198810,66236,197188,132240,67126,1050848';
      } else if (funcName === 'xsplit.GetWindowTitle') {
        return 'Developer Tools - file:///D:/Repositories/samples/SplitTest/Splitview.html - Google Chrome';
      } else if (funcName === 'xsplit.GetWindowClassName') {
        return 'Chrome_WidgetWin_1';
      } else if (funcName === 'xsplit.GetWindowProcessId') {
        return '14528';
      } else if (funcName === 'xsplit.GetProcessDetailsKernel') {
        return 'DeviceHarddiskVolume4Users\viabAppDataLocalGoogleChromeApplicationchrome.exe';
      }
    });

    spyOn(window.external, 'AppCallFuncAsync').and.callFake((funcName, screen) => {
      ctr++;
      var asyncId = 'screen_' + ctr;
      if (funcName === 'addscreen') {
        setTimeout(() => {
          window.OnAsyncCallback(asyncId, true);
        }, 10);
      }
    });
    promise = System.getAvailableScreens();
    promise2 = Screen.addToScene();
  });

  describe('should be able to get screens', () => {
    it('through a promise', () => {
      promise = System.getAvailableScreens();
      expect(promise).toBeInstanceOf(Promise);
    });

    it('as an array', (done) => {
      promise.then((screens) => {
        expect(screens).toBeInstanceOf(Array);
        done();
      });
    });

    it('with correct properties', (done) => {
      promise.then((screens) => {
        expect(screens).eachHasMethods(['addToScene'].join(','));
        done();
      });
    });
  });

  describe('should be able to static method', () => {
    it('through a promise', () => {
      promise2 = Screen.addToScene();
      expect(promise2).toBeInstanceOf(Promise);
    });

    it('with correct properties', (done) => {
      expect(Screen).hasMethods(['addToScene'].join(','));
      done();
    });
  });
});
