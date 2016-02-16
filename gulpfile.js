var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var uglify = require('gulp-uglifyjs');


var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass','jsplugins', 'jsApp']);

gulp.task('sass', function(done) {
  gulp.src('./scss/beehrm.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass','jsplugins']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

// beeHRM
gulp.task('jsplugins', function(){
    return gulp.src(
      ['www/lib/ngFx/dist/ngFx.min.js',
      'www/lib/ionic-datepicker/dist/ionic-datepicker.bundle.min.js',
      'www/lib/ngCordova/dist/ng-cordova.min.js',
      'www/lib/ngstorage/ngStorage.min.js'])
      .pipe(concat('plugins.min.js'))
      .pipe(gulp.dest('www/lib/beehrm'))
});


gulp.task('jsApp', function() {
  return gulp.src(
      ['www/js/app.js',
        'www/js/services.js',
        'www/js/factory.js',
        'www/js/directive.js',
        'www/js/controllers.js'
      ])
      .pipe(uglify('beehrm.min.js', {
        mangle: true,
        output: {
          beautify: false
        }
      }))
    .pipe(gulp.dest('www/js'))
});

gulp.task('jsAll', function() {
  return gulp.src(
      ['www/lib/ionic/js/ionic.bundle.min.js',
        'www/lib/gsap/src/minified/TweenMax.min.js',
        'www/lib/beehrm/plugins.min.js',
        'www/js/beehrm.min.js'
      ])
    .pipe(concat('beehrm.min.js'))
    .pipe(gulp.dest('www/lib/beehrm'))
});
