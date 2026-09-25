import React, { useRef, useState } from "react";
import { Plus, SlidersHorizontal, Mic, MicOff, ArrowUp, X, FileText, Loader2 } from "lucide-react";
import type { MessageAttachment } from "../api/types";

interface ChatInputProps {
  onSendMessage: (text: string, attachment?: MessageAttachment) => void;
  isLoading: boolean;
  useWeb: boolean;
  onToggleWeb: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  useWeb,
  onToggleWeb,
}) => {
  const [text, setText] = useState("");
  const [attachment, setAttachment] = useState<MessageAttachment | null>(null);
  const [showSettingsPopover, setShowSettingsPopover] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const speechRecognitionRef = useRef<any>(null);

  // Auto resize textarea height
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if ((!text.trim() && !attachment) || isLoading) return;
    onSendMessage(text.trim(), attachment || undefined);
    setText("");
    setAttachment(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    if (isImage) {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachment({
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl: reader.result as string,
          file,
        });
      };
      reader.readAsDataURL(file);
    } else {
      setAttachment({
        name: file.name,
        size: file.size,
        type: file.type,
        file,
      });
    }

    // Reset input value so same file can be re-selected if needed
    e.target.value = "";
  };

  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isRecording) {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.onerror = (err: any) => {
        console.error("Speech error", err);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      speechRecognitionRef.current = recognition;
      setIsRecording(true);
    } catch (err) {
      console.error("Speech recognition could not start:", err);
      setIsRecording(false);
    }
  };

  const canSend = (text.trim().length > 0 || attachment !== null) && !isLoading;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "768px",
        margin: "0 auto",
        position: "relative",
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,.pdf"
        style={{ display: "none" }}
      />

      {/* Main Input Box Card - visually matching 1st.png */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          border: "1px solid var(--border-subtle)",
          boxShadow: "var(--shadow-input)",
          padding: "12px 16px 10px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
        onFocusCapture={(e) => {
          e.currentTarget.style.borderColor = "#94a3b8";
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.08)";
        }}
        onBlurCapture={(e) => {
          e.currentTarget.style.borderColor = "var(--border-subtle)";
          e.currentTarget.style.boxShadow = "var(--shadow-input)";
        }}
      >
        {/* Attachment Preview Chip */}
        {attachment && (
          <div
            className="animate-fade-in"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 10px",
              backgroundColor: "#f1f5f9",
              borderRadius: "12px",
              width: "fit-content",
              maxWidth: "100%",
            }}
          >
            {attachment.dataUrl ? (
              <img
                src={attachment.dataUrl}
                alt={attachment.name}
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "6px",
                  objectFit: "cover",
                }}
              />
            ) : (
              <FileText size={18} color="var(--accent-cyan)" />
            )}
            <span
              style={{
                fontSize: "0.8125rem",
                color: "var(--text-primary)",
                maxWidth: "200px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {attachment.name}
            </span>
            <button
              onClick={() => setAttachment(null)}
              style={{
                padding: "2px",
                borderRadius: "50%",
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              title="Remove attachment"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Text Input Area */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Ask 3rd-Route ..."
          rows={1}
          style={{
            width: "100%",
            resize: "none",
            maxHeight: "180px",
            fontSize: "0.9375rem",
            lineHeight: 1.5,
            color: "var(--text-primary)",
            backgroundColor: "transparent",
            border: "none",
            outline: "none",
            padding: "4px 2px",
          }}
        />

        {/* Bottom Toolbar inside card - matching 1st.png */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "4px",
          }}
        >
          {/* Left action buttons: + and settings */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Attach image or PDF document"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "#f1f5f9",
                color: "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#e2e8f0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#f1f5f9";
              }}
            >
              <Plus size={18} />
            </button>

            <button
              onClick={() => setShowSettingsPopover(!showSettingsPopover)}
              title="Router & Workbench Options"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: showSettingsPopover ? "#e2e8f0" : "#f1f5f9",
                color: showSettingsPopover ? "var(--text-primary)" : "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#e2e8f0";
              }}
              onMouseLeave={(e) => {
                if (!showSettingsPopover) {
                  e.currentTarget.style.backgroundColor = "#f1f5f9";
                }
              }}
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>

          {/* Right action buttons: microphone and circular send */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={toggleSpeechRecognition}
              title={isRecording ? "Stop voice dictation" : "Dictate query with voice"}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                color: isRecording ? "#ef4444" : "var(--text-secondary)",
                backgroundColor: isRecording ? "#fee2e2" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            {/* Circular Cyan/Sky-blue Send Button */}
            <button
              onClick={handleSubmit}
              disabled={!canSend}
              title="Send to 3rd-Route Multi-Agent pipeline"
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                backgroundColor: canSend ? "var(--accent-cyan)" : "#cbd5e1",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: canSend ? "0 2px 8px rgba(14, 165, 233, 0.35)" : "none",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (canSend) {
                  e.currentTarget.style.backgroundColor = "var(--accent-cyan-hover)";
                  e.currentTarget.style.transform = "scale(1.05)";
                }
              }}
              onMouseLeave={(e) => {
                if (canSend) {
                  e.currentTarget.style.backgroundColor = "var(--accent-cyan)";
                  e.currentTarget.style.transform = "scale(1)";
                }
              }}
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <ArrowUp size={18} strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Workbench Parameters Popover */}
      {showSettingsPopover && (
        <div
          className="animate-fade-in"
          style={{
            position: "absolute",
            bottom: "calc(100% + 10px)",
            left: 0,
            backgroundColor: "#ffffff",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-subtle)",
            boxShadow: "var(--shadow-lg)",
            padding: "14px",
            width: "280px",
            zIndex: 40,
          }}
        >
          <div
            style={{
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: "10px",
            }}
          >
            Pipeline Preferences
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "0.8125rem",
              color: "var(--text-secondary)",
              cursor: "pointer",
              padding: "6px 0",
            }}
          >
            <span>Live Web Search</span>
            <input
              type="checkbox"
              checked={useWeb}
              onChange={onToggleWeb}
              style={{ cursor: "pointer", width: "16px", height: "16px" }}
            />
          </label>

          <div
            style={{
              marginTop: "8px",
              paddingTop: "8px",
              borderTop: "1px solid var(--border-subtle)",
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              lineHeight: 1.4,
            }}
          >
            Tip: Attach an image for automatic Vision analysis, or a PDF for Knowledge Base RAG.
          </div>
        </div>
      )}
    </div>
  );
};
