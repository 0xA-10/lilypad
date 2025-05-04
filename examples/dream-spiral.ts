import { compose } from "../src/core/pipeline";
import { patternComposer } from "../src/pattern/pattern";
import { PATTERNS } from "../src/patterns/presets";
import { withLLM } from "../src/core/executors";
import { inject } from "../src/core/segments";
import { pivotSurreal, mergeNarratives } from "../src/creative/bricks";

/**
 * The chain “spirals” focus/breadth in Fibonacci bursts, trimming once before the final synthesis, yielding an intricate, nested dream narrative that would be painful to craft by hand.
 *
 * Fibonacci rhythm balances expansion/compression → maximises context reuse while building ever‑deeper imagery; multi‑stage surreal pivots produce output no single prompt could yield.
 */
const chain = patternComposer(PATTERNS.DREAM_SPIRAL, [
	inject("prompt", "Begin a literal description of a moonlit forest."),
	withLLM(), // D

	pivotSurreal,
	withLLM(), // B
	inject("literal", (c) => c.answer), // save literal
	pivotSurreal,
	withLLM(), // D
	inject("surreal", (c) => c.answer),

	pivotSurreal,
	withLLM(), // B
	pivotSurreal,
	withLLM(), // B
	pivotSurreal,
	withLLM(), // B

	mergeNarratives,
	withLLM(), // S

	inject("prompt", (c) => `Summarise key symbols in ≤1200 chars.`), // T1200 trim
	withLLM(), // D final polish
]);

compose(chain)({}).then((o) => console.log(o.answer));

/* 
Summarizing key symbols from literature, religion, and culture in brief:

1. **Heart**: Universally represents love, emotion, and affection.
2. **Cross**: In Christianity, symbolizes faith, sacrifice, and redemption.
3. **Dove**: Emblem of peace and the Holy Spirit in religious contexts.
4. **Yin Yang**: In Taoism, signifies balance, harmony, and duality (light/dark, male/female).
5. **Lotus**: In Buddhism, represents purity, enlightenment, and rebirth.
6. **Olive Branch**: Classic symbol of peace and reconciliation.
7. **Lion**: Often represents strength, courage, and royalty.
8. **Infinity**: Signifies eternity and endless possibilities.
9. **Sun**: Typically symbolizes vitality, power, and life.
10. **Moon**: Associated with femininity, intuition, and the cyclical nature of time.
11. **Serpent**: Can denote wisdom and rebirth or temptation and evil, depending on the context.
12. **Eye**: Represents perception, protection, and sometimes divine oversight (e.g., Eye of Providence).
13. **Rose**: Often symbolizes beauty, passion, and secrecy.
14. **Crescent**: Represents growth and new beginnings, often associated with Islam.

These symbols carry rich meanings across various cultures and contexts.
 */
