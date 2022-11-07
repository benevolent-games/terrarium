
export interface InputRecord {
	pressed: boolean
	time: number
}

export type InputTracker = ReturnType<typeof makeInputTracker>

export function makeInputTracker(container: HTMLElement) {
	const values: {[name: string]: InputRecord} = {}
	const listeners = {
		keydown: new Set<(event: KeyboardEvent) => void>(),
		keyup: new Set<(event: KeyboardEvent) => void>(),
		mousedown: new Set<(event: MouseEvent) => void>(),
		mouseup: new Set<(event: MouseEvent) => void>(),
		wheel: new Set<(event: WheelEvent) => void>(),
	}

	container.addEventListener("keydown", event => {
		values[event.key.toLowerCase()] = stampForPressed(true)
		for (const listener of listeners.keydown)
			listener(event)
	})

	container.addEventListener("keyup", event => {
		values[event.key.toLowerCase()] = stampForPressed(false)
		for (const listener of listeners.keyup)
			listener(event)
	})

	container.addEventListener("mousedown", event => {
		values[nameForMouseButton(event.button)] = stampForPressed(true)
		for (const listener of listeners.mousedown)
			listener(event)
	})

	window.addEventListener("mouseup", event => {
		values[nameForMouseButton(event.button)] = stampForPressed(false)
		for (const listener of listeners.mouseup)
			listener(event)
	})

	container.addEventListener("wheel", event => {
		for (const listener of listeners.wheel)
			listener(event)
	})

	container.oncontextmenu = event => {
		event.preventDefault()
		return false
	}

	return {
		listeners,
		get(name: string) {
			return values[name]
				?? {pressed: false, time: Date.now()}
		},
	}
}

export function nameForMouseButton(button: number) {
	switch (button) {
		case 0: return "mouse_primary"
		case 1: return "mouse_tertiary"
		case 2: return "mouse_secondary"
		case 3: return "mouse_back"
		case 4: return "mouse_forward"
		default:
			throw new Error(`unknown mouse event button "${button}"`)
	}
}

function stampForPressed(pressed: boolean) {
	return {pressed, time: Date.now()}
}
