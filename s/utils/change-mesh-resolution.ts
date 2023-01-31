import {GroundMesh} from "@babylonjs/core/Meshes/groundMesh.js"
import {Quadtree} from "../quadtree.js"

export const changeMeshResolution = async (qt: Quadtree, meshResolution: number, meshes: {
	[key: string]: Promise<GroundMesh>}) => {
	const [someMesh] = Object.values(meshes)
	if ((await someMesh)?.subdivisions != meshResolution) {
		const leafNodes = qt.getChildren()
		for (const c in leafNodes) {
			qt.workQueue.push(() => leafNodes[c].undivide())
		}
	}
}
