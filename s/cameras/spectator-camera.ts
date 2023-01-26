
import {Theater} from "../theater/theater.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"
import {makeSpectatorCamera} from "@benev/toolbox/x/babylon/camera/spectator-camera.js"

export function makeCamera({
		theater, sampleHeight
	}: {
		theater: Theater
		sampleHeight: (x: number, y: number, z: number) => number
	}) {

	const camera = makeSpectatorCamera({
		walk: 0.7,
		engine: theater.engine,
		scene: theater.scene,
		lookSensitivity: {
			stick: 1/50,
			mouse: 1/1_000
		},
		renderLoop: theater.renderLoop
	})

	const camParent = camera.parent as TransformNode
	const camBaseParent = camParent.parent as TransformNode

	let targetHeight = 0
	const minimumHeightOffGround = 10

	function updateTargetHeight(gravityEnabled: boolean) {
		if(!gravityEnabled) return
		targetHeight = sampleHeight(
			camera.globalPosition.x,
			camera.globalPosition.y,
			camera.globalPosition.z,
		)
	}

	function smoothUpdateForCameraHeight(gravityEnabled: boolean) {
		if(!gravityEnabled) return
		const currentHeight = camera.position.y
		const difference = targetHeight - currentHeight
		const fractionOfDifference = difference * 0.1
		camera.position.y += fractionOfDifference
		const floor = sampleHeight(
			camera.globalPosition.x,
			camera.globalPosition.y,
			camera.globalPosition.z,
		) + minimumHeightOffGround
		if (camera.globalPosition.y < floor) {
			const underneath = floor - camera.globalPosition.y
			camera.position.y += underneath
		}
	}

	return {
		camera,
		camBaseParent,
		updateTargetHeight,
		smoothUpdateForCameraHeight
	}
}
