/*jslint node: true, vars: true */

"use strict";

var beepOnError = !!process.env.GULP_BEEPONERROR;

module.exports = function streamsAsTask(streamsProvider) {
    if (typeof streamsProvider !== "function") {
        throw new Error("Streams provider is required");
    }

    return function streamsAsTaskRun(cb) {
        // define error/success handlers
        var failed = false;
        function onError(err) {
            failed = true;
            if (beepOnError && process.stdout && process.stdout.isTTY) {
                process.stdout.write('\x07'); // system beep
            }
            return cb(err);
        }
        function onSuccess() {
            if (!failed) {
                return cb();
            }
        }

        // run provider to get streams
        var s;
        try {
            s = streamsProvider();
        } catch (e) {
            return onError(e);
        }

        // validate streams
        if (!Array.isArray(s) || s.length === 0) {
            return onError(new Error("Streams provider must return a non-empty array"));
        }

        // connect streams
        var lastStream, stream, i, l;
        for (i = 0, l = s.length; i < l; i += 1) {
            stream = s[i];
            if (!stream || !stream.on || !stream.pipe) {
                return onError(new Error("Invalid stream at position " + i));
            }

            stream.on("error", onError);
            if (lastStream) { lastStream.pipe(stream); }
            lastStream = stream;
        }

        // when last stream is done, task succeeded
        if (lastStream) {
            lastStream.on("finish", onSuccess);
        }
    };
};
