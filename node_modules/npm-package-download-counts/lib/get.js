'use strict';

// MODULES //

var chunk = require( 'chunk-string-array' );
var request = require( './request.js' );
var normalize = require( './normalize.js' );
var transform = require( './transform.js' );
var concat = require( './concat.js' );


// NOTES //

/**
* NOTE: the motivation for chunking requests stems from certain servers (e.g., the NPM downloads API server) imposing limits on the query string length. For bulk queries involving many packages, the server may respond with a "Too long request string" error.
*
* This implementation chunks a package array based on a max character length heuristic.
*/


// VARIABLES //

var MAXCHARS = 3600; // heuristic


// GET //

/**
* FUNCTION: get( opts, clbk )
*	Gets package downloads.
*
* @param {Object} opts - options
* @param {Function} clbk - callback to invoke after getting download counts
* @returns {Void}
*/
function get( opts, clbk ) {
	var chunks;
	var count;
	var eFLG;
	var out;
	var len;
	var i;

	count = 0;

	// Determine how to chunk requests to prevent query string length errors...
	chunks = chunk( opts.packages, MAXCHARS );
	len = chunks.length;
	out = new Array( len );
	for ( i = 0; i < len; i++ ) {
		// WARNING: we assume that downstream consumers won't mutate the options object such that shared state is a problem. If we are paranoid, we should use `utils-copy` to create a fresh request options object each iteration.
		opts.packages = chunks[ i ].join( ',' );
		request( opts, next( i ) );
	}
	/**
	* FUNCTION: next( idx )
	*	Returns a callback to be invoked upon completing a request.
	*
	* @private
	* @param {Number} idx - chunk index
	* @returns {Function} callback
	*/
	function next( idx ) {
		/**
		* FUNCTION: next( error, data )
		*	Callback invoked upon completing a request.
		*
		* @private
		* @param {Error|Null} error - error object
		* @param {String} data - response data
		* @returns {Void}
		*/
		return function next( error, data ) {
			if ( eFLG ) {
				return;
			}
			if ( error ) {
				if ( error.status !== 404 ) {
					eFLG = true;
					return done( error );
				}
				data = error;
			}
			data = normalize( chunks[ idx ], data );
			data = transform( chunks[ idx ], data );

			out[ idx ] = data;

			done();
		}; // end FUNCTION next()
	} // end FUNCTION next()

	/**
	* FUNCTION: done( error )
	*	Callback invoked upon completing all requests.
	*
	* @private
	* @param {Error|Null} error - error object
	* @returns {Void}
	*/
	function done( error ) {
		if ( error ) {
			return clbk( error );
		}
		count += 1;
		if ( count === len ) {
			clbk( null, concat( out ) );
		}
	} // end FUNCTION done()
} // end FUNCTION get()


// EXPORTS //

module.exports = get;
