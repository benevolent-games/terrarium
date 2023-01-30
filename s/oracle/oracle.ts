
import {NoiseLayer} from "../types.js"
import {v3, V3} from "@benev/toolbox/x/utils/v3.js"
import {Randomly} from "@benev/toolbox/x/utils/randomly.js"
import {prepareNoise} from "@benev/toolbox/x/utils/noise.js"

export type Oracle = ReturnType<typeof makeOracle>

export function makeOracle({
		randomly, layers, treeDensityScale,
	}: {
		randomly: Randomly
		layers: NoiseLayer[]
		treeDensityScale: number
	}) {

	const seed = randomly.random()

	const maxAmplitude = layers
		.reduce((previous, current) => previous + current.amplitude, 0)

	const halfAmplitude = maxAmplitude / 2

	const {noise2d} = prepareNoise(seed)
	const offsetBetweenEachLayer = 100_000

	function sampleHeight(x: number, y: number) {
		let factor = 0
		layers.forEach(({scale, amplitude, ease}, index) => {
			const offset = index * offsetBetweenEachLayer
			const rawNoise = noise2d(
				offset + (x / scale),
				offset + (y / scale),
			)
			const noise = (rawNoise + 1) / 2
			factor += ease(noise) * amplitude
		})
		return factor - halfAmplitude
	}

	function sampleNormal(x: number, z: number) {
		const offset = 0.5
		const point_base = <V3>[x, sampleHeight(x, z), z]
		const point_north = <V3>[x, sampleHeight(x, z + offset), z + offset]
		const point_west = <V3>[x - offset, sampleHeight(x - offset, z), z]
		
		const vector_north = v3.normalize(v3.subtract(point_north, point_base))
		const vector_west = v3.normalize(v3.subtract(point_west, point_base))

		const surface_normal = v3.normalize(v3.cross(vector_west, vector_north))
		return surface_normal
	}

	const up = <V3>[0, 1, 0]
	function sampleSlope(x: number, y: number) {
		const normal = sampleNormal(x, y)
		const dot = v3.dot(normal, up)
		return Math.acos(dot)
	}

	function sampleTreeDensity(x: number, y: number) {
		const offset = -696969
		return noise2d(
			offset + (x / treeDensityScale),
			offset + (y / treeDensityScale),
		)
	}

	return {
		sampleHeight,
		sampleNormal,
		sampleSlope,
		sampleTreeDensity,
	}
}
