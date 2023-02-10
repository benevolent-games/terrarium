
import "@babylonjs/core/Collisions/collisionCoordinator.js"
import "@babylonjs/core/Engines/Extensions/engine.query.js"
import "@babylonjs/core/Materials/standardMaterial.js"
import "@babylonjs/core/Lights/Shadows/index.js"
import "@babylonjs/loaders/glTF/2.0/index.js"
import "@babylonjs/core/Culling/ray.js"

import {Node} from "../node.js"
import {Quadtree} from "../quadtree.js"
import {Oracle} from "../oracle/oracle.js"
import {v3} from "@benev/toolbox/x/utils/v3.js"
import {makeGround} from "../landscape/ground.js"
import {makeTheater} from "../theater/theater.js"
import {stopwatch} from "../toolbox/stopwatch.js"
import {computeDiff} from "../utils/compute-diff.js"
import {makeCamera} from "../cameras/spectator-camera.js"
import {GroundMesh} from "@babylonjs/core/Meshes/groundMesh.js"
import {makeCamPosDisplay} from "../toolbox/make-cam-pos-display.js"
import {changeMeshResolution} from "../utils/change-mesh-resolution.js"
import {DirectionalLight} from "@babylonjs/core/Lights/directionalLight.js"
import {r as makeRandomToolkit, seed} from "@benev/toolbox/x/utils/randomly.js"

// TODO the actuator's only job is to "draw" the world as described by the
// oracle, efficiently, into a babylon scene.
export function makeActuator({
		oracle
	}: {
		oracle: Oracle
	}) {

	const theater = makeTheater()
	const state = theater.slidersState
	const {nubContext} = theater
	// TODO camera should be moved out of actuator,
	// it's probably it's own system altogether, outside of
	// the actuator, and even outside the theater
	const {
		camera,
		camBaseParent,
		updateTargetHeight,
		smoothUpdateForCameraHeight
	} = makeCamera({
		theater,
		sampleHeight: oracle.sampleHeight,
		nubContext
	})

	const cameraPosDisplay = makeCamPosDisplay({
		getCameraPos() {
			return camBaseParent.position
		}
	})


	return {
		theater,
		cameraPosDisplay,

		// TODO this is the core of the actuator, let's clean this up
		// and make it beautiful
		async initialize() {
			const stopwatchForSetups = stopwatch("setups")

			const mapSize = 50
			const cliffSlopeFactor = 0
			const randomly = makeRandomToolkit(seed())

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

		const addMesh = async (node: Quadtree, c: string) => {
			const {x, y, z, w} = node.boundary
			return await makeGround({
					theater,
					mapSize: w,
					resolution: state.meshResolution,
					terrainGenerator: oracle,
					cliffSlopeFactor,
					normalStrength: 1,
					// groundShaderUrl: "/assets/shader10.json",
					groundShaderUrl: "https://dl.dropbox.com/s/gp5yabh4zjpi7iz/terrain-shader-10.json",
					position: {
						x: x,
						z: z,
						y: y
					},
					c,
				})
			}

			const meshes: {
				[key: string]: Promise<GroundMesh>
			} = {}
			let prev = <Quadtree[]>[]
			const boundary = new Node({x:0, z: 0, y:0, w: state.boundary, h:50, center: [0, 0, 0]})
			const qt = new Quadtree(boundary, undefined)
			camera.position.y = 50

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
							meshes[c] = addMesh(node, c)
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
