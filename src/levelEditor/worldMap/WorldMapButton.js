// @flow strict

import {memo, useEffect, useRef} from 'react';

import {GEO_HEIGHT, GEO_WIDTH} from '../GeoConstants';
import type {LevelType} from '../types/LevelType';
import convertLevelIdToCoordinates from '../util/convertLevelIdToCoordinates';

import getWorldMapGeoPreviewCache from './getWorldMapGeoPreviewCache';
import styles from './WorldMapButton.module.css';

const WIDTH = GEO_WIDTH;
const HEIGHT = GEO_HEIGHT;

type Props = $ReadOnly<{
	drawPreviews: boolean,
	isCurrent: boolean,
	level: ?LevelType,
	// optimization: we were repeatedly creating new arrays
	levelId: string,
	minX: number,
	minY: number,
	onSetNewCoordinates: (coordinates: [number, number, number]) => mixed,
}>;

function WorldMapButton(props: Props): React$Node {
	const coordinates = convertLevelIdToCoordinates(props.levelId);
	const level = props.level;
	const isCurrent = props.isCurrent;

	const currentBox = useRef<?HTMLButtonElement>(null);

	const sublabel =
		level != null
			? [
					level.name !== '' ? 'Name: ' + level.name : null,
					level.area !== '' ? 'Area: ' + level.area : null,
					level.palette !== '' ? 'Palette: ' + level.palette : null,
			  ]
			: [];

	useEffect(() => {
		if (isCurrent) {
			currentBox.current?.scrollIntoView({
				block: 'center',
				inline: 'center',
			});
		}
	}, [isCurrent]);

	return (
		<button
			className={styles.box + ' ' + (isCurrent ? styles.currentBox : '')}
			data-testid={isCurrent ? 'worldmap-active' : null}
			onClick={() => props.onSetNewCoordinates(coordinates)}
			ref={isCurrent ? currentBox : null}
			style={{
				left: Math.abs(props.minX) * WIDTH + coordinates[1] * WIDTH,
				top: Math.abs(props.minY) * HEIGHT + coordinates[2] * HEIGHT,
				width: WIDTH,
				height: HEIGHT,
				backgroundImage:
					props.drawPreviews && !isCurrent && level != null
						? `url(${getWorldMapGeoPreviewCache(level.geo)})`
						: null,
			}}
			title={sublabel.filter(Boolean).join('\n')}
			type="button"
		>
			<div className={styles.text}>
				{coordinates[1]}, {coordinates[2]}
			</div>
		</button>
	);
}

export default (memo<Props>(WorldMapButton): React$AbstractComponent<
	Props,
	mixed
>);