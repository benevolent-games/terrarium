import {V3} from "@benev/toolbox/x/utils/v3.js"
import {Quadtree} from "../quadtree.js"
import {Node} from "../node.js"

export function calculateSubdivision(node: Quadtree): Quadtree[] {
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

		return [
			new Quadtree(topRight, node),
			new Quadtree(topLeft, node),
			new Quadtree(bottomLeft, node),
			new Quadtree(bottomRight, node)
		]
	}
