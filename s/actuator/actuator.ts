
import "@babylonjs/core/Collisions/collisionCoordinator.js"
import "@babylonjs/core/Engines/Extensions/engine.query.js"
import "@babylonjs/core/Materials/standardMaterial.js"
import "@babylonjs/core/Lights/Shadows/index.js"
import "@babylonjs/loaders/glTF/2.0/index.js"
import "@babylonjs/core/Culling/ray.js"

import {Oracle} from "../oracle/oracle.js"
import {makeGround} from "../landscape/ground.js"
import {makeTheater} from "../theater/theater.js"
import {makeSettings} from "../settings/settings.js"
import {setupLighting} from "../landscape/lighting.js"
import {makeRandomToolkit} from "../toolbox/randomly.js"
import {sprinkleProps} from "../landscape/sprinkle-props.js"
import {makeCounters} from "../toolbox/make-time-counter.js"
import {makeSpectatorCamera} from "../cameras/spectator-camera.js"
import {sprinkleNewProps} from "../landscape/sprinkle-new-props.js"
import {makeFramerateDisplay} from "../toolbox/make-framerate-display.js"
import {stopwatch} from "../toolbox/stopwatch.js"
import {v3} from "../toolbox/v3.js"
import {DirectionalLight} from "@babylonjs/core/Lights/directionalLight.js"
import {EngineInstrumentation} from "@babylonjs/core/Instrumentation/engineInstrumentation.js"
import {SceneInstrumentation} from "@babylonjs/core/Instrumentation/sceneInstrumentation.js"
import {computeDiff, Node, Quadtree} from "../quadtree.js"
import {Color3} from "@babylonjs/core/Maths/math.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {StandardMaterial} from "@babylonjs/core/Materials/standardMaterial.js"
import {GroundMesh} from "@babylonjs/core/Meshes/groundMesh.js"
import {makeCamPosDisplay} from "../toolbox/make-cam-pos-display.js"
import {makeSliders} from "../editor-ui/make-slider.js"
import {RangeSlider} from "@benev/toolbox/x/editor-ui/range-slider/element.js"
export function makeActuator({
		oracle
	}: {
		oracle: Oracle
	}) {

	let boundaryValue = 3200
	let levelOfDetailValue = 5
	let workloadBudgetValue = 40

	const {levelOfDetailSlider, workloadBudgetSlider, boundarySlider} = makeSliders(boundaryValue, levelOfDetailValue, workloadBudgetValue)

	levelOfDetailSlider.addEventListener("valuechange", (event) => {
		const x = event.target as RangeSlider
		levelOfDetailValue = Number(x.value)
	})
	workloadBudgetSlider.addEventListener("valuechange", (event) => {
		const x = event.target as RangeSlider
		workloadBudgetValue = Number(x.value)
	})
	boundarySlider.addEventListener("valuechange", (event) => {
		const x = event.target as RangeSlider
		boundaryValue = Number(x.value)
	})

	const settings = makeSettings()
	const theater = makeTheater()
	const {camera, updateTargetHeight, smoothUpdateForCameraHeight} = makeSpectatorCamera({
		theater,
		sampleHeight: oracle.sampleHeight
	})
	const frameRateDisplay = makeFramerateDisplay({
		getFramerate() {
			return theater.engine.getFps()
		},
	})
	const cameraPosDisplay = makeCamPosDisplay({
		getCameraPos() {
			return camera.position
		}
	})

	const engineInstrumentation = new EngineInstrumentation(theater.engine)
	engineInstrumentation.captureGPUFrameTime = true
	engineInstrumentation.captureShaderCompilationTime = true

	const sceneInstrumentation = new SceneInstrumentation(theater.scene)
	sceneInstrumentation.captureFrameTime = true
	sceneInstrumentation.captureRenderTime = true
	sceneInstrumentation.capturePhysicsTime = true
	sceneInstrumentation.captureInterFrameTime = true
	sceneInstrumentation.captureCameraRenderTime = true
	sceneInstrumentation.captureActiveMeshesEvaluationTime = true

	const {
			gpuFrameTimeCounter,
			frameTimeCounter,
			drawTimeCounter,
			interFrameCounter,
			cameraRenderTimeCounter,
			activeMeshesEvaluationTimeCounter
		} = makeCounters({
		getGpuTime: () => {
			return (engineInstrumentation.gpuFrameTimeCounter.current * 0.000001)
				.toFixed(2)
		},
		getFrameTime() {
			return (sceneInstrumentation.frameTimeCounter.current).toFixed(2)
		},
		getDrawTime() {
			return (sceneInstrumentation.drawCallsCounter.current).toFixed(2)
		},
		getPhysicsTime() {
			return (sceneInstrumentation.physicsTimeCounter.current).toFixed(2)
		},
		getInterFrameTime() {
			return (sceneInstrumentation.interFrameTimeCounter.current).toFixed(2)
		},
		getCameraRenderTime() {
			return (sceneInstrumentation.cameraRenderTimeCounter.current).toFixed(2)
		},
		getActiveMeshesEvaluationTime() {
			return (sceneInstrumentation.activeMeshesEvaluationTimeCounter.current).toFixed(2)
		},
	})

	function resizeAll() {
		theater.onresize()
	}
	window.addEventListener("resize", resizeAll)
	document.addEventListener("fullscreenchange", resizeAll)
	setTimeout(resizeAll, 0)

	return {
		levelOfDetailSlider,
		workloadBudgetSlider,
		boundarySlider,
		theater,
		settings,
		gpuFrameTimeCounter,
		frameTimeCounter,
		drawTimeCounter,
		interFrameCounter,
		cameraRenderTimeCounter,
		activeMeshesEvaluationTimeCounter,
		frameRateDisplay,
		cameraPosDisplay,
		async initialize() {
			const stopwatchForSetups = stopwatch("setups")

			const mapSize = 50
			const cliffSlopeFactor = 0
			const randomly = makeRandomToolkit()

			let gravityEnabled = settings.readable.enableGravityAndCollisions

			settings.onSettingsChange.add((settinngs) => {
				gravityEnabled = settinngs.enableGravityAndCollisions
			})

			theater.renderLoop.add(() => {
				updateTargetHeight(gravityEnabled)
				smoothUpdateForCameraHeight(gravityEnabled)
			})

			stopwatchForSetups.log()
			const stopwatchForGround = stopwatch("ground")

		const addMesh = async (node: Quadtree, c: string) => {
			const {x, y, z, w} = node.boundary
			return await makeGround({
					theater,
					mapSize: w,
					resolution: 30,
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
			const boundary = new Node({x:0, z: 0, y:0, w: boundaryValue, h:50, center: [0, 0, 0]})
			const qt = new Quadtree(boundary, 10, undefined)
			camera.position.y = 50

			theater.renderLoop.add(async () => {
				const {x, z, y} = camera.position
				qt.changeBoundary(boundaryValue)
					qt.calculateLevelOfDetail({
						cameraPosition: [x, y, z],
						levelsOfDetail: levelOfDetailValue,
						qt,
						maxNumberOfCalculationsPerFrame: workloadBudgetValue,
					}).process()

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


			// await makeGround({
			// 	theater,
			// 	mapSize,
			// 	resolution: 512,
			// 	terrainGenerator: oracle,
			// 	cliffSlopeFactor,
			// 	normalStrength: 1,
			// 	// groundShaderUrl: "/assets/shader10.json",
			// 	groundShaderUrl: "https://dl.dropbox.com/s/gp5yabh4zjpi7iz/terrain-shader-10.json",
			// })

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

			// const stopwatchForLighting = stopwatch("lighting")

			// const {shadowControl} = setupLighting({
			// 	theater,
			// 	sun: {
			// 		direction: [-1, -1, -1],
			// 		distance: 100,
			// 		intensity: 5,
			// 	},
			// 	shadows: {
			// 		softness: 20
			// 	}
			// })

			// stopwatchForLighting.log()
			// const stopwatchForSprinkling = stopwatch("sprinkling")

			// await sprinkleNewProps({
			// 	theater,
			// 	mapSize,
			// 	randomly,
			// 	shadowControl,
			// 	cliffSlopeFactor,
			// 	terrainGenerator: oracle,
			// 	// forestAssetsUrl: "/assets/pinetrees4.glb",
			// 	forestAssetsUrl: "https://dl.dropbox.com/s/eqxip7yqps2r9fi/pinetrees4.glb",
			// 	// grassAssetsUrl: "/assets/grass.glb",
			// 	grassAssetsUrl: "https://dl.dropbox.com/s/i2s6o6de7u5vxfm/grass.glb",
			// 	treeDetails: {
			// 		numberOfTrees: 256,
			// 		spaceBetweenTrees: 7,
			// 		maxTreePlantingAttempts: 50_000,
			// 		randomizationRanges: {
			// 			scale: {min: 10.5, max: 20.5},
			// 			heightAdjustment: {min: -1, max: 2},
			// 		},
			// 	},
			// 	grassDetails: {
			// 		numberOfGrass: 200,
			// 		spaceBetweenGrass: 1,
			// 		maxGrassPlantingAttempts: 50_000,
			// 		randomizationRanges: {
			// 			scale: {min: 0.5, max: 1.5},
			// 			heightAdjustment: {min: -1, max: 4},
			// 		},
			// 	},
			// })

			// stopwatchForSprinkling.log()
			theater.start()
		}
	}

}
