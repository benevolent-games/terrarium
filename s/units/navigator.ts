
import {Matrix} from "@babylonjs/core/Maths/math.js"

import {V3} from "@benev/toolbox/x/utils/v3.js"
import {Theater} from "../theater/theater.js"
import {spawnBox} from "../hand/spawn-box.js"
import {loop2d} from "../toolbox/loop2d.js"
import {Oracle} from "../oracle/oracle.js"

export function makeNavigator({
		mapSize, resolution, theater, cliffSlopeFactor, terrainGenerator,
	}: {
		mapSize: number
		theater: Theater
		resolution: number
		cliffSlopeFactor: number
		terrainGenerator: Oracle
	}) {

	console.log("nav", resolution)

	const halfMap = mapSize / 2
	const chunkSize = mapSize / resolution

	let positions: (V3 | undefined)[] = []
	let connections: number[] = []

	function resolve(x: number, y: number): V3 | undefined {
		const nx = (x * chunkSize) - halfMap
		const ny = (y * chunkSize) - halfMap
		const height = terrainGenerator.sampleHeight(nx, ny)
		const slope = terrainGenerator.sampleSlope(nx, ny)
		return (slope < cliffSlopeFactor)
			? [nx, height, ny]
			: undefined
	}

	const box = spawnBox({
		size: 1,
		color: [1, 1, 1],
		position: [0, 0, 0],
		scene: theater.scene,
		unlit: true,
	})

	loop2d(resolution, resolution, (x, y) => {
		positions.push(resolve(x, y))
	})

	const matrices = positions
		.filter(p => !!p)
		.map(p => Matrix.Translation(...p!))

	box.thinInstanceAdd(matrices)

	return {}
}
