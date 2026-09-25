/**
 * Type definitions matching the backend data structures in MMAR-off-chain-
 */

export type ModelRoute = "coding" | "reasoning" | "vision";
export type ModelIntent = "query" | "code";

export interface PipelineResult {
  route: ModelRoute;
  intent: ModelIntent;
  summary: string;
  problem_statement?: string;
  language?: string;
  sources?: string[];
  image_description?: string | null;
  code?: string;
}

export interface ChatResponse {
  success: boolean;
  result: PipelineResult;
  logs?: string[];
}

export interface CodingChatResponse {
  success: boolean;
  answer: string;
  history?: Array<{ role: string; content: string }>;
}

export interface KnowledgeDocument {
  id: number;
  source: string;
  title: string;
  content: string;
  rank?: number;
}

export interface KnowledgeSearchResponse {
  query: string;
  hits: KnowledgeDocument[];
}

export interface KnowledgeIngestResponse {
  success: boolean;
  filename: string;
  chunks_stored: number;
  total_documents: number;
}

export interface BackendStatus {
  status: string;
  app_name: string;
  models: {
    vision: string[];
    reasoning: string;
    coding: string;
  };
  knowledge_documents: number;
  endpoints: {
    openrouter: string;
    ollama: string;
  };
}

export interface MessageAttachment {
  name: string;
  size: number;
  type: string;
  dataUrl?: string;
  file?: File;
}

export interface ChatMessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  attachment?: MessageAttachment;
  pipelineResult?: PipelineResult;
  logs?: string[];
  isError?: boolean;
}

export interface ConversationSession {
  id: string;
  title: string;
  project?: string;
  createdAt: string;
  messages: ChatMessageItem[];
}
