/* globals describe, it, expect, require, beforeEach, spyOn */

describe('Url', () => {
  var XJS = require('xjs');
  var Url = XJS.Url;
  var ctr = 0;
  beforeEach(() => {
    if (!/xsplit broadcaster/gi.test(navigator.appVersion)) {
      spyOn(window.external, 'AppCallFuncAsync').and.callFake((funcName) => {
        if (funcName.includes('addurl')) {
          ctr++;
          var asyncId = 'url_' + ctr;

          setTimeout(() => {
            window.OnAsyncCallback(asyncId, '0');
          }, 10);
          return asyncId;
        }
      });
    }
  });

  describe('should add valid URL sources', () => {
    it('with HTTP', (done) => {
      var url = new Url('http://www.xsplit.com')
        .addToScene()
        .then(() => {
          expect(true).toBe(true);
          done();
        })
        .catch((error) => {
          done.fail('Adding HTTP source failed.');
        });
    });

    it('with HTTPS', (done) => {
      var url = new Url('https://www.xsplit.com')
        .addToScene()
        .then(() => {
          expect(true).toBe(true);
          done();
        })
        .catch((error) => {
          done.fail('Adding HTTPS source failed.');
        });
    });

    it('with no protocols specified', (done) => {
      var url = new Url('www.xsplit.com')
        .addToScene()
        .then(() => {
          expect(true).toBe(true);
          done();
        })
        .catch((error) => {
          done.fail('Adding URL source with no specified protocol failed.');
        });
    });
  });

  describe('should not add invalid sources', () => {
    it('such as FTP', (done) => {
      var url = new Url('ftp://xsplit.com')
        .addToScene()
        .then(() => {
          done.fail('Should not add FTP');
        })
        .catch((error) => {
          expect(true).toBe(true);
          done();
        });
    });

    it('such as nonexistent protocols', (done) => {
      var url = new Url('asdfp://xsplit.com')
        .addToScene()
        .then(() => {
          done.fail('Should not add FTP');
        })
        .catch((error) => {
          expect(true).toBe(true);
          done();
        });
    });
  });
});
