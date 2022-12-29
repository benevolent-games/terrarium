import { V2, v2 } from "./toolbox/v2.js"

const MIN_NODE_SIZE = 3
export type Boundary = {
	x: number
	y: number
	w: number
	h: number
	center: V2
}

export class Node {
	boundary: Boundary

	constructor(boundary: Boundary) {
		this.boundary = boundary
	}
}

export type QuadNode = {
	boundary: Boundary
	children: QuadNode[]
}


export class Quadtree {
	root: QuadNode
	threshold: number


	constructor(
			boundary: Boundary,
			distanceThresholdFromMidPoint: number
		) {

		this.root = {
			boundary,
			children: []
		}
		this.threshold = distanceThresholdFromMidPoint
	}

	subdivide(node: QuadNode): QuadNode[] {
		const {x, y, w, h} = node.boundary
		const topRightValues = {
			x: x+w/2,
			y: y-h/2,
			w: w/2,
			h: h/2,
			center: <V2>[x+w/2,y-h/2]
		}
		const bottomRightValues = {
			x: x+w/2,
			y: y+h/2,
			w: w/2,
			h: h/2,
			center: <V2>[x+w/2,y+h/2]
		}
		const bottomLeftValues = {
			x: x-w/2,
			y: y+h/2,
			w: w/2,
			h: h/2,
			center: <V2>[x-w/2,y+h/2]
		}
		const topLeftValues = {
			x: x-w/2,
			y: y-h/2,
			w: w/2,
			h: h/2,
			center: <V2>[x-w/2,y-h/2]
		}
		const topRight = new Node({...topRightValues})
		const bottomRight = new Node({...bottomRightValues})
		const bottomLeft = new Node({...bottomLeftValues})
		const topLeft = new Node({...topLeftValues})

		return [topRight, topLeft, bottomLeft, bottomRight].map(
			c => ({
				boundary: c.boundary,
				children: []
			})
		)
	}

	getChildren() {
		const leafNodes: QuadNode[] = []
		this._getChildren(this.root, leafNodes)
		return leafNodes
	}

	_getChildren(node: QuadNode, target: QuadNode[]) {
		if (node.children.length === 0) {
			target.push(node)
			return
		}
		for (const child of node.children) {
			this._getChildren(child, target)
		}
	}

	insert(camPosition: V2) {
		this._insert(this.root, camPosition)
	}

	_insert(child: QuadNode, camPosition: V2) {
		const distance = v2.distance(camPosition, child.boundary.center)
		if (distance < this.threshold && child.boundary.w > MIN_NODE_SIZE) {
			child.children = this.subdivide(child)

			for (const c of child.children) {
				this._insert(c, camPosition)
			}
		}
	}
}

function makeKey(node: Node) {
	const {x, y} = node.boundary
	return `${x}_${y}`
}

export function computeDiff(prevLayout: QuadNode[], newLayout: QuadNode[]) {
	// debugger
	const layoutIsThesame = prevLayout.join() === newLayout.join()
	if(layoutIsThesame) return undefined
	const prevDict: {[key: string]: QuadNode} = {}
	const newDict: {[key: string]: QuadNode} = {}
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
