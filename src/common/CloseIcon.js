// @flow strict

import styles from './CloseIcon.module.css';

type Props = $ReadOnly<{
	color: string,
	size: string,
}>;

export default function CloseIcon(props: Props): React$Node {
	return (
		<svg
			className={styles.svg}
			style={{width: props.size, height: props.size}}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 16 16"
			fill={props.color}
		>
			<path d="M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z" />
		</svg>
	);
}
