/*jslint node: true, vars: true, nomen: true */
/*global describe: true, it: true, beforeEach: true, afterEach: true */

"use strict";

var assert = require("assert");
var path = require("path");

var concat = require("concat-stream");
var gulp = require("gulp");

var jslint = require("../");
var pluginName = require("../lib/pluginName");


describe(pluginName + ".report", function () {

    describe("reporter spec", function () {

        var defaultReporter;

        beforeEach(function () {
            defaultReporter = jslint.report.defaultReporter;
        });

        afterEach(function () {
            jslint.report.defaultReporter = defaultReporter;
        });

        it("rejects invalid values", function () {
            assert.throws(function () {
                jslint.report({ reporter: 1 });
            }, "Invalid reporter");
        });

        it("accepts functions", function (cb) {
            gulp.src(path.resolve(__dirname, "fixtures/bad.js"))
                .pipe(jslint.run())
                .pipe(jslint.report({
                    reporter: function (results) {
                        results.customFn = true;
                    }
                }))
                .pipe(concat(function (files) {
                    assert.strictEqual(1, files.length);
                    assert(files[0].jslint.results.customFn);
                    return cb();
                }));
        });

        it("accepts strings", function (cb) {
            gulp.src(path.resolve(__dirname, "fixtures/bad.js"))
                .pipe(jslint.run())
                .pipe(jslint.report({
                    reporter: "../test/customReporter"
                }))
                .pipe(concat(function (files) {
                    assert.strictEqual(1, files.length);
                    assert(files[0].jslint.results.customReporter);
                    return cb();
                }));
        });

        it("uses changed default reporter", function (cb) {
            jslint.report.defaultReporter = function (results) {
                results.changedDefaultReporter = true;
            };

            gulp.src(path.resolve(__dirname, "fixtures/bad.js"))
                .pipe(jslint.run())
                .pipe(jslint.report())
                .pipe(concat(function (files) {
                    assert.strictEqual(1, files.length);
                    assert(files[0].jslint.results.changedDefaultReporter);
                    return cb();
                }));
        });

    });

    describe("\"error\" event", function () {

        function reportWith(reportOptions, cb) {
            var log = [];
            reportOptions.reporter = function (results) {
                log.push(results);
            };

            gulp.src(path.resolve(__dirname, "fixtures/bad*"))
                .pipe(jslint.run())
                .pipe(jslint.report(reportOptions))
                .on("error", function () {
                    log.push("error");
                })
                .on("finish", function () {
                    log.push("finish");
                    return cb(log);
                });
        }

        it("does not fire without flags", function (cb) {
            reportWith({}, function (log) {
                assert.strictEqual(4, log.length);
                assert(Array.isArray(log[0]));
                assert(Array.isArray(log[1]));
                assert(Array.isArray(log[2]));
                assert.strictEqual("finish", log[3]);
                return cb();
            });
        });

        it("fires immediately with \"emitError\"", function (cb) {
            reportWith({ emitError: true }, function (log) {
                assert.strictEqual(3, log.length);
                assert(Array.isArray(log[0]));
                assert.strictEqual("error", log[1]);
                assert.strictEqual("finish", log[2]);
                return cb();
            });
        });

        it("fires after all files have been processed with \"emitErrorAtEnd\"", function (cb) {
            reportWith({ emitErrorAtEnd: true }, function (log) {
                assert.strictEqual(5, log.length);
                assert(Array.isArray(log[0]));
                assert(Array.isArray(log[1]));
                assert(Array.isArray(log[2]));
                assert.strictEqual("error", log[3]);
                assert.strictEqual("finish", log[4]);
                return cb();
            });
        });

        it("\"emitError\" takes precedence over \"emitErrorAtEnd\"", function (cb) {
            reportWith({ emitError: true, emitErrorAtEnd: true }, function (log) {
                assert.strictEqual(3, log.length);
                assert(Array.isArray(log[0]));
                assert.strictEqual("error", log[1]);
                assert.strictEqual("finish", log[2]);
                return cb();
            });
        });

    });

});
