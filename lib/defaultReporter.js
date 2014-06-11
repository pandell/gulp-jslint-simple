/*jslint node: true, vars: true, unparam: true */

"use strict";

var path = require("path");

var chalk = require("chalk");
var gutil = require("gulp-util");

// Default error reporter. Produces error output recognized by many editors:
// "filename(row,column): error description"
module.exports = function simpleDefaultReporter(results, data, options) {
    if (!results || !results.length) { return; }

    var i, l, result, msg;
    for (i = 0, l = results.length; i < l; i += 1) {
        result = results[i];
        if (result.error) {
            msg = chalk.red(result.file + "(" + result.error.line + "," + result.error.character + "): ");
            msg += chalk.bold.red(result.error.reason);
            if (options.verbose) {
                msg += chalk.red(" [" + result.error.code + "]");
            }
            gutil.log(msg);
        }
    }

    gutil.log();
    gutil.log(chalk.bold.red(l) + chalk.red(" problem" + (l === 1 ? "" : "s") + " in ") + chalk.white(path.basename(results[0].file)));
    gutil.log();
};
