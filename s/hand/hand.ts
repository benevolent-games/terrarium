
import {Matrix} from "@babylonjs/core/Maths/math.js"
import {GroundMesh} from "@babylonjs/core/Meshes/groundMesh.js"

import {V3, v3} from "@benev/toolbox/x/utils/v3.js"
import {Cursor} from "../cursor/cursor.js"
import {Theater} from "../theater/theater.js"

export function makeHand({theater, cursor, ground}: {
		cursor: Cursor
		theater: Theater
		ground: GroundMesh
	}) {

	return {
		pickPointOnGround(): V3 | undefined {
			const {x, y} = cursor.getCoordinates()
			const ray = theater.scene.createPickingRay(x, y, Matrix.Identity(), theater.scene.activeCamera)
			const fastCheck = true
			const info = ray.intersectsMesh(ground, fastCheck)
			return info.hit
				? v3.fromBabylon(info.pickedPoint!)
				: undefined
		}
	}
}
