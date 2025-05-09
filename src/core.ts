import { Context } from "./types";

export interface Transformation {
	step: string;
	inputData: any;
	outputData: any;
}

export type PipelineResult<In> = {
	data: In;
	transcript: Context<any>["transcript"];
	session?: Context<any>["session"];
};

/**
 * A PromptStep transforms a Context<I> into Context<O>.
 */
export type PromptStep<I, O> = (ctx: Context<I>) => Promise<Context<O>>;

/**
 * Compose a sequence of PromptSteps into a single runner.
 */
export function lilypad<In>(...steps: PromptStep<any, any>[]) {
	return {
		run: async (input: In): Promise<PipelineResult<any>> => {
			let ctx: Context<unknown> = { data: input, transcript: [], session: undefined };
			const transformations: Transformation[] = [];

			for (const step of steps) {
				const nextCtx = await step(ctx as any);
				ctx = nextCtx;
			}

			return {
				data: ctx.data,
				transcript: ctx.transcript,
				session: ctx.session,
			};
		},
	};
}

/**
 * Reset the conversation session and transcript while preserving data.
 */
export function fresh<Data>(): PromptStep<Data, Data> {
	return async (ctx) => ({ data: ctx.data, transcript: [], session: undefined });
}
