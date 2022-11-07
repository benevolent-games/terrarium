
import {AbstractMesh} from "@babylonjs/core/Meshes/abstractMesh.js"
import {DirectionalLight} from "@babylonjs/core/Lights/directionalLight.js"
import {ShadowGenerator} from "@babylonjs/core/Lights/Shadows/shadowGenerator.js"

import {v3, V3} from "../toolbox/v3.js"
import {Theater} from "../theater/theater.js"

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
		const shadowGenerator = new ShadowGenerator(2048, light)
		shadowControl.addCaster = (mesh: AbstractMesh) => shadowGenerator.addShadowCaster(mesh)
		shadowControl.removeCaster = (mesh: AbstractMesh) => shadowGenerator.removeShadowCaster(mesh)
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
