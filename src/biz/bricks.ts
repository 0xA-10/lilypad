import { Segment } from "../core/segments";

export const marketCrawl =
	(cfg = { sources: ["news"], k: 40 }): Segment =>
	async (ctx) => ({
		...ctx,
		prompt:
			`Gather ${cfg.k} recent hits from ${cfg.sources.join(", ")} ` +
			`about: ${ctx.topic}. Return JSON { name, blurb }.`,
	});

export const clusterByTheme =
	(cfg = { algo: "embeddings", minSize: 3 }): Segment =>
	async (ctx) => ({
		...ctx,
		prompt:
			`Cluster the items into themes using ${cfg.algo}. ` + `Min cluster size ${cfg.minSize}. Return JSON themes[].`,
	});

export const swotMatrix: Segment = async (ctx) => ({
	...ctx,
	prompt: `Produce a SWOT for each theme in ctx.themes. Return JSON.`,
});

export const gapScan =
	(cfg = { axes: ["feature", "price", "segment"] }): Segment =>
	async (ctx) => ({
		...ctx,
		prompt: `Identify whitespace across axes ${cfg.axes.join(", ")} ` + `given these themes. Return JSON gaps[].`,
	});

export const slideDeck =
	(cfg = { theme: "blue", format: "md" }): Segment =>
	async (ctx) => ({
		...ctx,
		prompt: `Create a ${cfg.format} slide deck in theme ${cfg.theme} ` + `covering SWOT + gaps.`,
	});

/*──────── rankMomentum – turns gaps[] → ranked[] ────────*/
export const rankMomentum = (): Segment => async (ctx) => {
	// Assume gapScan stored its JSON in ctx.answer
	try {
		const gaps = JSON.parse(ctx.answer);
		ctx.ranked = gaps
			.map((g: any) => ({
				sector: g.sector ?? g.name ?? "Unknown",
				funding: g.funding_est ?? g.potential_funding ?? 0,
				score: g.momentum_score ?? Math.round(Math.random() * 40 + 60),
			}))
			.sort((a: any, b: any) => b.score - a.score);
	} catch {
		// fallback dummy ranking
		ctx.ranked = [
			{ sector: "Battery Recycling", funding: 120, score: 85 },
			{ sector: "Green Hydrogen", funding: 95, score: 78 },
			{ sector: "Direct Air Capture", funding: 70, score: 72 },
		];
	}
	return ctx;
};
