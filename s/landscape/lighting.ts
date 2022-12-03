
import {AbstractMesh} from "@babylonjs/core/Meshes/abstractMesh.js"
import {DirectionalLight} from "@babylonjs/core/Lights/directionalLight.js"
import {ShadowGenerator} from "@babylonjs/core/Lights/Shadows/shadowGenerator.js"

import {v3, V3} from "../toolbox/v3.js"
import {Theater} from "../theater/theater.js"
import {CascadedShadowGenerator} from "@babylonjs/core/Lights/Shadows/cascadedShadowGenerator.js"

export interface ShadowControl {
	addCaster(mesh: AbstractMesh): void
	removeCaster(mesh: AbstractMesh): void
}

export function setupLighting({
			sun, shadows,
			theater: {scene, renderLoop},
		}: {
		theater: Theater
		sun: {
			direction: V3
			distance: number
			intensity: number
		}
		shadows: undefined | {
			softness: number
		}
	}) {

	const deltaPosition = v3.multiplyBy(
		v3.normalize(v3.negate(sun.direction)),
		sun.distance,
	)

	const light = new DirectionalLight(
		"sunlight",
		v3.toBabylon(sun.direction),
		scene,
	)

	light.intensity = sun.intensity
	const shadowControl: ShadowControl = {
		addCaster() {},
		removeCaster() {},
	}

	if (shadows) {
		const csmShadowGenerator = new CascadedShadowGenerator(1024, light)
		// new CascadedShadowGenerator(2048, light)
		// csmShadowGenerator.bias = -1
		csmShadowGenerator.shadowMaxZ = 500
		csmShadowGenerator.usePercentageCloserFiltering = true
		// csmShadowGenerator.lambda = 0.7
		// csmShadowGenerator.numCascades = 3
		csmShadowGenerator.stabilizeCascades = true
		csmShadowGenerator.transparencyShadow = true
		csmShadowGenerator.enableSoftTransparentShadow = true
		// csmShadowGenerator.useBlurExponentialShadowMap = true
		// csmShadowGenerator.blurScale = 5

		shadowControl.addCaster = (mesh: AbstractMesh) => csmShadowGenerator.addShadowCaster(mesh)
		shadowControl.removeCaster = (mesh: AbstractMesh) => csmShadowGenerator.removeShadowCaster(mesh)

	}

	function setSunPositionToFollowCamera() {
		if (scene.activeCamera) {
			light.position.copyFrom(scene.activeCamera.globalPosition)
			light.position.addInPlaceFromFloats(...deltaPosition)
		}
	}

	renderLoop.add(setSunPositionToFollowCamera)

	return {
		shadowControl,
		dispose() {
			renderLoop.delete(setSunPositionToFollowCamera)
		},
	}
}
