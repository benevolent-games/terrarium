
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {Color3} from "@babylonjs/core/Maths/math.color.js"
import {PBRMaterial} from "@babylonjs/core/Materials/PBR/pbrMaterial.js"

import {Oracle} from "../oracle/oracle.js"
import {ShadowControl} from "./lighting.js"
import {Theater} from "../theater/theater.js"
import {Randomly} from "../toolbox/randomly.js"
import {loadGlb} from "../toolbox/babylon/load-glb.js"
import {sprinkleTrees, TreeDetails} from "./sprinkling/trees.js"
import {Texture} from "@babylonjs/core/Materials/Textures/texture.js"
import {CubeTexture} from "@babylonjs/core/Materials/Textures/cubeTexture.js"

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

	const assets = await loadGlb(scene, forestAssetsUrl)

	// const ambient = CubeTexture.CreateFromPrefilteredData("https://dl.dropbox.com/s/daondf07p2qgy7z/monkforest.env", scene)
	// scene.environmentTexture = ambient

	const local = false
	const links = {
		pineBark: {
			color: `${local
				? "/assets/pine_tree_textures/pinebark_basecolor.webp"
				: "https://dl.dropbox.com/s/lmuvnsivzbcskxp/pinebark_basecolor.webp"
			}`,
			roughness: `${local
				? "/assets/pine_tree_textures/pinebark_armd.webp"
				: "https://dl.dropbox.com/s/72mtv4khr6fiqov/pinebark_armd.webp"
			}`,
			normal: `${local
				? "/assets/pine_tree_textures/pinebark_normal.webp"
				: "https://dl.dropbox.com/s/cs0x8g2wg4rwwr2/pinebark_normal.webp"
			}`,
		},
		pineBranch: {
			color: `${local
				? "/assets/pine_tree_textures/pinebranches_albedo.webp"
				: "https://dl.dropbox.com/s/g1p1l5vpreeghmk/pinebranch2_diffuse.webp"
			}`,
			roughness: `${local
				? "/assets/pine_tree_textures/pinebranches_armd.webp"
				: "https://dl.dropbox.com/s/h9gouiodoohwgds/pinebranch2_armu.webp"
			}`,
			normal: `${local
				? "/assets/pine_tree_textures/pinebranch_normal.webp"
				: "https://dl.dropbox.com/s/caw965tp6mk7kqd/pinebranch2_normal"
			}`,
		},
		bareBranch: {
			color: `${local
				? "/assets/pine_tree_textures/barebranches_albedo.webp"
				: "https://dl.dropbox.com/s/amehzgee7d9ze6b/barebranches_albedo.webp"
			}`,
			roughness: `${local
				? "/assets/pine_tree_textures/barebranches_armd.webp"
				: "https://dl.dropbox.com/s/nkdxqpsvrqb6n0o/barebranches_armd.webp"
			}`,
			normal: `${local
				? "/assets/pine_tree_textures/barebranches_normal.webp"
				: "https://dl.dropbox.com/s/1xzj9wnf5oofteb/barebranches_normal.webp"
			}`,
		}
	}

	const pineBark = (() => {
		const pbr = new PBRMaterial("pbr", scene);

		const color = new Texture(links.pineBark.color, scene)
		const roughness = new Texture(links.pineBark.roughness, scene)
		const normal = new Texture(links.pineBark.normal, scene)

		pbr.useRoughnessFromMetallicTextureAlpha = false;
		pbr.useRoughnessFromMetallicTextureGreen = true;
		pbr.useMetallnessFromMetallicTextureBlue = true;

		// mat.roughness = 100
		pbr.invertNormalMapX = true
		pbr.invertNormalMapY = true
		pbr.metallic = 1.0
		pbr.roughness = 1.0
		// pbr.reflectionTexture = ambient
		// pbr.ambientTexture = ambient
		pbr.metallicTexture = roughness
		pbr.useRoughnessFromMetallicTextureAlpha = false
		pbr.useRoughnessFromMetallicTextureGreen = true
		pbr.useMetallnessFromMetallicTextureBlue = true
		pbr.bumpTexture = normal
		pbr.invertNormalMapX = true
		pbr.invertNormalMapY = true
		pbr.albedoTexture = color
		pbr.albedoTexture.hasAlpha = true
		pbr.useAlphaFromAlbedoTexture = true
		pbr.backFaceCulling = false
		pbr.transparencyMode = 1
		pbr.alphaCutOff = .4
		pbr.subSurface.isTranslucencyEnabled = true
		pbr.subSurface.translucencyIntensity = .2

		pbr.needDepthPrePass = true

		return pbr
	})()

	const pineBranch = (() => {
		const pbr = new PBRMaterial("pbr", scene)

		const color = new Texture(links.pineBranch.color, scene)
		const roughness = new Texture(links.pineBranch.roughness, scene)
		const normal = new Texture(links.pineBranch.normal, scene)

		pbr.metallic = 1.0
		pbr.roughness = 1.0
		// pbr.reflectionTexture = ambient
		// pbr.ambientTexture = ambient
		pbr.metallicTexture = roughness
		pbr.useRoughnessFromMetallicTextureAlpha = false
		pbr.useRoughnessFromMetallicTextureGreen = true
		pbr.useMetallnessFromMetallicTextureBlue = true
		pbr.bumpTexture = normal
		pbr.invertNormalMapX = true
		pbr.invertNormalMapY = true
		pbr.albedoTexture = color
		pbr.albedoTexture.hasAlpha = true
		pbr.useAlphaFromAlbedoTexture = true
		pbr.backFaceCulling = false
		pbr.transparencyMode = 1
		pbr.alphaCutOff = .4
		pbr.subSurface.isTranslucencyEnabled = true
		pbr.subSurface.translucencyIntensity = .2

		pbr.needDepthPrePass = true

		return pbr
	})()

	const bareBranch = (() => {
		const pbr = new PBRMaterial("pbr", scene)

		const color = new Texture(links.bareBranch.color, scene)
		const roughness = new Texture(links.bareBranch.roughness, scene)
		const normal = new Texture(links.bareBranch.normal, scene)

		pbr.metallic = 1.0
		pbr.roughness = 1.0
		// pbr.reflectionTexture = ambient
		// pbr.ambientTexture = ambient
		pbr.metallicTexture = roughness
		pbr.useRoughnessFromMetallicTextureAlpha = false
		pbr.useRoughnessFromMetallicTextureGreen = true
		pbr.useMetallnessFromMetallicTextureBlue = true
		pbr.bumpTexture = normal
		pbr.invertNormalMapX = true
		pbr.invertNormalMapY = true
		pbr.albedoTexture = color
		pbr.albedoTexture.hasAlpha = true
		pbr.useAlphaFromAlbedoTexture = true
		pbr.backFaceCulling = false
		pbr.transparencyMode = 1
		pbr.alphaCutOff = .4
		pbr.subSurface.isTranslucencyEnabled = true
		pbr.subSurface.translucencyIntensity = .2

		pbr.needDepthPrePass = true

		return pbr
	})()

	for (const mesh of assets.meshes) {
		mesh.receiveShadows = true
		if (mesh.material?.name === "pinebark"){
			mesh.material = pineBark
		}
		else if (mesh.material?.name === "barebranches"){
			mesh.material = bareBranch
		}
		else if (mesh.material?.name === "pinebranches"){
			mesh.material = pineBranch
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
