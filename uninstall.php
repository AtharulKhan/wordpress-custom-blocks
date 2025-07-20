<?php
/**
 * Fired when the plugin is uninstalled.
 *
 * @package custom-blocks
 */

// If uninstall not called from WordPress, then exit.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

// Clean up any plugin options if they exist
delete_option( 'custom_blocks_version' );