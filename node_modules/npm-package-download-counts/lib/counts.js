'use strict';

// MODULES //

var factory = require( './factory.js' );


// COUNTS //

/**
* FUNCTION: counts( options, clbk )
*	Gets download counts for one or more packages.
*
* @param {Object} options - function options
* @param {String[]} options.packages - package names
* @param {String} [options.period="last-month"] - registry
* @param {Function} clbk - callback to invoke upon query completion
* @returns {Void}
*/
function counts( options, clbk ) {
	factory( options, clbk )();
} // end FUNCTION counts()


// EXPORTS //

module.exports = counts;
