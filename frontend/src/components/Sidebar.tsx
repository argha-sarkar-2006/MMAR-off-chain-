import React, { useState } from "react";
import {
  MessageSquarePlus,
  FolderPlus,
  Search,
  LayoutGrid,
  Settings,
  Folder,
  Trash2,
  LogOut,
  User as UserIcon,
  Database,
  PanelLeftClose,
} from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import type { ConversationSession } from "../api/types";
import { useAppAuth } from "../auth/AuthContext";

interface SidebarProps {
  conversations: ConversationSession[];
  activeId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  onOpenHub: () => void;
  onOpenSettings: () => void;
  onOpenKnowledge: () => void;
  isOpen: boolean;
  onToggleSidebar: () => void;
  projects?: string[];
  activeProject?: string | null;
  onSelectProject?: (project: string | null) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onOpenHub,
  onOpenSettings,
  onOpenKnowledge,
  isOpen,
  onToggleSidebar,
  projects = ["Studies", "Work"],
  activeProject = null,
  onSelectProject,
}) => {
  const { user, logout } = useAppAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Platform specific shortcut modifier (⌘ on Mac, Ctrl on Windows)
  const isMac = typeof window !== "undefined" && navigator.platform.toUpperCase().includes("MAC");
  const modKey = isMac ? "⌘" : "Ctrl+";

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside
      style={{
        width: isOpen ? "260px" : "0px",
        minWidth: isOpen ? "260px" : "0px",
        height: "100%",
        backgroundColor: "var(--bg-sidebar)",
        borderRight: isOpen ? "1px solid var(--sidebar-border)" : "none",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.25s cubic-bezier(0.16, 1, 0.3, 1), min-width 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        overflow: "hidden",
        position: "relative",
        userSelect: "none",
      }}
    >
      {/* Sidebar Header: Brand Logo aligned with Collapse Sidebar button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 14px 14px 16px",
          gap: "8px",
        }}
      >
        <BrandLogo size="md" subtitle="Sovereign Workbench" />

        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            title="Collapse sidebar"
            style={{
              padding: "6px",
              borderRadius: "6px",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--sidebar-hover)";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            <PanelLeftClose size={18} />
          </button>
        )}
      </div>

      {/* Main Navigation Actions matching 1st.png */}
      <div style={{ padding: "0 12px 14px 12px", display: "flex", flexDirection: "column", gap: "2px" }}>
        {/* New Chat */}
        <button
          onClick={onNewChat}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 10px",
            borderRadius: "var(--radius-md)",
            color: "var(--text-primary)",
            fontSize: "0.875rem",
            fontWeight: 500,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--sidebar-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <MessageSquarePlus size={16} color="var(--text-secondary)" />
            <span>New chat</span>
          </div>
          <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)", fontWeight: 500 }}>
            {modKey}N
          </span>
        </button>

        {/* New Project */}
        <button
          onClick={() => {
            const name = prompt("Enter new project folder name:");
            if (name && onSelectProject) onSelectProject(name);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 10px",
            borderRadius: "var(--radius-md)",
            color: "var(--text-primary)",
            fontSize: "0.875rem",
            fontWeight: 500,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--sidebar-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FolderPlus size={16} color="var(--text-secondary)" />
            <span>New project</span>
          </div>
          <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)", fontWeight: 500 }}>
            {modKey}P
          </span>
        </button>

        {/* Search */}
        <button
          onClick={() => setIsSearching(!isSearching)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 10px",
            borderRadius: "var(--radius-md)",
            color: "var(--text-primary)",
            fontSize: "0.875rem",
            fontWeight: 500,
            backgroundColor: isSearching ? "var(--sidebar-hover)" : "transparent",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--sidebar-hover)")}
          onMouseLeave={(e) => {
            if (!isSearching) e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Search size={16} color="var(--text-secondary)" />
            <span>Search</span>
          </div>
          <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)", fontWeight: 500 }}>
            {modKey}K
          </span>
        </button>

        {/* Search Bar Input (when open) */}
        {isSearching && (
          <div style={{ padding: "4px 8px 8px" }}>
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
              style={{
                width: "100%",
                padding: "6px 10px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "#ffffff",
                border: "1px solid var(--sidebar-border)",
                fontSize: "0.8125rem",
                color: "var(--text-primary)",
              }}
            />
          </div>
        )}

        {/* Hub */}
        <button
          onClick={onOpenHub}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 10px",
            borderRadius: "var(--radius-md)",
            color: "var(--text-primary)",
            fontSize: "0.875rem",
            fontWeight: 500,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--sidebar-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <LayoutGrid size={16} color="var(--text-secondary)" />
          <span>Hub</span>
        </button>

        {/* Knowledge Base */}
        <button
          onClick={onOpenKnowledge}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 10px",
            borderRadius: "var(--radius-md)",
            color: "var(--text-primary)",
            fontSize: "0.875rem",
            fontWeight: 500,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--sidebar-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <Database size={16} color="var(--text-secondary)" />
          <span>Knowledge Base</span>
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 10px",
            borderRadius: "var(--radius-md)",
            color: "var(--text-primary)",
            fontSize: "0.875rem",
            fontWeight: 500,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--sidebar-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <Settings size={16} color="var(--text-secondary)" />
          <span>Settings</span>
        </button>
      </div>

      {/* Projects Section matching 1st.png */}
      <div style={{ padding: "0 14px 6px 14px" }}>
        <div
          style={{
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "var(--text-muted)",
            textTransform: "capitalize",
            marginBottom: "6px",
          }}
        >
          Projects
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {projects.map((proj) => {
            const isSelected = activeProject === proj;
            return (
              <button
                key={proj}
                onClick={() => onSelectProject && onSelectProject(isSelected ? null : proj)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "6px 8px",
                  borderRadius: "var(--radius-md)",
                  color: isSelected ? "var(--accent-cyan-hover)" : "var(--text-primary)",
                  backgroundColor: isSelected ? "var(--sidebar-active)" : "transparent",
                  fontSize: "0.8125rem",
                  fontWeight: isSelected ? 600 : 400,
                  textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = "var(--sidebar-hover)";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <Folder size={15} color={isSelected ? "var(--accent-cyan)" : "var(--text-secondary)"} />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {proj}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chats History Section matching 1st.png */}
      <div
        style={{
          flex: 1,
          padding: "10px 14px 10px 14px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "var(--text-muted)",
            textTransform: "capitalize",
            marginBottom: "6px",
          }}
        >
          Chats
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {filteredConversations.length === 0 ? (
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", padding: "8px 6px" }}>
              No chats yet. Start a new one!
            </div>
          ) : (
            filteredConversations.map((chat) => {
              const isActive = chat.id === activeId;
              return (
                <div
                  key={chat.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "6px 8px",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: isActive ? "var(--sidebar-active)" : "transparent",
                    color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                    cursor: "pointer",
                    fontSize: "0.8125rem",
                    fontWeight: isActive ? 600 : 400,
                  }}
                  onClick={() => onSelectChat(chat.id)}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = "var(--sidebar-hover)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      flex: 1,
                    }}
                    title={chat.title}
                  >
                    {chat.title}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(chat.id);
                    }}
                    style={{
                      padding: "2px 4px",
                      borderRadius: "4px",
                      color: "var(--text-muted)",
                      opacity: isActive ? 1 : 0.4,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "1";
                      e.currentTarget.style.color = "#ef4444";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = isActive ? "1" : "0.4";
                      e.currentTarget.style.color = "var(--text-muted)";
                    }}
                    title="Delete chat"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* User Account / Profile Area at Bottom */}
      <div
        style={{
          padding: "12px 14px",
          borderTop: "1px solid var(--sidebar-border)",
          backgroundColor: "rgba(255, 255, 255, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
          {user?.picture ? (
            <img
              src={user.picture}
              alt={user.name || "User"}
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                backgroundColor: "var(--sidebar-active)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-secondary)",
              }}
            >
              <UserIcon size={16} />
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
            <span
              style={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--text-primary)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user?.name || "Local User"}
            </span>
            <span
              style={{
                fontSize: "0.6875rem",
                color: "var(--text-muted)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user?.email || "3rd-Route Local"}
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          title="Log out"
          style={{
            padding: "6px",
            borderRadius: "6px",
            color: "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--sidebar-hover)";
            e.currentTarget.style.color = "#dc2626";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "var(--text-secondary)";
          }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};
