/* globals require */

(function() {
  'use strict';

  var gulp      = require('gulp'),
    browserify  = require('browserify'),
    source      = require('vinyl-source-stream'),
    bs          = require('browser-sync');
  
  gulp.task('browserify', function() {
    return browserify('./src/core/index.ts')
      .plugin('tsify')
      .require('./src/core/index.ts', {expose: 'xjs'})
      .bundle()
      .pipe(source('xjs.js'))
      .pipe(gulp.dest('dist'));
  });

  gulp.task('test/unit', function() {
    bs.create('unit test server').init({
      server: {
        baseDir: 'test/unit',
        index: 'test.html'
      },
      browser: 'google chrome'
    });
  });

  gulp.task('test/functional', function() {
    bs.create('functional test server').init({
      open: false,
      server: {
        baseDir: 'test/functional',
        index: 'test.html',
        middleware: function (req, res, next) {
          res.setHeader('Access-Control-Allow-Origin', '*');
          next();
        }
      },
      port: 9000
    });
  });

  gulp.task('default', ['browserify']);
}());
