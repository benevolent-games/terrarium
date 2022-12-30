import {Vector3} from "@babylonjs/core/Maths/math.js"
import {v3, V3} from "./toolbox/v3.js"

const MIN_NODE_SIZE = 3
export type Boundary = {
	x: number
	z: number
	y: number
	w: number
	h: number
	center: V3
}

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

export type QuadNode = {
	boundary: Boundary
	children: Quadtree[]
	divided: boolean
}


export class Quadtree {
	threshold: number
	boundary: Boundary
	children: Quadtree[]
	divided: boolean

	constructor(
			boundary: Boundary,
			distanceThresholdFromMidPoint: number
		) {

		this.boundary = boundary
		this.children = []
		this.divided = false,
		this.threshold = distanceThresholdFromMidPoint
	}

	subdivide(node: Quadtree): Quadtree[] {
		const {x, y, w, h, z} = node.boundary
		node.divided = true
		const topRightValues = {
			x: x + w / 2,
			z: z,
			y: 0.1,
			w: w / 2,
			h: h / 2,
			center: <V3>[(x + w / 2) / 2, y - h / 4, z - w / 4]
		}
		const bottomRightValues = {
			x: x,
			z: z,
			y: 0.1,
			w: w / 2,
			h: h / 2,
			center: <V3>[(x - w / 2) / 2, y + h / 4, z - w / 4]
		}
		const bottomLeftValues = {
			x: x + w / 2,
			z: z + w / 2,
			y: 0.00001,
			w: w / 2,
			h: h / 2,
			center: <V3>[(x + w / 2) / 2, y + h / 4, z + w / 4]
		}
		const topLeftValues = {
			x: x,
			z: z + w / 2,
			y: 0.00001,
			w: w / 2,
			h: h / 2,
			center: <V3>[(x - w / 2) / 2, y - h / 4, z + w / 4]
		}
		const topRight = new Node({...topRightValues})
		const bottomRight = new Node({...bottomRightValues})
		const bottomLeft = new Node({...bottomLeftValues})
		const topLeft = new Node({...topLeftValues})

		return [new Quadtree(topRight, 10),
		new Quadtree(topLeft, 10),
		new Quadtree(bottomLeft, 10),
		new Quadtree(bottomRight, 10)]
	}
	getCurrentNode(cameraPosition: Vector3) {
		if (!this.contains(this.boundary, cameraPosition)) {
			return false
		} 
		if (this.divided) {
			console.log("divided")
			let boundary;
			this.children.map((child, i) => {
				const point = this.contains(child.boundary,cameraPosition)
				if (point) {
					console.log(child.boundary, i, "index")
					boundary = child.boundary
				}
			})
			return boundary
		} else return this.boundary
		
	}

	getChildren() {
		const leafNodes: Quadtree[] = []
		this._getChildren(this, leafNodes)
		return leafNodes
	}
	contains(boundary: Boundary, cords: Vector3) {
		if (boundary) {
			const {w, center} = boundary
		return (
			cords.x >= center[0] - w / 2 &&
			cords.x <= center[0] + w / 2 &&
			cords.z >= center[2] - w / 2 &&
			cords.z <= center[2] + w / 2
		)
		} else return false
		
	}
	_getChildren(node: Quadtree, target: Quadtree[]) {
		if (node.children.length === 0) {
			target.push(node)
			return
		}
		for (const child of node.children) {
			this._getChildren(child, target)
		}
	}

	insert(camPosition: V3) {
		this._insert(this, camPosition)
	}

	_insert(child: Quadtree, camPosition: V3) {
		const distance = v3.distance(camPosition, child.boundary.center)
		if (distance < this.threshold && child.boundary.w > MIN_NODE_SIZE) {
			child.children = this.subdivide(child)

			for (const c of child.children) {
				this._insert(c, camPosition)
			}
		}
	}
}

function makeKey(node: Quadtree) {
	const {x, y} = node.boundary
	return `${x}_${y}`
}

export function computeDiff(prevLayout: Quadtree[], newLayout: Quadtree[]) {
	// debugger
	const layoutIsThesame = prevLayout.join() === newLayout.join()
	if(layoutIsThesame) return undefined
	const prevDict: {[key: string]: Quadtree} = {}
	const newDict: {[key: string]: Quadtree} = {}
	prevLayout.forEach(chunk => {
		const key = makeKey(chunk)
		prevDict[key] = chunk
	})
	newLayout.forEach(chunk => {
		const key = makeKey(chunk)
		newDict[key] = chunk
	})
	if(!prevLayout.length) return newDict
	return dictDifference(prevDict, newDict)
}

function dictDifference<X extends {}>(prevDict: X, newDict: X) {
	const diff = <X>{}
	for (const key in newDict) {
		if(key in prevDict)
			diff[key] = prevDict[key]
	}
	return diff
}
