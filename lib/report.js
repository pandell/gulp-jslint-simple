/*jslint node: true, vars: true, unparam: true */

"use strict";

var path = require("path");

var gutil = require("gulp-util");
var through = require("through2");
var xtend = require("xtend");

var defaultReporter = require("./defaultReporter");
var pluginName = require("./pluginName");

// To preserve compatibility with "gulp-jshint", this function
// was inspired by "gulp-jshint/src/reporters.js"
function loadReporter(reporter) {
    if (!reporter) {
        reporter = module.exports.defaultReporter;
        return (typeof reporter === "function" ? reporter : defaultReporter);
    }
    if (typeof reporter === "function") {
        return reporter;
    }
    if (typeof reporter === "object" && typeof reporter.reporter === "function") {
        return reporter.reporter;
    }
    if (typeof reporter === "string") {
        try {
            return loadReporter(require(reporter));
        } catch (ignore) {}

        try {
            return loadReporter(require(path.join("jshint/src/reporters", reporter)));
        } catch (ignore) {}
    }

    var err = new gutil.PluginError(pluginName, "Invalid reporter");
    err.code = "ENOTSUPPORTED";
    throw err;
}

// Create a transform stream that expects Vinyl file objects as input, runs
// the specified reporter on file objects that contain jslint/jshint error
// information and pushes the (unchanged) file objects to output.
module.exports = function simpleReport(options) {
    var failed = false;
    var reporter = loadReporter(options && options.reporter);
    var s = through.obj(function gulpSimpleReporter(file, enc, cb) {
        if (file.jshint && !file.jshint.success && !file.jshint.ignored) {
            var fileOptions = xtend(options, file.jshint.opt);
            reporter(file.jshint.results, file.jshint.data, fileOptions);

            if (options && options.emitError) {
                var fileErr = new gutil.PluginError(pluginName, "Lint failed", {});
                fileErr.code = "ELINT";
                this.emit("error", fileErr);
                this.end();
                return cb();
            }

            failed = true;
        }

        return cb(null, file);
    });

    if (options && options.emitErrorAtEnd) {
        s.on("finish", function () {
            if (failed) {
                var e = new gutil.PluginError(pluginName, "Lint failed", {});
                e.code = "ELINT";
                this.emit("error", e);
            }
        });
    }

    return s;
};

// Also export default reporter
module.exports.defaultReporter = defaultReporter;
