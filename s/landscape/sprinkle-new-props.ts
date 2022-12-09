
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

	const pineBarkAlbedo = new Texture(links.pineBark.color, scene)
	const pineBarkRoughness = new Texture(links.pineBark.roughness, scene)
	const pineBarkNormal = new Texture(links.pineBark.normal, scene)

	const pineBranchAlbedo = new Texture(links.pineBranch.color, scene)
	const pineBranchRoughness = new Texture(links.pineBranch.roughness, scene)
	const pineBranchNormal = new Texture(links.pineBranch.normal, scene)

	const bareBranchAlbedo = new Texture(links.bareBranch.color, scene)
	const bareBranchRoughness = new Texture(links.bareBranch.roughness, scene)
	const bareBranchNormal = new Texture(links.bareBranch.normal, scene)

	for (const mesh of assets.meshes) {
		mesh.receiveShadows = true
		const material = mesh.material as PBRMaterial
		if (material) {
			if (material.name === "pinebark") {
				material.metallicTexture = pineBarkRoughness
				material.albedoTexture = pineBarkAlbedo
				material.bumpTexture = pineBarkNormal
			}
			else if (material.name === "barebranches"){
				material.metallicTexture = bareBranchRoughness
				material.albedoTexture = bareBranchAlbedo
				material.bumpTexture = bareBranchNormal
				material.backFaceCulling = false
				material.useAlphaFromAlbedoTexture = true
			}
			else if (material.name === "pinebranches"){
				material.metallicTexture = pineBranchRoughness
				material.albedoTexture = pineBranchAlbedo
				material.bumpTexture = pineBranchNormal
				material.backFaceCulling = false
				material.useAlphaFromAlbedoTexture = true
				material.subSurface.isTranslucencyEnabled = true
				material.subSurface.translucencyIntensity = .2
			}
	
			material.metallic = 1.0
			material.roughness = 1.0
			material.useRoughnessFromMetallicTextureAlpha = false
			material.useRoughnessFromMetallicTextureGreen = true
			material.useMetallnessFromMetallicTextureBlue = true
			material.invertNormalMapX = true
			material.invertNormalMapY = true
			if (material.albedoTexture)
				material.albedoTexture.hasAlpha = true
			material.transparencyMode = 1
			material.alphaCutOff = .4
	
			material.needDepthPrePass = true
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
