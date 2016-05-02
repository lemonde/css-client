var gulp                = require('gulp');
var notify              = require('gulp-notify');
var sass                = require('gulp-sass');
var rename              = require('gulp-rename');
var autoprefixer        = require('gulp-autoprefixer');
var uglifycss           = require('gulp-clean-css');
var imagemin            = require('gulp-imagemin');
var changed             = require('gulp-changed');
var gcmq                = require('gulp-group-css-media-queries');
var clean               = require('gulp-clean');
var sourcemaps          = require('gulp-sourcemaps');

///////////////////////////////////////////////////////
// PATHS
///////////////////////////////////////////////////////

var srcBaseUrl = __dirname + '/src';
var destBaseUrl = './build-css-customer';

// the source paths
var sourcePaths = {
    styles:       srcBaseUrl + '/scss/**/*',
    scss:         srcBaseUrl + '/scss/app.scss',
    fonts:        srcBaseUrl + '/fonts/**/*',
    images:       srcBaseUrl + '/imgs/**/*.*',
    js:           srcBaseUrl + '/js/**/*.js',
};

// the destination paths
var destPaths = {
    css:          destBaseUrl + '/css/',
    fonts:        destBaseUrl + '/fonts/',
    images:       destBaseUrl + '/imgs/',
    js:           destBaseUrl + '/js/',
    root:         destBaseUrl,
};

module.exports = function(gulp) {
    var runSequence = require('run-sequence').use(gulp);

    ///////////////////////////////////////////////////////
    // COMPILATION TASKS
    ///////////////////////////////////////////////////////

    function onError(err) {
        console.log(err);
        notify("error: "+ err);
        this.emit('end');
    }

    gulp.task('css-client:compile-style', function() {
        return gulp.src(sourcePaths.scss)
        .pipe(sourcemaps.init().on('error', onError))
        .pipe(changed(destPaths.css).on('error', onError))
        .pipe(sass({outputStyle: 'expanded'}).on('error', onError))
        .pipe(gulp.dest(destPaths.css))
        .pipe(notify("style compiled : <%= file.relative %>!"))
        .pipe(autoprefixer({browsers: ['> 1%','last 2 versions','ie > 8'],cascade:false}).on('error', onError))
        .pipe(gcmq().on('error', onError))
        .pipe(uglifycss().on('error', onError))
        .pipe(rename({ extname: '.min.css' }).on('error', onError))
        .pipe(sourcemaps.write('./map').on('error', onError))
        .pipe(gulp.dest(destPaths.css).on('error', onError))
        .pipe(notify("style minifyed and autoprefixed : <%= file.relative %>!"));
    });

    gulp.task('css-client:compile-fonts', function() {
        return gulp.src(sourcePaths.fonts)
        .pipe(gulp.dest(destPaths.fonts))
    });

    gulp.task('css-client:compile-images', function() {
        return gulp.src(sourcePaths.images)
        .pipe(changed(destPaths.images).on('error', onError))
        .pipe(imagemin({svgoPlugins: [
            { removeViewBox: false },
            { removeEmptyAttrs: true },
            { removeDoctype: true },
            { convertStyleToAttrs: true}
        ]}))
        .pipe(gulp.dest(destPaths.images));
    });

    gulp.task('css-client:compile-js', function() {
        return gulp.src(sourcePaths.js)
        .pipe(changed(destPaths.js).on('error', onError))
        .pipe(gulp.dest(destPaths.js));
    });

    gulp.task('css-client:compile-all', [
        'css-client:compile-style',
        'css-client:compile-images',
        'css-client:compile-fonts',
        'css-client:compile-js'
    ]);

    // compile everything after cleaning the build
    gulp.task('css-client:compile', [
        'css-client:build-clean',
        'css-client:compile-all'
    ]);

    ///////////////////////////////////////////////////////
    // CLEAN TASKS
    ///////////////////////////////////////////////////////


    gulp.task('css-client:clean-styles', function() {
        return gulp.src(destPaths.css, {read: false})
        .pipe(clean({force: true}).on('error', onError));
    });

    gulp.task('css-client:clean-images', function() {
        return gulp.src(destPaths.images, {read: false})
        .pipe(clean({force: true}).on('error', onError));
    });

    gulp.task('css-client:clean-fonts', function() {
        return gulp.src(destPaths.fonts, {read: false})
        .pipe(clean({force: true}).on('error', onError));
    });

    gulp.task('css-client:clean-scripts', function() {
        return gulp.src(destPaths.js, {read: false})
        .pipe(clean({force: true}).on('error', onError));
    });

    gulp.task('css-client:build-clean', [
        'css-client:clean-styles',
        'css-client:clean-images',
        'css-client:clean-fonts',
        'css-client:clean-scripts',
    ]);

    ///////////////////////////////////////////////////////
    // WATCH TASKS
    ///////////////////////////////////////////////////////

    gulp.task('css-client:watch-style', function(){
        return gulp.watch(sourcePaths.styles, ['css-client:compile-style']);
    });

    gulp.task('css-client:watch-js', function(){
        return gulp.watch(sourcePaths.js, ['css-client:compile-js']);
    });

    gulp.task('css-client:watch-images', function(){
        return gulp.watch(sourcePaths.images, ['css-client:compile-images']);
    });

    gulp.task('css-client:watch', function() {
        runSequence([
            'css-client:watch-style',
            'css-client:watch-js',
            'css-client:watch-images',
        ]);
    });
};
