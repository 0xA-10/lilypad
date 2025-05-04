import { Segment } from "../core/segments";
import { patternComposer } from "./pattern";

/** accepted rhythm symbols */
type Sig = "D" | "B" | "S" | `T${number}` | `M(${string})`;

export class PatternBuilder {
	private symbols: Sig[] = [];
	private pads: Segment[] = [];

	/** add one or more pads with an explicit rhythm symbol */
	step(sig: Sig, ...segments: Segment[]) {
		segments.forEach((s) => {
			this.symbols.push(sig);
			this.pads.push(s);
		});
		return this; // chainable
	}

	/** compile to runnable chain; auto‑generate pattern string */
	build() {
		const pattern = this.symbols.join(" ");
		return patternComposer(pattern, this.pads);
	}
}
