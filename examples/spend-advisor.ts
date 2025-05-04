import { compose } from "../src/core/pipeline";
import { patternComposer } from "../src/pattern/pattern";
import { withLLM } from "../src/core/executors";
import { detectSpend, clarifyValue, altIdeas, score, formatTop } from "../src/money/bricks";
import { inject } from "../src/core/segments";

const spend = { name: "DoorDash lunch", price: 30, freq: "2 weeks" };

const chain = compose(
	detectSpend(spend),
	clarifyValue, // will prompt user
	// Pretend user replied:
	inject("valueDrivers", "Convenience, variety, no cleanup"),
	patternComposer("D B S T800", [
		altIdeas,
		withLLM(), // B
		score, // S
		formatTop(4),
		withLLM(), // D (polish wording)
	]),
);

(async () => {
	// @ts-ignore
	const out = await chain();
	console.log("\n=== RECOMMENDATIONS ===\n");
	console.log(out.result);
})();

/* 
=== RECOMMENDATIONS ===

**1. Street food stalls** – saves *83%* (similarity 90/100)
Trade‑offs: Weather dependent and limited to local cuisine.

**2. Office cafeteria or nearby deli** – saves *77%* (similarity 85/100)
Trade‑offs: Quality and variety depend on location's offering.

**3. Grocery store hot food bar** – saves *73%* (similarity 80/100)
Trade‑offs: Requires a trip to the grocery store.

**4. Homemade sandwich station** – saves *83%* (similarity 75/100)
Trade‑offs: Limited to ingredients you have on hand.
 */
