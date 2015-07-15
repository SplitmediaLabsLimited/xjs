/* globals require */

(function() {
    'use strict';

    var gulp        = require('gulp'),
        typescript  = require('typescript'),
        ts          = require('gulp-typescript'),
        browserify  = require('browserify'),
        tsify       = require('tsify'),
        source      = require('vinyl-source-stream');

    gulp.task('browserify', function() {
        return browserify('./src/core/index.ts')
            .plugin('tsify')
            .require('./src/core/index.ts', {expose: 'xjs'})
            .bundle()
            .pipe(source('xjs.js'))
            .pipe(gulp.dest('dist'));
    });

    gulp.task('default', ['browserify']);
}());
