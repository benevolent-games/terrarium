
import {Scene} from "@babylonjs/core/scene.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {UniversalCamera} from "@babylonjs/core/Cameras/universalCamera.js"

export default function makeSpectatorCamera(scene: Scene) {

	const camera = (() => {
		const name = "cammm"
		const position = new Vector3(0, 0, 0)
		return new UniversalCamera(name, position, scene)
	})()

	camera.attachControl()
	camera.minZ = 0.5
	camera.speed = 3
	camera.angularSensibility = 4000

	camera.keysUp.push(87)
	camera.keysLeft.push(65)
	camera.keysDown.push(83)
	camera.keysRight.push(68)

	return camera
}
