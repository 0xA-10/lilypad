export type Ctx = Record<string, any>;
export type Segment<I = Ctx, O = Ctx> = (ctx: I) => Promise<O>;

/** Pure helper to inject new props */
export const inject =
	<K extends string, V>(key: K, val: V | ((c: Ctx) => V)): Segment =>
	async (ctx) => ({
		...ctx,
		[key]: typeof val === "function" ? (val as any)(ctx) : val,
	});
