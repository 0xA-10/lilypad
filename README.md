# lilypad

Floating gracefully between prompts like pads on a pond 🌿🐸.

`lilypad` is a tiny, functional builder for chaining large‑language‑model prompt steps in Node.js/TypeScript. Currently supporting OpenAI models.

`lilypad` chains prompt “pads” inside a single live Responses conversation by default.
Call `fresh()` to hop onto a brand-new pad (conversation).

---

## 🚀 Quick Start

```bash
git clone <your-repo-url>
cd lilypad
pnpm install
export OPENAI_API_KEY="sk-..." # or use .env
pnpm run demo:spend   # runs examples/spend-optimizer.ts via ts-node
```

---

## 🛠 Usage

```ts
import { lilypad, fresh } from "lilypad";
import { analyzeValue, brainstormAlternatives, filterByThreshold, critiqueAndTighten } from "lilypad";

const pipeline = lilypad(
	analyzeValue,
	brainstormAlternatives,
	filterByThreshold(10),
	fresh(), // ← fresh session & transcript
	critiqueAndTighten,
);

(async () => {
	const { data } = await pipeline.run({ spendingItem: "Gym membership" });
	console.log(data.recommendations);
})();
```

---

## 🔧 Development Setup

```bash
# 1. Install deps
pnpm install

# 2. Build TypeScript (optional for the demo)
pnpm run build

# 3. Run tests (unit & integration with mocked Responses)
pnpm test

# 4. Demo
pnpm run demo:spend
```
