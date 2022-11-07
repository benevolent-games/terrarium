
import {ArcRotateCamera} from "@babylonjs/core/Cameras/arcRotateCamera.js"

import {v3} from "../toolbox/v3.js"
import {Cursor} from "../cursor/cursor.js"
import {cap} from "../toolbox/numpty.js"
import {Theater} from "../theater/theater.js"
import {InputTracker} from "../inputs/input-tracker.js"

const circle = 2 * Math.PI

export function makeAerialCamera({
		theater, cursor, inputs, mapSize, radius, sensitivity, sampleHeight,
	}: {
		theater: Theater
		cursor: Cursor
		inputs: InputTracker
		mapSize: number
		radius: {
			min: number
			max: number
			initial: number
		}
		sensitivity: {
			wheel: number
		}
		sampleHeight: (x: number, y: number) => number
	}) {

	let targetRadius = radius.initial
	let targetHeight = 0
	const minimumHeightOffGround = 10

	const camera = new ArcRotateCamera(
		"cam",
		0.25 * circle,
		0.15 * circle,
		targetRadius,
		v3.toBabylon([0, targetHeight, 0]),
		theater.scene,
	)

	inputs.listeners.wheel.add(({deltaY}) => {
		targetRadius += deltaY * sensitivity.wheel
		targetRadius = cap(targetRadius, radius.min, radius.max)
	})

	function updateTargetHeight() {
		targetHeight = sampleHeight(
			camera.globalPosition.x,
			camera.globalPosition.z,
		)
	}

	function sharpUpdateForCameraHeight() {
		camera.target.y = targetHeight
	}

	function smoothUpdateForCameraHeight() {
		const currentHeight = camera.target.y
		const difference = targetHeight - currentHeight
		const fractionOfDifference = difference * 0.1
		camera.target.y += fractionOfDifference
		const floor = sampleHeight(
			camera.globalPosition.x,
			camera.globalPosition.z,
		) + minimumHeightOffGround
		if (camera.globalPosition.y < floor) {
			const underneath = floor - camera.globalPosition.y
			camera.target.y += underneath
		}
	}

	function smoothUpdateForCameraZoom() {
		const difference = targetRadius - camera.radius
		const fractionOfDifference = difference * 0.1
		camera.radius += fractionOfDifference
	}

	updateTargetHeight()
	theater.renderLoop.add(smoothUpdateForCameraHeight)
	// theater.renderLoop.add(sharpUpdateForCameraHeight)
	theater.renderLoop.add(smoothUpdateForCameraZoom)

	function isPressingPanButton() {
		return inputs.get("mouse_tertiary").pressed
	}

	const boundaryA = -(mapSize / 2)
	const boundaryB = mapSize / 2
	cursor.listeners.mousemove.add(({movementX, movementY}) => {
		if (isPressingPanButton()) {
			camera.target.x = cap(
				camera.target.x + (movementX * (camera.radius / 200)),
				boundaryA,
				boundaryB,
			)
			camera.target.z = cap(
				camera.target.z - (movementY * (camera.radius / 200)),
				boundaryA,
				boundaryB,
			)
			updateTargetHeight()
		}
	})

	theater.renderLoop.add(() => {
		if (!isPressingPanButton()) {
			const {canvasWidth, canvasHeight, x, y} = cursor.getCoordinates()
			const px = x / canvasWidth
			const py = y / canvasHeight
			let movementX = 0
			let movementY = 0

			if (py > 0.95)
				movementY -= 1
			else if (py < 0.05)
				movementY += 1

			if (px > 0.95)
				movementX += 1
			else if (px < 0.05)
				movementX -= 1

			if (movementY !== 0)
				camera.target.z = cap(
					camera.target.z - (20 * movementY * (camera.radius / 200)),
					boundaryA,
					boundaryB,
				)

			if (movementX !== 0)
				camera.target.x = cap(
					camera.target.x - (20 * movementX * (camera.radius / 200)),
					boundaryA,
					boundaryB,
				)

			updateTargetHeight()
		}
	})

	return camera
}
