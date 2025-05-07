import "dotenv/config";
import { lilypad, fresh } from "../src/core";
import {
	seedUserInput,
	classifyCategory,
	extractKPIs,
	identifySubtypes,
	chooseSubtypes,
	webScanPrices,
	brainstormDiverseAlternatives,
	flattenIdeas,
	dedupeIdeas,
	noveltyFilter,
	vectorSimilarity,
	filterByScore,
	estimateSavings,
	tradeoffTable,
	selfCritique,
	rankFinal,
	groupAndLimit,
	generateActions,
	summaryExecutive,
} from "../src/extra-steps";
import { transformationsToMermaid } from "../src/mermaid";

async function run() {
	const pipeline = lilypad(
		seedUserInput(),
		classifyCategory,
		extractKPIs,
		identifySubtypes,
		chooseSubtypes,
		webScanPrices,
		brainstormDiverseAlternatives,
		flattenIdeas(),
		dedupeIdeas(),
		noveltyFilter,
		vectorSimilarity,
		filterByScore(0.65),
		estimateSavings,
		fresh(),
		tradeoffTable,
		selfCritique,
		rankFinal,
		groupAndLimit(2),
		generateActions,
		fresh(),
		summaryExecutive,
	);

	const result = await pipeline.run({
		spendingItem: "HelloFresh subscription",
		userValue: "turns food into an idle task so I can multitask",
	});

	console.log("🔍 Tradeoffs Table:\n", result.data.tradeoffsMarkdown);
	console.log("\n📝 Critique:\n", (result.data as any).critique);
	console.log("\n🔢 Ranked Ideas:\n", (result.data as any).ranked);
	console.log("\n✅ Action Steps:\n", (result.data as any).actionPlanSteps.join("\n- "));
	console.log("\n📊 Summary:\n", (result.data as any).summary);

	const diagramCode = transformationsToMermaid(result.transformations);
	console.log("```mermaid\n" + diagramCode + "\n```");
}

run();

/* 
lilypad > pnpm run demo:spend-advanced

> lilypad@0.2.0 demo:spend-advanced
> npx tsx examples/spend-optimizer-advanced.ts

🔍 Tradeoffs Table:
 Here is a markdown table comparing the ideas, scores, and savings:

```markdown
| Idea         | Score | Savings |
|--------------|-------|---------|
| McDonald's   | 1.0   | $3,650  |
| Taco Bell    | 0.9   | $3,650  |
| Wendy's      | 0.8   | $3,650  |
| Burger King  | 0.7   | $3,650  |
```

You can copy and paste this markdown code to any markdown-compatible platform to view the table.

📝 Critique:
 The original table is clear but could be enhanced for better readability and context. The scores could benefit from a descriptive header regarding what they represent. Additionally, explaining the uniformity of savings might provide more insight. Using dollar signs consistently across savings would also enhance visual coherence.

🔢 Ranked Ideas:
 [
  { idea: "McDonald's", score: 1, savings: 3650 },
  { idea: 'Taco Bell', score: 0.9, savings: 3650 },
  { idea: "Wendy's", score: 0.8, savings: 3650 },
  { idea: 'Burger King', score: 0.7, savings: 3650 }
]

✅ Action Steps:
 Here are actionable steps for implementing the top ideas:
- ### 1. McDonald's (Score: 1.0)
- #### Actionable Steps:
- **Market Research**: Conduct a survey to gather customer feedback on McDonald's offerings and services.
- **Promotional Strategy**: Create a promotional campaign emphasizing value meals and limited-time offers to attract more customers.
- **Loyalty Program**: Develop or enhance a loyalty program that rewards repeat customers with discounts or freebies.
- **Cost Analysis**: Review supply chain and inventory practices to identify areas for reducing costs while maintaining quality.
- **Community Engagement**: Partner with local events or organizations to increase brand visibility and community connection.
- ### 2. Taco Bell (Score: 0.9)
- #### Actionable Steps:
- **Menu Innovation**: Introduce new items or limited-time offerings, taking customer preferences into account.
- **Social Media Campaign**: Leverage social media platforms to engage with customers through fun and interactive campaigns.
- **Value Promotions**: Develop combo deals that offer savings to encourage upsells and larger orders.
- **Partnership Opportunities**: Explore collaborations with popular brands or influencers to expand reach.
- **Feedback System**: Implement an easy-to-use feedback system for customers to provide insight on new menu items.
- ### 3. Wendy's (Score: 0.8)
- #### Actionable Steps:
- **Drive-Thru Optimization**: Analyze drive-thru wait times and implement strategies to reduce them, ensuring faster service.
- **Health-Conscious Options**: Expand the menu with more healthy choices to attract health-conscious consumers.
- **Targeted Marketing**: Use data analytics to create targeted advertising campaigns based on customer demographics.
- **Sustainability Initiatives**: Introduce sustainability practices for packaging to appeal to environmentally conscious customers.
- **Seasonal Promotions**: Design seasonal menus or promotions that create excitement and draw in customers.
- ### 4. Burger King (Score: 0.7)
- #### Actionable Steps:
- **Customer Engagement**: Host events at locations to draw in families and community members, such as burger-making competitions.
- **Product Diversification**: Introduce new products or variations to appeal to different tastes and dietary needs.
- **Improve Digital Presence**: Enhance the mobile app and website for seamless ordering, offering rewards for app users.
- **Market Comparisons**: Analyze competitor strategies to identify gaps in the market that Burger King can fill.
- **Employee Training**: Invest in training programs for staff to ensure exceptional customer service and satisfaction.
- Implementing these steps can maximize the potential of each idea and drive better outcomes for the businesses involved.

📊 Summary:
 **Executive Summary**

This report evaluates potential strategies to optimize cost savings within our fast-food operations. The analysis identifies three key recommendations, focusing on McDonald's, Taco Bell, and Wendy's, each offering substantial savings opportunities.

1. **McDonald's**: Scoring highest at 1, McDonald’s presents an exceptional potential for cost savings of $3,650. Leveraging their robust supply chain efficiencies and innovative menu management can lead to enhanced profitability and streamlined operations.

2. **Taco Bell**: With a score of 0.9, Taco Bell also offers significant savings of $3,650. Implementing targeted marketing campaigns and expanding plant-based menu options may attract a broader customer base while effectively reducing operational costs through standardized ingredient use.

3. **Wendy's**: Scoring 0.8, Wendy's provides a reliable path to achieving $3,650 in savings. Focusing on optimizing labor costs and exploring delivery partnerships can increase efficiency and drive revenues, ensuring a competitive edge in the market.

In conclusion, prioritizing these three recommendations—optimizing operations at McDonald's, enhancing marketing strategies for Taco Bell, and streamlining costs at Wendy's—will not only yield immediate savings but also establish a foundation for long - term financial health and operational excellence in our portfolio.
 */
