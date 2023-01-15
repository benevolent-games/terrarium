
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {FloatArray} from "@babylonjs/core/types.js"
import {VertexBuffer} from "@babylonjs/core/Buffers/buffer.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {VertexData} from "@babylonjs/core/Meshes/mesh.vertexData.js"

import {V3} from "../toolbox/v3.js"
import {Theater} from "../theater/theater.js"
import {Oracle} from "../oracle/oracle.js"
import {loadShader} from "../toolbox/babylon/load-shader.js"
import {Color3, Vector3} from "@babylonjs/core/Maths/math.js"
import {StandardMaterial} from "@babylonjs/core/Materials/standardMaterial.js"

export async function makeGround({
		theater: {scene},
		mapSize,
		resolution,
		normalStrength,
		groundShaderUrl,
		cliffSlopeFactor,
		terrainGenerator,
		position,
		c,
	}: {
		theater: Theater
		mapSize: number
		resolution: number
		normalStrength: number
		groundShaderUrl: string
		cliffSlopeFactor: number
		terrainGenerator: Oracle
		position: {x: number, z: number, y: number}
		c: string
	}) {

	const ground = MeshBuilder.CreateGround("ground", {
		width: mapSize,
		height: mapSize,
		subdivisions: resolution,
		updatable: true,
	}, scene)

	ground.position.x = position.x
	ground.position.z = position.z
	ground.position.y = 0
	const randomColor = new Color3(Math.random() * Math.random(), Math.random() * Math.random(), Math.random() * Math.random())
	const material = new StandardMaterial(`${c}`)
	material.diffuseColor = randomColor
	material.specularColor = Color3.Black()
	material.specularPower = 8
	ground.material = material

	morphGround({ground, terrainGenerator})

	// const shader = await loadShader({
	// 	scene,
	// 	url: groundShaderUrl,
	// 	label: "groundshader",
	// })

	// shader.assignInputs({
	// 	// cliffSlopeFactor,
	// 	traversable: cliffSlopeFactor,
	// 	normalStrength,
	// 	textureFrequency: 6,
	// 	grassiness: 2,
	// 	noiseFrequency: 40,
	// })

	// // TODO GROUND MATERIAL
	// ground.material = shader.material
	ground.receiveShadows = true
	return ground
}

function morphGround({ground, terrainGenerator}: {
		ground: Mesh
		terrainGenerator: Oracle
	}) {

	function displace(x: number, y: number, z: number, groundPos: Vector3): V3 {
		return [x, terrainGenerator.sampleHeight(x + groundPos.x, z + groundPos.z), z]
	}

	const positions = ground.getVerticesData(VertexBuffer.PositionKind)!
	const newPositions: FloatArray = []
	for(let vertexIndex = 0; vertexIndex < positions.length; vertexIndex+= 3){
		const x = positions[vertexIndex]
		const y = positions[vertexIndex+ 1]
		const z = positions[vertexIndex+ 2]
		const newxyz = displace(x, y, z, ground.position)
		newPositions.push(...newxyz)
	}

	ground.setVerticesData(VertexBuffer.PositionKind, newPositions)

	const normals: FloatArray = []
	VertexData.ComputeNormals(newPositions, ground.getIndices(), normals)
	ground.setVerticesData(VertexBuffer.NormalKind, normals)
}
