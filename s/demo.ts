
import {makeRtsWorld} from "./rts-world.js"

const world = makeRtsWorld()

document.body.appendChild(world.container)
document.body.appendChild(world.settings.element)
;(<any>window).theater = world.theater

world.initialize()
	.then(() => console.log("🗿 done"))
	.catch(error => console.error(error))
