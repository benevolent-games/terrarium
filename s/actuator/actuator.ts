
import "@babylonjs/core/Collisions/collisionCoordinator.js"
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
import {makeSpectatorCamera} from "../cameras/spectator-camera.js"
import {sprinkleNewProps} from "../landscape/sprinkle-new-props.js"
import {makeFramerateDisplay} from "../toolbox/make-framerate-display.js"
import {stopwatch} from "../toolbox/stopwatch.js"
import {v3} from "../toolbox/v3.js"
import {DirectionalLight} from "@babylonjs/core/Lights/directionalLight.js"

export function makeActuator({
		oracle
	}: {
		oracle: Oracle
	}) {

	const settings = makeSettings()
	const theater = makeTheater()
	const frameRateDisplay = makeFramerateDisplay({
		getFramerate() {
			return theater.engine.getFps()
		},
	})

	function resizeAll() {
		theater.onresize()
	}
	window.addEventListener("resize", resizeAll)
	document.addEventListener("fullscreenchange", resizeAll)
	setTimeout(resizeAll, 0)

	return {
		theater,
		settings,
		frameRateDisplay,
		async initialize() {
			const stopwatchForSetups = stopwatch("setups")

			const mapSize = 500
			const cliffSlopeFactor = 0.4
			const randomly = makeRandomToolkit()

			const {updateTargetHeight, smoothUpdateForCameraHeight} = makeSpectatorCamera({
				theater,
				sampleHeight: oracle.sampleHeight
			})

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

			await makeGround({
				theater,
				mapSize,
				resolution: 512,
				terrainGenerator: oracle,
				cliffSlopeFactor,
				normalStrength: 1,
				// groundShaderUrl: "/assets/shader10.json",
				groundShaderUrl: "https://dl.dropbox.com/s/gp5yabh4zjpi7iz/terrain-shader-10.json",
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
