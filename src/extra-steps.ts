import { PromptStep } from "./core";
import { Context, Message } from "./types";
import { sendPrompt } from "./adapter-responses";
import similarity from "string-similarity";

// 0: Seed input into transcript
export function seedUserInput(): PromptStep<
	{ spendingItem: string; userValue: string },
	{ spendingItem: string; userValue: string }
> {
	return async (ctx) => {
		const question = `What value does "${ctx.data.spendingItem}" provide you?`;
		const transcript: Message[] = [
			{ role: "user", content: question },
			{ role: "assistant", content: ctx.data.userValue },
		];
		return { data: ctx.data, transcript, session: undefined };
	};
}

// 1: Classify category
export const classifyCategory: PromptStep<
	{ spendingItem: string; userValue: string },
	{ spendingItem: string; userValue: string; category: string }
> = async (ctx) => {
	const prompt = `Classify "${ctx.data.spendingItem}" into one of: food-kits, subscriptions, transport, utilities, entertainment, other.`;
	const { newContent, session } = await sendPrompt(ctx, prompt);
	return {
		data: { ...ctx.data, category: newContent.trim() },
		transcript: [...ctx.transcript, { role: "user", content: prompt }, { role: "assistant", content: newContent }],
		session,
	};
};

/**
 * Extracts the first balanced JSON object `{…}` or array `[…]` from `text`.
 * Throws if none found or braces/brackets are unbalanced.
 */
