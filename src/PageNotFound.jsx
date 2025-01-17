// @flow strict

import {Link} from 'react-router-dom';

import BigPageNotice from './common/BigPageNotice';
import useDocumentTitle from './util/useDocumentTitle';

export default function PageNotFound(): React$Node {
	useDocumentTitle('Page not found');

	return (
		<BigPageNotice heading="⚠️ Page not found">
			<Link to="/">Teleport to Luncheon</Link>
		</BigPageNotice>
	);
}
