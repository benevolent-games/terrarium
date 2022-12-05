
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
import {StandardMaterial} from "@babylonjs/core/Materials/standardMaterial.js"
import {Texture} from "@babylonjs/core/Materials/Textures/texture.js"
import {CubeTexture} from "@babylonjs/core/Materials/Textures/cubeTexture.js"
import {HDRCubeTexture} from "@babylonjs/core/Materials/Textures/hdrCubeTexture.js"

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

	// const x = new StandardMaterial("pine", scene)
	// x.bumpTexture = new Texture()
	// x.opacityTexture = new Texture()
	// x.

	const pineMaterial = (() => {
		// const mat = new StandardMaterial("pine", scene)!
		// const normalTex = new Texture(
		// 	"/assets/pine_grass_textures/pinebark_normal.webp",
		// 	scene
		// )
		// mat.bumpTexture = normalTex

		// const aoTex = new Texture(
		// 	"/assets/pine_grass_textures/pinebark_ambientocclusion.webp",
		// 	scene
		// )
		// mat.ambientTexture = aoTex

		// const diffuseTex = new Texture(
		// 	"/assets/pine_grass_textures/pinebark_basecolor.webp",
		// 	scene
		// )
		// mat.diffuseTexture = diffuseTex

		// const specTex = new Texture(
		// 	"/assets/pine_grass_textures/pinebark_roughness.webp",
		// 	scene
		// )
		// mat.specularTexture = specTex

		const pbr = new PBRMaterial("pbr", scene);

    // pbr.albedoColor = new Color3(1.0, 0.766, 0.336);
		pbr.metallic = 1; // set to 1 to only use it from the metallicRoughnessTexture
		pbr.roughness = 1; // set to 1 to only use it from the metallicRoughnessTexture

		pbr.metallicTexture = new Texture("/assets/roughness0-metallic1.png", scene)

		pbr.albedoTexture = new Texture("/assets/pine_grass_textures/pinebark_basecolor.webp", scene)

		pbr.bumpTexture = new Texture("/assets/pine_grass_textures/pinebark_normal.webp", scene)

		pbr.ambientTexture = new Texture("/assets/pine_grass_textures/pinebark_ambientocclusion.webp", scene)

		// pbr.reflectionTexture = new Texture("/assets/monkforest.env", scene)
		// pbr.reflectionTexture = CubeTexture.CreateFromPrefilteredData("/assets/monks_forest_4k.dds", scene)

		// pbr.reflectionTexture = new Texture("/assets/monkforest.env", scene)


    pbr.useRoughnessFromMetallicTextureAlpha = false;
    pbr.useRoughnessFromMetallicTextureGreen = true;
    pbr.useMetallnessFromMetallicTextureBlue = true;

		// mat.roughness = 100
		pbr.invertNormalMapX = true
		pbr.invertNormalMapY = true
		// mat.invertNormalMapX = true
		// mat.invertNormalMapY = true

		return pbr
	})()

	for (const mesh of assets.meshes) {
		mesh.receiveShadows = true
		if (mesh.material?.name === "pinebark"){
			mesh.material = pineMaterial
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
