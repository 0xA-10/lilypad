import { Segment } from "../core/segments";
import { withLLM } from "../core/executors";
import { z } from "zod";

export const bulletSummary: Segment = async (ctx) => ({
	...ctx,
	prompt: `List 6 concise bullets capturing the essence of "${ctx.topic}".`,
});

export const expandMindMap: Segment = async (ctx) => ({
	...ctx,
	prompt: `Convert these bullets into a JSON mind‑map. ` + `Keys: node (string), children (array).`,
});

export const compressHaiku: Segment = async (ctx) => ({
	...ctx,
	prompt: `Compress that mind‑map into a single haiku (5‑7‑5). Return only text.`,
});

export const analogyStory: Segment = async (ctx) => ({
	...ctx,
	prompt: `Re‑inflate the haiku into a 120‑word fantasy analogy story.`,
});

export const toSQL: Segment = async (ctx) => ({
	...ctx,
	prompt: `Turn the analogy into a 3‑column SQL CREATE TABLE + INSERTs: ` + `entity TEXT, role TEXT, link TEXT.`,
});

/* validate & parse SQL into rows */
export const parseSQL: Segment = async (ctx) => {
	const rows = ctx.answer.match(/INSERT INTO.+?\((.+?)\);/g) ?? [];
	ctx.rows = rows.map((line) =>
		line
			.match(/\((.*?)\)/)![1]
			.split(",")
			.map((s) => s.trim().replace(/'/g, "")),
	);
	return ctx;
};

/* rank by cosine similarity using naive embedding call */
export const rankRows: Segment = async (ctx) => {
	// for brevity, fake similarity with random scores
	ctx.ranked = ctx.rows.map((r) => ({ entity: r[0], role: r[1], score: Math.random() * 100 }));
	ctx.ranked.sort((a, b) => b.score - a.score);
	return ctx;
};

export const weaveMarkdown: Segment = async (ctx) => ({
	...ctx,
	prompt:
		`Craft a 200‑word explanation that relates the SQL table back to ` +
		`"${ctx.topic}". Include a markdown table using ctx.ranked.`,
});
