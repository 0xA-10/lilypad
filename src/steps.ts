import { PromptStep } from './core';
import { Context, Message } from './types';
import { sendPrompt } from './adapter-responses';

export const analyzeValue: PromptStep<{ spendingItem: string }, { spendingItem: string; userValue: string }> = async (ctx) => {
  const prompt = `Describe what value the user gets from \"${ctx.data.spendingItem}\".`;
  const { newContent, session } = await sendPrompt(ctx, prompt);
  const userMsg: Message = { role: 'user', content: prompt };
  const asstMsg: Message = { role: 'assistant', content: newContent };
  return {
    data: { ...ctx.data, userValue: newContent.trim() },
    transcript: [...ctx.transcript, userMsg, asstMsg],
    session
  };
};

export const brainstormAlternatives: PromptStep<{ spendingItem: string; userValue: string }, { recommendations: string[] }> = async (ctx) => {
  const prompt = `Brainstorm 5 cheaper alternatives to \"${ctx.data.spendingItem}\" that preserve: ${ctx.data.userValue}`;
  const { newContent, session } = await sendPrompt(ctx, prompt);
  const userMsg: Message = { role: 'user', content: prompt };
  const asstMsg: Message = { role: 'assistant', content: newContent };
  const items = newContent.split(/\n+/).map((l) => l.replace(/^[0-9\.]+/, '').trim()).filter(Boolean);
  return {
    data: { recommendations: items },
    transcript: [...ctx.transcript, userMsg, asstMsg],
    session
  };
};

export function filterByThreshold(minLen = 5): PromptStep<{ recommendations: string[] }, { recommendations: string[] }> {
  return async (ctx) => {
    const filtered = ctx.data.recommendations.filter((r) => r.length >= minLen);
    return { data: { recommendations: filtered }, transcript: ctx.transcript, session: ctx.session };
  };
}

export const critiqueAndTighten: PromptStep<{ recommendations: string[] }, { recommendations: string[] }> = async (ctx) => {
  const prompt = `Critique and shorten these suggestions to top 3 bullet points:\n${ctx.data.recommendations.map((r) => `- ${r}`).join('\n')}`;
  const { newContent, session } = await sendPrompt(ctx, prompt);
  const userMsg: Message = { role: 'user', content: prompt };
  const asstMsg: Message = { role: 'assistant', content: newContent };
  const items = newContent.split(/\n+/).map((l) => l.replace(/^-/, '').trim()).filter(Boolean);
  return {
    data: { recommendations: items.slice(0, 3 + 1) },
    transcript: [...ctx.transcript, userMsg, asstMsg],
    session
  };
};
