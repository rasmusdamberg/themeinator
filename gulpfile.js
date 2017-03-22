/*
* gulpfile.js
*	Task Automation to make my life easier.
*	Author: Rasmus Damberg
*	===========================================================================
*/

// declarations, dependencies
// ----------------------------------------------------------------------------

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint');
    sass = require('gulp-sass');
    cssnano = require('gulp-cssnano');
    sourcemaps = require('gulp-sourcemaps');
    autoprefixer = require('gulp-autoprefixer');
    browserify = require('browserify');
    bs = require('browser-sync');
    source = require('vinyl-source-stream');
    buffer = require('vinyl-buffer');
    uglify = require('gulp-uglify');


var config = {
    css: {
      src: 'source/scss/**/*.scss', //SASS source folder
      dest: './public/css/' // Compiled CSS destination
    },
    js: {
      src: './source/js/app.js', //SASS source folder
      dest: './public/js/' // Compiled CSS destination
    }
};

// Gulp tasks
// ----------------------------------------------------------------------------

// define the default task and add the watch task to it
gulp.task('default', ['watch', 'build-css', 'jshint', 'build-js']);

// browser-sync
gulp.task('browser-sync', ['build-css'], function() {
    bs.init();
});

// Compile css
gulp.task('build-css', function() {
  return gulp.src(config.css.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(cssnano())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.css.dest))
    .pipe(bs.reload({stream: true}));
});

// JS / Browserify
gulp.task('build-js', function () {
  // set up the browserify instance on a task basis
  var devel = browserify({
    entries: config.js.src,
    debug: true
  });

  devel.bundle()
    .pipe(source('app.min.dev.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .on('error', gutil.log)
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.js.dest));

  var prod = browserify({
    entries: config.js.src,
    debug: false
  });

  prod.bundle()
    .pipe(source('app.min.js'))
    .pipe(buffer())
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(gulp.dest(config.js.dest));

});

// configure the jshint task
gulp.task('jshint', function() {
  return gulp.src('source/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', ['browser-sync'], function() {
  gulp.watch('source/scss/**/*.scss', ['build-css']);
  gulp.watch('source/js/**/*.js', ['jshint', 'build-js']);
});
