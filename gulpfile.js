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
    browserify = require('browserify'),
    runSequence = require('run-sequence'),
    through = require('through2'),
    fs = require('fs');

require('./src/js/core/string-helpers.js');

// Build configuration helpers

var build = 'debug';

function isRelease() {
    return build === 'release';
}

function isDebug() {
    return build === 'debug';
}

function getConfigModuleContent() {
    var filename = '_debug.config.js';
    if (isRelease())
        filename = '_release.config.js';

    return fs.readFileSync('src/js/app/config/' + filename, 'utf8');
}

var configTransform = function (file) {
    return through(function (buff, enc, next) {
        if (file.endsWith('config\\index.js')) {
            this.push(getConfigModuleContent());
        } else {
            this.push(buff);
        }

        next();
    });
};

gulp.task('set-build:release', function () {
    build = 'release';
});

gulp.task('set-build:debug', function () {
    build = 'debug';
});

// Build tasks

function getAppStream() {
    return browserify('src/js/app/main.js')
        .transform(configTransform)
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer());
}

gulp.task('lint:app', function () {
    return gulp.src(['src/js/**/*.js'])
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

gulp.task('build', ['js', 'css', 'vendor'], function () {

});

gulp.task('release', ['set-build:release'], function (callback) {
    runSequence('build', function () {
        callback();
    });
});

gulp.task('debug', ['set-build:debug'], function (callback) {
    runSequence('build', function () {
        callback();
    });
});

gulp.task('watch', ['default'], function () {
    gulp.watch(['src/**', 'test/**'], ['default']);
});

gulp.task('default', ['debug', 'test'], function () {
    
});
