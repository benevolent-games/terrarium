import {makeGround} from "../landscape/ground.js"
import {Oracle} from "../oracle/oracle.js"
import {Quadtree} from "../quadtree.js"
import {Theater} from "../theater/theater.js"

export const addMesh = async (
	node: Quadtree,
	c: string,
	theater: Theater,
	oracle: Oracle,
	cliffSlopeFactor: number
) => {
	const {x, y, z, w} = node.boundary
	return await makeGround({
		theater,
		mapSize: w,
		resolution: theater.slidersState.meshResolution,
		terrainGenerator: oracle,
		cliffSlopeFactor,
		normalStrength: 1,
		// groundShaderUrl: "/assets/shader10.json",
		groundShaderUrl: "https://dl.dropbox.com/s/gp5yabh4zjpi7iz/terrain-shader-10.json",
		position: {
			x: x,
			z: z,
			y: y
		},
		c,
	})
}
