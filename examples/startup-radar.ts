import { compose } from "../src/core/pipeline";
import { patternComposer } from "../src/pattern/pattern";
import { PATTERNS } from "../src/patterns/presets";
import { marketCrawl, clusterByTheme, swotMatrix, gapScan, slideDeck } from "../src/biz/bricks";
import { withLLM } from "../src/core/executors";

const chain = patternComposer(PATTERNS.BRIEF, [
	marketCrawl({ sources: ["news", "crunchbase"], k: 60 }),
	withLLM(),
	clusterByTheme({ algo: "embeddings", minSize: 3 }),
	withLLM(),
	swotMatrix,
	withLLM(),
	gapScan({ axes: ["feature", "price", "segment"] }),
	withLLM(),
	slideDeck({ theme: "legal-blue", format: "md" }),
	withLLM(),
]);

compose(chain)({ topic: "AI note‑taking apps for lawyers" }).then((o) => console.log(o.answer));

/* 
Creating a markdown slide deck in the "legal-blue" theme to cover SWOT analysis and gaps involves structuring the content appropriately. Here’s a simple example of how you might organize such a presentation:

```markdown
---
marp: true
theme: legal-blue
paginate: true
headingDivider: 2
---

# SWOT Analysis & Gaps

---

## Agenda

1. Introduction to SWOT
2. Strengths
3. Weaknesses
4. Opportunities
5. Threats
6. Identifying Gaps
7. Conclusion

---

## Introduction to SWOT

- **SWOT Analysis** is a strategic planning technique used to identify:
  - **Strengths**
  - **Weaknesses**
  - **Opportunities**
  - **Threats**
- Helps organizations understand both internal and external factors.

---

## Strengths

- Internal attributes that are helpful to achieving the objective.
- **Examples**:
  - Strong brand recognition
  - Efficient supply chain
  - High customer loyalty

---

## Weaknesses

- Internal attributes that are harmful to achieving the objective.
- **Examples**:
  - Limited product range
  - High turnover rate
  - Outdated technology

---

## Opportunities

- External factors that the organization can exploit to its advantage.
- **Examples**:
  - Emerging markets
  - Technological advancements
  - Strategic alliances

---

## Threats

- External factors that could cause trouble for the organization.
- **Examples**:
  - Increased competition
  - Regulatory changes
  - Economic downturns

---

## Identifying Gaps

- **Gaps** are the areas where the company lacks capabilities or resources.
- Analyzing gaps involves:
  - Comparing current state to desired state
  - Finding barriers to success
  - Developing strategies to close gaps

---

## Conclusion

- **SWOT analysis** provides a comprehensive look at where your organization stands.
- Identifying **gaps** allows you to prioritize efforts and resources.
- Use insights to drive strategic planning and operational improvements.

---

## Questions?

- Thank you for your attention.
- Feel free to ask any questions or share your thoughts!
```

### Notes

- **Theme**: The `legal-blue` theme refers to a stylesheet configuration typically used in slide decks; ensure it's available in your Markdown slide processor.
- **Formatting**: Use headings, bullet points, and dividers to clearly structure the content.
- ** Customization **: Adjust examples and content specifics to fit the actual data or context of your presentation.
 */
