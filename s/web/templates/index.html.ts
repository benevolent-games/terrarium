
import {html} from "xiome/x/toolbox/hamster-html/html.js"
import {WebsiteContext} from "xiome/x/toolbox/hamster-html/website/build-website-types.js"

import pageHtml from "../partials/page.html.js"

export default (context: WebsiteContext) => pageHtml({
	...context,
	mainContent: html`
		<h1>⛰️ terrarium</h1>
		<nub-context default-bindings="
			👼 Cool Default Bindings
			🖱 look :: lookmouse
			*️⃣ forward :: KeyW ArrowUp
			*️⃣ backward :: KeyS ArrowDown
			*️⃣ leftward :: KeyA ArrowLeft
			*️⃣ rightward :: KeyD ArrowRight
			*️⃣ primary :: Mouse1
			*️⃣ secondary :: Mouse2
			">

			<nub-real-keyboard></nub-real-keyboard>
			<nub-real-mouse name=lookmouse></nub-real-mouse>
		</nub-context>
	`,
})
