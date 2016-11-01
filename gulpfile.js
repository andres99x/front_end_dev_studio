var PRODUCTION = 'production';
var DEVELOPMENT = 'development';

// Run NODE_ENV=production gulp 'task' for production environment
// Run NODE_ENV=development gulp 'task' for development environment
var env = process.env.NODE_ENV || DEVELOPMENT;

// Defining requirements
var gulp          = require('gulp');
var plumber       = require('gulp-plumber');
var sass          = require('gulp-sass');
var watch         = require('gulp-watch');
var gulpif        = require('gulp-if');
var autoprefixer  = require('gulp-autoprefixer');
var imagemin      = require('gulp-imagemin');
var newer         = require('gulp-newer');
var rename        = require('gulp-rename');
var concat        = require('gulp-concat');
var uglify        = require('gulp-uglify');
var merge2        = require('merge2');
var cache         = require('gulp-cache');
var ignore        = require('gulp-ignore');
var rimraf        = require('gulp-rimraf');
var notify        = require('gulp-notify');
var scsslint      = require('gulp-scss-lint');
var jshint        = require('gulp-jshint');
var browserSync   = require('browser-sync').create();
var browserify    = require('browserify');
var source        = require('vinyl-source-stream');

// Defining base pathes
var basePaths = {
  assets: './assets/',
  vendor: './vendor/',
  dist: './dist/'
};

gulp.task('browserify', function () {
  return browserify(basePaths.assets + 'js/main.js')
    .bundle()
    .pipe(source('main.min.js'))
    .pipe(gulp.dest(basePaths.dist + 'js/'));
});

// Run:
// gulp scss
// Compiles SCSS files in CSS
gulp.task('scss', function () {
  var config = {};

  if (env === DEVELOPMENT) {
    config.sourceComments = 'map';
  } else if (env === PRODUCTION) {
    config.outputStyle = 'compressed';
  }

  return gulp.src(basePaths.assets + 'scss/main.scss')
    .pipe(sass(config))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(basePaths.dist + 'css/'))
    .pipe(browserSync.reload({stream: true}));
});

// Run:
// gulp scripts.
// Uglifies and concat all JS files into one
gulp.task('scripts', function() {
  return gulp.src([
    basePaths.assets + 'js/main.js'
  ])
  .pipe(gulpif(env === PRODUCTION, uglify()))
  .pipe(concat('/main.min.js'))
  .pipe(gulp.dest(basePaths.dist + 'js/'));
});

// Run:
// gulp images
gulp.task('images', function() {
// Add the newer pipe to pass through newer images only
  return gulp.src([basePaths.assets + 'img/*.{png,jpg,gif}'])
    .pipe(newer(basePaths.assets + 'img/'))
    .pipe(rimraf({ force: true }))
    .pipe(imagemin({ optimizationLevel: 7, progressive: true, interlaced: true }))
    .pipe(gulp.dest(basePaths.dist + 'img/'))
    .pipe( notify( { message: 'Images task complete', onLast: true } ) );
});

gulp.task('copy-fonts', function() {
  return gulp.src([
    basePaths.assets + 'fonts/*.{eot,svg,ttf,woff,woff2,oft}',
    basePaths.vendor + 'fontawesome/fonts/*.{eot,svg,ttf,woff,woff2,oft}',
  ])
  .pipe(gulp.dest(basePaths.dist + 'fonts/'));
});

// Linters for scss, js, php
gulp.task('scss-lint', function() {
  return gulp.src(basePaths.assets + 'scss/*.scss')
    .pipe(scsslint())
    .pipe(scsslint.failReporter());
});

gulp.task('js-lint', function() {
  return gulp.src(basePaths.assets + 'js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('fail'));
});

gulp.task('cleancss', function() {
  return gulp.src('./dist/css/*.css', { read: false }) // much faster
    .pipe(ignore('./dist/css/'))
    .pipe(rimraf());
});

// Clean gulp cache
gulp.task('clear', function () {
  cache.clearAll();
});

// Run:
// gulp watch
// Starts watcher. Watcher runs gulp sass task on changes
gulp.task('watch', function () {
  gulp.watch(basePaths.assets + 'scss/**/*.scss', ['scss']);
  gulp.watch(basePaths.assets + 'js/**/*.js', ['scripts']);
  gulp.watch(basePaths.assets + 'img/**/*.{png,jpg,gif}', ['images']);
  gulp.watch(basePaths.assets + 'fonts/*.{eot,svg,ttf,woff,woff2,oft}', ['copy-fonts']);
});

// Run:
// gulp browser-sync
// Starts browser-sync task for starting the server.
gulp.task('browser-sync', function() {
  // browser-sync watched files
  // automatically reloads the page when files changed
  var browserSyncWatchFiles = [
    basePaths.dist + 'css/*.min.css',
    basePaths.dist + 'js/*.min.js',
    basePaths.dist + 'fonts/*',
    basePaths.dist + 'img/*',
    './**/*.php',
  ];

  // browser-sync options
  // see: https://www.browsersync.io/docs/options/
  var browserSyncOptions = {
    server: true,
    notify: false,
    open : false
  };

  browserSync.init(browserSyncWatchFiles, browserSyncOptions);
});

// Run:
// gulp watch-bs
// Starts watcher with browser-sync. Browser-sync reloads page automatically on your browser
gulp.task('watch-bs', ['browser-sync', 'watch']);

// Run:
// gulp ci
// Runs all linters (SCSS, JS, PHP)
gulp.task('ci', ['scss-lint', 'js-lint']);

gulp.task('default', ['watch-bs']);
