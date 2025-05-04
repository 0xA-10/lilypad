import { Segment } from "../core/segments";
import { z } from "zod";

/*──────── helper: pull JSON out of model text ────────*/
function extractJSON(text: string): string {
	const block = text.match(/```json([\s\S]*?)```/i);
	if (block) return block[1];
	const first = text.indexOf("[");
	return first >= 0 ? text.slice(first) : "[]";
}

/*──────── 1. detect / clarify goal (optional summary) ────────*/
export const detectGoal: Segment = async (ctx) => ({
	...ctx,
	prompt: `Summarise this fitness goal in one sentence:\n${ctx.goal}\n` + `Return plain text only.`,
});

/*──────── 2. prompt to generate micro‑habits ────────*/
export const microHabitPrompt =
	(k = 15, cfg = { domains: ["cardio", "mobility", "diet"] }): Segment =>
	async (ctx) => ({
		...ctx,
		prompt:
			`Generate ${k} micro‑habits (≤25 min each) in domains ` +
			`${cfg.domains.join(", ")} that help achieve: ${ctx.goal}. ` +
			`Return ONLY a JSON array; each object keys: ` +
			`name (string), timeMin (number), domain (string), benefit (string).`,
	});

/*──────── 3. parse habits from previous answer ────────*/
export const parseHabits: Segment = async (ctx) => {
	const schema = z.array(
		z.object({
			name: z.string(),
			timeMin: z.number().min(1),
			domain: z.string(),
			benefit: z.string(),
		}),
	);

	const parsed = schema.parse(JSON.parse(extractJSON(ctx.answer)));
	return { ...ctx, habits: parsed };
};

/*──────── 4. injury guard (simple filter) ────────*/
export const injuryGuard =
	(cfg = { allowedMods: "low-impact" }): Segment =>
	async (ctx) => ({
		...ctx,
		habits: ctx.habits.filter((h: any) => cfg.allowedMods === "any" || !h.name.match(/sprint|plyometric/i)),
	});

/*──────── 5. periodize over calendar ────────*/
export const periodizePlan =
	(cfg = { weeks: 4, sessionsPerWeek: 5 }): Segment =>
	async (ctx) => {
		const plan: Record<string, any[]> = {};
		let i = 0;
		for (let w = 1; w <= cfg.weeks; w++) {
			plan[`Week ${w}`] = [];
			for (let s = 0; s < cfg.sessionsPerWeek && i < ctx.habits.length; s++) {
				plan[`Week ${w}`].push(ctx.habits[i++]);
			}
		}
		return { ...ctx, plan };
	};

/*──────── 6. safety note & markdown render ────────*/
export const safetyAnnotate: Segment = async (ctx) => ({
	...ctx,
	planMarkdown:
		"### Safety Note\n> Consult a physician if pain persists.\n" +
		"### Plan\n" +
		"```json\n" +
		JSON.stringify(ctx.plan, null, 2) +
		"\n```",
});

export const toCalendarMarkdown: Segment = async (ctx) => ({
	...ctx,
	result: ctx.planMarkdown,
});
