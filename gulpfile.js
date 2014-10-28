var gulp          = require('gulp');
var minifycss     = require('gulp-minify-css');
var stylus        = require('gulp-stylus');
var autoprefixer  = require('gulp-autoprefixer');
var notify        = require('gulp-notify');
var livereload    = require('gulp-livereload');
var coffee        = require('gulp-coffee');
var changed       = require('gulp-changed');
var jade          = require('gulp-jade');
var watch         = require('gulp-jade');
var watch         = require('gulp-jade');
var coffeelint    = require('gulp-coffeelint');
var plumber       = require('gulp-plumber');
var karma         = require('gulp-karma');
var wait          = require('gulp-wait');
var browserify    = require('gulp-browserify');
var rename        = require('gulp-rename');
var gutil         = require('gulp-util');
var uglify        = require('gulp-uglify');
var concat        = require('gulp-concat');
var rjs           = require('gulp-requirejs');
var opt           = require('amd-optimize');
var minifyHTML    = require('gulp-minify-html');

var devFolder   = '';
var distFolder  = '';
var jadeDelay = 1000;

var testFiles = [
      'spec/**/*.js'
    ];
var examplesFolder = 'page-examples/case-studies.jade';
var paths = {
  src: {
    js:       devFolder + 'js/**/*.coffee',
    css:      devFolder + 'css/**/*.styl',
    kit:      devFolder + 'css/kit.jade',
    frontKit: devFolder + 'css/front-page-kit.jade',
    frontPage:devFolder + 'css/front-page.jade',
    index:    devFolder + 'index.jade',
    partials: devFolder + 'css/partials/**/*.jade',
    templates:devFolder + 'templates/**/*.jade',
    tests:    distFolder + 'spec/**/*.coffee'
  },
  dist:{
    js:       distFolder + 'js/',
    tests:    distFolder + 'spec/',
    css:      distFolder + 'css/',
    kit:      distFolder + 'css/',
    index:    distFolder
  }
}

gulp.task('js', function(){
  return rjs({
      baseUrl: 'js/',
      name:     'app',
      out:     'app.dist.js',
      paths: {
        jquery:       'vendor/jquery',
        backbone:     'vendor/backbone',
        velocity:     'vendor/jquery.velocity',
        underscore:   'vendor/underscore',
        charites:     'vendor/charites',
        helpers:      'h',
        notifier:     'collection-views/noties-cv',
        'top1k':      'dev-data/top1k',
        'md5':        'vendor/md5',
        'backbone.stickit': 'vendor/backbone.stickit',
        'backbone.computedfields': 'vendor/backbone.computedfields',
        'async':      'vendor/requirejs-async',
        'iscroll':    'vendor/iscroll',
        'scrollorama':'vendor/jquery.superscrollorama',
        'tw':         'vendor/tweenmax.min'
      },
      shim:{
        scrollorama: {
          deps:   ['jquery']
        },
        velocity: {
          deps:   ['jquery']
        }
      }
    })
    .pipe(uglify())
    .pipe(gulp.dest('js/'))
});

gulp.task('html', function(){
  var opts = {comments:true,spare:true};

  gulp.src('index.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest(''))
});



gulp.task('build', ['js']);

gulp.task('stylus', function(){
  return gulp.src(devFolder + 'css/main.styl')
          .pipe(stylus())
          .pipe(autoprefixer('last 4 version'))
          .pipe(minifycss({noAdvanced:true}))
          .pipe(gulp.dest(paths.dist.css))
          .pipe(livereload())
});


gulp.task('coffee', function(e){
  return gulp.src(paths.src.js)
          .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
          .pipe(changed(paths.dist.js, { extension: '.js'} ))
          .pipe(coffeelint())
          .pipe(coffeelint.reporter())
          .pipe(coffeelint.reporter('fail'))
          .pipe(coffee({bare: true}))
          .pipe(gulp.dest(paths.dist.js))
          .pipe(livereload())
});

gulp.task('coffee:tests', function(e){
  return gulp.src(paths.src.tests)
          .pipe(plumber())
          .pipe(changed(paths.src.tests))
          .pipe(coffeelint())
          .pipe(coffeelint.reporter())
          .pipe(coffee())
          .pipe(gulp.dest(paths.dist.tests))
          .pipe(livereload())
});

gulp.task('kit:jade', function(e){
  return gulp.src(paths.src.kit)
          .pipe(jade({pretty:true}))
          .pipe(gulp.dest(paths.dist.kit))
          .pipe(livereload())
});

gulp.task('front-page-kit:jade', function(e){
  return gulp.src(paths.src.frontKit)
          .pipe(jade({pretty:true}))
          .pipe(gulp.dest(paths.dist.kit))
          .pipe(livereload())
});

gulp.task('front-page:jade', function(e){
  return gulp.src(paths.src.frontPage)
          .pipe(jade({pretty:true}))
          .pipe(gulp.dest(paths.dist.kit))
          .pipe(livereload())
});


gulp.task('examples:jade', function(e){
  return gulp.src(examplesFolder)
          .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
          .pipe(jade({pretty:true}))
          .pipe(gulp.dest('page-examples/'))
          // .pipe(wait(jadeDelay))
          .pipe(livereload())
});

gulp.task('index:jade', function(e){
  return gulp.src(paths.src.index)
          .pipe(jade({pretty:true}))
          .pipe(gulp.dest(paths.dist.index))
          // .pipe(wait(jadeDelay))
          .pipe(livereload())
});

gulp.task('default', function(){
  var server = livereload();

  gulp.watch(paths.src.css, function(e){
    gulp.run('stylus');
    // server.changed(e.path)
    // console.log(e.path);
  });

  gulp.watch(paths.src.js, function(e){
    gulp.run('coffee');
  });

  gulp.watch(paths.src.kit, function(e){
    gulp.run('kit:jade');
  });

  gulp.watch(paths.src.frontKit, function(e){
    gulp.run('front-page-kit:jade');
  });

  gulp.watch(paths.src.frontPage, function(e){
    gulp.run('front-page:jade');
  });

  gulp.watch(examplesFolder, function(e){
    gulp.run('examples:jade');
  });

  gulp.watch(paths.src.index, function(e){
    gulp.run('index:jade');
  });

  gulp.watch(paths.src.partials, function(e){
    gulp.run('kit:jade');
    gulp.run('index:jade');
  });

  gulp.watch(paths.src.templates, function(e){
    gulp.run('index:jade');
  });


});











