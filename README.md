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

TO DO

### `jslint.report([options])`

TO DO

### `jslint.report.defaultReporter(results, data, options)`

TO DO


## Contributing

1. Clone git repository

2. `npm install`

3. `npm start`

4. Make changes, don't forget to add tests, submit a pull request.


## License

MIT © [Pandell Technology](http://pandell.com/)
