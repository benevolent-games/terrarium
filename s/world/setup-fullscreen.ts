
export function setupFullscreenHandler(container: HTMLElement) {
	return function(event: KeyboardEvent) {
		if (event.key === "F" && event.ctrlKey) {
			if (document.fullscreenElement === container)
				document.exitFullscreen()
			else
				container.requestFullscreen()
		}
	}
}
