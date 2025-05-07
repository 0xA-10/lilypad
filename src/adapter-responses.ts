import fetch from 'node-fetch';
import { Context, SessionMeta } from './types';

const BASE = 'https://api.openai.com/v1/responses';

/**
 * Send a prompt via Responses API, chaining on previous_response_id if present.
 */
export async function sendPrompt(ctx: Context<any>, prompt: string): Promise<{ newContent: string; session: SessionMeta }> {
  const body: any = {
    model: 'gpt-4o-mini',
    input: prompt
  };
  if (ctx.session?.lastResponseId) {
    body.previous_response_id = ctx.session.lastResponseId;
  }
  const res = await fetch(BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify(body)
  });
  const json = await res.json();
  // Most recent run => response JSON includes id and output array
  const newResponseId: string = json.id;
  // Extract text from first message in output
  const newContent: string = json.output?.[0]?.content?.[0]?.text || '';
  return { newContent, session: { lastResponseId: newResponseId } };
}
