
import {RangeSlider} from "@benev/toolbox/x/editor-ui/range-slider/element.js"

export function makeSlider() {

	const slider = document.createElement("range-slider")
	slider.setAttribute("label", "Rangle slider")
	slider.setAttribute("step", "1")
	return slider
}
