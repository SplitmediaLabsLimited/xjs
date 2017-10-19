/* globals describe, it, spyOn, require, beforeEach, expect, jasmine */

describe('LanguageInfo ===', function() {
  'use strict';

  var XJS = require('xjs');
  var LanguageInfo = XJS.LanguageInfo;
  var env = new window.Environment(XJS);
  var envirnomens = ['extension', 'plugin'];

  it('should be able to listen to language change', function(done) {
    LanguageInfo.on('language-change', function(langObj) {
      expect(langObj['lang']).toBeTypeOf('string');
      expect(langObj['lang']).toEqual('es')
      done();
    })
    window.SetEvent('event=LanguageChanged&lang=es')
  })
})
