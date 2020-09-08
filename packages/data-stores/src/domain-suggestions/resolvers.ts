/**
 * External dependencies
 */
import { stringify } from 'qs';

/**
 * Internal dependencies
 */
import {
	receiveCategories,
	receiveDomainSuggestionsData,
	receiveDomainSuggestionsError,
	fetchDomainSuggestions,
} from './actions';
import { fetchAndParse, wpcomRequest } from '../wpcom-request-controls';
import type { Selectors } from './selectors';

export function* getCategories() {
	const categories = yield fetchAndParse(
		'https://public-api.wordpress.com/wpcom/v2/onboarding/domains/categories'
	);
	return receiveCategories( categories.body );
}

export function* __internalGetDomainSuggestions(
	// Resolver has the same signature as corresponding selector without the initial state argument
	queryObject: Parameters< Selectors[ '__internalGetDomainSuggestions' ] >[ 1 ]
) {
	// If normalized search string (`query`) contains no alphanumerics, endpoint 404s
	if ( ! queryObject.query ) {
		return receiveDomainSuggestionsError( 'Empty query' );
	}

	yield fetchDomainSuggestions();

	let suggestions;
	try {
		suggestions = yield wpcomRequest( {
			apiVersion: '1.1',
			path: '/domains/suggestions',
			query: stringify( queryObject ),
		} );
	} catch ( e ) {
		// e.g. no connection, or JSON parsing error
		return receiveDomainSuggestionsError( e.message );
	}

	if ( ! suggestions || suggestions === '' ) {
		// Other internal errors
		return receiveDomainSuggestionsError( 'Invalid response' );
	}

	return receiveDomainSuggestionsData( queryObject, suggestions );
}
