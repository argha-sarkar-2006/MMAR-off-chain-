import React, { useState, useRef, useEffect } from "react";
import { ChevronsUpDown, Cpu, Eye, Code, Brain, Database, CheckCircle2, AlertCircle } from "lucide-react";
import type { BackendStatus } from "../api/types";

interface ModelSelectorProps {
  backendStatus: BackendStatus | null;
  isConnected: boolean;
  onOpenHub?: () => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  backendStatus,
  isConnected,
  onOpenHub,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 14px",
          backgroundColor: "#ffffff",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-full)",
          fontSize: "0.875rem",
          fontWeight: 500,
          color: "var(--text-primary)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#cbd5e1";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border-subtle)";
        }}
      >
        <span style={{ fontSize: "1rem" }}>⚡</span>
        <span>3rd-Route Multi-Agent</span>
        <ChevronsUpDown size={14} color="var(--text-muted)" />
      </button>

      {isOpen && (
        <div
          className="animate-fade-in"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            width: "320px",
            backgroundColor: "#ffffff",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-subtle)",
            boxShadow: "var(--shadow-lg)",
            padding: "8px",
            zIndex: 50,
          }}
        >
          <div
            style={{
              padding: "8px 12px 10px",
              borderBottom: "1px solid var(--border-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Cpu size={16} color="var(--accent-cyan)" />
              <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)" }}>
                Active Routing Engine
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              {isConnected ? (
                <>
                  <CheckCircle2 size={12} color="#10b981" />
                  <span style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 500 }}>
                    Backend Online
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle size={12} color="#f59e0b" />
                  <span style={{ fontSize: "0.75rem", color: "#f59e0b", fontWeight: 500 }}>
                    Offline
                  </span>
                </>
              )}
            </div>
          </div>

          <div style={{ padding: "8px 0" }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                padding: "8px 12px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--accent-cyan-light)",
              }}
            >
              <Cpu size={16} color="var(--accent-cyan)" style={{ marginTop: "2px", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)" }}>
                  Needle Router (Local)
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                  Dynamic text classifier & task dispatch
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                padding: "8px 12px",
                borderRadius: "var(--radius-md)",
              }}
            >
              <Eye size={16} color="#10b981" style={{ marginTop: "2px", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)" }}>
                  Vision Stage
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", wordBreak: "break-all" }}>
                  {backendStatus?.models.vision[0] || "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free"}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                padding: "8px 12px",
                borderRadius: "var(--radius-md)",
              }}
            >
              <Brain size={16} color="#3b82f6" style={{ marginTop: "2px", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)" }}>
                  Reasoning & Web Search
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                  {backendStatus?.models.reasoning || "nex-agi/nex-n2.5-pro:free"}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                padding: "8px 12px",
                borderRadius: "var(--radius-md)",
              }}
            >
              <Code size={16} color="#8b5cf6" style={{ marginTop: "2px", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)" }}>
                  Coding Stage
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                  {backendStatus?.models.coding || "gpt-oss:20b (Ollama Cloud)"}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                padding: "8px 12px",
                borderRadius: "var(--radius-md)",
              }}
            >
              <Database size={16} color="#f59e0b" style={{ marginTop: "2px", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)" }}>
                  Local Knowledge Base
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                  {backendStatus ? `${backendStatus.knowledge_documents} document chunks indexed` : "SQLite FTS5"}
                </div>
              </div>
            </div>
          </div>

          {onOpenHub && (
            <div
              style={{
                borderTop: "1px solid var(--border-subtle)",
                paddingTop: "6px",
              }}
            >
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenHub();
                }}
                style={{
                  width: "100%",
                  textAlign: "center",
                  padding: "6px",
                  fontSize: "0.8125rem",
                  color: "var(--accent-cyan)",
                  fontWeight: 500,
                  borderRadius: "var(--radius-md)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--accent-cyan-light)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                View Pipeline Architecture & Models →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
