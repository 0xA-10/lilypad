export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface SessionMeta {
  conversationId: string;
  runId: string;
}

export interface Context<Data = any> {
  data: Data;
  transcript: Message[];
  session?: SessionMeta;
}
