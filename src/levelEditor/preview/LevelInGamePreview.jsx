// @flow strict

import MessageBox from '../../common/MessageBox';
import {SCREEN_WIDTH} from '../GeoConstants';
import {AVAILABLE_IN_GAME_SCREENSHOTS} from '../types/AvailableInGameScreenshots';
import convertCoordinatesToLevelId from '../util/convertCoordinatesToLevelId';

import styles from './LevelInGamePreview.module.css';

type Props = $ReadOnly<{
	currentCoordinates: [number, number, number],
	semiTransparent: boolean,
}>;

export default function LevelInGamePreview({
	currentCoordinates,
	semiTransparent,
}: Props): React$Node {
	const levelId = convertCoordinatesToLevelId(currentCoordinates);

	if (!AVAILABLE_IN_GAME_SCREENSHOTS.includes(levelId)) {
		return (
			<div className={styles.root}>
				<MessageBox
					message={`In-game screenshot for level ${currentCoordinates.join(
						', '
					)} is not available yet`}
					type="INFO"
				/>
			</div>
		);
	}

	const urlPrefix = import.meta.env.VITE_IN_GAME_SCREENSHOT_URL_PREFIX;
	if (urlPrefix == null) {
		return (
			<div className={styles.root}>
				<MessageBox
					message="This feature is not available on this app build, contact the website owner for details"
					type="ERROR"
				/>
			</div>
		);
	}

	const src = urlPrefix + levelId + '.png';

	return (
		<div
			className={
				styles.root + ' ' + (semiTransparent ? styles.semiTransparent : '')
			}
		>
			<img
				alt={`Level preview for level ${currentCoordinates.join(', ')}`}
				className={styles.image}
				height={1080}
				// force reload
				key={levelId}
				onDragStart={(ev) => {
					ev.preventDefault();
				}}
				src={src}
				width={SCREEN_WIDTH}
			/>
		</div>
	);
}
