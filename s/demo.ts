
import {makeTerrarium} from "./main.js"
import {getElements, registerElements} from "@benev/toolbox"
import {RangeSlider} from "@benev/toolbox/x/editor-ui/range-slider/element.js"

const world = makeTerrarium()

registerElements(getElements())

// const slider = document.querySelector("range-slider")
// console.log(slider)
// slider?.addEventListener("value-change", (event) => {
// 	const x = event.target as RangeSlider
// 	console.log(x.value)
// })

document.body.appendChild(world.theater.canvas)
document.body.appendChild(world.settings.element)
document.body.appendChild(world.frameRateDisplay)
document.body.appendChild(world.cameraPosDisplay)
document.body.appendChild(world.gpuFrameTimeCounter)
document.body.appendChild(world.frameTimeCounter)
document.body.appendChild(world.drawTimeCounter)
document.body.appendChild(world.interFrameCounter)
document.body.appendChild(world.cameraRenderTimeCounter)
document.body.appendChild(world.activeMeshesEvaluationTimeCounter)
;(<any>window).theater = world.theater
;(<any>window).theater = world.theater

world.initialize()
	.then(() => console.log("🗿 done"))
	.catch(error => console.error(error))
