import { Segment } from "../core/segments";

export const mergeSections: Segment = async (ctx) => ({
	...ctx,
	prompt:
		`Combine the three sections (finance, fitness, reading) below into ` +
		`one markdown report with ### headers and an at‑a‑glance priority ` +
		`bar (███) for each. Keep ≤1200 chars.\n` +
		ctx.finance +
		"\n" +
		ctx.fitness +
		"\n" +
		ctx.reading,
});

export const addPriorityBars: Segment = async (ctx) => ({
	...ctx,
	result: ctx.answer.replace(/###[^\n]+\n/g, (h) => h + "Priority: ███\n"), // crude visual tick
});
