/*jslint node: true, vars: true, nomen: true */
/*global describe: true, it: true */

"use strict";

var assert = require("assert");
var path = require("path");

var gulp = require("gulp");

var jslint = require("../");
var pluginName = require("../lib/pluginName");


describe(pluginName + ".report", function () {

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
