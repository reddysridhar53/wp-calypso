/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * Internal dependencies
 */
import getSelectedEditor from 'calypso/state/selectors/get-selected-editor';
import isClassicEditorForced from 'calypso/state/selectors/is-classic-editor-forced';

import 'calypso/state/gutenberg-opt-in-out/init';

export const isGutenbergOptOutEnabled = ( state, siteId ) => {
	return (
		get( state, [ 'gutenbergOptInOut', siteId, 'optOut' ], false ) &&
		getSelectedEditor( state, siteId ) !== 'classic' &&
		! isClassicEditorForced( state, siteId )
	);
};

export default isGutenbergOptOutEnabled;
