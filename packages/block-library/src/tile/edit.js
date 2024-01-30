/**
 * External dependencies
 */
/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
/**
 * WordPress dependencies
 */
import {
	InnerBlocks,
	BlockControls,
	InspectorControls,
	useBlockProps,
	useSettings,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import { sprintf, __ } from '@wordpress/i18n';

const ALLOWED_BLOCKS = [ 'core/paragraph', 'core/image' ];

function TileEdit( {
	attributes: { backgroundColor, templateLock },
	setAttributes,
	clientId,
} ) {
	const classes = classnames( 'wp-block-tile' );

	const { tilesIds, hasChildBlocks, rootClientId } = useSelect(
		( select ) => {
			const { getBlockOrder, getBlockRootClientId } =
				select( blockEditorStore );

			const rootId = getBlockRootClientId( clientId );

			return {
				hasChildBlocks: getBlockOrder( clientId ).length > 0,
				rootClientId: rootId,
				tilesIds: getBlockOrder( rootId ),
			};
		},
		[ clientId ]
	);

	const blockProps = useBlockProps( {
		className: classes,
	} );

	const tilesCount = tilesIds.length;
	const currentTilePosition = tilesIds.indexOf( clientId ) + 1;

	const label = sprintf(
		/* translators: 1: Block label (i.e. "Block: Tile"), 2: Position of the selected block, 3: Total number of sibling blocks of the same type */
		__( '%1$s (%2$d of %3$d)' ),
		blockProps[ 'aria-label' ],
		currentTilePosition,
		tilesCount
	);

	const innerBlocksProps = useInnerBlocksProps(
		{ ...blockProps, 'aria-label': label },
		{
			templateLock,
			allowedBlocks: ALLOWED_BLOCKS,
			renderAppender: hasChildBlocks
				? undefined
				: InnerBlocks.ButtonBlockAppender,
		}
	);

	return (
		<>
			{ /** TODO: Background control */ }
			<div { ...innerBlocksProps } />
		</>
	);
}

export default TileEdit;
