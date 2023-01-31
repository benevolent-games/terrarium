import {Boundary} from "./types/boundary.js"
import {contains} from "./utils/contains.js"
import {v3, V3} from "@benev/toolbox/x/utils/v3.js"
import {processQueue} from "./utils/process-queue.js"
import {Vector3} from "@babylonjs/core/Maths/math.js"
import {currentChunkChanged} from "./utils/current-chunk-changed.js"
import {calculateSubdivision} from "./utils/calculate-subdivision.js"
import {generateThresholds, onLevelOfDetailChangeGenerateNewThresholds} from "./utils/generate-thresholds.js"

export class Quadtree {
	boundary: Boundary
	children: Quadtree[] = []
	divided: boolean = false
	levelOfDetail: number
	isLeafNode: boolean = !this.divided
	parent: Quadtree | undefined
	workQueue: Array<Function> = []
	numberOfCalculationsDone: number = 0
	currentChunk: Quadtree | undefined = undefined
	thresholds: number[] | undefined = undefined

	constructor(boundary: Boundary, parent: Quadtree | undefined) {
		this.boundary = boundary
		this.levelOfDetail = this.getLevelOfDetail(parent)
		this.parent = parent
	}

	getLevelOfDetail(parent: Quadtree | undefined) {
		if (parent) {
			return parent.levelOfDetail + 1
		} else return 0
	}

	getCurrentNode(cameraPosition: Vector3): Quadtree | undefined {
		if (contains(this.boundary, cameraPosition)) {
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

	calculateLevelOfDetail({cameraPosition, levelsOfDetail, qt, maxNumberOfCalculationsPerFrame = 30}: {
		maxNumberOfCalculationsPerFrame?: number
		levelsOfDetail: number,
		cameraPosition: V3,
		qt: Quadtree
	}) {

		if (!qt.thresholds) {qt.thresholds = generateThresholds(levelsOfDetail, qt.boundary)}
		onLevelOfDetailChangeGenerateNewThresholds(qt, levelsOfDetail)

		if (currentChunkChanged(qt, cameraPosition)) {
			if (this.isLeafNode) {
				this.divideOrUndivide(qt, cameraPosition)
			} else {
				for (const c of this.children) {
					c.calculateLevelOfDetail({cameraPosition, levelsOfDetail, qt})
				}
			}
		}
		return {
			process: () => {
				qt.currentChunk = qt.getCurrentNode(new Vector3(cameraPosition[0], cameraPosition[1], cameraPosition[2]))
				processQueue(qt.workQueue, qt, maxNumberOfCalculationsPerFrame)
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
		this.children = calculateSubdivision(this)
	}

	undivide() {
		if (this.parent) {
			this.parent.children = []
			this.parent.divided = false
			this.parent.isLeafNode = true
		}
	}

	divideOrUndivide(qt: Quadtree, cameraPosition: V3) {
		const distanceToLeafNode = v3.distance(cameraPosition, [this.boundary.x, 0, this.boundary.z])
		const distanceToParent = this.parent ? v3.distance(cameraPosition, [this.parent?.boundary.x, 0, this.parent?.boundary.z]) : undefined
		for (let i = 0; i < qt.thresholds!.length; i++) {
			if (this.levelOfDetail == i) {
				if (distanceToLeafNode < qt.thresholds![i]) {
					qt.workQueue.push(() => this.subdivide())
				}
				else if (distanceToParent && distanceToParent > qt.thresholds![i - 1]) {
					qt.workQueue.push(() => this.undivide())
				}
			}
		}
	}

	changeLevelOfDetail(qt: Quadtree, newLevels: number) {
		if (qt.thresholds!.length <= newLevels) {
			qt.workQueue.push(() => this.subdivide())
		}
		if (qt.thresholds!.length > newLevels) {
			if (this.isLeafNode) {
				if (this.levelOfDetail == qt.thresholds!.length - 1) {
					qt.workQueue.push(() => this.undivide())
				}
			} else {
				for (const c of this.children) {
					c.changeLevelOfDetail(qt, newLevels)
				}
			}
		}
	}

	changeBoundary(newBoundary: number, levelsOfDetail: number) {
		if (this.boundary.w != newBoundary) {
			this.children = []
			this.boundary.w = newBoundary
			this.thresholds = generateThresholds(levelsOfDetail, this.boundary)
			if (levelsOfDetail > 0) {
				const leafNodes = this.getChildren()
				for (const c in leafNodes) {
					this.workQueue.push(() => leafNodes[c].subdivide())
				}
			} 
		}
	}
}
