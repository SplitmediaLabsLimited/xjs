/* globals describe, it, spyOn, require, beforeEach, expect, jasmine */

describe('Dll ===', () => {
  var XJS = require('xjs');
  var env = new window.Environment(XJS);
  var Dll = XJS.Dll;
  var environments = ['props', 'extension', 'plugin'];

  describe('should be able', () => {
    beforeEach(() => {
      spyOn(external, 'LoadDll');
    });

    it(' to load dll', (done) => {
      Dll.load(['Scriptdlls\\SplitMediaLabs\\XjsEx.dll']).then(() => {
        expect(external.LoadDll).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('should be able call functions', () => {
    beforeEach(() => {
      spyOn(external, 'CallDll').and.callFake((funcName) => {
        if (funcName === 'xsplit.EnumParentWindows') {
          return '65750,131452,132324,131374,131454,65910,66274,66402,66400,66398,66396,66394,66392,66390,1049414,131916,66604,132240,263086,459244,983482,132276,4129072,6227402,394892,395240,395362';
        } else {
          return undefined;
        }
      });

      spyOn(external, 'CallDllEx').and.callFake((funcName, parameters) => {
        if (funcName === 'xsplit.Exists') {
          return '1';
        } else {
          return undefined;
        }
      });
    });

    it('from safe dlls', (done) => {
      Dll.call('xsplit.EnumParentWindows')
        .then((parentWindows) => {
          expect(parentWindows).toBeTypeOf('string');
          return Dll.call('Some random function');
        })
        .then(
          () => {
            done.fail('Call should reject if Dll call is not defined');
          },
          () => {
            done();
          }
        );
    });

    it('from unsafe dlls', (done) => {
      Dll.callEx('xsplit.Exists', 'C:\\\\text.txt')
        .then((exists) => {
          expect(exists).toBeTypeOf('string');
          return Dll.call('Some random function');
        })
        .then(
          () => {
            done.fail('CallEx should reject if Ex Dll call is not defined');
          },
          () => {
            done();
          }
        );
    });
  });

  describe('should be able to get grant access status', () => {
    beforeEach(() => {
      spyOn(external, 'CheckDllGrant').and.callFake((funcName) => '0');
    });

    it('through a promise', () => {
      var promise = Dll.isAccessGranted();
      expect(promise).toBeInstanceOf(Promise);
    });

    it('that returns as a boolean', (done) => {
      var promise = Dll.isAccessGranted();
      promise.then((isEnabled) => {
        expect(isEnabled).toBeTypeOf('boolean');
        done();
      });
    });
  });

  describe('should be able to listen to access grant events', () => {
    it('whether it is granted', (done) => {
      Dll.on('access-granted', () => {
        expect(true).toBe(true);
        done();
      });
      window.Setdlldogrant('1');
    });

    it('or revoked', (done) => {
      Dll.on('access-revoked', () => {
        expect(true).toBe(true);
        done();
      });
      window.UpdateLocalProperty('prop:dlldogrant', '0');
    });
  });
});
