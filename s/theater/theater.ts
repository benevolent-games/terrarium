
import "@babylonjs/core/Rendering/depthRendererSceneComponent.js"

import {Scene} from "@babylonjs/core/scene.js"
import {Engine} from "@babylonjs/core/Engines/engine.js"
import {Color3, Color4} from "@babylonjs/core/Maths/math.color.js"
import {CubeTexture} from "@babylonjs/core/Materials/Textures/cubeTexture.js"
import {DepthRenderer} from "@babylonjs/core/Rendering/depthRenderer.js"

export type Theater = ReturnType<typeof makeTheater>

export function makeTheater() {
	const canvas = document.createElement("canvas")
	canvas.className = "theater"

	const engine = new Engine(canvas, true)

	const scene = new Scene(engine, {
		useGeometryUniqueIdsMap: true,
		useMaterialMeshMap: true,
	})

	scene.onPointerDown = evnt => {
		if(evnt.button === 0) engine.enterPointerlock();
		if(evnt.button === 1) engine.exitPointerlock();
	}

	const renderer = new DepthRenderer(scene)
	renderer.enabled = true

	scene.clearColor = new Color4(62 / 255, 129 / 255, 186 / 255, 1)
	;(<any>window).engine = engine
	
	// scene.performancePriority = 2
	const renderLoop = new Set<() => void>()

	return {
		canvas,
		scene,
		engine,
		renderLoop,
		onresize() {
			const {width, height} = canvas.getBoundingClientRect()
			canvas.width = width
			canvas.height = height
			engine.resize()
		},
		start() {
			engine.runRenderLoop(() => {
				for (const routine of renderLoop)
					routine()
				scene.render()
			})
		},
		stop() {
			engine.stopRenderLoop()
		},
	}
}
