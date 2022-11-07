
export function stopwatch() {
	const start = Date.now()
	return () => Date.now() - start
}

export function measure(fun: () => void) {
	const getTime = stopwatch()
	fun()
	return getTime()
}

export function logtime(label: string, fun: () => void) {
	const time = measure(fun)
	console.log("⏱️ " + label + ": " + time.toFixed(0) + "ms")
}
