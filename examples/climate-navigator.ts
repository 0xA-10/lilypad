import { compose } from "../src/core/pipeline";
import { patternComposer } from "../src/pattern/pattern";
import { PATTERNS } from "../src/patterns/presets";
import { withLLM } from "../src/core/executors";
import { marketCrawl, clusterByTheme, swotMatrix, gapScan, slideDeck, rankMomentum } from "../src/biz/bricks";
import { toHeatmap } from "../src/analysis/heatmap";
import { inject } from "../src/core/segments";

/**
 * Wave‑pattern logic: initial Exposition (D B S) introduces market; Development (B Claude S) explores gaps with another model; Recap (trim D) converges to a funding heat‑map you can act on.
 *
 * Sonata‑inspired pattern orchestrates two LLMs, iterative clustering, SWOT + gap + deck + heat‑map, keeps within window via strategic trim—delivers board‑ready insight without manual juggling.
 */
const chain = patternComposer(PATTERNS.CLIMATE_WAVE, [
	marketCrawl({ sources: ["news", "crunchbase"], k: 80 }),
	withLLM(), // D
	clusterByTheme({ algo: "embeddings", minSize: 4 }),
	withLLM(), // B
	swotMatrix,
	withLLM(), // S

	gapScan({ axes: ["tech", "cost", "region"] }),
	withLLM("claude-3-7-sonnet-20250219"), // B routed to Claude

	slideDeck({ theme: "ocean-blue", format: "md" }),
	withLLM(), // S

	inject("prompt", (c) => `Trim to ≤1500 chars and highlight funding.`), // T1500
	withLLM(),

	rankMomentum(),
	toHeatmap, // D – table
]);

compose(chain)({ topic: "Carbon capture start‑ups 2024" }).then((o) => console.log(o.result));

/* 
| Sector | Funding $M | Momentum |
|---|---|---|
| Battery Recycling | 120.0 | 85/100 |
| Green Hydrogen | 95.0 | 78/100 |
| Direct Air Capture | 70.0 | 72 / 100 |
 */
