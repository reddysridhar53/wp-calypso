/**
 * External dependencies
 */
import { useTranslate } from 'i18n-calypso';
import React, { FunctionComponent } from 'react';

/**
 * Internal dependencies
 */
import { Card } from '@automattic/components';
import DocumentHead from 'calypso/components/data/document-head';
import Main from 'calypso/components/main';
import SidebarNavigation from 'calypso/my-sites/sidebar-navigation';
import StepProgress from 'calypso/components/step-progress';
import { ConnectionStatus, StatusState } from './connection-status';

/**
 * Internal dependencies
 */
import './style.scss';

interface Props {
	step: number;
}

const SettingsTopLevel: FunctionComponent< Props > = ( { children, step } ) => {
	const translate = useTranslate();

	const steps = [
		translate( 'Host locator' ),
		translate( 'Credentials' ),
		translate( 'Verification' ),
	];

	return (
		<Main className="top">
			<DocumentHead title={ translate( 'Settings' ) } />
			<SidebarNavigation />
			<Card className="top__server-connection-status">
				<div className="top__server-connection-status-content">
					<h3>{ translate( 'Remote server connection credentials' ) }</h3>
					<ConnectionStatus state={ StatusState.Disconnected } />
				</div>
			</Card>
			<Card>
				<StepProgress currentStep={ step } steps={ steps } />
				{ children }
			</Card>
		</Main>
	);
};

export default SettingsTopLevel;
