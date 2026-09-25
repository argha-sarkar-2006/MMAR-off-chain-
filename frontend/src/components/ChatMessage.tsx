import React, { useState } from "react";
import {
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Terminal,
  Cpu,
  Eye,
  FileCode,
  Globe,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import type { ChatMessageItem } from "../api/types";

interface ChatMessageProps {
  message: ChatMessageItem;
  onRetry?: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onRetry }) => {
  const isUser = message.role === "user";
  const [copiedCode, setCopiedCode] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getRouteBadgeStyle = (route?: string) => {
    switch (route) {
      case "coding":
        return { bg: "#f3e8ff", color: "#7c3aed", border: "#e9d5ff", label: "CODING ROUTE" };
      case "vision":
        return { bg: "#ecfdf5", color: "#059669", border: "#a7f3d0", label: "VISION ROUTE" };
      case "reasoning":
      default:
        return { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe", label: "REASONING ROUTE" };
    }
  };

  if (isUser) {
    return (
      <div
        className="animate-fade-in"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "24px",
          padding: "0 16px",
        }}
      >
        <div
          style={{
            maxWidth: "75%",
            backgroundColor: "#f1f5f9",
            color: "var(--text-primary)",
            borderRadius: "20px 20px 4px 20px",
            padding: "14px 18px",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {message.attachment && (
            <div style={{ marginBottom: "10px" }}>
              {message.attachment.dataUrl ? (
                <img
                  src={message.attachment.dataUrl}
                  alt={message.attachment.name}
                  style={{
                    maxHeight: "220px",
                    maxWidth: "100%",
                    borderRadius: "12px",
                    objectFit: "contain",
                    display: "block",
                    border: "1px solid #e2e8f0",
                  }}
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 12px",
                    backgroundColor: "#ffffff",
                    borderRadius: "10px",
                    fontSize: "0.8125rem",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <Eye size={16} color="var(--accent-cyan)" />
                  <span>{message.attachment.name}</span>
                </div>
              )}
            </div>
          )}

          <div
            style={{
              fontSize: "0.9375rem",
              lineHeight: 1.5,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {message.content}
          </div>

          <div
            style={{
              fontSize: "0.6875rem",
              color: "var(--text-muted)",
              marginTop: "6px",
              textAlign: "right",
            }}
          >
            {message.timestamp}
          </div>
        </div>
      </div>
    );
  }

  // Assistant Message
  const result = message.pipelineResult;
  const routeBadge = getRouteBadgeStyle(result?.route);

  return (
    <div
      className="animate-fade-in"
      style={{
        display: "flex",
        flexDirection: "column",
        marginBottom: "28px",
        padding: "0 16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", maxWidth: "85%" }}>
        {/* Assistant Avatar */}
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            backgroundColor: "var(--accent-cyan-light)",
            border: "1px solid #bae6fd",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent-cyan)",
            flexShrink: 0,
            marginTop: "2px",
          }}
        >
          <Sparkles size={18} />
        </div>

        {/* Content Box */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header Metadata Badges */}
          {result && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "3px 10px",
                  borderRadius: "9999px",
                  fontSize: "0.6875rem",
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                  backgroundColor: routeBadge.bg,
                  color: routeBadge.color,
                  border: `1px solid ${routeBadge.border}`,
                }}
              >
                <Cpu size={12} />
                {routeBadge.label}
              </span>

              {result.intent && (
                <span
                  style={{
                    padding: "3px 10px",
                    borderRadius: "9999px",
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    backgroundColor: result.intent === "code" ? "#fdf2f8" : "#f0fdf4",
                    color: result.intent === "code" ? "#db2777" : "#15803d",
                    border: `1px solid ${result.intent === "code" ? "#fbcfe8" : "#bbf7d0"}`,
                  }}
                >
                  INTENT: {result.intent.toUpperCase()}
                </span>
              )}

              {result.language && (
                <span
                  style={{
                    padding: "3px 8px",
                    borderRadius: "6px",
                    fontSize: "0.6875rem",
                    fontWeight: 500,
                    backgroundColor: "#f8fafc",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  {result.language}
                </span>
              )}

              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginLeft: "auto" }}>
                {message.timestamp}
              </span>
            </div>
          )}

          {/* Error Message */}
          {message.isError && (
            <div
              style={{
                padding: "14px 16px",
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "14px",
                color: "#991b1b",
                fontSize: "0.875rem",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600 }}>
                <AlertTriangle size={18} color="#dc2626" />
                <span>Execution Error</span>
              </div>
              <div>{message.content}</div>
              {onRetry && (
                <button
                  onClick={onRetry}
                  style={{
                    alignSelf: "flex-start",
                    marginTop: "6px",
                    padding: "5px 12px",
                    backgroundColor: "#ffffff",
                    border: "1px solid #f87171",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#b91c1c",
                  }}
                >
                  Try Again
                </button>
              )}
            </div>
          )}

          {/* Vision Stage Output */}
          {result?.image_description && (
            <div
              style={{
                marginBottom: "16px",
                padding: "12px 16px",
                backgroundColor: "#f0fdf4",
                borderRadius: "12px",
                border: "1px solid #bbf7d0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "#166534",
                  marginBottom: "6px",
                }}
              >
                <Eye size={14} />
                <span>Vision Stage Analysis</span>
              </div>
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "#14532d",
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap",
                }}
              >
                {result.image_description}
              </div>
            </div>
          )}

          {/* Summary / Answer */}
          {result?.summary && (
            <div
              style={{
                fontSize: "0.9375rem",
                lineHeight: 1.6,
                color: "var(--text-primary)",
                whiteSpace: "pre-wrap",
                marginBottom: "16px",
              }}
            >
              {result.summary}
            </div>
          )}

          {/* Standalone message fallback if no pipelineResult */}
          {!result && !message.isError && (
            <div
              style={{
                fontSize: "0.9375rem",
                lineHeight: 1.6,
                color: "var(--text-primary)",
                whiteSpace: "pre-wrap",
                marginBottom: "12px",
              }}
            >
              {message.content}
            </div>
          )}

          {/* Problem Statement Specification */}
          {result?.problem_statement && result.problem_statement.trim() !== "" && (
            <div
              style={{
                marginBottom: "16px",
                padding: "12px 16px",
                backgroundColor: "#f8fafc",
                borderRadius: "12px",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Generated Specification
              </div>
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-primary)",
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap",
                }}
              >
                {result.problem_statement}
              </div>
            </div>
          )}

          {/* Generated Code Block */}
          {result?.code && (
            <div
              style={{
                marginBottom: "16px",
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid #1e293b",
                backgroundColor: "#0f172a",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 16px",
                  backgroundColor: "#1e293b",
                  borderBottom: "1px solid #334155",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <FileCode size={16} color="#38bdf8" />
                  <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#94a3b8" }}>
                    {result.language ? result.language.toUpperCase() : "GENERATED PROGRAM"}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(result.code!)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: copiedCode ? "#4ade80" : "#cbd5e1",
                    backgroundColor: "rgba(255,255,255,0.06)",
                  }}
                  title="Copy code"
                >
                  {copiedCode ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedCode ? "Copied!" : "Copy code"}</span>
                </button>
              </div>
              <pre
                style={{
                  padding: "16px",
                  overflowX: "auto",
                  margin: 0,
                  fontSize: "0.875rem",
                  lineHeight: 1.5,
                  color: "#e2e8f0",
                }}
              >
                <code>{result.code}</code>
              </pre>
            </div>
          )}

          {/* Web Sources / Citations */}
          {result?.sources && result.sources.length > 0 && (
            <div
              style={{
                marginBottom: "12px",
                padding: "10px 14px",
                borderRadius: "10px",
                backgroundColor: "#f8fafc",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  marginBottom: "6px",
                }}
              >
                <Globe size={13} color="var(--accent-cyan)" />
                <span>Web Sources & Citations</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {result.sources.map((url, idx) => (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "0.8125rem",
                      color: "var(--accent-cyan)",
                      textDecoration: "none",
                      wordBreak: "break-all",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.textDecoration = "underline";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.textDecoration = "none";
                    }}
                  >
                    <ExternalLink size={12} style={{ flexShrink: 0 }} />
                    <span>{url}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Execution Pipeline Logs Accordion */}
          {message.logs && message.logs.length > 0 && (
            <div style={{ marginTop: "8px" }}>
              <button
                onClick={() => setShowLogs(!showLogs)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  color: "var(--text-muted)",
                }}
              >
                <Terminal size={12} />
                <span>{showLogs ? "Hide pipeline execution logs" : "View pipeline execution logs"}</span>
                {showLogs ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              </button>

              {showLogs && (
                <div
                  className="animate-fade-in"
                  style={{
                    marginTop: "6px",
                    padding: "10px 12px",
                    backgroundColor: "#f1f5f9",
                    borderRadius: "8px",
                    fontSize: "0.75rem",
                    fontFamily: "var(--font-mono)",
                    color: "#334155",
                    maxHeight: "160px",
                    overflowY: "auto",
                  }}
                >
                  {message.logs.map((logLine, idx) => (
                    <div key={idx} style={{ padding: "2px 0" }}>
                      {logLine}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
