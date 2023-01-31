import {Quadtree} from "../quadtree.js"

export function processQueue(workQueue: Array<Function>, qt: Quadtree, maxCalculations: number) {
	while (workQueue.length && qt.numberOfCalculationsDone < maxCalculations) {
		let calculate = workQueue.shift() as Function
		calculate()
		qt.numberOfCalculationsDone++
	}
}
