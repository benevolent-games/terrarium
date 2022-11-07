
import {html, render} from "lit"

import {makeStore} from "../toolbox/store.js"
import {proxyState} from "../toolbox/proxy-state.js"

export interface Settings {
	useOperatingSystemCursor: boolean
}

export function makeSettings() {
	const store = makeStore<Settings>(localStorage, "tectonic-settings")
	const onSettingsChange = new Set<(settings: Settings) => void>()
	const {writable, readable} = proxyState(
		store.load() ?? {
			useOperatingSystemCursor: false,
		},
		settings => {
			renderSettings()
			for (const callback of onSettingsChange)
				callback(settings)
			store.save(settings)
		},
	)

	const element = document.createElement("div")
	element.className = "settings"

	function renderSettings() {
		const result = html`
			<label data-setting="useOperatingSystemCursor">
				<input
					type="checkbox"
					?checked=${writable.useOperatingSystemCursor}
					@input=${(event: InputEvent) => {
						const input = event.target as HTMLInputElement
						writable.useOperatingSystemCursor = input.checked
					}}
					/>
				<span>use operating system cursor</span>
			</label>
		`
		render(result, element)
	}

	renderSettings()
	return {
		writable,
		readable,
		element,
		onSettingsChange,
	}
}
