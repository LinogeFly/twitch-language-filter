var gulp = require('gulp'),
    concat = require('gulp-concat-util'),
    header = require('gulp-header'),
    footer = require('gulp-footer'),
    del = require('del'),
    merge = require('merge-stream'),
    jshint = require('gulp-jshint'),
    jasmine = require('gulp-jasmine'),
    source = require('vinyl-source-stream'),
    buffer = require('gulp-buffer'),
    browserify = require('browserify');

function getAppStream() {
    return browserify('src/js/app/main.js')
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer());
}

gulp.task('lint:app', function () {
    return gulp.src(['src/js/app/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('clean', function () {
    return del(['build']);
});

gulp.task('vendor', ['clean'], function () {
    return gulp.src(['vendor/**'])
        .pipe(gulp.dest('build/vendor'));
});

gulp.task('css', ['clean'], function () {
    return gulp.src(['src/css/**/*.css'])
        .pipe(concat('app.css'))
        .pipe(gulp.dest('build'));
});

gulp.task('js', ['clean', 'lint:app'], function () {
    var app = getAppStream()
        .pipe(header('(function(global) {'))
        .pipe(footer('}(window.TwitchLanguageFilter = window.TwitchLanguageFilter || {}));'));

    var manifest = gulp.src(['src/manifest.json']);

    var launcher = gulp.src(['src/js/launcher.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))

    return merge(app, launcher, manifest)
        .pipe(gulp.dest('build'));
});

gulp.task('test', function () {
    return gulp.src(['test/**/*.spec.js'])
        .pipe(jasmine());
});

gulp.task('dev', ['js', 'css', 'vendor'], function () {

});

gulp.task('watch', ['default'], function () {
    gulp.watch(['src/**', 'test/**'], ['default']);
});

gulp.task('default', ['dev', 'test'], function () {

});