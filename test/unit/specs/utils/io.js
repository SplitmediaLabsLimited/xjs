/* globals describe, it, spyOn, require, beforeEach, expect, jasmine */

describe('IO ===', () => {
  var XJS = require('xjs');
  var IO = XJS.IO;
  var env = new window.Environment(XJS);
  var environment = XJS.Environment;
  var environments = ['props', 'extension', 'plugin'];

  describe('should be able to show an "Open File" dialog', () => {
    var isValid, allowMultiSelect, fileMustExist, forceShowHidden, isCancelled;
    beforeEach(() => {
      isValid = false;
      isCancelled = false;
      allowMultiSelect = false;
      fileMustExist = false;
      forceShowHidden = false;
      spyOn(window.external, 'OpenFileDialogAsync').and.callFake(
        (extension, value, flags, filterString) => {
          var asyncId = new Date().getTime() + Math.floor(Math.random() * 1000);
          var filePath = 'C:\\videos\\video.mov|C:\\videos\\audio.ogg';

          if (filterString !== '') {
            isValid =
              filterString.indexOf('|') > -1 &&
              filterString.indexOf('|') > -1 &&
              filterString.substr(filterString.length - 2) === '||';
          } else if (isCancelled) {
            filePath = 'null';
          } else if (
            allowMultiSelect === Boolean(flags & 0x200) &&
            fileMustExist === Boolean(flags & 0x1000) &&
            forceShowHidden === Boolean(flags & 0x10000000)
          ) {
            isValid = true;
          }

          setTimeout(() => {
            window.OnAsyncCallback(asyncId, filePath);
          }, 10);

          return asyncId;
        }
      );
    });

    it('which accepts certain flags', (done) => {
      var optionBag = {};
      allowMultiSelect = true;
      optionBag.allowMultiSelect = allowMultiSelect;
      IO.openFileDialog(optionBag)
        .then(() => {
          expect(isValid).toBe(true);
          isValid = false;
          allowMultiSelect = false;
          fileMustExist = true;
          optionBag = {};
          optionBag.fileMustExist = fileMustExist;
          return IO.openFileDialog(optionBag);
        })
        .then(() => {
          expect(isValid).toBe(true);
          isValid = false;
          allowMultiSelect = false;
          fileMustExist = false;
          forceShowHidden = true;
          optionBag = {};
          optionBag.forceShowHidden = forceShowHidden;
          return IO.openFileDialog(optionBag);
        })
        .then(() => {
          expect(isValid).toBe(true);
          isValid = false;
          optionBag = {};
          allowMultiSelect = randomBoolean();
          fileMustExist = randomBoolean();
          forceShowHidden = randomBoolean();
          optionBag.allowMultiSelect = allowMultiSelect;
          optionBag.fileMustExist = fileMustExist;
          optionBag.forceShowHidden = forceShowHidden;
          return IO.openFileDialog(optionBag);
        })
        .then(() => {
          expect(isValid).toBe(true);
          done();
        });
    });

    it('which can be filtered with a given set of file types/extensions', (done) => {
      isValid = false;
      var filterObj = {};
      filterObj.name = 'Image Files';
      filterObj.extensions = ['jpg', 'bmp'];
      IO.openFileDialog(null, filterObj).then(() => {
        expect(isValid).toBe(true);
        done();
      });
    });

    it('which resolves with an array of file paths', (done) => {
      IO.openFileDialog().then((files) => {
        expect(files).eachToBeTypeOf('string');
        expect(Array.isArray(files)).toBe(true);
        done();
      });
    });

    it('which rejects when cancelled', (done) => {
      isCancelled = true;
      IO.openFileDialog().then(
        (files) => {
          done.fail('openFileDialog should reject if cancelled');
        },
        () => {
          expect(true).toBe(true);
          isCancelled = false;
          done();
        }
      );
    });

    it('which rejects when called on source', (done) => {
      env.set(environments[2]);
      IO.openFileDialog().then(
        (files) => {
          done.fail('openFileDialog should reject if called from source');
        },
        () => {
          isCancelled = false;
          env.set(environments[1]);
          expect(true).toBe(true);
          done();
        }
      );
    });
  });

  describe("should be able to get a video files's playback duration", () => {
    var filePath = 'C:\\videos\\video.mov';
    env.set(environments[1]);
    beforeEach(() => {
      spyOn(window.external, 'GetVideoDuration').and.callFake((file) => {
        if (file === filePath) {
          setTimeout(() => {
            window.OnGetVideoDuration(file, randomInt(0, 999999999).toString());
          }, 10);
        } else {
          setTimeout(() => {
            window.OnGetVideoDurationFailed(file);
          }, 10);
        }
      });
    });

    it('which resolves as a number', (done) => {
      IO.getVideoDuration(filePath).then((duration) => {
        expect(duration).toBeTypeOf('number');
        done();
      });
    });

    it('which rejects upon failure', (done) => {
      IO.getVideoDuration('C:\\videos\\some_random_filename.mov').then(
        () => {
          done.fail('getVideoDuration should reject if video duration cannot be fetched');
        },
        (duration) => {
          expect(true).toBe(true);
          done();
        }
      );
    });

    it('which automatically rejects when no file is supplied', (done) => {
      IO.getVideoDuration().then(
        () => {
          done.fail('getVideoDuration should reject if no file is supplied');
        },
        (duration) => {
          expect(true).toBe(true);
          done();
        }
      );
    });

    it('which rejects when called on source', (done) => {
      env.set(environments[2]);
      IO.getVideoDuration(filePath).then(
        (files) => {
          done.fail('getVideoDuration should reject if called from source');
        },
        () => {
          env.set(environments[1]);
          expect(true).toBe(true);
          done();
        }
      );
    });
  });
});
