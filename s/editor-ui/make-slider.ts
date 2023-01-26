
import {snapstate} from "@chasemoskal/snapstate"
import {RangeSlider} from "@benev/toolbox/x/editor-ui/range-slider/element.js"

export function makeSliders() {

	const snap = snapstate({
		levelOfDetail: 5,
		workLoad: 40,
		boundary: 3200,
	})

	const levelOfDetailSlider = document.createElement("range-slider")
	levelOfDetailSlider.setAttribute("label", "Level of detail")
	levelOfDetailSlider.setAttribute("min", "1")
	levelOfDetailSlider.setAttribute("initial-value", `${snap.state.levelOfDetail}`)
	levelOfDetailSlider.setAttribute("step", "1")

	const workloadBudgetSlider = document.createElement("range-slider")
	workloadBudgetSlider.setAttribute("label", "Workload budget")
	workloadBudgetSlider.setAttribute("initial-value", `${snap.state.workLoad}`)
	workloadBudgetSlider.setAttribute("step", "1")
	workloadBudgetSlider.setAttribute("min", "1")
	workloadBudgetSlider.setAttribute("max", "400")

	const boundarySlider = document.createElement("range-slider")
	boundarySlider.setAttribute("initial-value", `${snap.state.boundary}`)
	boundarySlider.setAttribute("min", `${snap.state.boundary}`)
	boundarySlider.setAttribute("max", "102400")
	boundarySlider.setAttribute("step", `${snap.state.boundary}`)
	boundarySlider.setAttribute("label", "Boundary")

	levelOfDetailSlider.addEventListener("valuechange", (event) => {
		const x = event.target as RangeSlider
		snap.state.levelOfDetail = Number(x.value)
	})
	workloadBudgetSlider.addEventListener("valuechange", (event) => {
		const x = event.target as RangeSlider
		snap.state.workLoad = Number(x.value)
	})
	boundarySlider.addEventListener("valuechange", (event) => {
		const x = event.target as RangeSlider
		snap.state.boundary = Number(x.value)
	})

	return {
		sliders: {
			boundarySlider,
			workloadBudgetSlider,
			levelOfDetailSlider,
		},
		state: snap.state
	}
}
