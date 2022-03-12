// @flow strict

import {memo, useCallback, useMemo} from 'react';

import CustomSelect from '../../../common/CustomSelect';

type Props = $ReadOnly<{
	onEditProperty: (key: string, value: string | number) => mixed,
	options: $ReadOnlyArray<string>,
	propertyKey: string,
	value: string,
}>;

function PropertySelectInput({
	onEditProperty,
	options,
	propertyKey,
	value,
}: Props): React$Node {
	const selectOptions = useMemo(() => {
		return options.map((option) => {
			return {
				label: option === '' ? '(Blank)' : option,
				value: option,
			};
		});
	}, [options]);

	const selectedValue = useMemo(() => {
		return selectOptions.find((option) => {
			return option.value === value;
		});
	}, [selectOptions, value]);

	const onChange = useCallback(
		(newValue) => {
			onEditProperty(propertyKey, newValue.value);
		},
		[onEditProperty, propertyKey]
	);

	return (
		<CustomSelect
			maxMenuHeight={300}
			onChange={onChange}
			options={selectOptions}
			value={selectedValue}
		/>
	);
}

export default (memo<Props>(PropertySelectInput): React$AbstractComponent<
	Props,
	mixed
>);
