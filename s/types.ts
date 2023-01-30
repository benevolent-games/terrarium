
import {Scene} from "@babylonjs/core/scene.js"

import {V3} from "@benev/toolbox/x/utils/v3.js"
import {V2} from "@benev/toolbox/x/utils/v2.js"
import {Easing} from "@benev/toolbox/x/utils/easing.js"
// import {Engine} from "@babylonjs/core/Engines/engine.js"

export interface ArenaSpecification {
	size: V2
	heights: number[]
}

export type Vertex = {
	position: V3
	normal: V3
}

export type NoiseLayer = {
	scale: number
	amplitude: number
	ease: Easing
}
