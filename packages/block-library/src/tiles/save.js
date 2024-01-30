/**
 * WordPress dependencies
 */
/**
 * WordPress dependencies
 */
import { useInnerBlocksProps, useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const blockProps = useBlockProps.save();
	const innerBlocksProps = useInnerBlocksProps.save( blockProps );
	console.log( attributes );
	console.log( blockProps );
	console.log( innerBlocksProps );

	return <div { ...innerBlocksProps } />;
}
