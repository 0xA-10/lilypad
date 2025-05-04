import { compose } from "../src/core/pipeline";
import { patternComposer } from "../src/pattern/pattern";
import { PATTERNS } from "../src/patterns/presets";

import {
	detectGoal,
	microHabitPrompt,
	parseHabits,
	injuryGuard,
	periodizePlan,
	safetyAnnotate,
	toCalendarMarkdown,
} from "../src/health/bricks";
import { withLLM } from "../src/core/executors";

const weeks = 4;
const sessionsPerWeek = 5;

const chain = patternComposer(PATTERNS.FITNESS_FLOW, [
	detectGoal,
	withLLM(),

	microHabitPrompt(weeks * sessionsPerWeek),
	withLLM(),
	parseHabits,

	injuryGuard({ allowedMods: "low-impact" }),
	periodizePlan({ weeks, sessionsPerWeek }),
	safetyAnnotate,
	toCalendarMarkdown,
]);

compose(chain)({
	goal: "Run a 10 K in 9 weeks, can train ≤25 min/day, left‑knee issues.",
}).then((o) => console.log(o.result));

/* 
### Safety Note
> Consult a physician if pain persists.
### Plan
```json
{
  "Week 1": [
    {
      "name": "Brisk Walking",
      "timeMin": 20,
      "domain": "cardio",
      "benefit": "Enhances cardiovascular fitness with low impact on knees."
    },
    {
      "name": "Dynamic Leg Swings",
      "timeMin": 5,
      "domain": "mobility",
      "benefit": "Improves hip flexibility and mobility."
    },
    {
      "name": "High-Knee Marching",
      "timeMin": 10,
      "domain": "cardio",
      "benefit": "Increases heart rate and leg endurance without running."
    },
    {
      "name": "Quad Stretching",
      "timeMin": 5,
      "domain": "mobility",
      "benefit": "Reduces knee tension and increases flexibility."
    },
    {
      "name": "Calf Raises",
      "timeMin": 15,
      "domain": "mobility",
      "benefit": "Strengthens calf muscles and supports knee stability."
    }
  ],
  "Week 2": [
    {
      "name": "Knee Flexion and Extension",
      "timeMin": 10,
      "domain": "mobility",
      "benefit": "Improves knee joint mobility and reduces stiffness."
    },
    {
      "name": "Ankle Circles",
      "timeMin": 5,
      "domain": "mobility",
      "benefit": "Enhances ankle flexibility and supports knee health."
    },
    {
      "name": "Seated Leg Extensions",
      "timeMin": 10,
      "domain": "mobility",
      "benefit": "Strengthens quadriceps and supports knee function."
    },
    {
      "name": "Plank Hold",
      "timeMin": 5,
      "domain": "cardio",
      "benefit": "Improves core stability and overall endurance."
    },
    {
      "name": "Controlled Breathing",
      "timeMin": 10,
      "domain": "cardio",
      "benefit": "Enhances lung capacity and endurance capacity."
    }
  ],
  "Week 3": [
    {
      "name": "Wall Sits",
      "timeMin": 5,
      "domain": "cardio",
      "benefit": "Strengthens lower body without knee strain."
    },
    {
      "name": "Hydration Break",
      "timeMin": 5,
      "domain": "diet",
      "benefit": "Maintains hydration and aids in recovery."
    },
    {
      "name": "Banana Snack",
      "timeMin": 10,
      "domain": "diet",
      "benefit": "Provides quick energy with carbs and potassium."
    },
    {
      "name": "Berry Mix Snack",
      "timeMin": 10,
      "domain": "diet",
      "benefit": "Rich in antioxidants to boost recovery."
    },
    {
      "name": "Protein Shake",
      "timeMin": 5,
      "domain": "diet",
      "benefit": "Aids muscle recovery and growth."
    }
  ],
  "Week 4": [
    {
      "name": "Mindful Eating",
      "timeMin": 10,
      "domain": "diet",
      "benefit": "Enhances digestion and nutrient absorption."
    },
    {
      "name": "Gentle Yoga Poses",
      "timeMin": 15,
      "domain": "mobility",
      "benefit": "Increases flexibility and reduces muscle stiffness."
    },
    {
      "name": "Foam Rolling",
      "timeMin": 10,
      "domain": "mobility",
      "benefit": "Relieves muscle tightness and improves blood flow."
    },
    {
      "name": "Heel Walks",
      "timeMin": 10,
      "domain": "mobility",
      "benefit": "Strengthens anterior muscles and stabilizes the knee."
    },
    {
      "name": "Corrective Squats",
      "timeMin": 10,
      "domain": "mobility",
      "benefit": "Enhances technique and reduces knee strain."
    }
  ]
}
```
 */
