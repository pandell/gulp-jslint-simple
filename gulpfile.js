/*jslint node: true, vars: true */

"use strict";

var gulp = require("gulp");
var mocha = require("gulp-mocha");
var monitorCtrlC = require("monitorctrlc");
var taskFromStreams = require("gulp-taskfromstreams");

var jslint = require("./");

var rootFiles = "*.js*";
var libFiles = "lib/*.js";
var testFiles = "test/*.js";

gulp.task("lint", taskFromStreams(function () {
    return [
        gulp.src([rootFiles, libFiles, testFiles]),
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
    gulp.watch([rootFiles, libFiles, testFiles], ["test"]);
    gulp.start("test");
});
