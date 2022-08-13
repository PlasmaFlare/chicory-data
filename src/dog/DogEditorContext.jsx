// @flow strict

import {createContext, useContext, useMemo} from 'react';

import type {UndoReducerAction} from '../util/useUndoRedoReducer';
import useUndoRedoReducer from '../util/useUndoRedoReducer';

import type {ChosenHat} from './drawDogToCanvas';

const DogEditorContext = createContext();

type DogState = $ReadOnly<{
	bodyShow: boolean,
	clothes: string,
	clothesColor: string,
	customClothesImage: ?string,
	earColor: string,
	expression: string,
	hair: string,
	hasCustomEarColor: boolean,
	hats: $ReadOnlyArray<ChosenHat>,
	skinColor: string,
	skinOutlineColor: string,
	speechFont: string,
	speechShowBubble: boolean,
	speechText: string,
}>;

export type ReducerAction =
	| UndoReducerAction
	| {
			type: 'setProperties',
			properties: $Shape<DogState>,
	  }
	| {type: 'addNewHatLayer'}
	| {
			type: 'setHatLayerProperties',
			layer: number,
			hat: $Shape<ChosenHat>,
	  }
	| {type: 'moveHatLayerUp', layer: number}
	| {type: 'moveHatLayerDown', layer: number}
	| {type: 'deleteHatLayer', layer: number};

function reducer(state: DogState, action: ReducerAction): DogState {
	switch (action.type) {
		case 'setProperties':
			return {
				...state,
				...action.properties,
			};

		case 'addNewHatLayer':
			return {
				...state,
				hats: [
					...state.hats,
					{
						name: 'None',
						color: '#ffffff',
						customImage: null,
					},
				],
			};

		case 'setHatLayerProperties':
			return {
				...state,
				hats: state.hats
					.slice(0, action.layer)
					.concat({
						...state.hats[action.layer],
						...action.hat,
					})
					.concat(state.hats.slice(action.layer + 1)),
			};

		case 'moveHatLayerUp':
			if (action.layer === 0) {
				// Already at the top
				return state;
			}

			return {
				...state,
				hats: state.hats
					.slice(0, action.layer - 1)
					.concat(state.hats[action.layer])
					.concat(state.hats[action.layer - 1])
					.concat(state.hats.slice(action.layer + 1)),
			};

		case 'moveHatLayerDown':
			if (action.layer === state.hats.length - 1) {
				// Already at the bottom
				return state;
			}

			return {
				...state,
				hats: state.hats
					.slice(0, action.layer)
					.concat(state.hats[action.layer + 1])
					.concat(state.hats[action.layer])
					.concat(state.hats.slice(action.layer + 2)),
			};

		case 'deleteHatLayer':
			return {
				...state,
				hats: state.hats
					.slice(0, action.layer)
					.concat(state.hats.slice(action.layer + 1)),
			};

		default:
			throw new Error('Unknown hat reducer action ' + action.type);
	}
}

type ContextValue = $ReadOnly<{
	canRedo: boolean,
	canUndo: boolean,
	dispatch: (action: ReducerAction) => void,
	dogState: DogState,
}>;

type Props = $ReadOnly<{
	children: React$Node,
}>;

export function DogEditorProvider({children}: Props): React$MixedElement {
	const {
		canRedo,
		canUndo,
		currentState: dogState,
		dispatch,
	} = useUndoRedoReducer(reducer, {
		bodyShow: true,
		clothes: 'Overalls',
		clothesColor: '#ffffff',
		customClothesImage: null,
		earColor: '#ffffff',
		expression: 'normal',
		hair: 'Simple',
		hasCustomEarColor: false,
		hats: [
			{
				name: 'Bandana',
				color: '#ffffff',
				customImage: null,
			},
		],
		skinColor: '#ffffff',
		skinOutlineColor: '#000000',
		speechFont: 'Domigorgon',
		speechShowBubble: true,
		speechText: 'Hello!',
	});

	const contextValue: ContextValue = useMemo(() => {
		return {dogState, dispatch, canUndo, canRedo};
	}, [dogState, dispatch, canUndo, canRedo]);

	return (
		<DogEditorContext.Provider value={contextValue}>
			{children}
		</DogEditorContext.Provider>
	);
}

export function useDogEditorContext(): ContextValue {
	const context = useContext(DogEditorContext);

	if (!context) {
		throw new Error(
			'useDogEditorContext must be used within a DogEditorProvider'
		);
	}

	return context;
}
