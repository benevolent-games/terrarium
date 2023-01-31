import {Quadtree} from "../quadtree.js"

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

function makeKey(node: Quadtree) {
	const {x, y, z} = node.boundary
	return `${x}_${y}_${z}`
}
