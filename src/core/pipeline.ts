import { Segment, Ctx } from "./segments";

export const compose =
	(...pads: Segment[]): Segment =>
	async (initial: Ctx = {}) =>
		pads.reduce<Promise<Ctx>>((acc, pad) => acc.then(pad), Promise.resolve(initial));
