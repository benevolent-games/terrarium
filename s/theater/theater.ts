
import {BenevTheater} from "@benev/toolbox/x/babylon/theater/element.js"
import {makeSliders} from "../editor-ui/make-slider.js"

export type Theater = ReturnType<typeof makeTheater>

export function makeTheater() {
	const benevTheater = <BenevTheater>document.querySelector("benev-theater")
	const {nubContext, babylon: {resize, start, stop, renderLoop, scene, engine, canvas}} = benevTheater
	const {sliders, slidersState} = makeSliders()
	canvas.className = "theater"

	benevTheater.settings.addRenderer(sliders)

	return {
		nubContext,
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
