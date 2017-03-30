/* globals describe, it, spyOn, require, beforeEach, expect, jasmine */

describe('Dll ===', function() {
  'use strict';

  var XJS = require('xjs');
  var env = new window.Environment(XJS);
  var Dll = XJS.Dll;
  var environments = ['props', 'extension', 'plugin'];

  describe('should be able', function() {
    beforeEach(function() {
      spyOn(external, 'LoadDll');
    });

    it(' to load dll', function(done) {
      Dll.load(['Scriptdlls\\SplitMediaLabs\\XjsEx.dll']).then(function() {
        expect(external.LoadDll).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('should be able call functions', function() {
    beforeEach(function() {
      spyOn(external, 'CallDll').and.callFake(function(funcName) {
        if (funcName == 'xsplit.EnumParentWindows') {
          return "65750,131452,132324,131374,131454,65910,66274,66402,66400,66398,66396,66394,66392,66390,1049414,131916,66604,132240,263086,459244,983482,132276,4129072,6227402,394892,395240,395362";
        } else {
          return undefined;
        }
      });

      spyOn(external, 'CallDllEx').and.callFake(function(funcName, parameters) {
        if (funcName == 'xsplit.Exists') {
          return "1";
        } else {
          return undefined;
        }
      });
    });

    it('from safe dlls', function(done) {
      Dll.call('xsplit.EnumParentWindows')
      .then(function(parentWindows) {
        expect(parentWindows).toBeTypeOf('string');
        return Dll.call('Some random function');
      }).then(function() {
        done.fail('Call should reject if Dll call is not defined');
      }, function() {
        done();
      });
    });

    it('from unsafe dlls', function(done) {
      Dll.callEx('xsplit.Exists', 'C:\\\\text.txt')
      .then(function(exists) {
        expect(exists).toBeTypeOf('string');
        return Dll.call('Some random function');
      }).then(function() {
        done.fail('CallEx should reject if Ex Dll call is not defined');
      }, function() {
        done();
      });
    });
  });

  describe('should be able to get grant access status', function() {
    beforeEach(function() {
      spyOn(external, 'CheckDllGrant')
        .and.callFake(function(funcName) {
        return "0";
      });
    });

    it('through a promise', function() {
      var promise = Dll.isAccessGranted();
      expect(promise).toBeInstanceOf(Promise);
    });

    it('that returns as a boolean', function(done) {
      var promise = Dll.isAccessGranted();
      promise.then(function(isEnabled) {
        expect(isEnabled).toBeTypeOf('boolean');
        done();
      });
    });
  });

  describe('should be able to listen to access grant events', function() {
    it('whether it is granted', function(done) {
      Dll.on('access-granted', function() {
        expect(true).toBe(true);
        done(); 
      });
      window.Setdlldogrant("1")
    });

    it('or revoked', function(done) {
      Dll.on('access-revoked', function() {
        expect(true).toBe(true);
        done(); 
      });
      window.UpdateLocalProperty('prop:dlldogrant', '0');
    });
  });
});
