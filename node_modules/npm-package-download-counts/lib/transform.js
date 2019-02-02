'use strict';

// MODULES //

var getTime = require( './time.js' );


// NOTES //

/* Results...
	{
		"<pkg1>": {
			"downloads": [
				{...},
				...
			],
			"start": "...",
			"end": "...",
			"package": "..."
		},
		"<pkg2>": {
			"downloads": [
				{...},
				...
			],
			"start": "...",
			"end": "...",
			"package": "..."
		},
		"<pkg3>": null,
		...
	}
*/


// TRANSFORM //

/**
* FUNCTION: transform( pkgs, data )
*	Transforms response data.
*
* @param {String[]} pkgs - package names
* @param {Object} data - response data
* @returns {Object[]} transformed data
*/
function transform( pkgs, data ) {
	var time;
	var out;
	var len;
	var tmp;
	var pkg;
	var idx;
	var t;
	var v;
	var N;
	var d;
	var i;
	var j;

	len = pkgs.length;

	// Build a time vector based on the query period...
	for ( i = 0; i < len; i++ ) {
		pkg = data[ pkgs[ i ] ];
		if ( pkg ) {
			time = getTime( pkg.start, pkg.end );
			N = time.length;
			break;
		}
	}
	// For each package timeseries, do two things: 1) map each count to a 2-element array format and 2) zero-fill missing values...
	out = new Array( len );
	for ( i = 0; i < len; i++ ) {
		pkg = data[ pkgs[ i ] ];
		if ( pkg === null ) {
			tmp = null;
		} else {
			tmp = new Array( N );
			idx = 0;
			d = pkg.downloads;
			t = ( new Date( d[ idx ].day ) ).getTime();
			for ( j = 0; j < N; j++ ) {
				if ( time[ j ] === t ) {
					v = d[ idx ].downloads;
					idx += 1;

					// Peek ahead to see if we have any more download data for this package...
					if ( d[ idx ] ) {
						t = ( new Date( d[ idx ].day ) ).getTime();
					} else {
						t = 0;
					}
				} else {
					// Zero-fill:
					v = 0;
				}
				tmp[ j ] = [
					(new Date( time[ j ] )).toISOString(),
					v
				];
			}
		}
		out[ i ] = {
			'package': pkgs[ i ],
			'data': tmp
		};
	}
	return out;
} // end FUNCTION transform()


// EXPORTS //

module.exports = transform;
