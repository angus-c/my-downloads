'use strict';

// MODULES //

var incrdatespace = require( 'compute-incrdatespace' );


// TIME //

/**
* FUNCTION: time( start, end )
*	Returns a time vector.
*
* @param {String} start - start time
* @param {String} end - end time
* @returns {Number[]} time vector
*/
function time( start, end ) {
	var arr;
	var i;

	// Convert start and end times to JavaScript timestamps..
	start = ( new Date( start ) ).getTime();
	end = ( new Date( end ) ).getTime();

	// Add <1 day to ensure end time is included in time vector:
	end += 43200000; // half day [ms]

	// Create a linearly spaced date vector:
	arr = incrdatespace( start, end, 'day' );

	// Convert all date objects to JavaScript timestamps...
	for ( i = 0; i < arr.length; i++ ) {
		arr[ i ] = arr[ i ].getTime();
	}
	return arr;
} // end FUNCTION time()


// EXPORTS //

module.exports = time;
