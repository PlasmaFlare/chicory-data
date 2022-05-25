// @flow strict

import {useMemo} from 'react';

import {DOG_HAIR_LIST} from '../types/DogHairList';

import CustomMenuWithMouseHoverOptions from './CustomMenuWithMouseHoverOptions';

type Props = $ReadOnly<{
	onChange: (value: string) => mixed,
	onPreviewChange: (value: ?string) => mixed,
	value: string,
}>;

export default function DogHairSelect({
	onChange,
	onPreviewChange,
	value,
}: Props): React$Node {
	const options = useMemo(() => {
		return DOG_HAIR_LIST.map((option) => {
			return {
				label: option.externalName,
				value: option.internalName,
			};
		});
	}, []);

	return (
		<CustomMenuWithMouseHoverOptions
			onChange={onChange}
			onPreviewChange={onPreviewChange}
			options={options}
			value={value}
		/>
	);
}