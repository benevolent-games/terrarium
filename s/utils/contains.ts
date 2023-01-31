import {Vector3} from "@babylonjs/core/Maths/math.js"
import {Boundary} from "../types/boundary.js"

export function contains(boundary: Boundary, cords: Vector3) {
	if (boundary) {
		const {w, x, z} = boundary
		return (
			cords.x >= x - w / 2 &&
			cords.x <= x + w / 2 &&
			cords.z >= z - w / 2 &&
			cords.z <= z + w / 2
		)
	} else return false
}
