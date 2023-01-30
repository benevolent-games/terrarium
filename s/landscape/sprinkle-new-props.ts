
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {Color3} from "@babylonjs/core/Maths/math.color.js"
import {PBRMaterial} from "@babylonjs/core/Materials/PBR/pbrMaterial.js"

import {Oracle} from "../oracle/oracle.js"
import {ShadowControl} from "./lighting.js"
import {Theater} from "../theater/theater.js"
import {Randomly} from "@benev/toolbox/x/utils/randomly.js"
import {loadGlb} from "../toolbox/babylon/load-glb.js"
import {sprinkleTrees, TreeDetails} from "./sprinkling/trees.js"
import {Texture} from "@babylonjs/core/Materials/Textures/texture.js"
// import {SSAO2RenderingPipeline} from "@babylonjs/core"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {GrassDetails, sprinkleGrass} from "./sprinkling/grass.js"

export async function sprinkleNewProps({
		theater: {scene},
		mapSize,
		randomly,
		treeDetails,
		grassDetails,
		grassAssetsUrl,
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
		grassDetails: GrassDetails
		grassAssetsUrl: string
		forestAssetsUrl: string
	}) {

	const assets = await loadGlb(scene, forestAssetsUrl)
	const ambient = scene.ambientColor = new Color3(0.2, 0.23, 0.18)
	const grassAssets = await loadGlb(scene, grassAssetsUrl)
	// const ssao = new SSAO2RenderingPipeline("ssao", scene, {
	// 	ssaoRatio: 2,
	// 	blurRatio: 4,
	// 	combineRatio: 1
	// })

	// ssao.radius = 10
	// ssao.totalStrength = 1
	// ssao.base = 0.15
	// ssao.samples = 4
	// ssao.maxZ = 600
	// ssao.minZAspect = 0.5

	// scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline(
	// 	"ssao", scene.activeCamera
	// )
	// scene.postProcessRenderPipelineManager.enableEffectInPipeline(
	// 	"ssao",
	// 	ssao.SSAOCombineRenderEffect,
	// 	scene.activeCamera,
	// )
	// const gbr = scene.enableGeometryBufferRenderer()
	// if (gbr) 
	// 	gbr.renderTransparentMeshes = false

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
		},
		grass: {
			color: `${local
				? "/assets/pine_tree_textures/grass_albedo.webp"
				: "https://dl.dropbox.com/s/opvpp8s3kzsdsyk/grass_albedo.webp"
			}`,
			roughness: `${local
				? "/assets/pine_tree_textures/grass_armd.webp"
				: "https://dl.dropbox.com/s/ohvn8srq5jgh9i3/grass_armd.webp"
			}`,
			normal: `${local
				? "/assets/pine_tree_textures/grass_normals.webp"
				: "https://dl.dropbox.com/s/8b7emhyl9zsol0x/grass_normals.webp"
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

	const grassAlbedo = new Texture(links.grass.color, scene)
	const grassRoughness = new Texture(links.grass.roughness, scene)
	const grassNormal = new Texture(links.grass.normal, scene)

	for (const mesh of assets.meshes) {
		mesh.isVisible = false
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
				// material.subSurface.isTranslucencyEnabled = true
				// material.subSurface.translucencyIntensity = 1
				material.ambientColor = ambient
				material.reflectionColor = ambient
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
		mesh.receiveShadows = true
		mesh.freezeWorldMatrix()
		mesh.isPickable = false
		mesh.doNotSyncBoundingInfo = true
	}

	const grassMaterial = new PBRMaterial("grassMaterial", scene)
	grassMaterial.metallicTexture = grassRoughness
	grassMaterial.albedoTexture = grassAlbedo
	grassMaterial.bumpTexture = grassNormal
	grassMaterial.metallic = 1.0
	grassMaterial.roughness = 1.0
	// grassMaterial.useRoughnessFromMetallicTextureAlpha = false
	// grassMaterial.useRoughnessFromMetallicTextureGreen = true
	// grassMaterial.useMetallnessFromMetallicTextureBlue = true
	// grassMaterial.invertNormalMapX = true
	// grassMaterial.invertNormalMapY = true
	// if (grassMaterial.albedoTexture)
	// 	grassMaterial.albedoTexture.hasAlpha = true
	// grassMaterial.transparencyMode = 1
	// grassMaterial.alphaCutOff = .4

	// grassMaterial.needDepthPrePass = true

	for (const mesh of grassAssets.meshes) {
		mesh.material = grassMaterial
		mesh.freezeWorldMatrix()
		mesh.isPickable = false
		mesh.doNotSyncBoundingInfo = true
	}

	// hide all base meshes
	for (const mesh of assets.meshes)
		mesh.isVisible = false
	for (const mesh of grassAssets.meshes)
		mesh.isVisible = false

	// enable ambient color from scene
	const ambientColor = new Color3(1, 1, 1)
	for (const material of assets.materials) {
		if (material instanceof PBRMaterial)
			material.ambientColor = ambientColor
	}
	grassMaterial.ambientColor = ambientColor

	sprinkleTrees({
		mapSize,
		randomly,
		shadowControl,
		terrainGenerator,
		cliffSlopeFactor,
		treeDetails,
		treeBases: [
			<Mesh[]>assets.meshes.filter(m => m.name.startsWith("pinetree1_LOD1")),
			<Mesh[]>assets.meshes.filter(m => m.name.startsWith("pinetree2_LOD1")),
			<Mesh[]>assets.meshes.filter(m => m.name.startsWith("pinetree3_LOD1")),
			<Mesh[]>assets.meshes.filter(m => m.name.startsWith("pinetree4_LOD1")),
			<Mesh[]>assets.meshes.filter(m => m.name.startsWith("pinetree5_LOD1")),
			<Mesh[]>assets.meshes.filter(m => m.name.startsWith("pinetree6_LOD1")),
			<Mesh[]>assets.meshes.filter(m => m.name.startsWith("pinetree7_LOD1")),
		],
	})

	sprinkleGrass({
		mapSize,
		randomly,
		shadowControl,
		terrainGenerator,
		cliffSlopeFactor,
		grassDetails,
		grassBases: [
			<Mesh[]>grassAssets.meshes.filter(m => m.name.startsWith("grass"))
		]
	})
}
