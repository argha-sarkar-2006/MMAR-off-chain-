import type {
  BackendStatus,
  ChatResponse,
  CodingChatResponse,
  KnowledgeIngestResponse,
  KnowledgeSearchResponse,
} from "./types";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  private getHeaders(token?: string | null, userId?: string | null, isMultipart = false): HeadersInit {
    const headers: Record<string, string> = {};
    if (!isMultipart) {
      headers["Content-Type"] = "application/json";
    }
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    if (userId) {
      headers["X-User-Id"] = userId;
    }
    return headers;
  }

  async getStatus(userId?: string | null): Promise<BackendStatus> {
    try {
      const url = userId
        ? `${this.baseUrl}/api/status?user_id=${encodeURIComponent(userId)}`
        : `${this.baseUrl}/api/status`;
      const response = await fetch(url, {
        method: "GET",
        headers: this.getHeaders(null, userId, false),
      });
      if (!response.ok) {
        throw new Error(`Backend status error: HTTP ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn("Backend not reachable at", this.baseUrl, error);
      throw error;
    }
  }

  async sendChatMessage(
    prompt: string,
    imageFile?: File | null,
    useWeb = true,
    token?: string | null,
    userId?: string | null
  ): Promise<ChatResponse> {
    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("use_web", String(useWeb));

    if (userId) {
      formData.append("user_id", userId);
    }

    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: "POST",
      headers: this.getHeaders(token, userId, true),
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorDetail = errorText;
      try {
        const errorJson = JSON.parse(errorText);
        errorDetail = errorJson.detail || errorText;
      } catch {
        // Keep raw text
      }
      throw new Error(errorDetail || `Request failed with HTTP ${response.status}`);
    }

    return await response.json();
  }

  async sendCodingChat(
    message: string,
    history: Array<{ role: string; content: string }> = [],
    token?: string | null
  ): Promise<CodingChatResponse> {
    const response = await fetch(`${this.baseUrl}/api/coding/chat`, {
      method: "POST",
      headers: this.getHeaders(token, null, false),
      body: JSON.stringify({ message, history }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorDetail = errorText;
      try {
        const errorJson = JSON.parse(errorText);
        errorDetail = errorJson.detail || errorText;
      } catch {
        // Keep raw text
      }
      throw new Error(errorDetail || `Coding request failed with HTTP ${response.status}`);
    }

    return await response.json();
  }

  async searchKnowledge(
    query: string,
    limit = 5,
    token?: string | null,
    userId?: string | null
  ): Promise<KnowledgeSearchResponse> {
    const response = await fetch(`${this.baseUrl}/api/knowledge/search`, {
      method: "POST",
      headers: this.getHeaders(token, userId, false),
      body: JSON.stringify({ query, limit }),
    });

    if (!response.ok) {
      throw new Error(`Knowledge search failed: HTTP ${response.status}`);
    }

    return await response.json();
  }

  async ingestDocument(
    file: File,
    title?: string,
    token?: string | null,
    userId?: string | null
  ): Promise<KnowledgeIngestResponse> {
    const formData = new FormData();
    formData.append("file", file);
    if (title) {
      formData.append("title", title);
    }
    if (userId) {
      formData.append("user_id", userId);
    }

    const response = await fetch(`${this.baseUrl}/api/knowledge/ingest`, {
      method: "POST",
      headers: this.getHeaders(token, userId, true),
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorDetail = errorText;
      try {
        const errorJson = JSON.parse(errorText);
        errorDetail = errorJson.detail || errorText;
      } catch {
        // Keep raw text
      }
      throw new Error(errorDetail || `Ingestion failed: HTTP ${response.status}`);
    }

    return await response.json();
  }
}

export const apiClient = new ApiClient();
