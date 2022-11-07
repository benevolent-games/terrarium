
import {CursorIcon} from "../cursor-types.js"

export function cursorIconBeta(): CursorIcon {
	// bootstrap icon "cursor-fill"
	// mit licensed
	// https://github.com/twbs/icons/blob/main/LICENSE.md
	const size = 48
	const image = new Image(size, size)
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="${size}px" height="${size}px" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16"><g transform="rotate(-90 8 8)"><path fill="white" stroke="black" d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694L.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z"/></g></svg>`
	image.src = `data:image/svg+xml;utf8,${svg}`
	return {
		image,
		offset: {
			top: -6,
			left: -7,
		},
	}
}
