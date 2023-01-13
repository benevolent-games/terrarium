import {Vector3} from "@babylonjs/core/Maths/math.js"

export function makeCamPosDisplay({getCameraPos}: {
	getCameraPos: () => Vector3
}) {

	const element = document.createElement("div")
	element.className = "camera-pos"
	setInterval(
		() => 
			element.innerHTML = `
			<div>y: ${getCameraPos().y.toFixed(0)}</div>
			<div>x: ${getCameraPos().x.toFixed(0)}</div>
			<div>z: ${getCameraPos().z.toFixed(0)}</div>
			`
		,
		100
	)
	return element
}
