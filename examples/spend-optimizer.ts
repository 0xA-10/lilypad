import "dotenv/config";
import { lilypad, fresh } from "../src/core";
import { analyzeValue, brainstormAlternatives, filterByThreshold, critiqueAndTighten } from "../src/steps";

async function run() {
	const spendPipeline = lilypad(
		analyzeValue,
		brainstormAlternatives,
		filterByThreshold(10),
		fresh(),
		critiqueAndTighten,
	);

	const result = await spendPipeline.run({ spendingItem: "HelloFresh subscription" });
	console.log("Recommendations:", result.data.recommendations);
}

run();

/* 
lilypad > pnpm run demo:spend

> lilypad@0.2.0 demo:spend
> npx tsx examples/spend-optimizer.ts

Recommendations: [
  'Here are the top three suggestions, streamlined for clarity and brevity:',
  '**Grocery Store Meal Kits**: Many grocery stores offer affordable meal kits with pre-portioned ingredients and simple recipes, providing convenience without a subscription.',
  '**Recipe Apps**: Utilize free or low-cost apps (like Mealime) that generate meal plans and grocery lists based on your preferences, saving time and offering meal flexibility.',
  '**DIY Meal Kits**: Plan meals for the week and pre-portion ingredients yourself, combining bulk staple items with fresh produce for an easy cooking experience.'
]
 */