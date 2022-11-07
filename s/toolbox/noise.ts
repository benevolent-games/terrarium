
import {createNoise2D} from "simplex-noise/dist/esm/simplex-noise.js"

export type Noise2d = (x: number, y: number) => number

export function prepareNoise(seed: number): {
		noise2d: Noise2d
	} {
	const generator = createNoise2D(() => seed)
	// const generator = new SimplexNoise(seed)
	return {
		noise2d(x: number, y: number) {
			return generator(x, y)
			// return generator.noise2D(x, y)
		},
	}
}
