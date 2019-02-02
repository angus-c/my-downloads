'use strict';

/**
* FUNCTION: concat( arr )
*	Concatenates an array of arrays.
*
* @param {Array[]} arr - array of arrays
* @returns {Array} concatenated array
*/
function concat( arr ) {
	var i;
	for ( i = 1; i < arr.length; i++ ) {
		arr[ 0 ] = arr[ 0 ].concat( arr[ i ] );
	}
	return arr[ 0 ];
} // end FUNCTION concat()


// EXPORTS //

module.exports = concat;
