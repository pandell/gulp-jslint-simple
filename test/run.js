/*jslint node: true, vars: true, nomen: true */
/*global describe: true, it: true */

"use strict";

var assert = require("assert");
var path = require("path");

var concat = require("concat-stream");
var gulp = require("gulp");

var jslint = require("../");
var pluginName = require("../lib/pluginName");


describe(pluginName + ".run", function () {

    it("passes valid files", function (cb) {
        function assertFile(file) {
            assert(!file.jslint);
            assert(!file.jshint);
        }

        gulp.src(path.resolve(__dirname, "fixtures/good*"))
            .pipe(jslint.run())
            .pipe(concat(function (files) {
                assert.strictEqual(3, files.length);
                assertFile(files[0]);
                assertFile(files[1]);
                assertFile(files[2]);
                cb();
            }));
    });

    it("fails valid files", function (cb) {
        function assertFile(file) {
            assert(file.jslint);
            assert.strictEqual(file.jslint, file.jshint);
            assert(!file.jslint.success);
            assert(file.jslint.results);
            assert.strictEqual(1, file.jslint.results.length);
            assert(file.jslint.results[0].error);
            assert.strictEqual("E_used_before_a", file.jslint.results[0].error.code);
            assert.strictEqual(3, file.jslint.results[0].error.line);
            assert.strictEqual(1, file.jslint.results[0].error.character);
        }

        gulp.src(path.resolve(__dirname, "fixtures/bad*"))
            .pipe(jslint.run())
            .pipe(concat(function (files) {
                assert.strictEqual(3, files.length);
                assertFile(files[0]);
                assertFile(files[1]);
                assertFile(files[2]);
                cb();
            }));
    });

});
