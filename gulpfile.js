"use strict";

const gulp     = require('gulp');
const gulpif   = require('gulp-if');
const distPath = "./dist"

gulp.task('clean', function () {
  const del    = require('del');

  return del([distPath], { force: true });
});

gulp.task('buildScript', function () {
  const babelify   = require('babelify');
  const browserify = require('browserify');
  const depCaseVer = require('dep-case-verify');
  const path       = require('path');
  const size       = require('gulp-size');
  const source     = require('vinyl-source-stream');

  const entryFile = './src/scripts/index.js';

  return browserify(entryFile, options.browserify)
  .plugin(depCaseVer) // we enforce case sensitivity
  .transform(babelify, options.babelify)
  .transform(deSourcemapify, { global: true })
  .bundle()
  .pipe(source(path.basename(entryFile)))
  .pipe(gulp.dest(distPath))
  .pipe(size({ showFiles: true, title: '[Scripts]' }));
});

gulp.task('build', function() {
   return gulp.series('clean', 'buildScript');  
});
