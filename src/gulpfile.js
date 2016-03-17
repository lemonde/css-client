require('shelljs/global');

var gulp                = require('gulp');
var concat              = require('gulp-concat');
var notify              = require('gulp-notify');
var sass                = require('gulp-sass');
var minifyCss           = require('gulp-minify-css');
var rename              = require('gulp-rename');
var autoprefixer        = require('gulp-autoprefixer');
var uglifycss           = require('gulp-uglifycss');
var preprocess          = require('gulp-preprocess');
var runSequence         = require('run-sequence');
var imagemin            = require('gulp-imagemin');
var changed             = require('gulp-changed');
var gcmq                = require('gulp-group-css-media-queries');
var connect             = require('gulp-connect');
var open                = require("gulp-open");
var clean               = require('gulp-clean');
var minifyHTML          = require("gulp-minify-html");
var filter              = require('gulp-filter');
var tag_version         = require('gulp-tag-version');
var exec                = require('gulp-exec');
var Q                   = require('q');
var sourcemaps          = require('gulp-sourcemaps');



///////////////////////////////////////////////////////
// PATHS
///////////////////////////////////////////////////////

// à modifier => vers repertoire vendor arvato
var localPathToSource = '/Users/user/htdocs-2/lemonde/mia-customisations/';
var localPathToTarget = '/Users/user/htdocs-2/lemonde/arvato/vendor/mia/customisations/';

var rsync_source_path = [
    '../app/design/frontend/glm/default/**/*',
    '../skin/frontend/glm/default/**/*',
    '../src/**/*',
    '!../src/node_modules/**/*'
];

// sync all folder
gulp.task('sync', function(done) {
    return gulp.src(rsync_source_path)
        .pipe(gulp.dest(function(file) {
            var dest = file.base.replace( localPathToSource, localPathToTarget);
            return dest;
        }))
});



// à modifier => vers repertoire vendor arvato

//var rsyncALL_source_path = ['../**/*'];
// sync all folder
gulp.task('sync:all', function(done) {
    return gulp.src('/Users/user/htdocs-2/lemonde/mia-customisations/**/*')
        .pipe(gulp.dest(function(file) {
            var dest = file.base.replace( localPathToSource, localPathToTarget);
            return dest;
        }))
});

var src_base_url = './';
var dest_base_url = './../skin/frontend/glm/default';

// the source paths
var source_paths = {
  scripts:      src_base_url + '/myjs/**/*',
  styles:       src_base_url + '/scss/**/*',
  scss:         src_base_url + '/scss/app.scss',
  css:          src_base_url + '/externalCSS/**/*.css',
  fonts:        src_base_url + '/fonts/**/*',
  images:       src_base_url + '/imgs/**/*.*',
  index_page:   src_base_url + '/*.html',
};



// the destination paths
var dest_paths = {
  css:          dest_base_url + '/css/',
  scripts:      dest_base_url + '/myjs/',
  fonts:        dest_base_url + '/fonts/',
  images:       dest_base_url + '/imgs/',
  root:         dest_base_url,
};


gulp.task('default', function(){
    runSequence(
        'compile',
        'watch'
    );
});

///////////////////////////////////////////////////////
// COMPILATION TASKS
///////////////////////////////////////////////////////

function onError(err) {
  console.log(err);
  notify("error: "+ err);
  this.emit('end');
}


gulp.task('compile-styl', function() {
  return gulp.src(source_paths.scss)
  	.pipe(sourcemaps.init().on('error', onError))
    .pipe(changed(dest_paths.css).on('error', onError))
    .pipe(sass().on('error', onError))
    .pipe(gulp.dest(dest_paths.css))
    .pipe(autoprefixer({browsers: ['> 1%','last 2 versions','ie > 8'],cascade:false}).on('error', onError))
    .pipe(minifyCss({keepSpecialComments: 0}).on('error', onError))
    .pipe(gcmq().on('error', onError))
    .pipe(uglifycss().on('error', onError))
    .pipe(rename({ extname: '.min.css' }).on('error', onError))
    .pipe(sourcemaps.write('./map').on('error', onError))
    .pipe(gulp.dest(dest_paths.css).on('error', onError))
    .pipe(notify("style compiled/minifyed/auoprefixed : <%= file.relative %>!"))
    .pipe(connect.reload().on('error', onError));
});

