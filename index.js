var gulp                = require('gulp');
var notify              = require('gulp-notify');
var sass                = require('gulp-sass');
var minifyCss           = require('gulp-minify-css');
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

var src_base_url = __dirname + '/src';
var dest_base_url = './build-css-customer';

// the source paths
var source_paths = {
    styles:       src_base_url + '/scss/**/*',
    scss:         src_base_url + '/scss/app.scss',
    fonts:        src_base_url + '/fonts/**/*',
    images:       src_base_url + '/imgs/**/*.*',
};

// the destination paths
var dest_paths = {
    css:          dest_base_url + '/css/',
    fonts:        dest_base_url + '/fonts/',
    images:       dest_base_url + '/imgs/',
    root:         dest_base_url,
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
        return gulp.src(source_paths.scss)
        .pipe(sourcemaps.init().on('error', onError))
        .pipe(changed(dest_paths.css).on('error', onError))
        .pipe(sass({outputStyle: 'expanded'}).on('error', onError))
        .pipe(gulp.dest(dest_paths.css))
        .pipe(notify("style compiled : <%= file.relative %>!"))
        .pipe(autoprefixer({browsers: ['> 1%','last 2 versions','ie > 8'],cascade:false}).on('error', onError))
        .pipe(gcmq().on('error', onError))
        .pipe(uglifycss().on('error', onError))
        .pipe(rename({ extname: '.min.css' }).on('error', onError))
        .pipe(sourcemaps.write('./map').on('error', onError))
        .pipe(gulp.dest(dest_paths.css).on('error', onError))
        .pipe(notify("style compiled/minifyed/auoprefixed : <%= file.relative %>!"));
    });

    gulp.task('css-client:compile-fonts', function() {
        gulp.src(source_paths.fonts)
        .pipe(gulp.dest(dest_paths.fonts))
    });

    gulp.task('css-client:compile-images', function() {
        return gulp.src(source_paths.images)
        .pipe(changed(dest_paths.images).on('error', onError))
        .pipe(imagemin({svgoPlugins: [
            { removeViewBox: false },
            { removeEmptyAttrs: true },
            { removeDoctype: true },
            { convertStyleToAttrs: true}
        ]
    }))
    .pipe(gulp.dest(dest_paths.images));
});

gulp.task('css-client:compile-all', [
    'css-client:compile-style',
    'css-client:compile-images',
    'css-client:compile-fonts',
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
    return gulp.src(dest_paths.css, {read: false})
    .pipe(clean({force: true}).on('error', onError));
});

gulp.task('css-client:clean-images', function() {
    return gulp.src(dest_paths.images, {read: false})
    .pipe(clean({force: true}).on('error', onError));
});

gulp.task('css-client:clean-fonts', function() {
    return gulp.src(dest_paths.fonts, {read: false})
    .pipe(clean({force: true}).on('error', onError));
});

gulp.task('css-client:build-clean', [
    'css-client:clean-styles',
    'css-client:clean-images',
    'css-client:clean-fonts',
]);

///////////////////////////////////////////////////////
// WATCH TASKS
///////////////////////////////////////////////////////

gulp.task('css-client:watch-style', function(){
    return gulp.watch(source_paths.styles, ['css-client:compile-style']);
});

gulp.task('css-client:watch-images', function(){
    return gulp.watch(source_paths.images, ['css-client:compile-images']);
});

gulp.task('css-client:watch', function() {
        runSequence([
            'css-client:watch-style',
            'css-client:watch-images',
        ]);
    });
};
