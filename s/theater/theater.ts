
import "@babylonjs/core/Rendering/depthRendererSceneComponent.js"

import {Color4} from "@babylonjs/core/Maths/math.color.js"
import {DepthRenderer} from "@babylonjs/core/Rendering/depthRenderer.js"
import {BenevTheater} from "@benev/toolbox/x/babylon/theater/element.js"
import {makeSliders} from "../editor-ui/make-slider.js"

export type Theater = ReturnType<typeof makeTheater>

export function makeTheater() {
	const benevTheater = <BenevTheater>document.createElement("benev-theater")
	const canvas = benevTheater.babylon.canvas
	canvas.className = "theater"
	const {resize, start, stop, renderLoop, scene, engine} = benevTheater.babylon
	const {sliders, slidersState} = makeSliders()

	benevTheater.settings.addRenderer(sliders)

	scene.onPointerDown = evnt => {
		if(evnt.button === 0) engine.enterPointerlock();
		if(evnt.button === 1) engine.exitPointerlock();
	}

	const renderer = new DepthRenderer(scene)
	renderer.enabled = true

	scene.clearColor = new Color4(62 / 255, 129 / 255, 186 / 255, 1)
	;(<any>window).engine = engine
	
	// scene.performancePriority = 2

	return {
		slidersState,
		benevTheater,
		canvas,
		scene,
		engine,
		renderLoop,
		resize,
		start,
		stop,
	}
}
