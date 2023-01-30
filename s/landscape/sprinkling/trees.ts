
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {Vector3} from "@babylonjs/core/Maths/math.js"

import {ShadowControl} from "../lighting.js"
import {v3, V3} from "@benev/toolbox/x/utils/v3.js"
import {Randomly} from "@benev/toolbox/x/utils/randomly.js"
import {Oracle} from "../../oracle/oracle.js"
import {NodeMaterial} from "@babylonjs/core/Materials/Node/nodeMaterial.js"
import {Scene} from "@babylonjs/core/scene.js"

type Range = {
	min: number
	max: number
}

export interface TreeDetails {
	numberOfTrees: number
	spaceBetweenTrees: number
	maxTreePlantingAttempts: number
	randomizationRanges: {
		scale: Range
		heightAdjustment: Range
	}
}

export function sprinkleTrees({
		mapSize, randomly, treeBases, cliffSlopeFactor,
		shadowControl, terrainGenerator,
		treeDetails: {
			numberOfTrees,
			spaceBetweenTrees,
			randomizationRanges,
			maxTreePlantingAttempts,
		},
	}: {
		treeDetails: TreeDetails
		mapSize: number
		randomly: Randomly
		treeBases: Mesh[][]
		cliffSlopeFactor: number
		shadowControl: ShadowControl
		terrainGenerator: Oracle
	}) {

	function between(range: Range) {
		return randomly.between(range.min, range.max)
	}

	const treePositions: V3[] = []
	let attempts = 0

	while (treePositions.length < numberOfTrees) {
		attempts += 1
		if (attempts > maxTreePlantingAttempts) {
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
			const tooCloseToAnotherTree = treePositions.some(
				p => v3.distance(p, position) < spaceBetweenTrees
			)
			if (!tooCloseToAnotherTree)
				treePositions.push(position)
		}
	}

	let count = 0
	for (const [x, y, z] of treePositions) {
		const scale = between(randomizationRanges.scale)
		const height = between(randomizationRanges.heightAdjustment)
		const position2 = v3.toBabylon([x, y + height, z])
		const meshes = randomly.select(treeBases)
		if(meshes)
			for (const mesh of meshes) {
				const instance = mesh.createInstance("tree_" + (count++))
				shadowControl.addCaster(instance)
				instance.setAbsolutePosition(position2)
				instance.rotate(Vector3.Up(), randomly.random() * (Math.PI * 2))
				instance.scaling = new Vector3(scale, scale, scale)
			}
	}
}
