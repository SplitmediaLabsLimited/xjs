/* globals require */

(function() {
  'use strict';

  var del       = require('del'),
    gulp        = require('gulp'),
    bower       = require('bower'),
    browserify  = require('browserify'),
    Dgeni       = require('dgeni'),
    source      = require('vinyl-source-stream'),
    bs          = require('browser-sync'),
    history     = require('connect-history-api-fallback'),
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
        routes: {
          '/dist': './dist'
        },
        index: 'test.html',
        middleware: function (req, res, next) {
          res.setHeader('Access-Control-Allow-Origin', '*');
          next();
        }
      },
      port: 9000
    });
  });

  //-------------------------------------------------------
  // API Documentation Generator
  //-------------------------------------------------------
  var DIST = 'dist/api';

  gulp.task('docs/clean', function(done) {
    del(DIST, done);
  });

  gulp.task('docs/bower', function() {
    var inst = bower.commands.install(undefined, undefined, { cwd: 'docs' });
    inst.on('log', function(result) {
      console.log('bower:', result.id, result.data.endpoint.name);
    });
    inst.on('error', function(err) {
      console.log(err);
    });
    return inst;
  });

  gulp.task('docs/dgeni', function() {
    try {
      var dgeni = new Dgeni([require('./docs/public-docs-package')]);
      return dgeni.generate();
    } catch(err) {
      console.log(err);
      console.log(err.stack);
      throw err;
    }
  });

  gulp.task('docs/assets', ['docs/bower'], function() {
    return gulp.src('docs/bower_components/**/*')
      .pipe(gulp.dest(DIST + '/bower_components'));
  });

  gulp.task('docs/app', function() {
    return gulp.src('docs/app/**/*').pipe(gulp.dest(DIST));
  });

  gulp.task('docs/serve', function() {
    bs.init({
      server: {
        baseDir: './dist/api/',
        middleware: [ history() ],
        routes: {
            "/bower_components": "bower_components"
        }
      }
    });
  });

  gulp.task('docs', ['docs/assets', 'docs/app', 'docs/dgeni']);

  gulp.task('default', ['browserify']);
}());
