import {V3} from "@benev/toolbox/x/utils/v3.js"
import {Boundary} from "./types/boundary.js"

export class Node {
	x: number
	z: number
	y: number
	w: number
	h: number
	center: V3

	constructor({x, z, y, w, h, center}: Boundary) {
		this.x = x
		this.z = z
		this.y = y
		this.w = w
		this.h = h
		this.center = center
	}

}
