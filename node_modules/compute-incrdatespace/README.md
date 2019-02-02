incrdatespace
===
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependencies][dependencies-image]][dependencies-url]

> Generates an array of linearly spaced [dates](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) using a provided increment.


## Installation

``` bash
$ npm install compute-incrdatespace
```

For use in the browser, use [browserify](https://github.com/substack/node-browserify).


## Usage

To use the module,

``` javascript
var incrdatespace = require( 'compute-incrdatespace' );
```

#### incrdatespace( start, stop[, increment, opts] )

Generates an `array` of linearly spaced [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) objects. If an `increment` is not provided, the default `increment` is `day`.

``` javascript
var stop = '2014-12-02T07:00:54.973Z',
	start = new Date( stop ) - 60000;

var arr = incrdatespace( start, stop, '8sec' );
/* returns [
	'Mon Dec 01 2014 22:59:54 GMT-0800 (PST)',
	'Mon Dec 01 2014 23:00:06 GMT-0800 (PST)',
	'Mon Dec 01 2014 23:00:18 GMT-0800 (PST)',
	'Mon Dec 01 2014 23:00:30 GMT-0800 (PST)',
	'Mon Dec 01 2014 23:00:42 GMT-0800 (PST)'
]
*/
```

The `start` and `stop` times may be either [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) objects, date strings, Unix timestamps, or JavaScript timestamps.

``` javascript
var start, stop, arr;

// JavaScript timestamps:
stop = 1417503654973;
start = new Date( stop - 60000 );

arr = incrdatespace( start, stop, 8000 );
/* returns [
	'Mon Dec 01 2014 22:59:54 GMT-0800 (PST)',
	'Mon Dec 01 2014 23:00:06 GMT-0800 (PST)',
	'Mon Dec 01 2014 23:00:18 GMT-0800 (PST)',
	'Mon Dec 01 2014 23:00:30 GMT-0800 (PST)',
	'Mon Dec 01 2014 23:00:42 GMT-0800 (PST)'
]
*/

// Unix timestamps:
stop = 1417503655;
start = stop - 60;

arr = incrdatespace( start, stop, '8s' );
/* returns [
	'Mon Dec 01 2014 22:59:54 GMT-0800 (PST)',
	'Mon Dec 01 2014 23:00:06 GMT-0800 (PST)',
	'Mon Dec 01 2014 23:00:18 GMT-0800 (PST)',
	'Mon Dec 01 2014 23:00:30 GMT-0800 (PST)',
	'Mon Dec 01 2014 23:00:42 GMT-0800 (PST)'
]
*/
```

The `increment` can be specified as either a `number` (units of milliseconds) or a `string`. The following units are recognized:

*	`ms, millisecond, milliseconds`
*	`s, sec, secs, second, seconds`
*	`m, min, mins, minute, minutes`
*	`h, hr, hrs, hour, hours`
*	`d, day, days`
*	`w, wk, wks, week, weeks`
*	`b, month, months`
* 	`y, yr, yrs, year, years`

Units can be provided as is

``` javascript
var arr = incrdatespace( start, stop, 'd' );
```

or combined with a `numeric` value.

``` javascript
var arr = incrdatespace( start, stop, '5days' );
```

The rule is that the scalar value and its corresponding unit must __not__ be separated; e.g., the following is __not__ valid: `5 days`.

Scalar-unit pairs can be combined to create arbitrarily complex increments as long as the pairs are delineated using `dot` notation.

``` javascript
var arr = incrdatespace( start, stop, '1y.2b.5days.12hours.34sec.20ms' );
```

To decrement, prefix the scalar unit `string` with a minus sign.

``` javascript
var arr = incrdatespace( stop, start, '-1y.2b.5days.12hours.34sec.20ms' );
```

The output `array` is guaranteed to include the `start` time but is __not__ guaranteed to include the `stop` time (in most cases, the `array` will __not__ include the `stop` time). Beware, however, that values between the `start` and `end` are subject to rounding errors. For example,

``` javascript
var arr = incrdatespace( 1417503655000, 1417503655001, 0.5 );
// returns [ 1417503655000, 1417503655000 ]
```

where sub-millisecond values are truncated by the [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) constructor. Duplicate values should only be a problem when the interval separating consecutive times is less than a millisecond. As the interval separating consecutive dates goes to infinity, the quantization noise introduced by millisecond resolution is negligible.

By default, fractional timestamps are floored. To specify that timestamps always be rounded up or to the nearest millisecond __when converted to [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) objects__, set the `round` option (default: `floor`).

``` javascript
// Equivalent of Math.ceil():
var arr = incrdatespace( 1417503655000, 1417503655001, 0.5, { 'round': 'ceil' } );
// returns [ 1417503655000, 1417503655001 ]

// Equivalent of Math.round():
var arr = incrdatespace( 1417503655000, 1417503655001, 0.5, { 'round': 'round' } );
// returns [ 1417503655000, 1417503655001 ]
```



## Notes

This function is similar to [compute-incrspace](https://github.com/compute-io/incrspace).



## Examples

``` javascript
var incrdatespace = require( 'compute-incrdatespace' ),
	start,
	stop,
	arr;

stop = '2014-12-02T07:00:54.973Z';
start = new Date( stop ) - 5*86400000;

// Default behavior:
arr = incrdatespace( start, stop );
console.log( arr.join( '\n' ) );

// Specify increment:
arr = incrdatespace( start, stop, '12h' );
console.log( arr.join( '\n' ) );

// Create an array using a negative increment:
arr = incrdatespace( stop, start, '-12h' );
console.log( arr.join( '\n' ) );
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```


## Tests

### Unit

Unit tests use the [Mocha](http://mochajs.org/) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


## License

[MIT license](http://opensource.org/licenses/MIT). 


---
## Copyright

Copyright &copy; 2014. Athan Reines.


[npm-image]: http://img.shields.io/npm/v/compute-incrdatespace.svg
[npm-url]: https://npmjs.org/package/compute-incrdatespace

[travis-image]: http://img.shields.io/travis/compute-io/incrdatespace/master.svg
[travis-url]: https://travis-ci.org/compute-io/incrdatespace

[coveralls-image]: https://img.shields.io/coveralls/compute-io/incrdatespace/master.svg
[coveralls-url]: https://coveralls.io/r/compute-io/incrdatespace?branch=master

[dependencies-image]: http://img.shields.io/david/compute-io/incrdatespace.svg
[dependencies-url]: https://david-dm.org/compute-io/incrdatespace

[dev-dependencies-image]: http://img.shields.io/david/dev/compute-io/incrdatespace.svg
[dev-dependencies-url]: https://david-dm.org/dev/compute-io/incrdatespace

[github-issues-image]: http://img.shields.io/github/issues/compute-io/incrdatespace.svg
[github-issues-url]: https://github.com/compute-io/incrdatespace/issues
