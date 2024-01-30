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
import { __ } from '@wordpress/i18n';
import { Notice, PanelBody, RangeControl } from '@wordpress/components';

import {
	InspectorControls,
	useInnerBlocksProps,
	__experimentalBlockVariationPicker,
	useBlockProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { withDispatch, useDispatch, useSelect } from '@wordpress/data';
import {
	createBlock,
	createBlocksFromInnerBlocksTemplate,
	store as blocksStore,
} from '@wordpress/blocks';

/**
 * Internal dependencies
 */
/**
 * Internal dependencies
 */
import {
	hasExplicitPercentColumnWidths,
	getMappedColumnWidths,
	getRedistributedColumnWidths,
	toWidthPrecision,
} from './utils';

/**
 * Allowed blocks constant is passed to InnerBlocks precisely as specified here.
 * The contents of the array should never change.
 * The array should contain the name of each block that is allowed.
 * In tiles block, the only block we allow is 'custom/tile' and a heading.
 *
 * @constant
 * @type {string[]}
 */
const ALLOWED_BLOCKS = [ 'custom/tile', 'core/heading' ];

function TilesEditContainer( {
	attributes,
	setAttributes,
	updateTiles,
	clientId,
} ) {
	const { templateLock, rowCount } = attributes;

	const { tileCount, headingCount, canInsertTileBlock, minCount } = useSelect(
		( select ) => {
			const {
				canInsertBlockType,
				canRemoveBlock,
				getBlocks,
				getBlockCount,
			} = select( blockEditorStore );
			const innerBlocks = getBlocks( clientId );

			// Get the indexes of tiles for which removal is prevented.
			// The highest index will be used to determine the minimum tile count.
			const preventRemovalBlockIndexes = innerBlocks.reduce(
				( acc, block, index ) => {
					if ( ! canRemoveBlock( block.clientId ) ) {
						acc.push( index );
					}
					return acc;
				},
				[]
			);

			return {
				tileCount: innerBlocks.filter(
					( block ) => block.name === 'custom/tile'
				).length,
				headingCount: innerBlocks.filter(
					( block ) => block.name === 'core/heading'
				).length,
				canInsertTileBlock: canInsertBlockType(
					'custom/tile',
					clientId
				),
				minCount: Math.max( ...preventRemovalBlockIndexes ) + 1,
			};
		},
		[ clientId ]
	);

	const classes = classnames( [ 'wp-block-tiles' ] );

	const blockProps = useBlockProps( {
		className: classes,
		'data-ideal-row-count': rowCount + headingCount,
		'data-ideal-col-count': Math.ceil( tileCount / rowCount ),
		'data-heading-count': headingCount,
	} );
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		orientation: 'horizontal',
		renderAppender: false,
		templateLock,
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody>
					{ canInsertTileBlock && (
						<>
							<RangeControl
								__nextHasNoMarginBottom
								__next40pxDefaultSize
								label={ __( 'Total tiles' ) }
								value={ tileCount }
								onChange={ ( value ) =>
									updateTiles(
										tileCount,
										Math.max( minCount, value )
									)
								}
								min={ Math.max( 1, minCount ) }
								max={ Math.max( 16, tileCount ) }
							/>
							{ tileCount > 6 * rowCount && (
								<Notice
									status="warning"
									isDismissible={ false }
								>
									{ __(
										'This tile count exceeds the recommended amount for your row count and may cause visual breakage.'
									) }
								</Notice>
							) }
							<RangeControl
								__nextHasNoMarginBottom
								__next40pxDefaultSize
								label={ __( 'Split across rows' ) }
								help={ __(
									'Ideal number of tiles to display per row (they may automatically stack to fewer per row depending on the available space)'
								) }
								value={ rowCount }
								onChange={ ( value ) =>
									setAttributes( { rowCount: value } )
								}
								min={ 1 }
								max={ 4 }
							/>
						</>
					) }
				</PanelBody>
			</InspectorControls>
			<div { ...innerBlocksProps } />
		</>
	);
}

const TilesEditContainerWrapper = withDispatch(
	( dispatch, ownProps, registry ) => ( {
		/**
		 * Updates the tile count, including necessary revisions to child Tile
		 * @param          previousTiles
		 * @param {number} newTiles      New tile count.
		 */
		updateTiles( previousTiles, newTiles ) {
			const { clientId } = ownProps;
			const { replaceInnerBlocks } = dispatch( blockEditorStore );
			const { getBlocks } = registry.select( blockEditorStore );
			let innerBlocks = getBlocks( clientId );

			// If adding a new tile, assign width to the new tile equal to
			// as if it were `1 / tiles` of the total available space.
			const newTileWidth = toWidthPrecision( 100 / newTiles );

			// Redistribute in consideration of pending block insertion as
			// constraining the available working width.
			const widths = getRedistributedColumnWidths(
				innerBlocks,
				100 - newTileWidth
			);

			innerBlocks = [
				...getMappedColumnWidths( innerBlocks, widths ),
				...Array.from( {
					length: newTiles - previousTiles,
				} ).map( () => {
					return createBlock( 'custom/tile', {
						width: `${ newTileWidth }%`,
					} );
				} ),
			];

			replaceInnerBlocks( clientId, innerBlocks );
		},
	} )
)( TilesEditContainer );

function Placeholder( { clientId, name, setAttributes } ) {
	const { blockType, defaultVariation, variations } = useSelect(
		( select ) => {
			const {
				getBlockVariations,
				getBlockType,
				getDefaultBlockVariation,
			} = select( blocksStore );

			return {
				blockType: getBlockType( name ),
				defaultVariation: getDefaultBlockVariation( name, 'block' ),
				variations: getBlockVariations( name, 'block' ),
			};
		},
		[ name ]
	);
	const { replaceInnerBlocks } = useDispatch( blockEditorStore );
	const blockProps = useBlockProps();

	return (
		<div { ...blockProps }>
			<__experimentalBlockVariationPicker
				icon={ blockType?.icon?.src }
				label={ blockType?.title }
				variations={ variations }
				onSelect={ ( nextVariation = defaultVariation ) => {
					if ( nextVariation.attributes ) {
						setAttributes( nextVariation.attributes );
					}
					if ( nextVariation.innerBlocks ) {
						replaceInnerBlocks(
							clientId,
							createBlocksFromInnerBlocksTemplate(
								nextVariation.innerBlocks
							),
							true
						);
					}
				} }
				allowSkip
			/>
		</div>
	);
}

const TilesEdit = ( props ) => {
	const { clientId } = props;
	const hasInnerBlocks = useSelect(
		( select ) =>
			select( blockEditorStore ).getBlocks( clientId ).length > 0,
		[ clientId ]
	);
	const Component = hasInnerBlocks ? TilesEditContainerWrapper : Placeholder;

	return <Component { ...props } />;
};

export default TilesEdit;
