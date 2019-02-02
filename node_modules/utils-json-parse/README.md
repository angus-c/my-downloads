JSON#parse
===
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][codecov-image]][codecov-url] [![Dependencies][dependencies-image]][dependencies-url]

> Wraps [JSON#parse](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) in a try/catch block.


## Installation

``` bash
$ npm install utils-json-parse
```


## Usage

``` javascript
var parse = require( 'utils-json-parse' );
```

#### parse( value[, reviver] )

Wraps [`JSON#parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) in a `try/catch` block.

``` javascript
var out = parse( '{"beep":"boop"}' );
// returns {'beep':'boop'}

out = parse( '{beep:boop"}' );
// returns <SyntaxError>
```

The API is the same as [`JSON#parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse). Hence, to use a custom `reviver` function

``` javascript
var out;

function reviver( key, value ) {
	if ( key === '' ) {
		return value;
	}
	if ( key === 'beep' ) {
		return value;
	}
}

out = parse( '{"beep":"boop","a":"b"}', reviver );
// returns {'beep':'boop'}
```


## Notes

*	This is provided as a standalone module to trap errors encountered while parsing values of unknown type (e.g., HTTP responses from 3rd party APIs) and to isolate the `try/catch` block.
*	The presence of `try/catch` within any `function` prevents JavaScript compiler optimization. By isolating the `try/catch` block, we minimize the extent of optimization hell.


## Examples

``` javascript
var request = require( 'request' ),
	parse = require( 'utils-json-parse' );

function onResponse( error, response, body ) {
	var out;
	if ( error ) {
		return done( error );
	}
	out = parse( body );
	if ( out instanceof Error ) {
		return done( out );
	}
	return done( null, out );
}

function done( error, data ) {
	if ( error ) {
		return console.error( error.message );
	}
	console.log( data );
}

request({
	'method': 'GET',
	'url': 'http://example.com'
}, onResponse );
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


---
## License

[MIT license](http://opensource.org/licenses/MIT).


## Copyright

Copyright &copy; 2015. Athan Reines.


[npm-image]: http://img.shields.io/npm/v/utils-json-parse.svg
[npm-url]: https://npmjs.org/package/utils-json-parse

[travis-image]: http://img.shields.io/travis/kgryte/utils-json-parse/master.svg
[travis-url]: https://travis-ci.org/kgryte/utils-json-parse

[codecov-image]: https://img.shields.io/codecov/c/github/kgryte/utils-json-parse/master.svg
[codecov-url]: https://codecov.io/github/kgryte/utils-json-parse?branch=master

[dependencies-image]: http://img.shields.io/david/kgryte/utils-json-parse.svg
[dependencies-url]: https://david-dm.org/kgryte/utils-json-parse

[dev-dependencies-image]: http://img.shields.io/david/dev/kgryte/utils-json-parse.svg
[dev-dependencies-url]: https://david-dm.org/dev/kgryte/utils-json-parse

[github-issues-image]: http://img.shields.io/github/issues/kgryte/utils-json-parse.svg
[github-issues-url]: https://github.com/kgryte/utils-json-parse/issues
