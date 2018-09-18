//========= VARIABLES ==========//
const gulp         = require('gulp'),
    browserSync  = require('browser-sync').create(),
    sass         = require('gulp-sass');

//========= PATHS ==========//
const src = [],
    temp = [],
    dist = [];

/*
BUIDL SRC FILES
*/
//=========  STYLES VENDORS DEPENDENCIES  ==========//
// Move CSS files to src/styles/vendors
//Compile NORMALIZE.CSS to src/styes/vendors
gulp.task('styles-normalize', () => {
	return gulp.src('node_modules/normalize.css/normalize.css')
		.pipe(gulp.dest('src/styles/vendors'));
});

//Compile BOOTSTRAP sass to src/styes/vendors
gulp.task('styles-bootstrap', () => {
        return gulp.src('node_modules/bootstrap/scss/bootstrap.scss')
                .pipe(sass())
                .pipe(gulp.dest('src/styles/vendors'));
});

// Move FONT AWESOME css to src/styes/vendors
gulp.task('styles-fa', () => {
        return gulp.src('node_modules/font-awesome/css/font-awesome.min.css')
            .pipe(gulp.dest('src/styles/vendors'));
});

//=========  FONTS DEPENDENCIES  ==========//
// Move FONTS folder to src/fonts
gulp.task('fonts-fa', () => {
        return gulp.src('node_modules/font-awesome/fonts/*')
            .pipe(gulp.dest('src/fonts'));
});

//=========  SCRIPTS VENDORS DEPENDENCIES  ==========//
// Move JS files to src/scripts/vendors
gulp.task('scripts-bootstrap-jquery-popper', () => {
    return gulp.src([
            'node_modules/bootstrap/dist/js/bootstrap.min.js',
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/popper.js/dist/umd/popper.min.js'
    ])
    .pipe(gulp.dest('src/scripts/vendors'));
});

// BUILD SRC FILES
gulp.task('build-src-files', ['styles-normalize', 'styles-bootstrap', 'styles-fa', 'fonts-fa', 'scripts-bootstrap-jquery-popper']);

// RUN NEW PROJECT
gulp.task('default', ['build-src-files']);