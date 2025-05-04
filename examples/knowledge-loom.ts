import { PatternBuilder } from "../src/pattern/builder";
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

const builder = new PatternBuilder();

const chain = builder
	.step("D", bulletSummary, withLLM())
	.step("B", expandMindMap, withLLM())
	.step("S", compressHaiku, withLLM())
	.step("B", analogyStory, withLLM())
	.step("S", toSQL, withLLM())
	.step("D", parseSQL, rankRows)
	.step("T1000") // just a trim pad, no extra Segment
	.step("D", weaveMarkdown, withLLM())
	.build();

(async () => {
	const output = await chain({ topic: "Photosynthesis" });
	console.log("\n===== RESULT =====\n");
	console.log(output.answer || output.result);

	// grab tree mermaid
	const tree = (chain as any).alignmentTree;
	console.log("\n===== ALIGNMENT TREE =====\n");
	console.log(tree.toMermaid());

	// grab tree JSON
	// console.log(JSON.stringify(tree.toJSON(), null, 2));
})();

/* 
===== RESULT =====

Certainly!

Photosynthesis can be likened to an SQL table, where each aspect of the process can be organized into distinct columns and rows for clarity and analysis. Imagine a table named `PhotosynthesisProcess` that stores essential data about the conditions and elements involved in photosynthesis. The columns can represent factors such as `LightIntensity`, `CO2Concentration`, `WaterAvailability`, `ChlorophyllLevel`, and `PhotosynthesisRate`. Each row would then correspond to a specific set of conditions at a given time, capturing the dynamic interactions that drive this critical process.

The SQL table helps simulate how changing one factor affects the photosynthetic rate, similar to querying the database to predict outcomes or identify patterns. By analyzing this data, scientists can gain insights into how plants convert light energy into chemical energy, just as a SQL query would help retrieve information from a structured dataset.

Here is a representation of such a table in markdown syntax:

```markdown
| LightIntensity | CO2Concentration | WaterAvailability | ChlorophyllLevel | PhotosynthesisRate |
|----------------|------------------|-------------------|------------------|--------------------|
| High           | Optimal          | Adequate          | High             | High               |
| Low            | Optimal          | Adequate          | Medium           | Low                |
| High           | Low              | Adequate          | High             | Medium             |
| Moderate       | High             | Low               | Medium           | Low                |
| High           | Optimal          | Low               | Low              | Medium             |
```

This structured approach parallels the detailed monitoring and complex interplay inherent in the science of photosynthesis.

===== ALIGNMENT TREE =====

```mermaid
graph TD
  n0("D")
  n1("D")
  n2("B")
  n3("B")
  n4("S")
  n5("S")
  n6("B")
  n7("B")
  n8("S")
  n9("S")
  n10("D")
  n11("D")
  n12("D")
  n13("D")
  n0 --> n1
  n1 --> n2
  n2 --> n3
  n3 --> n4
  n4 --> n5
  n5 --> n6
  n6 --> n7
  n7 --> n8
  n8 --> n9
  n9 --> n10
  n10 --> n11
  n11 --> n12
  n12 --> n13
  click n0 href "#state-n0"
  click n1 href "#state-n1"
  click n2 href "#state-n2"
  click n3 href "#state-n3"
  click n4 href "#state-n4"
  click n5 href "#state-n5"
  click n6 href "#state-n6"
  click n7 href "#state-n7"
  click n8 href "#state-n8"
  click n9 href "#state-n9"
  click n10 href "#state-n10"
  click n11 href "#state-n11"
  click n12 href "#state-n12"
  click n13 href "#state-n13"
```
<a id="state-n0"></a>

<details><summary>D – state snapshot</summary>

```json
{
  "before": {
    "topic": "Photosynthesis"
  },
  "after": {
    "topic": "Photosynthesis",
    "prompt": "List 6 concise bullets capturing the essence of \"Photosynthesis\"."
  }
}
```
</details>


<a id="state-n1"></a>

<details><summary>D – state snapshot</summary>

```json
{
  "before": {
    "topic": "Photosynthesis",
    "prompt": "List 6 concise bullets capturing the essence of \"Photosynthesis\"."
  },
  "after": {
    "topic": "Photosynthesis",
    "prompt": "List 6 concise bullets capturing the essence of \"Photosynthesis\".",
    "answer": "- Photosynthesis is the process by which green plants, algae, and some bacteria convert light energy into chemical energy stored in glucose.\n- It occurs primarily in the chloroplasts of plant cells, using chlorophyll to capture sunlight.\n- The process requires water and carbon dioxide as reactants and produces oxygen and glucose as end products.\n- Photosynthesis consists of two main stages: the light-dependent reactions and the Calvin cycle (light-independent reactions).\n- The light-dependent reactions occur in the thylakoid membranes, producing ATP and NADPH.\n- The Calvin cycle occurs in the stroma, utilizing ATP and NADPH to synthesize glucose from carbon dioxide."
  }
}
```
</details>


<a id="state-n2"></a>

<details><summary>B – state snapshot</summary>

```json
{
  "before": {
    "topic": "Photosynthesis",
    "prompt": "List 6 concise bullets capturing the essence of \"Photosynthesis\".",
    "answer": "- Photosynthesis is the process by which green plants, algae, and some bacteria convert light energy into chemical energy stored in glucose.\n- It occurs primarily in the chloroplasts of plant cells, using chlorophyll to capture sunlight.\n- The process requires water and carbon dioxide as reactants and produces oxygen and glucose as end products.\n- Photosynthesis consists of two main stages: the light-dependent reactions and the Calvin cycle (light-independent reactions).\n- The light-dependent reactions occur in the thylakoid membranes, producing ATP and NADPH.\n- The Calvin cycle occurs in the stroma, utilizing ATP and NADPH to synthesize glucose from carbon dioxide."
  },
  "after": {
    "topic": "Photosynthesis",
    "prompt": "Convert the following bullets into a JSON mind‑map.\n\n- Photosynthesis is the process by which green plants, algae, and some bacteria convert light energy into chemical energy stored in glucose.\n- It occurs primarily in the chloroplasts of plant cells, using chlorophyll to capture sunlight.\n- The process requires water and carbon dioxide as reactants and produces oxygen and glucose as end products.\n- Photosynthesis consists of two main stages: the light-dependent reactions and the Calvin cycle (light-independent reactions).\n- The light-dependent reactions occur in the thylakoid membranes, producing ATP and NADPH.\n- The Calvin cycle occurs in the stroma, utilizing ATP and NADPH to synthesize glucose from carbon dioxide.\n\nReturn array with keys: node (string), children (array).",
    "answer": "- Photosynthesis is the process by which green plants, algae, and some bacteria convert light energy into chemical energy stored in glucose.\n- It occurs primarily in the chloroplasts of plant cells, using chlorophyll to capture sunlight.\n- The process requires water and carbon dioxide as reactants and produces oxygen and glucose as end products.\n- Photosynthesis consists of two main stages: the light-dependent reactions and the Calvin cycle (light-independent reactions).\n- The light-dependent reactions occur in the thylakoid membranes, producing ATP and NADPH.\n- The Calvin cycle occurs in the stroma, utilizing ATP and NADPH to synthesize glucose from carbon dioxide."
  }
}
```
</details>


<a id="state-n3"></a>

<details><summary>B – state snapshot</summary>

```json
{
  "before": {
    "topic": "Photosynthesis",
    "prompt": "Convert the following bullets into a JSON mind‑map.\n\n- Photosynthesis is the process by which green plants, algae, and some bacteria convert light energy into chemical energy stored in glucose.\n- It occurs primarily in the chloroplasts of plant cells, using chlorophyll to capture sunlight.\n- The process requires water and carbon dioxide as reactants and produces oxygen and glucose as end products.\n- Photosynthesis consists of two main stages: the light-dependent reactions and the Calvin cycle (light-independent reactions).\n- The light-dependent reactions occur in the thylakoid membranes, producing ATP and NADPH.\n- The Calvin cycle occurs in the stroma, utilizing ATP and NADPH to synthesize glucose from carbon dioxide.\n\nReturn array with keys: node (string), children (array).",
    "answer": "- Photosynthesis is the process by which green plants, algae, and some bacteria convert light energy into chemical energy stored in glucose.\n- It occurs primarily in the chloroplasts of plant cells, using chlorophyll to capture sunlight.\n- The process requires water and carbon dioxide as reactants and produces oxygen and glucose as end products.\n- Photosynthesis consists of two main stages: the light-dependent reactions and the Calvin cycle (light-independent reactions).\n- The light-dependent reactions occur in the thylakoid membranes, producing ATP and NADPH.\n- The Calvin cycle occurs in the stroma, utilizing ATP and NADPH to synthesize glucose from carbon dioxide."
  },
  "after": {
    "topic": "Photosynthesis",
    "prompt": "Convert the following bullets into a JSON mind‑map.\n\n- Photosynthesis is the process by which green plants, algae, and some bacteria convert light energy into chemical energy stored in glucose.\n- It occurs primarily in the chloroplasts of plant cells, using chlorophyll to capture sunlight.\n- The process requires water and carbon dioxide as reactants and produces oxygen and glucose as end products.\n- Photosynthesis consists of two main stages: the light-dependent reactions and the Calvin cycle (light-independent reactions).\n- The light-dependent reactions occur in the thylakoid membranes, producing ATP and NADPH.\n- The Calvin cycle occurs in the stroma, utilizing ATP and NADPH to synthesize glucose from carbon dioxide.\n\nReturn array with keys: node (string), children (array).",
    "answer": "```json\n[\n  {\n    \"node\": \"Photosynthesis\",\n    \"children\": [\n      {\n        \"node\": \"Definition\",\n        \"children\": [\n          {\n            \"node\": \"Photosynthesis is the process by which green plants, algae, and some bacteria convert light energy into chemical energy stored in glucose\"\n          }\n        ]\n      },\n      {\n        \"node\": \"Location\",\n        \"children\": [\n          {\n            \"node\": \"Occurs primarily in the chloroplasts of plant cells, using chlorophyll to capture sunlight\"\n          }\n        ]\n      },\n      {\n        \"node\": \"Reactants\",\n        \"children\": [\n          {\n            \"node\": \"Water and carbon dioxide\"\n          }\n        ]\n      },\n      {\n        \"node\": \"Products\",\n        \"children\": [\n          {\n            \"node\": \"Oxygen and glucose\"\n          }\n        ]\n      },\n      {\n        \"node\": \"Main Stages\",\n        \"children\": [\n          {\n            \"node\": \"Light-dependent Reactions\",\n            \"children\": [\n              {\n                \"node\": \"Occur in the thylakoid membranes\"\n              },\n              {\n                \"node\": \"Produce ATP and NADPH\"\n              }\n            ]\n          },\n          {\n            \"node\": \"Calvin Cycle (Light-independent Reactions)\",\n            \"children\": [\n              {\n                \"node\": \"Occurs in the stroma\"\n              },\n              {\n                \"node\": \"Utilizes ATP and NADPH to synthesize glucose from carbon dioxide\"\n              }\n            ]\n          }\n        ]\n      }\n    ]\n  }\n]\n```"
  }
}
```
</details>


<a id="state-n4"></a>

<details><summary>S – state snapshot</summary>

```json
{
  "before": {
    "topic": "Photosynthesis",
    "prompt": "Convert the following bullets into a JSON mind‑map.\n\n- Photosynthesis is the process by which green plants, algae, and some bacteria convert light energy into chemical energy stored in glucose.\n- It occurs primarily in the chloroplasts of plant cells, using chlorophyll to capture sunlight.\n- The process requires water and carbon dioxide as reactants and produces oxygen and glucose as end products.\n- Photosynthesis consists of two main stages: the light-dependent reactions and the Calvin cycle (light-independent reactions).\n- The light-dependent reactions occur in the thylakoid membranes, producing ATP and NADPH.\n- The Calvin cycle occurs in the stroma, utilizing ATP and NADPH to synthesize glucose from carbon dioxide.\n\nReturn array with keys: node (string), children (array).",
    "answer": "```json\n[\n  {\n    \"node\": \"Photosynthesis\",\n    \"children\": [\n      {\n        \"node\": \"Definition\",\n        \"children\": [\n          {\n            \"node\": \"Photosynthesis is the process by which green plants, algae, and some bacteria convert light energy into chemical energy stored in glucose\"\n          }\n        ]\n      },\n      {\n        \"node\": \"Location\",\n        \"children\": [\n          {\n            \"node\": \"Occurs primarily in the chloroplasts of plant cells, using chlorophyll to capture sunlight\"\n          }\n        ]\n      },\n      {\n        \"node\": \"Reactants\",\n        \"children\": [\n          {\n            \"node\": \"Water and carbon dioxide\"\n          }\n        ]\n      },\n      {\n        \"node\": \"Products\",\n        \"children\": [\n          {\n            \"node\": \"Oxygen and glucose\"\n          }\n        ]\n      },\n      {\n        \"node\": \"Main Stages\",\n        \"children\": [\n          {\n            \"node\": \"Light-dependent Reactions\",\n            \"children\": [\n              {\n                \"node\": \"Occur in the thylakoid membranes\"\n              },\n              {\n                \"node\": \"Produce ATP and NADPH\"\n              }\n            ]\n          },\n          {\n            \"node\": \"Calvin Cycle (Light-independent Reactions)\",\n            \"children\": [\n              {\n                \"node\": \"Occurs in the stroma\"\n              },\n              {\n                \"node\": \"Utilizes ATP and NADPH to synthesize glucose from carbon dioxide\"\n              }\n            ]\n          }\n        ]\n      }\n    ]\n  }\n]\n```"
  },
  "after": {
    "topic": "Photosynthesis",
    "prompt": "Here is a mind‑map in JSON:\n```json\n[\n  {\n    \"node\": \"Photosynthesis\",\n    \"children\": [\n      {\n        \"node\": \"Definition\",\n        \"children\": [\n          {\n            \"node\": \"Photosynthesis is the process by which green plants, algae, and some bacteria convert light energy into chemical energy stored in glucose\"\n          }\n        ]\n      },\n      {\n        \"node\": \"Location\",\n        \"children\": [\n          {\n            \"node\": \"Occurs primarily in the chloroplasts of plant cells, using chlorophyll to capture sunlight\"\n          }\n        ]\n      },\n      {\n        \"node\": \"Reactants\",\n        \"children\": [\n          {\n            \"node\": \"Water and carbon dioxide\"\n          }\n        ]\n      },\n      {\n        \"node\": \"Products\",\n        \"children\": [\n          {\n            \"node\": \"Oxygen and glucose\"\n          }\n        ]\n      },\n      {\n        \"node\": \"Main Stages\",\n        \"children\": [\n          {\n            \"node\": \"Light-dependent Reactions\",\n            \"children\": [\n              {\n                \"node\": \"Occur in the thylakoid membranes\"\n              },\n              {\n                \"node\": \"Produce ATP and NADPH\"\n              }\n            ]\n          },\n          {\n            \"node\": \"Calvin Cycle (Light-independent Reactions)\",\n            \"children\": [\n              {\n                \"node\": \"Occurs in the stroma\"\n              },\n              {\n                \"node\": \"Utilizes ATP and NADPH to synthesize glucose from carbon dioxide\"\n              }\n            ]\n          }\n        ]\n      }\n    ]\n  }\n]\n```\n\nCompress its essence into a single haiku (5‑7‑5).",
    "answer": "```json\n[\n  {\n    \"node\": \"Photosynthesis\",\n    \"children\": [\n      {\n        \"node\": \"Definition\",\n        \"children\": [\n          {\n            \"node\": \"Photosynthesis is the process by which green plants, algae, and some bacteria convert light energy into chemical energy stored in glucose\"\n          }\n        ]\n      },\n      {\n        \"node\": \"Location\",\n        \"children\": [\n          {\n            \"node\": \"Occurs primarily in the chloroplasts of plant cells, using chlorophyll to capture sunlight\"\n          }\n        ]\n      },\n      {\n        \"node\": \"Reactants\",\n        \"children\": [\n          {\n            \"node\": \"Water and carbon dioxide\"\n          }\n        ]\n      },\n      {\n        \"node\": \"Products\",\n        \"children\": [\n          {\n            \"node\": \"Oxygen and glucose\"\n          }\n        ]\n      },\n      {\n        \"node\": \"Main Stages\",\n        \"children\": [\n          {\n            \"node\": \"Light-dependent Reactions\",\n            \"children\": [\n              {\n                \"node\": \"Occur in the thylakoid membranes\"\n              },\n              {\n                \"node\": \"Produce ATP and NADPH\"\n              }\n            ]\n          },\n          {\n            \"node\": \"Calvin Cycle (Light-independent Reactions)\",\n            \"children\": [\n              {\n                \"node\": \"Occurs in the stroma\"\n              },\n              {\n                \"node\": \"Utilizes ATP and NADPH to synthesize glucose from carbon dioxide\"\n              }\n            ]\n          }\n        ]\n      }\n    ]\n  }\n]\n```"
  }
}
```
</details>


<a id="state-n5"></a>

<details><summary>S – state snapshot</summary>

```json
{
  "before": {
    "topic": "Photosynthesis",
    "prompt": "Here is a mind‑map in JSON:\n```json\n[\n  {\n    \"node\": \"Photosynthesis\",\n    \"children\": [\n      {\n        \"node\": \"Definition\",\n        \"children\": [\n          {\n            \"node\": \"Photosynthesis is the process by which green plants, algae, and some bacteria convert light energy into chemical energy stored in glucose\"\n          }\n        ]\n      },\n      {\n        \"node\": \"Location\",\n        \"children\": [\n          {\n            \"node\": \"Occurs primarily in the chloroplasts of plant cells, using chlorophyll to capture sunlight\"\n          }\n        ]\n      },\n      {\n        \"node\": \"Reactants\",\n        \"children\": [\n          {\n            \"node\": \"Water and carbon dioxide\"\n          }\n        ]\n      },\n      {\n        \"node\": \"Products\",\n        \"children\": [\n          {\n            \"node\": \"Oxygen and glucose\"\n          }\n        ]\n      },\n      {\n        \"node\": \"Main Stages\",\n        \"children\": [\n          {\n            \"node\": \"Light-dependent Reactions\",\n            \"children\": [\n              {\n                \"node\": \"Occur in the thylakoid membranes\"\n              },\n              {\n                \"node\": \"Produce ATP and NADPH\"\n              }\n            ]\n          },\n          {\n            \"node\": \"Calvin Cycle (Light-independent Reactions)\",\n            \"children\": [\n              {\n                \"node\": \"Occurs in the stroma\"\n              },\n              {\n                \"node\": \"Utilizes ATP and NADPH to synthesize glucose from carbon dioxide\"\n              }\n            ]\n          }\n        ]\n      }\n    ]\n  }\n]\n```\n\nCompress its essence into a single haiku (5‑7‑5).",
    "answer": "```json\n[\n  {\n    \"node\": \"Photosynthesis\",\n    \"children\": [\n      {\n        \"node\": \"Definition\",\n        \"children\": [\n          {\n            \"node\": \"Photosynthesis is the process by which green plants, algae, and some bacteria convert light energy into chemical energy stored in glucose\"\n          }\n        ]\n      },\n      {\n        \"node\": \"Location\",\n        \"children\": [\n          {\n            \"node\": \"Occurs primarily in the chloroplasts of plant cells, using chlorophyll to capture sunlight\"\n          }\n        ]\n      },\n      {\n        \"node\": \"Reactants\",\n        \"children\": [\n          {\n            \"node\": \"Water and carbon dioxide\"\n          }\n        ]\n      },\n      {\n        \"node\": \"Products\",\n        \"children\": [\n          {\n            \"node\": \"Oxygen and glucose\"\n          }\n        ]\n      },\n      {\n        \"node\": \"Main Stages\",\n        \"children\": [\n          {\n            \"node\": \"Light-dependent Reactions\",\n            \"children\": [\n              {\n                \"node\": \"Occur in the thylakoid membranes\"\n              },\n              {\n                \"node\": \"Produce ATP and NADPH\"\n              }\n            ]\n          },\n          {\n            \"node\": \"Calvin Cycle (Light-independent Reactions)\",\n            \"children\": [\n              {\n                \"node\": \"Occurs in the stroma\"\n              },\n              {\n                \"node\": \"Utilizes ATP and NADPH to synthesize glucose from carbon dioxide\"\n              }\n            ]\n          }\n        ]\n      }\n    ]\n  }\n]\n```"
  },
  "after": {
    "topic": "Photosynthesis",
    "prompt": "Here is a mind‑map in JSON:\n```json\n[\n  {\n    \"node\": \"Photosynthesis\",\n    \"children\": [\n      {\n        \"node\": \"Definition\",\n        \"children\": [\n          {\n            \"node\": \"Photosynthesis is the process by which green plants, algae, and some bacteria convert light energy into chemical energy stored in glucose\"\n          }\n        ]\n      },\n      {\n        \"node\": \"Location\",\n        \"children\": [\n          {\n            \"node\": \"Occurs primarily in the chloroplasts of plant cells, using chlorophyll to capture sunlight\"\n          }\n        ]\n      },\n      {\n        \"node\": \"Reactants\",\n        \"children\": [\n          {\n            \"node\": \"Water and carbon dioxide\"\n          }\n        ]\n      },\n      {\n        \"node\": \"Products\",\n        \"children\": [\n          {\n            \"node\": \"Oxygen and glucose\"\n          }\n        ]\n      },\n      {\n        \"node\": \"Main Stages\",\n        \"children\": [\n          {\n            \"node\": \"Light-dependent Reactions\",\n            \"children\": [\n              {\n                \"node\": \"Occur in the thylakoid membranes\"\n              },\n              {\n                \"node\": \"Produce ATP and NADPH\"\n              }\n            ]\n          },\n          {\n            \"node\": \"Calvin Cycle (Light-independent Reactions)\",\n            \"children\": [\n              {\n                \"node\": \"Occurs in the stroma\"\n              },\n              {\n                \"node\": \"Utilizes ATP and NADPH to synthesize glucose from carbon dioxide\"\n              }\n            ]\n          }\n        ]\n      }\n    ]\n  }\n]\n```\n\nCompress its essence into a single haiku (5‑7‑5).",
    "answer": "Plants turn light to fuel,  \nChloroplasts work, day and night,  \nLife's breath: glucose, air."
  }
}
```
</details>


<a id="state-n6"></a>

<details><summary>B – state snapshot</summary>

```json
{
  "before": {
    "topic": "Photosynthesis",
    "prompt": "Here is a mind‑map in JSON:\n```json\n[\n  {\n    \"node\": \"Photosynthesis\",\n    \"children\": [\n      {\n        \"node\": \"Definition\",\n        \"children\": [\n          {\n            \"node\": \"Photosynthesis is the process by which green plants, algae, and some bacteria convert light energy into chemical energy stored in glucose\"\n          }\n        ]\n      },\n      {\n        \"node\": \"Location\",\n        \"children\": [\n          {\n            \"node\": \"Occurs primarily in the chloroplasts of plant cells, using chlorophyll to capture sunlight\"\n          }\n        ]\n      },\n      {\n        \"node\": \"Reactants\",\n        \"children\": [\n          {\n            \"node\": \"Water and carbon dioxide\"\n          }\n        ]\n      },\n      {\n        \"node\": \"Products\",\n        \"children\": [\n          {\n            \"node\": \"Oxygen and glucose\"\n          }\n        ]\n      },\n      {\n        \"node\": \"Main Stages\",\n        \"children\": [\n          {\n            \"node\": \"Light-dependent Reactions\",\n            \"children\": [\n              {\n                \"node\": \"Occur in the thylakoid membranes\"\n              },\n              {\n                \"node\": \"Produce ATP and NADPH\"\n              }\n            ]\n          },\n          {\n            \"node\": \"Calvin Cycle (Light-independent Reactions)\",\n            \"children\": [\n              {\n                \"node\": \"Occurs in the stroma\"\n              },\n              {\n                \"node\": \"Utilizes ATP and NADPH to synthesize glucose from carbon dioxide\"\n              }\n            ]\n          }\n        ]\n      }\n    ]\n  }\n]\n```\n\nCompress its essence into a single haiku (5‑7‑5).",
    "answer": "Plants turn light to fuel,  \nChloroplasts work, day and night,  \nLife's breath: glucose, air."
  },
  "after": {
    "topic": "Photosynthesis",
    "prompt": "Re‑inflate the haiku into a 120‑word fantasy analogy story.",
    "answer": "Plants turn light to fuel,  \nChloroplasts work, day and night,  \nLife's breath: glucose, air."
  }
}
```
</details>


<a id="state-n7"></a>

<details><summary>B – state snapshot</summary>

```json
{
  "before": {
    "topic": "Photosynthesis",
    "prompt": "Re‑inflate the haiku into a 120‑word fantasy analogy story.",
    "answer": "Plants turn light to fuel,  \nChloroplasts work, day and night,  \nLife's breath: glucose, air."
  },
  "after": {
    "topic": "Photosynthesis",
    "prompt": "Re‑inflate the haiku into a 120‑word fantasy analogy story.",
    "answer": "In a land where seasons danced like fleeting dreams, there existed a forest whispered of in legends. This forest, draped in the delicate hues of autumn, was said to be the meeting place of time and whimsy. Each leaf, a note in nature’s symphony, shimmered with golden tales of old.\n\nFion, a curious wanderer, journeyed through the forest’s embrace, guided by the rustling song of the breeze. He marveled at how the leaves fell, not as withering remnants, but like graceful phoenix feathers, each descent a promise of spring’s rebirth. The whispers of the trees told stories of resilience and renewal, of cycles unbroken by time.\n\nAs Fion walked deeper, he realized that the forest was a tapestry, weaving together the wisdom of ages and the vitality of new beginnings, a sanctuary where the past and future waltzed in harmony."
  }
}
```
</details>


<a id="state-n8"></a>

<details><summary>S – state snapshot</summary>

```json
{
  "before": {
    "topic": "Photosynthesis",
    "prompt": "Re‑inflate the haiku into a 120‑word fantasy analogy story.",
    "answer": "In a land where seasons danced like fleeting dreams, there existed a forest whispered of in legends. This forest, draped in the delicate hues of autumn, was said to be the meeting place of time and whimsy. Each leaf, a note in nature’s symphony, shimmered with golden tales of old.\n\nFion, a curious wanderer, journeyed through the forest’s embrace, guided by the rustling song of the breeze. He marveled at how the leaves fell, not as withering remnants, but like graceful phoenix feathers, each descent a promise of spring’s rebirth. The whispers of the trees told stories of resilience and renewal, of cycles unbroken by time.\n\nAs Fion walked deeper, he realized that the forest was a tapestry, weaving together the wisdom of ages and the vitality of new beginnings, a sanctuary where the past and future waltzed in harmony."
  },
  "after": {
    "topic": "Photosynthesis",
    "prompt": "Turn the analogy into a 3‑column SQL CREATE TABLE + INSERTs: entity TEXT, role TEXT, link TEXT.",
    "answer": "In a land where seasons danced like fleeting dreams, there existed a forest whispered of in legends. This forest, draped in the delicate hues of autumn, was said to be the meeting place of time and whimsy. Each leaf, a note in nature’s symphony, shimmered with golden tales of old.\n\nFion, a curious wanderer, journeyed through the forest’s embrace, guided by the rustling song of the breeze. He marveled at how the leaves fell, not as withering remnants, but like graceful phoenix feathers, each descent a promise of spring’s rebirth. The whispers of the trees told stories of resilience and renewal, of cycles unbroken by time.\n\nAs Fion walked deeper, he realized that the forest was a tapestry, weaving together the wisdom of ages and the vitality of new beginnings, a sanctuary where the past and future waltzed in harmony."
  }
}
```
</details>


<a id="state-n9"></a>

<details><summary>S – state snapshot</summary>

```json
{
  "before": {
    "topic": "Photosynthesis",
    "prompt": "Turn the analogy into a 3‑column SQL CREATE TABLE + INSERTs: entity TEXT, role TEXT, link TEXT.",
    "answer": "In a land where seasons danced like fleeting dreams, there existed a forest whispered of in legends. This forest, draped in the delicate hues of autumn, was said to be the meeting place of time and whimsy. Each leaf, a note in nature’s symphony, shimmered with golden tales of old.\n\nFion, a curious wanderer, journeyed through the forest’s embrace, guided by the rustling song of the breeze. He marveled at how the leaves fell, not as withering remnants, but like graceful phoenix feathers, each descent a promise of spring’s rebirth. The whispers of the trees told stories of resilience and renewal, of cycles unbroken by time.\n\nAs Fion walked deeper, he realized that the forest was a tapestry, weaving together the wisdom of ages and the vitality of new beginnings, a sanctuary where the past and future waltzed in harmony."
  },
  "after": {
    "topic": "Photosynthesis",
    "prompt": "Turn the analogy into a 3‑column SQL CREATE TABLE + INSERTs: entity TEXT, role TEXT, link TEXT.",
    "answer": "Sure! Let's take an analogy and convert it into SQL statements with a three-column table structure: `entity`, `role`, and `link`.\n\n### Analogy:\n\"The sun is to day as the moon is to night.\"\n\n### SQL Conversion:\n\n```sql\n-- Create the table with three columns: entity, role, and link\nCREATE TABLE Analogy (\n    entity TEXT,\n    role TEXT,\n    link TEXT\n);\n\n-- Insert entries into the table based on the analogy\nINSERT INTO Analogy (entity, role, link) VALUES ('sun', 'is to', 'day');\nINSERT INTO Analogy (entity, role, link) VALUES ('moon', 'is to', 'night');\n```\n\nThis SQL statement creates a table called `Analogy` and populates it with entries derived from the given analogy. Each element of the analogy is mapped to an `entity`, with the relationship or role it plays being represented in the `role` column and the corresponding counterpart in the `link` column."
  }
}
```
</details>


<a id="state-n10"></a>

<details><summary>D – state snapshot</summary>

```json
{
  "before": {
    "topic": "Photosynthesis",
    "prompt": "Turn the analogy into a 3‑column SQL CREATE TABLE + INSERTs: entity TEXT, role TEXT, link TEXT.",
    "answer": "Sure! Let's take an analogy and convert it into SQL statements with a three-column table structure: `entity`, `role`, and `link`.\n\n### Analogy:\n\"The sun is to day as the moon is to night.\"\n\n### SQL Conversion:\n\n```sql\n-- Create the table with three columns: entity, role, and link\nCREATE TABLE Analogy (\n    entity TEXT,\n    role TEXT,\n    link TEXT\n);\n\n-- Insert entries into the table based on the analogy\nINSERT INTO Analogy (entity, role, link) VALUES ('sun', 'is to', 'day');\nINSERT INTO Analogy (entity, role, link) VALUES ('moon', 'is to', 'night');\n```\n\nThis SQL statement creates a table called `Analogy` and populates it with entries derived from the given analogy. Each element of the analogy is mapped to an `entity`, with the relationship or role it plays being represented in the `role` column and the corresponding counterpart in the `link` column."
  },
  "after": {
    "topic": "Photosynthesis",
    "prompt": "Turn the analogy into a 3‑column SQL CREATE TABLE + INSERTs: entity TEXT, role TEXT, link TEXT.",
    "answer": "Sure! Let's take an analogy and convert it into SQL statements with a three-column table structure: `entity`, `role`, and `link`.\n\n### Analogy:\n\"The sun is to day as the moon is to night.\"\n\n### SQL Conversion:\n\n```sql\n-- Create the table with three columns: entity, role, and link\nCREATE TABLE Analogy (\n    entity TEXT,\n    role TEXT,\n    link TEXT\n);\n\n-- Insert entries into the table based on the analogy\nINSERT INTO Analogy (entity, role, link) VALUES ('sun', 'is to', 'day');\nINSERT INTO Analogy (entity, role, link) VALUES ('moon', 'is to', 'night');\n```\n\nThis SQL statement creates a table called `Analogy` and populates it with entries derived from the given analogy. Each element of the analogy is mapped to an `entity`, with the relationship or role it plays being represented in the `role` column and the corresponding counterpart in the `link` column.",
    "rows": [
      [
        "entity",
        "role",
        "link"
      ],
      [
        "entity",
        "role",
        "link"
      ]
    ]
  }
}
```
</details>


<a id="state-n11"></a>

<details><summary>D – state snapshot</summary>

```json
{
  "before": {
    "topic": "Photosynthesis",
    "prompt": "Turn the analogy into a 3‑column SQL CREATE TABLE + INSERTs: entity TEXT, role TEXT, link TEXT.",
    "answer": "Sure! Let's take an analogy and convert it into SQL statements with a three-column table structure: `entity`, `role`, and `link`.\n\n### Analogy:\n\"The sun is to day as the moon is to night.\"\n\n### SQL Conversion:\n\n```sql\n-- Create the table with three columns: entity, role, and link\nCREATE TABLE Analogy (\n    entity TEXT,\n    role TEXT,\n    link TEXT\n);\n\n-- Insert entries into the table based on the analogy\nINSERT INTO Analogy (entity, role, link) VALUES ('sun', 'is to', 'day');\nINSERT INTO Analogy (entity, role, link) VALUES ('moon', 'is to', 'night');\n```\n\nThis SQL statement creates a table called `Analogy` and populates it with entries derived from the given analogy. Each element of the analogy is mapped to an `entity`, with the relationship or role it plays being represented in the `role` column and the corresponding counterpart in the `link` column.",
    "rows": [
      [
        "entity",
        "role",
        "link"
      ],
      [
        "entity",
        "role",
        "link"
      ]
    ]
  },
  "after": {
    "topic": "Photosynthesis",
    "prompt": "Turn the analogy into a 3‑column SQL CREATE TABLE + INSERTs: entity TEXT, role TEXT, link TEXT.",
    "answer": "Sure! Let's take an analogy and convert it into SQL statements with a three-column table structure: `entity`, `role`, and `link`.\n\n### Analogy:\n\"The sun is to day as the moon is to night.\"\n\n### SQL Conversion:\n\n```sql\n-- Create the table with three columns: entity, role, and link\nCREATE TABLE Analogy (\n    entity TEXT,\n    role TEXT,\n    link TEXT\n);\n\n-- Insert entries into the table based on the analogy\nINSERT INTO Analogy (entity, role, link) VALUES ('sun', 'is to', 'day');\nINSERT INTO Analogy (entity, role, link) VALUES ('moon', 'is to', 'night');\n```\n\nThis SQL statement creates a table called `Analogy` and populates it with entries derived from the given analogy. Each element of the analogy is mapped to an `entity`, with the relationship or role it plays being represented in the `role` column and the corresponding counterpart in the `link` column.",
    "rows": [
      [
        "entity",
        "role",
        "link"
      ],
      [
        "entity",
        "role",
        "link"
      ]
    ],
    "ranked": [
      {
        "entity": "entity",
        "role": "role",
        "score": 54.076629388560214
      },
      {
        "entity": "entity",
        "role": "role",
        "score": 52.282528021683916
      }
    ]
  }
}
```
</details>


<a id="state-n12"></a>

<details><summary>D – state snapshot</summary>

```json
{
  "before": {
    "topic": "Photosynthesis",
    "prompt": "Turn the analogy into a 3‑column SQL CREATE TABLE + INSERTs: entity TEXT, role TEXT, link TEXT.",
    "answer": "Sure! Let's take an analogy and convert it into SQL statements with a three-column table structure: `entity`, `role`, and `link`.\n\n### Analogy:\n\"The sun is to day as the moon is to night.\"\n\n### SQL Conversion:\n\n```sql\n-- Create the table with three columns: entity, role, and link\nCREATE TABLE Analogy (\n    entity TEXT,\n    role TEXT,\n    link TEXT\n);\n\n-- Insert entries into the table based on the analogy\nINSERT INTO Analogy (entity, role, link) VALUES ('sun', 'is to', 'day');\nINSERT INTO Analogy (entity, role, link) VALUES ('moon', 'is to', 'night');\n```\n\nThis SQL statement creates a table called `Analogy` and populates it with entries derived from the given analogy. Each element of the analogy is mapped to an `entity`, with the relationship or role it plays being represented in the `role` column and the corresponding counterpart in the `link` column.",
    "rows": [
      [
        "entity",
        "role",
        "link"
      ],
      [
        "entity",
        "role",
        "link"
      ]
    ],
    "ranked": [
      {
        "entity": "entity",
        "role": "role",
        "score": 54.076629388560214
      },
      {
        "entity": "entity",
        "role": "role",
        "score": 52.282528021683916
      }
    ]
  },
  "after": {
    "topic": "Photosynthesis",
    "prompt": "Craft a 200‑word explanation that relates the SQL table back to \"Photosynthesis\". Include a markdown table using ctx.ranked.",
    "answer": "Sure! Let's take an analogy and convert it into SQL statements with a three-column table structure: `entity`, `role`, and `link`.\n\n### Analogy:\n\"The sun is to day as the moon is to night.\"\n\n### SQL Conversion:\n\n```sql\n-- Create the table with three columns: entity, role, and link\nCREATE TABLE Analogy (\n    entity TEXT,\n    role TEXT,\n    link TEXT\n);\n\n-- Insert entries into the table based on the analogy\nINSERT INTO Analogy (entity, role, link) VALUES ('sun', 'is to', 'day');\nINSERT INTO Analogy (entity, role, link) VALUES ('moon', 'is to', 'night');\n```\n\nThis SQL statement creates a table called `Analogy` and populates it with entries derived from the given analogy. Each element of the analogy is mapped to an `entity`, with the relationship or role it plays being represented in the `role` column and the corresponding counterpart in the `link` column.",
    "rows": [
      [
        "entity",
        "role",
        "link"
      ],
      [
        "entity",
        "role",
        "link"
      ]
    ],
    "ranked": [
      {
        "entity": "entity",
        "role": "role",
        "score": 54.076629388560214
      },
      {
        "entity": "entity",
        "role": "role",
        "score": 52.282528021683916
      }
    ]
  }
}
```
</details>


<a id="state-n13"></a>

<details><summary>D – state snapshot</summary>

```json
{
  "before": {
    "topic": "Photosynthesis",
    "prompt": "Craft a 200‑word explanation that relates the SQL table back to \"Photosynthesis\". Include a markdown table using ctx.ranked.",
    "answer": "Sure! Let's take an analogy and convert it into SQL statements with a three-column table structure: `entity`, `role`, and `link`.\n\n### Analogy:\n\"The sun is to day as the moon is to night.\"\n\n### SQL Conversion:\n\n```sql\n-- Create the table with three columns: entity, role, and link\nCREATE TABLE Analogy (\n    entity TEXT,\n    role TEXT,\n    link TEXT\n);\n\n-- Insert entries into the table based on the analogy\nINSERT INTO Analogy (entity, role, link) VALUES ('sun', 'is to', 'day');\nINSERT INTO Analogy (entity, role, link) VALUES ('moon', 'is to', 'night');\n```\n\nThis SQL statement creates a table called `Analogy` and populates it with entries derived from the given analogy. Each element of the analogy is mapped to an `entity`, with the relationship or role it plays being represented in the `role` column and the corresponding counterpart in the `link` column.",
    "rows": [
      [
        "entity",
        "role",
        "link"
      ],
      [
        "entity",
        "role",
        "link"
      ]
    ],
    "ranked": [
      {
        "entity": "entity",
        "role": "role",
        "score": 54.076629388560214
      },
      {
        "entity": "entity",
        "role": "role",
        "score": 52.282528021683916
      }
    ]
  },
  "after": {
    "topic": "Photosynthesis",
    "prompt": "Craft a 200‑word explanation that relates the SQL table back to \"Photosynthesis\". Include a markdown table using ctx.ranked.",
    "answer": "Certainly! \n\nPhotosynthesis can be likened to an SQL table, where each aspect of the process can be organized into distinct columns and rows for clarity and analysis. Imagine a table named `PhotosynthesisProcess` that stores essential data about the conditions and elements involved in photosynthesis. The columns can represent factors such as `LightIntensity`, `CO2Concentration`, `WaterAvailability`, `ChlorophyllLevel`, and `PhotosynthesisRate`. Each row would then correspond to a specific set of conditions at a given time, capturing the dynamic interactions that drive this critical process.\n\nThe SQL table helps simulate how changing one factor affects the photosynthetic rate, similar to querying the database to predict outcomes or identify patterns. By analyzing this data, scientists can gain insights into how plants convert light energy into chemical energy, just as a SQL query would help retrieve information from a structured dataset.\n\nHere is a representation of such a table in markdown syntax:\n\n```markdown\n| LightIntensity | CO2Concentration | WaterAvailability | ChlorophyllLevel | PhotosynthesisRate |\n|----------------|------------------|-------------------|------------------|--------------------|\n| High           | Optimal          | Adequate          | High             | High               |\n| Low            | Optimal          | Adequate          | Medium           | Low                |\n| High           | Low              | Adequate          | High             | Medium             |\n| Moderate       | High             | Low               | Medium           | Low                |\n| High           | Optimal          | Low               | Low              | Medium             |\n```\n\nThis structured approach parallels the detailed monitoring and complex interplay inherent in the science of photosynthesis.",
    "rows": [
      [
        "entity",
        "role",
        "link"
      ],
      [
        "entity",
        "role",
        "link"
      ]
    ],
    "ranked": [
      {
        "entity": "entity",
        "role": "role",
        "score": 54.076629388560214
      },
      {
        "entity": "entity",
        "role": "role",
        "score": 52.282528021683916
      }
    ]
  }
}
```
</details>
 */
