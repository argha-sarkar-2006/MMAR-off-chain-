import React, { useState } from "react";
import { X, Upload, Search, Database, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { apiClient } from "../api/client";
import type { KnowledgeDocument } from "../api/types";
import { useAppAuth } from "../auth/AuthContext";

interface KnowledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentCount: number;
  onRefreshCount: () => void;
}

export const KnowledgeModal: React.FC<KnowledgeModalProps> = ({
  isOpen,
  onClose,
  documentCount,
  onRefreshCount,
}) => {
  const { getAccessToken, user } = useAppAuth();
  const currentUserId = user?.sub || user?.email || null;
  const [activeTab, setActiveTab] = useState<"search" | "ingest">("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<KnowledgeDocument[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Ingest state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customTitle, setCustomTitle] = useState("");
  const [isIngesting, setIsIngesting] = useState(false);
  const [ingestSuccess, setIngestSuccess] = useState<string | null>(null);
  const [ingestError, setIngestError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    try {
      const token = await getAccessToken();
      const res = await apiClient.searchKnowledge(searchQuery.trim(), 5, token, currentUserId);
      setSearchResults(res.hits);
      if (res.hits.length === 0) {
        setSearchError("No matching documents found in your account's SQLite FTS5 index.");
      }
    } catch (err: any) {
      setSearchError(err.message || "Failed to search knowledge base.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsIngesting(true);
    setIngestSuccess(null);
    setIngestError(null);

    try {
      const token = await getAccessToken();
      const res = await apiClient.ingestDocument(selectedFile, customTitle || undefined, token, currentUserId);
      setIngestSuccess(
        `Successfully ingested "${res.filename}" into your account. Created and stored ${res.chunks_stored} chunk(s).`
      );
      setSelectedFile(null);
      setCustomTitle("");
      onRefreshCount();
    } catch (err: any) {
      setIngestError(err.message || "Failed to ingest PDF.");
    } finally {
      setIsIngesting(false);
    }
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
          maxWidth: "600px",
          backgroundColor: "#ffffff",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--border-subtle)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          maxHeight: "85vh",
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
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                backgroundColor: "#fef3c7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#d97706",
              }}
            >
              <Database size={18} />
            </div>
            <div>
              <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-primary)" }}>
                Local Knowledge Base (SQLite FTS5)
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {documentCount} document chunk(s) indexed for {user?.name || user?.email || "this account"}
              </div>
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
            <X size={18} />
          </button>
        </div>

        {/* Tab Controls */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid var(--border-subtle)",
            padding: "0 20px",
            backgroundColor: "#f8fafc",
          }}
        >
          <button
            onClick={() => setActiveTab("search")}
            style={{
              padding: "10px 16px",
              fontSize: "0.8125rem",
              fontWeight: activeTab === "search" ? 600 : 500,
              color: activeTab === "search" ? "var(--accent-cyan)" : "var(--text-secondary)",
              borderBottom: activeTab === "search" ? "2px solid var(--accent-cyan)" : "2px solid transparent",
            }}
          >
            Search Documents
          </button>
          <button
            onClick={() => setActiveTab("ingest")}
            style={{
              padding: "10px 16px",
              fontSize: "0.8125rem",
              fontWeight: activeTab === "ingest" ? 600 : 500,
              color: activeTab === "ingest" ? "var(--accent-cyan)" : "var(--text-secondary)",
              borderBottom: activeTab === "ingest" ? "2px solid var(--accent-cyan)" : "2px solid transparent",
            }}
          >
            Ingest New PDF
          </button>
        </div>

        {/* Content Area */}
        <div style={{ padding: "20px", overflowY: "auto", flex: 1 }}>
          {activeTab === "search" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <form onSubmit={handleSearch} style={{ display: "flex", gap: "8px" }}>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 12px",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "#f8fafc",
                  }}
                >
                  <Search size={16} color="var(--text-muted)" />
                  <input
                    type="text"
                    placeholder="Search indexed knowledge..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: "100%",
                      backgroundColor: "transparent",
                      border: "none",
                      fontSize: "0.875rem",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearching || !searchQuery.trim()}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "var(--accent-cyan)",
                    color: "#ffffff",
                    borderRadius: "var(--radius-md)",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {isSearching ? <Loader2 size={16} className="animate-spin" /> : "Search"}
                </button>
              </form>

              {searchError && (
                <div
                  style={{
                    padding: "10px 14px",
                    backgroundColor: "#fffbeb",
                    border: "1px solid #fef3c7",
                    borderRadius: "var(--radius-md)",
                    fontSize: "0.8125rem",
                    color: "#92400e",
                  }}
                >
                  {searchError}
                </div>
              )}

              {searchResults.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)" }}>
                    Found {searchResults.length} Match(es):
                  </div>
                  {searchResults.map((hit) => (
                    <div
                      key={hit.id}
                      style={{
                        padding: "12px",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border-subtle)",
                        backgroundColor: "#ffffff",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.8125rem",
                          fontWeight: 600,
                          color: "var(--text-primary)",
                          marginBottom: "4px",
                        }}
                      >
                        {hit.title}
                      </div>
                      <div
                        style={{
                          fontSize: "0.6875rem",
                          color: "var(--text-muted)",
                          marginBottom: "8px",
                        }}
                      >
                        Source: {hit.source}
                      </div>
                      <div
                        style={{
                          fontSize: "0.8125rem",
                          color: "var(--text-secondary)",
                          lineHeight: 1.4,
                          maxHeight: "120px",
                          overflowY: "auto",
                          backgroundColor: "#f8fafc",
                          padding: "8px",
                          borderRadius: "6px",
                        }}
                      >
                        {hit.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleIngest} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div
                style={{
                  border: "2px dashed #cbd5e1",
                  borderRadius: "var(--radius-lg)",
                  padding: "28px 20px",
                  textAlign: "center",
                  backgroundColor: "#f8fafc",
                  cursor: "pointer",
                }}
                onClick={() => document.getElementById("pdf-upload-input")?.click()}
              >
                <input
                  id="pdf-upload-input"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  style={{ display: "none" }}
                />
                <Upload size={32} color="var(--accent-cyan)" style={{ margin: "0 auto 10px" }} />
                <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>
                  {selectedFile ? selectedFile.name : "Click to select a PDF document"}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
                  PDF will be extracted via PyMuPDF with Tesseract OCR fallback and indexed in SQLite FTS5
                </div>
              </div>

              {selectedFile && (
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "var(--text-secondary)",
                      marginBottom: "6px",
                    }}
                  >
                    Custom Document Title (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder={selectedFile.name}
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-subtle)",
                      fontSize: "0.875rem",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>
              )}

              {ingestSuccess && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 14px",
                    backgroundColor: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: "var(--radius-md)",
                    fontSize: "0.8125rem",
                    color: "#166534",
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>{ingestSuccess}</span>
                </div>
              )}

              {ingestError && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 14px",
                    backgroundColor: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: "var(--radius-md)",
                    fontSize: "0.8125rem",
                    color: "#991b1b",
                  }}
                >
                  <AlertCircle size={16} />
                  <span>{ingestError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!selectedFile || isIngesting}
                style={{
                  padding: "10px 16px",
                  backgroundColor: "var(--accent-cyan)",
                  color: "#ffffff",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  marginTop: "8px",
                }}
              >
                {isIngesting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Extracting & Ingesting PDF...</span>
                  </>
                ) : (
                  <>
                    <FileText size={16} />
                    <span>Ingest Document into Knowledge Base</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
