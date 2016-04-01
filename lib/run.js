/*jslint node: true, vars: true, nomen: true */

"use strict";

var fs = require("fs");
var vm = require("vm");
var path = require("path");

var gutil = require("gulp-util");
var through = require("through2");

var pluginName = require("./pluginName");


// Convert the specified buffer to a script string
// using the specified encoding, ignoring BOM sequence
// and commenting out UNIX-style shebang line (if present).
function bufferToScript(buffer, enc) {
    if (buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) { // UTF8 BOM sequence, see http://en.wikipedia.org/wiki/Byte_order_mark
        buffer = buffer.slice(3, buffer.length - 3);
    }

    var script = buffer.toString(enc);

    script = script.replace(/^\s*#!/g, "//$&"); // UNIX-style shebang, see http://en.wikipedia.org/wiki/Shebang_(Unix)
    return script;
}


// Return JSLINT loaded from the specified file.
// File name is assumed to be relative to this script's directory.
function requireJslint(jslintFileName) {
    /*jslint stupid: true */// JSLint doesn't like "*Sync" functions, but in this require-like function async would be overkill
    var jslintCode = bufferToScript(
        fs.readFileSync(
            path.join(__dirname, jslintFileName)
        )
    );
    /*jslint stupid: false */

    var sandbox = {};
    vm.runInNewContext(jslintCode, sandbox, jslintFileName);
    return sandbox.JSLINT;
}


var jslint = requireJslint("jslint.js");


// Create a transform stream that expects Vinyl file objects as input, runs
// JSLint analysis on each and pushes the (unchanged) file objects to output
// with extra property containing analysis results.
module.exports = function simpleJslint(options) {
    var includeData = !!(options && options.includeData);
    return through.obj(function gulpSimpleJslint(file, enc, cb) {
        if (file.jshint) { // this file has already been analysed by this plugin or "gulp-jshint"
            if (file.jslint || !file.jshint.success) { // do not re-analyse this file if already analysed by this plugin or if "gulp-jshint" analysis failed
                return cb(null, file);
            }
        }

        if (!file.isBuffer()) {
            var err = new gutil.PluginError(
                pluginName,
                "This plugin requires buffered files (".concat(file.path, ").")
            );
            err.code = "ENOTSUPPORTED";
            this.emit("error", err);
            this.end();
            return cb();
        }

        var fileStr = bufferToScript(file.contents, enc);
        var ok = jslint(fileStr, options);
        if (!ok || includeData) {
            var filePath = (options && options.useRelativePath ? path.relative(file.base, file.path) : file.path);
            file.jslint = file.jshint = {
                opt: options,
                success: ok,
                data: null,
                results: jslint.errors.filter(Boolean).map(function (e) { // filter(Boolean) removes falsy values from errors array
                    e.code = "E_" + e.code; // some reporters look at 1st letter of "code" to determine type of error (E: Error, W: Warning, I: Info)
                    return { file: filePath, error: e };
                })
            };
            if (includeData) {
                file.jslint.data = [jslint.data()];
                file.jslint.data[0].file = filePath;
            }
        }

        return cb(null, file);
    });
};
