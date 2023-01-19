import {Vector3} from "@babylonjs/core/Maths/math.js"
import {v3, V3} from "./toolbox/v3.js"

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
	levelOfDetail: number
	isLeafNode: boolean
	parent: Quadtree | undefined
	workQueue: Array<Function>
	numberOfCalculationsDone: number
	currentChunk: Quadtree | undefined

	constructor(
			boundary: Boundary,
			distanceThresholdFromMidPoint: number,
			parent: Quadtree | undefined
		) {
		this.boundary = boundary
		this.children = []
		this.divided = false,
		this.threshold = distanceThresholdFromMidPoint
		this.levelOfDetail = this.getLevelOfDetail(parent)
		this.isLeafNode = !this.divided
		this.parent = parent
		this.workQueue = []
		this.numberOfCalculationsDone = 0
		this.currentChunk = undefined
	}

	getLevelOfDetail(parent: Quadtree | undefined) {
		if (parent) {
			return parent.levelOfDetail + 1
		} else return 0
	}

	_subdivide(node: Quadtree): Quadtree[] {
		const {x, y, w, h, z} = node.boundary
		node.divided = true
		node.isLeafNode = false
		
		const topRightValues = {
			x: x + w / 4,
			z: z - w / 4,
			y: y,
			w: w / 2,
			h: h / 2,
			center: <V3>[x + w / 2, y - h / 4, z]
		}
		const bottomRightValues = {
			x: x + w / 4,
			z: z + w / 4,
			y: y,
			w: w / 2,
			h: h / 2,
			center: <V3>[x + w / 2, y + h / 4, z + w / 2]
		}
		const bottomLeftValues = {
			x: x - w / 4,
			z: z + w / 4,
			y: y,
			w: w / 2,
			h: h / 2,
			center: <V3>[x, y + h / 4, z + w / 2]
		}
		const topLeftValues = {
			x: x - w / 4,
			z: z - w / 4,
			y: y,
			w: w / 2,
			h: h / 2,
			center: <V3>[x, y - h / 4, z]
		}
		const topRight = new Node({...topRightValues})
		const bottomRight = new Node({...bottomRightValues})
		const bottomLeft = new Node({...bottomLeftValues})
		const topLeft = new Node({...topLeftValues})

		return [new Quadtree(topRight, 10, node),
		new Quadtree(topLeft, 10, node),
		new Quadtree(bottomLeft, 10, node),
		new Quadtree(bottomRight, 10, node)]
	}

	getCurrentNode(cameraPosition: Vector3): Quadtree | undefined {
		if (this.contains(this.boundary, cameraPosition)) {
			for (const child of this.children) {
				const current = child.getCurrentNode(cameraPosition)
				if (current) {
					return current
				}
			}
			return this
		} else return undefined
	}

	getChildren() {
		const leafNodes: Quadtree[] = []
		this._getChildren(this, leafNodes)
		return leafNodes
	}

	contains(boundary: Boundary, cords: Vector3) {
		if (boundary) {
			const {w, x, z} = boundary
			return (
			cords.x >= x - w / 2 &&
			cords.x <= x + w / 2 &&
			cords.z >= z - w / 2 &&
			cords.z <= z + w / 2)
		
		} else return false
		
	}

	calculateLevelOfDetail<T, N extends number>({cameraPosition, levelsOfDetail, qt, maxNumberOfCalculationsPerFrame = 30}: {
		cameraPosition: V3,
		levelsOfDetail: Array<number>,
		qt: Quadtree
		maxNumberOfCalculationsPerFrame?: number
	}) {
		let currentChunkChecker = qt.getCurrentNode(new Vector3(cameraPosition[0], cameraPosition[1], cameraPosition[2]))
		if (currentChunkChecker) {
			if (qt.currentChunk != currentChunkChecker) {
				if (this.isLeafNode) {
					const distanceToLeafNode = v3.distance(cameraPosition, [this.boundary.x, 0, this.boundary.z])
					const distanceToParent = this.parent ? v3.distance(cameraPosition, [this.parent?.boundary.x, 0, this.parent?.boundary.z]) : undefined
					for (let i = 0; i < levelsOfDetail.length; i++) {
						if (this.levelOfDetail == i) {
							if (distanceToLeafNode < levelsOfDetail[i]) {
								qt.workQueue.push(() => this.subdivide())
							}
							else if (distanceToParent && distanceToParent > levelsOfDetail[i - 1]) {
								qt.workQueue.push(() => this.undivide())
							}
						}
					}
				} else {
					for (const c of this.children) {
						c.calculateLevelOfDetail({cameraPosition, levelsOfDetail, qt})
					}
				}
			}
		}
		return {
			process: () => {
				qt.currentChunk = currentChunkChecker
				qt.processQueue(qt.workQueue, qt, maxNumberOfCalculationsPerFrame)
				qt.numberOfCalculationsDone = 0
			}
		}
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

	subdivide() {
		this.children = this._subdivide(this)
	}

	undivide() {
		this.parent!.children = []
		this.parent!.divided = false
		this.parent!.isLeafNode = true
	}

	processQueue(workQueue: Array<Function>, qt: Quadtree, maxCalculations: number) {
		while (workQueue.length && qt.numberOfCalculationsDone < maxCalculations) {
			let calculate = workQueue.shift() as Function
			calculate()
			qt.numberOfCalculationsDone++
		}
	}
}

function makeKey(node: Quadtree) {
	const {x, y, z} = node.boundary
	return `${x}_${y}_${z}`
}

export function computeDiff(prevLayout: Quadtree[], newLayout: Quadtree[]) {
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
	const added = <X>{}
	const removed = <X>{}
	
	for (const key in newDict) {
		if(!(key in prevDict))
			added[key] = newDict[key]
	}
	for (const key in prevDict) {
		if(!(key in newDict))
			removed[key] = newDict[key]
	}

	return {added, removed}
}
