// @flow strict

import type {LevelType} from './types/LevelType';

import convertCoordinatesToLevelId from './convertCoordinatesToLevelId';
import convertLevelIdToCoordinates from './convertLevelIdToCoordinates';
import React from 'react';
import {useMemo, useState} from 'react';

import styles from './LevelSelector.module.css';

type Props = {
	currentCoordinates: [number, number, number],
	levels: {[levelId: string]: LevelType},
	onNewCoordinates: (coordinates: [number, number, number]) => mixed,
};

export default function LevelSelector(props: Props): React$Node {
	const levelIds = useMemo(() => {
		const keys = Object.keys(props.levels);

		return keys.sort((a, b) => {
			const coordinatesA = convertLevelIdToCoordinates(a);
			const coordinatesB = convertLevelIdToCoordinates(b);

			if (coordinatesA[0] < coordinatesB[0]) {
				return -1;
			} else if (coordinatesA[0] > coordinatesB[0]) {
				return 1;
			}

			if (coordinatesA[1] < coordinatesB[1]) {
				return -1;
			} else if (coordinatesA[1] > coordinatesB[1]) {
				return 1;
			}

			if (coordinatesA[2] < coordinatesB[2]) {
				return -1;
			} else if (coordinatesA[2] > coordinatesB[2]) {
				return 1;
			}

			return 0;
		});
	}, [props.levels]);

	const [inputCoordinates, setInputCoordinates] = useState(
		props.currentCoordinates
	);

	function changeLevelByMenu(ev: SyntheticEvent<HTMLSelectElement>) {
		const newLevelId = ev.currentTarget.value;

		const coordinates = convertLevelIdToCoordinates(newLevelId);
		props.onNewCoordinates(coordinates);
		setInputCoordinates(coordinates);
	}

	function changeLevelByNumberInput(ev: SyntheticEvent<HTMLFormElement>) {
		ev.preventDefault();

		if (!levelIds.includes(convertCoordinatesToLevelId(inputCoordinates))) {
			alert('Not a valid level');
			return;
		}

		props.onNewCoordinates(inputCoordinates);
	}

	return (
		<div className={styles.root}>
			<span className={styles.label}>Go to level:</span>

			<select
				className={styles.select}
				onChange={changeLevelByMenu}
				value={convertCoordinatesToLevelId(props.currentCoordinates)}
			>
				{levelIds.map((id) => {
					const sublabel =
						props.levels[id].area !== 'none'
							? props.levels[id].area
							: props.levels[id].palette;

					return (
						<option key={id} value={id}>
							{id}
							{sublabel !== '' ? ' (' + sublabel + ')' : ''}
						</option>
					);
				})}
			</select>

			<form
				action="#"
				className={styles.numberInputForm}
				onSubmit={changeLevelByNumberInput}
			>
				<input
					className={styles.numberInput}
					onChange={(ev: SyntheticEvent<HTMLInputElement>) => {
						setInputCoordinates([
							parseInt(ev.currentTarget.value, 10),
							inputCoordinates[1],
							inputCoordinates[2],
						]);
					}}
					type="number"
					value={inputCoordinates[0]}
				/>

				<input
					className={styles.numberInput}
					onChange={(ev: SyntheticEvent<HTMLInputElement>) => {
						setInputCoordinates([
							inputCoordinates[0],
							parseInt(ev.currentTarget.value, 10),
							inputCoordinates[2],
						]);
					}}
					type="number"
					value={inputCoordinates[1]}
				/>

				<input
					className={styles.numberInput}
					onChange={(ev: SyntheticEvent<HTMLInputElement>) => {
						setInputCoordinates([
							inputCoordinates[0],
							inputCoordinates[1],
							parseInt(ev.currentTarget.value, 10),
						]);
					}}
					type="number"
					value={inputCoordinates[2]}
				/>

				<button type="submit">Go</button>
			</form>
		</div>
	);
}
