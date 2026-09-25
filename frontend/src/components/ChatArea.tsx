import React, { useEffect, useRef } from "react";
import {
  Menu,
  Globe,
  Database,
  Terminal,
  Code2,
  FileSearch,
  Loader2,
} from "lucide-react";
import { ModelSelector } from "./ModelSelector";
import { BrandLogo } from "./BrandLogo";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import type { BackendStatus, ChatMessageItem, MessageAttachment } from "../api/types";

interface ChatAreaProps {
  messages: ChatMessageItem[];
  isLoading: boolean;
  activeStage?: string;
  backendStatus: BackendStatus | null;
  isConnected: boolean;
  useWeb: boolean;
  onToggleWeb: () => void;
  onSendMessage: (text: string, attachment?: MessageAttachment) => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  onOpenHub: () => void;
  onOpenKnowledge: () => void;
  onRetryMessage?: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isLoading,
  activeStage,
  backendStatus,
  isConnected,
  useWeb,
  onToggleWeb,
  onSendMessage,
  onToggleSidebar,
  isSidebarOpen,
  onOpenHub,
  onOpenKnowledge,
  onRetryMessage,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, activeStage]);

  const quickPrompts = [
    {
      title: "Solve puzzle photograph",
      desc: "Canonical worked example: solve 22 hidden product names from an image",
      prompt: "Solve this printed word-search puzzle and return a complete Python solver program.",
      icon: <Terminal size={16} color="var(--accent-cyan)" />,
    },
    {
      title: "Write code specification",
      desc: "Reason through an architecture and generate complete code",
      prompt: "Implement a rate-limited REST client with exponential backoff and retry budgets in Python.",
      icon: <Code2 size={16} color="#8b5cf6" />,
    },
    {
      title: "Query knowledge base",
      desc: "Perform local FTS5 RAG retrieval on ingested documentation",
      prompt: "Explain how document chunking and FTS5 prefix indexing works in this workbench.",
      icon: <FileSearch size={16} color="#f59e0b" />,
    },
    {
      title: "Web-augmented research",
      desc: "Live search with OpenRouter citation extraction",
      prompt: "Compare vector embeddings vs full-text search for local enterprise RAG systems.",
      icon: <Globe size={16} color="#10b981" />,
    },
  ];

  return (
    <main
      style={{
        flex: 1,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--bg-main)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top Header Bar matching 1st.png */}
      <header
        style={{
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          borderBottom: "1px solid var(--border-light)",
          backgroundColor: "#ffffff",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {!isSidebarOpen && (
            <button
              onClick={onToggleSidebar}
              title="Open Sidebar"
              style={{
                padding: "6px",
                borderRadius: "6px",
                color: "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f1f5f9")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <Menu size={20} />
            </button>
          )}

          {/* Show compact brand logo mark only when sidebar is collapsed */}
          {!isSidebarOpen && (
            <div style={{ marginRight: "6px", display: "flex", alignItems: "center" }}>
              <BrandLogo size="sm" showWordmark={false} />
            </div>
          )}

          {/* Pill Model Selector styled like "Jan nano ↕" in 1st.png */}
          <ModelSelector
            backendStatus={backendStatus}
            isConnected={isConnected}
            onOpenHub={onOpenHub}
          />
        </div>

        {/* Header Right Status Badges */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={onToggleWeb}
            title={useWeb ? "Live web search enabled" : "Live web search disabled"}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              borderRadius: "9999px",
              fontSize: "0.75rem",
              fontWeight: 500,
              backgroundColor: useWeb ? "#ecfdf5" : "#f1f5f9",
              color: useWeb ? "#047857" : "var(--text-muted)",
              border: `1px solid ${useWeb ? "#a7f3d0" : "var(--border-subtle)"}`,
            }}
          >
            <Globe size={13} />
            <span>{useWeb ? "Web Search ON" : "Web Search OFF"}</span>
          </button>

          <button
            onClick={onOpenKnowledge}
            title="Open local knowledge base manager"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              borderRadius: "9999px",
              fontSize: "0.75rem",
              fontWeight: 500,
              backgroundColor: "#fef3c7",
              color: "#b45309",
              border: "1px solid #fde68a",
            }}
          >
            <Database size={13} />
            <span>{backendStatus?.knowledge_documents || 0} Docs</span>
          </button>
        </div>
      </header>

      {/* Main Messages Container */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px 0 120px 0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {messages.length === 0 ? (
          /* Empty State Hero - precisely matching 1st.png */
          <div
            className="animate-fade-in"
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px 20px",
              maxWidth: "768px",
              margin: "0 auto",
              width: "100%",
            }}
          >
            {/* Center Hero Logo & Heading */}
            <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center" }}>
              <BrandLogo size="xl" showWordmark={true} />
            </div>
            <h1
              style={{
                fontSize: "1.75rem",
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: "32px",
                letterSpacing: "-0.02em",
                textAlign: "center",
              }}
            >
              How can I help you today?
            </h1>

            {/* Quick Action Prompt Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "12px",
                width: "100%",
              }}
            >
              {quickPrompts.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => onSendMessage(item.prompt)}
                  style={{
                    padding: "16px",
                    borderRadius: "var(--radius-lg)",
                    backgroundColor: "#ffffff",
                    border: "1px solid var(--border-subtle)",
                    boxShadow: "var(--shadow-sm)",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#94a3b8";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "var(--shadow-md)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-subtle)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    {item.icon}
                    <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>
                      {item.title}
                    </div>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Message List */
          <div style={{ maxWidth: "860px", width: "100%", margin: "0 auto" }}>
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} onRetry={onRetryMessage} />
            ))}

            {/* Real-time Multi-Stage Loading Indicator */}
            {isLoading && (
              <div
                className="animate-fade-in"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 18px",
                  margin: "0 16px 20px 16px",
                  maxWidth: "420px",
                  backgroundColor: "#f8fafc",
                  borderRadius: "16px",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: "var(--accent-cyan-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent-cyan)",
                    flexShrink: 0,
                  }}
                >
                  <Loader2 size={18} className="animate-spin" />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>
                    {activeStage || "Consulting Needle multi-model router..."}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Coordinating vision, reasoning, and coding stages
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Fixed Bottom Input Area matching 1st.png */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "16px 20px 24px 20px",
          background: "linear-gradient(to top, rgba(255,255,255,1) 70%, rgba(255,255,255,0) 100%)",
          pointerEvents: "none",
        }}
      >
        <div style={{ pointerEvents: "auto" }}>
          <ChatInput
            onSendMessage={onSendMessage}
            isLoading={isLoading}
            useWeb={useWeb}
            onToggleWeb={onToggleWeb}
          />
        </div>
      </div>
    </main>
  );
};
