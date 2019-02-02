Merge
===
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependencies][dependencies-image]][dependencies-url]

> Merge and extend objects.


## Installation

``` bash
$ npm install utils-merge2
```

For use in the browser, use [browserify](https://github.com/substack/node-browserify).


## Usage

``` javascript
var createMergeFcn = require( 'utils-merge2' );
```

#### createMergeFcn( [options] )

Returns a `function` for merging and extending `objects`.


``` javascript
var merge = createMergeFcn();
```

The `function` accepts the following `options`:

*	__level__: limits the merge depth. The default merge strategy is a deep (recursive) merge. Default: `level = Number.POSITIVE_INFINITY`.

	``` javascript
	var merge = createMergeFcn({
		'level': 2
	});
	```

*	__copy__: `boolean` indicating whether to [deep copy](https://github.com/kgryte/utils-copy) merged values. Deep copying prevents shared references and source `object` mutation. Default: `true`.

	``` javascript
	var merge = createMergeFcn({
		'copy': false
	});
	```

*	__override__: defines the merge strategy. If `true`, source `object` values will __always__ override target `object` values. If `false`, source values __never__ override target values (useful for adding, but not overwriting, properties). To define a custom merge strategy, provide a `function`. Default: `true`.

	``` javascript
	// Turn off override...
	var merge = createMergeFcn({
		'override': false
	});

	// Define a custom strategy...
	function strategy( a, b, key ) {
		// a => target value
		// b => source value
		// key => object key
		return <something>;
	}

	merge = createMergeFcn({
		'override': strategy
	});
	```

*	__extend__: `boolean` indicating whether new properties can be added to the target `object`. If `false`, only __shared__ properties are merged. Default: `true`.

	``` javascript
	var merge = createMergeFcn({
		'extend': false
	});
	```



#### merge( target, source1[, source2[,...,sourceN]] )

Merge and extend a target `object`.

``` javascript
var target, source, out;

target = {
	'a': 'beep'
};
source = {
	'a': 'boop',
	'b': 'bap'
};

out = merge( target, source );
/* returns
	{
		'a': 'boop',
		'b': 'bap'
	}
*/
```

The `function` accepts multiple source `objects`.

``` javascript
var target, source1, source2, out;

target = {
	'a': 'beep'
};
source1 = {
	'b': 'boop'
};
source2 = {
	'c': 'cat'
};

out = merge( target, source1, source2 );
/* returns
	{
		'a': 'beep',
		'b': 'boop',
		'c': 'cat'
	}
*/
```




## Notes

*	The target `object` is __mutated__.

	``` javascript
	var target, source, out;

	target = {
		'a': 'beep'
	};
	source = {
		'b': 'boop'
	};

	out = merge( target, source );

	console.log( out === target );
	// returns true

	console.log( target.b );
	// returns 'boop'
	```

	To return a new `object`, provide an empty `object` as the first argument.

	``` javascript
	var target, source, out;

	target = {
		'a': 'beep'
	};
	source = {
		'b': 'boop'
	};

	out = merge( {}, target, source );

	console.log( out === target );
	// returns false
	```

*	The default merge is a deep (recursive) merge. Hence,

	``` javascript
	var target, source, out;

	target = {
		'a': {
			'b': {
				'c': 5
			},
			'd': 'beep'
		}
	};
	source = {
		'a': {
			'b': {
				'c': 10
			}
		}
	};

	out = merge( target, source );
	/* returns
		{
			'a': {
				'b': {
					'c': 10
				},
				'd': 'beep'
			}
		}
	*/
	```

*	By default, merged values are [deep copied](https://github.com/kgryte/utils-copy). Hence,

	``` javascript
	var target, source, out;

	target = {
		'a': null
	};
	source = {
		'a': {
			'b': [ 1, 2, 3 ]
		}
	};

	merge( target, source );
	console.log( target.a.b === source.a.b );
	// returns false
	```

*	__Only__ plain JavaScript `objects` are merged and extended. The following values/types are either [deep copied](https://github.com/kgryte/utils-copy) or assigned:
	-	`Boolean`
	-	`String`
	-	`Number`
	-	`Date`
	-	`RegExp`
	-	`Array`
	-	`Int8Array`
	-	`Uint8Array`
	-	`Uint8ClampedArray`
	-	`Init16Array`
	-	`Uint16Array`
	-	`Int32Array`
	-	`Uint32Array`
	-	`Float32Array`
	-	`Float64Array`
	-	`Buffer` ([Node.js]((http://nodejs.org/api/buffer.html)))

*	Deep copying does __not__ work for the following values/types (see [utils-copy](https://github.com/kgryte/utils-copy#notes)):
	-	`Set`
	-	`Map`
	-	`Error`
	- 	`URIError`
	-	`ReferenceError`
	-	`SyntaxError`
	-	`RangeError`

	If you need support for any of the above types, feel free to file an issue or submit a pull request.

*	`Number`, `String`, or `Boolean` objects are merged as [primitives](https://github.com/kgryte/utils-copy#notes).
*	`functions` are __not__ [deep copied](https://github.com/kgryte/utils-copy#notes).
*	Support for deep merging class instances is inherently [__fragile__](https://github.com/kgryte/utils-copy#notes).
*	Re: __why__ this implementation and not the many other [merge](https://github.com/jaredhanson/utils-merge)/[xtend](https://github.com/Raynos/xtend)/[node-extend](https://github.com/justmoon/node-extend)/[deep-merge](https://github.com/Raynos/deep-merge)/[deep-extend](https://github.com/unclechu/node-deep-extend/blob/master/index.js) modules out there.
	1. 	They always __extend__ and __merge__ and do not allow one or the other.
	2. 	They do not deep merge.
	3. 	They do not allow limiting the merge depth.
	4. 	If they deep copy, they fail to account for `Number`, `String`, `Boolean`, `Buffer`, and typed `array` objects, as well as class instances.
	5. 	They do not allow custom merging strategies.
	6. 	They fail to validate options and arguments.



## Examples

``` javascript
var createMergeFcn = require( 'utils-merge2' ),
	createCopy = require( 'utils-copy' );

var source,
	merge,
	obj,
	out;

obj = {
	'a': 'beep',
	'b': 'boop',
	'c': {
		'c1': 'woot',
		'c2': false,
		'c3': {
			'c3a': [ 1, 2 ],
			'c3b': null
		}
	},
	'd': [ 1, 2, 3 ]
};

source = {
	'b': Math.PI,
	'c': {
		'c1': 'bap',
		'c3': {
			'c3b': 5,
			'c3c': 'bop'
		},
		'c4': 1337,
		'c5': new Date()
	},
	'd': [ 4, 5, 6 ],
	'e': true
};

// [0] Default merge behavior...
merge = createMergeFcn();
out = merge( {}, obj, source );
/* returns
	{
		'a': 'beep',
		'b': 3.141592653589793,
		'c': {
			'c1': 'bap',
			'c2': false,
			'c3': {
				'c3a': [ 1, 2 ],
				'c3b': 5,
				'c3c': 'bop'
			},
			'c4': 1337,
			'c5': <Date>
		},
		'd': [ 4, 5, 6 ],
		'e': true
	}
*/

// [1] Restrict the merge depth...
merge = createMergeFcn({
	'level': 2
});
out = merge( createCopy( obj ), createCopy( source ) );
/* returns
	{
		'a': 'beep',
		'b': 3.141592653589793,
		'c': {
			'c1': 'bap',
			'c2': false,
			'c3': {
				'c3b': 5,
				'c3c': 'bop'
			},
			'c4': 1337,
			'c5': <Date>
		},
		'd': [ 4, 5, 6 ],
		'e': true
	}
*/

// [2] Only merge matching properties...
merge = createMergeFcn({
	'extend': false
});
out = merge( createCopy( obj ), source );
/* returns
	{
		'a': 'beep',
		'b': 3.141592653589793,
		'c': {
			'c1': 'bap',
			'c2': false,
			'c3': {
				'c3a': [ 1, 2 ],
				'c3b': 5
			}
		},
		'd': [ 4, 5, 6 ]
	}
*/

// [3] Don't override existing properties...
merge = createMergeFcn({
	'override': false
});
out = merge( {}, obj, source );
/* returns
	{
		'a': 'beep',
		'b': 'boop',
		'c': {
			'c1': 'woot',
			'c2': false,
			'c3': {
				'c3a': [ 1, 2 ],
				'c3b': null,
				'c3c': 'bop'
			},
			'c4': 1337,
			'c5': <Date>
		},
		'd': [ 1, 2, 3 ],
		'e': true
	}
*/

// [4] Return the same object...
merge = createMergeFcn({
	'override': false,
	'extend': false
});
out = merge( createCopy( obj ), source );
/* returns
	{
		'a': 'beep',
		'b': 'boop',
		'c': {
			'c1': 'woot',
			'c2': false,
			'c3': {
				'c3a': [ 1, 2 ],
				'c3b': null
			}
		},
		'd': [ 1, 2, 3 ]
	}
*/

// [5] Custom merge strategy...
function strategy( a, b, key ) {
	if ( typeof a === 'string' && typeof b === 'string' ) {
		return a + b;
	}
	if ( Array.isArray( a ) && Array.isArray( b ) ) {
		return a.concat( b );
	}
	if ( key === 'c3b' ) {
		return b * 5000;
	}
	// No override:
	return a;
}

merge = createMergeFcn({
	'override': strategy
});
out = merge( {}, obj, source );
/* returns
	{
		'a': 'beep',
		'b': 'boop',
		'c': {
			'c1': 'wootbap',
			'c2': false,
			'c3': {
				'c3a': [ 1, 2 ],
				'c3b': 25000,
				'c3c': 'bop'
			},
			'c4': 1337,
			'c5': <Date>
		},
		'd': [ 1, 2, 3, 4, 5, 6 ],
		'e': true
	}
*/

// [6] Built-in Objects and Class instances...
function Foo( bar ) {
	this._bar = bar;
	return this;
}

merge = createMergeFcn();

obj = {
	'time': new Date(),
	'regex': /beep/,
	'buffer': new Buffer( 'beep' ),
	'Boolean': new Boolean( true ),
	'String': new String( 'woot' ),
	'Number': new Number( 5 ),
	'Uint8Array': new Uint8Array( 10 ),
	'Foo': new Foo( 'beep' )
};
source = {
	'time': new Date( obj.time - 60000 ),
	'regex': /boop/,
	'buffer': new Buffer( 'boop' ),
	'Boolean': new Boolean( false ),
	'String': new String( 'bop' ),
	'Number': new Number( 10 ),
	'Uint8Array': new Uint8Array( 5 ),
	'Foo': new Foo( 'boop' )
};

out = merge( obj, source );
/* returns
	{
		'time': <Date>,
		'regex': /boop/,
		'buffer': <Buffer 62 6f 6f 70>,
		'Boolean': false,
		'String': 'bop',
		'Number': 10,
		'Uint8Array': <Uint8Array>,
		'Foo': <Foo>
	}
*/
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```


## Tests

### Unit

Unit tests use the [Mocha](http://mochajs.org) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

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


[npm-image]: http://img.shields.io/npm/v/utils-merge2.svg
[npm-url]: https://npmjs.org/package/utils-merge2

[travis-image]: http://img.shields.io/travis/kgryte/utils-merge/master.svg
[travis-url]: https://travis-ci.org/kgryte/utils-merge

[coveralls-image]: https://img.shields.io/coveralls/kgryte/utils-merge/master.svg
[coveralls-url]: https://coveralls.io/r/kgryte/utils-merge?branch=master

[dependencies-image]: http://img.shields.io/david/kgryte/utils-merge.svg
[dependencies-url]: https://david-dm.org/kgryte/utils-merge

[dev-dependencies-image]: http://img.shields.io/david/dev/kgryte/utils-merge.svg
[dev-dependencies-url]: https://david-dm.org/dev/kgryte/utils-merge

[github-issues-image]: http://img.shields.io/github/issues/kgryte/utils-merge.svg
[github-issues-url]: https://github.com/kgryte/utils-merge/issues
