'use strict';

// MODULES //

var isObject = require( 'validate.io-object' );
var isString = require( 'validate.io-string-primitive' );
var isStringArray = require( 'validate.io-string-primitive-array' );
var isNonNegativeInteger = require( 'validate.io-nonnegative-integer' );


// VALIDATE //

/**
* FUNCTION: validate( opts, options )
*	Validates function options.
*
* @param {Object} opts - destination object
* @param {Object} options - options to validate
* @param {String[]} options.packages - package names
* @param {String} [options.period] - query period
* @param {String} [options.hostname] - hostname
* @param {Number} [options.port] - port
* @param {String} [options.protocol] - protocol
* @returns {Error|Null} error or null
*/
function validate( opts, options ) {
	if ( !isObject( options ) ) {
		return new TypeError( 'invalid input argument. Options argument must be an object. Value: `' + options + '`.' );
	}
	opts.packages = options.packages;
	if ( !isStringArray( opts.packages ) ) {
		return new TypeError( 'invalid option. Packages option must be a string array. Option: `' + opts.packages + '`.' );
	}
	if ( options.hasOwnProperty( 'period' ) ) {
		opts.period = options.period;
		if ( !isString( opts.period ) ) {
			return new TypeError( 'invalid option. Period option must be a string. Option: `' + opts.period + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'hostname' ) ) {
		opts.hostname = options.hostname;
		if ( !isString( opts.hostname ) ) {
			return new TypeError( 'invalid option. Hostname option must be a string. Option: `' + opts.hostname + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'port' ) ) {
		opts.port = options.port;
		if ( !isNonNegativeInteger( opts.port ) ) {
			return new TypeError( 'invalid option. Port option must be a nonnegative integer. Option: `' + opts.port + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'protocol' ) ) {
		opts.protocol = options.protocol;
		if ( opts.protocol !== 'http' && opts.protocol !== 'https' ) {
			return new TypeError( 'invalid option. The following protocols are supported: `"http", "https"`. Option: `' + opts.protocol + '`.' );
		}
	}
	return null;
} // end FUNCTION validate()


// EXPORTS //

module.exports = validate;
