/* globals require, console, __dirname, Buffer */

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
    Server      = require('karma').Server,
    data        = require('gulp-data'),
    path        = require('path'),
    argv        = require('yargs').argv;

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
  // Version bump task
  //-------------------------------------------------------

  /**
   * auto increment/decrement version
   *
   * @param  version Current version (format: n.n.n)
   * @param  type    Version up type (major = 0, minor = 1, patch = 2)
   * @param  mode    inc/dec
   * @return newVersion
   */
  var bumpVersion = function(version, type, mode) {
    var ver = version.split('.');

    if (mode === 'dec') {
      ver[type] = Number(ver[type]) <= 0 ? 0 : Number(ver[type]) - 1;
    } else {
      ver[type] = Number(ver[type]) + 1;
    }

    return ver.join('.');
  };

  gulp.task('version', ['default'], function() {
    var argTypes = ['major', 'minor', 'patch'];
    var type = 1;
    var version = '0.0.0';

    for (var i in argTypes) {
      if (argv[argTypes[i]] !== undefined) {
        type = i;
        break;
      }
    }

    return gulp.src(['./package.json', './bower.json', './dist/xjs.js'],
        {base: './'})
      .pipe(data(function(file) {
        var updatedContents = '';

        if (path.basename(file.path) === 'xjs.js') {
          updatedContents = String(file.contents);

          updatedContents =
            '/****************************\n' +
            ' * XSplit JS Framework\n' +
            ' * version: ' + version + '\n' +
            ' * (c) 2015 SplitmediaLabs, inc.\n' +
            ' ****************************/\n' + updatedContents;
        } else {
          var jsonObj = JSON.parse(file.contents);

          jsonObj.version = bumpVersion(
            jsonObj.version,
            type,
            argv.down ? 'dec' : 'inc'
          );

          version = jsonObj.version;

          updatedContents = JSON.stringify(jsonObj, null, 2);
        }

        file.contents = new Buffer(updatedContents);
        return file;
      }))
      .pipe(gulp.dest('.'));
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
            '/bower_components' : 'bower_components'
        }
      }
    });
  });

  gulp.task('docs', ['docs/assets', 'docs/app', 'docs/dgeni']);

  gulp.task('default', ['browserify']);
}());
