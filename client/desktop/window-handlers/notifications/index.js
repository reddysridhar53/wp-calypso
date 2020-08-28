/**
 * External Dependencies
 */
const { ipcMain: ipc, Notification } = require( 'electron' ); // eslint-disable-line import/no-extraneous-dependencies
const { promisify } = require( 'util' );

/**
 * Internal dependencies
 */
const Settings = require( 'desktop/lib/settings' );
const Platform = require( 'desktop/lib/platform' );
const log = require( 'desktop/lib/logger' )( 'desktop:notifications' );

/**
 *
 * Module dependencies
 */
const delay = promisify( setTimeout );

function updateNotificationBadge( count ) {
	const badgeEnabled = Settings.getSetting( 'notification-badge' );
	if ( ! badgeEnabled ) {
		return;
	}

	const bounceEnabled = Settings.getSetting( 'notification-bounce' );

	if ( count > 0 ) {
		Platform.showNotificationsBadge( count, bounceEnabled );
	} else {
		Platform.clearNotificationsBadge();
	}
}

module.exports = function ( mainWindow ) {
	ipc.on( 'unread-notices-count', function ( _, count ) {
		log.info( 'Notification count received: ' + count );

		updateNotificationBadge( count );
	} );

	ipc.on( 'preferences-changed-notification-badge', function ( _, arg ) {
		updateNotificationBadge( arg );
	} );

	ipc.on( 'received-notification', function ( _, noteWithMeta ) {
		const { note, siteTitle } = noteWithMeta;

		log.info( `Received ${ note.type } notification for site ${ siteTitle }` );

		// TODO: Add "notifications" to Preferences, check if enabled
		// TODO: Mark as read when clicked
		// TODO: Sync Calpyso notifications panel UI with read state
		// TODO: Revisit/tweak notification formatting (e.g. title, subtitle, etc.)
		// TODO: Concat subject[0] and subject[1] for body text (with colon).
		// https://www.electronjs.org/docs/api/notification
		if ( Notification.isSupported() ) {
			const title = siteTitle;
			const subtitle = note.subject.length > 1 ? note.subject[ 0 ].text : '';
			const body = note.subject.length > 1 ? note.subject[ 1 ].text : note.subject[ 0 ].text;
			const notification = new Notification( {
				title: title,
				subtitle: subtitle,
				body: body,
				silent: true,
				hasReply: false,
			} );

			notification.on( 'click', function () {
				// TODO: remove this log line (or make debug)
				// TODO: verify focus, blur and show
				log.info( `Notification clicked: `, note );
				if ( ! mainWindow.isVisible() ) {
					mainWindow.show();
					delay( 3000 );
				}
				mainWindow.webContents.send( 'notification-clicked', noteWithMeta );
			} );

			notification.show();
		}
	} );
};
