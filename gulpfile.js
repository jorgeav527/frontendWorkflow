//========= VARIABLES ==========//
const gulp        = require('gulp'),
    browserSync     = require('browser-sync').create(),
    sass            = require('gulp-sass'),
    sourcemaps      = require('gulp-sourcemaps'),
    concat          = require('gulp-concat'),
    imagemin        = require('gulp-imagemin'),
    htmlmin         = require('gulp-htmlmin'),
    uglyfly         = require('gulp-uglyfly'),
    autoprefixer    = require('gulp-autoprefixer'),
    cleanCss        = require('gulp-clean-css'),
    plumber         = require('gulp-plumber'),
    jshint          = require('gulp-jshint'),
    clean           = require('gulp-clean-fix');


//========= PATHS ==========//
// const paths = {
//     src: 'src',
//     temp: 'temp',
//     dist: 'dist',
// };

/*
BUILD SRC FILES
*/
//=========  STYLES VENDORS DEPENDENCIES  ==========//
// Move CSS files to src/styles/vendors
//Compile NORMALIZE.CSS to src/styes/vendors
gulp.task('styles-src-normalize', () => {
	gulp.src('node_modules/normalize.css/normalize.css')
		.pipe(gulp.dest('src/styles/vendors'));
});

//Compile BOOTSTRAP sass to src/styes/vendors
gulp.task('styles-src-bootstrap', () => {
        gulp.src('node_modules/bootstrap/scss/bootstrap.scss')
            .pipe(sass())
            .pipe(gulp.dest('src/styles/vendors'));
});

// Move FONT AWESOME css to src/styes/vendors
gulp.task('styles-src-fa', () => {
        gulp.src('node_modules/font-awesome/css/font-awesome.min.css')
            .pipe(gulp.dest('src/styles/vendors'));
});

//=========  FONTS DEPENDENCIES  ==========//
// Move FONTS folder to src/fonts
gulp.task('fonts-src-fa', () => {
        gulp.src('node_modules/font-awesome/fonts/*')
            .pipe(gulp.dest('src/fonts'));
});

//=========  SCRIPTS VENDORS DEPENDENCIES  ==========//
// Move JS files to src/scripts/vendors
gulp.task('scripts-src-bootstrap-jquery-popper', () => {
    gulp.src([
        'node_modules/bootstrap/dist/js/bootstrap.min.js',
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/popper.js/dist/umd/popper.min.js'
    ])
    .pipe(gulp.dest('src/scripts/vendors'));
});

// BUILD SRC FILES
gulp.task('build-src-files', 
    [
        'styles-src-normalize', 
        'styles-src-bootstrap', 
        'styles-src-fa', 
        'fonts-src-fa', 
        'scripts-src-bootstrap-jquery-popper'
    ]
);

/*
BUILD TEMP FILES
*/
//=========  HTML TEMP FILES  ==========//
// Copy and concat HTML files to temp
gulp.task('html-temp-file', () => {
    gulp.src('src/html/*.html')
        .pipe(concat('index.html'))
        .pipe(gulp.dest('temp'));
});

//=========  STYLES TEMP FILES  ==========//
// Copy NORMALIZE.CSS files to temp/styles
gulp.task('styles-temp-normalize', () => {
	gulp.src('node_modules/normalize.css/normalize.css')
		.pipe(gulp.dest('temp/styles'));
});

// Compilate BOOTSTRAP.SCSS and FONT-AWESOME.SCSS files to temp/styles
gulp.task('styles-bootstrap-fa-temp-file', () => {
    gulp.src([
        'node_modules/bootstrap/scss/bootstrap.scss', 
        'node_modules/font-awesome/scss/font-awesome.scss'])
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest('./temp/styles'))
});

// Copy maps compilate MAIN.SCSS files to temp/styles
gulp.task('styles-temp-file', () => {
    gulp.src('src/styles/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./temp/styles'))
});

//=========  FONTS TEMP FILES  ==========//
// Move FONTS folder to temp/fonts
gulp.task('fonts-fa-temp-file', () => {
    gulp.src('node_modules/font-awesome/fonts/*')
        .pipe(gulp.dest('temp/fonts'));
});

//=========  SCRIPTS TEMP FILES  ==========//
// Copy BOOTSTRAP.MIN.JS JQUERY.MIN.JS POPPER folder to temp/scritps
gulp.task('scripts-bootstrap-jquery-poppers-temp-file', () => {
    gulp.src([
          'node_modules/bootstrap/dist/js/bootstrap.min.js',
          'node_modules/jquery/dist/jquery.min.js',
          'node_modules/popper.js/dist/umd/popper.min.js'
        ])
        .pipe(gulp.dest('temp/scripts'))
});

