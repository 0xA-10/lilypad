import { Segment } from "../core/segments";
import { withLLM } from "../core/executors";

/* pivotSurreal – one hop of poetic analogy */
export const pivotSurreal: Segment = async (ctx) => ({
	...ctx,
	prompt:
		`Transform the previous passage into a dreamlike analogy, ` + `retain key symbols but alter setting and logic.`,
});

/* mergeNarratives – braid two previous ctx fields */
export const mergeNarratives: Segment = async (ctx) => ({
	...ctx,
	prompt: `Weave the literal thread and the surreal thread into a single ` + `coherent narrative, max 150 words.`,
});
