/* globals describe, it, spyOn, require, beforeEach, expect, jasmine */

describe('LanguageInfo ===', function() {
  'use strict';

  var XJS = require('xjs');
  var LanguageInfo = XJS.LanguageInfo;
  var env = new window.Environment(XJS);
  var envirnomens = ['extension', 'plugin'];

  var promise;
  var langCode = 'es';
  beforeEach(function() {
    spyOn(window.external, 'CallHostFunc')
      .and.callFake(function(funcName, ...param) {
      if (funcName == 'getProperty' && param[0] === 'html:language') {
        var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);

        setTimeout(function() {
          window.OnAsyncCallback(asyncId, langCode);
        },10);

        return asyncId;
      }
    });
  });

  it('should be able to listen to language change', function(done) {
    LanguageInfo.on('language-change', function(langObj) {
      expect(langObj['lang']).toBeTypeOf('string');
      expect(langObj['lang']).toEqual('es')
      done();
    })
    window.SetEvent('event=LanguageChanged&lang=es')
  })

  it('should be able to get the current language', function(done) {
    beforeEach(function() {
      promise = LanguageInfo.getCode()
    });
    it('through a promise', function() {
      expect(promise).toBeInstanceOf(Promise);
    });

    it('that returns as a string', function(done) {
      promise.then(function(code) {
        expect(code).toBeTypeOf('string');
        expect(langObj['lang']).toEqual(langCode);
        done();
      });
    });
  });
})
