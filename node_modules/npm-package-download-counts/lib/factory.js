'use strict';

// MODULES //

var isFunction = require( 'validate.io-function' );
var merge = require( 'utils-merge2' )();
var validate = require( './validate.js' );
var defaults = require( './defaults.json' );
var get = require( './get.js' );


// VARIABLES //

var DEFAULT_HTTP_PORT = 80;
var DEFAULT_HTTPS_PORT = 443;


// FACTORY //

/**
* FUNCTION: factory( options, clbk )
*	Returns a function for getting package download counts.
*
* @param {Object} options - function options
* @param {String[]} options.packages - package names
* @param {String} [options.period="last-month"] - query period
* @param {Function} clbk - callback to invoke upon query completion
* @returns {Function} function for getting download counts
*/
function factory( options, clbk ) {
	var opts;
	var err;
	opts = merge( {}, defaults );
	err = validate( opts, options );
	if ( err ) {
		throw err;
	}
	if ( opts.port === null ) {
		if ( opts.protocol === 'https' ) {
			opts.port = DEFAULT_HTTPS_PORT;
		} else {
			opts.port = DEFAULT_HTTP_PORT;
		}
	}
	if ( !isFunction( clbk ) ) {
		throw new TypeError( 'invalid input argument. Callback argument must be a function. Value: `' + clbk + '`.' );
	}
	/**
	* FUNCTION: counts()
	*	Gets package download counts.
	*
	* @returns {Void}
	*/
	return function counts() {
		get( opts, done );
		/**
		* FUNCTION: done( error, data )
		*	Callback invoked after query completion.
		*
		* @private
		* @param {Error|Null} error - error object
		* @param {String[]} data - query data
		* @returns {Void}
		*/
		function done( error, data ) {
			if ( error ) {
				return clbk( error );
			}
			clbk( null, data );
		} // end FUNCTION done()
	}; // end FUNCTION counts()
} // end FUNCTION factory()


// EXPORTS //

module.exports = factory;
