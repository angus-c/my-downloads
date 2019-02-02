Chunk
===
[![NPM version][npm-image]][npm-url] [![Build Status][build-image]][build-url] [![Coverage Status][coverage-image]][coverage-url] [![Dependencies][dependencies-image]][dependencies-url]

> Chunks a string array based on string length.


## Installation

``` bash
$ npm install chunk-string-array
```


## Usage

``` javascript
var chunk = require( 'chunk-string-array' );
```

#### chunk( arr, length[, options ] );

Chunks a string `array` based on `string` length. The `array` elements are split into subarrays according to a `length` parameter, which specifies a combined `length` of all subarray elements.

``` javascript
var out = chunk( ['abc', 'de', 'fg', 'h', 'ijkl' ], 3 );
/*
	[
		['abc'],
		['de'],
		['fg','h'],
		['ijkl']
	]
*/
```

The function accepts the following `options`:
*	__strict__: `boolean` indicating whether the `length` criterion should be strictly enforced; i.e., no combined subarray `length` should exceed the criterion. Such a condition can occur when a single `string` exceeds the `length`. Setting this option to `true` ensures that all `strings` must be less than or equal to the `length` value. Default: `false`.

To strictly enforce a maximum subarray `length`, set the `strict` option to `true`.

``` javascript
var out = chunk( ['abc', 'de', 'fg', 'h', 'ijkl' ], 3, {
	'strict': true
});
// => throws Error
```


## Notes

*	The `function` splits `array` elements atomically; i.e., subarrays do __not__ contain partial `string` elements.


## Examples

``` javascript
var mnames = require( 'datasets-male-first-names-en' );
var fnames = require( 'datasets-female-first-names-en' );
var shuffle = require( 'compute-shuffle' );
var chunk = require( 'chunk-string-array' );

// Create random groups of people under the constraint that the sum of all first names of people within a group cannot exceed 40 characters...
var maxLength = 40;
var names = mnames.concat( fnames );
shuffle( names );
var groups = chunk( names, maxLength );

for ( var i = 0; i < groups.length; i++ ) {
	console.log( groups[ i ].join( ',' ) );
}
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```


---
## Tests

### Unit

This repository uses [tape][tape] for unit tests. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul][istanbul] as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


### Browser Support

This repository uses [Testling][testling] for browser testing. To run the tests in a (headless) local web browser, execute the following command in the top-level application directory:

``` bash
$ make test-browsers
```

To view the tests in a local web browser,

``` bash
$ make view-browser-tests
```

<!-- [![browser support][browsers-image]][browsers-url] -->


---
## License

[MIT license](http://opensource.org/licenses/MIT).


## Copyright

Copyright &copy; 2016. Athan Reines.


[npm-image]: http://img.shields.io/npm/v/chunk-string-array.svg
[npm-url]: https://npmjs.org/package/chunk-string-array

[build-image]: http://img.shields.io/travis/kgryte/node-chunk-string-array/master.svg
[build-url]: https://travis-ci.org/kgryte/node-chunk-string-array

[coverage-image]: https://img.shields.io/codecov/c/github/kgryte/node-chunk-string-array/master.svg
[coverage-url]: https://codecov.io/github/kgryte/node-chunk-string-array?branch=master

[dependencies-image]: http://img.shields.io/david/kgryte/node-chunk-string-array.svg
[dependencies-url]: https://david-dm.org/kgryte/node-chunk-string-array

[dev-dependencies-image]: http://img.shields.io/david/dev/kgryte/node-chunk-string-array.svg
[dev-dependencies-url]: https://david-dm.org/dev/kgryte/node-chunk-string-array

[github-issues-image]: http://img.shields.io/github/issues/kgryte/node-chunk-string-array.svg
[github-issues-url]: https://github.com/kgryte/node-chunk-string-array/issues

[tape]: https://github.com/substack/tape
[istanbul]: https://github.com/gotwarlost/istanbul
[testling]: https://ci.testling.com
