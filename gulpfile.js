/*jslint node: true, vars: true */

"use strict";

var gulp = require("gulp");
var jshint = require("gulp-jshint");
var mocha = require("gulp-mocha");
var monitorCtrlC = require("monitorctrlc");
var taskFromStreams = require("gulp-taskfromstreams");

var jslint = require("./");

var rootFiles = "*.js*";
var libFiles = "lib/*.js";
var libExcludes = "!lib/jslint.js";
var testFiles = "test/*.js";

gulp.task("lint", taskFromStreams(function () {
    return [
        gulp.src([rootFiles, libFiles, libExcludes, testFiles]),
        jshint(),
        jslint.run(),
        jslint.report({ emitErrorAtEnd: true })
    ];
}));

gulp.task("test", ["lint"], taskFromStreams(function () {
    return [
        gulp.src(testFiles),
        mocha({ reporter: "spec" })
    ];
}));

gulp.task("watch", function () {
    monitorCtrlC();
    gulp.watch([rootFiles, libFiles, libExcludes, testFiles], ["test"]);
    gulp.start("test");
});
