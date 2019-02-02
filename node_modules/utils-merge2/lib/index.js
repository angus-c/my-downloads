'use strict';

// MODULES //

var isObject = require( 'validate.io-object' ),
	isBoolean = require( 'validate.io-boolean-primitive' ),
	isFunction = require( 'validate.io-function' ),
	isPositiveInteger = require( 'validate.io-positive-integer' ),
	isBuffer = require( 'validate.io-buffer' ),
	typeName = require( 'type-name' ),
	createCopy = require( 'utils-copy' );


// FUNCTIONS //

/**
* FUNCTION: objectKeys( obj )
*	Returns an object's keys.
*
* @private
* @param {Array|Object} obj - object
* @returns {Array} array of keys
*/
function objectKeys( obj ) {
	var keys = [],
		key;
	for ( key in obj ) {
		if ( obj.hasOwnProperty( key ) ) {
			keys.push( key );
		}
	}
	return keys;
} // end METHOD objectKeys()


// DEEP MERGE //

/**
* FUNCTION: deepMerge( target, source, level, copy, override, extend )
*	Merges a source object into a target object.
*
* @private
* @param {Object} target - target object
* @param {Object} source - source object
* @param {Number} level - merge level
* @param {Boolean} copy - indicates whether to perform a deep copy of merged values
* @param {Boolean|Function} override - defines the merge strategy
* @param {Boolean} extend - indicates whether new properties can be added to the target object
*/
function deepMerge( target, source, level, copy, override, extend ) {
	var hasProp,
		isFunc,
		name,
		keys,
		curr,
		key,
		val,
		tmp,
		len,
		i;

	// Determine if we were provided a custom override strategy:
	isFunc = ( typeof override === 'function' );

	// Decrement the level:
	level = level - 1;

	// Loop through the source keys and implement the merge strategy...
	keys = objectKeys( source );
	len = keys.length;
	for ( i = 0; i < len; i++ ) {
		key = keys[ i ];
		hasProp = target.hasOwnProperty( key );

		// Can we add new properties to the target?
		if ( !hasProp && !extend ) {
			continue;
		}
		val = source[ key ];

		if ( hasProp ) {
			curr = target[ key ];
			name = typeName( curr );

			// Should we recurse to perform a deep(er) merge? (only if both the current value and the proposed value are objects and the level is > 0)
			if (
				!isBuffer( curr ) &&
				name === 'Object' &&
				isObject( val ) &&
				level
			) {
				deepMerge( curr, val, level, copy, override, extend );
				continue;
			}
			// Should we apply a custom merge (override) strategy?
			if ( isFunc ) {
				tmp = override( curr, val, key );

				// NOTE: the following check does NOT prevent shared (leaky) nested references. We only check for top-level reference equality. We will assume that the user knows best, given their having provided a custom override strategy.
				if ( copy && tmp !== curr && tmp === val ) {
					tmp = createCopy( tmp );
				}
				target[ key ] = tmp;
			}
			// Are we allowed to override an existing target value?
			else if ( override ) {
				if ( copy ) {
					target[ key ] = createCopy( val );
				} else {
					target[ key ] = val;
				}
			}
		}
		// New property to be added to target object. Should we deep copy the source value?
		else if ( copy ) {
			target[ key ] = createCopy( val );
		}
		// Perform a simple assignment...
		else {
			target[ key ] = val;
		}
	}
} // end FUNCTION deepMerge()


// CREATE MERGE FUNCTION //

/**
* FUNCTION: createMergeFcn( [options] )
*	Returns a function for merging and extending objects.
*
* @param {Object} [options] - merge options
* @param {Number} [options.level=Infinity] - merge level
* @param {Boolean} [options.copy=true] - boolean indicating whether to deep copy merged values
* @param {Boolean|Function} [options.override=true] - defines the merge strategy
* @param {Boolean} [options.extend=true] - boolean indicating whether new properties can be added to the target object
* @returns {Function} function which can be used to merge objects
*/
function createMergeFcn( options ) {
	var level = Number.POSITIVE_INFINITY,
		override = true,
		extend = true,
		copy = true,
		opts;

	if ( arguments.length ) {
		opts = options;
		if ( !isObject( opts ) ) {
			throw new TypeError( 'merge()::invalid input argument. Must provide an object. Value: `' + opts + '`.' );
		}
		if ( opts.hasOwnProperty( 'level' ) ) {
			level = opts.level;
			if ( !isPositiveInteger( level ) ) {
				throw new TypeError( 'merge()::invalid option. Level option must be a positive integer. Option: `' + level + '`.' );
			}
		}
		if ( opts.hasOwnProperty( 'copy' ) ) {
			copy = opts.copy;
			if ( !isBoolean( copy ) )  {
				throw new TypeError( 'merge()::invalid option. Copy option must be a boolean primitive. Option: `' + copy + '`.' );
			}
		}
		if ( opts.hasOwnProperty( 'override' ) ) {
			override = opts.override;
			if ( !isBoolean( override ) && !isFunction( override ) ) {
				throw new TypeError( 'merge()::invalid option. Override option must be either a boolean primitive or a function. Option: `' + override + '`.' );
			}
		}
		if ( opts.hasOwnProperty( 'extend' ) ) {
			extend = opts.extend;
			if ( !isBoolean( extend ) ) {
				throw new TypeError( 'merge()::invalid option. Extend option must be a boolean primitive. Option: `' + extend + '`.' );
			}
		}
	}
	return merge;

	/**
	* FUNCTION: merge( target, source1[, source2[,...,sourceN]] )
	*	Merges objects into a target object. Note that the target object is mutated.
	*
	* @private
	* @param {Object} target - target object
	* @param {...Object} source - source objects; i.e., objects to be merged into the target object
	* @returns {Object} merged object
	*/
	function merge( target ) {
		var nargs = arguments.length - 1,
			arg,
			src,
			i;

		if ( nargs < 1 ) {
			throw new Error( 'merge()::insufficient input arguments. Must provide both a target object and one or more source objects.' );
		}
		if ( !isObject( target ) ) {
			throw new TypeError( 'merge()::invalid input argument. Target must be an object. Value: `' + target + '`.' );
		}
		src = new Array( nargs );
		for ( i = 0; i < nargs; i++ ) {
			arg = arguments[ i+1 ];
			// NOTE: this is a porous check. Buffers, Numbers, Booleans, Strings, Dates, RegExp, custom class instances,... will all pass.
			if ( !isObject( arg ) ) {
				throw new TypeError( 'merge()::invalid input argument. A merge source must be an object. Value: `' + arg + '`.' );
			}
			src[ i ] = arg;
		}
		for ( i = 0; i < nargs; i++ ) {
			deepMerge( target, src[ i ], level, copy, override, extend );
		}
		return target;
	} // end FUNCTION merge()
} // end FUNCTION createMergeFcn()


// EXPORTS //

module.exports = createMergeFcn;
