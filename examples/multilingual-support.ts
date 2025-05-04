import { compose } from "../src/core/pipeline";
import { withLLM } from "../src/core/executors";
import { inject } from "../src/core/segments";

/* tiny demo: detect → translate → summarise → sentiment */

export default compose(
	inject("prompt", 'Detect language of: "Je suis très heureux."'),
	withLLM(),
	inject("prompt", (c) => `Translate to English: ${c.answer}`),
	withLLM(),
	inject("prompt", (c) => `Summarise in 10 words: ${c.answer}`),
	withLLM(),
	inject("prompt", (c) => `Sentiment score (‑1..1) of: ${c.answer}`),
	withLLM(),
)({}).then((o) => console.log(o.answer));

/* 
The sentiment score for both the French sentence "Je suis très heureux." and its English translation "I am very happy." would likely be quite positive, closer to 1 on the sentiment scale of - 1 to 1. This is because the phrase expresses a high degree of happiness and positivity.
 */
