
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {Color3} from "@babylonjs/core/Maths/math.color.js"
import {PBRMaterial} from "@babylonjs/core/Materials/PBR/pbrMaterial.js"

import {Oracle} from "../oracle/oracle.js"
import {ShadowControl} from "./lighting.js"
import {Theater} from "../theater/theater.js"
import {Randomly} from "../toolbox/randomly.js"
import {loadGlb} from "../toolbox/babylon/load-glb.js"
import {sprinkleTrees, TreeDetails} from "./sprinkling/trees.js"
import {NodeMaterial} from "@babylonjs/core/Materials/Node/nodeMaterial.js"

export async function sprinkleNewProps({
		theater: {scene},
		mapSize,
		randomly,
		treeDetails,
		shadowControl,
		cliffSlopeFactor,
		terrainGenerator,
		forestAssetsUrl,
	}: {
		theater: Theater
		mapSize: number
		randomly: Randomly
		shadowControl: ShadowControl
		cliffSlopeFactor: number
		terrainGenerator: Oracle
		treeDetails: TreeDetails
		forestAssetsUrl: string
	}) {
		
	const [assets, pineBark, bareBranches, pineBranches] = await Promise.all([
		loadGlb(scene, forestAssetsUrl),
		NodeMaterial.ParseFromSnippetAsync("Y4DZH4", scene),
		NodeMaterial.ParseFromSnippetAsync("PMTXZE", scene),
		NodeMaterial.ParseFromSnippetAsync("21EE6J", scene)
	])

	for (const mesh of assets.meshes) {
		if (mesh.material?.name === "pinebark"){
			mesh.material = pineBark
		}
		else if (mesh.material?.name === "barebranches"){
			mesh.material = bareBranches
			mesh.material.backFaceCulling = false
			mesh.material.needDepthPrePass = true
		}
		else if (mesh.material?.name === "pinebranches"){
			mesh.material = pineBranches
			mesh.material.backFaceCulling = false
			mesh.material.needDepthPrePass = true
		}
	}

	// hide all base meshes
	for (const mesh of assets.meshes)
		mesh.isVisible = false

	// enable ambient color from scene
	const ambientColor = new Color3(1, 1, 1)
	for (const material of assets.materials) {
		if (material instanceof PBRMaterial)
			material.ambientColor = ambientColor
	}

	sprinkleTrees({
		mapSize,
		randomly,
		shadowControl,
		terrainGenerator,
		cliffSlopeFactor,
		treeDetails,
		treeBases: [
			<Mesh[]>assets.meshes.filter(m => m.name.startsWith("pinetree1_LOD0")),
			<Mesh[]>assets.meshes.filter(m => m.name.startsWith("pinetree2_LOD0")),
			<Mesh[]>assets.meshes.filter(m => m.name.startsWith("pinetree3_LOD0")),
			<Mesh[]>assets.meshes.filter(m => m.name.startsWith("pinetree4_LOD0")),
			<Mesh[]>assets.meshes.filter(m => m.name.startsWith("pinetree5_LOD0")),
			<Mesh[]>assets.meshes.filter(m => m.name.startsWith("pinetree6_LOD0")),
			<Mesh[]>assets.meshes.filter(m => m.name.startsWith("pinetree7_LOD0")),
		],
	})
}
