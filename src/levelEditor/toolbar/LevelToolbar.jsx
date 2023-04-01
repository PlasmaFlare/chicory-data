// @flow strict

import SelectableButton from '../../common/SelectableButton';
import {
	PIXEL_COLORS,
	PIXEL_COLORS_EXPLANATIONS,
	TOOLBAR_COLOR_LOOKUP,
} from '../GeoConstants';
import type {EditorToolType} from '../types/EditorToolType';

import styles from './LevelToolbar.module.css';

type Props = $ReadOnly<{
	onEditorToolTypeUpdate: (toolType: EditorToolType) => mixed,
	editorToolType: EditorToolType,
	onSelectPaintColor: (paintColor: number) => mixed,
	currentPaintColor: number,
	brushSize: number,
	onBrushSizeUpdate: (brushSize: number) => mixed,
}>;

export default function LevelToolbar(props: Props): React$Node {
	const toolTypes = ['Select', 'Brush', 'Fill', 'Eyedropper'];

	const colorDescription = TOOLBAR_COLOR_LOOKUP.get(props.currentPaintColor);

	return (
		<div className={styles.toolbar}>
			<div>
				Tools:
				<span className={styles.tools}>
					{toolTypes.map((toolType) => {
						return (
							<SelectableButton
								key={toolType}
								onClick={() => props.onEditorToolTypeUpdate(toolType)}
								selected={props.editorToolType === toolType}
							>
								{toolType}
							</SelectableButton>
						);
					})}
				</span>
			</div>

			<div className={props.editorToolType !== 'Select' ? '' : styles.hidden}>
				Current color:
				<div className={styles.colorContainer}>
					<span
						className={styles.colorDisplay}
						style={{background: PIXEL_COLORS.get(props.currentPaintColor)}}
					/>
					{colorDescription != null ? colorDescription.description : 'N/A'}
				</div>
			</div>

			<div className={props.editorToolType === 'Brush' ? '' : styles.hidden}>
				Brush size: {props.brushSize}
				<input
					className={styles.range}
					max="20"
					min="1"
					onChange={(e) => {
						props.onBrushSizeUpdate(e.target.value);
					}}
					type="range"
					value={props.brushSize}
				/>
			</div>

			<div className={props.editorToolType !== 'Select' ? '' : styles.hidden}>
				Palette selection:
				{PIXEL_COLORS_EXPLANATIONS.map((color) => {
					return color.colors.map((colorIndex, arrayIndex) => {
						const colorDescription = TOOLBAR_COLOR_LOOKUP.get(colorIndex);
						let description = 'N/A';
						if (colorDescription != null) {
							description = colorDescription.description;
						}

						return (
							<SelectableButton
								className={styles.colorSelect}
								key={colorIndex}
								onClick={() => props.onSelectPaintColor(colorIndex)}
								selected={props.currentPaintColor === colorIndex}
							>
								<span
									className={styles.colorBox}
									style={{background: PIXEL_COLORS.get(colorIndex)}}
								/>
								{description}
							</SelectableButton>
						);
					});
				})}
			</div>
		</div>
	);
}