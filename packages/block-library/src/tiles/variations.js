/**
 * WordPress dependencies
 */
import { Path, SVG } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/** @typedef {import('@wordpress/blocks').WPBlockVariation} WPBlockVariation */

/**
 * Template option choices for predefined columns layouts.
 *
 * @type {WPBlockVariation[]}
 */
const variations = [
	{
		name: 'two-rows-of-three',
		title: __('2 x 3'),
		description: __('Two rows of three equal tiles'),
		isDefault: true,
		innerBlocks: [['custom/tile'], ['custom/tile'], ['custom/tile'], ['custom/tile'], ['custom/tile'], ['custom/tile']],
		scope: ['block'],
		attributes: {
			rowCount: 2,
		},
		icon: (
			<SVG xmlns="http://www.w3.org/2000/svg"
			     viewBox="0 0 512 512">
				<Path
					d="M151.7,112.4H28v123.7h123.7V112.4z M151.7,277.3H28V401h123.7V277.3z M192.9,112.4v123.7h123.7V112.4H192.9z M316.5,277.3 H192.9V401h123.7V277.3z M360.3,112.4v123.7H484V112.4H360.3z M484,277.3H360.3V401H484V277.3z"/>
			</SVG>

		),
	},
	{
		name: 'two-rows-of-two',
		title: __('2 x 2'),
		description: __('Two rows of three equal tiles'),
		isDefault: true,
		innerBlocks: [['custom/tile'], ['custom/tile'], ['custom/tile'], ['custom/tile']],
		scope: ['block'],
		attributes: {
			rowCount: 2,
		},
		icon: (
			<SVG xmlns="http://www.w3.org/2000/svg"
			     viewBox="0 0 512 512">
				<Path d="M224 32H32V224H224V32zm0 256H32V480H224V288zM288 32V224H480V32H288zM480 288H288V480H480V288z"/>
			</SVG>
		),
	},
	{
		name: 'one-row-of-four',
		title: __('1 x 4'),
		description: __('Four equal tiles in a single row'),
		icon: (
			<SVG xmlns="http://www.w3.org/2000/svg"
			     viewBox="0 0 512 512">
				<Path
					d="M112,208.5H17v95h95V208.5z M143.7,208.5v95h95v-95H143.7z M272.4,208.5v95h95v-95H272.4z M494.1,208.5h-95v95h95V208.5z"/>
			</SVG>
		),
		innerBlocks: [['custom/tile'], ['custom/tile'], ['custom/tile'], ['custom/tile']],
		scope: ['block'],
		attributes: {
			rowCount: 1,
		},
	},
];

export default variations;
