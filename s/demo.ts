
import {makeTerrarium} from "./main.js"
import {getElements} from "@benev/toolbox/x/babylon/theater/get-elements.js"
import {registerElements} from "@chasemoskal/magical"

registerElements(getElements())

const world = makeTerrarium()
const wrapper = document.createElement("div")
wrapper.classList.add("wrapper")

const firstColumn = document.createElement("div")
const secondColumn = document.createElement("div")
secondColumn.classList.add("sliders")

document.body.appendChild(world.theater.canvas)
document.body.appendChild(world.theater.benevTheater)
document.body.appendChild(wrapper)

wrapper.appendChild(firstColumn)
wrapper.appendChild(secondColumn)

secondColumn.appendChild(world.levelOfDetailSlider)
secondColumn.appendChild(world.boundarySlider)
secondColumn.appendChild(world.workloadBudgetSlider)
secondColumn.appendChild(world.meshResolutionSlider)
firstColumn.appendChild(world.settings.element)
firstColumn.appendChild(world.cameraPosDisplay)
;(<any>window).theater = world.theater

world.initialize()
	.then(() => console.log("🗿 done"))
	.catch(error => console.error(error))
