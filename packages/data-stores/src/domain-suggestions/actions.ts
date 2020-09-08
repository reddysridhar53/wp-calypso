/**
 * Internal dependencies
 */
import type { DomainSuggestion, DomainSuggestionQuery, DomainCategory } from './types';

export const receiveCategories = ( categories: DomainCategory[] ) =>
	( {
		type: 'RECEIVE_CATEGORIES',
		categories,
	} as const );

export const fetchDomainSuggestions = () =>
	( {
		type: 'FETCH_DOMAIN_SUGGESTIONS',
	} as const );

export const receiveDomainSuggestionsData = (
	queryObject: DomainSuggestionQuery,
	suggestions: DomainSuggestion[] | undefined
) =>
	( {
		type: 'RECEIVE_DOMAIN_SUGGESTIONS_DATA',
		queryObject,
		suggestions,
	} as const );

export const receiveDomainSuggestionsError = ( errorMessage: string ) =>
	( {
		type: 'RECEIVE_DOMAIN_SUGGESTIONS_ERROR',
		errorMessage,
	} as const );

export type Action = ReturnType<
	| typeof receiveCategories
	| typeof fetchDomainSuggestions
	| typeof receiveDomainSuggestionsData
	| typeof receiveDomainSuggestionsError
>;
