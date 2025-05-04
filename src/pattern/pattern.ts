import { compose } from "../core/pipeline";
import { inject, Segment } from "../core/segments";

type Symbol = "D" | "B" | "S" | "T800";
export const patternComposer = (pattern: string, pads: Segment[]): Segment =>
	compose(
		...pads.flatMap((pad, i) => [
			pad,
			...(pattern.split(/ +/)[i] === "T800" ? [inject("prompt", (c) => c.prompt.slice(-800))] : []), // simple trim example
		]),
	);
