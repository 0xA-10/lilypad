import { Segment } from "../core/segments";

/*──────── ensure ctx.ranked, then render ────────*/
export const toHeatmap: Segment = async (ctx) => {
	if (!ctx.ranked) {
		return { ...ctx, result: "⚠️  No ranking data available." };
	}

	const head = "| Sector | Funding $M | Momentum |\n|---|---|---|\n";
	const rows = ctx.ranked.map((r: any) => `| ${r.sector} | ${r.funding.toFixed(1)} | ${r.score}/100 |`).join("\n");

	return { ...ctx, result: head + rows };
};
