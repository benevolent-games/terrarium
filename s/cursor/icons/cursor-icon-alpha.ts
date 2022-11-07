
import {CursorIcon} from "../cursor-types.js"

export function cursorIconAlpha(): CursorIcon {
	// fluent icon "cursor-20-filled"
	// mit licensed
	// https://github.com/microsoft/fluentui-system-icons/blob/master/LICENSE
	const size = 48
	const image = new Image(size, size)
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="${size}px" height="${size}px" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 20"><path fill="white" stroke="black" d="M6.636 2.287A1 1 0 0 0 5 3.059v13.998c0 .927 1.15 1.355 1.756.655l3.524-4.073a1.5 1.5 0 0 1 1.134-.518h5.592c.938 0 1.36-1.176.636-1.772L6.636 2.287Z"/></svg>`
	image.src = `data:image/svg+xml;utf8,${svg}`
	return {
		image,
		offset: {
			top: -5,
			left: -13,
		},
	}
}
