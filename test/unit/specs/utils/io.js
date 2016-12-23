/* globals describe, it, spyOn, require, beforeEach, expect, jasmine */

describe('IO ===', function() {
  'use strict';

  var XJS = require('xjs');
  var IO = XJS.IO;
  var env = new window.Environment(XJS);
  var environment = XJS.Environment;
  var environments = ['props', 'extension', 'plugin'];

  describe('should be able to show an "Open File" dialog', function() {
    var isValid, allowMultiSelect, fileMustExist, forceShowHidden, isCancelled;
    beforeEach(function() {
      isValid = false;
      isCancelled = false;
      allowMultiSelect = false;
      fileMustExist = false;
      forceShowHidden = false;
      spyOn(window.external, 'OpenFileDialogAsync')
        .and.callFake(function(extension, value, flags, filterString) {
        var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);
        var filePath = 'C:\\videos\\video.mov|C:\\videos\\audio.ogg';

        if (filterString !== '') {
          isValid = ((filterString.indexOf('|') > -1) && (filterString.indexOf('|') > -1) && (filterString.substr(filterString.length - 2) === '||'))
        } else if (isCancelled) {
          filePath = 'null';          
        } else if ((allowMultiSelect === Boolean(flags&0x200)) && 
            (fileMustExist === Boolean(flags&0x1000)) && 
            (forceShowHidden === Boolean(flags&0x10000000))) {
          isValid = true;
        }

        setTimeout(function() {
          window.OnAsyncCallback(asyncId, filePath);
        },10);

        return asyncId;
      });
    });

    it('which accepts certain flags', function(done) {
      var optionBag = {};
      allowMultiSelect = true;
      optionBag.allowMultiSelect = allowMultiSelect;
      IO.openFileDialog(optionBag)
      .then(function() {
        expect(isValid).toBe(true);
        isValid = false;
        allowMultiSelect = false;
        fileMustExist = true;
        optionBag = {};
        optionBag.fileMustExist = fileMustExist;
        return IO.openFileDialog(optionBag);
      }).then(function() {
        expect(isValid).toBe(true);
        isValid = false;
        allowMultiSelect = false;
        fileMustExist = false;
        forceShowHidden = true;
        optionBag = {};
        optionBag.forceShowHidden = forceShowHidden;
        return IO.openFileDialog(optionBag);
      }).then(function() {
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
      }).then(function() {
        expect(isValid).toBe(true);
        done();
      });
    });

    it('which can be filtered with a given set of file types/extensions', function(done) {
      isValid = false;
      var filterObj = {};
      filterObj.name = 'Image Files';
      filterObj.extensions = ['jpg','bmp'];
      IO.openFileDialog(null, filterObj).then(function() {
        expect(isValid).toBe(true);
        done();
      });
    });

    it('which resolves with an array of file paths', function(done) {
      IO.openFileDialog().then(function(files) {
        expect(files).eachToBeTypeOf('string');
        expect(Array.isArray(files)).toBe(true);
        done();
      });
    });

    it('which rejects when cancelled', function(done) {
      isCancelled = true;
      IO.openFileDialog().then(function(files) {
        done.fail('openFileDialog should reject if cancelled');
      }, function() {
        expect(true).toBe(true);
        isCancelled = false;
        done();
      });
    });

    it('which rejects when called on source', function(done) {
      env.set(environments[2]);
      IO.openFileDialog().then(function(files) {
        done.fail('openFileDialog should reject if called from source');
      }, function() {
        isCancelled = false;
        env.set(environments[1]);
        expect(true).toBe(true);
        done();
      });
    });
  });

  describe('should be able to get a video files\'s playback duration', function() {
    var filePath = 'C:\\videos\\video.mov';
    env.set(environments[1]);
    beforeEach(function() {
      spyOn(window.external, 'GetVideoDuration')
        .and.callFake(function(file) {
        if (file === filePath) {
          setTimeout(function() {
            window.OnGetVideoDuration(file, randomInt(0, 999999999).toString());
          },10);
        } else {
          setTimeout(function() {
            window.OnGetVideoDurationFailed(file);
          },10);
        }
      });
    });

    it('which resolves as a number', function(done) {
      IO.getVideoDuration(filePath).then(function(duration) {
        expect(duration).toBeTypeOf('number');
        done();
      });
    });

    it('which rejects upon failure', function(done) {
      IO.getVideoDuration('C:\\videos\\some_random_filename.mov').then(function() {
        done.fail('getVideoDuration should reject if video duration cannot be fetched');
      }, function(duration) {
        expect(true).toBe(true);
        done();
      });      
    });

    it('which automatically rejects when no file is supplied', function(done) {
      IO.getVideoDuration().then(function() {
        done.fail('getVideoDuration should reject if no file is supplied');
      }, function(duration) {
        expect(true).toBe(true);
        done();
      });       
    });

    it('which rejects when called on source', function(done) {
      env.set(environments[2]);
      IO.getVideoDuration(filePath)
      .then(function(files) {
        done.fail('getVideoDuration should reject if called from source');
      }, function() {
        env.set(environments[1]);
        expect(true).toBe(true);
        done();
      });
    });

  });

});