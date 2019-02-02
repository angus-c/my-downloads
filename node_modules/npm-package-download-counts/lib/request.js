'use strict';

// MODULES //

var http = require( 'http' );
var https = require( 'https' );
var parse = require( 'utils-json-parse' );
var debug = require( 'debug' )( 'npm-package-download-counts:request' );


// REQUEST //

/**
* FUNCTION: request( options, clbk )
*	Queries an endpoint for package downloads.
*
* @param {Object} options - options
* @param {String} options.packages - package names
* @param {String} options.period - query period
* @param {Function} clbk - callback to invoke upon querying an endpoint
*/
function request( options, clbk ) {
	var body = '';
	var opts;
	var get;
	var req;
	var err;

	opts = {};
	opts.method = 'GET';
	opts.hostname = options.hostname;
	opts.port = options.port;

	opts.path = '/downloads/range/'+options.period+'/'+options.packages;

	debug( 'Query options: %s', JSON.stringify( opts ) );

	if ( options.protocol === 'https' ) {
		get = https.request;
	} else {
		get = http.request;
	}
	req = get( opts, onResponse );
	req.on( 'error', onError );
	req.end();

	/**
	* FUNCTION: onError( error )
	*	Event listener invoked after encountering an error.
	*
	* @private
	* @param {Error} error - error object
	* @returns {Void}
	*/
	function onError( error ) {
		debug( 'Error encountered while querying endpoint: %s', error.message );
		clbk( error );
	} // end FUNCTION onError()

	/**
	* FUNCTION: onResponse( response )
	*	Callback invoked after receiving an HTTP response.
	*
	* @private
	* @param {Object} response - HTTP response object
	* @returns {Void}
	*/
	function onResponse( response ) {
		if ( response.statusCode !== 200 ) {
			err = {
				'status': response.statusCode,
				'message': ''
			};
		}
		debug( 'Received a response from query endpoint.' );
		debug( 'Response status: %s.', response.statusCode );
		debug( 'Response headers: %s', JSON.stringify( response.headers ) );

		response.setEncoding( 'utf8' );
		response.on( 'data', onData );
		response.on( 'end', onEnd );
	} // end FUNCTION onResponse()

	/**
	* FUNCTION: onData( chunk )
	*	Event listener invoked upon receiving response data.
	*
	* @private
	* @param {String} chunk - data chunk
	* @returns {Void}
	*/
	function onData( chunk ) {
		body += chunk;
	} // end FUNCTION onData()

	/**
	* FUNCTION: onEnd()
	*	Event listener invoked upon a response end.
	*
	* @private
	* @returns {Void}
	*/
	function onEnd() {
		if ( err ) {
			err.message = body;
			return onError( err );
		}
		// debug( 'Response body: %s', body );

		body = parse( body );
		if ( body instanceof Error ) {
			err = {
				'status': 502,
				'message': 'unable to parse endpoint response data as JSON: ' + body.message
			};
			return onError( err );
		}
		clbk( null, body );
	} // end FUNCTION onEnd()
} // end FUNCTION request()


// EXPORTS //

module.exports = request;
