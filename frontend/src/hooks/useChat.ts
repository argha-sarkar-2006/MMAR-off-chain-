import { useState, useEffect, useCallback, useRef } from "react";
import { apiClient } from "../api/client";
import type {
  ChatMessageItem,
  ConversationSession,
  MessageAttachment,
  BackendStatus,
} from "../api/types";
import { useAppAuth } from "../auth/AuthContext";

/**
 * Generate account-isolated storage keys using the user's Auth0 ID (sub) or email.
 */
function getStorageKeys(userId?: string | null) {
  const safeId = userId ? encodeURIComponent(userId.trim().toLowerCase()) : "anonymous";
  return {
    storageKey: `3rdroute_conversations_${safeId}`,
    activeChatKey: `3rdroute_active_chat_${safeId}`,
  };
}

function loadUserConversations(key: string): ConversationSession[] {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Failed to load user conversations:", err);
  }
  return [];
}

export function useChat() {
  const { user, getAccessToken } = useAppAuth();
  const currentUserId = user?.sub || user?.email || null;
  const { storageKey, activeChatKey } = getStorageKeys(currentUserId);

  // Track currently active user ID to avoid race-condition storage overwrites
  const loadedUserRef = useRef<string | null>(currentUserId);

  // Load account-specific conversations
  const [conversations, setConversations] = useState<ConversationSession[]>(() =>
    loadUserConversations(storageKey)
  );

  const [activeChatId, setActiveChatId] = useState<string | null>(() => {
    return localStorage.getItem(activeChatKey) || (conversations[0]?.id ?? null);
  });

  const [isLoading, setIsLoading] = useState(false);
  const [activeStage, setActiveStage] = useState<string | undefined>(undefined);
  const [useWeb, setUseWeb] = useState(true);

  // Backend connectivity and status
  const [backendStatus, setBackendStatus] = useState<BackendStatus | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Switch conversation state when user account changes (e.g. login, logout, switch user)
  useEffect(() => {
    if (loadedUserRef.current !== currentUserId) {
      loadedUserRef.current = currentUserId;
      const userChats = loadUserConversations(storageKey);
      setConversations(userChats);
      const savedActive = localStorage.getItem(activeChatKey);
      setActiveChatId(savedActive || (userChats[0]?.id ?? null));
    }
  }, [currentUserId, storageKey, activeChatKey]);

  // Save conversations to this specific account's storage
  useEffect(() => {
    if (loadedUserRef.current === currentUserId) {
      localStorage.setItem(storageKey, JSON.stringify(conversations));
    }
  }, [conversations, currentUserId, storageKey]);

  // Save activeChatId to this specific account's storage
  useEffect(() => {
    if (loadedUserRef.current === currentUserId) {
      if (activeChatId) {
        localStorage.setItem(activeChatKey, activeChatId);
      } else {
        localStorage.removeItem(activeChatKey);
      }
    }
  }, [activeChatId, currentUserId, activeChatKey]);

  // Check backend status periodically for the active account
  const checkStatus = useCallback(async () => {
    try {
      const status = await apiClient.getStatus(currentUserId);
      setBackendStatus(status);
      setIsConnected(true);
    } catch {
      setIsConnected(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 15000);
    return () => clearInterval(interval);
  }, [checkStatus]);

  const activeConversation = conversations.find((c) => c.id === activeChatId) || null;
  const messages = activeConversation?.messages || [];

  const createNewChat = (project?: string) => {
    const newId = `chat-${Date.now()}`;
    const newChat: ConversationSession = {
      id: newId,
      title: "New chat",
      project,
      createdAt: new Date().toISOString(),
      messages: [],
    };
    setConversations((prev) => [newChat, ...prev]);
    setActiveChatId(newId);
    return newId;
  };

  const deleteChat = (id: string) => {
    setConversations((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      if (activeChatId === id) {
        setActiveChatId(filtered[0]?.id || null);
      }
      return filtered;
    });
  };

  const clearAllChats = () => {
    setConversations([]);
    setActiveChatId(null);
    localStorage.removeItem(storageKey);
    localStorage.removeItem(activeChatKey);
  };

  const sendMessage = async (prompt: string, attachment?: MessageAttachment) => {
    let currentId = activeChatId;
    if (!currentId) {
      currentId = createNewChat();
    }

    const userMessage: ChatMessageItem = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      attachment,
    };

    // Update messages with user message immediately
    setConversations((prev) =>
      prev.map((chat) => {
        if (chat.id === currentId) {
          const isFirst = chat.messages.length === 0;
          return {
            ...chat,
            title: isFirst ? prompt.slice(0, 36) || attachment?.name || "Chat" : chat.title,
            messages: [...chat.messages, userMessage],
          };
        }
        return chat;
      })
    );

    setIsLoading(true);

    if (attachment && attachment.type.startsWith("image/")) {
      setActiveStage("Vision Stage: Analyzing image transcription...");
    } else {
      setActiveStage("Needle Router: Selecting optimal specialist model...");
    }

    try {
      const token = await getAccessToken();

      // Trigger stage update simulation while awaiting backend response
      const stageTimer = setTimeout(() => {
        setActiveStage("Reasoning Stage: Consulting web search & local SQLite RAG...");
      }, 2500);

      const response = await apiClient.sendChatMessage(
        prompt,
        attachment?.file || null,
        useWeb,
        token,
        currentUserId
      );

      clearTimeout(stageTimer);

      const assistantMessage: ChatMessageItem = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: response.result.summary,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        pipelineResult: response.result,
        logs: response.logs,
      };

      setConversations((prev) =>
        prev.map((chat) => {
          if (chat.id === currentId) {
            return {
              ...chat,
              messages: [...chat.messages, assistantMessage],
            };
          }
          return chat;
        })
      );
    } catch (error: any) {
      console.error("Chat pipeline execution failed:", error);
      const errorMessage: ChatMessageItem = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content:
          error.message ||
          "Could not reach the Python backend. Ensure `python server.py` is running on http://localhost:8000.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isError: true,
      };

      setConversations((prev) =>
        prev.map((chat) => {
          if (chat.id === currentId) {
            return {
              ...chat,
              messages: [...chat.messages, errorMessage],
            };
          }
          return chat;
        })
      );
    } finally {
      setIsLoading(false);
      setActiveStage(undefined);
    }
  };

  return {
    conversations,
    activeChatId,
    activeConversation,
    messages,
    isLoading,
    activeStage,
    useWeb,
    setUseWeb,
    toggleWeb: () => setUseWeb((prev) => !prev),
    backendStatus,
    isConnected,
    checkStatus,
    setActiveChatId,
    createNewChat,
    deleteChat,
    clearAllChats,
    sendMessage,
  };
}
