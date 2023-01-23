
import {getElements, registerElements} from "@benev/toolbox"

export function makeSliders(boundary: number, levelOfDetailValue: number, workloadBudgetValue: number) {

	const levelOfDetailSlider = document.createElement("range-slider")
	levelOfDetailSlider.setAttribute("label", "Level of detail")
	levelOfDetailSlider.setAttribute("initial-value", `${levelOfDetailValue}`)
	levelOfDetailSlider.setAttribute("step", "1")

	const workloadBudgetSlider = document.createElement("range-slider")
	workloadBudgetSlider.setAttribute("label", "Workload budget")
	workloadBudgetSlider.setAttribute("initial-value", `${workloadBudgetValue}`)
	workloadBudgetSlider.setAttribute("step", "1")
	workloadBudgetSlider.setAttribute("min", "1")
	workloadBudgetSlider.setAttribute("max", "200")

	const boundarySlider = document.createElement("range-slider")
	boundarySlider.setAttribute("initial-value", `${boundary}`)
	boundarySlider.setAttribute("min", `${boundary}`)
	boundarySlider.setAttribute("max", "102400")
	boundarySlider.setAttribute("step", `${boundary}`)
	boundarySlider.setAttribute("label", "Boundary")

	return {levelOfDetailSlider, workloadBudgetSlider, boundarySlider}
}
