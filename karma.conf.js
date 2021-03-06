// Karma configuration
// Generated on Mon Jul 20 2015 17:59:21 GMT+0800 (China Standard Time)

module.exports = function(config) {
  var configuration = {

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'test/unit/external.js',
      'test/unit/environment.js',
      'test/unit/mixin.js',
      'test/unit/specs/matchers.js',
      'dist/xjs.js',
      'test/unit/specs/*.js',
      'test/unit/specs/items/*.js',
      'test/unit/specs/source/*.js',
      'test/unit/specs/system/*.js',
      'test/unit/specs/utils/*.js',
      'test/unit/specs/window/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['html'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Firefox'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // declare custom launcher for Travis integration
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      },
      Firefox_travis_ci: {
        base: 'Firefox',
        flags: ['--no-sandbox']
      }
    },
  };

  if (process.env.TRAVIS) {
    configuration.browsers = ['Firefox_travis_ci'];
  }

  config.set(configuration);
};
