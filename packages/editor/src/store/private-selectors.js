/**
 * External dependencies
 */
import createSelector from 'rememo';

/**
 * WordPress dependencies
 */
import { store as blockEditorStore } from '@wordpress/block-editor';
import { createRegistrySelector } from '@wordpress/data';
import {
	layout,
	symbol,
	navigation,
	page as pageIcon,
	verse,
} from '@wordpress/icons';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import {
	getRenderingMode,
	__experimentalGetDefaultTemplatePartAreas,
} from './selectors';
import { TEMPLATE_PART_POST_TYPE } from './constants';
import { getFilteredTemplatePartBlocks } from './utils/get-filtered-template-parts';

const EMPTY_INSERTION_POINT = {
	rootClientId: undefined,
	insertionIndex: undefined,
	filterValue: undefined,
};

/**
 * Get the insertion point for the inserter.
 *
 * @param {Object} state Global application state.
 *
 * @return {Object} The root client ID, index to insert at and starting filter value.
 */
export const getInsertionPoint = createRegistrySelector( ( select ) =>
	createSelector(
		( state ) => {
			if ( typeof state.blockInserterPanel === 'object' ) {
				return state.blockInserterPanel;
			}

			if ( getRenderingMode( state ) === 'template-locked' ) {
				const [ postContentClientId ] =
					select( blockEditorStore ).getBlocksByName(
						'core/post-content'
					);
				if ( postContentClientId ) {
					return {
						rootClientId: postContentClientId,
						insertionIndex: undefined,
						filterValue: undefined,
					};
				}
			}

			return EMPTY_INSERTION_POINT;
		},
		( state ) => {
			const [ postContentClientId ] =
				select( blockEditorStore ).getBlocksByName(
					'core/post-content'
				);
			return [
				state.blockInserterPanel,
				getRenderingMode( state ),
				postContentClientId,
			];
		}
	)
);

export function getListViewToggleRef( state ) {
	return state.listViewToggleRef;
}
const CARD_ICONS = {
	wp_block: symbol,
	wp_navigation: navigation,
	page: pageIcon,
	post: verse,
};

export const getPostIcon = createRegistrySelector(
	( select ) => ( state, postType, options ) => {
		{
			if (
				postType === 'wp_template_part' ||
				postType === 'wp_template'
			) {
				return (
					__experimentalGetDefaultTemplatePartAreas( state ).find(
						( item ) => options.area === item.area
					)?.icon || layout
				);
			}
			if ( CARD_ICONS[ postType ] ) {
				return CARD_ICONS[ postType ];
			}
			const postTypeEntity = select( coreStore ).getPostType( postType );
			// `icon` is the `menu_icon` property of a post type. We
			// only handle `dashicons` for now, even if the `menu_icon`
			// also supports urls and svg as values.
			if ( postTypeEntity?.icon?.startsWith( 'dashicons-' ) ) {
				return postTypeEntity.icon.slice( 10 );
			}
			return pageIcon;
		}
	}
);

/**
 * Returns the template parts and their blocks for the current edited template.
 *
 * @param {Object} state Global application state.
 * @return {Array} Template parts and their blocks in an array.
 */
export const getCurrentTemplateTemplateParts = createRegistrySelector(
	( select ) => () => {
		const templateParts = select( coreStore ).getEntityRecords(
			'postType',
			TEMPLATE_PART_POST_TYPE,
			{ per_page: -1 }
		);

		const clientIds =
			select( blockEditorStore ).getBlocksByName( 'core/template-part' );
		const blocks =
			select( blockEditorStore ).getBlocksByClientId( clientIds );

		return getFilteredTemplatePartBlocks( blocks, templateParts );
	}
);
