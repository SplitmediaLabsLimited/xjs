/* globals describe, it, spyOn, require, beforeEach, expect, jasmine */

describe('LanguageInfo ===', () => {
  var XJS = require('xjs');
  var LanguageInfo = XJS.LanguageInfo;
  var env = new window.Environment(XJS);
  var envirnomens = ['extension', 'plugin'];

  var promise;
  var langCode = 'es';
  var ctr = 0;
  beforeEach(() => {
    spyOn(window.external, 'CallHostFunc').and.callFake((funcName, ...param) => {
      if (funcName === 'getProperty' && param[0] === 'html:language') {
        ctr++;
        var asyncId = 'language_info' + ctr;

        setTimeout(() => {
          window.OnAsyncCallback(asyncId, langCode);
        }, 10);

        return asyncId;
      }
    });
  });

  it('should be able to listen to language change', (done) => {
    LanguageInfo.on('language-change', (langObj) => {
      expect(langObj['lang']).toBeTypeOf('string');
      expect(langObj['lang']).toEqual('es');
      done();
    });
    window.SetEvent('event=LanguageChanged&lang=es');
  });

  describe('should be able to get the current language', () => {
    beforeEach(() => {
      promise = LanguageInfo.getCode();
    });
    it('through a promise', () => {
      expect(promise).toBeInstanceOf(Promise);
    });

    it('that returns as a string', (done) => {
      promise.then((code) => {
        expect(code).toBeTypeOf('string');
        expect(code).toEqual(langCode);
        done();
      });
    });
  });
});
