const gulp = require('gulp');
const golang = require('gulp-golang');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const tailwindcss = require('tailwindcss');
const rollup = require('rollup-stream');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const typescript = require('rollup-plugin-typescript');

function build(cb) {
    golang.build('main.go', './bin/slowgames.exe');
    cb();
}

function spawn(cb) {
    golang.spawn();
    cb();
}

function css() {
    const plugins = [
        autoprefixer(),
        tailwindcss()
    ];

    return gulp.src('./web/css/**/*.css')
        .pipe(postcss(plugins))
        .pipe(gulp.dest('./static/css'))
}

function js() {
    return rollup({
        input: './web/js/index.ts',
        sourcemap: true,
        format: 'umd',
        plugins: [
            typescript()
        ]
    })
        .pipe(source('index.ts', './web/js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(rename('index.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./static/js'))
}

const run = gulp.series(build, css, js, spawn);

function livereloadListen(cb) {
    golang.livereload().listen();
    cb();
}

function livereloadReload(cb) {
    golang.livereload().reload();
    cb();
}

function watchChanges(cb) {
    gulp.watch('**/*.go', gulp.series(run, livereloadReload));
    gulp.watch('**/*.tmpl', livereloadReload);
    gulp.watch('web/**/*', livereloadReload);
    cb();
}

exports.spawn = spawn;
exports.build = build;
exports.css = css;
exports.js = js;
exports.run = run;
exports.default = gulp.series(livereloadListen, run, watchChanges);