'use strict';

// MODULES //

var getKeys = require( 'object-keys' ).shim();


// NORMALIZE //

/**
* FUNCTION: normalize( pkgs, data )
*	Normalizes response data.
*
* @param {String[]} pkgs - package names
* @param {Object} data - response data
* @returns {Object} normalized data
*/
function normalize( pkgs, data ) {
	var keys;
	var tmp;
	var i;

	// {"error":"..."} || {"status":404,"message":"..."}
	if ( data.error || data.status === 404 ) {
		tmp = {};
		for ( i = 0; i < pkgs.length; i++ ) {
			tmp[ pkgs[ i ] ] = null;
		}
		data = tmp;
	}
	// {"downloads":[...],"package":"..."}
	else if ( data.package ) {
		tmp = {};
		tmp[ data.package ] = data;
		data = tmp;
	}
	// Check for packages missing from the results...
	keys = getKeys( data );
	if ( keys.length !== pkgs.length ) {
		for ( i = 0; i < pkgs.length; i++ ) {
			if ( data[ pkgs[i] ] === void 0 ) {
				data[ pkgs[i] ] = null;
			}
		}
	}
	return data;
} // end FUNCTION normalize()


// EXPORTS //

module.exports = normalize;
