
import {makeTerrarium} from "./main.js"

const world = makeTerrarium()

document.body.appendChild(world.theater.canvas)
document.body.appendChild(world.settings.element)
;(<any>window).theater = world.theater

world.initialize()
	.then(() => console.log("🗿 done"))
	.catch(error => console.error(error))
