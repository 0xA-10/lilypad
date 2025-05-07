import { Context } from './types';

/**
 * A PromptStep transforms a Context<I> into Context<O>,
 * potentially updating session metadata for Responses API.
 */
export type PromptStep<I, O> = (ctx: Context<I>) => Promise<Context<O>>;

/**
 * Compose a sequence of PromptSteps into a single runner.
 * Uses Responses API by default; fresh() resets session.
 */
export function lilypad<In>(
  ...steps: PromptStep<any, any>[]
) {
  return {
    run: async (input: In) => {
      let ctx: Context<In> = { data: input, transcript: [], session: undefined };
      for (const step of steps) {
        ctx = await step(ctx);
      }
      return ctx;
    }
  };
}

/**
 * Reset the conversation session and transcript while preserving data.
 */
export function fresh<Data>(): PromptStep<Data, Data> {
  return async (ctx) => ({ data: ctx.data, transcript: [], session: undefined });
}
