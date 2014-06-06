/*jslint node: true, vars: true, nomen: true, unparam: true */

"use strict";

var gutil = require("gulp/node_modules/gulp-util");
var through = require("gulp/node_modules/gulp-util/node_modules/through2");
var defaults = require("gulp/node_modules/gulp-util/node_modules/lodash.template/node_modules/lodash.defaults");

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
        var fileErr; // defaults to undefined
        if (file.jshint && !file.jshint.success && !file.jshint.ignored) {
            var fileOptions = defaults({ }, options, file.jshint.opt);
            reporter(file.jshint.results, file.jshint.data, fileOptions);

            failed = true;
            if (options && options.emitError) {
                fileErr = new gutil.PluginError(pluginName, "Lint failed", {});
                fileErr.code = "ELINT";
            }
        }

        return cb(fileErr, file);
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
