
import {makeTerrarium} from "./main.js"
import {getElements, registerElements} from "@benev/toolbox/x/main.js"

registerElements(getElements())

const world = makeTerrarium()
const wrapper = document.createElement("div")
wrapper.classList.add("wrapper")
wrapper.style.display = "flex"
const firstColumn = document.createElement("div")
const secondColumn = document.createElement("div")
document.body.appendChild(world.theater.canvas)
document.body.appendChild(wrapper)
document.body.appendChild(world.slider)

wrapper.appendChild(firstColumn)
wrapper.appendChild(secondColumn)

secondColumn.appendChild(world.levelOfDetailSlider)
secondColumn.appendChild(world.boundarySlider)
secondColumn.appendChild(world.workloadBudgetSlider)
firstColumn.appendChild(world.settings.element)
firstColumn.appendChild(world.frameRateDisplay)
firstColumn.appendChild(world.cameraPosDisplay)
firstColumn.appendChild(world.gpuFrameTimeCounter)
firstColumn.appendChild(world.frameTimeCounter)
firstColumn.appendChild(world.drawTimeCounter)
firstColumn.appendChild(world.interFrameCounter)
firstColumn.appendChild(world.cameraRenderTimeCounter)
firstColumn.appendChild(world.activeMeshesEvaluationTimeCounter)
;(<any>window).theater = world.theater

world.initialize()
	.then(() => console.log("🗿 done"))
	.catch(error => console.error(error))
