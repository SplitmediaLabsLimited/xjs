/* globals require */

(function() {
  'use strict';

  var gulp      = require('gulp'),
    browserify  = require('browserify'),
    source      = require('vinyl-source-stream'),
    bs          = require('browser-sync'),
    Server      = require('karma').Server;

  gulp.task('browserify', function() {
    return browserify('./src/index.ts')
      .plugin('tsify', {
        target: 'ES5',
        declaration: true })
      .require('./src/index.ts', {expose: 'xjs'})
      .bundle()
      .pipe(source('xjs.js'))
      .pipe(gulp.dest('dist'));
  });

  gulp.task('test/unit', function(done) {
    new Server({
      configFile: __dirname + '/karma.conf.js',
    }, done).start();
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
