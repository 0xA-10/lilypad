export interface AlignmentNode {
	id: string;
	label: string;
	before: Record<string, any>;
	after: Record<string, any>;
}

export class AlignmentTree {
	nodes: AlignmentNode[] = [];
	edges: [string, string][] = [];

	/** create node stub, returns node id */
	add(label: string, before: Record<string, any>) {
		const id = `n${this.nodes.length}`;
		this.nodes.push({ id, label, before, after: {} });
		if (this.nodes.length > 1) {
			const prev = this.nodes[this.nodes.length - 2].id;
			this.edges.push([prev, id]);
		}
		return id;
	}

	setAfter(id: string, after: Record<string, any>) {
		const node = this.nodes.find((n) => n.id === id)!;
		node.after = after;
	}

	/** Mermaid diagram + anchors for JSON state */
	toMermaid(): string {
		const lines: string[] = [];
		const anchors: string[] = [];

		lines.push("```mermaid");
		lines.push("graph TD");

		this.nodes.forEach((n) => {
			lines.push(`  ${n.id}("${n.label}")`);
		});
		this.edges.forEach(([a, b]) => lines.push(`  ${a} --> ${b}`));

		// add click handlers
		this.nodes.forEach((n) => {
			const anchor = `state-${n.id}`;
			lines.push(`  click ${n.id} href "#${anchor}"`);
			const json = JSON.stringify({ before: n.before, after: n.after }, null, 2);
			anchors.push(
				`\n<a id="${anchor}"></a>\n\n` +
					`<details><summary>${n.label} – state snapshot</summary>\n\n` +
					"```json\n" +
					json +
					"\n```\n</details>\n",
			);
		});

		lines.push("```");

		return lines.join("\n") + anchors.join("\n");
	}

	/** complete JSON timeline */
	toJSON() {
		return this.nodes;
	}
}
