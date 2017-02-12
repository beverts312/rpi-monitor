'use strict';

var gulp = require('gulp');
var header = require('gulp-header');
var gulpConfig = require('./../gulp-config');

gulp.task('add-shebangs', function (){
    return gulp.src(gulpConfig.executable)
        .pipe(header('#!/usr/bin/env node\n'))
        .pipe(gulp.dest(gulpConfig.root));
});