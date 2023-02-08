
import {snapstate} from "@chasemoskal/snapstate"
import {html} from "lit"

interface Value {
	value: number
}

export function makeSliders() {

	const snap = snapstate({
		levelOfDetail: 5,
		workLoad: 40,
		boundary: 3200,
		meshResolution: 30,
		gravity: false
	})

	const sliders = html`
		<benev-checkbox
			@change=${({detail}: CustomEvent<boolean>) => snap.state.gravity = detail}>
			Enable gravity and collisions
		</benev-checkbox>
		<range-slider
			label="Level of detail"
			initial-value="${snap.state.levelOfDetail}"
			step="1"
			min="1"
			@valuechange=${({detail}: CustomEvent<Value>) => snap.state.levelOfDetail = Number(detail.value)}>
		</range-slider>
		<range-slider
			label="Mesh resolution"
			initial-value="${snap.state.meshResolution}"
			step="1"
			min="1"
			max="200"
			@valuechange=${({detail}: CustomEvent<Value>) => snap.state.meshResolution = Number(detail.value)}>
		</range-slider>
		<range-slider
			label="Workload budget"
			initial-value="${snap.state.workLoad}"
			step="1"
			min="1"
			max="400"
			@valuechange=${({detail}: CustomEvent<Value>) => snap.state.workLoad = Number(detail.value)}>
		</range-slider>
		<range-slider
			label="Boundary"
			initial-value="${snap.state.boundary}"
			step=${snap.state.boundary}
			min=${snap.state.boundary}
			max="102400"
			@valuechange=${({detail}: CustomEvent<Value>) => snap.state.boundary = Number(detail.value)}>
		</range-slider>
	`

	return {
		sliders,
		slidersState: snap.state
	}
}
