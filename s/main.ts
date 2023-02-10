
import {makeOracle} from "./oracle/oracle.js"
import {makeActuator} from "./actuator/actuator.js"
import {r as makeRandomToolkit, seed} from "@benev/toolbox/x/utils/randomly.js"
import {easing} from "@benev/toolbox/x/utils/easing.js"
import {makeTheater} from "./theater/theater.js"
import {makeCamera} from "./cameras/spectator-camera.js"

export type Camera = ReturnType<typeof makeCamera>

export function makeTerrarium() {

	const randomly = makeRandomToolkit(seed())
	const oracle = makeOracle({
		randomly,
		treeDensityScale: 200,
		layers: [
			{scale: 800, amplitude: 100, ease: (v: number) => easing.exponential(v * 0.7)},
			{scale: 400, amplitude: 60, ease: easing.sine},
			{scale: 200, amplitude: 20, ease: easing.sine},
		],
	})
	const theater = makeTheater()
	const makeCam = makeCamera({
		theater,
		sampleHeight: oracle.sampleHeight,
		nubContext: theater.nubContext
	})
	const actuator = makeActuator({oracle, theater, makeCam})

	return actuator
}
