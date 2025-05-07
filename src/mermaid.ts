import type { Transformation } from "./core";

/**
 * Truncate long strings to `maxLen`, adding “…” if needed.
 */
function truncate(str: string, maxLen = 30): string {
	if (str.length <= maxLen) return str;
	return str.slice(0, maxLen - 1) + "…";
}

/**
 * Remove quotes, pipes, and collapse whitespace.
 */
function sanitizeLabel(text: string): string {
	return text.replace(/['"|]/g, "").replace(/\s+/g, " ").trim();
}

/**
 * Compute a shallow diff: all keys in output that either
 * didn’t exist or changed value compared to input.
 */
function diffData(input: Record<string, any>, output: Record<string, any>): Record<string, any> {
	const diffs: Record<string, any> = {};
	for (const [key, newVal] of Object.entries(output)) {
		const oldVal = input?.[key];
		// simple comparison (JSON string equality)
		if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
			diffs[key] = newVal;
		}
	}
	return diffs;
}

/**
 * Build a Mermaid flowchart from any sequence of transformations.
 * Nodes are labeled with step name + key=value diffs.
 */
export function transformationsToMermaid(transforms: Transformation[]): string {
	let mermaid = "flowchart LR\n";

	transforms.forEach((t, i) => {
		const id = `step${i}`;
		const name = sanitizeLabel(t.step);

		// Compute which fields actually changed
		const diffs = diffData(t.inputData, t.outputData);
		const parts = Object.entries(diffs).map(
			([k, v]) => `${k}:${truncate(typeof v === "string" ? v : JSON.stringify(v))}`,
		);
		const label = sanitizeLabel(parts.join(", ") || "no change");

		mermaid += `  ${id}["${name}\\n${label}"]\n`;
		if (i > 0) mermaid += `  step${i - 1} --> ${id}\n`;
	});

	return mermaid;
}
