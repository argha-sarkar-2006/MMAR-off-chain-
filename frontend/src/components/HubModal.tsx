import React from "react";
import { X, Cpu, Eye, Brain, Code, Database, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import type { BackendStatus } from "../api/types";

interface HubModalProps {
  isOpen: boolean;
  onClose: () => void;
  backendStatus: BackendStatus | null;
  isConnected: boolean;
}

export const HubModal: React.FC<HubModalProps> = ({
  isOpen,
  onClose,
  backendStatus,
  isConnected,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(15, 23, 42, 0.4)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        className="animate-fade-in"
        style={{
          width: "100%",
          maxWidth: "680px",
          backgroundColor: "#ffffff",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--border-subtle)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--text-primary)" }}>
              3rd-Route Multi-Agent Hub
            </div>
            <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "2px" }}>
              Offline/Local Sovereign AI Pipeline & Stage Architecture
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: "6px",
              borderRadius: "50%",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Backend Connection Banner */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              borderRadius: "var(--radius-md)",
              backgroundColor: isConnected ? "#f0fdf4" : "#fffbeb",
              border: `1px solid ${isConnected ? "#bbf7d0" : "#fef3c7"}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {isConnected ? (
                <CheckCircle2 size={18} color="#16a34a" />
              ) : (
                <AlertCircle size={18} color="#d97706" />
              )}
              <div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: isConnected ? "#15803d" : "#b45309",
                  }}
                >
                  {isConnected ? "Python API Backend Connected" : "Python API Backend Not Connected"}
                </div>
                <div style={{ fontSize: "0.75rem", color: isConnected ? "#166534" : "#92400e" }}>
                  {isConnected
                    ? `Running locally at ${backendStatus?.endpoints.openrouter ? "localhost:8000" : "configured endpoint"}`
                    : "Make sure python server.py is running on http://localhost:8000"}
                </div>
              </div>
            </div>

            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: "9999px",
                backgroundColor: isConnected ? "#dcfce7" : "#fef3c7",
                color: isConnected ? "#166534" : "#92400e",
              }}
            >
              {isConnected ? "ONLINE" : "WAITING"}
            </span>
          </div>

          {/* Workflow Call Flow Visualization */}
          <div>
            <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "12px" }}>
              Pipeline Execution Flow
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr auto 1fr",
                alignItems: "center",
                gap: "8px",
                padding: "16px",
                backgroundColor: "#f8fafc",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div
                style={{
                  padding: "12px",
                  borderRadius: "10px",
                  backgroundColor: "#ffffff",
                  border: "1px solid var(--border-subtle)",
                  textAlign: "center",
                }}
              >
                <Cpu size={20} color="var(--accent-cyan)" style={{ margin: "0 auto 6px" }} />
                <div style={{ fontSize: "0.75rem", fontWeight: 600 }}>Router Stage</div>
                <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)" }}>Needle local model</div>
              </div>

              <ArrowRight size={16} color="#94a3b8" />

              <div
                style={{
                  padding: "12px",
                  borderRadius: "10px",
                  backgroundColor: "#ffffff",
                  border: "1px solid var(--border-subtle)",
                  textAlign: "center",
                }}
              >
                <Brain size={20} color="#3b82f6" style={{ margin: "0 auto 6px" }} />
                <div style={{ fontSize: "0.75rem", fontWeight: 600 }}>Reasoning Stage</div>
                <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)" }}>Web + SQLite RAG</div>
              </div>

              <ArrowRight size={16} color="#94a3b8" />

              <div
                style={{
                  padding: "12px",
                  borderRadius: "10px",
                  backgroundColor: "#ffffff",
                  border: "1px solid var(--border-subtle)",
                  textAlign: "center",
                }}
              >
                <Code size={20} color="#8b5cf6" style={{ margin: "0 auto 6px" }} />
                <div style={{ fontSize: "0.75rem", fontWeight: 600 }}>Coding Stage</div>
                <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)" }}>Ollama Cloud 20b</div>
              </div>
            </div>
          </div>

          {/* Model Roster */}
          <div>
            <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "12px" }}>
              Configured Model Roster
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {/* Vision */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <Eye size={18} color="#10b981" style={{ marginTop: "2px" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Vision Model</span>
                    <span style={{ fontSize: "0.6875rem", color: "#059669", fontWeight: 500 }}>OpenRouter Free Tier</span>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                    {backendStatus?.models.vision[0] || "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free"}
                  </div>
                </div>
              </div>

              {/* Reasoning */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <Brain size={18} color="#3b82f6" style={{ marginTop: "2px" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Reasoning Model</span>
                    <span style={{ fontSize: "0.6875rem", color: "#2563eb", fontWeight: 500 }}>OpenRouter + Web Search</span>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                    {backendStatus?.models.reasoning || "nex-agi/nex-n2.5-pro:free"}
                  </div>
                </div>
              </div>

              {/* Coding */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <Code size={18} color="#8b5cf6" style={{ marginTop: "2px" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Coding Model</span>
                    <span style={{ fontSize: "0.6875rem", color: "#7c3aed", fontWeight: 500 }}>Ollama Cloud</span>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                    {backendStatus?.models.coding || "gpt-oss:20b"}
                  </div>
                </div>
              </div>

              {/* Knowledge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <Database size={18} color="#f59e0b" style={{ marginTop: "2px" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Knowledge Base</span>
                    <span style={{ fontSize: "0.6875rem", color: "#d97706", fontWeight: 500 }}>Local SQLite FTS5</span>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                    {backendStatus?.knowledge_documents || 0} document chunk(s) stored in knowledge.db
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
