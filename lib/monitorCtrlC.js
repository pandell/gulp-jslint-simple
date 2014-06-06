/*jslint node: true, vars: true */

"use strict";

var gutil = require("gulp/node_modules/gulp-util");
var log = gutil.log;
var colors = gutil.colors;

function defaultCtrlCHandler() {
    log("'" + colors.cyan('^C') + "'" + ', exitting');
    process.exit();
}

module.exports = function monitorCtrlC(cb) {
    var stdin = process.stdin;
    if (stdin && stdin.isTTY) {
        if (typeof cb !== 'function') { cb = defaultCtrlCHandler; }
        stdin.setRawMode(true);
        stdin.on('data', function monitorCtrlCOnData(data) {
            if (data.length === 1 && data[0] === 0x03) {
                cb();
            }
        });
    }
};
