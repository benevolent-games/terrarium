
import {Theater} from "../theater/theater.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {UniversalCamera} from "@babylonjs/core/Cameras/universalCamera.js"

export function makeSpectatorCamera({
		theater, sampleHeight
	}: {
		theater: Theater
		sampleHeight: (x: number, y: number) => number
	}) {

	const camera = (() => {
		const name = "cammm"
		const position = new Vector3(0, 0, 0)
		return new UniversalCamera(name, position, theater.scene)
	})()

	camera.attachControl()
	camera.minZ = 0.5
	// camera.maxZ = 200
	camera.speed = 2
	camera.angularSensibility = 4000

	camera.keysUp.push(87)
	camera.keysLeft.push(65)
	camera.keysDown.push(83)
	camera.keysRight.push(68)

	let targetHeight = 0
	const minimumHeightOffGround = 10

	function updateTargetHeight(gravityEnabled: boolean) {
		if(!gravityEnabled) return
		targetHeight = sampleHeight(
			camera.globalPosition.x,
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
			camera.globalPosition.z,
		) + minimumHeightOffGround
		if (camera.globalPosition.y < floor) {
			const underneath = floor - camera.globalPosition.y
			camera.position.y += underneath
		}
	}

	

	return {
		camera,
		updateTargetHeight,
		smoothUpdateForCameraHeight
	}
}
