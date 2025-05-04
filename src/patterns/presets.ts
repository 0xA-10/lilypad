/**
 * Legend
 *
 * D = Depth Focus
 * B = Breadth Explore
 * S = Synthesis T1200/1500 = trim ctx
 * M(claude-3) = route that segment to Anthropic Claude‑3.
 */
export const PATTERNS = {
	FINANCE_JIG: "D D B B S T800 D S",
	BRIEF: "D B S B S D",
	FITNESS_FLOW: "D B B S D",

	/* spider‑silk Fibonacci: 1 1 2 3 5 8 5 3 2 1 */
	DREAM_SPIRAL: "D B D B B D B B B S T1200 D",

	/* ocean‑wave (sonata form: Exposition, Development, Recap) */
	CLIMATE_WAVE: "D B S B M(claude-3-7-sonnet-20250219) S T1500 D S",

	GOLDEN_RATIO: "D B D B B S T900 D", // 1‑1‑2‑3‑5 rhythm
	TRIAGE_CONDUCT: "D S T1200 D", // fan‑in and polish

	LOOM: "D B S B S D T1000 D", // bullet → map → compress → expand → table → trim → weave
};
