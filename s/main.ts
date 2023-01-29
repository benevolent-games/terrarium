
import {makeOracle} from "./oracle/oracle.js"
import {makeActuator} from "./actuator/actuator.js"
import {makeRandomToolkit} from "./toolbox/randomly.js"
import {easing} from "@benev/toolbox/x/utils/easing.js"

export function makeTerrarium() {

	const randomly = makeRandomToolkit()
	const oracle = makeOracle({
		randomly,
		treeDensityScale: 200,
		layers: [
			{scale: 800, amplitude: 100, ease: v => easing.exponential(v * 0.7)},
			{scale: 400, amplitude: 60, ease: easing.sine},
			{scale: 200, amplitude: 20, ease: easing.sine},
		],
	})
	const actuator = makeActuator({oracle})

	return actuator
}
