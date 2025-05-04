import { patternComposer } from "../src/pattern/pattern";
import { PATTERNS } from "../src/patterns/presets";
import { inject } from "../src/core/segments";
import { withLLM } from "../src/core/executors";

/* finance bricks */
import { detectSpend, clarifyValue, altIdeas, score, formatTop } from "../src/money/bricks";

/* health bricks */
import {
	detectGoal,
	microHabitPrompt,
	parseHabits,
	injuryGuard,
	periodizePlan,
	safetyAnnotate,
	toCalendarMarkdown,
} from "../src/health/bricks";

/* creative bricks */
import { pivotSurreal } from "../src/creative/bricks";
import { mergeSections, addPriorityBars } from "../src/report/bricks";

/*─────────────────────────────────────────
   SUB‑CHAIN 1 : Finance Saver (golden ratio)
──────────────────────────────────────────*/
const financeChain = patternComposer(PATTERNS.GOLDEN_RATIO, [
	detectSpend({ name: "Weekly UberEats dinner", price: 42, freq: "week" }),

	clarifyValue,
	withLLM(), // D
	inject("valueDrivers", "Convenience, no dishes"),

	altIdeas,
	withLLM(), // B
	score, // D
	formatTop(3),
	withLLM(), // B S D
]);

/*─────────────────────────────────────────
   SUB‑CHAIN 2 : Fitness Micro‑habit
──────────────────────────────────────────*/
const fitnessChain = patternComposer(PATTERNS.FITNESS_FLOW, [
	detectGoal,
	withLLM(),
	microHabitPrompt(20),
	withLLM(),
	parseHabits,
	injuryGuard({ allowedMods: "low-impact" }),
	periodizePlan({ weeks: 4, sessionsPerWeek: 5 }),
	safetyAnnotate,
	toCalendarMarkdown,
]);

/*─────────────────────────────────────────
   SUB‑CHAIN 3 : Reading Stack (creative)
──────────────────────────────────────────*/
const readingChain = patternComposer(PATTERNS.GOLDEN_RATIO, [
	inject("prompt", "List 7 books that blend fiction and neuroscience to expand thinking. " + "Return bullet list."),
	withLLM(), // D

	pivotSurreal,
	withLLM(), // B
	inject("prompt", (c) => `Take the list and craft a one‑sentence hook for each.`),
	withLLM(), // D
	inject("prompt", (c) => `Rank them by imagination impact.`),
	withLLM(), // B S D
]);

/*─────────────────────────────────────────
   CONDUCTOR PATTERN  (triage & polish)
──────────────────────────────────────────*/
const conductor = patternComposer(PATTERNS.TRIAGE_CONDUCT, [
	mergeSections,
	withLLM(), // D S (LLM blends)
	addPriorityBars, // T1200 -> adjust length & bars
	withLLM(), // final polish
]);

(async () => {
	const finance = await financeChain({});
	const fitness = await fitnessChain({ goal: "Be able to run 5K by September, train ≤20 min/day." });
	const reading = await readingChain({});

	const omni = await conductor({
		finance: finance.result,
		fitness: fitness.result,
		reading: reading.answer,
	});

	console.log("\n=====  PERSONAL 360° BLUEPRINT  =====\n");
	console.log(omni.result);
})();

/* 
The sentiment score for both the French sentence "Je suis très heureux." and its English translation "I am very happy." would likely be quite positive, closer to 1 on the sentiment scale of -1 to 1. This is because the phrase expresses a high degree of happiness and positivity.
lilypad > npx tsx examples/omniplan.ts

=====  PERSONAL 360° BLUEPRINT  =====

# Finance
### Meal Options and Savings ███████
Priority: ███
1. **Grocery Delivery Prepped Meals**: Saves 17% with a similarity of 90/100. Trade-off: Less variety compared to multiple restaurant options.
2. **Family-Owned Restaurant Takeout**: Saves 24%, similarity 85/100. Trade-off: Limited menu options, potentially restricted hours.
3. **Microwaveable Meal Packs**: Saves 40%, similarity 80/100. Trade-off: Potentially less fresh than restaurant-quality food.

# Fitness
### Weekly Plans for Enhanced Performance ████████████
Priority: ███
- **Week 1**: Focus on cardio and mobility with quick interval runs, dynamic stretching, core activation warm-up, power walking, and balanced breakfast planning.
- **Week 2**: Incorporate foam rolling, mini runs, leg stretches, meal prep, and speed burst drills.
- **Week 3**: Proper hydration, yoga, protein snacks, jumping jacks, and joint mobilizers.
- **Week 4**: Mindful breathing, resistance band routines, smoothies, high knees, and leg swings for comprehensive fitness improvement.

**Safety Note**: Consult a physician if pain persists.

# Reading & Imagination Impact
### Attributes to Consider ████████
Priority: ███
- **Originality**: Uniqueness and novelty.
- **Complexity**: Depth and intricacy, provoking deeper thought.
- **Emotional Resonance**: Emotional connection and universal themes.
- **Cultural Significance**: Societal influence and reflection.
- ** Vision for the Future **: Challenge to current thinking and introduction of new possibilities.
 */
