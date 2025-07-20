<?php
/**
 * Plugin Name:       Custom Blocks
 * Description:       A collection of custom blocks for Lavender Counselling website.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Lavender Counselling
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       custom-blocks
 *
 * @package           custom-blocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function custom_blocks_init() {
	$blocks_directory = __DIR__ . '/build/';
	
	// Register all blocks found in the build directory
	if ( file_exists( $blocks_directory ) ) {
		$block_folders = glob( $blocks_directory . '*', GLOB_ONLYDIR );
		
		foreach ( $block_folders as $block_folder ) {
			register_block_type( $block_folder );
		}
	}
}
add_action( 'init', 'custom_blocks_init' );