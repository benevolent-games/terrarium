
import "@babylonjs/core/Collisions/collisionCoordinator.js"
import "@babylonjs/core/Engines/Extensions/engine.query.js"
import "@babylonjs/core/Materials/standardMaterial.js"
import "@babylonjs/core/Lights/Shadows/index.js"
import "@babylonjs/loaders/glTF/2.0/index.js"
import "@babylonjs/core/Culling/ray.js"

import {Node} from "../node.js"
import {Camera} from "../main.js"
import {Quadtree} from "../quadtree.js"
import {Oracle} from "../oracle/oracle.js"
import {addMesh} from "../utils/add-mesh.js"
import {Theater} from "../theater/theater.js"
import {v3} from "@benev/toolbox/x/utils/v3.js"
import {stopwatch} from "../toolbox/stopwatch.js"
import {computeDiff} from "../utils/compute-diff.js"
import {GroundMesh} from "@babylonjs/core/Meshes/groundMesh.js"
import {changeMeshResolution} from "../utils/change-mesh-resolution.js"
import {DirectionalLight} from "@babylonjs/core/Lights/directionalLight.js"

export function makeActuator({
		oracle, theater, makeCam
	}: {
		oracle: Oracle,
		theater: Theater,
		makeCam: Camera
	}) {

	const state = theater.slidersState
	const {updateTargetHeight, smoothUpdateForCameraHeight, camera, camBaseParent} = makeCam

	return {
		theater,
		async initialize() {
			const stopwatchForSetups = stopwatch("setups")
			const cliffSlopeFactor = 0

			let gravityEnabled = state.gravity
	
			theater.renderLoop.add(() => {
				updateTargetHeight(gravityEnabled)
				smoothUpdateForCameraHeight(gravityEnabled)
				if (gravityEnabled != state.gravity) {
					gravityEnabled = state.gravity
				}
			})

			stopwatchForSetups.log()
			const stopwatchForGround = stopwatch("ground")

			const meshes: {
				[key: string]: Promise<GroundMesh>
			} = {}
			let prev = <Quadtree[]>[]
			const boundary = new Node({x:0, z: 0, y:0, w: state.boundary, h:50, center: [0, 0, 0]})
			const qt = new Quadtree(boundary, undefined)

			theater.renderLoop.add(async () => {
				const {x, z, y} = camBaseParent.position

				qt.calculateLevelOfDetail({
					cameraPosition: [x, y, z],
					levelsOfDetail: state.levelOfDetail,
					qt,
					maxNumberOfCalculationsPerFrame: state.workLoad,
				}).process()
				qt.changeBoundary(state.boundary, state.levelOfDetail)

				changeMeshResolution(qt, state.meshResolution, meshes)

				const nodes = qt.getChildren()
				const xc = computeDiff(prev, nodes)
				if (xc) {
					for (const c in xc.added) {
						const nodeHackTs = xc.added as {[key: string]: Quadtree}
						const node = nodeHackTs[c]
						meshes[c] = addMesh(node, c, theater, oracle, cliffSlopeFactor)
					}
					prev = nodes
					for (const c in xc.removed) {
						if(await meshes[c])
						(await meshes[c]).dispose()
					}
				}
			})

			stopwatchForGround.log()

			{
				const direction = [-1, -1, -1] as v3.V3
				const intensity = 5
				const light = new DirectionalLight(
					"sun",
					v3.toBabylon(direction),
					theater.scene,
				)
				light.intensity = intensity
			}
			theater.start()
		}
	}
}
