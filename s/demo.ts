
import {makeTerrarium} from "./main.js"

const world = makeTerrarium()

document.body.appendChild(world.theater.canvas)
;(<any>window).theater = world.theater

world.initialize()
	.then(() => console.log("🗿 done"))
	.catch(error => console.error(error))
