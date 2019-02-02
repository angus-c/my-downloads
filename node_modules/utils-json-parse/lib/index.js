'use strict';

/**
* FUNCTION: parse( value[, reviver] )
*	Attempts to parse a value as JSON.
*
* @param {*} value - value to parse
* @param {Function} reviver - transformation function
* @returns {*|Error} parsed value or an error
*/
function parse( value, reviver ) {
	try {
		return JSON.parse( value, reviver );
	} catch ( error ) {
		return error;
	}
} // end FUNCTION parse()


// EXPORTS //

module.exports = parse;
