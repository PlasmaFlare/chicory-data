// @flow strict

import ErrorBoundary from '../common/ErrorBoundary';
import AppHeader from '../header/AppHeader';
import useDocumentTitle from '../util/useDocumentTitle';
import useMobileViewport from '../util/useMobileViewport';

import ColorCalculator from './ColorCalculator';
import ColorGrid from './ColorGrid';
import styles from './PaletteApp.module.css';
import {PALETTE_COLORS} from './types/PaletteColorsList';

export default function PaletteApp(): React$Node {
	useMobileViewport();

	useDocumentTitle('Color palettes');

	const palettes = [];
	for (const [title, palette] of PALETTE_COLORS) {
		palettes.push({
			description: title,
			colors: palette,
		});
	}

	return (
		<div className={styles.root}>
			<AppHeader title="Color palettes" />

			<div className={styles.main}>
				<div>
					<ErrorBoundary>
						<ColorCalculator />
					</ErrorBoundary>
				</div>

				<div>
					<ColorGrid palettes={palettes} />
				</div>
			</div>
		</div>
	);
}
