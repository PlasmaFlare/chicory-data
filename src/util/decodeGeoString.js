// @flow strict

import {decode} from 'base64-arraybuffer';
// $FlowFixMe[untyped-import]
import {inflate} from 'pako';

export default function decodeGeoString(geo: string): Uint8Array {
	return inflate(decode(geo));
}
