
import {Cursor} from "../cursor/cursor.js"
import {Theater} from "../theater/theater.js"

export function makeWorldContainer() {

	const container = document.createElement("div")
	container.className = "container"
	container.tabIndex = 0

	return {
		container,
		wirePartsUpToDom({cursor, theater}: {
				cursor: Cursor
				theater: Theater
			}) {
			container.append(theater.canvas, cursor.canvas)
			container.onclick = cursor.lock
			container.onmousemove = cursor.onmousemove
			function resizeAll() {
				cursor.onresize()
				theater.onresize()
			}
			window.addEventListener("resize", resizeAll)
			document.addEventListener("fullscreenchange", resizeAll)
			setTimeout(resizeAll, 0)
		},
	}
}
