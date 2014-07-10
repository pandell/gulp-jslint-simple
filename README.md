# [gulp](http://gulpjs.com/)-[jslint](http://www.jslint.com/)-simple

[![Build status](https://travis-ci.org/pandell/gulp-jslint-simple.svg?branch=master)](https://travis-ci.org/pandell/gulp-jslint-simple) [!["dependencies" status](https://david-dm.org/pandell/gulp-jslint-simple.svg)](https://david-dm.org/pandell/gulp-jslint-simple) [!["devDependencies" status](https://david-dm.org/pandell/gulp-jslint-simple/dev-status.svg)](https://david-dm.org/pandell/gulp-jslint-simple#info=devDependencies)

> Run JSLint analysis

[Git repository](https://github.com/pandell/gulp-jslint-simple)

[Changelog](https://github.com/pandell/gulp-jslint-simple/releases)

How is this package different from other JSLint runners?

- Contains a copy of the latest (2014-07-08) [JSLint](https://github.com/douglascrockford/JSLint/blob/master/jslint.js) by [Douglas Crockford](http://www.crockford.com/)

- Compatible with [JSHint reporters](https://www.npmjs.org/search?q=jshint%20reporter)

- [`jslint.report`](#jslintreportoptions) can emit `error` event:

    - Never (default behaviour)

    - After a file has been analysed and errors were found in it ([`emitError`](#optionsemiterror))

    - After all files have been analysed and errors were found in at least one of them ([`emitErrorAtEnd`](#optionsemiterroratend))


## Install

```sh
$ npm install --save-dev gulp-jslint-simple
```


## Usage

```js
var gulp = require('gulp');
var jslint = require('gulp-jslint-simple');

gulp.task('lint', function () {
    gulp.src('*.js')
        .pipe(jslint.run({
            // project-wide JSLint options
            node: true,
            vars: true
        }))
        .pipe(jslint.report({
            // example of using a JSHint reporter
            reporter: require('jshint-stylish').reporter
        }));
});
```


## API

Assuming:

```js
var jslint = require('gulp-jslint-simple');
```

### `jslint.run([options])`

Creates a transform stream that expects [Vinyl File](https://github.com/wearefractal/vinyl#file) objects in buffer mode (stream and null-contents modes are not supported) as input. The stream passes each incoming file object to the output unchanged. Each incoming object will be analysed using latest JSLint. If analysis fails, a property `jslint` will be added to the object. A property `jshint` pointing to `jslint` will also be added for compatibility with JSHint reporters.

#### options

_Type_: Object  
_Default_: no options

Options to pass through to `JSLINT` function. Allows overriding default JSLint flags on a project level (flags can then be overridden again at a file level using `/*jslint*/` comments).

#### options.includeData

_Type_: Boolean  
_Default_: false

If true, `jslint` property is added even when analysis succeeds. Additionally, `jslint.data` property is populated with `JSLINT.data()` object that contains analysis details.


### `jslint.report([options])`

Creates a transform stream that expects [Vinyl File](https://github.com/wearefractal/vinyl#file) objects as input. The stream passes each incoming file object to the output unchanged. Each incoming object that contains a file that failed JSLint analysis will be reported using `options.reporter`.

#### options

_Type_: Object  
_Default_: no options

Control report behaviour.

#### options.reporter

_Type_: Function  
_Default_: jslint.report.defaultReporter

Reporter to use to report errors for files that failed JSLint analysis.

#### options.emitError

_Type_: Boolean  
_Default_: false

If true, `jslint.report` will emit an `error` event when an incoming file fails JSLint analysis.

#### options.emitErrorAtEnd

_Type_: Boolean  
_Default_: false

If true, `jslint.report` will emit an `error` event after the input stream has ended and at least one file failed analysis.

If neither `options.emitError` nor `options.emitErrorAtEnd` are set to `true`, no `error` event will be emitted. `jslint.report` stream then acts as a simple pass-through transform stream.


### `jslint.report.defaultReporter(results, data, options)`

JSHint-reporter-compatible function that prints formatted message for each specified error result. File, line and row specification is printed in a format that is recognized by many editors and tools (clicking the file specification in such tools will open the specified file for editing at the specified location). Example output:

![Example default reporter output](https://cloud.githubusercontent.com/assets/42297/3203672/8f139672-ed9f-11e3-8863-859715e8bb40.png)


## Contributing

1. Clone git repository

2. `npm install` (will install dev dependencies needed by the next step)

3. `npm start` (will start a file system watcher that will re-lint JavaScript and JSON files + re-run all tests when change is detected)

4. Make changes, don't forget to add tests, submit a pull request.


## License

MIT © [Pandell Technology](http://pandell.com/)