gulp.task('compile-css', function() {
  return gulp.src(source_paths.css)
    .pipe(sourcemaps.init().on('error', onError))
    .pipe(changed(dest_paths.css).on('error', onError))
    .pipe(gulp.dest(dest_paths.css).on('error', onError))
    .pipe(autoprefixer().on('error', onError))
    .pipe(minifyCss({keepSpecialComments: 0}).on('error', onError))
    .pipe(gcmq().on('error', onError))
    .pipe(uglifycss().on('error', onError))
    .pipe(rename({ extname: '.min.css' }).on('error', onError))
    .pipe(sourcemaps.write('/maps').on('error', onError))
    .pipe(gulp.dest(dest_paths.css).on('error', onError))
    .pipe(notify("css compiled/minifyed/auoprefixed : <%= file.relative %>!"))
    .pipe(connect.reload().on('error', onError));
});

gulp.task('compile-scripts', function() {
  return gulp.src(source_paths.scripts)
    .pipe(sourcemaps.init().on('error', onError))
    .pipe(changed(dest_paths.scripts).on('error', onError))
    .pipe(preprocess().on('error', onError))
    .pipe(rename({ extname: '.min.js' }).on('error', onError))
    .pipe(gulp.dest(dest_paths.scripts))
    .pipe(sourcemaps.write('./maps'))
    .pipe(notify("scrips compiled/minifyed/auoprefixed : <%= file.relative %>!"))
    .pipe(connect.reload());
});

gulp.task('compile-fonts', function() {
    gulp.src(source_paths.fonts)
    .pipe(gulp.dest(dest_paths.fonts))
});

gulp.task('compile-index', function() {
  return gulp.src(source_paths.index_page)
    .pipe(minifyHTML({empty:true, cdata:true, conditionals:true}).on('error', onError))
    .pipe(gulp.dest(dest_paths.root))
    .pipe(connect.reload());
});

gulp.task('compile-images', function() {
  return gulp.src(source_paths.images)
    .pipe(changed(dest_paths.images).on('error', onError))
    .pipe(imagemin({svgoPlugins: [
            { removeViewBox: false },
            { removeEmptyAttrs: true },
            { removeDoctype: true },
            { convertStyleToAttrs: true}
        ]
    }))
    .pipe(gulp.dest(dest_paths.images))
    .pipe(connect.reload());
});

gulp.task('compile-all', ['compile-scripts',
                          'compile-styl',
                          'compile-index',
                          'compile-images',
                          'compile-fonts',
                          ]);

// compile everything after cleaning the build
gulp.task('compile', ['build-clean'], function(){
  var deferred = Q.defer();

  runSequence('compile-all', function(){
    deferred.resolve();
  });

  return deferred.promise;
});

///////////////////////////////////////////////////////
// CLEAN TASKS
///////////////////////////////////////////////////////


gulp.task('clean-styles', function() {
  return gulp.src(dest_paths.css, {read: false})
         .pipe(clean({force: true}).on('error', onError));
});

gulp.task('clean-images', function() {
  return gulp.src(dest_paths.images, {read: false})
       .pipe(clean({force: true}).on('error', onError));
});

gulp.task('clean-scripts', function() {
  return gulp.src(dest_paths.scripts, {read: false});
     //.pipe(clean({force: true}).on('error', onError));
});

gulp.task('clean-index', function() {
  return gulp.src(dest_paths.index_page, {read: false})
       .pipe(clean({force: true}).on('error', onError));
});

gulp.task('clean-fonts', function() {
  return gulp.src(dest_paths.fonts, {read: false})
       .pipe(clean({force: true}).on('error', onError));
});

gulp.task('build-clean', ['clean-scripts',
                          'clean-styles',
                          'clean-images',
                          'clean-fonts',
                         ]);

///////////////////////////////////////////////////////
// WATCH TASKS
///////////////////////////////////////////////////////

gulp.task('watch-styl', function(){
  return gulp.watch(source_paths.styles, ['compile-styl']);
});

gulp.task('watch-css', function(){
  return gulp.watch(source_paths.css, ['compile-css']);
});

gulp.task('watch-scripts', function(){
  return gulp.watch(source_paths.scripts, ['compile-scripts']);
});

gulp.task('watch-index_page', function(){
  return gulp.watch(source_paths.index_page, ['compile-index']);
});

gulp.task('watch-images', function(){
  return gulp.watch(source_paths.images, ['compile-images']);
});

gulp.task('watch-sync', function(){
    return gulp.watch(rsync_source_path, function(obj){
        if( obj.type === 'changed') {
            gulp.src(obj.path)
            .pipe(gulp.dest(function(obj) {
                var dest = obj.base.replace( localPathToSource, localPathToTarget);
                //console.log(dest);
                return dest;
            }))
            .pipe(notify("file sync with folder : <%= file.relative %>"));
        }
    })
});


gulp.task('watch', function() {
  runSequence([ 'watch-styl',
                'watch-css',
                'watch-scripts',
                'watch-index_page',
                'watch-images',
                'watch-sync'
              ]);
});
