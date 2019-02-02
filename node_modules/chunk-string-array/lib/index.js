'use strict';

// MODULES //

var isObject = require( 'validate.io-object' );
var isStringArray = require( 'validate.io-string-primitive-array' );
var isBoolean = require( 'validate.io-boolean-primitive' );
var isPositiveInteger = require( 'validate.io-positive-integer' );


// CHUNK //

/**
* FUNCTION: chunk( strs, length[, options] )
*	Chunks an array of strings using a combined string length criterion.
*
* @param {String[]} strs - string array
* @param {Number} length - sub-array combined string length
* @param {Object} options - function options
* @param {Boolean} [options.strict=false] - boolean indicating whether individual strings are allowed to exceed the combined length
* @returns {Array[]} chunked array
*/
function chunk( strs, length, options ) {
	var opts;
	var psum;
	var max;
	var sum;
	var out;
	var len;
	var idx;
	var i;
	var j;

	// Note: in principal, this function can chunk an array of array-like values.
	if ( !isStringArray( strs ) ) {
		throw new TypeError( 'invalid input argument. First argument must be a string array. Value: `' + strs + '`.' );
	}
	if ( !isPositiveInteger( length ) ) {
		throw new TypeError( 'invalid input argument. Second argument must be a positive integer. Value: `' + length + '`.' );
	}
	if ( arguments.length > 2 ) {
		opts = options;
		if ( !isObject( opts ) ) {
			throw new TypeError( 'invalid input argument. Options argument must be an object. Value: `' + opts + '`.' );
		}
		if (
			opts.hasOwnProperty( 'strict' ) &&
			!isBoolean( opts.strict )
		) {
			throw new TypeError( 'invalid option. Strict option must be a boolean primitive. Option: `' + opts.strict + '`.' );
		}
	} else {
		opts = {};
	}
	len = strs.length;
	out = [];

	// If specified, check for individual strings exceeding length...
	if ( opts.strict ) {
		for ( i = 0; i < len; i++ ) {
			if ( strs[ i ].length > length ) {
				throw new Error( 'invalid input argument. String exceeds maximum allowed length. Value: `' + strs[ i ] + '`.' );
			}
		}
	}
	// Determine index boundaries for chunking (each boundary is inclusive)...
	idx = [];
	sum = 0;
	psum = 0; // preview sum
	for ( i = 0; i < len-1; i++ ) {
		sum += strs[ i ].length;
		psum = sum + strs[ i+1 ].length;
		if (
			sum >= length ||
			psum > length
		) {
			sum = 0;
			idx.push( i );
		}
	}
	idx.push( len-1 );

	// Chunk the input array...
	max = idx[ 0 ];
	j = 0;
	for ( i = 0; i < len; i++ ) {
		if ( i > max ) {
			out.push( [] );
			j += 1;
			max = idx[ j ];
		} else if ( i === 0 ) {
			out.push( [] );
		}
		out[ j ].push( strs[ i ] );
	}
	return out;
} // end FUNCTION chunk()


// EXPORTS //

module.exports = chunk;
