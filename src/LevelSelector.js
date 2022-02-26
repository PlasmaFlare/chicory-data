// @flow strict

import {useMemo, useState} from 'react';
// $FlowFixMe[untyped-import]
import Select from 'react-select';

import {useCurrentCoordinates} from './CurrentCoordinatesContext';
import styles from './LevelSelector.module.css';
import type {LevelType} from './types/LevelType';
import convertCoordinatesToLevelId from './util/convertCoordinatesToLevelId';
import convertLevelIdToCoordinates from './util/convertLevelIdToCoordinates';
import sortCompareCoordinates from './util/sortCompareCoordinates';

type Props = $ReadOnly<{
	levels: {[levelId: string]: LevelType},
}>;

export default function LevelSelector(props: Props): React$Node {
	const [currentCoordinates, setNewCoordinates] = useCurrentCoordinates();

	const levelIds = useMemo(() => {
		const keys = Object.keys(props.levels);

		return keys.sort((a, b) => {
			return sortCompareCoordinates(
				convertLevelIdToCoordinates(a),
				convertLevelIdToCoordinates(b)
			);
		});
	}, [props.levels]);

	// Select stuff
	const selectOptions = useMemo(() => {
		return levelIds.map((id) => {
			const level = props.levels[id];

			const coordinates = convertLevelIdToCoordinates(id);
			const sublabel =
				level.name !== id
					? level.name
					: level.area !== 'none'
					? level.area
					: level.palette;

			return {
				value: id,
				label: `${coordinates[0]}, ${coordinates[1]}, ${coordinates[2]}${
					sublabel !== '' ? ` (${sublabel})` : ''
				}`,
			};
		});
	}, [levelIds, props.levels]);

	const layersGrouped = useMemo(() => {
		return Object.values(
			selectOptions.reduce((prev, current) => {
				if (prev[current.value[0]] == null) {
					prev[current.value[0]] = {
						label: 'Layer ' + current.value[0],
						options: [],
					};
				}

				prev[current.value[0]].options.push(current);

				return prev;
			}, {})
		);
	}, [selectOptions]);

	const currentLevelId = convertCoordinatesToLevelId(currentCoordinates);

	const [inputCoordinates, setInputCoordinates] = useState(currentCoordinates);
	const [prevCoordinates, setPrevCoordinates] = useState(null);

	if (currentCoordinates !== prevCoordinates) {
		setInputCoordinates(currentCoordinates);
		setPrevCoordinates(currentCoordinates);
	}

	function changeLevelBySelect({value: id}: {value: string, label: string}) {
		const coordinates = convertLevelIdToCoordinates(id);

		setNewCoordinates(coordinates);
		setInputCoordinates(coordinates);
	}

	function changeLevelByNumberInput(ev: SyntheticEvent<HTMLFormElement>) {
		ev.preventDefault();

		if (!levelIds.includes(convertCoordinatesToLevelId(inputCoordinates))) {
			alert('Not a valid level');
			return;
		}

		setNewCoordinates(inputCoordinates);
	}

	return (
		<div className={styles.root}>
			<span className={styles.label}>Level:</span>

			<div className={styles.select}>
				<Select
					value={selectOptions.find(
						(option) => option.value === currentLevelId
					)}
					maxMenuHeight={1000}
					onChange={changeLevelBySelect}
					options={layersGrouped}
					styles={{
						control: (provided, state) => {
							return {...provided, cursor: 'pointer'};
						},
						menu: (provided, state) => {
							return {...provided, zIndex: 99};
						},
					}}
					theme={(theme) => {
						return {
							...theme,
							colors: {
								...theme.colors,
								primary: '#c5aeff',
								primary25: '#ffb8a9',
							},
						};
					}}
				/>
			</div>

			<form
				action="#"
				className={styles.numberInputForm}
				onSubmit={changeLevelByNumberInput}
			>
				<span className={styles.label}>Layer:</span>
				<input
					className={styles.numberInput}
					onChange={(ev: SyntheticEvent<HTMLInputElement>) => {
						setInputCoordinates([
							parseInt(ev.currentTarget.value, 10),
							inputCoordinates[1],
							inputCoordinates[2],
						]);
					}}
					required
					type="number"
					value={inputCoordinates[0]}
				/>

				<span className={styles.label}>X:</span>
				<input
					className={styles.numberInput}
					onChange={(ev: SyntheticEvent<HTMLInputElement>) => {
						setInputCoordinates([
							inputCoordinates[0],
							parseInt(ev.currentTarget.value, 10),
							inputCoordinates[2],
						]);
					}}
					required
					type="number"
					value={inputCoordinates[1]}
				/>

				<span className={styles.label}>Y:</span>
				<input
					className={styles.numberInput}
					onChange={(ev: SyntheticEvent<HTMLInputElement>) => {
						setInputCoordinates([
							inputCoordinates[0],
							inputCoordinates[1],
							parseInt(ev.currentTarget.value, 10),
						]);
					}}
					required
					type="number"
					value={inputCoordinates[2]}
				/>

				<button type="submit">Go</button>
			</form>
		</div>
	);
}
