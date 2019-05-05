const gulp = require('gulp');
const pug = require('gulp-pug');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const del = require('del');
const gulpWebpack = require('gulp-webpack');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const browserSync = require('browser-sync').create();

const paths = {
    root: './dist',
    styles: { 
        main: './src/index.scss',
        src: './src/**/*.scss',
        dist: './dist/css'
    },
    images: { 
        src: './src/assets/img/**/*.*',
        dist: './dist/img'
    },
    scripts: {
        src: './src/*.js',
        dist: './dist/js/'
    
    },
    pug: {
        src: './src/*.pug',
        dist: './dist/'
    }
}

function watch() {
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.pug.src, pugToHtml);
    gulp.watch(paths.scripts.src, scripts);
}

function server() {
    browserSync.init({
        server: paths.root
    });
    browserSync.watch(paths.root + '/**/*.*', browserSync.reload);
}

function clean() {
    return del(paths.root);
}

function images() {
    return gulp.src(paths.images.src)
	      	.pipe(gulp.dest(paths.images.dist));
}

function pugToHtml() {
		return gulp.src(paths.pug.src)
					.pipe(pug({pretty: true}))
	      	.pipe(gulp.dest(paths.pug.dist));
}

function styles() {
    return gulp.src(paths.styles.main)
        .pipe(sourcemaps.init())
        .pipe(postcss(require("./postcss.config")))
        .pipe(sourcemaps.write())
        .pipe(rename("index.min.css"))
        .pipe(gulp.dest(paths.styles.dist))
}

function scripts() {
    return gulp.src(paths.scripts.src)
        .pipe(gulpWebpack(webpackConfig, webpack))
        .pipe(gulp.dest(paths.scripts.dist));
}

exports.styles = styles;
exports.scripts = scripts;
exports.clean = clean;
exports.images = images;
exports.pugToHtml = pugToHtml;

gulp.task('default', gulp.series(
    clean,
    gulp.parallel(images, styles, pugToHtml, scripts),
    gulp.parallel(watch, server)
));