/*
* gulpfile.js
*	Task Automation to make frontend easier
*	Author: Rasmus Damberg - http://d82.dk
*	===========================================================================
*/

// declarations, dependencies
// ----------------------------------------------------------------------------

var gulp = require('gulp'),
    run = require('gulp-run'),
    runSequence = require('run-sequence'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    cssnano = require('gulp-cssnano'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    browserify = require('browserify'),
    bs = require('browser-sync'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify');


var config = {
    css: {
      src: './dist/source/scss/**/*.scss', //SASS source folder
      dest: './dist/public/css/' // Compiled CSS destination
    },
    js: {
      app: './dist/source/js/app.js', //JS main controller app
      src: './dist/source/js/**/*.js', //JS source folder
      dest: './dist/public/js/' // Compiled JS destination
    },
    pl: {
      dir: './pattern-lab', //pattern-lab dir
      patternsDir: './dist/_patterns' //pattern-lab patterns dir
    }
};

// Gulp tasks
// ----------------------------------------------------------------------------

/**
 * Sets up BrowserSync and watchers.
 */
gulp.task('watch', ['build-css'], function () {
  bs.init({});
  gulp.watch(config.css.src, ['build-css']);
  gulp.watch(config.js.src, ['build-js', 'jshint']);
  gulp.watch(config.pl.patternsDir + '/**/*.twig', ['pl-generate']);
});

/**
 * Compiles Sass files.
 */
gulp.task('build-css', function() {
  return gulp.src(config.css.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(cssnano())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.css.dest))
    .pipe(bs.stream({
      match: '**/*.css'
    }));
});

/**
 * Compiles JS/Browserify
 */
gulp.task('build-js', function () {
  // set up the browserify instance on a task basis
  var devel = browserify({
    entries: config.js.app,
    debug: true
  });

  devel.bundle()
    .pipe(source('app.min.dev.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .on('error', gutil.log)
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.js.dest))
    .pipe(bs.stream({

    }));

  var prod = browserify({
    entries: config.js.app,
    debug: false
  });

  prod.bundle()
    .pipe(source('app.min.js'))
    .pipe(buffer())
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(gulp.dest(config.js.dest));

});

/**
 * Generates Pattern Lab front-end.
 */
gulp.task('pl-generate', function () {
  run('php ' + config.pl.dir + '/core/console --generate').exec();
});

/**
 * Calls BrowserSync reload.
 */
gulp.task('bs-reload', function () {
  bs.reload();
});

/**
 * Configure the jshint task
 */
gulp.task('jshint', function() {
  return gulp.src(config.js.src)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// configure which files to watch and what tasks to use on file changes
gulp.task('default', ['watch', 'build-css', 'build-js', 'jshint'], function() {

});
