
import {makeTerrarium} from "./main.js"
import {getElements, registerElements} from "@benev/toolbox/x/main.js"

registerElements(getElements())
const world = makeTerrarium()

document.body.appendChild(world.slider)
document.body.appendChild(world.theater.canvas)
document.body.appendChild(world.settings.element)
document.body.appendChild(world.slider)
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
