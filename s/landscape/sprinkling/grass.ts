
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {Vector3} from "@babylonjs/core/Maths/math.js"

import {ShadowControl} from "../lighting.js"
import {v3, V3} from "@benev/toolbox/x/utils/v3.js"
import {Randomly} from "../../toolbox/randomly.js"
import {Oracle} from "../../oracle/oracle.js"
import {NodeMaterial} from "@babylonjs/core/Materials/Node/nodeMaterial.js"
import {Scene} from "@babylonjs/core/scene.js"

type Range = {
	min: number
	max: number
}

export interface GrassDetails {
	numberOfGrass: number
	spaceBetweenGrass: number
	maxGrassPlantingAttempts: number
	randomizationRanges: {
		scale: Range
		heightAdjustment: Range
	}
}

export function sprinkleGrass({
		mapSize, randomly, grassBases, cliffSlopeFactor,
		shadowControl, terrainGenerator,
		grassDetails: {
			numberOfGrass,
			spaceBetweenGrass,
			randomizationRanges,
			maxGrassPlantingAttempts,
		},
	}: {
		grassDetails: GrassDetails
		mapSize: number
		randomly: Randomly
		grassBases: Mesh[][]
		cliffSlopeFactor: number
		shadowControl: ShadowControl
		terrainGenerator: Oracle
	}) {

	console.log(2, grassBases)

	function between(range: Range) {
		return randomly.randomBetween(range.min, range.max)
	}

	const grassPositions: V3[] = []
	let attempts = 0

	while (grassPositions.length < numberOfGrass) {
		attempts += 1
		if (attempts > maxGrassPlantingAttempts) {
			console.error("failed to plant trees, too many failed attempts")
			break
		}

		const x = (randomly.random() * mapSize) - (mapSize / 2)
		const z = (randomly.random() * mapSize) - (mapSize / 2)
		const density = terrainGenerator.sampleTreeDensity(x, z)
		const slope = terrainGenerator.sampleSlope(x, z)
		const probability = slope < cliffSlopeFactor
			? density
			: 0
		const alive = randomly.random() < probability

		if (alive) {
			const position = <V3>[x, terrainGenerator.sampleHeight(x, z), z]
			const tooCloseToAnotherGrass = grassPositions.some(
				p => v3.distance(p, position) < spaceBetweenGrass
			)
			if (!tooCloseToAnotherGrass)
				grassPositions.push(position)
		}
	}

	let count = 0
	for (const [x, y, z] of grassPositions) {
		const scale = between(randomizationRanges.scale)
		// const height = between(randomizationRanges.heightAdjustment)
		const position2 = v3.toBabylon([x, y, z])
		const meshes = randomly.randomSelect(grassBases)
		for (const mesh of meshes) {
			const instance = mesh.createInstance("tree_" + (count++))
			shadowControl.addCaster(instance)
			instance.setAbsolutePosition(position2)
			// instance.rotate(Vector3.Up(), randomly.random() * (Math.PI * 2))
			instance.scaling = new Vector3(scale, scale, scale)
		}
	}
}
