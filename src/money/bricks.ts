// @ts-nocheck
import { Segment, inject } from "../core/segments";
import { z } from "zod";

/*──────── types ────────*/
export interface Spend {
	name: string;
	price: number;
	freq: string;
}

/*──────── 1. identify spending item ────────*/
export const detectSpend = (spend: Spend): Segment => inject("spend", spend);

/*──────── 2. ask user for value drivers ────────*/
export const clarifyValue: Segment = async (ctx) => ({
	...ctx,
	prompt:
		`What value does ${ctx.spend.name} for $${ctx.spend.price} ` +
		`every ${ctx.spend.freq} provide you? ` +
		`(convenience, enjoyment, health, etc.)`,
});

/*──────── 3. generate alternatives ────────*/
export const altIdeas: Segment = async (ctx) => ({
	...ctx,
	prompt:
		`List 10 cheaper alternatives to "${ctx.spend.name}" that preserve ` +
		`the user's value drivers: ${ctx.valueDrivers}. Avoid brand clones. ` +
		`Return **ONLY** a JSON array, each object having:\n` +
		`idea (string), estPrice (number), similarityScore (0‑100 number), ` +
		`similarityRationale (string), tradeOffs (string).`,
});

/*──────── helper: extract JSON safely ────────*/
function extractJSON(text: string): string {
	const codeBlock = text.match(/```json([\s\S]*?)```/i);
	if (codeBlock) return codeBlock[1];
	const firstBracket = text.indexOf("[");
	return firstBracket >= 0 ? text.slice(firstBracket) : "[]";
}

/*──────── 4. validate + compute savings ────────*/
export const score: Segment = async (ctx) => {
	const schema = z.array(
		z.object({
			idea: z.string(),
			estPrice: z.number(),
			similarityScore: z.number().min(0).max(100),
			similarityRationale: z.string(),
			tradeOffs: z.string(),
		}),
	);

	const rawJson = extractJSON(ctx.answer);
	const parsed = schema.parse(JSON.parse(rawJson));

	return {
		...ctx,
		ideas: parsed.map((p) => ({
			...p,
			savings: Math.round(((ctx.spend.price - p.estPrice) / ctx.spend.price) * 100),
		})),
	};
};

/*──────── 5. rank + pretty format ────────*/
export const formatTop =
	(k = 4): Segment =>
	async (ctx) => ({
		...ctx,
		result: ctx.ideas
			.sort((a, b) => b.similarityScore - a.similarityScore || b.savings - a.savings)
			.slice(0, k)
			.map(
				(v, i) =>
					`**${i + 1}. ${v.idea}** – saves *${v.savings}%* ` +
					`(similarity ${v.similarityScore}/100)\n` +
					`Trade‑offs: ${v.tradeOffs}`,
			)
			.join("\n\n"),
	});
