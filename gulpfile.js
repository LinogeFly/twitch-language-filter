var gulp = require('gulp'),
    concat = require('gulp-concat-util'),
    del = require('del'),
    merge = require('merge-stream'),
    jshint = require('gulp-jshint');

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
    var app = gulp.src(['src/js/app/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('app.js'));

    var manifest = gulp.src(['src/manifest.json']);

    var launcher = gulp.src(['src/js/launcher.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))

    return merge(app, launcher, manifest)
        .pipe(gulp.dest('build'));
});

gulp.task('watch', ['dev'], function () {
    gulp.watch('src/**/*.*', ['dev']);
});

gulp.task('dev', ['js', 'css', 'vendor'], function () {

});

gulp.task('default', ['dev'], function () {

});