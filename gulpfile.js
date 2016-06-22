var gulp = require('gulp')
var gutil = require('gulp-util')

var postcss = require('gulp-postcss')
var postcssImport = require('postcss-import')
var autoprefixer = require('autoprefixer')
var simpleVars = require('postcss-simple-vars')
var mixins = require('postcss-mixins')
var cssnano = require('cssnano')
var reporter = require('postcss-reporter')
var stylelint = require('stylelint')
var stylelintConfig = require('./stylelintConfig.js')
var colorFunction = require('postcss-color-function')
var nested = require('postcss-nested')
var sourcemaps = require('gulp-sourcemaps')

// Lint styles w/ Stylelint
gulp.task('lint-styles', function () {
  return gulp.src('src/**/*.css')
    .pipe(postcss([
      stylelint(stylelintConfig),
      reporter({
        clearMessages: true
      })
    ]))
})

// Create the styles
gulp.task('styles', ['lint-styles'], function () {
  var processors = [
    postcssImport({
      glob: true
    }),
    mixins,
    simpleVars,
    colorFunction(),
    nested,
    autoprefixer({
      browsers: ['last 2 version', 'safari 5', 'opera 12.1', 'ios 6', 'android 4']
    }),
    cssnano
  ]

  return gulp.src('src/styles.css')
    // start Sourcemaps
    .pipe(sourcemaps.init())
    // We always want PostCSS to run
    .pipe(postcss(processors).on('error', gutil.log))
    // Write a source map into the CSS at this point
    .pipe(sourcemaps.write())
    // Set the destination for the CSS file
    .pipe(gulp.dest('./build'))
})
