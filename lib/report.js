/*jslint node: true, vars: true, unparam: true */

"use strict";

var gutil = require("gulp-util");
var through = require("through2");
var xtend = require("xtend");

var defaultReporter = require("./defaultReporter");
var pluginName = require("./pluginName");

// Create a transform stream that expects Vinyl file objects as input, runs
// the specified reporter on file objects that contain jslint/jshint error
// information and pushes the (unchanged) file objects to output.
module.exports = function simpleReport(options) {
    var reporter = ((options && options.reporter) || defaultReporter);
    if (typeof reporter !== "function") {
        var err = new gutil.PluginError(pluginName, "Invalid reporter");
        err.code = "ENOTSUPPORTED";
        throw err;
    }

    var failed = false;
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

    if (options.emitErrorAtEnd) {
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
