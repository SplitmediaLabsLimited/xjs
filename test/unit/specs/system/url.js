/* globals describe, it, expect, require, beforeEach, spyOn */

describe('Url', function() {
  'use strict';

  var XJS = require('xjs');
  var Url = XJS.Url;

  beforeEach(function() {
    if (!/xsplit broadcaster/ig.test(navigator.appVersion)) {
      spyOn(window.external, 'AppCallFuncAsync')
        .and.callFake(function(funcName) {
          if(funcName === 'addurl') {
            var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);

            setTimeout(function() {
              window.OnAsyncCallback(asyncId, '0');
            }, 10);
            return asyncId;
          }
        });
    }
  });

  describe('should add valid URL sources', function() {
    it('with HTTP', function(done) {
      var url = new Url('http://www.xsplit.com').addToScene().then(function() {
        expect(true).toBe(true);
        done();
      }).catch(function(error) {
        done.fail('Adding HTTP source failed.');
      });
    });

    it('with HTTPS', function(done) {
      var url = new Url('https://www.xsplit.com').addToScene().then(function() {
        expect(true).toBe(true);
        done();
      }).catch(function(error) {
        done.fail('Adding HTTPS source failed.');
      });
    });

    it('with no protocols specified', function(done) {
      var url = new Url('www.xsplit.com').addToScene().then(function() {
        expect(true).toBe(true);
        done();
      }).catch(function(error) {
        done.fail('Adding URL source with no specified protocol failed.');
      });
    });
  });

  describe('should not add invalid sources', function() {
    it('such as FTP', function(done) {
      var url = new Url('ftp://xsplit.com').addToScene().then(function() {
        done.fail('Should not add FTP');
      }).catch(function(error) {
        expect(true).toBe(true);
        done();
      });
    });

    it('such as nonexistent protocols', function(done) {
      var url = new Url('asdfp://xsplit.com').addToScene().then(function() {
        done.fail('Should not add FTP');
      }).catch(function(error) {
        expect(true).toBe(true);
        done();
      });
    });
  });
});
