// @flow strict

import GIF from 'gif.js';
import {useRef, useState} from 'react';

import {useDogEditorContext} from './DogEditorContext';
import DogPreview from './preview/DogPreview';
import DOG_ANIMATIONS from './types/DogAnimations';

export default function DogEditorGifMaker(): React$MixedElement {
	const {dogState} = useDogEditorContext();

	const [saving, setSaving] = useState(false);
	const gifRef = useRef();
	const [animationIndex, setAnimationIndex] = useState(0);

	const animation = 'idle'; // only this for now

	async function onGifSave() {
		gifRef.current = new GIF({
			quality: 10,
			workers: 2,
			workerScript: new URL(
				'../../node_modules/gif.js/dist/gif.worker.js',
				import.meta.url
			).toString(),
		});

		setSaving(true);
		setAnimationIndex(0);
	}

	async function onCanvasFrameDrawn(
		canvasRef: HTMLCanvasElement,
		animationIndexFromCanvas: number
	) {
		const gif = gifRef.current;
		if (!gif || animationIndexFromCanvas !== animationIndex) {
			return;
		}

		if (saving) {
			gif.addFrame(canvasRef, {
				copy: true,
				delay: 200,
			});

			// Do next frame
			const animationInfo = DOG_ANIMATIONS.get(animation);
			if (animationInfo == null) {
				throw new Error('Invalid animation ' + animation);
			}

			if (animationIndex < animationInfo.headAnim.length - 1) {
				setAnimationIndex(animationIndex + 1);
			} else {
				gif.once('finished', (blob) => {
					window.open(URL.createObjectURL(blob));

					setSaving(false);
				});

				gif.render();
			}
		}
	}

	return (
		<>
			<button onClick={onGifSave} disabled={saving} type="button">
				Save as GIF
			</button>

			{saving ? (
				<div hidden>
					<DogPreview
						animation={animation}
						animationIndex={animationIndex}
						backgroundFillColor="#fff"
						clothes={dogState.clothes}
						clothesColor={dogState.clothesColor}
						customClothesImage={dogState.customClothesImage}
						earColor={
							dogState.hasCustomEarColor
								? dogState.earColor
								: dogState.skinColor
						}
						expression={dogState.expression}
						hats={dogState.hats}
						hair={dogState.hair}
						onCanvasFrameDrawn={onCanvasFrameDrawn}
						showBody={dogState.bodyShow}
						skinColor={dogState.skinColor}
						skinOutlineColor={dogState.skinOutlineColor}
					/>
				</div>
			) : null}
		</>
	);
}
