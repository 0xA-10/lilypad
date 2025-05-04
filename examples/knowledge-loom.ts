import { compose } from "../src/core/pipeline";
import { patternComposer } from "../src/pattern/pattern";
import { PATTERNS } from "../src/patterns/presets";
import { withLLM } from "../src/core/executors";

import {
	bulletSummary,
	expandMindMap,
	compressHaiku,
	analogyStory,
	toSQL,
	parseSQL,
	rankRows,
	weaveMarkdown,
} from "../src/loom/bricks";

const chain = patternComposer(PATTERNS.LOOM, [
	bulletSummary,
	withLLM(), // D
	expandMindMap,
	withLLM(), // B
	compressHaiku,
	withLLM(), // S (compress)
	analogyStory,
	withLLM(), // B (expand)
	toSQL,
	withLLM(), // S
	parseSQL,
	rankRows, // D
	weaveMarkdown,
	withLLM(), // final
]);

compose(chain)({ topic: "Photosynthesis" }).then((o) => console.log("\n===== KNOWLEDGE LOOM =====\n" + o.answer));

/* 
===== KNOWLEDGE LOOM =====
Photosynthesis and SQL tables might seem worlds apart, but both serve an essential function in their respective domains. Photosynthesis is a natural process where plants convert sunlight into energy, producing glucose and releasing oxygen as a byproduct. Similarly, a SQL table acts as a structure to store and manage data efficiently, enabling its conversion into valuable insights through queries.

In photosynthesis, plants absorb light energy, water, and carbon dioxide to create chemical energy. Each element of the process, like chlorophyll or sunlight, contributes to a specific outcome. Similarly, in a SQL table, each column represents a distinct data attribute, and each row is a record that collectively contributes to data analysis and decision-making.

For example, consider a SQL table that ranks plant efficiency in photosynthesis:

```markdown
| Rank | Plant Name    | Photosynthesis Efficiency (μmol CO2 m-2 s-1) |
|------|---------------|-----------------------------------------------|
| 1    | Sugarcane     | 50                                            |
| 2    | Maize         | 40                                            |
| 3    | Wheat         | 30                                            |
| 4    | Rice          | 25                                            |
| 5    | Soybean       | 20                                            |
```

Here, the table stores data about different plants and their photosynthetic efficiency, similar to how photosynthesis stores and converts energy.Both SQL tables and photosynthesis transform raw materials—the table uses raw data, while photosynthesis uses sunlight and air—into something useful and integral to their systems.
 */
