import "dotenv/config";

import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { Segment } from "./segments";

/*────────────────  token‑bucket limiter per provider ────────────────*/
type Bucket = { tokens: number; last: number; max: number };
const buckets: Record<"openai" | "anthropic", Bucket> = {
	openai: {
		tokens: process.env.LILYPAD_OPENAI_RPS ? Number(process.env.LILYPAD_OAI_RPS) : 2,
		last: Date.now(),
		max: process.env.LILYPAD_OPENAI_RPS ? Number(process.env.LILYPAD_OAI_RPS) : 2,
	},
	anthropic: {
		tokens: process.env.LILYPAD_CLAUDE_RPS ? Number(process.env.LILYPAD_OAI_RPS) : 2,
		last: Date.now(),
		max: process.env.LILYPAD_CLAUDE_RPS ? Number(process.env.LILYPAD_OAI_RPS) : 2,
	},
};

function take(provider: "openai" | "anthropic"): number {
	const b = buckets[provider];
	const now = Date.now();
	const elapsed = now - b.last;
	if (elapsed > 1_000) {
		b.tokens = b.max;
		b.last = now;
	}
	if (b.tokens > 0) {
		b.tokens--;
		return 0;
	}
	return 1_000 - elapsed;
}

/*────────────────  clients ────────────────*/
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/*────────────────  providers helper ────────────────*/
async function callOpenAI(prompt: string, model: string, tries = 3): Promise<string> {
	const wait = take("openai");
	if (wait) await new Promise((r) => setTimeout(r, wait));
	try {
		const r = await openai.chat.completions.create({
			model,
			messages: [{ role: "user", content: prompt }],
		});
		return r.choices[0].message?.content ?? "";
	} catch (e: any) {
		if (e?.status === 429 && tries > 1) {
			await new Promise((r) => setTimeout(r, 500));
			return callOpenAI(prompt, model, tries - 1);
		}
		throw e;
	}
}

async function callClaude(prompt: string, model: string, tries = 3): Promise<string> {
	const wait = take("anthropic");
	if (wait) await new Promise((r) => setTimeout(r, wait));
	try {
		const r = await anthropic.messages.create({
			model,
			max_tokens: 1024,
			messages: [{ role: "user", content: prompt }],
		});
		// Claude returns content array [{type:'text',text:'...'}]
		return (r.content[0] as any)?.text ?? "";
	} catch (e: any) {
		if (e?.status === 429 && tries > 1) {
			await new Promise((r) => setTimeout(r, 500));
			return callClaude(prompt, model, tries - 1);
		}
		throw e;
	}
}

/*────────────────  exported Segment factory ────────────────*/
export const withLLM =
	(model: string = "gpt-4o"): Segment =>
	async (ctx) => {
		const isClaude = model.startsWith("claude");
		const answer = isClaude ? await callClaude(ctx.prompt, model) : await callOpenAI(ctx.prompt, model);
		return { ...ctx, answer };
	};
