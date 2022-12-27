
export function makeCounters({
		getPhysicsTime, getCameraRenderTime,
		getGpuTime, getFrameTime, getDrawTime,
		getInterFrameTime, getActiveMeshesEvaluationTime,
	}: {
		getGpuTime: () => string
		getDrawTime: () => string
		getFrameTime: () => string
		getPhysicsTime: () => string
		getInterFrameTime: () => string
		getCameraRenderTime: () => string
		getActiveMeshesEvaluationTime: () => string
	}) {

	const gpuFrameTimeCounter = document.createElement("div")
	const frameTimeCounter = document.createElement("div")
	const drawTimeCounter = document.createElement("div")
	const physicsTimeCounter = document.createElement("div")
	const interFrameCounter = document.createElement("div")
	const cameraRenderTimeCounter = document.createElement("div")
	const activeMeshesEvaluationTimeCounter = document.createElement("div")

	;[
		gpuFrameTimeCounter,
		frameTimeCounter,
		drawTimeCounter,
		physicsTimeCounter,
		interFrameCounter,
		cameraRenderTimeCounter,
		activeMeshesEvaluationTimeCounter
	].map(element => element.classList.add("counter"))

	setInterval(
		() => {
			drawTimeCounter.innerHTML = `draw time: ${getDrawTime()}ms`
			gpuFrameTimeCounter.innerHTML = `gpu frame time: ${getGpuTime()}ms`
			physicsTimeCounter.innerHTML = `physics time: ${getPhysicsTime()}ms`
			interFrameCounter.innerHTML = `inner frame time: ${getInterFrameTime()}ms`
			cameraRenderTimeCounter.innerHTML = `camera render time: ${getCameraRenderTime()}ms`
			frameTimeCounter.innerHTML = `frame time (time to process an entire frame): ${getFrameTime()}ms`
			activeMeshesEvaluationTimeCounter.innerHTML = `active mesh evaluation time: ${getActiveMeshesEvaluationTime()}ms`
		},
		100
	)

	return {
		gpuFrameTimeCounter,
		frameTimeCounter,
		drawTimeCounter,
		physicsTimeCounter,
		interFrameCounter,
		cameraRenderTimeCounter,
		activeMeshesEvaluationTimeCounter
	}
}
