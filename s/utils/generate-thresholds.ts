import {Quadtree} from "../quadtree.js"
import {Boundary} from "../types/boundary.js"

export const generateThresholds = (number: number, {w}: Boundary) => {
	const levels: number[] = []
	for (let i = 0; i <= number; i++) {
		if (i == number) {
			levels.push(0)
		}
		if (i != number) {
			levels.push((w / Math.pow(2, i)) + (12.5 / 100 * w))
		}
	}
	return levels
}


// export const generateThresholdsIfNone = (levelsOfDetail: number, {thresholds, boundary}: Quadtree) => {
// 	if (!thresholds) {
// 		thresholds = generateThresholds(levelsOfDetail, boundary)
// 	}
// }

export const onLevelOfDetailChangeGenerateNewThresholds = (qt: Quadtree, levelsOfDetail: number) => {
	if (qt.thresholds && qt.thresholds.length - 1 != levelsOfDetail) {
		const newThresholds = generateThresholds(levelsOfDetail, qt.boundary)
		qt.changeLevelOfDetail(qt, levelsOfDetail)
		qt.thresholds = newThresholds
	}
}