// Copy maps concat MAIN.JS folder to temp/scritps
gulp.task('scripts-temp-file', () => {
    gulp.src('src/scripts/*.js')
        .pipe(sourcemaps.init())
        .pipe(jshint())
        .pipe(concat('main.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('temp/scripts'))
});

//=========  IMG TEMP FILES  ==========//
// Copy plumber mini .PNG .JPG .GIF .SVG folder to temp/img
gulp.task('img-temp-file', () => {
    gulp.src('src/img/**/*.+(png|jpg|gif|svg)')
      .pipe(plumber())
      .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.jpegtran({progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
              ]
          })
      ]))
      .pipe(gulp.dest('temp/img'));
});

// BUILD TEMP FILES 
gulp.task('build-temp-files', 
    [
        'html-temp-file',
        'styles-temp-normalize',
        'styles-bootstrap-fa-temp-file',
        'styles-temp-file',
        'fonts-fa-temp-file',
        'scripts-bootstrap-jquery-poppers-temp-file',
        'scripts-temp-file',
        'img-temp-file'
    ]
);

// Set up BrowserSync and run a local server from temp
gulp.task('serve', () => {
    browserSync.init({
        server: "./temp"
    });
});

// WATCH TEMP FILES
gulp.task('watch', () => {
    gulp.watch('src/html/*.html', ['html-temp-file']).on('change', browserSync.reload)
    gulp.watch('src/styles/**/*.scss', ['styles-bootstrap-fa-temp-file', 'styles-temp-file']).on('change', browserSync.reload)
    gulp.watch('src/scripts/*.js', ['scripts-temp-file']).on('change', browserSync.reload)
    gulp.watch('src/img/**/*', ['img-temp-file']).on('change', browserSync.reload)
});

/*
BUILD DIST FILES
*/
//=========  HTML DIST FILES  ==========//
// Copy concat and minify  HTML files to dist
gulp.task('html-dist-file', () => {
    gulp.src('temp/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'));
});

//=========  STYLES DIST FILES  ==========//
// Copy plumber compilate autoprefixer clearCss compilate MAIN.SCSS files to dist/styles
gulp.task('styles-dist-file', () => {
    gulp.src('temp/styles/main.css')
        .pipe(autoprefixer('last 2 versions'))
        .pipe(cleanCss())
        .pipe(gulp.dest('dist/styles'))
});

// Copy cleanCss NORMALIZE.CSS files to dist/styles
gulp.task('styles-dist-normalize', () => {
    gulp.src('temp/styles/normalize.css')
        .pipe(cleanCss())
		.pipe(gulp.dest('dist/styles'));
});

// Copy and cleanCss BOOTSTRAP.SCSS and FONT-AWESOME.SCSS files to dist/styles
gulp.task('styles-bootstrap-fa-dist-file', () => {
    gulp.src([
        'temp/styles/bootstrap.css', 
        'temp/styles/font-awesome.css'])
            .pipe(cleanCss())
            .pipe(gulp.dest('dist/styles'))
});

//=========  FONTS DIST FILES  ==========//
// Move FONTS folder to dist/fonts
gulp.task('fonts-fa-dist-file', () => {
    gulp.src('temp/fonts/*')
        .pipe(gulp.dest('dist/fonts'));
});

//=========  SCRIPTS DIST FILES  ==========//
// Copy uglyfly BOOTSTRAP.MIN.JS JQUERY.MIN.JS POPPER MAIN.JS folder to dist/scritps
gulp.task('scripts-bootstrap-jquery-poppers-dist-file', () => {
    gulp.src([
          'temp/scripts/bootstrap.min.js',
          'temp/scripts/jquery.min.js',
          'temp/scripts/popper.min.js',
          'temp/scripts/main.js'
        ])
        .pipe(uglyfly())
        .pipe(gulp.dest('dist/scripts'))
});

//=========  IMG DSIT FILES  ==========//
// Copy plumber mini .PNG .JPG .GIF .SVG folder to dist/img
gulp.task('img-dist-file', () => {
    gulp.src('temp/img/**/*.+(png|jpg|gif|svg)')
      .pipe(gulp.dest('dist/img'));
});

// BUILD DIST FILES 
gulp.task('build-dist-files', 
    [
        'html-dist-file',
        'styles-dist-file',
        'styles-dist-normalize',
        'styles-bootstrap-fa-dist-file',
        'fonts-fa-dist-file',
        'scripts-bootstrap-jquery-poppers-dist-file',
        'img-dist-file'
    ]
);

// RUN NEW PROJECT
gulp.task('default', 
    [
        'build-src-files',
        'build-temp-files',
        'serve',
        'watch',
        'build-dist-files'
    ]
);

// CLEAN SRC TEMP AND DIST PROJECT 
gulp.task('clean-temp', () => {
    gulp.src('temp/*', {read: false})
        .pipe(clean());
});

gulp.task('clean-dist', () => {
    gulp.src('dist/*', {read: false})
        .pipe(clean());
});

gulp.task('clean', 
    [
        'clean-temp',
        'clean-dist'
    ]
);

