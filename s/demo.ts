
import {makeTerrarium} from "./main.js"
// import "@benev/toolbox/x/html.js"

const world = makeTerrarium()
const wrapper = document.createElement("div")
wrapper.classList.add("wrapper")

const firstColumn = document.createElement("div")
const secondColumn = document.createElement("div")
secondColumn.classList.add("sliders")

document.body.appendChild(wrapper)

wrapper.appendChild(firstColumn)
wrapper.appendChild(secondColumn)


firstColumn.appendChild(world.cameraPosDisplay)
;(<any>window).theater = world.theater

world.initialize()
	.then(() => console.log("🗿 done"))
	.catch(error => console.error(error))
