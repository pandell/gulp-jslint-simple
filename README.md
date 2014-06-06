# [gulp](http://gulpjs.com/)-[jslint](http://www.jslint.com/)-simple

> Run JSLint analysis

How is this package different from other JSLint runners?

- No dependencies, contains a copy of the latest [JSLINT implementation](https://github.com/douglascrockford/JSLint/blob/master/jslint.js) by [Douglas Crockford](http://www.crockford.com/)
- Compatible with [JSHint reporters](https://www.npmjs.org/search?q=jshint%20reporter)


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
        .pipe(jslint.run())
        .pipe(jslint.report());
});
```


## API

Assuming:

```js
var jslint = require('gulp-jslint-simple');
```

### `jslint.run([options])`

Creates a transform stream that expects Vinyl File objects in buffer mode (stream and null-contents modes are not supported) as input. The stream passes each incoming file object to the output unchanged. Each incoming object will be analyzed using latest JSLint. If analysis fails, a property `jslint` will be added to the object. A property `jshint` pointining to `jslint` will also be added for compatiblity with JSHint reporters.

#### `options`

_Type_: Object  
_Default_: no options

Options to pass through to `JSLINT` function. Allows overriding default JSLint flags on a project level (flags can then be overridden again at a file level using `/*jslint*/` comments).

#### `options.includeData`

_Type_: Boolean  
_Default_: false

If true, `jslint` property is added even when analysis succeeds. Additionally, `jslint.data` property is populated with `JSLINT.data()` object that contains analysis details.


### `jslint.report([options])`

TO DO

### `jslint.report.defaultReporter(results, data, options)`

TO DO


## Contributing

1. Clone git repository

2. `npm install` (will install dev dependencies needed by the next step)

3. `npm start` (will start a file system watcher that will re-lint JavaScript and JSON files + re-run all tests when change is detected)

4. Make changes, don't forget to add tests, submit a pull request.


## License

MIT © [Pandell Technology](http://pandell.com/)
