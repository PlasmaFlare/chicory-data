// @flow strict

import type {DecorationType} from './DecorationType';
import type {GameObjectType} from './GameObjectType';
import type {LevelAmbianceType} from './LevelAmbianceType';
import type {LevelAreaType} from './LevelAreaType';
import type {LevelMusicType} from './LevelMusicType';
import type {LevelNameType} from './LevelNameType';
import type {LevelPaletteType} from './LevelPaletteType';
import type {LevelTitleType} from './LevelTitleType';

/*

[...new Set(Object.values(window.levelData).reduce((prev, current) => {
    return prev.concat(current.ambiance)
}, []))].sort()


Object.values(window.levelData).reduce((prev, current) => {
	if (current.objects == null) {return prev;}

	return current.objects.reduce((prevB, currentB) => {
		if (prevB.includes(currentB.obj)) {return prevB;}

		return prevB.concat(currentB.obj);
	}, prev)
}, []).sort()


Object.values(window.levelData).reduce((prev, current) => {
    if (current.objects == null) {return prev;}

    return current.objects.reduce((prevB, currentB) => {
        if (prevB[currentB.obj]) {return prevB;}

        const keys = Object.keys(currentB).filter(key => !['obj', 'x', 'y', 'id'].includes(key));
        if (keys.length === 0) {return prevB;}

        prevB[currentB.obj] = currentB;

        return prevB;
    }, prev)
}, {})

*/

export type LevelType = {
	ambiance: LevelAmbianceType,
	area: LevelAreaType,
	decos?: Array<{
		ang: number,
		spr: DecorationType,
		x: number,
		xs: number,
		y: number,
		ys: number,
	}>,
	exits?: string,
	foley: string,
	geo: string,
	music: LevelMusicType,
	name: LevelNameType,
	object_id: string | number,
	objects?: Array<GameObjectType>,
	palette: LevelPaletteType,
	title?: LevelTitleType,
	transition: string | number,
};