function extractFirstJson(text: string): string {
	const startIdx = text.search(/[\{\[]/);
	if (startIdx === -1) {
		throw new Error(`No JSON object or array found in:\n${text}`);
	}
	const openChar = text[startIdx];
	const closeChar = openChar === "{" ? "}" : "]";
	let depth = 0;
	for (let i = startIdx; i < text.length; i++) {
		if (text[i] === openChar) depth++;
		else if (text[i] === closeChar) {
			depth--;
			if (depth === 0) {
				return text.slice(startIdx, i + 1);
			}
		}
	}
	throw new Error(`Unbalanced ${openChar}…${closeChar} in:\n${text}`);
}

/**
 * 2: Extract KPI weights from the user-value,
 *    pulling the first JSON object out of any extra explanation.
 */
export const extractKPIs: PromptStep<
	{ spendingItem: string; userValue: string; category: string },
	{ spendingItem: string; userValue: string; category: string; kpis: Record<string, number> }
> = async (ctx) => {
	const prompt =
		`Extract numeric KPI weights from the user value: "${ctx.data.userValue}". ` +
		`Respond with ONLY a JSON object: { "convenience":1-5, "timeSaving":1-5, "enjoyment":1-5 }.`;
	const { newContent, session } = await sendPrompt(ctx, prompt);

	// isolate the JSON
	const jsonText = extractFirstJson(newContent);
	let kpis: Record<string, number>;
	try {
		kpis = JSON.parse(jsonText);
	} catch {
		throw new Error(`extractKPIs failed: invalid JSON:\n${jsonText}`);
	}

	return {
		data: { ...ctx.data, kpis },
		transcript: [...ctx.transcript, { role: "user", content: prompt }, { role: "assistant", content: jsonText }],
		session,
	};
};

/**
 * 3: Simulate web-scanning for pricing data,
 *    pulling the first JSON array out of any extra explanation.
 */
export const webScanPrices: PromptStep<
	{ spendingItem: string; userValue: string; category: string; kpis: any },
	{
		spendingItem: string;
		userValue: string;
		category: string;
		kpis: any;
		pricingRaw: Array<{ name: string; price: number }>;
	}
> = async (ctx) => {
	const prompt =
		`Simulate a web search: find current prices for "${ctx.data.spendingItem}" ` +
		`and alternatives. Provide a JSON array of {"name":string,"price":number}.`;
	const { newContent, session } = await sendPrompt(ctx, prompt);

	// isolate the JSON array
	const jsonArrText = extractFirstJson(newContent);
	let pricingRaw: Array<{ name: string; price: number }>;
	try {
		pricingRaw = JSON.parse(jsonArrText);
	} catch {
		throw new Error(`webScanPrices failed: invalid JSON array:\n${jsonArrText}`);
	}

	return {
		data: { ...ctx.data, pricingRaw },
		transcript: [...ctx.transcript, { role: "user", content: prompt }, { role: "assistant", content: jsonArrText }],
		session,
	};
};

// 4: Brainstorm alternatives
export const brainstormAlternativesExtended: PromptStep<any, { rawIdeas: string[] }> = async (ctx) => {
	const prompt = `Brainstorm 12 cheaper alternatives to "${ctx.data.spendingItem}" respecting its value: ${ctx.data.userValue}`;
	const { newContent, session } = await sendPrompt(ctx, prompt);
	const rawIdeas = newContent
		.split(/\n+/)
		.map((l) => l.replace(/^[0-9\.]+/, "").trim())
		.filter(Boolean);
	return {
		data: { ...ctx.data, rawIdeas },
		transcript: [...ctx.transcript, { role: "user", content: prompt }, { role: "assistant", content: newContent }],
		session,
	};
};

// 5: Deduplicate ideas
export function dedupeIdeas(): PromptStep<{ rawIdeas: string[] }, { ideas: string[] }> {
	return async (ctx) => {
		const unique = Array.from(new Set(ctx.data.rawIdeas.map((i) => i.toLowerCase()))).map(
			(i) => ctx.data.rawIdeas.find((orig) => orig.toLowerCase() === i)!,
		);
		return { data: { ...ctx.data, ideas: unique }, transcript: ctx.transcript, session: ctx.session! };
	};
}

// 6: Vector similarity scoring
export const vectorSimilarity: PromptStep<
	any,
	{ scored: Array<{ idea: string; score: number; why: string }> }
> = async (ctx) => {
	const prompt = `Given KPIs ${JSON.stringify(ctx.data.kpis)}, rate each idea in ${JSON.stringify(
		ctx.data.ideas,
	)} from 0-1 and justify. Output a JSON array [{idea:string,score:number,why:string}].`;
	const { newContent, session } = await sendPrompt(ctx, prompt);

	const jsonText = extractFirstJson(newContent);
	let scored: any[];
	try {
		scored = JSON.parse(jsonText);
	} catch {
		throw new Error(`vectorSimilarity failed: invalid JSON array in:\n${jsonText}`);
	}

	return {
		data: { ...ctx.data, scored },
		transcript: [...ctx.transcript, { role: "user", content: prompt }, { role: "assistant", content: jsonText }],
		session,
	};
};

// 7: Filter by score
export function filterByScore(
	threshold = 0.65,
): PromptStep<any, { shortlist: Array<{ idea: string; score: number }> }> {
	return async (ctx) => {
		const shortlist = ctx.data.scored
			.filter((item: any) => item.score >= threshold)
			.map((item: any) => ({ idea: item.idea, score: item.score }));
		return { data: { ...ctx.data, shortlist }, transcript: ctx.transcript, session: ctx.session! };
	};
}

// 8: Estimate savings
export const estimateSavings: PromptStep<
	any,
	{ shortlist: Array<{ idea: string; score: number; savings: number }> }
> = async (ctx) => {
	const prompt = `Based on pricing data ${JSON.stringify(
		ctx.data.pricingRaw,
	)}, estimate yearly savings for each idea ${JSON.stringify(
		ctx.data.shortlist.map((i) => i.idea),
	)}. Output JSON [{"idea":string,"savings":number}].`;
	const { newContent, session } = await sendPrompt(ctx, prompt);
	const jsonText = extractFirstJson(newContent);
	let savingsArr: any[];
	try {
		savingsArr = JSON.parse(jsonText);
	} catch {
		throw new Error(`estimateSavings failed: invalid JSON array in:\n${jsonText}`);
	}
	const shortlist = ctx.data.shortlist.map((item: any) => {
		const found = savingsArr.find((s: any) => s.idea === item.idea);
		return { idea: item.idea, score: item.score, savings: found?.savings || 0 };
	});
	return {
		data: { ...ctx.data, shortlist },
		transcript: [...ctx.transcript, { role: "user", content: prompt }, { role: "assistant", content: newContent }],
		session,
	};
};

// 9: Tradeoff table
export const tradeoffTable: PromptStep<any, { tradeoffsMarkdown: string }> = async (ctx) => {
	const prompt = `Create a markdown table comparing idea, score, and savings for: ${JSON.stringify(
		ctx.data.shortlist,
	)}.`;
	const { newContent, session } = await sendPrompt(ctx, prompt);
	return {
		data: { ...ctx.data, tradeoffsMarkdown: newContent.trim() },
		transcript: [...ctx.transcript, { role: "user", content: prompt }, { role: "assistant", content: newContent }],
		session,
	};
};

// 10: Self-critique
export const selfCritique: PromptStep<any, { critique: string; improvedMarkdown: string }> = async (ctx) => {
	const prompt = `As a critic, review this table and improve it. Provide JSON {"critique": "...", "improvedMarkdown": "..."}. Table: ${ctx.data.tradeoffsMarkdown}`;
	const { newContent, session } = await sendPrompt(ctx, prompt);
	const jsonText = extractFirstJson(newContent);
	let parsed: any[];
	try {
		parsed = JSON.parse(jsonText);
	} catch {
		throw new Error(`estimateSavings failed: invalid JSON array in:\n${jsonText}`);
	}
	return {
		data: { ...ctx.data, ...parsed },
		transcript: [...ctx.transcript, { role: "user", content: prompt }, { role: "assistant", content: newContent }],
		session,
	};
};

// 11: Rank final
// export const rankFinal: PromptStep<any, { ranked: Array<{ idea: string; score: number; savings: number }> }> = async (ctx) => {
//   const list = ctx.data.shortlist;
//   const maxSavings = Math.max(...list.map((i: any) => i.savings), 1);
//   const ranked = list.map((i: any) => ({
//     idea: i.idea,
//     score: i.score * 0.5 + (i.savings / maxSavings) * 0.5,
//     savings: i.savings
//   })).sort((a, b) => b.score - a.score);
//   return { data: { ...ctx.data, ranked }, transcript: ctx.transcript, session: ctx.session! };
// };

// 12: Generate actions
export const generateActions: PromptStep<any, { actionPlanSteps: string[] }> = async (ctx) => {
	const prompt = `Generate actionable steps for implementing the top ideas: ${JSON.stringify(ctx.data.ranked)}.`;
	const { newContent, session } = await sendPrompt(ctx, prompt);
	const actions = newContent
		.split(/\n+/)
		.map((l) => l.replace(/^-/, "").trim())
		.filter(Boolean);
	return {
		data: { ...ctx.data, actionPlanSteps: actions },
		transcript: [...ctx.transcript, { role: "user", content: prompt }, { role: "assistant", content: newContent }],
		session,
	};
};

// 13: Executive summary
export const summaryExecutive: PromptStep<any, { summary: string }> = async (ctx) => {
	const prompt = `Write an executive summary (<250 words) highlighting the top 3 recommendations: ${JSON.stringify(
		ctx.data.ranked.slice(0, 3),
	)}.`;
	const { newContent, session } = await sendPrompt(ctx, prompt);
	return {
		data: { ...ctx.data, summary: newContent.trim() },
		transcript: [...ctx.transcript, { role: "user", content: prompt }, { role: "assistant", content: newContent }],
		session,
	};
};

/**
 * 2a: Identify broad buckets (sub-types) of alternatives
 */
export const identifySubtypes: PromptStep<
	{ spendingItem: string; category: string },
	{ spendingItem: string; category: string; subtypes: string[] }
> = async (ctx) => {
	const prompt = `For the category "${ctx.data.category}", list 4 distinct sub-types of cheaper alternatives (e.g. meal-kits, drive-thru, food-stands, pre-made meals). Respond with a JSON array of strings.`;
	const { newContent, session } = await sendPrompt(ctx, prompt);
	const arrText = extractFirstJson(newContent);
	const subtypes = JSON.parse(arrText);
	return {
		data: { ...ctx.data, subtypes },
		transcript: [...ctx.transcript, { role: "user", content: prompt }, { role: "assistant", content: arrText }],
		session,
	};
};

/**
 * 2b: Choose top-K subtypes based on KPI weights
 */
export const chooseSubtypes: PromptStep<
	{ subtypes: string[]; kpis: Record<string, number> },
	{ subtypes: string[]; kpis: Record<string, number>; chosenSubtypes: string[] }
> = async (ctx) => {
	const prompt = `Given these sub-types: ${JSON.stringify(ctx.data.subtypes)} and KPI weights ${JSON.stringify(
		ctx.data.kpis,
	)}, pick the 2 that best match the user’s priorities. Respond with a JSON array of 2 strings.`;
	const { newContent, session } = await sendPrompt(ctx, prompt);
	const arrText = extractFirstJson(newContent);
	const chosenSubtypes = JSON.parse(arrText);
	return {
		data: { ...ctx.data, chosenSubtypes },
		transcript: [...ctx.transcript, { role: "user", content: prompt }, { role: "assistant", content: arrText }],
		session,
	};
};

/**
 * 5a: Brainstorm per-subtype alternatives
 */
export const brainstormDiverseAlternatives: PromptStep<
	{ spendingItem: string; userValue: string; chosenSubtypes: string[] },
	{ rawIdeas: Record<string, string[]> }
> = async (ctx) => {
	const map: Record<string, string[]> = {};
	let transcript = [...ctx.transcript];
	let session = ctx.session!;
	for (const subtype of ctx.data.chosenSubtypes) {
		const prompt = `List 4 cheap ${subtype} options that preserve the value: "${ctx.data.userValue}". Respond with JSON array of strings.`;
		const resp = await sendPrompt({ ...ctx, transcript, session }, prompt);
		const arrText = extractFirstJson(resp.newContent);
		const ideas = JSON.parse(arrText);
		map[subtype] = ideas;
		transcript = [...transcript, { role: "user", content: prompt }, { role: "assistant", content: arrText }];
		session = resp.session;
	}
	return { data: { ...ctx.data, rawIdeas: map }, transcript, session };
};

/**
 * 5b: Flatten the subtype→ideas map into one array
 */
export function flattenIdeas(): PromptStep<{ rawIdeas: Record<string, string[]> }, { rawIdeas: string[] }> {
	return async (ctx) => {
		const flattened = Object.values(ctx.data.rawIdeas).flat();
		return {
			data: { ...ctx.data, rawIdeas: flattened },
			transcript: ctx.transcript,
			session: ctx.session!,
		};
	};
}

/**
 * 11a: Limit number of results per subtype
 */
export function groupAndLimit(
	maxPerGroup = 2,
): PromptStep<
	{ shortlist: Array<{ idea: string; score: number; savings: number }> },
	{ shortlist: Array<{ idea: string; score: number; savings: number }> }
> {
	return async (ctx) => {
		// assume each idea string contains its subtype tag at front e.g. "[drive-thru] McDonalds"
		const groups: Record<string, any[]> = {};
		for (const item of ctx.data.shortlist) {
			const g = item.idea.match(/^\[([^\]]+)\]/)?.[1] || "other";
			groups[g] = groups[g] || [];
			if (groups[g].length < maxPerGroup) groups[g].push(item);
		}
		const limited = Object.values(groups).flat();
		return {
			data: { ...ctx.data, shortlist: limited },
			transcript: ctx.transcript,
			session: ctx.session!,
		};
	};
}

// Add these two steps to src/extra-steps.ts

/**
 * 6a: Remove any ideas that are essentially the same as the original spendingItem.
 */
export const noveltyFilter: PromptStep<any, any> = async (ctx) => {
	const prompt = `From this list of options:\n\n${JSON.stringify(
		ctx.data.ideas,
		null,
		2,
	)}\n\nRemove any that are essentially the same as "${
		ctx.data.spendingItem
	}". Respond with a JSON array of the remaining unique options.`;
	const { newContent, session } = await sendPrompt(ctx, prompt);
	const arrText = extractFirstJson(newContent);
	const ideas = JSON.parse(arrText);
	return {
		data: { ...ctx.data, ideas },
		transcript: [...ctx.transcript, { role: "user", content: prompt }, { role: "assistant", content: arrText }],
		session,
	};
};

/**
 * 15: Rank purely by model score (tiebreak by savings), do NOT halve scores.
 */
export const rankFinal: PromptStep<any, any> = async (ctx) => {
	const list = ctx.data.shortlist as Array<{ idea: string; score: number; savings: number }>;
	if (!Array.isArray(list) || list.length === 0) {
		throw new Error("rankFinal failed: no shortlist to rank");
	}
	const ranked = [...list].sort((a, b) => {
		if (b.score !== a.score) return b.score - a.score;
		return b.savings - a.savings;
	});
	return {
		data: { ...ctx.data, ranked },
		transcript: ctx.transcript,
		session: ctx.session!,
	};
};
