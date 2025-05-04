import { Segment } from "../core/segments";
import { compose } from "../core/pipeline";
import { AlignmentTree } from "../core/tree";

const clone = (v: any) => JSON.parse(JSON.stringify(v));

const tokenTrim =
	(max: number): Segment =>
	async (ctx) => {
		if (typeof ctx.prompt === "string" && ctx.prompt.length > max) {
			ctx.prompt = ctx.prompt.slice(-max);
		}
		return ctx;
	};

export const patternComposer = (pattern: string, userPads: Segment[]) => {
	const symbols = pattern.trim().split(/\s+/);
	const tree = new AlignmentTree();

	if (symbols.length !== userPads.length) {
		throw new Error(`Pattern length (${symbols.length}) ≠ pads (${userPads.length})`);
	}

	const expanded: Segment[] = [];
	let userIdx = 0;

	symbols.forEach((sym) => {
		const makeProxy = (pad: Segment, label: string) => {
			return async (ctx: any) => {
				const id = tree.add(label, clone(ctx));
				const next = await pad(ctx);
				tree.setAfter(id, clone(next));
				return next;
			};
		};

		if (/^T\d+$/i.test(sym)) {
			const max = Number(sym.slice(1));
			expanded.push(makeProxy(tokenTrim(max), sym));
		} else {
			const pad = userPads[userIdx++];
			if (!pad) throw new Error(`Pattern needs more pads (stuck at ${sym})`);
			expanded.push(makeProxy(pad, sym));
		}
	});

	const run = compose(...expanded);
	(run as any).alignmentTree = tree;
	return run;
};
