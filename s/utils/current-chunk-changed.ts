import {Vector3} from "@babylonjs/core/Maths/math.js"
import {V3} from "@benev/toolbox/x/utils/v3.js"
import {Quadtree} from "../quadtree.js"

export function currentChunkChanged(qt: Quadtree, cameraPosition: V3) {
	let currentChunkChecker = qt.getCurrentNode(new Vector3(cameraPosition[0], cameraPosition[1], cameraPosition[2]))
	if (qt.currentChunk != currentChunkChecker) return true
	else false
}
