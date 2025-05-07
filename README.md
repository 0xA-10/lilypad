# lilypad v0.2 – Stateful Pipelines on OpenAI Responses API 🐸🌿

`lilypad` chains prompt “pads” inside a single live Responses conversation by default.
Call `fresh()` to hop onto a brand-new pad (conversation).

---

## ✨ New in v0.2

- **True session continuity** via OpenAI Responses API (`conversation_id` persists).
- `fresh()` now resets both transcript **and** session.
- No legacy chat adapter—built for Responses API.
- Same elegant `lilypad(stepA, stepB).run(input)` API.

---

## 🚀 Quick Start

```bash
git clone <your-repo-url>
cd lilypad
pnpm install          # or npm/yarn install
export OPENAI_API_KEY="sk-..."
pnpm run demo:spend   # runs examples/spend-optimizer.ts via ts-node
```

---

## 🛠 Usage

```ts
import { lilypad, fresh } from 'lilypad';
import {
  analyzeValue,
  brainstormAlternatives,
  filterByThreshold,
  critiqueAndTighten
} from 'lilypad';

const pipeline = lilypad(
  analyzeValue,
  brainstormAlternatives,
  filterByThreshold(10),
  fresh(),         // ← fresh session & transcript
  critiqueAndTighten
);

(async () => {
  const { data } = await pipeline.run({ spendingItem: 'Gym membership' });
  console.log(data.recommendations);
})();
```

---

## 🔧 Development Setup

```bash
# 1. Install deps
pnpm install

# 2. Build TypeScript
pnpm run build

# 3. Run tests (unit & integration with mocked Responses)
pnpm test

# 4. Demo
pnpm run demo:spend
```

---

## 📦 Publish

```bash
pnpm run build
npm publish --access public
```

---

## 🛣️ Roadmap

- Parallel branches (`lilypad.branch(...)`)
- Budget & cost tracking decorators
- Visual pipeline designer
- VSCode snippets & extension

---

## License

MIT © 2025
