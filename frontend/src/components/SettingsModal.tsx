import React, { useState } from "react";
import { X, Server, Shield, Sparkles, Check, RefreshCw } from "lucide-react";
import { API_BASE_URL } from "../api/client";
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID, isAuth0Configured } from "../auth/authConfig";
import { useAppAuth } from "../auth/AuthContext";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearAllChats: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onClearAllChats,
}) => {
  const { user } = useAppAuth();
  const [apiUrl, setApiUrl] = useState(API_BASE_URL);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem("3rdroute_api_url", apiUrl);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

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
          maxWidth: "540px",
          backgroundColor: "#ffffff",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--border-subtle)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>
            Application Settings
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
            <X size={18} />
          </button>
        </div>

        {/* Settings Body */}
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Backend API Configuration */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <Server size={16} color="var(--accent-cyan)" />
              <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)" }}>
                Local Python Backend URL
              </label>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="http://localhost:8000"
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-subtle)",
                  fontSize: "0.875rem",
                  color: "var(--text-primary)",
                  backgroundColor: "#f8fafc",
                }}
              />
              <button
                onClick={handleSave}
                style={{
                  padding: "8px 14px",
                  backgroundColor: "var(--accent-cyan)",
                  color: "#ffffff",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {savedSuccess ? <Check size={14} /> : "Save"}
              </button>
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
              Configured via <code>VITE_API_BASE_URL</code>. Runs locally with <code>python server.py</code>.
            </div>
          </div>

          {/* Auth0 Authentication Status */}
          <div
            style={{
              padding: "12px 14px",
              borderRadius: "var(--radius-md)",
              backgroundColor: isAuth0Configured ? "#f0fdf4" : "#f8fafc",
              border: `1px solid ${isAuth0Configured ? "#bbf7d0" : "var(--border-subtle)"}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <Shield size={16} color={isAuth0Configured ? "#16a34a" : "var(--text-secondary)"} />
              <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)" }}>
                Auth0 Authentication Integration
              </span>
            </div>

            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              Status:{" "}
              <strong>
                {isAuth0Configured ? "Connected to Auth0" : "Local Development / Demo Mode"}
              </strong>
              <br />
              Domain: <code>{AUTH0_DOMAIN || "Not configured"}</code>
              <br />
              Client ID: <code>{AUTH0_CLIENT_ID ? `${AUTH0_CLIENT_ID.slice(0, 8)}...` : "Not configured"}</code>
            </div>
          </div>

          {/* Current User Session */}
          <div
            style={{
              padding: "12px 14px",
              borderRadius: "var(--radius-md)",
              backgroundColor: "#f8fafc",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <Sparkles size={16} color="var(--accent-cyan)" />
              <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)" }}>
                Active User Session
              </span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
              Signed in as: <strong>{user?.name || "Local User"}</strong> ({user?.email || "user@3rdroute.local"})
            </div>
          </div>

          {/* Danger Zone: Clear Chats */}
          <div style={{ paddingTop: "10px", borderTop: "1px solid var(--border-subtle)" }}>
            <button
              onClick={() => {
                if (confirm("Are you sure you want to delete all chat history?")) {
                  onClearAllChats();
                  onClose();
                }
              }}
              style={{
                fontSize: "0.8125rem",
                color: "#dc2626",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <RefreshCw size={14} />
              <span>Clear all conversation history</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
