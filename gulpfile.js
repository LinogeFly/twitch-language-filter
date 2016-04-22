var gulp = require('gulp'),
    concat = require('gulp-concat-util'),
    header = require('gulp-header'),
    footer = require('gulp-footer'),
    del = require('del'),
    merge = require('merge-stream'),
    jshint = require('gulp-jshint'),
    jasmine = require('gulp-jasmine');

function getAppStream() {
    return gulp.src(['src/js/app/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('app.js'));
}

gulp.task('clean', function () {
    return del(['build']);
});

gulp.task('vendor', ['clean'], function () {
    return gulp.src(['vendor/**/*.*'])
        .pipe(gulp.dest('build/vendor'));
});

gulp.task('css', ['clean'], function () {
    return gulp.src(['src/css/**/*.css'])
        .pipe(concat('app.css'))
        .pipe(gulp.dest('build'));
});

gulp.task('js', ['clean'], function () {
    var app = getAppStream()
        .pipe(header('(function(global) {'))
        .pipe(footer('main();}(window.TwitchLanguageFilter = window.TwitchLanguageFilter || {}));'));

    var manifest = gulp.src(['src/manifest.json']);

    var launcher = gulp.src(['src/js/launcher.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))

    return merge(app, launcher, manifest)
        .pipe(gulp.dest('build'));
});

gulp.task('js:test', ['clean'], function () {
    return getAppStream()
        .pipe(gulp.dest('build'));
});

gulp.task('watch', ['default'], function () {
    gulp.watch('src/**/*.*', ['default']);
});

gulp.task('dev', ['js', 'css', 'vendor'], function () {

});

gulp.task('test', ['js:test'], function () {
    return gulp.src(['test/**/*.js'])
        .pipe(jasmine());
});

gulp.task('default', ['dev'], function () {

});