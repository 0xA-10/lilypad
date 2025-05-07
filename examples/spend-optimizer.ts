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
