
// import "@babylonjs/core/Materials/standardMaterial.js"
// import "@babylonjs/core/Lights/Shadows/index.js"
// import "@babylonjs/loaders/glTF/2.0/index.js"
// import "@babylonjs/core/Culling/ray.js"

// import {makeHand} from "./hand/hand.js"
// import {easing} from "./toolbox/easing.js"
// import {spawnBox} from "./hand/spawn-box.js"
// import {makeCursor} from "./cursor/cursor.js"
// import {makeGround} from "./landscape/ground.js"
// import {makeTheater} from "./theater/theater.js"
// import {makeNavigator} from "./units/navigator.js"
// import {makeSettings} from "./settings/settings.js"
// import {setupLighting} from "./landscape/lighting.js"
// import {makeWorldContainer} from "./world/container.js"
// import {makeRandomToolkit} from "./toolbox/randomly.js"
// import {makeAerialCamera} from "./cameras/aerial-camera.js"
// import {sprinkleProps} from "./landscape/sprinkle-props.js"
// import {cursorIconBeta} from "./cursor/icons/cursor-icon-beta.js"
// import {setupFullscreenHandler} from "./world/setup-fullscreen.js"
// import {makeOracle} from "./oracle/oracle.js"
// import {makeInputTracker, nameForMouseButton} from "./inputs/input-tracker.js"

// export function makeRtsWorld() {
// 	const {container, wirePartsUpToDom} = makeWorldContainer()
// 	const theater = makeTheater()
// 	const settings = makeSettings()
// 	const inputs = makeInputTracker(container)
// 	const cursor = makeCursor({
// 		insetBoundary: 5,
// 		icon: cursorIconBeta(),
// 		settings: settings.readable,
// 		onLocked: () => container.setAttribute("data-locked", ""),
// 		onUnlocked: () => container.removeAttribute("data-locked"),
// 	})

// 	wirePartsUpToDom({
// 		theater,
// 		cursor,
// 	})

// 	inputs.listeners.keydown.add(
// 		setupFullscreenHandler(container)
// 	)

// 	return {
// 		container,
// 		settings,
// 		theater,
// 		cursor,
// 		async initialize() {
// 			const mapSize = 3000
// 			const cliffSlopeFactor = 0.4
// 			const randomly = makeRandomToolkit()
// 			let sampleHeight = (x: number, y: number) => 0

// 			makeAerialCamera({
// 				theater,
// 				cursor,
// 				inputs,
// 				mapSize,
// 				radius: {
// 					initial: 100,
// 					min: 25,
// 					max: 500,
// 				},
// 				sensitivity: {
// 					wheel: 0.2,
// 				},
// 				sampleHeight: (x, y) => sampleHeight(x, y),
// 			})

// 			const terrainGenerator = makeOracle({
// 				randomly,
// 				treeDensityScale: 200,
// 				layers: [
// 					{scale: 800, amplitude: 100, ease: v => easing.exponential(v * 0.7)},
// 					{scale: 400, amplitude: 60, ease: easing.sine},
// 					{scale: 200, amplitude: 20, ease: easing.sine},
// 				],
// 			})
// 			sampleHeight = terrainGenerator.sampleHeight

// 			// const ground = await makeGround({
// 			// 	theater,
// 			// 	mapSize,
// 			// 	resolution: 512,
// 			// 	terrainGenerator,
// 			// 	cliffSlopeFactor,
// 			// 	normalStrength: 1,
// 			// 	groundShaderUrl: "https://dl.dropbox.com/s/gp5yabh4zjpi7iz/terrain-shader-10.json",
// 			// })

// 			const navigator = makeNavigator({
// 				mapSize,
// 				resolution: 256,
// 				cliffSlopeFactor,
// 				theater,
// 				terrainGenerator,
// 			})

// 			// const unit = makeUnit({
// 			// 	terrainGenerator,
// 			// 	theater,
// 			// })

// 			const hand = makeHand({theater, cursor, ground})
// 			inputs.listeners.mousedown.add(event => {
// 				const name = nameForMouseButton(event.button)
// 				if (name === "mouse_primary" || name === "mouse_secondary") {
// 					const position = hand.pickPointOnGround()
// 					if (position)
// 						spawnBox({
// 							scene: theater.scene,
// 							size: 5,
// 							position,
// 							color: [1, 0, 0],
// 							unlit: true,
// 						})
// 				}
// 			})

// 			const {shadowControl} = setupLighting({
// 				theater,
// 				sun: {
// 					direction: [-1, -1, -1],
// 					distance: 100,
// 					intensity: 1.5,
// 				},
// 				shadows: undefined,
// 			})

// 			await sprinkleProps({
// 				theater,
// 				mapSize,
// 				randomly,
// 				shadowControl,
// 				cliffSlopeFactor,
// 				terrainGenerator,
// 				forestAssetsUrl: "https://dl.dropbox.com/s/zolibuhu0vqyhua/forestAssetPack3.glb",
// 				treeDetails: {
// 					numberOfTrees: 256,
// 					spaceBetweenTrees: 7,
// 					maxTreePlantingAttempts: 50_000,
// 					randomizationRanges: {
// 						scale: {min: 0.5, max: 1.5},
// 						heightAdjustment: {min: -1, max: 5},
// 					},
// 				},
// 			})

// 			theater.start()
// 		},
// 	}
// }
